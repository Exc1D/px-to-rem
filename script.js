const BASE_FONT_SIZE = 16;
let isPxToRem = true;

const input = document.getElementById("px-input");
const output = document.getElementById("rem-output");
const button = document.querySelector("button");
const label = document.querySelector('label[for="px-input"]');
const heading = document.querySelector("h1");

function roundToNearestFiveOrZero(value) {
  const integerPart = Math.floor(value);
  const decimalPart = value - integerPart;
  const rounded = Math.round(decimalPart * 20) / 20;
  return integerPart + rounded;
}

function convertPxToRem(px) {
  return roundToNearestFiveOrZero(px / BASE_FONT_SIZE);
}

function convertRemToPx(rem) {
  return roundToNearestFiveOrZero(rem * BASE_FONT_SIZE);
}

async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

function handleConvert() {
  const value = parseFloat(input.value);
  if (isNaN(value)) return;

  const result = isPxToRem ? convertPxToRem(value) : convertRemToPx(value);
  output.value = result;
  copyToClipboard(result.toString());
}

function toggleConversionMode() {
  isPxToRem = !isPxToRem;
  heading.textContent = isPxToRem ? "Convert px to rem" : "Convert rem to px";
  label.textContent = isPxToRem ? "Enter Value in px" : "Enter Value in rem";
  input.value = "";
  output.value = "";
}

function handleInputFocus() {
  label.classList.add("active");
}

function handleInputBlur() {
  if (!input.value) {
    label.classList.remove("active");
  }
}

button.addEventListener("click", handleConvert);
input.addEventListener("focus", handleInputFocus);
input.addEventListener("blur", handleInputBlur);
input.addEventListener("input", () => {
  if (input.value) label.classList.add("active");
});
heading.addEventListener("click", toggleConversionMode);

//const input = document.getElementById("px-input");
// const output = document.getElementById("rem-output");
// const button = document.querySelector("button");

// button.addEventListener("click", () => {
//   const px = parseFloat(input.value);
//   if (isNaN(px)) return;

//   const rem = Math.round(px / 16 * 20) / 20;
//   output.value = rem;
//   navigator.clipboard.writeText(rem);
// });
