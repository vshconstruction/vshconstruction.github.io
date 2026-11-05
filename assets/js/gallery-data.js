/* =========================================================
   GALLERY: your project photos
   ---------------------------------------------------------
   HOW TO ADD A PHOTO
   1. Copy the photo into the folder  assets/img/gallery/
      (JPG or WEBP, about 1600px wide is perfect)
   2. Add a line to the list below, for example:
      { src: "assets/img/gallery/bathroom-budva.jpg", cat: "bathrooms", country: "me", town: "Budva", featured: true },

   cat      = bathrooms | floors | walls | kitchens | outdoor | pools
   country  = "al" (Albania) or "me" (Montenegro)
   town     = optional, e.g. "Budva", "Tirana"
   featured = true → also shown on the home page (the first 4 are used)
   tags     = optional extra labels: ["mosaics"] and/or ["large"] (large-format porcelain).
              Photos with these tags appear when someone taps "Mosaics" or
              "Large-format porcelain" in the moving strip on the home page.

   Lines without "src" are placeholders (tile patterns). Delete them
   once you have added your own photos.
   ========================================================= */
window.VSH_GALLERY = [
  { pattern: "marble",      cat: "bathrooms", country: "me", ratio: "4/5", featured: true, tags: ["large"] },
  { pattern: "terracotta",  cat: "outdoor",   country: "me", ratio: "1/1", featured: true },
  { pattern: "pool",        cat: "pools",     country: "me", ratio: "4/3", featured: true, tags: ["mosaics"] },
  { pattern: "checker",     cat: "floors",    country: "al", ratio: "3/4", featured: true },
  { pattern: "zellige",     cat: "kitchens",  country: "al", ratio: "1/1", tags: ["mosaics"] },
  { pattern: "hex-white",   cat: "bathrooms", country: "al", ratio: "4/5", tags: ["mosaics"] },
  { pattern: "wood",        cat: "floors",    country: "me", ratio: "4/3", tags: ["large"] },
  { pattern: "terrazzo",    cat: "kitchens",  country: "me", ratio: "3/4" },
  { pattern: "marble-dark", cat: "bathrooms", country: "me", ratio: "1/1", tags: ["large"] },
  { pattern: "chevron",     cat: "outdoor",   country: "al", ratio: "4/5" },
  { pattern: "subway-dark", cat: "walls",     country: "me", ratio: "4/3" },
  { pattern: "subway",      cat: "walls",     country: "al", ratio: "3/4" },
  { pattern: "hex",         cat: "pools",     country: "me", ratio: "1/1", tags: ["mosaics"] }
];

/* =========================================================
   BEFORE & AFTER: pairs of photos of the same space
   { before: "assets/img/gallery/kitchen-before.jpg", after: "assets/img/gallery/kitchen-after.jpg", cat: "kitchens", country: "al", town: "Durrës" },
   ========================================================= */
window.VSH_BEFORE_AFTER = [
  { beforePattern: "concrete", afterPattern: "marble",     cat: "bathrooms", country: "me" },
  { beforePattern: "concrete", afterPattern: "terracotta", cat: "outdoor",   country: "al" }
];
