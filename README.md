# 🎲 Roll the Dice

A visually rich, interactive two-dice roller built with pure HTML, CSS, and JavaScript. Features fully 3D animated cubes with correct pip layouts, particle effects on landing, and keyboard support.

🔗 **Live Demo:** [https://vaibh31.github.io/Rolling-dice/](https://vaibh31.github.io/Rolling-dice/)

---

## Preview

- Dark space-themed background with a subtle grid overlay and star-like particles
- Two 3D CSS cubes that float, spin, and land on the correct face for each roll result
- Yellow glowing pips, flash animations, and a particle burst on every roll
- Live total sum display beneath the dice

---

## Features

- **3D Dice Animation** — Each die performs a multi-axis spin before landing on the correct face using pre-mapped rotation values for all six outcomes
- **Per-die Rolling** — Click either die individually to roll just that one
- **Roll Both** — Roll both dice simultaneously with a slight stagger between them
- **Accurate Pip Faces** — All six faces of each cube are rendered with the correct pip layout using a 3×3 CSS grid
- **Idle Float Animation** — Dice gently bob when idle; after a roll they lock to the landed orientation and continue floating from that position
- **Particle Burst** — A burst of 10 glowing yellow particles erupts from the die's position on every landing
- **Live Sum Display** — Total of both dice is shown with a flash animation after each roll completes
- **Reset** — Returns both dice to default idle state and clears all values
- **Keyboard Shortcuts** — `Space` or `Enter` to roll both; `R` to reset

---

## File Structure

    Rolling-dice/
    ├── index.html   # Main application — HTML + CSS
    ├── script.js    # All game logic and animations
    └── README.md

---


## Usage

| Action | How |
|---|---|
| Roll a single die | Click on it |
| Roll both dice | Click **Roll Both** button |
| Roll both dice | Press `Space` or `Enter` |
| Reset everything | Click **Reset** button |
| Reset everything | Press `R` |

---

## How It Works

### 3D Cube Rendering

Each die is built from six `.face` elements (`face-front`, `face-back`, `face-right`, `face-left`, `face-top`, `face-bottom`) positioned using `translateZ` and `rotateX/Y` transforms inside a `transform-style: preserve-3d` container.

### Face Orientation Map

A `faceOrientations` lookup table maps each roll result (1–6) to a pair of `rotateX` / `rotateY` values that bring the correct face to the front:

```js
const faceOrientations = {
  1: { rx: -20,  ry: 30  },
  2: { rx: -110, ry: 30  },
  3: { rx: -20,  ry: -60 },
  4: { rx: -20,  ry: 120 },
  5: { rx: 70,   ry: 30  },
  6: { rx: -20,  ry: 210 },
};
```

### Animation Sequence

1. **Rolling** (`0.6s`) — Multi-axis tumble using CSS `@keyframes rolling`, ending at the target orientation stored in CSS custom properties `--final-rx` / `--final-ry`
2. **Landing** (`0.4s`) — A bounce squash-and-stretch settling the die into its final orientation
3. **Result reveal** — The numeric result fades in with a scale pop and a glow flash
4. **Idle lock** — The die resumes floating animation from its landed orientation using `--idle-rx` / `--idle-ry` CSS variables

### Particle Effect

On each landing, `spawnParticles()` creates 10 absolutely-positioned `div.particle` elements, animates them outward in a radial burst using the Web Animations API, then removes them on completion.

---

## Customisation

| What | Where |
|---|---|
| Accent color | `--accent` CSS variable (default `#f0e040`) |
| Background color | `--bg` CSS variable (default `#0a0a12`) |
| Cube size | `.scene` and `.face` `width`/`height` (default `150px`) |
| Number of particles | `for (let i = 0; i < 10; i++)` in `spawnParticles()` |
| Roll animation duration | `rolling` keyframe duration and `setTimeout` offsets in `animateDie()` |

---

## Browser Compatibility

Works in all modern browsers that support CSS 3D transforms, CSS custom properties, and the Web Animations API (Chrome 36+, Firefox 48+, Safari 13.1+, Edge 79+).

---

## License

MIT — free to use, modify, and distribute.
