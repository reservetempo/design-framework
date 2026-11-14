# Gute Form: realism research

How each `gf-` control should look as a physical Braun part at "product photo" strength: soft shadows, real curves, a
faint sheen, fine textures; calm and readable, never heavy. This note adds the physical facts; `components.md` already
maps each component to its source and gives sizes and states, and `visual.md` section 3 lists the materials and
colours. It replaces one shared rule in `components.md` ("no soft drop shadows at rest", relief by 1px lines only);
radii, sizes, type and focus rules stay.

Facts marked † come from photos or general knowledge, not a written source. Check before quoting.

## Light and scale

- Light comes FROM (`--gf-light-x`, `--gf-light-y`), each -1 to 1 (default -0.35, -0.8: upper left).
- Helpers: `--gf-sx: calc(var(--gf-light-x) * -1)`, `--gf-sy: calc(var(--gf-light-y) * -1)` (the way shadows fall) and
  `--gf-light-angle: atan2(var(--gf-sx), var(--gf-light-y))`, a `linear-gradient` angle that starts on the lit side
  and ends on the far side (default about 156deg).
- **Raised part**: cast shadow outside at `calc(var(--gf-sx) * Dpx) calc(var(--gf-sy) * Dpx)`; a light inset line with
  the same offset signs (it lands on the lit edge); a dark inset line with the light's own signs (the far edge).
- **Recessed part** (window, slot, hole): the reverse. Dark inset with the shadow signs (the lip nearest the light
  shades the well), light inset line with the light's signs (far lip catches light).
- Scale: 2px is about 1mm, so a 32px key is a 16mm key. Heights below are given as D, the px of shadow offset at full
  light; never go above D 12 except for the dialog.
- The values change on scroll, so keep to two or three shadows per control and no `filter` blur.

## Objects and physical facts

### Panel and plate
Copy: the SK 4 body for the panel, the audio / TS 45 cover plate for the label strip.
- SK 4: lacquered sheet-metal housing with punched ventilation and speaker slots, wooden side walls in reddish elm
  veneer, acrylic lid (de.wikipedia). Lacquer is a satin white†: one broad, very faint sheen, no mirror reflections.
  Folded edges have a radius of about 1mm† (keep 2px).
- The elm cheeks are about 15mm thick and stand about 1mm proud of the metal†: an optional 10-12px elm band on the
  panel's left and right edge, D 1, grain running along the band†.
- Audio series: steel-sheet casing in white or graphite with a cover plate of silver anodised aluminium, casings with
  hard edges (Design+Design). The plate sits flush: a hairline joint, no step. Matt anodised aluminium has a fine
  straight brush along its length† and a soft wide sheen.
- Shadow: the panel is a product on a backdrop. Contact shadow D 1, blur 2px, 20%; cast shadow D 12, blur 32px, 12%.
  Printing (label strip) is flat ink, no emboss.

### Push key (plain, accent, latching with lamp)
Copy: the SK 4 push keys (all its knobs and keys are light grey, de.wikipedia); accent from the TS 45 green mains
signal key and the ET 66 yellow key; lamp from the audio 2.
- Rectangular bar of matt light-grey plastic, corner radius about 1mm, top edges rounded over by about 0.5mm†. Stands
  about 2mm proud (D 4); the gap around it is a dark slot 1px wide†.
- Light: matt, so only a gentle fall from lit side to far side (4% lighter to 4% darker), a 1px light line on the lit
  edges at 50%, a 1px dark line on the far edges at 15%. Cast shadow D 4, blur 5px, 22%.
- Press: travel about 3mm†. Pressed: `translate` by the shadow direction times 1px, cast shadow drops to D 1, blur
  1px, face 3% darker. Latched: stays at D 2 (half way down)†.
- Accent: colour means function. Braun's chart gave power keys leaf green, FM keys blood orange, phono keys honey
  yellow (Rams Foundation). Same body, coloured plastic, slightly glossier†.
- Lamp in a latching key: a 6px lens set into the face (see Lamp). Labels on real sets are printed on the plate beside
  the key†; a label on the key is flat ink in `--gf-ink`, no emboss.

### Text field and text area (display windows)
Copy: the SK 4 scale slot and the ET 66 display window.
- SK 4: a narrow scale printed on paper and glued to the chassis, seen through a slot in the top plate†; from the SK
  4/2 printed straight on the metal; type to Otl Aicher's rules (de.wikipedia).
- Shape: a window cut in the plate, sharp 1px-radius corners, the surface 1-1.5mm below (D 2-3)†, with a clear cover
  flush with the plate on the ET 66†.
- Light: lip shadow inside on the lit side (inset D 2, blur 3px, 25%), 1px light line on the far lip at 60% white,
  paper-warm fill (`--gf-page`). Optional glass: one diagonal band at `--gf-light-angle`, 5% white, 30% wide. Focus
  keeps the ink outline; no glow.
- Text area: the same window, taller; no glass band (it would cross several lines of text).

### Check box, radio, toggle switch
- **Check box**. Copy: a small square latching key†. Off: raised D 2, matt face. On: sunk to D 0 with a 1px inner lip
  shadow on the lit side, mark in flat ink. Mixed: sunk, with a bar.
- **Radio**. Copy: the RT 20's round buttons in a horizontal row (Core77), in melamine (dealer listing), with gently
  sloping faces (Cooper Hewitt). Low dome: radial sheen centred at `calc(50% + var(--gf-light-x) * 25%)` / `calc(50% +
  var(--gf-light-y) * 25%)`, 12% white, gone by 60%; far rim 8% darker. Raised D 3; checked sits at D 1 and shows the
  dot. One down frees the rest†.
- **Toggle**. Copy: the black tumbler switch of the TS 40 (Design+Design), drawn as a slide switch†. A slot milled in
  the plate (recessed D 2, floor at 80% ink), holding a block 14-16px wide that stands D 3 proud with three 1px grip
  ribs†. On: leaf green shows on the slot floor beside the block (state by position and colour). Travel is the slot
  length; 120ms.

### Select and list box
- **Select**. Copy: a band selector: a raised key face (as Push key, D 3) carrying its setting, with a small recessed
  well (D 1) on the right holding the chevron†.
- **List box**. Copy: the T 1000's large printed scale (graphics by Dietrich Lubs, Design+Design) behind a window:
  recess as Text field (D 3). Rows are print on the scale card; the selected row is an ink band lying on the card, no
  relief; hover a 6% ink tint.

### Progress
Copy: the SK 4 tuning slot with its pointer†. A slot 6-8px tall recessed D 2 (lip shadow 30%, far-lip light line 50%),
ticks printed on the floor. The fill is a flat matt ribbon in `--gf-accent` lying on the floor: no gloss, no stripes;
its leading end gets a 1px darker line. Indeterminate: a short ribbon sliding under the lip shadow.

### Tabs (band keys)
Copy: the wave-band push buttons set beside the scales on the audio sets (Design+Design) and the T 1000 keys, where
the FM key is red and matches the red scale print (Design+Design).
- A row of Push keys sharing one dark slot (1px gaps), each D 4. The selected key is latched at D 1 with a lip shadow
  on its lit side from the neighbour; pressing another releases it.
- The tab panel below is the plate itself: no extra border between the pressed key and its panel.
- Accent only as a 2px ink or `--gf-accent` bar printed under the selected key's label.

### Menu bar and menus
Copy: the T 1000 front lid: matt anodised aluminium, held by a ball lock, the instructions printed on its inner side
(Design+Design).
- Bar: a strip of the cover plate (brushed aluminium recipe), flush, 1px dark joint line below.
- Menu: a thin (1mm) aluminium sheet floating above the set: 1px light line on lit edges at 60%, contact shadow D 1
  blur 2px 20%, cast shadow D 6 blur 16px 18%. Items are print; the highlighted item is an ink band with reversed
  text; separators are scored lines (see Group box).

### Dialog
Copy: the SK 4's clear acrylic lid lowered over the set, and the T 1000 lid as a separate plate.
- The plate is lacquered steel (as Panel) lifted well clear: contact shadow D 2 blur 4px 18%, cast shadow D 16 blur
  40px 22%. Backdrop: `--gf-ink` at 30%, no blur (smoked acrylic)†.

### Group box
Copy: zones printed or scored on one plate (see `components.md`). No raised or sunken box. Draw a scored line: 1px
dark at 12% with a 1px light line at 50% on its far side. Heading is flat print.

### Slider
Copy: the lever controls of the audio 300 (Design+Design) and later Braun faders†.
- Track: a slot milled through the aluminium plate, 4px wide, recessed D 2, near-black floor, lip shadow 35%, far-lip
  light line 60%. Ticks printed on the plate beside it, not in it.
- Thumb: a grey plastic cap about 6 x 10mm (12 x 20px), radius 1px, standing 2.5mm proud (D 5): cast shadow D 5 blur
  6px 24%, 1px lit-edge line, a centre index line 1px in `--gf-ink`†.
- Drag: no change in height; active adds 3% darkening only.

### Rotary knob
Copy: the plain round knobs of the RT 20 (in a vertical row, Core77) and the grey knobs of the audio sets, matched to
casing and plate (Design+Design). Marker from the SK 55: a white tuning knob with one orange-red dot (de.wikipedia).
The T 52's knobs are set off from the body (Rams Foundation), so a knob always shows a gap and a shadow.
- Shape: straight-sided cylinder, about 20mm across and 10-12mm tall†, flat or barely domed top with a 0.5mm chamfer†.
  Seen from the front: a disc, plus the side wall as a 2px crescent on the far side, 15% darker than the top.
- Light: matt plastic: linear sheen at `--gf-light-angle`, +6% to -6%; chamfer as a 1px ring, light at 50% on the lit
  half, dark at 15% on the far half. Metal-capped variant†: add a `conic-gradient` of four soft bands at 8% (spun
  aluminium), rotated to the light angle.
- Shadow: the tallest part on the plate (height capped at D 8 to stay calm). Contact D 1 blur 2px 25%; cast D 8 blur
  10px 22%.
- Marker: a 1px engraved line (dark, 1px light line on its far side) or a 4px dot, in `--gf-accent`. Only the marker
  turns; sheen and shadows stay fixed to the light.

### Lamp
Copy: the green lamp of the audio 2 that lights on stereo reception and the enlarged power indicator of the audio 300
(Design+Design); warm yellow for dial light as on the RT 20 (Rams Foundation).
- A domed lens 3-4mm across (6-8px) in a hole with a 1px dark chamfer ring†, standing D 1.
- Off: lens at 35% of its colour mixed with `--gf-trim`, a 2px specular dot at 45% white placed toward the light, far
  rim 20% darker. On: core colour +15% lightness, inner radial glow, halo 0 0 4px at 45%, spill on the plate 0 0 10px
  at 15%. The specular dot stays. No flicker.

### Scale or meter
Copy: the T 1000 scale (large, clear, Lubs graphics, red for FM, Design+Design) and the Lubs clock dials with the
yellow second hand (Rams Foundation).
- A printed card behind a window: recess as Text field (D 3) plus the glass band (5% white).
- Marks are flat print: ticks 1px `--gf-line`, numerals `--gf-ink`, tabular; one colour run.
- Pointer: a 1px (2px on hover) rod riding 1mm above the card†: its own shadow at D 2, blur 1px, 30%, so it parts from
  the print as the light moves. That shadow is what makes the meter real.

### Calculator keys (ET 66)
Copy: the ET 66 (13.7 x 7.8 x 1.1cm, dyed plastic; Museum Angewandte Kunst).
- Round convex keys; number keys high-gloss black; function keys brown and muted green; on/off a brighter green with
  red; the sum key yellow (Museum Angewandte Kunst). Number keys are polished, the function keys a little more matt;
  numerals are moulded in, not printed (Port). Convex keys throw highlights (Rams Foundation, on the ET 22).
- Size: about 10mm across on a 14mm pitch† (20px keys, 28px pitch), standing 1.5mm (D 3) from a matt black body†. Each
  key sits in a hole with a 1px dark gap ring.
- Light: gloss dome: a small sharp highlight (radial, 30% of the key wide, 28% white at centre, gone by 70%) placed
  22% toward the light, plus a broad 8% sheen; far rim 25% darker; a thin 10% rim light on the far edge†. Function
  keys: highlight 14% and twice as wide.
- Press: travel about 1mm†: D 3 to D 1, highlight shifts 1px with the key. Legend: flat white (or ink on yellow),
  never embossed. Body: matt anthracite, no sheen beyond 3%.

### Grille (T 3, RT 20, SK 4)
- **T 3**: plastic case, 8.3 x 14.9 x 4.1cm (LACMA), off-white†. A square field of small round holes on a square grid†
  (4px holes, 8px pitch). Each hole: near-black core, a dark crescent on the lit side and a light crescent (40% white)
  on the far inner wall, done with one `radial-gradient` whose dark centre is shifted 0.5px toward the light.
- **RT 20**: parallel slots clipped to a circle (Core77) in a painted steel front, off-white or anthracite (Rams
  Foundation). Slots 2px, pitch 5px; direction†: check a photo. Punched steel: 1px light line on each slot's far lip
  at 50%.
- **SK 4**: long punched slots in the lacquered sheet (de.wikipedia), about 3mm wide with rounded ends, in ranks†; the
  SK 55 evened the slot lengths and added a centre bar (de.wikipedia). Slots 3px, pitch 6px, radius 1.5px; lip shadow
  35% on the lit side, far-lip light line 60%.
- Grilles are never interactive and get no cast shadow: they are holes, not parts.

## CSS recipes

Values are for the light palettes; on dark faces halve the highlights and add a third to the shadows. D and the offset
signs are defined under "Light and scale".

- **White lacquered steel** (panel, dialog). Base `--gf-surface`. Sheen: `linear-gradient` at `--gf-light-angle`,
  white 5% at the start, clear by 45%, black 3% at the end. Edge: inset 1px line on the lit edges, white 70%. Contact:
  D 1, blur 2px, 20%. Cast: D 12, blur 32px, 12% (dialog D 16, blur 40px, 22%).
- **Anodised aluminium** (cover plate, menu bar, menus). Base `--gf-trim` in its light form (about `#b7babc`). Sheen
  as above at 8% and 5%. Brush: `repeating-linear-gradient(90deg, ...)` with a 1px white line at 4% every 3px, and a
  second layer with a 2px black line at 3% every 7px. Edge: inset 1px lit line, white 60%, and inset 1px far line,
  black 15%. Contact: D 1, blur 2px, 20%. Cast: none when flush; a menu gets D 6, blur 16px, 18%.
- **Elm veneer** (side bands). Base `#b98d63`. Grain: three stacked `repeating-linear-gradient`s along the band at
  0deg, 1deg and -1.5deg with periods of 7px, 13px and 29px, in `#7a5233` at 10%, 7% and 5%, so the lines never line
  up (elm grain is bold and wavy†). For more, an inline SVG `feTurbulence` (`baseFrequency="0.015 0.5"`, 2 octaves) as
  a data-URI at 15%. Sheen 4% only. Edge: 1px lit line, white 25%. Contact: D 1, blur 1px, 25%. No cast shadow (fixed
  to the body).
- **Matt plastic** (keys, knobs, thumbs, check box). Base `--gf-surface` mixed 6% toward `--gf-line`. Sheen:
  `linear-gradient` at `--gf-light-angle`, white 4% to black 4%. Edge: inset 1px lit line, white 50%; inset 1px far
  line, black 15%. Contact: D 1, blur 1px, 25%. Cast: key D 4, blur 5px, 22%; thumb D 5, blur 6px, 24%; knob D 8, blur
  10px, 22%.
- **Gloss plastic** (ET 66 keys, radio dome at half strength). Base: the key colour. Sheen: a `radial-gradient`
  highlight, white 28% at its centre, 30% of the key wide, centred 22% toward the light, over a broad radial sheen of
  white 8%. Edge: far rim darkened with an inset shadow (light's signs, 2px offset, blur 3px, black 25%). Contact: D
  1, blur 1px, 35%. Cast: D 3, blur 4px, 30%.
- **Shrink lacquer / matt black body** (keypad body, dark palette panel; the audio 250 / 300 came in white or
  anthracite shrink lacquer, a fine wrinkle finish, Design+Design). Base `--gf-trim` dark. Texture: SVG `feTurbulence`
  noise (`baseFrequency="1.2"`) at 4-5%. Sheen 3% at most. Edge: inset 1px lit line, white 12%. Contact: D 1, blur
  2px, 35%. Cast: D 12, blur 32px, 25%.
- **Window, slot or hole** (field, scale, track, grille). Base `--gf-page`, or near-black for slots and holes. Lip
  shadow: inset, shadow signs, D 2, blur 3px, 25-35%. Far lip: inset 1px line, light's signs, white 60%. Glass
  (optional): one band at `--gf-light-angle`, white 5%, 30% wide. No cast shadow.
- **Lamp lens**. Gloss plastic recipe at 6-8px, plus the glow layers listed under Lamp when lit.

Rules for all of them:
- **Pressed**: move by `calc(var(--gf-sx) * 1px)`, `calc(var(--gf-sy) * 1px)`; cast shadow to D 1, blur 1px; sheen
  unchanged; 80ms. The shrinking shadow does the work, not a colour change.
- **Printing**: always flat. No text-shadow, no emboss; engraving only for knob and thumb indexes.
- **Limits**: sheen never above 8% white under text (4.5:1 must hold); one sharp highlight per part and only on gloss
  plastic and lamps; under `forced-colors` drop gradients and keep borders; disabled parts lose the cast shadow and
  the sheen.

## Sources

- Wikipedia (de), Braun SK 4 (lacquered sheet metal, punched slots, elm veneer, acrylic lid, light grey controls,
  paper scale, SK 55 changes): https://de.wikipedia.org/wiki/Braun_SK_4
- V&A, SK 55 record (metal, wood, acrylic): https://collections.vam.ac.uk/item/O168285
- Design+Design (Jatzke-Wigand), Braun audio part 1 (steel casing, anodised aluminium plate, grey knobs, TS 40 / TS 45
  switches, audio 2 lamp, shrink lacquer, audio 300 levers):
  https://www.designundtext.com/en/2.1.63_braun-design-audio-part1-lindinger-rams-pbdd.php
- Design+Design, T 1000 (matt anodised aluminium, lid on ball lock, Lubs scale, red FM marks):
  https://www.designundtext.com/en/2.1.2_braun-design-t1000-rams-pbdd.php
- Rams Foundation, colour (function colour chart, RT 20 finishes, metal finishes, convex keys):
  https://rams-foundation.org/?p=7213
- Museum Angewandte Kunst, ET 66 (size, key finishes and colours):
  https://sammlung-digital.museumangewandtekunst.de/detailpage/collection/8aaba9e5-2b9b-47ac-b304-11074467d180
- Port Magazine on the ET 66 (polished number keys, moulded numerals): https://www.port-magazine.com/?p=879
- V&A, ET 66 record (black plastic, sliding sleeve): https://collections.vam.ac.uk/item/O1360553
- Core77, A History of Braun Design, part 3 (RT 20 knobs, buttons and grille; T 1000 lid):
  https://www.core77.com/posts/24768/A-History-of-Braun-Design-Part-3-Audio-Products
- Cooper Hewitt, RT 20 record (beech, plastic; sloping knobs and buttons; read from a search summary, the page now
  redirects†): https://collection.cooperhewitt.org/objects/18621807
- Chairish dealer listing, RT 20 (graphite-lacquered sheet iron, pear case, melamine buttons):
  https://www.chairish.com/product/24288252/rt-20-table-radio-by-dieter-rams-for-braun-ag-germany-1961
- LACMA, T 3 record (plastic, dimensions): https://collections.lacma.org/object/242170
- MDN, `atan2()`: https://developer.mozilla.org/en-US/docs/Web/CSS/atan2
