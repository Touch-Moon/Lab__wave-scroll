# Lab — Scroll becomes water

Scroll velocity drives a post-processing ripple: the faster you scroll, the more
the rendered frame warps through a custom `WaterPass`, so the whole magazine
behaves like a pond rippled by the reader's own gesture. Built with React Three
Fiber, `@react-three/flex`, and a hand-written GLSL pass.

**▶ Live:** https://lab-wave-scroll.creative-moon.com
**Write-up:** https://www.creative-moon.com/stories/wave-scroll

## Controls

A live **control panel** (leva, top-right) tunes the water in real time:

- **strength** — how strongly scroll velocity maps to ripple
- **frequency** — ripple density
- **amplitude** — ripple depth
- **speed** — wave time speed
- **responsiveness** — how fast the surface reacts and settles

## How it works

A rolling average of the last 10 frame-to-frame scroll deltas feeds the
`factor` uniform (lerped each frame), so quick flicks produce an elastic surge
and slow drags a gentle swell. The fragment shader offsets each pixel's UV by a
pair of sine/cosine waves scaled by `factor`.

## Stack

React · Three.js · @react-three/fiber · @react-three/flex · @react-spring/web · leva · Create React App

## Run

```bash
npm install
npm start      # dev
npm run build  # production → build/
```
