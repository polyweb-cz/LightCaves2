/**
 * Light Caves - Renderer
 * Vykreslování hry na HTML5 Canvas
 */

export class Renderer {
  constructor(canvasId, level) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.level = level;

    // Velikost jednoho čtverce (v pixelech)
    this.cellSize = 30;

    // Nastavit velikost canvasu
    this.canvas.width = level.width * this.cellSize;
    this.canvas.height = level.height * this.cellSize;
  }

  /**
   * Vykreslí celou scénu
   */
  render(lightPath, visibleCells, revealedWalls) {
    // Vyčistit canvas
    this.ctx.fillStyle = "#1a1a1a";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Vykreslit grid
    this.renderGrid();

    // Vykreslit zdi
    this.renderWalls(visibleCells, revealedWalls);

    // Vykreslit paprsek
    this.renderLightPath(lightPath);

    // Vykreslit zrcadla
    this.renderMirrors();

    // Vykreslit baterku
    this.renderFlashlight();

    // Vykreslit cíl
    this.renderGoal();

    // Vykreslit HUD
    this.renderHUD();
  }

  /**
   * Vykresli základní grid
   */
  renderGrid() {
    this.ctx.strokeStyle = "#333";
    this.ctx.lineWidth = 1;

    for (let x = 0; x <= this.level.width; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.cellSize, 0);
      this.ctx.lineTo(x * this.cellSize, this.level.height * this.cellSize);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.level.height; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.cellSize);
      this.ctx.lineTo(this.level.width * this.cellSize, y * this.cellSize);
      this.ctx.stroke();
    }
  }

  /**
   * Vykreslí zdi
   */
  renderWalls(visibleCells, revealedWalls) {
    for (let y = 0; y < this.level.height; y++) {
      for (let x = 0; x < this.level.width; x++) {
        const key = `${x},${y}`;
        const cell = this.level.map[y][x];

        if (cell !== "█") continue; // Jen zdi

        // Odhalené zdi (modré, viditelné)
        if (revealedWalls.has(key)) {
          this.ctx.fillStyle = "#4488ff";
        }
        // Neodhalené zdi (tmavě šedé)
        else if (visibleCells.has(key)) {
          this.ctx.fillStyle = "#666";
        }
        // Zdi mimo viditelnost (neviditelné)
        else {
          continue;
        }

        this.drawCell(x, y, this.ctx.fillStyle);
      }
    }
  }

  /**
   * Vykreslí obsah mapy (speciální symboly)
   */
  renderMapContent(visibleCells) {
    for (let y = 0; y < this.level.height; y++) {
      for (let x = 0; x < this.level.width; x++) {
        const key = `${x},${y}`;
        const cell = this.level.map[y][x];

        // Baterka a cíl se vykreslují jen pokud jsou viditelné
        if (!visibleCells.has(key)) continue;

        const x_px = x * this.cellSize + this.cellSize / 2;
        const y_px = y * this.cellSize + this.cellSize / 2;

        // Baterka - už se kreslí v renderFlashlight(), ale můžeme přidat symbol
        if (cell === "→" || cell === "←" || cell === "↑" || cell === "↓") {
          // Já už mám renderFlashlight() který se stará o to
        }

        // Cíl
        if (cell === ">" || cell === "<" || cell === "^" || cell === "v") {
          this.ctx.fillStyle = "#00ff00";
          this.ctx.font = "bold 20px Arial";
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "middle";
          this.ctx.fillText("U", x_px, y_px);
        }
      }
    }
  }

  /**
   * Vykreslí paprsek světla
   */
  renderLightPath(lightPath) {
    this.ctx.strokeStyle = "#ffff00";
    this.ctx.lineWidth = 3;

    for (let i = 0; i < lightPath.length; i++) {
      const p1 = lightPath[i];
      const p2 = lightPath[i + 1];

      if (!p2) break; // Poslední bod

      const x1 = p1.x * this.cellSize + this.cellSize / 2;
      const y1 = p1.y * this.cellSize + this.cellSize / 2;
      const x2 = p2.x * this.cellSize + this.cellSize / 2;
      const y2 = p2.y * this.cellSize + this.cellSize / 2;

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }

    // Vykreslí poslední bod paprsku (kde skončil)
    if (lightPath.length > 0) {
      const last = lightPath[lightPath.length - 1];
      this.ctx.fillStyle = "#ffff00";
      this.ctx.fillRect(
        last.x * this.cellSize + 10,
        last.y * this.cellSize + 10,
        this.cellSize - 20,
        this.cellSize - 20
      );
    }
  }

  /**
   * Vykreslí zrcadla (z mapy)
   */
  renderMirrors() {
    for (let y = 0; y < this.level.height; y++) {
      for (let x = 0; x < this.level.width; x++) {
        const cell = this.level.map[y][x];

        if (cell !== "/" && cell !== "\\") continue; // Jen zrcadla

        this.ctx.fillStyle = "#ff6666";
        this.ctx.font = "bold 20px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        const x_px = x * this.cellSize + this.cellSize / 2;
        const y_px = y * this.cellSize + this.cellSize / 2;

        this.ctx.fillText(cell, x_px, y_px);
      }
    }
  }

  /**
   * Vykreslí baterku (startovní bod paprsku)
   */
  renderFlashlight() {
    const x = this.level.flashlight.x * this.cellSize + this.cellSize / 2;
    const y = this.level.flashlight.y * this.cellSize + this.cellSize / 2;

    // Nakreslí kruh pro baterku
    this.ctx.fillStyle = "#0088ff";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 8, 0, Math.PI * 2);
    this.ctx.fill();

    // Nakreslí šipku směru
    this.ctx.fillStyle = "#0088ff";
    this.ctx.font = "bold 16px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    const arrows = { up: "↑", down: "↓", left: "←", right: "→" };
    this.ctx.fillText(arrows[this.level.flashlight.direction], x, y - 15);
  }

  /**
   * Vykreslí cíl (U)
   */
  renderGoal() {
    const x = this.level.goal.x * this.cellSize + this.cellSize / 2;
    const y = this.level.goal.y * this.cellSize + this.cellSize / 2;

    this.ctx.fillStyle = "#00ff00";
    this.ctx.font = "bold 20px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillText("U", x, y);
  }

  /**
   * Vykreslí HUD (počet zrcadel, jméno levelu)
   */
  renderHUD() {
    // Spočítej zrcadla v mapě
    let placedCount = 0;
    for (let y = 0; y < this.level.height; y++) {
      for (let x = 0; x < this.level.width; x++) {
        const cell = this.level.map[y][x];
        if (cell === "/" || cell === "\\") placedCount++;
      }
    }

    this.ctx.fillStyle = "#fff";
    this.ctx.font = "14px Arial";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";

    // Název levelu
    this.ctx.fillText(`Level: ${this.level.name}`, 10, 10);

    // Počet dostupných zrcadel
    const availableCount = this.level.objects.mirrors.available;
    const remainingCount = availableCount - placedCount;
    this.ctx.fillText(`Zrcadla: ${remainingCount}/${availableCount} (umístěno: ${placedCount})`, 10, 30);

    // Legenda
    this.ctx.fillStyle = "#aaa";
    this.ctx.font = "12px Arial";
    this.ctx.fillText("█ = Zeď  U = Cíl  ↑↓←→ = Baterka  / \\ = Zrcadlo", 10, this.canvas.height - 20);
  }

  /**
   * Pomocná funkce pro vykreslení jedné buňky
   */
  drawCell(x, y, color) {
    const px = x * this.cellSize;
    const py = y * this.cellSize;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
  }
}