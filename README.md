# Janitor

Janitor is an on-the-fly content blocker that removes unwanted elements permanently from webpages. Janitor can serve alongside adblockers, and delete what they missed, to keep websites clean and free from visual clutter. Features:

 - **Right Click Remove:** Quickly highlight and delete unwanted elements big and small, from floating banners to Internet Comment Sections.
 - **Persistence:** Unwanted elements are removed on all pages of the same domain, every time.
 - **Browser Sync:** Settings are synchronized across browser accounts.
 - **Custom Target:** Manually add or modify target elements using CSS selectors.
 
## For Developers

Make sure you have `npm` and `make` installed. Install dependencies with:

    npm install

Build the WebExtension into `dist/` with

    make

Clean the build with

    make clean
