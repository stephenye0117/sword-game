# Samurai Duel

A turn-based 3D combat game where you face off against an AI opponent in a samurai duel. Built with Three.js and Tween.js.

## Features

- Turn-based combat system
- 3D graphics with animated characters
- Four combat actions: Quick Attack, Heavy Attack, Block, and Parry
- Dynamic health and action point system
- Responsive animations for all combat actions

## Game Controls

- **Quick Attack**: Fast but lower damage (8-12 damage)
- **Heavy Attack**: Slower but higher damage (15-22 damage)
- **Block**: Reduces incoming damage by 70%
- **Parry**: If timed right, negates damage and counters

## Getting Started

### Prerequisites

- A modern web browser
- A local web server (Python's SimpleHTTPServer or similar)

### Installation

1. Clone the repository
```bash
git clone https://github.com/stephenye0117/sword-game.git
cd sword-game
```

2. Start a local server:
```bash
# If you have Python 3:
python -m http.server 8000

# If you have Python 2:
python -m SimpleHTTPServer 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## How to Play

1. Each turn you have 2 actions
2. Choose your actions wisely:
   - Use Quick Attacks for consistent damage
   - Heavy Attacks for big damage but slower
   - Block to reduce incoming damage
   - Parry to counter enemy attacks
3. The enemy will take their turn after you use both actions
4. Reduce the enemy's health to zero to win

## Technical Details

Built with:
- Three.js for 3D rendering
- Tween.js for animations
- ES6 Modules for code organization

File structure:
- `index.html`: Main game file and UI
- `animations.js`: Animation system
- `gameLogic.js`: Game state and combat logic

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js for the 3D graphics engine
- Tween.js for animation handling
