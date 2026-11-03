# API pública de PaintPad

Actualizado con `npm run sync:paintpad`. La sincronización primero lee la página pública de gamas y después consulta la API de pinturas para cada gama.

## Contrato

- `GET https://paintpad.app/paints/by-range`: descubre las rutas públicas de las gamas.
- `GET https://paintpad.app/paints/:slug`: permite resolver el `paintRangeId` numérico presente en la página.
- `GET https://paintpad.app/api/paints?paint_range_id=<id>`: devuelve `{ paints: [...] }`, con `name`, `fullIdentifier`, `manufacturerCode`, `type` y `swatchStyle.color` (HEX cuando existe).

La aplicación usa los IDs numéricos porque están publicados en cada página de gama y cubren las 62 gamas.

## Alias de tres caracteres verificados

Los alias siguientes son los códigos de tres caracteres conocidos; no se infieren alias para gamas que la API no documenta con uno.

| Código | Gama | Llamada equivalente |
| --- | --- | --- |
| `AKA` | AK Interactive Acrylics | `GET /api/paints?paint_range_id=AKA` |
| `AKI` | AK Interactive | `GET /api/paints?paint_range_id=AKI` |
| `AKR` | AK Interactive Real Color | `GET /api/paints?paint_range_id=AKR` |
| `AKT` | AK Interactive 3rd Generation Acrylics | `GET /api/paints?paint_range_id=AKT` |
| `APA` | The Army Painter Warpaints Air | `GET /api/paints?paint_range_id=APA` |
| `APF` | The Army Painter Warpaints Fanatic | `GET /api/paints?paint_range_id=APF` |
| `APS` | The Army Painter Speedpaint 2.0 | `GET /api/paints?paint_range_id=APS` |
| `APW` | The Army Painter Warpaints | `GET /api/paints?paint_range_id=APW` |
| `CPS` | Citadel Painting System | `GET /api/paints?paint_range_id=CPS` |
| `FP3` | Formula P3 | `GET /api/paints?paint_range_id=FP3` |
| `GSW` | Green Stuff World | `GET /api/paints?paint_range_id=GSW` |
| `KKO` | Kimera Kolors | `GET /api/paints?paint_range_id=KKO` |
| `MPA` | Monument Hobbies Pro Acryl | `GET /api/paints?paint_range_id=MPA` |
| `SCA` | Scale75 Scalecolor Artist | `GET /api/paints?paint_range_id=SCA` |
| `SCC` | Scale75 Scalecolor | `GET /api/paints?paint_range_id=SCC` |
| `SCF` | Scale75 Scalecolor Floww | `GET /api/paints?paint_range_id=SCF` |
| `SIN` | Scale75 Instant Colors | `GET /api/paints?paint_range_id=SIN` |
| `SMC` | Scale75 Mystic Colors | `GET /api/paints?paint_range_id=SMC` |
| `SPE` | Scale75 Prism Effect | `GET /api/paints?paint_range_id=SPE` |
| `SQC` | Vallejo Squidmar Color | `GET /api/paints?paint_range_id=SQC` |
| `TAM` | Tamiya | `GET /api/paints?paint_range_id=TAM` |
| `VGA` | Vallejo Game Air | `GET /api/paints?paint_range_id=VGA` |
| `VHS` | Vallejo Hobby Spray Paint | `GET /api/paints?paint_range_id=VHS` |
| `VMA` | Vallejo Model Air | `GET /api/paints?paint_range_id=VMA` |
| `VMC` | Vallejo Model Color | `GET /api/paints?paint_range_id=VMC` |
| `VME` | Vallejo Metal Color | `GET /api/paints?paint_range_id=VME` |
| `VMH` | Vallejo Mecha Color | `GET /api/paints?paint_range_id=VMH` |
| `VMW` | Vallejo Model Wash | `GET /api/paints?paint_range_id=VMW` |
| `VSP` | Vallejo Surface Primer | `GET /api/paints?paint_range_id=VSP` |
| `VXP` | Vallejo Xpress | `GET /api/paints?paint_range_id=VXP` |

## Llamadas de sincronización actuales

- [AK Interactive](https://paintpad.app/paints/ak-interactive) — `GET https://paintpad.app/api/paints?paint_range_id=3`
- [AK Interactive 3rd Generation Acrylics](https://paintpad.app/paints/ak-interactive-3rd-gen-acrylics) — `GET https://paintpad.app/api/paints?paint_range_id=5`
- [AK Interactive Abteilung 502](https://paintpad.app/paints/abteilung-502) — `GET https://paintpad.app/api/paints?paint_range_id=1`
- [AK Interactive Acrylic Washes](https://paintpad.app/paints/ak-interactive-acrylic-washes) — `GET https://paintpad.app/api/paints?paint_range_id=316`
- [AK Interactive Acrylics](https://paintpad.app/paints/ak-interactive-acrylics) — `GET https://paintpad.app/api/paints?paint_range_id=2`
- [AK Interactive Real Color](https://paintpad.app/paints/ak-interactive-real-color) — `GET https://paintpad.app/api/paints?paint_range_id=4`
- [Ammo Ionic Smart Colors](https://paintpad.app/paints/ionic-smart-colors) — `GET https://paintpad.app/api/paints?paint_range_id=283`
- [Amsterdam Acrylic Ink](https://paintpad.app/paints/amsterdam-acrylic-ink) — `GET https://paintpad.app/api/paints?paint_range_id=18`
- [Badger Freakflex](https://paintpad.app/paints/badger-freakflex) — `GET https://paintpad.app/api/paints?paint_range_id=6`
- [Badger Minitaire](https://paintpad.app/paints/badger-minitaire) — `GET https://paintpad.app/api/paints?paint_range_id=7`
- [Badger Stynylrez](https://paintpad.app/paints/badger-stynylrez) — `GET https://paintpad.app/api/paints?paint_range_id=8`
- [Citadel Painting System](https://paintpad.app/paints/citadel-painting-system) — `GET https://paintpad.app/api/paints?paint_range_id=11`
- [Coat D'Arms](https://paintpad.app/paints/coat-d-arms) — `GET https://paintpad.app/api/paints?paint_range_id=10`
- [Colour Forge](https://paintpad.app/paints/colour-forge) — `GET https://paintpad.app/api/paints?paint_range_id=85`
- [Daler-Rowney](https://paintpad.app/paints/daler-rowney) — `GET https://paintpad.app/api/paints?paint_range_id=12`
- [Darkstar](https://paintpad.app/paints/darkstar) — `GET https://paintpad.app/api/paints?paint_range_id=52`
- [Formula P3](https://paintpad.app/paints/formula-p3) — `GET https://paintpad.app/api/paints?paint_range_id=13`
- [Foundry Paint System](https://paintpad.app/paints/foundry-paint-system) — `GET https://paintpad.app/api/paints?paint_range_id=14`
- [Green Stuff World](https://paintpad.app/paints/green-stuff-world) — `GET https://paintpad.app/api/paints?paint_range_id=15`
- [Huge Miniatures](https://paintpad.app/paints/huge-miniatures) — `GET https://paintpad.app/api/paints?paint_range_id=48`
- [INSTAR](https://paintpad.app/paints/instar) — `GET https://paintpad.app/api/paints?paint_range_id=16`
- [Kimera Kolors](https://paintpad.app/paints/kimera-kolors) — `GET https://paintpad.app/api/paints?paint_range_id=47`
- [Monument Hobbies AMP Colors](https://paintpad.app/paints/monument-amp-colors) — `GET https://paintpad.app/api/paints?paint_range_id=151`
- [Monument Hobbies Expert Acrylics](https://paintpad.app/paints/monument-expert-acrylics) — `GET https://paintpad.app/api/paints?paint_range_id=152`
- [Monument Hobbies Pro Acryl](https://paintpad.app/paints/monument-pro-acryl) — `GET https://paintpad.app/api/paints?paint_range_id=17`
- [Reaper Master Series](https://paintpad.app/paints/reaper-master-series) — `GET https://paintpad.app/api/paints?paint_range_id=20`
- [Revell Enamel Color](https://paintpad.app/paints/revell-enamel) — `GET https://paintpad.app/api/paints?paint_range_id=19`
- [Scale75 Drop & Paint](https://paintpad.app/paints/drop-and-paint) — `GET https://paintpad.app/api/paints?paint_range_id=184`
- [Scale75 Instant Colors](https://paintpad.app/paints/instant-colors) — `GET https://paintpad.app/api/paints?paint_range_id=44`
- [Scale75 Mystic Colors](https://paintpad.app/paints/mystic-colors) — `GET https://paintpad.app/api/paints?paint_range_id=45`
- [Scale75 Prism Effect](https://paintpad.app/paints/prism-effect) — `GET https://paintpad.app/api/paints?paint_range_id=46`
- [Scale75 Scalecolor](https://paintpad.app/paints/scalecolor) — `GET https://paintpad.app/api/paints?paint_range_id=21`
- [Scale75 Scalecolor Artist](https://paintpad.app/paints/scalecolor-artist) — `GET https://paintpad.app/api/paints?paint_range_id=22`
- [Scale75 Scalecolor Floww](https://paintpad.app/paints/scalecolor-floww) — `GET https://paintpad.app/api/paints?paint_range_id=43`
- [Secret Weapon Miniatures](https://paintpad.app/paints/secret-weapon-miniatures) — `GET https://paintpad.app/api/paints?paint_range_id=23`
- [Tamiya](https://paintpad.app/paints/tamiya) — `GET https://paintpad.app/api/paints?paint_range_id=24`
- [The Army Painter Masterclass](https://paintpad.app/paints/the-army-painter-masterclass) — `GET https://paintpad.app/api/paints?paint_range_id=118`
- [The Army Painter Speedpaint 2.0](https://paintpad.app/paints/the-army-painter-speedpaint-2-0) — `GET https://paintpad.app/api/paints?paint_range_id=50`
- [The Army Painter Warpaints](https://paintpad.app/paints/the-army-painter-warpaints) — `GET https://paintpad.app/api/paints?paint_range_id=9`
- [The Army Painter Warpaints Air](https://paintpad.app/paints/the-army-painter-warpaints-air) — `GET https://paintpad.app/api/paints?paint_range_id=42`
- [The Army Painter Warpaints Fanatic](https://paintpad.app/paints/the-army-painter-warpaints-fanatic) — `GET https://paintpad.app/api/paints?paint_range_id=49`
- [Turbo Dork](https://paintpad.app/paints/turbo-dork) — `GET https://paintpad.app/api/paints?paint_range_id=25`
- [Two Thin Coats](https://paintpad.app/paints/two-thin-coats) — `GET https://paintpad.app/api/paints?paint_range_id=26`
- [Vallejo Auxiliaries](https://paintpad.app/paints/vallejo-auxiliaries) — `GET https://paintpad.app/api/paints?paint_range_id=38`
- [Vallejo Game Air](https://paintpad.app/paints/vallejo-game-air) — `GET https://paintpad.app/api/paints?paint_range_id=33`
- [Vallejo Game Color](https://paintpad.app/paints/vallejo-game-color) — `GET https://paintpad.app/api/paints?paint_range_id=27`
- [Vallejo Hobby Spray Paint](https://paintpad.app/paints/vallejo-hobby-spray-paint) — `GET https://paintpad.app/api/paints?paint_range_id=36`
- [Vallejo Liquid Gold](https://paintpad.app/paints/vallejo-liquid-gold) — `GET https://paintpad.app/api/paints?paint_range_id=29`
- [Vallejo Mecha Color](https://paintpad.app/paints/vallejo-mecha-color) — `GET https://paintpad.app/api/paints?paint_range_id=34`
- [Vallejo Metal Color](https://paintpad.app/paints/vallejo-metal-color) — `GET https://paintpad.app/api/paints?paint_range_id=31`
- [Vallejo Model Air](https://paintpad.app/paints/vallejo-model-air) — `GET https://paintpad.app/api/paints?paint_range_id=30`
- [Vallejo Model Color](https://paintpad.app/paints/vallejo-model-color) — `GET https://paintpad.app/api/paints?paint_range_id=28`
- [Vallejo Model Wash](https://paintpad.app/paints/vallejo-model-wash) — `GET https://paintpad.app/api/paints?paint_range_id=37`
- [Vallejo Nocturna](https://paintpad.app/paints/vallejo-nocturna) — `GET https://paintpad.app/api/paints?paint_range_id=39`
- [Vallejo Panzer Aces](https://paintpad.app/paints/vallejo-panzer-aces) — `GET https://paintpad.app/api/paints?paint_range_id=32`
- [Vallejo Squidmar Color](https://paintpad.app/paints/squidmar-color) — `GET https://paintpad.app/api/paints?paint_range_id=415`
- [Vallejo Surface Primer](https://paintpad.app/paints/vallejo-surface-primer) — `GET https://paintpad.app/api/paints?paint_range_id=35`
- [Vallejo The Shifters](https://paintpad.app/paints/vallejo-the-shifters) — `GET https://paintpad.app/api/paints?paint_range_id=40`
- [Vallejo True Metallic Metal](https://paintpad.app/paints/vallejo-true-metallic-metal) — `GET https://paintpad.app/api/paints?paint_range_id=250`
- [Vallejo Xpress](https://paintpad.app/paints/vallejo-xpress) — `GET https://paintpad.app/api/paints?paint_range_id=51`
- [WarColours](https://paintpad.app/paints/warcolours) — `GET https://paintpad.app/api/paints?paint_range_id=41`
- [Warhammer Tone Pro](https://paintpad.app/paints/warhammer-tone-pro) — `GET https://paintpad.app/api/paints?paint_range_id=382`
