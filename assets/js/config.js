/* =========================================================
   VSH Construction: business details
   Change these once and every page updates.
   ========================================================= */
window.VSH_CONFIG = {
  // Phone numbers exactly as they should be shown on the site
  phoneAL: "+355 67 69 47 680",
  phoneME: "+382 6X XXX XXX",

  // WhatsApp number: digits only, with country code, no "+" or spaces (e.g. "355691234567")
  whatsapp: "355676947680",

  // Email that receives estimate requests and reviews
  email: "vshconstruction@gmail.com",

  // Opening hours per language: [English, Albanian, Montenegrin]
  hours: ["Mon – Sat · 08:00 – 18:00", "Hën – Sht · 08:00 – 18:00", "Pon – Sub · 08:00 – 18:00"],

  // Optional: your Google review link (Google Business Profile → "Ask for reviews").
  // Leave empty ("") to hide the Google button.
  googleReviewUrl: "",

  // REVIEWS DATABASE (Supabase): visitors' reviews are published here and shown on the site.
  // Setup takes ~5 minutes; see README.md → "Connecting the reviews".
  // url:     Project Settings → API → Project URL      (e.g. "https://abcdefgh.supabase.co")
  // anonKey: Project Settings → API → "anon public" key (this key is meant to be public)
  reviewsDatabase: {
    url: "",
    anonKey: ""
  },

  // Optional social links. Leave empty to hide.
  facebook: "",
  instagram: ""
};
