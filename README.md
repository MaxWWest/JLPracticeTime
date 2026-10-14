# Kotoba — Japanese Dictionary

A static Japanese vocabulary, grammar, and practice site.

## Open the site

Open `index.html` in a browser or serve this directory with any static web server.
The root page forwards to `main.html`, which loads the site assets and remote JLPT
vocabulary and grammar datasets.

## Publish with GitHub Pages

1. Create a public GitHub repository and push the project files to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`, then save.
5. Wait for the Pages deployment. The site URL will be shown in the Pages settings.

The site uses no build step. Vocabulary and grammar datasets are loaded from the
OpenJLPT CDN, so those features require an internet connection. Saved words and
practice progress are stored in the current browser.

## Developer checks

Run `node grammar-audit.js` to audit generated grammar practice questions for
missing context, duplicated choices, answer/option mismatches, and format drift.
Use `node grammar-audit.js --session comparison` to inspect one session.

Run `node --test comparison-practice.test.js` for comparison logic, accepted
answers, question construction, session diversity, and Review/Boss routing.
With Playwright installed, run `node comparison-browser-test.js` for a complete
Review, Boss routing, answer feedback, and desktop/mobile layout checks.
Set `PLAYWRIGHT_CHANNEL=chrome` to use an installed Chrome instead of bundled
Chromium; `COMPARISON_TEST_URL` can point the browser checks at a deployed site.

See [COMPARISON_DESIGN.md](COMPARISON_DESIGN.md) for the comparison generator's
teaching rules, architecture, and extension checklist.

Run `node --test time-practice.test.js` for the Time unit's temporal reasoning,
grading, semantic constraints, diversity, and routing checks. The browser harness
also supports `GRAMMAR_TEST_UNIT=time node comparison-browser-test.js` and an
optional `GRAMMAR_TEST_URL` for deployment checks. See [TIME_DESIGN.md](TIME_DESIGN.md)
for this unit's grammar rules and extension requirements.
