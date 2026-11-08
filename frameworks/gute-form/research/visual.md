# Gute Form: visual research

Notes for the Gute Form framework (prefix `gf-`): where the style comes from, which visual traits carry over to a UI, materials, type, and six palette candidates with computed contrast. The palettes in section 5 use the nine tokens the later tasks expect as `--gf-<name>`.

## 1. Short history

### Where "gute Form" comes from

- **Max Bill and the Swiss Werkbund, 1949.** Bill (Bauhaus-trained architect, artist and designer) put together the touring exhibition *Die gute Form* for the Swiss Werkbund (SWB). It opened at the Basel Mustermesse trade fair in 1949: 80 panels of everyday goods from many countries, chosen as examples of good design. It started a long debate in Switzerland and abroad.
- **Bill's criteria**, in short: an object should do its job, be true to its material, suit the way it is made, and bring these together into a convincing form.
- **The award.** In the early 1950s the SWB and the Basel fair began picking out well-designed products shown at the fair under the same name (a 1953 poster in the Zurich University of the Arts archive lists the objects awarded that year). Swiss design histories usually date the award from 1952 to the late 1960s; the exact years were not confirmed in this research.
- In West Germany the phrase came to mean the sober, functional product culture of the 1950s-70s, with Ulm and Braun as its centre. In the 1980s younger designers (Memphis, "Neues Deutsches Design") attacked it as dogmatic, which is partly why it now reads as a period style.

### The Ulm School of Design (HfG Ulm, 1953-68)

- Founded by Inge Aicher-Scholl, Otl Aicher and Max Bill; teaching started in 1953 and Bill's own campus buildings on the Kuhberg opened in 1955. Bill was the first rector and saw the school as a successor to the Bauhaus.
- After Bill left (1956-57) the school, led by Tomás Maldonado, Aicher and others, moved towards method, science and systems rather than art. Hans Gugelot ran product design and pushed modular, stackable "systems" of parts.
- Ulm objects: the Ulm stool (Bill, Gugelot and Paul Hildinger, 1954), Braun radios with Gugelot, Aicher's identities for Braun and Lufthansa (Development Group E5, 1962).
- The school closed in 1968 when state funding was withdrawn.

### Braun from 1955

- After Max Braun died in 1951, his sons **Erwin and Artur Braun** ran the Frankfurt company. Erwin brought in **Fritz Eichler** to set design policy, and commissioned **Hans Gugelot** and the HfG Ulm to redesign the radios. **Otl Aicher** worked on Braun's graphics and fair stands, and **Wilhelm Wagenfeld** designed the 1955 *combi* portable radio-phonograph.
- At the **1955 Düsseldorf radio fair** Braun showed a whole radio, phono and TV range redesigned in about eight months; this is usually taken as the birth of "Braun Design".
- **Dieter Rams** joined in 1955 as an architect and interior designer. With Gugelot he designed the **SK 4** radio-phonograph (1956), nicknamed "Snow White's coffin" for its clear lid. Rams led Braun design from 1961 to 1995; Dietrich Lubs (calculators, clocks), Reinhold Weiss and others worked in his team. Outside Braun, the firm Niels Vitsœ and Otto Zapf set up in 1959 (today Vitsœ) made his furniture, starting with the **606 shelving system** (1960).
- Rams's motto *weniger, aber besser* ("less, but better") is also the title of his 1995 book.

### Rams's ten principles (paraphrased)

Rams wrote these in the late 1970s, asking himself whether his own work was good design. In brief, good design:

1. is **innovative**: it develops with new technology, never as an end in itself;
2. makes a product **useful**: function first, with nothing that gets in the way of it;
3. is **aesthetic**: well-made objects that people live with every day should be beautiful;
4. makes a product **understandable**: the object explains itself;
5. is **unobtrusive**: products are tools, neutral and restrained, leaving room for the user;
6. is **honest**: it does not pretend to be more valuable or powerful than it is;
7. is **long-lasting**: it avoids fashion, so it does not date;
8. is **thorough down to the last detail**: nothing is left to chance;
9. is **environmentally friendly**: it saves resources and avoids visual clutter;
10. is **as little design as possible**: back to the essential, "less, but better".

## 2. Visual traits that carry over to UI

| Trait | On the objects | In the UI |
| --- | --- | --- |
| Grid and proportion | Front panels laid out on a strict grid; Gugelot's stackable G 11 / G 12 share one width; the 606 shelf is a system of equal modules | 8 px base unit, 12-column grid, components sized in whole units; cards in a set share heights |
| Generous margins | Large plain areas of white or grey around a small cluster of controls | Wide page gutters, padding of 24-32 px in panels, few elements per screen |
| Strict alignment | Knobs, slots and labels sit on shared axes; nothing floats | Left-aligned text, labels and controls on one baseline grid, no centred body text |
| Colour only for function | Bodies are white, grey or black; colour marks a control (the yellow equals key and brown operator keys of the ET 66, a green or orange power switch) | Neutral greys everywhere; `accent` only on the main action or an "on" state, `second` for one other state; never decorative |
| Small lowercase labels | Control names printed small, often lowercase, in a plain grotesque, right next to the control | Labels 11-13 px, lowercase, medium weight, slight tracking (+0.02em), muted colour |
| Scales and numerals | Tuning scales with fine ticks and small numerals; calculator and clock faces | Tick-mark range sliders, meters, tabular numerals (`font-variant-numeric: tabular-nums`) |
| Perforated grilles | Fields of round holes (T 3 front), rows of slots (SK 4 speaker), shaver foil mesh | A dot-grid pattern (`radial-gradient`) for empty states, decorative speaker panels, progress dots |
| Rounded-square corners | Sheet metal bent with tight radii; calculators and pocket radios with small radii; round keys | Radius 2-4 px on panels, 4-6 px on buttons, fully round knobs and toggles; never pill-shaped panels |
| Flat planes, fine seams | Panels meet with thin, precise joints; no ornament or chrome trim | 1 px `line` borders, no heavy shadows (at most one soft shadow), no gradients except on knobs |
| Controls as objects | Round knobs, slider tracks, push keys with slight concavity | Toggle and dial components with a pressed state that sinks 1 px rather than changing colour |

## 3. Materials and finishes

| Material | Where | Colour cue | UI use |
| --- | --- | --- | --- |
| White and light-grey lacquered metal | SK 4 body, radio cases, Braun hi-fi | warm white `#f4f2ec`, light grey `#e7e4dc` | `page` and `surface` in the light palettes |
| Anodised aluminium | TP 1 slipcase, 606 E-tracks, T 1000 world receiver, Braun hi-fi fronts | satin silver `#a8acaf` to `#b7babc` | `trim`, slider tracks, a fine brushed texture at very low opacity |
| Perspex / Plexiglas lids | SK 4 lid, record-player covers | clear, slightly grey | translucent overlays: `surface` at about 80% opacity with a 1 px `line` edge, no blur |
| Light wood (elm, ash, beech) | SK 4 side panels (elm), 606 shelves in beech, Ulm stool (spruce/beech) | elm `#b98d63`, beech `#d4b48c` | `trim` on 3D models and the occasional wood band; never as large UI fills |
| White and grey plastics | T 3 and TP 1 cases, shavers, kitchen appliances | off-white `#f2f2f0`, cool grey `#e3e4e2` | `surface` |
| Anthracite / black plastic | ET 66, sixtant shaver, later hi-fi, clocks | `#161616` to `#2e2f30` | dark palette, primary buttons in the SK 4 palette |
| Leather | TP 1 strap | tan `#8b5e3c` | `second` in the TP 1 palette |

## 4. Typography

### What Braun and Ulm used

- **Braun logo**: the wordmark with the raised central A goes back to Will Münch (1934); Wolfgang Schmittel redrew it in 1952 as a geometric, solid-black mark. It is a trademark: don't copy it.
- **Akzidenz-Grotesk** (Berthold, 1898) became Braun's standard sans for print and product graphics from the mid-1950s; some accounts credit Otl Aicher with bringing it in. Some control labels used other grotesques.
- **Helvetica** (1957) arrived later; Aicher's 1962 Lufthansa wordmark used it.
- **Univers** (Adrian Frutiger, 1957) was Aicher's face for the Munich 1972 Olympics; his own **Rotis** family followed in 1988.
- All of these are commercial, so the framework needs a free substitute.

### Free, self-hostable alternatives

| Family | Designer | Licence | Character | woff2 source |
| --- | --- | --- | --- | --- |
| **Inter** | Rasmus Andersson | SIL OFL 1.1 | Neutral, Helvetica-like UI grotesque; large x-height; tabular numerals and many OpenType features; variable 100-900 | Fontsource: `https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-wght-normal.woff2` (npm `@fontsource-variable/inter`) |
| **Hanken Grotesk** | Alfredo Marco Pradil, Hanken Design Co. | SIL OFL 1.1 | Slightly geometric, airy grotesque; good for light headings; variable 100-900 | Fontsource: `https://cdn.jsdelivr.net/fontsource/fonts/hanken-grotesk@latest/latin-400-normal.woff2` |
| **Schibsted Grotesk** | Bakken & Bæck, Henrik Kongsvoll | SIL OFL 1.1 | Closest in feel to Akzidenz: compact, slightly irregular grotesque; 400-900 | Fontsource: `https://cdn.jsdelivr.net/fontsource/fonts/schibsted-grotesk@latest/latin-400-normal.woff2` |
| **Instrument Sans** | Rodrigo Fuenzalida, Jordan Egstad | SIL OFL 1.1 | Neat, narrow-ish grotesque, a little more contemporary; 400-700 | Fontsource: `https://cdn.jsdelivr.net/fontsource/fonts/instrument-sans@latest/latin-400-normal.woff2` |

All four are also on Google Fonts. For the framework, download the woff2 once and serve it from `frameworks/gute-form/fonts/` with the OFL text next to it, rather than linking the CDN at runtime.

### Recommendation

Use **Inter** (variable, SIL OFL 1.1) for both headings and text. It is the most neutral of the four, it has true tabular numerals for scales, meters and calculator-style readouts, and it stays legible at the small lowercase label sizes the style needs. Suggested use: text 400, labels 500 at 11-13 px with +0.02em tracking, headings 500-600 with -0.01em tracking (Braun graphics rarely went bold). Fallback stack: `Inter, "Helvetica Neue", Helvetica, Arial, sans-serif`. If a later task wants more of the Akzidenz feel for headings, Schibsted Grotesk is the second choice.

## 5. Palette candidates

**Method.** Colours are approximated from museum and press photos (none of these objects has an official colour spec), then adjusted for contrast. Ratios are WCAG 2.x contrast ratios computed with a small Python script (sRGB relative luminance), not estimated. Targets: text pairs at least 4.5:1, `line` at least 3:1 against `page` and `surface` (control edges and focus ring). Two extra columns are given for the CSS task: `muted/surface` (secondary text on panels) and the best text colour on a `second` fill.

| Palette | Object | Light / dark | Character |
| --- | --- | --- | --- |
| SK 4 | Braun SK 4 radio-phonograph, 1956 | light, warm | white lacquer and elm, anthracite actions |
| T 3 | Braun T 3 pocket radio, 1958 | light, cool | grey plastic with orange and green signals |
| ET 66 | Braun ET 66 calculator, 1987 | dark | black with a yellow key and brown keys |
| TP 1 | Braun TP 1 radio/phono, 1959 | light, silver | aluminium, white plastic, leather |
| 606 | Vitsœ 606 shelving, 1960 | light, warm | off-white, aluminium and beech |
| Aicher | Lufthansa identity, 1962 | light, cool | white and grey with navy and yellow |

### SK 4

- **Object**: Braun SK 4 radio-phonograph, 1956, by Hans Gugelot and Dieter Rams (Herbert Lindinger also credited). Painted metal body between elm side panels, Plexiglas lid.
- **Character**: the calm reference palette: warm white lacquer, a pale grey control plate, elm at the sides, near-black for the one main action.
- **Approximated from photos**: `page`, `surface`, `trim` (elm), `second` (darkened elm). The SK 4 itself has no signal colour, so `accent` is the anthracite of its tonearm and markings.

| token | hex | note |
| --- | --- | --- |
| page | `#f4f2ec` | white lacquered metal, slightly warm |
| surface | `#e7e4dc` | light grey control plate and knobs |
| line | `#7d786f` | warm grey; darkened from `#8c877d` (was 2.81:1 on surface) |
| ink | `#26251f` | warm near-black |
| muted | `#5e5a52` | warm dark grey |
| accent | `#2e2f30` | anthracite: tonearm, scale markings; main button |
| accent-ink | `#f4f2ec` | page white on the anthracite button |
| second | `#8a5a36` | darkened elm, for a second state or link hover |
| trim | `#b98d63` | elm side panels (3D model sides) |

| ink/page | muted/page | ink/surface | accent-ink/accent | line/page | line/surface | muted/surface | text on second |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 13.72 | 6.13 | 12.09 | 11.98 | 3.92 | 3.45 | 5.40 | accent-ink 5.22 |

### T 3

- **Object**: Braun T 3 pocket transistor radio, 1958, by Dieter Rams with the HfG Ulm. Plastic case, a field of round holes over the speaker, a round tuning dial.
- **Character**: the most neutral palette, cool pale greys with two small Braun-style function colours for state.
- **Approximated from photos**: `page`, `surface`, `trim`. The T 3 is colourless; the orange and green are function colours in the Braun manner, added for UI state. A brighter signal orange (`#e2602a`) only reaches 3.54:1 with white text, so it is darkened to `#c4501a`.

| token | hex | note |
| --- | --- | --- |
| page | `#f2f2f0` | off-white plastic |
| surface | `#e3e4e2` | cool light grey (dial, panels) |
| line | `#76787c` | cool grey; darkened from `#85878a` (was 2.82:1 on surface) |
| ink | `#1f2124` | cool near-black |
| muted | `#5a5d61` | cool dark grey |
| accent | `#c4501a` | signal orange, power or main action (added) |
| accent-ink | `#ffffff` | white on orange |
| second | `#3d7a4e` | signal green, "on" state (added) |
| trim | `#c9c9c4` | light grey plastic (3D model sides) |

| ink/page | muted/page | ink/surface | accent-ink/accent | line/page | line/surface | muted/surface | text on second |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 14.40 | 5.90 | 12.65 | 4.66 | 3.95 | 3.47 | 5.19 | accent-ink 5.13 |

### ET 66

- **Object**: Braun ET 66 pocket calculator, 1987, by Dieter Rams and Dietrich Lubs. Black plastic body and number keys, brown operator keys, a yellow equals key (V&A description).
- **Character**: the dark palette: matte black, one yellow signal, warm brown as the secondary key colour.
- **Approximated from photos**: all values. The real brown keys are close to `#5a4232`, which is only 1.95:1 on the black page, so `second` is lightened to `#846044`; the yellow is a photo estimate. `line` lightened from `#6e6e6e` (3.04:1 on surface) for margin.

| token | hex | note |
| --- | --- | --- |
| page | `#161616` | matte black body |
| surface | `#242424` | black keys, raised panels |
| line | `#747474` | mid grey key edge; lightened from `#6e6e6e` |
| ink | `#ececea` | white key legends |
| muted | `#a3a29e` | light grey secondary text |
| accent | `#f2c230` | yellow equals key, main action |
| accent-ink | `#161616` | black on yellow |
| second | `#846044` | brown operator keys (lightened) |
| trim | `#3b3b3a` | graphite body edge (3D model sides) |

| ink/page | muted/page | ink/surface | accent-ink/accent | line/page | line/surface | muted/surface | text on second |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 15.30 | 7.08 | 13.12 | 10.80 | 3.87 | 3.32 | 6.08 | ink 4.75 |

### TP 1

- **Object**: Braun TP 1 portable radio and record player, 1959, by Dieter Rams (a T 4 radio and P 1 player joined in one case). Plastic casing, anodised aluminium frame, leather strap (MoMA).
- **Character**: the silver palette: an aluminium-grey page with white plastic panels, tan leather, one green signal.
- **Approximated from photos**: `page`, `surface`, `trim`, `second` (leather, darkened). The green is a function colour added for UI state. `line` darkened from `#84888b` (was 3.07:1 on page) for margin.

| token | hex | note |
| --- | --- | --- |
| page | `#eceeed` | pale aluminium grey |
| surface | `#f8f8f6` | white plastic front panels |
| line | `#7d8184` | steel grey; darkened from `#84888b` |
| ink | `#1d1f21` | near-black |
| muted | `#575b5f` | dark grey |
| accent | `#3f7f4a` | signal green, "on" / main action (added) |
| accent-ink | `#ffffff` | white on green |
| second | `#8b5e3c` | tan leather strap, darkened |
| trim | `#a8acaf` | anodised aluminium (3D model sides) |

| ink/page | muted/page | ink/surface | accent-ink/accent | line/page | line/surface | muted/surface | text on second |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 14.19 | 5.88 | 15.55 | 4.83 | 3.37 | 3.69 | 6.44 | accent-ink 5.58 |

### 606

- **Object**: Vitsœ 606 Universal Shelving System, 1960, by Dieter Rams. Anodised aluminium E-tracks; shelves in off-white, black, silver or beech (Vitsœ).
- **Character**: the architectural palette: off-white planes, aluminium structure, beech warmth, a quiet slate for actions.
- **Approximated from photos**: all values. `accent` (slate) is a darkened anodised-aluminium tone, not a 606 colour. `second` darkened from `#a8743f` (white text was 4.01:1); `line` darkened from `#8a877f` (was 2.87:1 on surface).

| token | hex | note |
| --- | --- | --- |
| page | `#f3f1ea` | off-white lacquered shelf |
| surface | `#e8e6df` | shaded off-white |
| line | `#7b7870` | warm grey; darkened from `#8a877f` |
| ink | `#222222` | black (the 606 black finish) |
| muted | `#5c5a55` | warm dark grey |
| accent | `#46525b` | slate, darkened anodised aluminium |
| accent-ink | `#ffffff` | white on slate |
| second | `#93633a` | beech, darkened |
| trim | `#b7babc` | anodised aluminium E-track (3D model sides) |

| ink/page | muted/page | ink/surface | accent-ink/accent | line/page | line/surface | muted/surface | text on second |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 14.08 | 6.09 | 12.74 | 8.02 | 3.90 | 3.53 | 5.52 | accent-ink 5.14 |

### Aicher

- **Object**: Lufthansa corporate design, 1962 (rolled out from 1963), by Otl Aicher's Development Group E5 at the HfG Ulm, commissioned by Hans G. Conrad. Navy blue and yellow, the crane reduced to basic forms, a Helvetica wordmark.
- **Character**: the Ulm graphic palette: white and cool grey with a deep navy for actions and yellow as a fill-only signal.
- **Approximated**: the navy `#05164d` and yellow are community reconstructions (Lufthansa publishes no hex values; the yellow is often given as RAL 1028, with hex estimates from `#f9b000` to `#ffad00`). Yellow is only 1.81:1 on the page, so use it only as a fill with `ink` text on it (9.01:1), never as text, a thin line or a focus ring. `line` darkened from `#7f858c` (was 3.03:1 on surface).

| token | hex | note |
| --- | --- | --- |
| page | `#f5f5f3` | white |
| surface | `#e6e8ea` | cool light grey |
| line | `#767c83` | blue-grey; darkened from `#7f858c` |
| ink | `#14181f` | blue-black |
| muted | `#565c66` | blue-grey |
| accent | `#05164d` | Lufthansa navy, main action |
| accent-ink | `#ffffff` | white on navy |
| second | `#f9a800` | Lufthansa yellow, fill only |
| trim | `#b0b4b8` | aircraft aluminium (3D model sides) |

| ink/page | muted/page | ink/surface | accent-ink/accent | line/page | line/surface | muted/surface | text on second |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 16.30 | 6.17 | 14.49 | 17.10 | 3.86 | 3.43 | 5.48 | ink 9.01 |

**Notes for the CSS task.** Every palette passes all six required pairs. Focus rings can use `line` (3:1 or more everywhere) or, better, `accent` where it reaches 3:1 on `page`: it does in every palette (SK 4 11.98, T 3 4.15, ET 66 10.80, TP 1 4.15, 606 7.10, Aicher 15.66). `second` reaches 3:1 on `page` in all palettes except Aicher (yellow).

## 6. Sources

History and objects
- Design Manifestos, "Max Bill: Die gute Form": https://designmanifestos.org/max-bill-die-gute-form
- Lars Müller Publishers, *Max Bill's View of Things: Die gute Form, an Exhibition 1949*: https://www.lars-mueller-publishers.com/max-bills-view-things
- Xenia Riemann on the origin of the term (Kunstchronik / Heidelberg): https://journals.ub.uni-heidelberg.de/index.php/kb/article/view/9906/3771
- ZHdK archive, poster for objects awarded at the 1953 Mustermesse: https://sammlungen-archive.zhdk.ch/objects/92388/die-gute-form--an-der-mustermesse-1953-ausgezeichnete-gegen
- Steven Heller, "Max Bill and Die Gute Form", Print: https://www.printmag.com/daily-heller/max-bill-and-die-gute-form/
- Otl Aicher, Wikipedia: https://en.wikipedia.org/wiki/Otl_Aicher
- Core77, "A History of Braun Design, Part 3: Audio Products": https://www.core77.com/posts/24768/A-History-of-Braun-Design-Part-3-Audio-Products
- Hartmut Jatzke-Wigand, Braun design history (Eichler, Gugelot, 1955 fair): https://www.designundtext.com/en/3.15_eichler-braun-design-realizations-pb.php
- Braun, design culture and designers: https://se.braun.com/en/design-culture/braun-designers
- Vitsœ, Dieter Rams's ten principles: https://www.vitsoe.com/gb/about/good-design
- Vitsœ, 606 Universal Shelving System: https://www.vitsoe.com/us/606
- Design Museum Berlin, 606 record: https://collection.design-museum.de/en/collection/item/43931/
- MoMA, SK 4/10 radio-phonograph: https://www.moma.org/collection/works/2649
- Radiomuseum.org, Braun SK 4: https://www.radiomuseum.org/r/braun_phonosuper_sk4.html
- Deutsche Digitale Bibliothek, SK 4 (elm, Plexiglas, metal, plastic): https://www.deutsche-digitale-bibliothek.de/item/JQES4MKWZYRC3MZ2Y66PYV6ZOW2UQK2J
- LACMA, T 3 pocket radio: https://collections.lacma.org/object/242170
- MoMA, TP 1: https://www.moma.org/collection/works/2500
- The Met, TP 1: https://www.metmuseum.org/art/collection/search/492324
- V&A, ET 66 calculator: https://collections.vam.ac.uk/item/O1360553
- Centre Pompidou, ET 66: https://www.centrepompidou.fr/fr/ressources/oeuvre/cX4y7Bj
- Lars Müller Publishers, *Lufthansa and Graphic Design*: https://lars-mueller-publishers.com/a505lufthansa-und-graphic-design
- Disegno, "Design on the Fly" (Lufthansa, Aicher, E5): https://medium.com/disegno-quarterly-journal-of-design/design-on-the-fly-b21a5975fdee
- Hans G. Conrad, Wikipedia: https://en.wikipedia.org/wiki/Hans_G._Conrad
- Brand Palettes, Lufthansa colours (reconstructed values): https://brandpalettes.com/lufthansa-airlines-logo-colors/

Typography
- design is fine, Braun logo history (Will Münch): https://design-is-fine.org/2013/05/12/braun-logo-history-1934-1952-1-will-m-nch
- Pixartprinting, Braun and Dieter Rams (Akzidenz-Grotesk at Braun): https://www.pixartprinting.co.uk/blog/braun-dieter-rams
- Fonts In Use, Braun RT 20: https://www.fontsinuse.com/uses/6957/braun-rt-20
- Fontsource, Inter: https://fontsource.org/fonts/inter
- Fontsource, Hanken Grotesk: https://fontsource.org/fonts/hanken-grotesk
- Fontsource, Schibsted Grotesk: https://fontsource.org/fonts/schibsted-grotesk
- Fontsource, Instrument Sans: https://fontsource.org/fonts/instrument-sans
- Google Fonts metadata (designers, licences): https://github.com/google/fonts/tree/main/ofl
- SIL Open Font License 1.1: https://openfontlicense.org/

Contrast
- WCAG 2.2, contrast (minimum) and non-text contrast: https://www.w3.org/TR/WCAG22/#contrast-minimum
