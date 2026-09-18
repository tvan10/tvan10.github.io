# Roadtrip shared challenge site

This is the separate GitHub Pages repository for Roadtrip share links. Its intended
public URL is `https://tvan10.github.io`. The iOS app generates links at
`https://tvan10.github.io/trip/v1/?trip=<base64url-encoded-JSON>`.

The trip page is a static, working fallback when the app is absent. It reads the
preset and endpoints from the link in the browser. The site stores no trips.
The `.nojekyll` file keeps `.well-known/apple-app-site-association` available
at the domain root for Apple's Universal Links association.

## Publish on GitHub

1. Open [the GitHub repository](https://github.com/tvan10/tvan10.github.io).
   It has already been created and pushed as **private**. In **Settings → General**,
   scroll to **Danger Zone → Change repository visibility** and make it **public**.
2. Open **Settings → Pages**. Under **Build and deployment**,
   select **Deploy from a branch**, branch **main**, folder **/(root)**, then Save.
   Wait for the Pages deployment to finish. Ensure the site is publicly
   accessible at `https://tvan10.github.io/`.
3. Check these URLs directly, without following redirects:

   ```sh
   curl -i https://tvan10.github.io/.well-known/apple-app-site-association
   curl -i 'https://tvan10.github.io/trip/v1/?trip=eyJwcmVzZXQiOiJjbGFzc2ljUm9hZHRyaXAiLCJzdGFydCI6eyJuYW1lIjoiQm9zdG9uIiwic3RhdGVDb2RlIjoiTUEiLCJsYXRpdHVkZSI6NDIuMzYsImxvbmdpdHVkZSI6LTcxLjA2fSwiZGVzdGluYXRpb24iOnsibmFtZSI6Ik5hc2h2aWxsZSIsInN0YXRlQ29kZSI6IlROIiwibGF0aXR1ZGUiOjM2LjE2LCJsb25naXR1ZGUiOi04Ni43OH19'
   ```

   Both should return HTTP 200. The first must return the JSON AASA file with
   no redirect; the second should show the challenge page in a browser.
4. Install the iOS app with the matching `applinks:tvan10.github.io` entitlement
   on a device. Send a share link through Messages or Notes and tap it. Check
   that it starts the shared trip. Repeat on a device without the app to verify
   the web fallback. Apple's associated-domains CDN can take time to refresh;
   reinstalling the app after publishing helps it fetch the association.

If the GitHub account or domain changes, update the domain in the iOS app's
`SharedTrip.host`, its associated-domains entitlement, and this site together.
The app ID in the AASA file must match the signed release app's Team ID and
bundle identifier.

Run `node --test` locally to check the web trip decoder.
