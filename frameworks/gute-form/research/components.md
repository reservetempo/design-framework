# Gute Form: component research

Notes for the `gf-` CSS library. For each component: the Braun / Ulm details it borrows,
then a visual spec in token names (values come from `research/visual.md`). Aqua's component
list is the starting point (`frameworks/aqua/aqua.css`, header comment), adapted to the
Braun way: a calm face, lowercase labels, colour kept for the one control that matters.

Details marked † come from photos and general knowledge rather than a written source; check
them against the museum images before stating them as fact on the site.

## Token roles used below

| Token | Role in these specs |
|---|---|
| `--gf-page` | page behind panels; also the recessed fill of fields, tracks and wells |
| `--gf-surface` | the face of a panel, button, knob or key (the white / aluminium plate) |
| `--gf-line` | hairlines: borders, scale ticks, grille holes, separators |
| `--gf-ink` | text, black keys, pointers, check marks, the focus ring on light faces |
| `--gf-muted` | printed labels and secondary text (must still reach 4.5:1) |
| `--gf-accent` | the single signal colour: primary button, "on", the `=` key, lamp lit, pointer |
| `--gf-accent-ink` | text and marks drawn on `--gf-accent` |
| `--gf-second` | second function colour (the ET 66's brown operator keys, secondary keys) |
| `--gf-trim` | dark or metal trim: the keypad body, knob caps, display bezels |

## Shared rules

- **Shape**: plates, fields and buttons get a 2px radius (Braun corners are tight, not pills).
  Keys, knobs, lamps and radios are full circles.
- **Border**: 1px solid `--gf-line`. No soft drop shadows at rest.
- **Relief**: only 1px lines that suggest a machined edge (`inset 0 -1px 0 --gf-line` on raised
  parts, `inset 0 1px 0 --gf-line` on recessed ones). Pressed = the relief flips and the part
  moves down 1px.
- **Type**: labels lowercase (the TS 45 is labelled in lowercase Akzidenz-Grotesk, per Fonts In
  Use), 11-12px, weight 500, letter-spacing about 0.02em, `--gf-muted`. User text
  (field values, body copy) stays in normal case, 14px, weight 400, `--gf-ink`. Numerals tabular.
- **Size**: controls 32px tall (28px dense); every hit area at least 24×24px.
- **Focus-visible**: `outline: 2px solid --gf-ink; outline-offset: 2px`. On dark plates
  (`--gf-trim`, `--gf-ink` keys) the ring is `--gf-surface`. Never the accent (yellow or green
  rings fail 3:1 on a light face).
- **Disabled**: `opacity: .45`, relief removed, `cursor: not-allowed`; the label stays readable.
- **Motion**: 80-150ms `ease-out` for presses and thumbs, nothing that loops except the
  indeterminate bar and a recording lamp; both stop under `prefers-reduced-motion`.

## Aqua's list, adapted

### Panel (`gf-panel`, in place of a window)
Borrows: the front plate of the TS 45 control unit and audio 2† (one flat face split into
zones), and the T 1000 lid, thick enough to hold the operating manual (Core77).
- Face `--gf-surface`, border 1px `--gf-line`, radius 2px, no shadow; padding 16px (24px roomy).
- **Label strip** instead of a title bar: 28px tall, `border-bottom: 1px solid --gf-line`,
  heading at 11px lowercase weight 500 `--gf-muted`, left-aligned like a model name; room on the
  right for a lamp or a small `gf-button`. The heading is a real `h2`.
- Zones inside are separated by 24px gaps or a 1px `--gf-line` rule, never by boxes in boxes.

### Push button and default / accent button
Borrows: the rows of small rectangular push keys on Braun receivers and the transport keys of
the tape and cassette decks†; the accent version is the ET 66 yellow `=` key, the one coloured
control on the face (V&A).
- 32px tall, min-width 64px, padding 0 14px, radius 2px, face `--gf-surface`, border
  `--gf-line`, relief `inset 0 -1px 0 --gf-line`; label 13px lowercase weight 500 `--gf-ink`.
- Hover: border `--gf-muted`. Active: `translateY(1px)`, relief flips to the inset top line,
  fill mixed 30% toward `--gf-line`. 80ms.
- Latching key (`aria-pressed="true"`): stays down and shows a 6px lamp in `--gf-accent` before
  the label, so the state shows by position and by the lamp, not by fill colour alone.
- Accent (`gf-button--accent`): fill and border `--gf-accent`, text `--gf-accent-ink`. One per
  panel, no pulse (unlike Aqua). Pressed: fill mixed 15% toward `--gf-ink`.

### Text field and text area
Borrows: the recessed display windows (the ET 66 display set into the body; the scale windows of
the radios).
- 32px tall, padding 0 10px, radius 2px, fill `--gf-page` (a well, darker than the face), border
  `--gf-line`, relief `inset 0 1px 0 --gf-line`; text 14px `--gf-ink`, placeholder `--gf-muted`.
- Label above at 11px lowercase `--gf-muted`, 4px gap.
- Hover: border `--gf-muted`. Focus-visible: border `--gf-ink` plus the shared ring.
- Invalid (`aria-invalid="true"`, `:user-invalid`): 2px left border `--gf-ink` plus the error
  note below (see Notes and errors); never a red border alone.
- Text area: min-height 96px, `resize: vertical`, line-height 1.5.

### Check box (with mixed state)
Borrows: the small square switch keys on hi-fi fronts†.
- Native `<input type="checkbox">` with `appearance: none`; 16px square, radius 2px, border 1px
  `--gf-ink`, fill `--gf-surface`; inside a `<label>` row at least 24px tall.
- Checked: fill `--gf-ink`, tick drawn in `--gf-surface` (clip-path or two borders).
  Mixed (`:indeterminate`): fill `--gf-ink`, an 8×2px bar in `--gf-surface`.
- Hover: border 2px. Active: inset 1px. Disabled as shared.

### Toggle switch
Borrows: the sliding on/off switches of SK 4-era sets and the Sixtant-era shavers†: a block that
moves, with the state printed beside it.
- Native checkbox with `role="switch"`. Track 36×20px, radius 2px (not a pill), fill `--gf-page`,
  border `--gf-line`; thumb 16×16px, radius 1px, `--gf-surface`, border `--gf-ink`, with two 1px
  grip lines in `--gf-line`.
- On: thumb moves right (120ms ease-out), track fill `--gf-accent`; printed `aus` / `ein` (or
  `off` / `on`) at 11px either side, the active word in `--gf-ink`, the other `--gf-muted`.

### Radio
Borrows: the round push keys of the RT 20, run in a horizontal line (Core77).
- 16px circle, border 1px `--gf-ink`, fill `--gf-surface`; checked: an 8px `--gf-ink` dot
  (scale from 0.6 to 1 in 80ms). Grouped in a `fieldset` with a lowercase legend.

### Select
Borrows: the band and source selectors (a field that names its current setting)†.
- Same box as a text field but with face `--gf-surface` and the raised relief (it is a control,
  not a well); a 6px triangle in `--gf-ink` 10px from the right; text 13px. The open list stays
  the browser's own.

### List box
Borrows: the printed station lists and scales, with one band picked out.
- `<select size>`: fill `--gf-page`, border `--gf-line`, radius 2px; rows 28px, padding 0 10px.
  Selected row: fill `--gf-ink`, text `--gf-surface`; focus ring on the whole box.

### Progress (normal and indeterminate)
Borrows: the tuning scale with its sliding pointer, and the counters of the tape decks†.
- `<progress>`: track 6px, radius 1px, fill `--gf-page`, border `--gf-line`, tick marks every
  10% from a `repeating-linear-gradient` in `--gf-line`; bar `--gf-ink`.
- Indeterminate: a 20%-wide `--gf-accent` segment (the tuning pointer) sweeping left and right,
  1.6s ease-in-out, alternate. Reduced motion: still segment in the middle plus visible text.

### Tabs (band selector)
Borrows: the band keys of the T 1000 and the TS 45† (u k m l), where pressing one key releases
the others.
- `role="tablist"` row of joined keys sharing 1px `--gf-line` borders, 32px tall, label 12px
  lowercase weight 500. Selected key sits pressed (inset relief, 1px down) and carries a 2px
  `--gf-ink` bar along its bottom edge; others raised. Panel below is a `gf-panel` body.
- Arrow keys move between tabs (your script, as in Aqua).

### Menu bar with drop-downs
Borrows: the T 1000 lid with its printed instructions; the label strip of the panel.
- Bar 32px, face `--gf-surface`, bottom border `--gf-line`; items 13px lowercase weight 500,
  padding 0 12px. Open item: pressed relief and a 2px `--gf-ink` bottom bar.
- List: `<details>` / `<summary>` as in Aqua. Face `--gf-surface`, border `--gf-line`,
  radius 2px, flat offset shadow `0 2px 0 --gf-line`; rows 28px; hover and focus fill
  `--gf-page`; ticked rows show a 6px `--gf-ink` dot; shortcuts right-aligned in `--gf-muted`;
  separators 1px `--gf-line`; disabled rows `--gf-muted`.

### Dialog
Borrows: the T 1000 lid again: a plate laid over the set, with its own label.
- `<dialog>` styled as a `gf-panel` with label strip, max-width 28rem, padding 24px, buttons
  right-aligned, the accent button last. Backdrop `--gf-ink` at 40% (`color-mix`).
- Opening: opacity 0 to 1 in 120ms; nothing under reduced motion.

### Group box
Borrows: the zoning of Braun receivers (control area on one side, reception on the other, as on
the regie 510, per Hifi-Wiki) with a small printed heading.
- `<fieldset>`: border 1px `--gf-line`, radius 2px, padding 16px; `<legend>` 11px lowercase
  weight 500 `--gf-muted`, padding 0 4px.

### Notes and errors
Borrows: the small printed instructions on lids and bases.
- Note: 12px `--gf-muted`, max 60ch.
- Error: 12px `--gf-ink`, weight 500, led by a 14px circle in `--gf-ink` with a `!` in
  `--gf-surface`; linked to the field by `aria-describedby`. The symbol and wording carry the
  meaning, so it works in any palette (see open questions on an error colour).

## Braun extras

### Slider (horizontal and vertical)
Borrows: the slim linear tuning scale with a sliding pointer on the SK 4 top plate† and the
fader-style tone controls on later Braun hi-fi†.
- Native `<input type="range">`. Track 2px `--gf-line` (or a 4px `--gf-page` groove with inset
  relief); ticks 1×6px `--gf-line` at each step, numerals 11px tabular `--gf-muted` at the ends
  and majors.
- Thumb: a rectangular tab 10×22px, radius 1px, face `--gf-surface`, border 1px `--gf-ink`,
  with a 1px centre line in `--gf-accent` (the pointer). Hover: border 2px. Active: face
  `--gf-page`. Focus-visible: ring around the thumb.
- Vertical: `writing-mode: vertical-lr; direction: rtl` (current browsers), so up means more.
- Motion: none; the thumb follows the pointer and the keys.

### Rotary knob (backed by a range input)
Borrows: the plain round knobs of the RT 20, stacked vertically (Core77), and the knobs of the
TS 45 and T 1000†: a flat cylinder with a single marker line.
- A 40px (large: 56px) circle, face `--gf-surface`, border 1px `--gf-line`, raised relief; a
  2×12px `--gf-ink` marker from the rim inward; optional cap disc in `--gf-trim`.
- Rotation from -135deg to +135deg, set from a `--gf-value` custom property (0-1). CSS cannot
  read an input's value, so a few lines of script copy it on `input` (as Aqua's tabs need script).
- Scale ring outside: ticks from a `repeating-conic-gradient` in `--gf-line`, numerals 0-10 at
  11px tabular.
- The real control is an `<input type="range">` laid over the knob (transparent, vertical so
  dragging up turns it up); arrows, Page Up/Down, Home and End work natively. Focus ring on the
  wrapper via `:focus-within`. Rotate with 80ms linear on key steps only.

### Indicator lamp
Borrows: the small round lamps on hi-fi fronts (power, stereo) and the record lamp of the tape
decks†.
- 8px inline (12px large) circle. Off: fill `--gf-page`, border 1px `--gf-line`. On: fill
  `--gf-accent`, plus a 2px halo of `--gf-accent` at 30% (`color-mix`).
- Always paired with a printed word (`ein`, `stereo`, `aufnahme`); `aria-hidden` on the dot, the
  word carries the state. Optional blink (1s, steps) stops under reduced motion.

### Scale / meter with numerals
Borrows: the long horizontal tuning scales of the T 1000 and TS 45† and the Braun clock dials
by Dietrich Lubs: clear numerals and a single coloured (yellow) seconds hand (MFAH).
- Linear: minor ticks 1×6px `--gf-line`, majors every fifth 1×10px `--gf-ink`, numerals 11px
  tabular centred under majors; a 2px `--gf-accent` pointer placed by `--gf-value`.
- Round (clock or gauge): ticks by `repeating-conic-gradient`, numerals positioned with
  `rotate()` / `translate()`, one hand in `--gf-accent`, the rest `--gf-ink`.
- Semantics: `<meter>` (or `<progress>`) underneath with a text value; pointer moves 200ms
  ease-out.

### Keypad key (ET 66 style)
Borrows: the ET 66 (Rams and Lubs, 1987): black body, round convex keys, black number keys,
brown operator keys, the yellow `=` at bottom right (V&A); a green group for other functions
(Port); the convex shape made pressing more pleasant (Museum Angewandte Kunst). The ET 44 used
round keys too†.
- Plate `--gf-trim`, padding 16px, grid gap 10px.
- Key: 40px circle (min 32px), `<button>`; numerals 15px weight 500. Convex look from a soft
  `radial-gradient` lighter at top-left (key colour mixed 15% toward `--gf-surface`).
- Number keys: fill `--gf-ink`, text `--gf-surface`. Operators: `--gf-second`, text
  `--gf-surface`. Equals: `--gf-accent`, text `--gf-accent-ink`.
- Active: `scale(.96)` and the gradient flattens, 60ms. Focus: 2px `--gf-surface` ring.
  Symbols get `aria-label` (`divide`, `multiply`).

### Speaker grille (CSS dots)
Borrows: the T 1000 dot grid staggered into a hexagonal pattern, taken from the SK 1 (Core77);
the perforated fronts of the L 2 speaker and the T 3 pocket radio†; the RT 20 grille of
horizontal lines inside a circle (Core77).
- Square grid: `radial-gradient(circle, --gf-line 1.5px, transparent 2px)` at 8px × 8px.
- Hex stagger: two such layers, the second offset by half a tile (4px, 7px) on 8×14px tiles.
- Lines: `repeating-linear-gradient` 1px `--gf-line` every 4px, clipped to a circle.
- Decorative only: `aria-hidden="true"`, no text on top. In forced colours it disappears,
  which is fine.

## Existing open-source work

No established Braun-style CSS library turned up; most work is single demos, agent skills or
framework-specific kits.

| Project | Licence | What's good | Reuse? |
|---|---|---|---|
| [rams-braun-ui](https://github.com/yangyue1974/rams-braun-ui) ([specimen](https://yangyue1974.github.io/rams-braun-ui/)) | MIT | Tokens and component specs taken from SK 4, ET 66, T 3, regie 510 photos: square-ish toggle, rectangular fader thumb, lowercase labels, no rest shadows | Yes with credit (keep the MIT notice); closest in spirit, good cross-check for sizes |
| [tactile-modernism](https://github.com/cipriantitire/tactile-modernism) ([kit](https://tactile-ui.me/kit)) | MIT | Agent skill: "interfaces the way Braun made radios", aluminium or graphite, colour only for state | Ideas; code with credit |
| [BraunUI](https://github.com/CodeInPas/BraunUI) | MIT | Detailed knob, switch and meter drawing for Lazarus/FPC desktop apps | Not web; drawing logic only, with credit |
| [Timeless Braun clock](https://github.com/asiffisa/Timeless-braun_clock) ([demo](https://timelessc.vercel.app/)) | MIT | BC 26-style analogue clock in React | Dial geometry with credit; we stay plain CSS |
| [braun-radio](https://github.com/acchuang/braun-radio) ([demo](https://braun-radio.pages.dev)) | MIT | Interactive 3D RT 20 and others | For the three.js task (`three.md`), with credit |
| [phono-theme](https://github.com/cbettinger/phono-theme) | ISC | Window-manager palette after the Braun regie units | Palette reference only |
| [andeus-design](https://github.com/ardey26/andeus-design) ([site](https://andeus.design)) | none stated | React kit, Braun / Teenage Engineering look: perforated grilles, detent-free fader | Look only; no licence means no reuse |
| [takt](https://github.com/ardey26/takt) ([site](https://takt-ui.app/)) | none stated | Svelte 5 + Tailwind kit inspired by Rams | Look only |
| [Pure-HTML-and-CSS-Braun-Clock](https://github.com/Pedro98nt/Pure-HTML-and-CSS-Braun-Clock) | none stated | Pure CSS Braun clock | Look only |
| [Drams](https://drams.framer.website/) | not stated | Framer buttons, switches, sliders, dials after the ten principles | Look only |
| [Soft UI calculator](https://designmicka.gumroad.com/l/softui) | not stated | Figma file after the ET 66 | Look only |
| [tenprinciples.design](https://github.com/joe-bell/tenprinciples.design) | Apache-2.0 | Site on the ten principles | Text context, with notice |
| [dieter-rams-10-applied-to-software](https://github.com/zedr/dieter-rams-10-applied-to-software) | CC0-1.0 | Principles restated for software | Free to reuse (no visuals) |

## Accessibility notes

- **Native elements under every look**: `<button>`, checkbox and radio with `appearance: none`
  (they keep their roles), checkbox `role="switch"` for toggles, `<select>`, `<select size>`,
  `<progress>`, `<meter>`, `<input type="range">` under sliders and knobs, `<details>` menus,
  `<dialog>`, `<fieldset>` / `<legend>`. Nothing is a bare `div` with a click handler.
- **Targets of 24×24px at least** (WCAG 2.5.8): 16px boxes and radios sit in label rows 24px+
  tall; knobs 40px, keys 32-40px, thumbs 10×22px plus padding on the input.
- **Focus ring 3:1**: 2px `--gf-ink` on light faces, `--gf-surface` on dark plates, 2px offset;
  check against both the control and the background (WCAG 1.4.11, 2.4.13). The accent never
  draws the ring.
- **Colour is never the only signal** (WCAG 1.4.1), as on Braun sets where position and print
  did the work: switches show position plus `ein` / `aus`; tabs and latching keys sit pressed
  plus a bar or lamp; lamps always have a word; errors have a symbol and text; the `=` key has
  its glyph and corner position.
- **Labels**: lowercase is set in the markup or by `text-transform`; accessible names stay real
  words. Small 11px labels in `--gf-muted` must still reach 4.5:1 on `--gf-surface` and
  `--gf-page`.
- **Knob**: the range input gives the name, value and keys; add `aria-valuetext` with units.
- **Motion**: indeterminate sweep and lamp blink stop under `prefers-reduced-motion`.
- **Forced colours**: keep state in borders, outlines and shapes (system colours replace fills);
  ticks and grilles drawn as backgrounds may vanish, so no state lives only in them.

## Open questions for the user

- Error colour: the shared tokens have none. Errors here rely on a symbol and text; add a
  `--gf-error` (a Braun record red) or keep it monochrome?
- Should the accent be one hue per palette (yellow `=` style) or should `--gf-second` (green
  "on", brown keys) appear outside the keypad as well?

## Sources

- Core77, A History of Braun Design, part 3 (T 1000 grille and lid, RT 20 knobs and grille):
  https://www.core77.com/posts/24768/A-History-of-Braun-Design-Part-3-Audio-Products
- V&A, ET 66 calculator record (key colours, yellow `=`): https://collections.vam.ac.uk/item/O1360553
- Port Magazine, Mark Adams on the ET 66 (colour groups): https://www.port-magazine.com/?p=879
- Museum Angewandte Kunst, ET 66 (convex keys):
  https://sammlung-digital.museumangewandtekunst.de/detailpage/collection/8aaba9e5-2b9b-47ac-b304-11074467d180
- Centre Pompidou, Calculatrice ET 66: https://www.centrepompidou.fr/fr/ressources/oeuvre/cX4y7Bj
- Brooklyn Museum, World Receiver T 1000 (aluminium, 1963): https://www.brooklynmuseum.org/objects/170035
- Radiomuseum, T 1000: https://www.radiomuseum.org/r/braun_weltempfaenger_t1000.html
- Radiomuseum, SK 4: https://www.radiomuseum.org/r/braun_phonosuper_sk4.html
- museum-digital, SK 4 (plain controls, Gugelot shell): https://bawue.museum-digital.de/pdf/object/71478.pdf?lang=en
- Fonts In Use, Braun TS 45 (Akzidenz-Grotesk, lowercase): https://fontsinuse.com/uses/6945/braun-ts-45-control-unit
- braunaudio.de, the wall unit (TS 45, TG 60, L 450): https://braunaudio.de/en/?p=11600
- LACMA, T3 transistor radio: https://collections.lacma.org/object/242170
- Hifi-Wiki, Braun regie 520 / 510 (control area left, reception right):
  https://hifi-wiki.com/index.php/Brown_Direction_520
- MFAH shop, BC02 after the AB 1 (yellow seconds hand): https://mfashop.mfah.org/products/braun-travel-alarm-clock-bc02-red
- Design+Design, Braun table clocks: https://www.designundtext.com/en/2.1.51_braun-design-table-clocks-english-bdd.php
- WCAG 2.2 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2 Focus Appearance: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- WCAG 2.2 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- ARIA APG, Switch and Tabs patterns: https://www.w3.org/WAI/ARIA/apg/patterns/switch/ and
  https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- MDN, range input (vertical via writing-mode):
  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
