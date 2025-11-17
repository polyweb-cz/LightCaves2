/**
 * Light Caves - Level 1-1: Tutorial Map
 * Jednoduchá 15x15 mapa na seznámení se hrou
 */

export const level1_1 = {
  id: "level1-1",
  name: "Kapitola 1 - První paprsek světla",
  description: "Naučte se jak funguje světelný paprsek a jak odhaluje jeskyni",
  width: 15,
  height: 15,

  // Dostupná zrcadla
  mirrors: {
    available: 3,
    placed: [
      // Jedno statické zrcadlo pro demo
      {
        x: 6,
        y: 2,
        type: "/"  // / nebo \
      }
    ]
  },

  // ASCII mapa
  // █ = zeď, . = volný prostor
  // → ← ↑ ↓ = baterka (direction symboly)
  // > < ^ v = cíl (U-shape otevírající se v daném směru)
  //           > = otevírá se doprava (paprsek musí přijít zleva)
  //           < = otevírá se doleva (paprsek musí přijít zprava)
  //           ^ = otevírá se nahoru (paprsek musí přijít zdola)
  //           v = otevírá se dolů (paprsek musí přijít shora)
  map: [
    "███████████████",
    "█→............█",
    "█.█████.......█",
    "█.█...█.......█",
    "█.█.█.█.......█",
    "█.█.█.........█",
    "█.█.█████████.█",
    "█.............█",
    "█.......█████.█",
    "█.......█...█.█",
    "█.......█.█.█.█",
    "█.......█.█...█",
    "█.........█████",
    "█.........>...█",
    "███████████████"
  ]
};