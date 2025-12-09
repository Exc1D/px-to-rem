// Constants
const DEFAULT_BASE_FONT_SIZE = 16;
const ROUNDING_PRECISION = 20; // 1/20 = 0.05
const COPY_FEEDBACK_DURATION = 2000; // 2 seconds
const COPY_DELAY = 800; // 800ms delay before auto-copy
const COMMON_PRESETS = [8, 16, 24, 32, 48, 64];

// State
let isPxToRem = true;
let baseFontSize = DEFAULT_BASE_FONT_SIZE;
let copyTimeout = null; // For debouncing auto-copy

// DOM Elements - will be initialized after DOM loads
let elements = {};

// Conversion Functions
// Rounds to nearest 0.05 (e.g., 1.47 → 1.45, 1.48 → 1.50)
function roundToNearestFiveOrZero(value) {
  const integerPart = Math.floor(value);
  const decimalPart = value - integerPart;
  const rounded =
    Math.round(decimalPart * ROUNDING_PRECISION) / ROUNDING_PRECISION;
  return integerPart + rounded;
}

function convertPxToRem(px) {
  return roundToNearestFiveOrZero(px / baseFontSize);
}

function convertRemToPx(rem) {
  return roundToNearestFiveOrZero(rem * baseFontSize);
}

// Clipboard Functions
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showCopyFeedback(true);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    showCopyFeedback(false);
    return false;
  }
}

function showCopyFeedback(success) {
  if (!elements.copyFeedback) return;

  elements.copyFeedback.textContent = success ? "✓ Copied!" : "✗ Copy failed";
  elements.copyFeedback.className = success
    ? "copy-feedback success"
    : "copy-feedback error";
  elements.copyFeedback.classList.add("show");

  setTimeout(() => {
    elements.copyFeedback.classList.remove("show");
  }, COPY_FEEDBACK_DURATION);
}

// Conversion Handler
async function handleConvert(shouldCopy = true) {
  const value = parseFloat(elements.input.value);

  // Validation
  if (isNaN(value)) {
    elements.input.classList.add("error");
    elements.output.value = "";
    return;
  }

  elements.input.classList.remove("error");

  // Convert
  const result = isPxToRem ? convertPxToRem(value) : convertRemToPx(value);
  elements.output.value = result;

  // Copy to clipboard only if explicitly requested
  if (shouldCopy) {
    await copyToClipboard(result.toString());
  }
}

// Mode Toggle
function toggleConversionMode() {
  isPxToRem = !isPxToRem;

  // Update UI text
  elements.heading.textContent = isPxToRem
    ? "Convert px to rem"
    : "Convert rem to px";
  elements.label.textContent = isPxToRem
    ? "Enter Value in px"
    : "Enter Value in rem";
  elements.input.placeholder = isPxToRem ? "e.g., 16" : "e.g., 1";

  // Clear inputs
  elements.input.value = "";
  elements.output.value = "";
  elements.input.classList.remove("error");

  // Update label state
  if (!elements.input.value) {
    elements.label.classList.remove("active");
  }
}

// Base Font Size Handler
function handleBaseFontChange() {
  const newSize = parseFloat(elements.baseFontInput.value);

  if (isNaN(newSize) || newSize <= 0) {
    elements.baseFontInput.value = baseFontSize;
    return;
  }

  baseFontSize = newSize;

  // Re-convert if there's a value
  if (elements.input.value) {
    handleConvert();
  }
}

// Clear Handler
function handleClear() {
  elements.input.value = "";
  elements.output.value = "";
  elements.input.classList.remove("error");
  elements.label.classList.remove("active");
  elements.input.focus();
}

// Preset Handler
function handlePresetClick(value) {
  elements.input.value = value;
  elements.label.classList.add("active");
  handleConvert(true); // Copy immediately for presets
}

// Focus Handlers
function handleInputFocus() {
  elements.label.classList.add("active");
}

function handleInputBlur() {
  if (!elements.input.value) {
    elements.label.classList.remove("active");
  }
}

// Keyboard Shortcut Handler
function handleKeyboardShortcuts(e) {
  // Ctrl/Cmd + K to toggle mode
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    toggleConversionMode();
  }

  // Escape to clear
  if (e.key === "Escape") {
    handleClear();
  }
}

// Batch Conversion Handler
function handleBatchConversion() {
  const text = elements.batchInput.value.trim();
  if (!text) {
    elements.batchOutput.value = "";
    return;
  }

  // Extract numbers from text (handles "16px", "1.5rem", "24", etc.)
  const numbers = text.match(/[\d.]+/g);
  if (!numbers) {
    elements.batchOutput.value = "No valid numbers found";
    return;
  }

  const results = numbers
    .map((num) => {
      const value = parseFloat(num);
      if (isNaN(value)) return null;

      const result = isPxToRem ? convertPxToRem(value) : convertRemToPx(value);
      const inputUnit = isPxToRem ? "px" : "rem";
      const outputUnit = isPxToRem ? "rem" : "px";

      return `${value}${inputUnit} → ${result}${outputUnit}`;
    })
    .filter(Boolean);

  elements.batchOutput.value = results.join("\n");
}

// Dark Mode Handler
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");

  try {
    localStorage.setItem("darkMode", isDark);
  } catch (error) {
    console.error("Failed to save dark mode preference:", error);
  }
}

function loadDarkModePreference() {
  try {
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
      document.body.classList.add("dark-mode");
    }
  } catch (error) {
    console.error("Failed to load dark mode preference:", error);
  }
}

// Create Preset Buttons
function createPresetButtons() {
  if (!elements.presetsContainer) return;

  elements.presetsContainer.innerHTML = COMMON_PRESETS.map(
    (value) =>
      `<button class="preset-btn" data-value="${value}">${value}</button>`
  ).join("");

  // Add event listeners to preset buttons
  elements.presetsContainer.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      handlePresetClick(btn.dataset.value);
    });
  });
}

// Initialize Elements
function initializeElements() {
  // Check if required elements exist
  const requiredElements = {
    input: document.getElementById("px-input"),
    output: document.getElementById("rem-output"),
    button: document.getElementById("convert-btn"),
    label: document.querySelector('label[for="px-input"]'),
    heading: document.querySelector("h1"),
  };

  // Verify all required elements exist
  for (const [key, element] of Object.entries(requiredElements)) {
    if (!element) {
      console.error(`Required element not found: ${key}`);
      return false;
    }
  }

  // Store all elements
  elements = {
    ...requiredElements,
    clearBtn: document.getElementById("clear-btn"),
    baseFontInput: document.getElementById("base-font"),
    copyFeedback: document.getElementById("copy-feedback"),
    presetsContainer: document.getElementById("presets"),
    batchInput: document.getElementById("batch-input"),
    batchOutput: document.getElementById("batch-output"),
    darkModeToggle: document.getElementById("dark-mode-toggle"),
  };

  return true;
}

// Event Listeners Setup
function setupEventListeners() {
  // Main conversion - with copy
  elements.button.addEventListener("click", () => handleConvert(true));

  // Input events
  elements.input.addEventListener("focus", handleInputFocus);
  elements.input.addEventListener("blur", handleInputBlur);
  elements.input.addEventListener("input", () => {
    if (elements.input.value) {
      elements.label.classList.add("active");

      // Clear existing timeout
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }

      // Convert immediately but don't copy
      handleConvert(false);

      // Schedule delayed copy
      copyTimeout = setTimeout(() => {
        if (elements.input.value) {
          copyToClipboard(elements.output.value);
        }
      }, COPY_DELAY);
    } else {
      elements.output.value = "";
      // Clear timeout if input is empty
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
    }
  });

  // Enter key to convert - with copy
  elements.input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      // Clear the delayed copy timeout
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
      handleConvert(true);
    }
  });

  // Mode toggle
  elements.heading.addEventListener("click", toggleConversionMode);

  // Clear button
  if (elements.clearBtn) {
    elements.clearBtn.addEventListener("click", handleClear);
  }

  // Base font size
  if (elements.baseFontInput) {
    elements.baseFontInput.addEventListener("change", handleBaseFontChange);
    elements.baseFontInput.value = baseFontSize;
  }

  // Batch conversion
  if (elements.batchInput) {
    elements.batchInput.addEventListener("input", handleBatchConversion);
  }

  // Dark mode
  if (elements.darkModeToggle) {
    elements.darkModeToggle.addEventListener("click", toggleDarkMode);
  }

  // Global keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);

  // Add hint for toggle functionality
  if (elements.heading) {
    elements.heading.title = "Click to toggle conversion direction";
  }
}

// Initialize App
function initializeApp() {
  // Load dark mode preference
  loadDarkModePreference();

  // Initialize DOM elements
  if (!initializeElements()) {
    console.error("Failed to initialize: Missing required elements");
    return;
  }

  // Setup event listeners
  setupEventListeners();

  // Create preset buttons
  createPresetButtons();

  // Focus input
  elements.input.focus();

  console.log("Converter initialized successfully");
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
