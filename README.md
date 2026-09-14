# sketchgen gallery

A public gallery of p5.js sketches written by self-hosted, open-weights models
and gated by a headless browser before anything is published. Every entry
carries full provenance — the prompt, the brief, the model, the gate report,
the token counts, the seed — and the source code that produced it.

**[Browse the gallery](https://profcarroll.github.io/sketchgen-gallery/)** ·
**[Rejections](https://profcarroll.github.io/sketchgen-gallery/rejections.html)** ·
**[Compare](https://profcarroll.github.io/sketchgen-gallery/compare.html)**

The pipeline that produces this gallery lives in
[profcarroll/sketchgen](https://github.com/profcarroll/sketchgen).

## What is here

This repository *is* the gallery — GitHub Pages serves it directly. Every
commit is made by the publisher on the node; every commit message names the
entry and every commit trailer names the model that wrote the code
(`Co-Authored-By`) and the person who approved publication (`Published-By`).

```
e/<id>/                   one entry
  sketch/sketch.js        the code (the canonical copy — what the frame loads)
  sketch/index.html       the page that runs it
  strip.png               four frames of the sketch running, left to right
  gate.png                the gate's own capture
  statement.md            the executor's own words about what it built
  meta.json               full provenance (28 keys)
index.html                the grid, newest first
rejections.html           kept gate failures
compare.html              paired comparison: two sketches, two questions
pairs.json                balanced pairs and agent verdicts for the compare page
lines/<root>.html         lineage trees rooted at entry <root>
assets/                   gallery CSS and JS
config.json               gallery URL, repository URL, write-path URL
```

## Viewing a sketch

Every entry page embeds the running sketch in an iframe. Click through to the
sketch itself at `e/<id>/sketch/` to see it full-screen. The source is right
there in `sketch/sketch.js` — one file, plain p5.js, no build step.

## Paired comparison

The compare page shows two sketches side by side — same seed, same frame
strip — and asks two questions:

1. **Which is closer to its brief?**
2. **Which would you rather look at?**

Sign in with GitHub to have your answers counted. Agent judges answer the
same two questions under blind conditions (they never see human votes, model
names, or engagement). A Bradley–Terry fit gives every entry a score per
population; the divergence between human and agent scores is the measurement.

## Provenance

`meta.json` in each entry records:

- the prompt and the planner's expanded brief
- the executor model, prompt version, and rules file (control or treatment)
- the planner model and prompt version
- every attempt's gate report (checks, assertions, evidence, tokens, wall time)
- the seed, the node shape, the publish commit
- the executor's statement — its own words about what it built
- lineage: parent entry, generation, the critique that spawned this child
- the submitting GitHub username (never an email or real name)
- the license (CC BY 4.0 per entry; LGPL-2.1 for the gallery itself)

## License

The gallery infrastructure (HTML, CSS, JS, templates) is licensed under the
[GNU Lesser General Public License v2.1](LICENSE) — the same license as
[p5.js](https://github.com/processing/p5.js).

Individual sketch entries under `e/` are licensed CC BY 4.0 as recorded in
each entry's `meta.json`.
