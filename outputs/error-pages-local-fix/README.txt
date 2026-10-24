Matching error pages for Steven Kruse - local image path fix

400.html - Bad Request
401.html - Unauthorized
403.html - Forbidden
404.html - Page Not Found
500.html - Server Error

LOCAL PREVIEW
Extract the ZIP fully before opening an HTML file. Keep the assets folder
beside the HTML files, with its images subfolder intact. The pages now
resolve images from their own folder when opened with file://.
The 400, 401, and 403 pages retain the exact CSS used by the 404 page.
Homepage links open index.html when it is present in the same website
folder; this package contains the error pages and their images only.

HOSTING
Upload the HTML files and assets folder to the website document root.
Hosted pages resolve their resources from the website root so images
also work when the original error URL is in a nested directory.
The included .htaccess retains the preferred-domain redirect and all
five ErrorDocument handlers. If your live .htaccess contains additional
rules, preserve those rules and merge the ErrorDocument directives.

Existing server rules continue to determine authentication and access.
Local file paths and asset existence were checked for all five pages.
Hosted loading and simulated error responses were checked locally.
Live Apache configuration was not tested.
