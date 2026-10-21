# Grammar Coach

On-device grammar, punctuation and style checking with 40+ explainable rules. Every suggestion comes with a plain-English reason and a one-click fix.

**Live demo: https://akash991833.github.io/grammar-corrector/**

![Issues and score](docs/screenshot-desktop.png)

## Features

- **40+ rules**: repeated words, a/an, subject-verb agreement ("he don't" -> "he doesn't"), could/should/would of, me-and-X subjects, much/many, less/fewer, then/than, double comparatives, its/it's, capitalization (sentences, days, months, "I"), spacing and punctuation, wordy phrases ("due to the fact that" -> "because"), and more.
- **Explainable** - each issue names the rule in plain English.
- **Apply one fix or apply all** (safe two-pass application, no overlaps).
- **Writing score** ring that updates with every check.
- **Dark and light mode**, mobile friendly, installable PWA.

![Mobile](docs/screenshot-mobile.png)

## Honest limits

This is a rule engine, not a full parser. It catches common mistakes reliably but can miss or occasionally mis-flag unusual sentences. Dismiss anything you disagree with.

## Tech

Vanilla HTML/CSS/JS, zero network calls. Your text never leaves the page.

## Run locally

```bash
python3 -m http.server 8000
```
