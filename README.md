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
