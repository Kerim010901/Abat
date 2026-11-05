# Abat telephone repair center

Local reconstruction of https://abat-telefon-merkezi.kgijow.chatgpt.site/ retrieved on 2026-11-06.

Open index.html in a modern browser. No installation or build is required.
For an HTTP preview, run `python -m http.server 8080` in this directory and open http://localhost:8080.

## Active source files

- index.html: application shell.
- style.css: responsive styling.
- app.js: workshop board, order intake, order updates, and tracking.
- management.js: customers, technicians, parts inventory, payments, and reporting.
- repair-math.js: payment, repair cost, stock, and overdue calculations.
- assets/: original reference background images.

The active files were recovered from the renewed site's public resources. The injected Cloudflare challenge script was excluded from the local HTML.
The older css/ and js/ folders remain as historical source; index.html uses the files listed above.

Orders and management records are stored in this browser's localStorage under abat-workshop-v1. There is no backend or shared database. Existing browser records on the hosted domain do not transfer to the local copy. The app starts empty on a new origin.

Some labels in the reference already have encoding artifacts or question-mark icons; these are preserved in this reconstruction.