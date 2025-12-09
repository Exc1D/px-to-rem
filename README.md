# PX ⇄ REM Converter

A polished, fully interactive, browser-based unit converter that converts **px ⇄ rem** with smart rounding, live updates, batch processing, presets, dark mode, and automatic clipboard copying.

This tool is ideal for designers and developers who want a fast, accurate, and ergonomic workflow when working with responsive CSS values.

---

## 🎯 Features

### 🔄 PX ⇄ REM Bidirectional Conversion

* Instantly convert **px → rem** or **rem → px**
* Click the title or press `Ctrl+K` to toggle direction
* UI updates automatically to reflect the active mode

### 🎯 Smart Rounding (Nearest 0.05)

Your converter includes a custom rounding engine:

```
1.47 → 1.45  
1.48 → 1.50
```

Uses a precision step of `1/20`.

### ⚡ Live Conversion + Delayed Auto-Copy

* Converts as you type
* Waits **800ms**, then automatically copies to the clipboard
* Manual “Convert & Copy” button always triggers immediate copy

### 📋 Clipboard Feedback

Top-right toast shows:

* **✓ Copied!**
* **✗ Copy failed**

With smooth animation and auto-hide.

### 🎛 Base Font Size Control

Change the base font for rem conversion:

```
1rem = baseFontSize px
```

✓ Input validation
✓ Auto-recalculation of current input

### 🎚 Presets (Common Values)

Includes quick buttons for:

```
8, 16, 24, 32, 48, 64
```

Click to instantly convert & copy.

### 📦 Batch Conversion Mode

Paste any text containing numbers:

```
16px something 1.5rem padding: 24px;
```

Output becomes:

```
16px → 1rem
1.5rem → 24px
24px → 1.5rem
```

Extracts numbers via regex and processes them all.

### 🌙 Dark Mode with Saved Preference

* Toggle with the floating button
* Saves theme to `localStorage`
* Restores on reload
* Full CSS variable theme system

### 🎹 Keyboard Shortcuts

| Key          | Action                     |
| ------------ | -------------------------- |
| **Ctrl + K** | Toggle px/rem mode         |
| **Escape**   | Clear input                |
| **Enter**    | Convert & copy immediately |

### 🧼 Clear Button

Resets all fields and states.

---

## 🧱 Project Structure

```
px-to-rem/
├── index.html      → UI markup
├── styles.css      → Theming, layout, animations, responsive design
└── script.js       → Logic, events, conversions, state management
```

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/Exc1D/px-to-rem.git
cd px-to-rem
```

Run it by simply opening:

```
index.html
```

No build tools. No dependencies. No frameworks.

---

## 🧠 Conversion Logic

### Formula

**px → rem**

```
rem = (px / baseFontSize)
```

**rem → px**

```
px = (rem * baseFontSize)
```

### Rounding

Your code rounds to the nearest **0.05**, achieved via:

```js
ROUNDING_PRECISION = 20
```

Computed as:

```
Math.round(value * 20) / 20
```

---

## 🔍 Important Behaviors

### Auto-label animation

* Floating label moves up when input is focused or has content

### Error state

* Invalid numbers shake the input
* Conversion is skipped

### Auto-focus

* Input field is automatically focused on load

### Copy debounce

* Conversion happens immediately
* Copy happens after a delay unless triggered manually

---

## 🧩 Developer Notes

### DOM initialization safety

Your script verifies that all required elements exist before running.

### Event-driven Architecture

Everything is controlled through:

* conversion handlers
* mode togglers
* font-size input handlers
* batch handlers
* accessibility & keyboard interactions

### Theming System

CSS variables power both light and dark themes.

---

## 🗺 Roadmap / Potential Enhancements

Here are improvements aligned with your existing architecture:

* 🌈 Add custom color themes
* 🌐 Deploy to GitHub Pages
* 📦 Add “Export results” for batch mode (txt/json)
* 📋 Add a clipboard history dropdown
* 📦 Add SASS version of the CSS
* 🧮 Allow custom rounding increments (0.01, 0.1, 0.25)
* 💡 Add a tooltip hover on labels explaining rem usage
* 🎛 Add toggle to disable auto-copy

---

## 📝 License

MIT — you own everything, use freely.

---

## ❤️ Credits

Built by **Exc1D**
Designed for speed, clarity, and a smooth developer workflow.
