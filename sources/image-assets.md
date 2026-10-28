# 食品イラストの生成記録

2026-10-28、内蔵 image_gen。透明背景。最終ファイル：`public/images/strawberry.png` と `public/images/mentaiko.png`。

Strawberry prompt:
Create one isolated small Amaou strawberry illustration for an educational Japanese geography game. Bright red plump single strawberry leaning slightly left, green leafy top, a few pale seeds, friendly polished flat illustration with subtle dimensional highlights. Transparent background. No text, no plate, no shadow outside the fruit, ample crop with fruit filling 85% of a square. It will appear at 32px next to bold Japanese UI type.

Mentaiko prompt:
Create one isolated small illustration of karashi mentaiko for an educational Japanese geography game. Two orange-red elongated sacs of spicy pollock roe overlapping diagonally, distinct oval tapered forms, tiny pale speckles, friendly polished flat illustration with subtle dimensional highlights. Transparent background. No text, no plate, no shadow outside the food, fill 85% of a square. It will appear at 42px next to bold Japanese UI type.

## Browser and home-screen icons

The `県` glyph uses the same Noto Sans JP (SIL OFL) and orange Phosphor Seal (MIT) as the app. The composed icon is rendered locally by `scripts/prepare-icons.mjs`, then resized for ICO/PNG, Apple touch and manifest icons. The maskable variant leaves additional safe padding. No new generated artwork or external service is involved.
