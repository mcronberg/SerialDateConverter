# Serial Date Converter

A Progressive Web App (PWA) for converting between Excel serial date numbers and human-readable dates.

## Features

*   **Two-way Conversion**: Convert dates to Excel serial numbers and vice versa.
*   **Time Support**: Handles fractional serial numbers for precise time conversion.
*   **Localization**: Supports English and Danish (switchable UI).
*   **Reference Table**: Shows "Past" and "Future" relative dates (e.g., "Today", "Next Monday") with their Excel serials.
*   **PWA**: Installable on mobile and desktop with offline support.
*   **Dark Mode**: Modern, clean UI with a dark theme.

## Installation & Usage

### Running Locally

1.  Clone the repository.
2.  Open `index.html` in your browser.
    *   *Note*: Service Worker features (PWA installation) require the app to be served over HTTP/HTTPS, not `file://`.
    *   We recommend using the "Live Server" extension in VS Code or running a simple python server:
        ```bash
        python -m http.server
        ```

### Deploying to GitHub Pages

1.  Push this repository to GitHub.
2.  Go to **Settings** > **Pages**.
3.  Under **Source**, select `main` branch and `/ (root)` folder.
4.  Click **Save**.
5.  Your app will be available at `https://<username>.github.io/<repository-name>/`.

## Technologies

*   HTML5
*   Tailwind CSS (via CDN)
*   JavaScript (Vanilla)
