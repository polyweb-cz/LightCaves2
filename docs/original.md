# Light Caves - Original Game Concept

## 🎮 Základní koncept
Hra inspirovaná dětskou hrou na čtverečkovaném papíře ze školy. Hráč má baterku v temné jeskyni a vidí pouze to, kam dosvítí světlo. Cílem je pomocí zrcadel prozkoumat jeskyni a najít cestu k cíli.

## 🕹️ Herní mechanika

### Startovací baterka
- **Pozice**: Baterka je na startovní pozici (pevně nebo pohyblivá dle level designu)
- **Směr svícení**: Baterka může svítit do **4 směrů**:
  - `↑` - nahoru (svislý paprsek nahoru)
  - `↓` - dolů (svislý paprsek dolů)
  - `←` - doleva (vodorovný paprsek doleva)
  - `→` - doprava (vodorovný paprsek doprava)
- **Rotace**: Baterku lze otáčet (rotovat mezi 4 směry)
- **Funkce**: Generuje paprsek světla, který odhaluje jeskyni

### Viditelnost a explorace
- **Omezená viditelnost**: Vidíš pouze oblasti osvětlené paprskem světla
- **Permanentní odhalení**: Jednou osvětlená zeď zůstane trvale viditelná
- **Postupná explorace**: Mapuješ jeskyni přesouvením a otáčením zrcadel

### Světelný paprsek
- **Směry**: Pouze vodorovný (`─`) nebo svislý (`│`) - diagonální paprsky nejsou možné
- **Odraz od zdí**: Když paprsek narazí na zeď, je vidět zeď i paprsek
- **Zalomení světla**: Při průchodu zrcadlem se paprsek odráží podle tvaru zrcadla

### Zrcadla
**Typy a chování:**
- **`/` zrcadlo**:
  - zleva → nahoru
  - shora → doleva
  - zdola → doprava
  - zprava → dolů
- **`\` zrcadlo** (opačné odrazy):
  - zleva → dolů
  - shora → doprava
  - zdola → doleva
  - zprava → nahoru

**Vlastnosti:**
- Omezený počet zrcadel (musíš je strategicky použít)
- Lze je **přesouvat** po gridu
- Lze je **otáčet** (rotace mezi `/` a `\`)

## 🎯 Cíl hry

### Tvar cíle
- Vypadá jako **velké "U"**
- Může být otočený různými směry (0°, 90°, 180°, 270°)

### Dosažení cíle
- Cíl je **viditelný** od začátku (ale neurčitě - vidíš kde je, ale ne odkud se k němu dostat)
- Musíš dostat **paprsek světla do středu** tohoto "U"
- Cíl může být dosažitelný pouze z **určitého směru** (např. zleva, shora, apod.)

## 📐 Vizuální reprezentace

### Symboly
```
█   = Zeď (plný černý čtverec)
    = Volný prostor (prázdný čtverec)
│   = Svislý paprsek světla
─   = Vodorovný paprsek světla
┘   = Zalomení světla (paprsek zprava/shora)
└   = Zalomení světla (paprsek zleva/shora)
┐   = Zalomení světla (paprsek zprava/zdola)
┌   = Zalomení světla (paprsek zleva/zdola)
/   = Zrcadlo typ 1
\   = Zrcadlo typ 2
U   = Cíl (různé rotace)
↑   = Baterka směr nahoru
↓   = Baterka směr dolů
←   = Baterka směr doleva
→   = Baterka směr doprava
```

## 🎲 Herní princip

1. **Start**: Hráč má baterku na startovní pozici, omezenou zásobu zrcadel
2. **Rotace baterky**: Otočí baterku do požadovaného směru (↑ ↓ ← →)
3. **Explorace**: Přesouvá a otáčí zrcadla aby osvětlil různé části jeskyně
4. **Mapování**: Postupně odhaluje rozmístění zdí (jednou osvětlené zůstávají vidět)
5. **Řešení**: Najde správnou kombinaci umístění zrcadel, aby paprsek dosvítil do středu cíle
6. **Vítězství**: Paprsek světla dorazí do středu "U" ze správného směru

## 🔧 Technické poznámky

### Grid systém
- Čtverečkovaný grid (původně papír ve čtverečkách)
- Diskrétní pohyb (po čtvercích)
- Jednoduché collision detection (zeď vs volno)

### Puzzle mechanika
- Kombinace **resource managementu** (omezená zrcadla)
- **Spatial reasoning** (kam umístít zrcadla)
- **Path finding** (najít správnou cestu světla)
- **Fog of war** mechanika (postupné odhalování)

## 💡 Herní flow
```
START → Otočit baterku → Umístit zrcadlo → Osvětlit oblast → Odhalit zdi →
→ Upravit pozici zrcadel → Hledat cestu → Najít cíl →
→ Namířit paprsek správným směrem → VÍTĚZSTVÍ
```

---

**Poznámka**: Původní hra se hrála na papíře ve škole. Tato digitální verze zachovává její jednoduchý ale chytrý puzzle design.