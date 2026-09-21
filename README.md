# JN_Portfolio

A from-scratch rebuild of the Johanna Nordlander portfolio (makeup artist & art director) as a dependency-free static site — plain HTML, CSS and JavaScript, no build step.

## Features

- Two counter-scrolling image columns (**Makeup** left, **Digital** right); the columns drift ±12% against page scroll.
- Entry overlay with bouncing "MAKE UP" / "DIGITAL" hints that dismisses on first scroll, wheel, touch or click.
- Pointer-following `makeup` / `digital` cursor label over the grid, plus a dimmed hover state with a red project title on the projects that have one.
- Gallery overlay (click any image): blurred page veil, scrollable 780px gallery with expandable credits (click the title or chevron), a bouncing "go up" that smooth-scrolls the panel, and prev/next thumbnails. Close with `Esc` or by clicking outside the panel.
- **About** panel (header "about" button, `Esc` or the button again closes it): portrait, bio, Instagram/LinkedIn/email/portfolio links, and a "leave a trace" drawing board with undo (also Ctrl/Cmd+Z), clear, and an in-session saved gallery.
- Floating "Next MAKEUP" button in the gallery that fades in after scrolling (inert, as on the original).
- Page-level "go up" link that smooth-scrolls back to the top.
- Breakpoints matching the original: 1440+, 1280–1439, 810–1279, ≤809.

## Run locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Structure

```
index.html   markup + icon sprite
styles.css   layout, breakpoints, overlay
script.js    parallax, hints, cursor labels, gallery overlay
assets/      Typewriter Condensed font + images
```
