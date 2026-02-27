# Specification

## Summary
**Goal:** Build a fully self-contained single-page affine cipher tool in one HTML file with no external JS dependencies.

**Planned changes:**
- Create a single `index.html` file with all CSS in a `<style>` tag and all logic in a `<script>` tag (works via `file://` protocol)
- Implement affine cipher encryption using E(x) = (3x + 5) mod 26 and decryption using D(x) = 9(x − 5) mod 26; only A–Z/a–z are transformed, case is preserved, and non-letter characters pass through unchanged
- Build a five-section layout: Header (title + subtitle), Input Card (textarea), Button Row (Encrypt + Decrypt side by side), Output Card (Encrypted Text and Decrypted Text result fields each with copy-to-clipboard), and Explanation Panel (accordion with four entries covering letter-to-number mapping, modular arithmetic, why 9 is the inverse of 3 mod 26, and encryption's role in digital security)
- Apply a minimal academic design: light gray-blue background, white cards with rounded corners and soft box shadows, deep navy/indigo accent, Inter font (Google Fonts with system-font fallback), hover transitions on buttons, fade/slide reveal animation on result fields, and full mobile responsiveness via max-width media queries

**User-visible outcome:** Users can open the HTML file directly in a browser, type a message, click Encrypt or Decrypt to see the affine cipher result, copy either output to clipboard, and read expandable explanations of the underlying math.
