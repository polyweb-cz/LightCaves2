/**
 * Light Caves - Game Logic
 * Hlavní herní smyčka a logika
 */

import { level1_1 } from "../maps/level1-1.js";
import { LightEngine } from "./lightEngine.js";
import { Renderer } from "./renderer.js";

export class Game {
  constructor() {
    this.level = level1_1;

    // Parsuj pozioku baterky a cíle z mapy
    this.parseMapPositions();

    this.lightEngine = new LightEngine(this.level);
    this.renderer = new Renderer("gameCanvas", this.level);

    // Sledujeme které zdi byly odkryty světlem
    this.revealedWalls = new Set();

    this.init();
  }

  /**
   * Parsuj pozioku baterky a cíle z mapy
   */
  parseMapPositions() {
    const directionMap = {
      "→": "right",
      "←": "left",
      "↑": "up",
      "↓": "down"
    };

    const goalDirMap = {
      ">": "left",   // otevírá se doprava = paprsek přichází zleva
      "<": "right",  // otevírá se doleva = paprsek přichází zprava
      "^": "down",   // otevírá se nahoru = paprsek přichází zdola
      "v": "up"      // otevírá se dolů = paprsek přichází shora
    };

    // Inicializuj pozioku
    this.level.flashlight = { x: 0, y: 0, direction: "right" };
    this.level.goal = { x: 0, y: 0, direction: "left" };

    // Procházej mapou a hledej speciální symboly
    for (let y = 0; y < this.level.height; y++) {
      for (let x = 0; x < this.level.width; x++) {
        const cell = this.level.map[y][x];

        // Hledej baterku
        if (directionMap[cell]) {
          this.level.flashlight = {
            x,
            y,
            direction: directionMap[cell]
          };
        }

        // Hledej cíl
        if (goalDirMap[cell]) {
          this.level.goal = {
            x,
            y,
            direction: goalDirMap[cell]
          };
        }
      }
    }

    console.log("Baterka nalezena na:", this.level.flashlight);
    console.log("Cíl nalezen na:", this.level.goal);
  }

  init() {
    console.log("Inicializuji Light Caves - Demo");
    console.log("Level:", this.level.name);
    console.log("Mapa velikost:", `${this.level.width}x${this.level.height}`);
    console.log("Dostupná zrcadla:", this.level.mirrors.available);

    // Prvotní rendr
    this.update();
  }

  /**
   * Aktualizace a vykreslení
   */
  update() {
    // Spočítej cestu paprsku
    const lightPath = this.lightEngine.traceLightRay();

    // Zjisti které buňky jsou viditelné
    const visibleCells = this.lightEngine.getVisibleCells();

    // Přidej viditelné zdi do permanentně odkrytých
    for (const cellKey of visibleCells) {
      const [x, y] = cellKey.split(",").map(Number);
      const cell = this.level.map[y][x];
      if (cell === "█") {
        this.revealedWalls.add(cellKey);
      }
    }

    // Vykreslení
    this.renderer.render(lightPath, visibleCells, this.revealedWalls);

    // Debug info do konzole
    this.logDebugInfo(lightPath, visibleCells);
  }

  /**
   * Debug informace
   */
  logDebugInfo(lightPath, visibleCells) {
    console.clear();
    console.log("=== Light Caves - Debug Info ===");
    console.log("Paprsek prochází:", lightPath.length, "buňkami");
    console.log("Viditelné buňky:", visibleCells.size);
    console.log("Permanentně odkryté zdi:", this.revealedWalls.size);
    console.log("Paprsek:");
    lightPath.forEach((p, i) => {
      console.log(`  ${i}: [${p.x},${p.y}] direction: ${p.direction}`);
    });
  }

  /**
   * Testovací metoda - přidej zrcadlo dynamicky
   */
  addMirror(x, y, type) {
    if (!this.level.mirrors.placed) {
      this.level.mirrors.placed = [];
    }

    const available = this.level.mirrors.available - this.level.mirrors.placed.length;
    if (available <= 0) {
      console.warn("Žádná dostupná zrcadla!");
      return;
    }

    this.level.mirrors.placed.push({ x, y, type });
    this.lightEngine = new LightEngine(this.level);
    this.update();
    console.log(`Zrcadlo ${type} přidáno na [${x},${y}]`);
  }

  /**
   * Testovací metoda - odeber zrcadlo
   */
  removeMirror(x, y) {
    if (this.level.mirrors.placed) {
      this.level.mirrors.placed = this.level.mirrors.placed.filter(
        m => !(m.x === x && m.y === y)
      );
      this.lightEngine = new LightEngine(this.level);
      this.update();
      console.log(`Zrcadlo odebráno z [${x},${y}]`);
    }
  }

  /**
   * Testovací metoda - otočit baterku
   */
  rotateFlashlight(direction) {
    if (!["up", "down", "left", "right"].includes(direction)) {
      console.warn("Neplatný směr!");
      return;
    }

    this.level.flashlight.direction = direction;
    this.revealedWalls.clear(); // Reset odkrytých zdí
    this.lightEngine = new LightEngine(this.level);
    this.update();
    console.log(`Baterka natočena na: ${direction}`);
  }
}

// Spuštění hry když se stránka načte
document.addEventListener("DOMContentLoaded", () => {
  window.game = new Game();

  // Pokyny v konzoli
  console.log(`
╔════════════════════════════════════════════╗
║       Light Caves - Ultraminimální Demo    ║
╚════════════════════════════════════════════╝

Dostupné příkazy v konzoli:

1. Manipulace zrcadly:
   game.addMirror(x, y, "typ")        // Přidej zrcadlo (typ: "/" nebo "\")
   game.removeMirror(x, y)             // Odeber zrcadlo

2. Manipulace baterkou:
   game.rotateFlashlight("up")         // Natočit (up|down|left|right)

Příklady:
   game.addMirror(5, 5, "/")
   game.rotateFlashlight("down")
   game.removeMirror(6, 2)

Legenda:
   🔵 = Baterka se šipkou
   ↑ = Světelný paprsek
   🔴 = Zrcadlo (/ nebo \)
   🟢 = Cíl (U)
   🔵 = Odkrytá zeď
  `);
});