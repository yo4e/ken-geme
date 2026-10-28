# Design QA

final result: passed

## Visual truth and capture

Approved source files (read locally before implementation):
- `../design-inputs/01-question-fukuoka.png`
- `../design-inputs/02-correct-fukuoka.png`
- `../design-inputs/03-incorrect-fukuoka.png` (latest revision, single 答えを見る primary action)

Each source is 853×1844 pixels. They were normalized to the documented 390×844 CSS target (DPR 1) for comparison. Implementation screenshots are actual headless Chromium browser captures at 390×844, DPR 1; no device chrome. Comparison images contain source on the left and implementation on the right in the same 780×844 image:
- `work/screenshots/compare-question.png`
- `work/screenshots/compare-incorrect.png`
- `work/screenshots/compare-correct.png`

Full viewport evidence also exists for all four question/incorrect/reveal/correct states at 320×900, 390×844, and 1280×900 (full-page screenshots for 320/1280). File pattern: `work/screenshots/{state}-{width}.png`. PC content remains a centered readable column, rather than stretching a phone layout across the monitor.

Focused comparison: `work/screenshots/compare-error-detail.png` (input, error, CTA); `work/screenshots/compare-map-detail.png` (map, label, food illustrations, CTA). These were cropped from the combined comparison for close inspection; source and implementation remain together.

## Findings and iteration history

Iteration 1 evidence: `work/screenshots/iteration-1/compare-*.png`.
- P1: error input remained navy because the base ID selector overrode the invalid selector. Fixed with `input#answer[aria-invalid=true]`; final capture shows the red border.
- P2: incorrect-state label/input/message/action sat 20–25px too low. Reduced the card-to-label, label-to-input and message-to-action gaps; the error input and primary action now align with the reference's vertical rhythm.
- P2: card name sat 7–13px too low. Reduced title margins in question/incorrect states.
- P2: prefecture boundaries were faint at phone size. Increased the original SVG boundary stroke to 3 source units; reviewed final map at 320 and 390px.
- Capture issue: first correct-state screenshot preceded image decode. All final correct-state captures explicitly wait for the map and both food images to decode.
- A trial icon name was unsupported by the icon package; this was caught by the next rendered capture and reverted to the supported library Seal icon. Final runtime has no console/page errors.

Iteration 2/3 final evidence is the combined comparison and focused crops listed above. No remaining actionable P0/P1/P2 findings.

## Required fidelity surfaces

- **Fonts/typography:** locally served Noto Sans JP variable reproduces the heavy navy Japanese hierarchy; Barlow Condensed supplies the timer. Large prefecture names, labels, helper copy and CTA text have been checked, including さいたま市, 神奈川県 and 和歌山市. Input text uses regular weight. The exact generated font's tiny contour differences are P3.
- **Spacing/layout:** 20px mobile side padding, 48px top inset at 390px, large bordered card, full-width input and blue CTA follow the source. Error screen has only 答えを見る as its primary action. No horizontal overflow at 320, 390, 1280. All primary controls remain in normal scrolling flow, including with text growth or keyboard viewport shrinkage.
- **Colors/tokens:** warm off-white, navy, blue CTA, green correct state, orange incorrect icon and red input border match the semantic palette. Visible focus rings and sufficient contrast are maintained. The mock's subtle generated paper texture is intentionally replaced by a clean solid background (P3).
- **Image quality:** uses the exact sourced vector map geometry with each prefecture keyed independently; 47 distinct IDs verified. The mock's generated map is wider/distorted, so the real SVG keeps its original aspect ratio and appears narrower. This is an intentional requirement-driven difference: accurate source geography takes precedence. The prefecture label is a text legend instead of a generated leader pointing at an imprecise location. The source's licensed map paths are not handcrafted artwork. Food illustrations are generated assets in `public/images`, with transparency checked. Icons come from Phosphor, without custom SVG drawings.
- **Copy/content:** matches the three approved screen actions. New startup/results states implement the requested full game. Reverse mode, exact suffixes, official hiragana, Tokyo's ward explanation, timer rules and storage behavior are explicit. All 47 local food names were verified in official sources; categories are labeled 特産品・郷土の味 outside Fukuoka to distinguish regional cuisine.

## Functional and accessibility checks

- 8 unit tests passed: all 47 names/capitals/map IDs, strict answer rules, randomized retry queue, all-47 completion in both modes, paused timer, duplicate actions, local records and unavailable/corrupt storage.
- 18 browser tests passed across Chromium and WebKit: ordinary and reverse complete games; error → reveal → random later retry; record persistence after reload; storage access/write denial; IME composition Enter does not submit; subsequent Enter does; repeated actions cannot skip a card; 320/390/1280 layouts.
- Semantic labels, progressbar, alt text, focus transitions, keyboard access, reduced-motion behavior and non-color-only feedback reviewed. Main CTAs are 53–61px high. Core interactions and screenshots emitted no page errors. Each correct-state map loaded through the browser.
- Browser IME composition events were simulated. Physical iOS/Android keyboards and their platform IME candidate UI were not directly operated; this remains a device coverage limit, not a known failing case.

## Follow-up polish (P3)

- Source starburst has sharper tips than the closest standard Phosphor Seal icon.
- Raster-generated source glyph contours/paper texture and the small food illustration brush style are not pixel-identical.

## Implementation checklist

- [x] Open exact selected sources locally.
- [x] Compare matching Fukuoka states at the same normalized viewport.
- [x] Fix P1/P2 findings and recapture.
- [x] Review full-view and focused evidence.
- [x] Check five required fidelity surfaces.
- [x] Verify mobile/desktop core interactions in real browser engines.

The explicit production browser-game requirement overrides the mobile-app prototype shell. A responsive browser game uses the Product Design web starter with no simulated phone chrome. The user's headless/background preference supplies authorization for headless browser testing and avoids occupying their desktop.

Final close-up review confirmed the red input border, error CTA rhythm, small helper copy, map boundaries and decoded food assets. The final-answer save timing was then tightened so the record is persisted immediately on the 47th correct answer, before the result button; completion/save browser tests were rerun in both engines (6/6 passed). This did not change the rendered design.
