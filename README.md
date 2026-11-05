# VSH Construction website

Static site, no build step. Upload the whole folder to any web host.

## Pages
`index.html` Home · `services.html` · `gallery.html` Gallery & before/after · `reviews.html` · `about.html` · `contact.html` Free estimate

## The 4 files you will edit

| File | What it controls |
|---|---|
| `assets/js/config.js` | Phone numbers, WhatsApp number, email, opening hours, Google review link, Facebook/Instagram |
| `assets/js/gallery-data.js` | Gallery photos and before/after pairs |
| `assets/js/reviews-data.js` | Client reviews |
| `assets/js/i18n.js` | Every text on the site in English / Shqip / Crnogorski |

### Adding gallery photos
1. Put the photo in `assets/img/gallery/` (JPG/WEBP, ~1600px wide).
2. Add a line in `gallery-data.js`:
   `{ src: "assets/img/gallery/bathroom-budva.jpg", cat: "bathrooms", country: "me", town: "Budva", featured: true },`
3. Delete the placeholder lines (the ones with `pattern:` instead of `src:`).

Categories: `floors`, `walls`, `bathrooms`, `kitchens`, `outdoor`, `pools`. Filter buttons with no photos hide themselves.
`featured: true` puts a photo on the home page (first 4).

### Reviews: published directly by your clients
Clients write their review on the Reviews page and press **Publish review**. It appears on the website right away, for everyone. (WhatsApp, phone and email are only for questions and free estimates.)

Reviews are stored in a free **Supabase** database. One-time setup, about 5 minutes:

1. Go to https://supabase.com, sign up (free) and click **New project**. Pick a region close to you (e.g. Frankfurt), choose a database password, wait ~1 minute.
2. In the project, open **SQL Editor → New query**, paste everything from `supabase-reviews.sql` (in this folder) and press **Run**.
3. Open **Project Settings → API** and copy:
   - **Project URL** → `reviewsDatabase.url` in `assets/js/config.js`
   - **anon public** key → `reviewsDatabase.anonKey` in `assets/js/config.js`
   (The anon key is designed to be public. Never put the `service_role` key on the website.)
4. Upload the site again. Done.

**Managing reviews:** Supabase → **Table Editor → reviews**. You see every review. To hide one (spam, rude, fake), untick **approved**; it disappears from the website immediately. You can also delete rows there.

**Built-in protection:** a hidden spam-bot trap, one review per device every few hours, length limits (name 2–60 characters, review 10–1000), and the database only lets visitors *add* reviews; they can't edit or delete anything.

**Before the database is connected:** on your own computer the form works in *demo mode* (the review is saved only in your browser, marked "Demo"), and sample reviews are shown so you can see the design. On the live site, samples are never shown.

Reviews you add by hand to `assets/js/reviews-data.js` are shown together with the published ones.

### Languages
The switch (EN / SQ / ME) is in the header. The site picks the visitor's language automatically the first time and remembers their choice. You can link to a language directly: `index.html?lang=sq`.
The Albanian and Montenegrin texts should be read once by a native speaker before going live.

## Logo: "Two Brothers"
Two overlapping diamond tiles (the brothers, and the two countries) joined by one gold tile. Files in `assets/logo/`:

| File | Use it for |
|---|---|
| `vsh-logo-horizontal.svg` | Full logo on dark backgrounds (social banners, dark signs) |
| `vsh-logo-horizontal-on-light.svg` | Full logo on white/light (invoices, letterheads, van, business cards) |
| `vsh-mark.svg` / `vsh-mark-on-light.svg` | Symbol only, dark / light background |
| `vsh-mark-black.svg` | One colour: stamps, engraving, embroidery, fax |
| `vsh-icon.svg` | Browser-tab icon, WhatsApp/Facebook/Instagram profile picture |

Colours: gold `#C9A063`, charcoal `#17181A`, off-white `#F2EEE6`. Fonts: **Syne** (VSH) and **Inter** (small text), both free from Google Fonts.
For professional printing, ask the print shop to "convert text to outlines" (or install Syne and Inter first).
`logo-concepts.html` holds the three original options; it is not linked from the site, so you can delete it before uploading.
