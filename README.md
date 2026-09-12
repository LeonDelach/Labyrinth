# Labyrinth

A small browser-based marble labyrinth prototype with a 2D game board and a Babylon.js 3D mirror.

## Overview

This project includes:

- a 2D canvas version of the labyrinth gameplay
- a 3D Babylon.js visualization that mirrors the 2D board
- a simple wall-and-hole layout with a marble that can be tilted by moving the mouse

## How to run

Open `Labyrinthe10.html` in a browser.

Because the project uses a browser script loader, opening the file directly in a browser is the expected workflow for this prototype.

## Files

- `Labyrinthe10.html` — page bootstrap
- `labyrinth-core.js` — physics and gameplay loop
- `labyrinth-board.js` — wall and hole definitions and board setup
- `labyrinth-render.js` — 2D canvas drawing and rendering helpers
- `labyrinth-3d.js` — Babylon.js 3D scene and board mirroring

## Notes

This is still a proof-of-concept / prototype project. The 3D version is intended to mirror the 2D logic while the visual representation is kept intentionally simple.

## Refactor plan

A full object-oriented refactor is not being done yet. The current goal is to keep the prototype stable while the gameplay and board mirroring are validated. Once the mechanics are settled, the next refactor could move the wall, hole, marble, and board into a clearer class-based structure.
