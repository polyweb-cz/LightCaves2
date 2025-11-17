/**
 * Light Caves - Light Engine
 * Výpočet paprsku světla a jeho odrazu od zrcadel
 */

export class LightEngine {
  constructor(level) {
    this.level = level;
    this.visited = new Set(); // Aby se paprsek nezacyklil
  }

  /**
   * Spočítá cestu paprsku z baterky přes zrcadla
   * Vrací seznam souřadnic na kterých paprsek prochází
   */
  traceLightRay() {
    const path = [];
    const visited = new Set(); // Aby se paprsek nezacyklil (x,y,dir jako key)

    let x = this.level.flashlight.x;
    let y = this.level.flashlight.y;
    let direction = this.level.flashlight.direction;

    while (true) {
      // Pozice paprsku
      const key = `${x},${y},${direction}`;
      if (visited.has(key)) break; // Infinitní smyčka - stop
      visited.add(key);

      // Pohyb paprsku v daném směru
      const { nx, ny } = this.getNextPosition(x, y, direction);

      // Kontrola hranic a zdí
      if (!this.isWalkable(nx, ny)) {
        break; // Paprsek narazil na zeď nebo okraj
      }

      x = nx;
      y = ny;
      path.push({ x, y, direction });

      // Kontrola, zda jsme na zrcadle
      const mirror = this.getMirrorAt(x, y);
      if (mirror) {
        // Paprsek se odrazí
        direction = this.reflectRay(direction, mirror.type);
      }
    }

    return path;
  }

  /**
   * Vrací další pozici v daném směru
   */
  getNextPosition(x, y, direction) {
    const moves = {
      up: { dx: 0, dy: -1 },
      down: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 },
      right: { dx: 1, dy: 0 }
    };

    const { dx, dy } = moves[direction];
    return { nx: x + dx, ny: y + dy };
  }

  /**
   * Vrací zrcadlo na dané pozici (z mapy)
   * Zrcadla: "/" a "╲"
   */
  getMirrorAt(x, y) {
    if (y < 0 || y >= this.level.height || x < 0 || x >= this.level.width) {
      return null;
    }
    const cell = this.level.map[y][x];
    if (cell === "/" || cell === "╲") {
      return { x, y, type: cell };
    }
    return null;
  }

  /**
   * Odraží paprsek podle typu zrcadla
   * Typ `/`:
   *   left → up, up → left, right → down, down → right
   * Typ `╲`:
   *   left → down, up → right, right → up, down → left
   */
  reflectRay(direction, mirrorType) {
    const reflections = {
      "/": {
        left: "up",
        up: "left",
        right: "down",
        down: "right"
      },
      "╲": {
        left: "down",
        up: "right",
        right: "up",
        down: "left"
      }
    };

    return reflections[mirrorType][direction] || direction;
  }

  /**
   * Je daná pozice procházející (ne zeď, ne mimo mapu)?
   */
  isWalkable(x, y) {
    // Hranice mapy
    if (x < 0 || x >= this.level.width || y < 0 || y >= this.level.height) {
      return false;
    }

    // Kontrola zdí v mapě
    const cell = this.level.map[y][x];
    // Baterka a cíl se taky počítají jako volný prostor (speciální symboly)
    const specialSymbols = ["→", "←", "↑", "↓", ">", "<", "^", "v", "/", "╲"];
    return cell === "." || cell === " " || specialSymbols.includes(cell);
  }

  /**
   * Vrací všechny buňky které paprsek osvětlil
   * (včetně cesty a odkrytých zdí)
   */
  getVisibleCells() {
    const path = this.traceLightRay();
    const visible = new Set();

    for (const point of path) {
      visible.add(`${point.x},${point.y}`);

      // Přidej sousední buňky co jsou zdi (aby se viděly)
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = point.x + dx;
          const ny = point.y + dy;
          if (this.isWalkable(nx, ny)) continue; // Ignoruj volné prostory
          if (nx >= 0 && nx < this.level.width && ny >= 0 && ny < this.level.height) {
            visible.add(`${nx},${ny}`); // Vidíme zeď
          }
        }
      }
    }

    return visible;
  }
}