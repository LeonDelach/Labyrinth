# Labyrinth

A browser-based marble labyrinth prototype with a 2D playfield and a Babylon.js 3D mirror.

## Overview

The game is organized around a small object-oriented structure:

- model classes represent the logical game entities
- a Game instance handles the rules and update loop
- renderers draw the board in 2D and in 3D

The objective is to keep the board state as the source of truth while rendering remains separate.

## How to run

Open labyrinth.html in a browser.

This project is designed to work as a local file prototype, so the browser is expected to load the scripts directly without a build step.

## Project structure

- labyrinth.html — main entry page
- src/model/ — logical game objects (Board, Marble, Wall, Hole, Arrival)
- src/core/Game.js — rules, update loop, win/loss handling
- src/render/CanvasRenderer.js — 2D canvas rendering
- src/render/BabylonRenderer.js — 3D Babylon.js rendering
- src/main.js — application bootstrap

## Design notes

### Model vs rendering

The model classes contain the geometry and behavior of the game elements. The renderers are responsible for turning that model into visible shapes.

This separation keeps the gameplay logic independent from the visual layer and makes it easier to maintain the 2D and 3D versions in sync.

### Object-oriented approach

The game is moving toward a simple domain model:

- Wall stores segment geometry and collision checks
- Hole stores the hole position and radius
- Arrival stores the destination zone
- Marble stores position, velocity, and acceleration
- Board stores collections of those objects
- Game orchestrates the simulation and end conditions

## Notes

This refactor is intentionally incremental. The goal is to keep gameplay stable while improving readability and structure, rather than over-engineering too early.
