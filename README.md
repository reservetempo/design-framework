# Design framework

Design languages across screens, buildings, objects, art and film: what each style is called, why, and the idea behind it, each with a picture.

Live site: https://reservetempo.github.io/design-framework/

## Layout

- `index.html`: the page. It is static, has no build step and also works when opened from disk (`file://`).
- `style-frameworks.css`, `style-frameworks.js`: the styles and the script that renders the sections. The section groups and their order are set in `GROUPS` in `style-frameworks.js`.
- `data/<id>.js`: one file per section, loaded with a plain `<script>` tag in `index.html`. The data format and rules are documented at the top of `style-frameworks.js`.
- `img/<id>/`: the pictures for each section.
- `tools/get_image.py`: searches Wikimedia and downloads images (Python 3 standard library only).

## Adding a style or a section

- **A style:** add an entry to the section's `styles` list in `data/<id>.js` (oldest first) and put its picture in `img/<id>/`.
- **A section:** create `data/<id>.js` in the same format, add a `<script src="data/<id>.js">` tag to `index.html` before `style-frameworks.js`, and add the id to `GROUPS` in `style-frameworks.js`.
- **A picture:** find and fetch it with the helper, which prints the credit to paste into the style's `credit`:

  ```sh
  python tools/get_image.py --help
  python tools/get_image.py search "Bauhaus building"
  python tools/get_image.py get "File:<name>" img/<id>/<slug>.jpg
  ```

To preview over HTTP, run `python -m http.server 8002` and open http://localhost:8002.

## Image rules

- Use free Wikimedia Commons files, about 800px wide and under ~400 KB, credited on each card.
- Non-free English Wikipedia screenshots are only for the existing operating system and game sections.
- With no suitable picture, draw an SVG specimen instead (see the rules at the top of `style-frameworks.js`).

## Deploys

Push to `main`. The GitHub Actions workflow in `.github/workflows/pages.yml` publishes the repo to GitHub Pages as is. The page has `noindex`, so search engines leave it out.
