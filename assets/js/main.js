/* =========================================================
   VSH Construction: layout, languages, page transitions,
   gallery, lightbox, reviews and forms
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var CFG = window.VSH_CONFIG || {};
  var DICT = window.VSH_I18N || {};
  var PAGE = body.getAttribute("data-page") || "";
  var KEY = "vsh-transition";
  var LANG_KEY = "vsh-lang";
  var LANGS = ["en", "sq", "me"];
  var LANG_TAG = { en: "en", sq: "sq", me: "cnr" };
  var LANG_NAME = { en: "English", sq: "Shqip", me: "Crnogorski" };
  var LOCALE = { en: "en-GB", sq: "sq-AL", me: "sr-Latn-ME" };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var each = function (sel, fn, scope) { Array.prototype.forEach.call((scope || document).querySelectorAll(sel), fn); };

  /* =======================================================
     Language
     ======================================================= */
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function detectLang() {
    var q = new URLSearchParams(window.location.search).get("lang");
    if (q && LANGS.indexOf(q) > -1) { store(LANG_KEY, q); return q; }
    var saved = read(LANG_KEY);
    if (saved && LANGS.indexOf(saved) > -1) return saved;
    var prefs = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < prefs.length; i++) {
      var p = String(prefs[i]).toLowerCase();
      if (p.indexOf("sq") === 0) return "sq";
      if (/^(cnr|sr|hr|bs|me)/.test(p)) return "me";
      if (p.indexOf("en") === 0) return "en";
    }
    return "en";
  }
  var lang = detectLang();
  var li = LANGS.indexOf(lang);
  root.lang = LANG_TAG[lang];

  function t(key, vars) {
    var e = DICT[key];
    var s = e ? (e[li] || e[0]) : key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function applyI18n(scope) {
    each("[data-i18n]", function (el) {
      var k = el.getAttribute("data-i18n");
      if (DICT[k]) el.innerHTML = t(k);
    }, scope);
    each("[data-i18n-attr]", function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length === 2 && DICT[parts[1].trim()]) el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    }, scope);
  }

  /* =======================================================
     Icons
     ======================================================= */
  var S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var ICON = {
    arrow: S + '<path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    left: S + '<path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    diag: S + '<path d="M7 17L17 7M8 7h9v9"/></svg>',
    up: S + '<path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    close: S + '<path d="M6 6l12 12M18 6L6 18"/></svg>',
    zoom: S + '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5"/></svg>',
    phone: S + '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    mail: S + '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    drag: S + '<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3M12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 0 1 2.2 12C2.2 6.6 6.6 2.2 12 2.2a9.8 9.8 0 0 1 9.8 9.8c0 5.4-4.4 9.8-9.8 9.8M12 .2C5.5.2.2 5.5.2 12c0 2.1.5 4.1 1.6 5.9L.1 24l6.3-1.7A11.8 11.8 0 0 0 12 23.8c6.5 0 11.8-5.3 11.8-11.8C23.8 5.5 18.5.2 12 .2"/></svg>',
    globe: S + '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>'
  };

  /* =======================================================
     Contact helpers
     ======================================================= */
  function telHref(num) { return "tel:" + String(num || "").replace(/[^\d+]/g, ""); }
  function waHref(text) { return "https://wa.me/" + String(CFG.whatsapp || "").replace(/\D/g, "") + (text ? "?text=" + encodeURIComponent(text) : ""); }
  function mailHref(subject, bodyText) {
    var q = [];
    if (subject) q.push("subject=" + encodeURIComponent(subject));
    if (bodyText) q.push("body=" + encodeURIComponent(bodyText));
    return "mailto:" + (CFG.email || "") + (q.length ? "?" + q.join("&") : "");
  }
  function hours() { return Array.isArray(CFG.hours) ? (CFG.hours[li] || CFG.hours[0]) : (CFG.hours || ""); }

  function bindContacts(scope) {
    each("[data-tel]", function (el) {
      var num = el.getAttribute("data-tel") === "al" ? CFG.phoneAL : CFG.phoneME;
      el.href = telHref(num);
      if (!el.children.length) el.textContent = num;
      else { var n = el.querySelector("[data-num]"); if (n) n.textContent = num; }
    }, scope);
    each("[data-wa]", function (el) { el.href = waHref(t("wa.msg")); el.target = "_blank"; el.rel = "noopener"; }, scope);
    each("[data-mail]", function (el) {
      el.href = mailHref();
      var n = el.querySelector("[data-num]");
      if (n) n.textContent = CFG.email; else if (!el.children.length) el.textContent = CFG.email;
    }, scope);
    each("[data-hours]", function (el) { el.textContent = hours(); }, scope);
  }

  /* =======================================================
     Layout: header, menu, footer, WhatsApp button
     ======================================================= */
  var NAV = [["home", "index.html"], ["services", "services.html"], ["gallery", "gallery.html"], ["reviews", "reviews.html"], ["about", "about.html"]];

  // The logo: two overlapping diamond tiles (the brothers / the two countries) joined by a gold tile
  var LOGO_MARK = '<svg class="logo-mark" viewBox="2 15 96 70" aria-hidden="true">' +
    '<path class="lm-a" pathLength="100" d="M37 18 L69 50 L37 82 L5 50 Z" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linejoin="round"/>' +
    '<path class="lm-b" pathLength="100" d="M63 18 L95 50 L63 82 L31 50 Z" fill="none" stroke="var(--accent)" stroke-width="4.5" stroke-linejoin="round"/>' +
    '<path class="lm-c" d="M50 37 L63 50 L50 63 L37 50 Z" fill="var(--accent)"/></svg>';
  window.VSH_LOGO_MARK = LOGO_MARK;

  // The same logo cut into 9 pieces (4 edges of each diamond + the gold centre) for the page transition
  var PT_MARK = (function () {
    var A = [[37, 18], [69, 50], [37, 82], [5, 50]];
    var B = [[63, 18], [95, 50], [63, 82], [31, 50]];
    var edge = function (pts, i, color) {
      var p = pts[i], q = pts[(i + 1) % 4];
      return '<path class="pc" d="M' + p[0] + " " + p[1] + " L" + q[0] + " " + q[1] + '" stroke="' + color + '" stroke-width="4.5" stroke-linecap="round" fill="none"/>';
    };
    var out = '<svg class="pt-mark" viewBox="2 15 96 70" aria-hidden="true">';
    for (var i = 0; i < 4; i++) out += edge(A, i, "currentColor") + edge(B, i, "var(--accent)");
    return out + '<path class="pc pc-c" d="M50 37 L63 50 L50 63 L37 50 Z" fill="var(--accent)"/></svg>';
  })();

  function brandHTML() {
    return '<a class="brand" href="index.html" aria-label="VSH Construction">' +
      '<span class="brand-mark">' + LOGO_MARK + "</span>" +
      '<span class="brand-text"><strong>VSH Construction</strong><small>Vëllezërit Shegaj</small></span></a>';
  }
  function langHTML() {
    return '<div class="lang" role="group" aria-label="' + esc(t("nav.language")) + '" style="--li:' + li + '"><span class="lang-pill" aria-hidden="true"></span>' +
      LANGS.map(function (l) {
        return '<button type="button" data-lang="' + l + '" lang="' + LANG_TAG[l] + '" aria-pressed="' + (l === lang) + '" title="' + LANG_NAME[l] + '">' + l.toUpperCase() + "</button>";
      }).join("") + "</div>";
  }

  function buildLayout() {
    var cur = function (p) { return p === PAGE ? ' aria-current="page"' : ""; };

    var top = document.createElement("div");
    top.innerHTML =
      '<a class="skip-link" href="#main">' + t("nav.skip") + "</a>" +
      '<div class="pt" aria-hidden="true"><div class="pt-logo">' + PT_MARK +
        '<div class="pt-word">' + "VSH CONSTRUCTION".split("").map(function (ch, i) {
          return '<span style="--l:' + i + '"' + (i < 3 ? ' class="g"' : "") + ">" + (ch === " " ? "&nbsp;" : ch) + "</span>";
        }).join("") + "</div></div></div>" +
      '<div class="scroll-progress" aria-hidden="true"></div>' +
      '<header class="site-header"><div class="container">' + brandHTML() +
        '<div class="header-right">' +
          '<nav class="nav" aria-label="Main"><span class="nav-indicator" aria-hidden="true"></span>' + NAV.map(function (n, i) {
            var label = t("nav." + n[0]);
            return '<a class="hx" style="--hd:' + (i + 1) + '" href="' + n[1] + '"' + cur(n[0]) + '><span class="nl"><span>' + label + '</span><span aria-hidden="true">' + label + "</span></span></a>";
          }).join("") + "</nav>" +
          langHTML() +
          '<a href="contact.html" class="btn btn-sm header-cta" data-magnetic="0.25"' + cur("contact") + ">" + t("nav.cta") + " " + ICON.arrow + "</a>" +
          '<button class="menu-toggle" type="button" aria-label="' + esc(t("nav.menu")) + '" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>' +
        "</div></div></header>" +
      '<div class="mobile-menu" id="mobile-menu"><nav aria-label="Mobile">' +
        NAV.concat([["contact", "contact.html"]]).map(function (n, i) {
          return '<a href="' + n[1] + '"' + cur(n[0]) + ' style="--i:' + i + '"><span>' + t("nav." + n[0]) + "</span></a>";
        }).join("") +
      '</nav><div class="mobile-menu-foot">' +
        '<a class="btn" href="contact.html">' + t("nav.cta") + " " + ICON.arrow + "</a>" +
        '<span>' + t("common.where") + "</span>" +
        '<a data-tel="al"></a><a data-tel="me"></a>' +
      "</div></div>";
    var ref = body.firstChild;
    while (top.firstChild) body.insertBefore(top.firstChild, ref);

    var footer = document.createElement("footer");
    footer.className = "site-footer";
    var social = "";
    if (CFG.facebook) social += '<li><a href="' + esc(CFG.facebook) + '" target="_blank" rel="noopener">Facebook</a></li>';
    if (CFG.instagram) social += '<li><a href="' + esc(CFG.instagram) + '" target="_blank" rel="noopener">Instagram</a></li>';
    footer.innerHTML =
      '<div class="container"><div class="footer-top">' +
        "<div>" + brandHTML() + "<p>" + t("footer.about") + "</p></div>" +
        "<div><h4>" + t("footer.pages") + '</h4><ul class="footer-links">' +
          NAV.concat([["contact", "contact.html"]]).map(function (n) { return '<li><a href="' + n[1] + '">' + t("nav." + n[0]) + "</a></li>"; }).join("") +
        "</ul></div>" +
        "<div><h4>" + t("footer.contact") + '</h4><ul class="footer-links">' +
          '<li><a data-tel="al"></a></li><li><a data-tel="me"></a></li><li><a data-wa>WhatsApp</a></li><li><a data-mail></a></li>' + social +
        "</ul></div>" +
        "<div><h4>" + t("footer.where") + '</h4><ul class="footer-links"><li><span>' + t("country.al") + "</span></li><li><span>" + t("country.me") + '</span></li><li><span data-hours></span></li></ul></div>' +
      "</div>" +
      '<div class="footer-big" aria-hidden="true">VSH Construction</div>' +
      '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + " Vëllezërit Shegaj Construction</span>" +
        '<button class="to-top" type="button" data-to-top>' + t("footer.top") + " <span>" + ICON.up + "</span></button></div></div>";
    body.insertBefore(footer, document.querySelector("body > script"));

    var wa = document.createElement("a");
    wa.className = "wa-float";
    wa.setAttribute("data-wa", "");
    wa.setAttribute("aria-label", t("wa.float"));
    wa.innerHTML = ICON.wa + '<span class="wa-tip">' + t("wa.float") + "</span>";
    body.insertBefore(wa, footer.nextSibling);
  }

  /* -------------------------------------------------------
     Animated service illustrations (play while visible, loop)
     ------------------------------------------------------- */
  var SVC_ANIM = (function () {
    var o = '<svg class="svc-anim svc-';
    var head = '" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
    // Floor tiling: nine tiles laid one after another, the last one in gold
    var floors = o + "floors" + head;
    var order = [0, 1, 2, 5, 4, 3, 6, 7, 8];
    order.forEach(function (cell, k) {
      var x = 8.5 + (cell % 3) * 16.5, y = 8.5 + Math.floor(cell / 3) * 16.5;
      floors += '<rect class="t" style="--k:' + k + '" x="' + x + '" y="' + y + '" width="13.5" height="13.5" rx="1.5"' + (k === 8 ? ' fill="currentColor" fill-opacity=".85"' : "") + "/>";
    });
    floors += "</svg>";
    // Wall tiling: a brick-bond wall built from the bottom up
    var walls = o + "walls" + head, k = 0;
    [[46, [[6, 24], [32, 26]]], [33, [[6, 12], [20, 25], [47, 11]]], [20, [[6, 24], [32, 26]]], [7, [[6, 12], [20, 25], [47, 11]]]].forEach(function (row, r) {
      row[1].forEach(function (b) {
        walls += '<rect class="b" style="--k:' + (k++) + ";--dx:" + (r % 2 ? -10 : 10) + 'px" x="' + b[0] + '" y="' + row[0] + '" width="' + b[1] + '" height="11" rx="1.2"' + (r === 3 && b[0] === 20 ? ' fill="currentColor" fill-opacity=".85"' : "") + "/>";
      });
    });
    walls += "</svg>";
    // Bathroom: shower over a tiled wall, water drops falling and splashing
    var bath = o + "bath" + head +
      '<g class="faint"><path d="M8 8 H56 V56 H8 Z M8 24 H56 M8 40 H56 M24 8 V56 M40 8 V56" stroke-width="1"/></g>' +
      '<path d="M46 8 V13 Q46 17 42 17 H33"/><path d="M24 19 H40" stroke-width="3"/>' +
      [26, 30, 34, 38].map(function (x, i) { return '<path class="drop" style="--k:' + i + '" d="M' + x + ' 24 V29"/>'; }).join("") +
      [26, 32, 38].map(function (x, i) { return '<ellipse class="splash" style="--k:' + i + '" cx="' + x + '" cy="53" rx="3" ry="1"/>'; }).join("") +
      '<path d="M14 56 H50" stroke-width="2.2"/></svg>';
    // Kitchen: splashback tiles, a pan on the counter and rising steam
    var kitchen = o + "kitchen" + head +
      '<g class="faint"><path d="M6 6 H58 V30 H6 Z M6 18 H58 M19 6 V30 M32 6 V30 M45 6 V30" stroke-width="1"/></g>' +
      [22, 30, 38].map(function (x, i) { return '<path class="steam" pathLength="30" style="--k:' + i + '" d="M' + x + " 38 c-3 -3 3 -6 0 -9 c-3 -3 3 -6 0 -9 c-3 -3 3 -5 0 -8\"/>"; }).join("") +
      '<path class="pan" d="M17 42 H43 V44 A6 6 0 0 1 37 50 H23 A6 6 0 0 1 17 44 Z" fill="currentColor" fill-opacity=".18"/><path d="M43 44 H55"/>' +
      '<path d="M4 54 H60" stroke-width="2.2"/></svg>';
    // Terraces & outdoor: turning sun over a terrace floor that draws itself
    var rays = "";
    for (var i = 0; i < 8; i++) {
      var a = i * Math.PI / 4, cx = 47, cy = 15;
      rays += '<path d="M' + (cx + Math.cos(a) * 9).toFixed(1) + " " + (cy + Math.sin(a) * 9).toFixed(1) + " L" + (cx + Math.cos(a) * 12).toFixed(1) + " " + (cy + Math.sin(a) * 12).toFixed(1) + '"/>';
    }
    var outdoor = o + "outdoor" + head +
      '<g class="rays">' + rays + '</g><circle class="sun" cx="47" cy="15" r="5.5" fill="currentColor" fill-opacity=".85"/>' +
      ['M6 58 L18 34 H46 L58 58 Z', 'M12 46 H52', 'M27.3 34 L23.3 58', 'M36.7 34 L40.7 58'].map(function (d, i) {
        return '<path class="fl" pathLength="40" style="--k:' + i + '" d="' + d + '"/>';
      }).join("") + "</svg>";
    // Pools: ladder, moving water and rising bubbles
    var wave = function (y, cls) {
      var d = "M-16 " + y + " q4 -3 8 0"; for (var j = 0; j < 11; j++) d += " t8 0";
      return '<path class="' + cls + '" d="' + d + '"/>';
    };
    var pools = o + "pools" + head +
      '<defs><clipPath id="svc-pool-clip"><rect x="4" y="34" width="56" height="26" rx="3"/></clipPath></defs>' +
      '<path d="M22 10 V40 M32 10 V40 M22 18 H32 M22 27 H32"/><path d="M22 10 Q22 6 18 6 M32 10 Q32 6 36 6"/>' +
      '<g clip-path="url(#svc-pool-clip)">' + wave(42, "wave") + wave(50, "wave wave2") +
      [16, 40, 50].map(function (x, i) { return '<circle class="bub" style="--k:' + i + '" cx="' + x + '" cy="57" r="1.6"/>'; }).join("") +
      "</g></svg>";
    return { floors: floors, walls: walls, bathrooms: bath, kitchens: kitchen, outdoor: outdoor, pools: pools };
  })();

  /* -------------------------------------------------------
     Services page scenes: a VSH worker at work, one per service.
     Pure SVG with SMIL animation, paused while off screen.
     ------------------------------------------------------- */
  var SCENES = (function () {
    var C = {
      gold: "#c9a063", goldD: "#9e7b45", skin: "#f2eee6", pants: "#4a4f57", boot: "#121417",
      tile: "#e9e3d8", grout: "#a39b8e", line: "#3a3f46", screed: "#2c2b29"
    };
    var DUR = "3.4s";
    var KT = "0;0.35;0.5;0.82;1";
    var EASE = ' calcMode="spline" keySplines=".45 0 .2 1;0 0 1 1;.45 0 .2 1;0 0 1 1"';
    var loop = ' dur="' + DUR + '" repeatCount="indefinite"';
    function a(attr, values, kt, extra) { return '<animate attributeName="' + attr + '"' + loop + ' values="' + values + '" keyTimes="' + (kt || KT) + '"' + (extra || "") + "/>"; }
    function tr(values, kt, extra) { return '<animateTransform attributeName="transform" type="translate"' + loop + ' values="' + values + '" keyTimes="' + (kt || KT) + '"' + (extra === undefined ? EASE : extra) + "/>"; }
    function rot(values) { return '<animateTransform attributeName="transform" type="rotate"' + loop + ' values="' + values + '" keyTimes="' + KT + '"' + EASE + "/>"; }
    // timing shared by every scene: tile leaves the hand at 42 %, stays placed until 88 %
    var HELD = a("opacity", "1;1;0;0;1", "0;0.42;0.43;0.9;1");
    var PLACED = a("opacity", "0;0;1;1;0", "0;0.42;0.43;0.88;1");
    var SPARK = a("opacity", "0;0;1;0;0", "0;0.43;0.47;0.62;1");
    function sparks(x, y) {
      return '<g opacity="0" stroke="' + C.gold + '" stroke-width="2.5" stroke-linecap="round">' + SPARK +
        '<path d="M' + (x - 22) + " " + (y - 6) + " l-8 -4 M" + (x - 18) + " " + (y - 16) + " l-5 -8 M" + (x + 22) + " " + (y - 6) + " l8 -4 M" + (x + 18) + " " + (y - 16) + ' l5 -8"/></g>';
    }
    function cap(cx, cy) {
      return '<circle cx="' + cx + '" cy="' + cy + '" r="13" fill="' + C.skin + '"/>' +
        '<path d="M' + (cx - 13) + " " + (cy - 2) + ' a13 13 0 0 1 26 0 z" fill="' + C.gold + '"/>' +
        '<path d="M' + (cx + 10) + " " + (cy - 5) + ' h10" stroke="' + C.gold + '" stroke-width="4" stroke-linecap="round"/>';
    }
    var S = ' fill="none" stroke-linecap="round" stroke-linejoin="round"';

    // Kneeling worker (floor at y=240); lays a slab at x 173–207
    function kneeling(tileFill, tileStroke) {
      var up = "M150 170 L182 176 L210 162", down = "M150 170 L176 198 L190 228";
      return '<g class="worker">' +
        '<path d="M128 206 L112 238 L78 240" stroke="' + C.pants + '" stroke-width="15"' + S + "/>" +
        '<path d="M134 208 L170 212 L172 240" stroke="' + C.pants + '" stroke-width="15"' + S + "/>" +
        '<path d="M70 241 h14 M172 241 h14" stroke="' + C.boot + '" stroke-width="7"' + S + "/>" +
        "<g>" + rot("0 130 206;4 130 206;4 130 206;0 130 206;0 130 206") +
          '<path d="M130 206 L150 164" stroke="' + C.gold + '" stroke-width="26"' + S + "/>" +
          '<path d="M146 172 L166 196 L176 210" stroke="' + C.goldD + '" stroke-width="9"' + S + "/>" +
          cap(156, 142) +
          '<g opacity="1">' + HELD + '<rect x="-17" y="0" width="34" height="7" rx="1" fill="' + tileFill + '" stroke="' + tileStroke + '" stroke-width="1.5">' +
            "</rect>" + tr("210 166;190 230;190 230;210 166;210 166") + "</g>" +
          '<path d="' + up + '" stroke="' + C.gold + '" stroke-width="10"' + S + ">" + a("d", [up, down, down, up, up].join(";"), KT, EASE) + "</path>" +
          '<circle r="5.5" fill="' + C.skin + '">' + tr("210 162;190 228;190 228;210 162;210 162") + "</circle>" +
        "</g></g>";
    }
    function slabRow(fill, stroke) {
      var out = "";
      for (var k = 1; k <= 5; k++) out += '<rect x="' + (172 - 35 * k) + '" y="233" width="34" height="7" rx="1" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>';
      return out;
    }
    function placedSlab(fill, stroke) {
      return '<path d="M176 239 l3 -2.5 l3 2.5 l3 -2.5 l3 2.5 l3 -2.5 l3 2.5 l3 -2.5 l3 2.5 l3 -2.5 l3 2.5" stroke="' + C.gold + '" stroke-width="1.6"' + S + ">" + HELD + "</path>" +
        '<rect x="173" y="233" width="34" height="7" rx="1" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5" opacity="0">' + PLACED + "</rect>" + sparks(190, 228);
    }
    function bucket(x) {
      return '<path d="M' + x + " 204 H" + (x + 36) + " L" + (x + 32) + " 240 H" + (x + 4) + ' Z" fill="#3a3f45" stroke="#4d535b" stroke-width="1.5"/>' +
        '<path d="M' + (x + 4) + " 204 Q" + (x + 18) + " 186 " + (x + 32) + ' 204" stroke="#6b7079" stroke-width="2"' + S + "/>" +
        '<rect x="' + (x + 6) + '" y="214" width="24" height="5" fill="' + C.gold + '" opacity=".8"/>';
    }

    // Standing worker (floor at y=270); presses a square tile into the slot at 238,106
    function standing(tileFill, tileStroke) {
      var up = "M164 154 L196 128 L236 116", down = "M164 154 L174 186 L198 198";
      return '<g class="worker">' +
        '<path d="M150 204 L146 268 M164 204 L170 268" stroke="' + C.pants + '" stroke-width="16"' + S + "/>" +
        '<path d="M136 271 h18 M166 271 h18" stroke="' + C.boot + '" stroke-width="7"' + S + "/>" +
        '<path d="M157 206 L159 148" stroke="' + C.gold + '" stroke-width="28"' + S + "/>" +
        '<path d="M152 156 L142 190 L146 214" stroke="' + C.goldD + '" stroke-width="9"' + S + "/>" +
        cap(161, 126) +
        '<g>' + HELD + '<rect x="-12" y="-12" width="24" height="24" rx="1.5" fill="' + tileFill + '" stroke="' + tileStroke + '" stroke-width="1.5"/>' + tr("208 200;250 118;250 118;208 200;208 200") + "</g>" +
        '<path d="' + up + '" stroke="' + C.gold + '" stroke-width="10"' + S + ">" + a("d", [up, down, down, up, up].join(";"), KT, EASE) + "</path>" +
        '<circle r="5.5" fill="' + C.skin + '">' + tr("236 116;198 198;198 198;236 116;236 116") + "</circle>" +
        "</g>";
    }
    function wallGrid(x0, cols, y0, rows, fill, stroke) {
      var out = "";
      for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
        var x = x0 + i * 28, y = y0 + j * 28;
        if (x === 238 && y === 106) continue; // the empty slot being tiled
        out += '<rect x="' + x + '" y="' + y + '" width="24" height="24" rx="1.5" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1"/>';
      }
      return out;
    }
    function slot(fill, stroke) {
      return '<rect x="238" y="106" width="24" height="24" rx="1.5" fill="none" stroke="' + C.gold + '" stroke-width="1.4" stroke-dasharray="3 3">' + HELD + "</rect>" +
        '<path d="M242 112 h16 M242 118 h16 M242 124 h16" stroke="' + C.gold + '" stroke-width="1.2" opacity=".7"' + S + ">" + HELD + "</path>" +
        '<rect x="238" y="106" width="24" height="24" rx="1.5" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1" opacity="0">' + PLACED + "</rect>" + sparks(250, 124);
    }
    function floorStanding(fill) {
      var out = '<rect x="0" y="270" width="400" height="50" fill="' + fill + '"/>';
      for (var i = -6; i <= 6; i++) out += '<path d="M' + (200 + i * 44) + " 270 L" + (200 + i * 70) + ' 320" stroke="' + C.line + '" stroke-width="1"/>';
      return out + '<path d="M0 290 H400" stroke="' + C.line + '" stroke-width="1"/>';
    }
    function bg(id, top, bottom) {
      return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset="1" stop-color="' + bottom + '"/></linearGradient></defs><rect width="400" height="320" fill="url(#' + id + ')"/>';
    }
    function wrap(inner, label) { return '<svg class="scene-svg" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + label + '">' + inner + "</svg>"; }

    // waves for the pool
    function waves(y, dx, d2) {
      var p = "M180 " + y; for (var i = 0; i < 16; i++) p += " q" + (dx / 2) + " -4 " + dx + " 0";
      return '<path d="' + p + '" stroke="rgba(255,255,255,.55)" stroke-width="2" fill="none">' +
        '<animateTransform attributeName="transform" type="translate" dur="' + d2 + '" repeatCount="indefinite" values="0 0;-' + dx + ' 0"/></path>';
    }
    function drops() {
      var out = "";
      for (var i = 0; i < 6; i++) {
        var x = 334 + (i % 3) * 9, begin = (i * 0.17).toFixed(2) + "s";
        out += '<path d="M' + x + ' 84 v10" stroke="#bfe3ec" stroke-width="2" stroke-linecap="round" opacity="0">' +
          '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="1s" begin="' + begin + '" repeatCount="indefinite"/>' +
          '<animateTransform attributeName="transform" type="translate" values="0 0;0 150" dur="1s" begin="' + begin + '" repeatCount="indefinite"/></path>';
      }
      return out;
    }
    function steam() {
      var out = "";
      [326, 338, 350].forEach(function (x, i) {
        out += '<path d="M' + x + " 178 c-5 -6 5 -11 0 -17 c-5 -6 5 -11 0 -17 c-5 -6 5 -10 0 -15\" stroke=\"rgba(242,238,230,.6)\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\" opacity=\"0\">" +
          '<animate attributeName="opacity" values="0;.9;0" dur="2.4s" begin="' + (i * 0.6) + 's" repeatCount="indefinite"/>' +
          '<animateTransform attributeName="transform" type="translate" values="0 6;0 -10" dur="2.4s" begin="' + (i * 0.6) + 's" repeatCount="indefinite"/></path>';
      });
      return out;
    }

    return {
      floors: wrap(
        bg("sc-fl", "#202328", "#16181b") +
        '<path d="M236 150 L352 150 L400 240 L276 240 Z" fill="rgba(242,238,230,.035)"/>' +
        '<rect x="236" y="46" width="116" height="104" rx="3" fill="#262a30" stroke="#3d434b" stroke-width="3"/>' +
        '<path d="M294 46 V150 M236 98 H352" stroke="#3d434b" stroke-width="3"/>' +
        '<path d="M246 60 l18 0 M246 66 l10 0" stroke="rgba(242,238,230,.18)" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M0 226 H400" stroke="' + C.line + '" stroke-width="1"/>' +
        '<rect x="0" y="240" width="400" height="80" fill="' + C.screed + '"/>' +
        '<path d="M0 262 H400 M0 290 H400" stroke="#34332f" stroke-width="1"/>' +
        '<g><rect x="18" y="222" width="40" height="5" fill="' + C.tile + '" stroke="' + C.grout + '"/><rect x="20" y="216" width="40" height="5" fill="' + C.tile + '" stroke="' + C.grout + '"/><rect x="17" y="210" width="40" height="5" fill="' + C.tile + '" stroke="' + C.grout + '"/></g>' +
        slabRow(C.tile, C.grout) + bucket(286) +
        '<path d="M244 239 h26 M270 239 l8 -8" stroke="#8a8f97" stroke-width="3"' + S + "/>" +
        placedSlab(C.tile, C.grout) + kneeling(C.tile, C.grout),
        "Worker laying a floor tile"),
      walls: wrap(
        bg("sc-wa", "#1e2125", "#16181b") +
        '<rect x="232" y="44" width="148" height="226" fill="#2a2e33"/>' +
        wallGrid(238, 5, 50, 7, C.tile, C.grout) + slot(C.tile, C.grout) +
        floorStanding("#202328") + standing(C.tile, C.grout),
        "Worker tiling a wall"),
      bathrooms: wrap(
        bg("sc-ba", "#1d2428", "#15191c") +
        '<rect x="232" y="44" width="148" height="226" fill="#26313a"/>' +
        wallGrid(238, 5, 50, 7, "#dce8ec", "#9fb4bc") + slot("#dce8ec", "#9fb4bc") +
        '<path d="M372 44 V70 H352" stroke="#c9cfd4" stroke-width="4"' + S + '/><path d="M330 74 H362" stroke="#c9cfd4" stroke-width="6"' + S + "/>" +
        drops() + '<rect x="300" y="252" width="80" height="8" rx="2" fill="#c9cfd4"/>' +
        floorStanding("#1f272c") + standing("#dce8ec", "#9fb4bc"),
        "Worker tiling a shower wall"),
      kitchens: wrap(
        bg("sc-ki", "#211f1c", "#171615") +
        '<rect x="232" y="22" width="148" height="46" rx="3" fill="#2d2a26" stroke="#3d3934"/><path d="M306 22 V68 M296 50 v8 M316 50 v8" stroke="#4a453f" stroke-width="2"/>' +
        '<rect x="232" y="74" width="148" height="116" fill="#2a2724"/>' +
        wallGrid(238, 5, 78, 4, "#3f7b72", "#2b5650") + slot("#3f7b72", "#2b5650") +
        '<rect x="226" y="190" width="160" height="10" rx="2" fill="#c9c2b4"/>' +
        '<rect x="232" y="200" width="148" height="70" fill="#2d2a26" stroke="#3d3934"/><path d="M306 200 V270 M296 226 v10 M316 226 v10" stroke="#4a453f" stroke-width="2"/>' +
        '<path d="M318 180 H360 V184 A8 8 0 0 1 352 190 H326 A8 8 0 0 1 318 184 Z" fill="#56595e"/><path d="M360 182 H378" stroke="#56595e" stroke-width="4" stroke-linecap="round"/>' +
        steam() + floorStanding("#201e1b") + standing("#3f7b72", "#2b5650"),
        "Worker tiling a kitchen splashback"),
      outdoor: wrap(
        bg("sc-ou", "#2b211b", "#191513") +
        '<g><circle cx="330" cy="72" r="22" fill="' + C.gold + '"/><g stroke="' + C.gold + '" stroke-width="3" stroke-linecap="round">' +
          [0, 45, 90, 135, 180, 225, 270, 315].map(function (d) { var r = d * Math.PI / 180; return '<path d="M' + (330 + Math.cos(r) * 30).toFixed(1) + " " + (72 + Math.sin(r) * 30).toFixed(1) + " L" + (330 + Math.cos(r) * 40).toFixed(1) + " " + (72 + Math.sin(r) * 40).toFixed(1) + '"/>'; }).join("") +
          '<animateTransform attributeName="transform" type="rotate" values="0 330 72;360 330 72" dur="16s" repeatCount="indefinite"/></g></g>' +
        '<path d="M0 168 H400" stroke="#5a4637" stroke-width="3"/>' +
        [20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map(function (x) { return '<path d="M' + x + ' 168 V232" stroke="#4a3a2e" stroke-width="3"/>'; }).join("") +
        '<path d="M0 232 H400" stroke="#4a3a2e" stroke-width="2"/>' +
        '<rect x="0" y="240" width="400" height="80" fill="#3a2a22"/><path d="M0 266 H400 M0 294 H400" stroke="#4a362b" stroke-width="1"/>' +
        '<path d="M300 210 H330 L326 240 H304 Z" fill="#8a4a2e"/><path d="M315 210 C305 192 296 190 290 182 M315 210 C318 190 326 184 334 178 M315 210 C312 196 316 188 314 176" stroke="#6f8f52" stroke-width="4"' + S + "/>" +
        slabRow("#c46a44", "#7b3a22") + placedSlab("#c46a44", "#7b3a22") + kneeling("#c46a44", "#7b3a22"),
        "Worker laying terrace tiles in the sun"),
      pools: wrap(
        bg("sc-po", "#18252a", "#121a1d") +
        '<rect x="0" y="240" width="212" height="80" fill="' + C.screed + '"/>' +
        '<defs><linearGradient id="sc-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2aa3b2"/><stop offset="1" stop-color="#0f5566"/></linearGradient><clipPath id="sc-pool"><rect x="212" y="240" width="188" height="80"/></clipPath></defs>' +
        '<rect x="212" y="240" width="188" height="80" fill="url(#sc-water)"/>' +
        '<g clip-path="url(#sc-pool)"><g stroke="rgba(255,255,255,.12)" stroke-width="1">' +
          [252, 266, 280, 294, 308].map(function (y) { return '<path d="M212 ' + y + ' H400"/>'; }).join("") +
          [226, 240, 254, 268, 282, 296, 310, 324, 338, 352, 366, 380, 394].map(function (x) { return '<path d="M' + x + ' 240 V320"/>'; }).join("") +
        "</g>" + waves(250, 24, "2.4s") + waves(262, 30, "3.6s") + "</g>" +
        '<path d="M360 196 V300 M380 196 V300 M360 226 H380 M360 252 H380 M360 278 H380 M360 196 q0 -12 -12 -12 M380 196 q0 -12 12 -12" stroke="#c9cfd4" stroke-width="3.5"' + S + "/>" +
        slabRow("#d9d2c5", "#9b9488") + placedSlab("#d9d2c5", "#9b9488") + kneeling("#d9d2c5", "#9b9488"),
        "Worker setting pool coping stones")
    };
  })();

  buildLayout();
  each("[data-logo]", function (el) { el.innerHTML = LOGO_MARK; });
  each("[data-scene]", function (el) { el.innerHTML = SCENES[el.getAttribute("data-scene")] || ""; });
  // play a scene only while it is on screen
  (function () {
    var scenes = Array.prototype.slice.call(document.querySelectorAll(".scene-svg"));
    if (!scenes.length) return;
    scenes.forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); });
    if (reduced || !("IntersectionObserver" in window)) return;
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.target.pauseAnimations) return;
        if (e.isIntersecting) e.target.unpauseAnimations(); else e.target.pauseAnimations();
      });
    }, { threshold: 0.15 });
    scenes.forEach(function (s) { sio.observe(s); });
  })();
  each("[data-svc-anim]", function (el) { el.innerHTML = SVC_ANIM[el.getAttribute("data-svc-anim")] || ""; });

  // entrance order for the header items
  (function () {
    var hdr = document.querySelector(".site-header");
    var brand = hdr.querySelector(".brand"), lng = hdr.querySelector(".lang"), cta = hdr.querySelector(".header-cta"), tog = hdr.querySelector(".menu-toggle");
    [[brand, 0], [lng, NAV.length + 1], [cta, NAV.length + 2], [tog, NAV.length + 2]].forEach(function (p) {
      p[0].classList.add("hx"); p[0].style.setProperty("--hd", p[1]);
    });
  })();

  // Sliding highlight that follows the mouse across the menu and rests on the current page
  (function navIndicator() {
    var nav = document.querySelector(".nav");
    var ind = nav && nav.querySelector(".nav-indicator");
    if (!ind) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
    var current = nav.querySelector('a[aria-current="page"]');
    var moveTo = function (a) {
      if (!a || !a.offsetWidth) { ind.style.opacity = "0"; return; }
      ind.style.opacity = "1";
      ind.style.width = a.offsetWidth + "px";
      ind.style.transform = "translateX(" + a.offsetLeft + "px)";
    };
    var place = function () {
      ind.classList.add("no-anim");
      moveTo(current);
      void ind.offsetWidth;
      ind.classList.remove("no-anim");
    };
    links.forEach(function (a) {
      a.addEventListener("mouseenter", function () { moveTo(a); });
      a.addEventListener("focus", function () { moveTo(a); });
    });
    nav.addEventListener("mouseleave", function () { moveTo(current); });
    nav.addEventListener("focusout", function (e) { if (!nav.contains(e.relatedTarget)) moveTo(current); });
    window.addEventListener("resize", place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    place();
  })();
  applyI18n();
  bindContacts();
  if (DICT["meta." + PAGE + ".title"]) document.title = t("meta." + PAGE + ".title");
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && PAGE === "home") metaDesc.setAttribute("content", t("meta.home.desc"));

  /* =======================================================
     Page transition: the logo flies in as 9 pieces and locks together
     ======================================================= */
  var pt = document.querySelector(".pt");
  var pieces = Array.prototype.slice.call(pt.querySelectorAll(".pc"));
  var LEAVE_MS = 780;

  // scatter every piece in a random direction (they fly back into place from there)
  function scatterPieces() {
    pieces.forEach(function (p, i) {
      var centre = p.classList.contains("pc-c");
      var ang = Math.random() * Math.PI * 2;
      var dist = centre ? 0 : 60 + Math.random() * 70;
      p.style.setProperty("--x", (Math.cos(ang) * dist).toFixed(1) + "px");
      p.style.setProperty("--y", (Math.sin(ang) * dist).toFixed(1) + "px");
      p.style.setProperty("--r", centre ? "-180deg" : (Math.random() * 240 - 120).toFixed(0) + "deg");
      p.style.setProperty("--d", centre ? "300ms" : (70 + i * 22 + Math.random() * 40).toFixed(0) + "ms");
    });
  }
  scatterPieces();
  root.classList.add("pt-ready");

  function leave(href, x, y) {
    closeMenu();
    if (reduced) { window.location.href = href; return; }
    pt.classList.add("no-anim");
    pt.classList.remove("is-revealing", "is-covering");
    scatterPieces();
    pt.style.setProperty("--cx", (x == null ? window.innerWidth / 2 : x) + "px");
    pt.style.setProperty("--cy", (y == null ? window.innerHeight / 2 : y) + "px");
    void pt.offsetWidth;
    pt.classList.remove("no-anim");
    pt.classList.add("is-covering");
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    setTimeout(function () { window.location.href = href; }, LEAVE_MS);
  }

  function enter() {
    var entering = root.classList.contains("is-entering");
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    if (!entering) { root.classList.add("logo-intro"); onReady(); return; }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        pt.classList.add("is-revealing");
        root.classList.remove("is-entering");
        onReady();
        setTimeout(function () {
          pt.classList.add("no-anim");
          pt.classList.remove("is-revealing");
          void pt.offsetWidth;
          pt.classList.remove("no-anim");
        }, 800);
      });
    });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
    var url;
    try { url = new URL(a.href, window.location.href); } catch (err) { return; }
    if (url.protocol !== window.location.protocol || url.host !== window.location.host) return;
    if (!/(\.html?|\/)$/.test(url.pathname)) return;
    var samePage = url.pathname === window.location.pathname;
    if (samePage && url.hash) return;
    e.preventDefault();
    if (samePage) { closeMenu(); window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); return; }
    leave(url.href, e.clientX || null, e.clientY || null);
  });

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) { pt.classList.remove("is-covering"); pt.classList.add("is-revealing"); setTimeout(function () { pt.classList.remove("is-revealing"); }, 800); }
  });

  // Language switch: remember the choice and replay the page with the tile transition
  each("[data-lang]", function (btn) {
    btn.addEventListener("click", function () {
      var l = btn.getAttribute("data-lang");
      if (l === lang) return;
      store(LANG_KEY, l);
      each(".lang", function (g) { g.style.setProperty("--li", LANGS.indexOf(l)); });
      each("[data-lang]", function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-lang") === l ? "true" : "false"); });
      var url = new URL(window.location.href);
      url.searchParams.delete("lang");
      setTimeout(function () { leave(url.pathname + url.search + url.hash); }, 250);
    });
  });

  /* =======================================================
     Data-driven sections (rendered before reveals start)
     ======================================================= */
  // A photo (if the item has one) or a tile-pattern placeholder.
  // natural = true keeps the photo's own height (gallery grid); otherwise it fills its box.
  function patternOrImg(item, which, natural) {
    var src = which ? item[which] : item.src;
    var pat = which ? item[which + "Pattern"] : item.pattern;
    if (src) {
      var img = '<img src="' + esc(src) + '" alt="' + esc(captionText(item)) + '" loading="lazy" decoding="async">';
      return natural ? img : '<div class="pat pat-photo">' + img + "</div>";
    }
    return '<div class="pat pat-' + esc(pat || "marble") + '"></div>';
  }
  function placeText(item) {
    var c = item.country ? t("country." + item.country) : "";
    return item.town ? esc(item.town) + (c ? ", " + c : "") : c;
  }
  function captionText(item) { return t("cat." + item.cat) + (item.country || item.town ? " · " + placeText(item).replace(/&amp;/g, "&") : ""); }

  var GALLERY = (window.VSH_GALLERY || []).filter(function (g) { return g && (g.src || g.pattern); });

  // Home: 3D ring of worker scenes.
  // It turns smoothly by itself. Visitors can also drag/swipe it, use the arrows,
  // tap a side worker, click a diamond or use the keyboard arrows.
  // Hovering stops it; it carries on by itself a few seconds after the last touch.
  (function craft3d() {
    var sec = document.querySelector("[data-craft3d]");
    if (!sec) return;
    var ring = sec.querySelector(".c3-ring");
    var stage = sec.querySelector(".c3-stage");
    var cards = Array.prototype.slice.call(sec.querySelectorAll(".c3-card"));
    var dots = Array.prototype.slice.call(sec.querySelectorAll(".c3-dots i"));
    var info = sec.querySelector(".c3-info");
    var n = cards.length, step = 360 / n, shown = -1;
    var SPEED = 26 / step;          // auto-turn speed in cards per second (~2.3 s per service)
    var IDLE_MS = 4000;             // after a manual switch, wait this long before turning by itself again
    var pos = 0, vel = 0, target = null;
    var hovering = false, dragging = false, manualUntil = 0;
    var onScreen = false, lastT = 0, rafId = null;

    // arrows on both sides of the ring
    var arrow = function (dir) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "c3-arrow c3-" + (dir < 0 ? "prev" : "next");
      b.setAttribute("aria-label", t(dir < 0 ? "c3.prev" : "c3.next"));
      b.innerHTML = dir < 0 ? ICON.left : ICON.arrow;
      b.addEventListener("click", function () { nudge(dir); });
      stage.appendChild(b);
    };
    arrow(-1); arrow(1);
    stage.setAttribute("tabindex", "0");
    stage.setAttribute("role", "region");
    stage.setAttribute("aria-label", t("home.services.eyebrow"));

    function now() { return performance.now(); }
    function wrap(i) { return ((i % n) + n) % n; }
    function goToCard(i) {
      var base = target !== null ? target : Math.round(pos);
      var diff = i - wrap(base);
      if (diff > n / 2) diff -= n;
      if (diff < -n / 2) diff += n;
      target = base + diff; vel = 0; manualUntil = now() + IDLE_MS; run();
    }
    function nudge(dir) {
      var base = target !== null ? target : Math.round(pos);
      target = base + dir; vel = 0; manualUntil = now() + IDLE_MS; run();
    }

    function frame(t) {
      var dt = lastT ? Math.min(0.1, (t - lastT) / 1000) : 1 / 60;
      lastT = t;
      if (!dragging) {
        if (target === null && (hovering || t < manualUntil || reduced)) {
          // coming to a stop: carry a little momentum, then rest on the nearest worker
          target = Math.round(pos + vel * 0.3);
          vel = 0;
        }
        if (target !== null) {
          // smooth spring towards the chosen worker
          pos += (target - pos) * (1 - Math.exp(-dt * 7.5));
          if (Math.abs(target - pos) < 0.0008) {
            pos = target;
            if (!hovering && t >= manualUntil && !reduced) target = null; // free to turn by itself again
          }
        } else {
          // turning by itself, easing in gently
          vel += (SPEED - vel) * (1 - Math.exp(-dt * 1.6));
          pos += vel * dt;
        }
      }
      render(pos);
      var idle = target !== null && pos === target && (hovering || reduced);
      rafId = onScreen && !document.hidden && !idle ? requestAnimationFrame(frame) : null;
      if (!rafId && target !== null && !reduced && onScreen) {
        // resting while hovered/reduced: wake up again later
        setTimeout(run, 250);
      }
    }
    function run() { if (!rafId && onScreen && !document.hidden) { lastT = 0; rafId = requestAnimationFrame(frame); } }

    function render(p) {
      var rot = -p * step;
      if (!reduced) ring.style.transform = "translate(-50%, -50%) translateZ(calc(var(--w) * -0.98)) rotateX(-7deg) rotateY(" + rot.toFixed(3) + "deg)";
      var front = wrap(Math.round(p));
      cards.forEach(function (c, i) {
        var ang = ((i * step + rot) % 360 + 540) % 360 - 180;
        var f = Math.max(0, 1 - Math.abs(ang) / 130);
        c.style.setProperty("--f", f.toFixed(3));
        if ((i === front) !== c.classList.contains("is-front")) c.classList.toggle("is-front", i === front);
      });
      if (front !== shown) { shown = front; dots.forEach(function (d, i) { d.classList.toggle("on", i === front); }); showInfo(front); }
    }

    // the service in front: number, animated icon, name, short text and link
    function showInfo(i) {
      if (!info || !cards[i]) return;
      var key = cards[i].getAttribute("data-key");
      var fill = function () {
        info.querySelector(".c3-num").textContent = ("0" + (i + 1)) + " / 0" + n;
        info.querySelector(".c3-name").innerHTML = t("svc." + key);
        info.querySelector(".c3-text").innerHTML = t("svc." + key + ".short");
        info.querySelector(".c3-icon").innerHTML = SVC_ANIM[key] || "";
        info.querySelector(".c3-more").href = "services.html#" + key;
        info.classList.remove("is-swapping");
      };
      clearTimeout(info._t);
      if (info.dataset.ready) { info.classList.add("is-swapping"); info._t = setTimeout(fill, 160); }
      else { info.dataset.ready = "1"; fill(); }
    }

    // hover: stop gently; leave: carry on shortly after
    [stage, info].forEach(function (el) {
      if (!el) return;
      el.addEventListener("mouseenter", function () { hovering = true; run(); });
      el.addEventListener("mouseleave", function () { hovering = false; manualUntil = Math.max(manualUntil, now() + 900); run(); });
    });

    // drag / swipe the ring
    var startX = 0, startPos = 0, lastX = 0, lastMoveT = 0, dragVel = 0, pointerId = null, moved = false, suppressClick = false;
    function pxPerCard() { return (cards[0].offsetWidth || 300) * 0.85; }
    stage.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || e.target.closest(".c3-arrow")) return;
      pointerId = e.pointerId; moved = false;
      startX = lastX = e.clientX; startPos = pos; lastMoveT = now(); dragVel = 0;
    });
    stage.addEventListener("pointermove", function (e) {
      if (pointerId !== e.pointerId) return;
      var dx = e.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) < 7) return;
        moved = true; dragging = true; target = null; vel = 0; startX = e.clientX; startPos = pos;
        stage.classList.add("is-dragging");
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
        run();
        dx = 0;
      }
      var tNow = now(), dtm = Math.max(1, tNow - lastMoveT);
      dragVel = 0.8 * (-(e.clientX - lastX) / pxPerCard() / (dtm / 1000)) + 0.2 * dragVel;
      lastX = e.clientX; lastMoveT = tNow;
      pos = startPos - dx / pxPerCard();
    });
    function endDrag(e) {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      if (!dragging) return;
      dragging = false;
      stage.classList.remove("is-dragging");
      var fling = Math.max(-2, Math.min(2, dragVel * 0.28)); // a quick flick carries on up to 2 workers
      target = Math.round(pos + fling);
      manualUntil = now() + IDLE_MS;
      suppressClick = true; setTimeout(function () { suppressClick = false; }, 60);
      run();
    }
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", function (e) { if (pointerId === e.pointerId) { pointerId = null; dragging = false; stage.classList.remove("is-dragging"); } });

    // tapping a side worker turns it to the front; tapping the front one opens that service
    cards.forEach(function (c, i) {
      c.addEventListener("click", function (e) {
        if (suppressClick || !c.classList.contains("is-front")) {
          e.preventDefault(); e.stopPropagation();
          if (!suppressClick) goToCard(i);
        }
      }, true);
      c.addEventListener("dragstart", function (e) { e.preventDefault(); });
    });

    // the small diamonds jump straight to a service
    dots.forEach(function (d, i) { d.addEventListener("click", function () { goToCard(i); }); });

    // keyboard: left / right arrows while the ring has focus
    stage.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nudge(1); }
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; run(); }, { threshold: 0.1 }).observe(sec);
    } else { onScreen = true; run(); }
    document.addEventListener("visibilitychange", run);
    render(0);
  })();

  // Home: the photos beside the story text flip quickly through our jobs
  (function storySlides() {
    var panels = Array.prototype.slice.call(document.querySelectorAll(".stack .panel > .pat"));
    if (!panels.length || GALLERY.length < 3) return;
    var timers = [], running = false;
    panels.forEach(function (holder, pi) {
      holder.className = "pat slides";
      var start = (pi * Math.ceil(GALLERY.length / panels.length)) % GALLERY.length;
      holder.innerHTML = '<div class="slide is-on">' + patternOrImg(GALLERY[start]) + "</div>";
      holder._i = start; holder._z = 1;
    });
    function next(holder) {
      holder._i = (holder._i + 1) % GALLERY.length;
      var s = document.createElement("div");
      s.className = "slide";
      s.style.zIndex = ++holder._z;
      s.innerHTML = patternOrImg(GALLERY[holder._i]);
      holder.appendChild(s);
      void s.offsetWidth;
      s.classList.add("is-on");
      var old = holder.querySelectorAll(".slide");
      if (old.length > 3) holder.removeChild(old[0]);
    }
    function start() {
      if (running || reduced) return;
      running = true;
      panels.forEach(function (h, pi) {
        timers[pi] = setTimeout(function tick() { next(h); timers[pi] = setTimeout(tick, 1500); }, 600 + pi * 450);
      });
    }
    function stop() { running = false; timers.forEach(clearTimeout); }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { if (es[0].isIntersecting) start(); else stop(); }, { threshold: 0.2 })
        .observe(document.querySelector(".stack"));
    }
  })();

  // Home: featured work
  each('[data-gallery="featured"]', function (wrap) {
    var featured = GALLERY.filter(function (g) { return g.featured; });
    if (featured.length < 4) featured = featured.concat(GALLERY.filter(function (g) { return !g.featured; })).slice(0, 4);
    var spans = ["span-7", "span-5", "span-5", "span-7"];
    wrap.innerHTML = featured.slice(0, 4).map(function (item, i) {
      return '<a class="project ' + spans[i] + '" href="gallery.html" data-reveal="clip" style="--i:' + (i % 2 ? 2 : 0) + '">' +
        patternOrImg(item) + '<div class="project-shade"></div>' +
        '<div class="project-info"><div><small>' + t("cat." + item.cat) + "</small><h3>" + placeText(item) + '</h3></div><span class="project-arrow">' + ICON.diag + "</span></div></a>";
    }).join("");
  });

  // Gallery page: masonry grid + filters + lightbox
  var galleryGrid = document.querySelector('[data-gallery="all"]');
  if (galleryGrid) {
    galleryGrid.innerHTML = GALLERY.map(function (item, i) {
      var media = item.src
        ? '<div class="g-media">' + patternOrImg(item, null, true) + "</div>"
        : '<div class="g-media is-pattern" style="--ratio:' + esc(item.ratio || "4/5") + '">' + patternOrImg(item) + "</div>";
      return '<button type="button" class="g-item" data-index="' + i + '" data-cat="' + esc([item.cat].concat(item.tags || []).join(" ")) + '" data-reveal style="--i:' + (i % 3) + '" aria-label="' + esc(t("lb.open") + ": " + captionText(item)) + '">' +
        media + '<span class="g-cap"><span><small>' + t("cat." + item.cat) + "</small><strong>" + placeText(item) + '</strong></span><span class="g-zoom">' + ICON.zoom + "</span></span></button>";
    }).join("");
  }

  /* -------------------------------------------------------
     Moving strip of services with triangle tiles.
     Every word opens an info panel with examples of our work.
     ------------------------------------------------------- */
  var TOPICS = [
    ["floors", "cat.floors", "svc.floors", "svc.floors.short", "sp.floors"],
    ["walls", "cat.walls", "svc.walls", "svc.walls.short", "sp.walls"],
    ["bathrooms", "cat.bathrooms", "svc.bathrooms", "svc.bathrooms.short", "sp.bathrooms"],
    ["kitchens", "cat.kitchens", "svc.kitchens", "svc.kitchens.short", "sp.kitchens"],
    ["outdoor", "mq.terraces", "svc.outdoor", "svc.outdoor.short", "sp.outdoor"],
    ["pools", "cat.pools", "svc.pools", "svc.pools.short", "sp.pools"],
    ["mosaics", "mq.mosaics", "mq.mosaics", "tp.mosaics.text", "tp.mosaics"],
    ["large", "mq.large", "mq.large", "tp.large.text", "tp.large"]
  ];
  function inTopic(item, key) { return item.cat === key || (item.tags || []).indexOf(key) !== -1; }

  each("[data-marquee]", function (mq) {
    var group = function (hidden) {
      return '<div class="marquee-group"' + (hidden ? ' aria-hidden="true"' : "") + ">" + TOPICS.map(function (tp, i) {
        return '<button type="button" class="mq-item" data-topic="' + tp[0] + '"' + (hidden ? ' tabindex="-1"' : "") + ">" +
          "<span>" + t(tp[1]) + '</span><i class="mq-plus" aria-hidden="true"></i></button>' +
          '<span class="tri tri-' + (i % 3) + '" aria-hidden="true"></span>';
      }).join("") + "</div>";
    };
    mq.innerHTML = '<div class="marquee-track">' + group(false) + group(true) + "</div>";
  });

  var topicEl = null;
  function buildTopicPanel() {
    topicEl = document.createElement("div");
    topicEl.className = "topic";
    topicEl.setAttribute("role", "dialog");
    topicEl.setAttribute("aria-modal", "true");
    topicEl.innerHTML =
      '<div class="topic-backdrop"></div>' +
      '<div class="topic-panel" tabindex="-1">' +
        '<button type="button" class="topic-close" aria-label="' + esc(t("lb.close")) + '">' + ICON.close + "</button>" +
        '<div class="topic-media"></div>' +
        '<div class="topic-body">' +
          '<span class="eyebrow topic-eyebrow"></span><h2 class="topic-title"></h2><p class="topic-text"></p>' +
          '<ul class="checklist topic-points"></ul>' +
          '<div class="topic-actions"><a class="btn" href="contact.html">' + t("home.cta1") + " " + ICON.arrow + '</a><a class="link-arrow topic-more"></a></div>' +
        "</div>" +
      "</div>";
    body.appendChild(topicEl);
    topicEl.querySelector(".topic-close").addEventListener("click", closeTopic);
    topicEl.querySelector(".topic-backdrop").addEventListener("click", closeTopic);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && topicEl.classList.contains("is-open")) closeTopic(); });
  }
  var topicReturn = null;
  function openTopic(key) {
    var tp = TOPICS.filter(function (x) { return x[0] === key; })[0];
    if (!tp) return;
    if (!topicEl) buildTopicPanel();
    topicReturn = document.activeElement;
    topicEl.querySelector(".topic-eyebrow").textContent = t("home.work.eyebrow");
    topicEl.querySelector(".topic-title").innerHTML = t(tp[2]);
    topicEl.querySelector(".topic-text").innerHTML = t(tp[3]);
    topicEl.querySelector(".topic-points").innerHTML = [1, 2, 3, 4].map(function (n, i) {
      return '<li style="--i:' + i + '">' + t(tp[4] + "." + n) + "</li>";
    }).join("");
    var more = topicEl.querySelector(".topic-more");
    more.href = "gallery.html?filter=" + key;
    more.innerHTML = "<span>" + t("tp.gallery") + "</span> " + ICON.arrow;
    var examples = GALLERY.filter(function (g) { return inTopic(g, key); }).slice(0, 4);
    var media = topicEl.querySelector(".topic-media");
    media.hidden = !examples.length;
    media.innerHTML = examples.map(function (item, i) {
      return '<a class="topic-thumb" style="--i:' + i + '" href="gallery.html?filter=' + key + '" aria-label="' + esc(captionText(item)) + '">' + patternOrImg(item) + "<span>" + placeText(item) + "</span></a>";
    }).join("");
    topicEl.classList.toggle("has-media", examples.length > 0);
    topicEl.classList.add("is-open");
    root.classList.add("topic-open");
    setTimeout(function () { topicEl.querySelector(".topic-close").focus({ preventScroll: true }); }, 50);
  }
  function closeTopic() {
    if (!topicEl) return;
    topicEl.classList.remove("is-open");
    root.classList.remove("topic-open");
    if (topicReturn && topicReturn.focus) topicReturn.focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest(".mq-item") : null;
    if (b) openTopic(b.getAttribute("data-topic"));
  });

  // Before / after
  var baWrap = document.querySelector("[data-before-after]");
  if (baWrap) {
    var pairs = window.VSH_BEFORE_AFTER || [];
    if (!pairs.length) { var sec = baWrap.closest("section"); if (sec) sec.hidden = true; }
    baWrap.innerHTML = pairs.map(function (p, i) {
      return '<figure class="ba-item" data-reveal style="--i:' + i + '"><div class="ba" style="--pos:50%">' +
        '<div class="ba-layer ba-after">' + patternOrImg(p, "after") + "</div>" +
        '<div class="ba-layer ba-before">' + patternOrImg(p, "before") + "</div>" +
        '<span class="ba-label ba-label-b">' + t("ba.before") + '</span><span class="ba-label ba-label-a">' + t("ba.after") + "</span>" +
        '<div class="ba-handle" aria-hidden="true"><span>' + ICON.drag + "</span></div>" +
        '<input class="ba-range" type="range" min="0" max="100" value="50" aria-label="' + esc(t("ba.label")) + '">' +
        "</div><figcaption><small>" + t("cat." + p.cat) + "</small> " + placeText(p) + "</figcaption></figure>";
    }).join("");
    each(".ba", function (ba) {
      var input = ba.querySelector(".ba-range");
      var setPos = function (v) {
        v = Math.max(0, Math.min(100, v));
        ba.style.setProperty("--pos", v + "%");
        input.value = v;
        ba.dataset.touched = "1";
      };
      // keyboard / screen readers
      input.addEventListener("input", function () { setPos(+input.value); });
      // mouse, pen and finger: drag anywhere on the photo
      var dragging = false, startX = 0, startY = 0, decided = false;
      var fromEvent = function (e) { var r = ba.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * 100; };
      ba.addEventListener("pointerdown", function (e) {
        dragging = true; decided = e.pointerType !== "touch"; startX = e.clientX; startY = e.clientY;
        if (decided) { ba.setPointerCapture(e.pointerId); setPos(fromEvent(e)); }
      });
      ba.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        if (!decided) {
          // on touch, only take over once the finger clearly moves sideways
          var dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
          if (dx < 6 && dy < 6) return;
          if (dy > dx) { dragging = false; return; }
          decided = true;
          try { ba.setPointerCapture(e.pointerId); } catch (err) {}
        }
        setPos(fromEvent(e));
      });
      var end = function (e) {
        if (dragging && !decided && e.type === "pointerup") setPos(fromEvent(e)); // a tap jumps there
        dragging = false;
      };
      ba.addEventListener("pointerup", end);
      ba.addEventListener("pointercancel", function () { dragging = false; });
    }, baWrap);
  }

  /* -------------------------------------------------------
     Reviews
     Visitors publish reviews straight to the site. They are stored
     in a Supabase database (see config.js + README). Reviews in
     reviews-data.js are shown as well.
     ------------------------------------------------------- */
  var isLocal = /^(localhost|127\.0\.0\.1|\[::1\]|)$/.test(window.location.hostname) || window.location.protocol === "file:";
  var DB = CFG.reviewsDatabase || {};
  var dbReady = !!(DB.url && DB.anonKey);
  var DEMO_KEY = "vsh-demo-reviews";
  var STATIC_REVIEWS = (window.VSH_REVIEWS || []).filter(function (r) { return r && r.text && r.rating; });
  var remoteReviews = [];

  function demoReviews() {
    try { return JSON.parse(localStorage.getItem(DEMO_KEY) || "[]"); } catch (e) { return []; }
  }
  function currentReviews() {
    var list = remoteReviews.concat(STATIC_REVIEWS);
    // Preview on your own computer before the database is connected: reviews are kept in this browser only
    if (!dbReady && isLocal) list = demoReviews().concat(list);
    if (!list.length && isLocal) list = (window.VSH_SAMPLE_REVIEWS || []).map(function (r) { r.sample = true; return r; });
    return list.slice().sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")); });
  }
  function dbHeaders(extra) {
    var h = { apikey: DB.anonKey, Authorization: "Bearer " + DB.anonKey, "Content-Type": "application/json" };
    if (extra) Object.keys(extra).forEach(function (k) { h[k] = extra[k]; });
    return h;
  }
  function dbEndpoint() { return String(DB.url).replace(/\/+$/, "") + "/rest/v1/reviews"; }
  function rowToReview(row) {
    return { name: row.name, town: row.town, country: row.country, rating: row.rating, service: row.service, text: row.text, lang: row.lang, date: String(row.created_at || "").slice(0, 10) };
  }

  function starsHTML(n, cls) {
    var out = '<span class="stars ' + (cls || "") + '" role="img" aria-label="' + esc(t("rp.stars", { n: n })) + '">';
    for (var i = 1; i <= 5; i++) out += '<span class="' + (i <= Math.round(n) ? "on" : "off") + '">' + ICON.star + "</span>";
    return out + "</span>";
  }
  function initials(name) {
    return String(name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p.charAt(0).toUpperCase(); }).join("");
  }
  function fmtDate(d) {
    if (!d) return "";
    var parts = String(d).split("-");
    try { return new Date(+parts[0], (+parts[1] || 1) - 1, 1).toLocaleDateString(LOCALE[lang], { month: "long", year: "numeric" }); }
    catch (e) { return d; }
  }
  // Which language a review is written in: what the visitor used, or a guess from its letters
  function reviewLang(r) {
    if (r.lang && LANGS.indexOf(r.lang) !== -1) return r.lang;
    var s = String(r.text || "");
    if (/[ëçË]/.test(s) || /\b(dhe|është|shumë|për|një|punë)\b/i.test(s)) return "sq";
    if (/[čćšžđČĆŠŽĐ]/.test(s) || /\b(je|smo|vrlo|odlično|hvala|posao|ovo|ovdje|za)\b/i.test(s)) return "me";
    return "en";
  }

  /* Translate a review into the language the visitor is using.
     Uses the free MyMemory service (no account needed); if it is unavailable
     the review opens in Google Translate instead. */
  var TR_CODE = { en: "en", sq: "sq", me: "hr" }; // Montenegrin → Croatian/Latin, the closest supported language
  var trCache = {};
  function translateText(text, from, to) {
    var key = from + ">" + to + ":" + text;
    if (trCache[key]) return Promise.resolve(trCache[key]);
    // the service accepts ~450 characters per request: split on sentences
    var parts = [], buf = "";
    (String(text).match(/[^.!?]+[.!?]*\s*/g) || [String(text)]).forEach(function (s) {
      s = s.trim(); if (!s) return;
      if ((buf + " " + s).length > 450) { if (buf) parts.push(buf); buf = s; } else buf = buf ? buf + " " + s : s;
    });
    if (buf) parts.push(buf);
    return parts.reduce(function (p, part) {
      return p.then(function (acc) {
        var url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(part) + "&langpair=" + TR_CODE[from] + "|" + TR_CODE[to];
        return fetch(url).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); }).then(function (j) {
          if (!j || Number(j.responseStatus) !== 200 || !j.responseData) throw new Error("translation failed");
          acc.push(j.responseData.translatedText);
          return acc;
        });
      });
    }, Promise.resolve([])).then(function (out) {
      var result = out.join(" ").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
      trCache[key] = result;
      return result;
    });
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".rv-tr") : null;
    if (!btn) return;
    var card = btn.closest(".review");
    var quote = card.querySelector("blockquote");
    if (!quote.hasAttribute("data-original")) quote.setAttribute("data-original", quote.textContent);
    var label = btn.querySelector("span");
    if (card.classList.contains("is-translated")) {
      quote.textContent = quote.getAttribute("data-original");
      card.classList.remove("is-translated");
      label.textContent = t("rv.translate");
      var note = card.querySelector(".rv-note"); if (note) note.remove();
      return;
    }
    var from = btn.getAttribute("data-src"), original = quote.getAttribute("data-original");
    btn.disabled = true;
    label.textContent = t("rv.translating");
    translateText(original, from, lang).then(function (txt) {
      quote.classList.add("rv-swap");
      setTimeout(function () {
        quote.textContent = txt;
        quote.classList.remove("rv-swap");
      }, 220);
      card.classList.add("is-translated");
      label.textContent = t("rv.original");
      var note = document.createElement("small");
      note.className = "rv-note";
      note.textContent = t("rv.auto");
      btn.insertAdjacentElement("afterend", note);
    }).catch(function () {
      label.textContent = t("rv.translate");
      window.open("https://translate.google.com/?sl=auto&tl=" + TR_CODE[lang] + "&text=" + encodeURIComponent(original) + "&op=translate", "_blank", "noopener");
    }).then(function () { btn.disabled = false; });
  });

  function reviewHTML(r, i) {
    var meta = [placeText(r), r.service ? t("cat." + r.service) : ""].filter(Boolean).join(" · ");
    var badge = r.sample ? t("rp.sample") : r.demo ? t("rp.demo") : "";
    return '<article class="review' + (r.isNew ? " is-new" : "") + '" data-reveal style="--i:' + (i % 3) + '">' +
      '<div class="review-top">' + starsHTML(r.rating) + (badge ? '<span class="sample-badge">' + badge + "</span>" : "") + "</div>" +
      "<blockquote>" + esc(r.text) + "</blockquote>" +
      (reviewLang(r) !== lang ? '<button type="button" class="rv-tr" data-src="' + reviewLang(r) + '">' + ICON.globe + "<span>" + t("rv.translate") + "</span></button>" : "") +
      '<footer><span class="avatar" aria-hidden="true">' + esc(initials(r.name)) + "</span><div><strong>" + esc(r.name) + "</strong><small>" + meta + "</small></div>" +
      (r.date ? '<time datetime="' + esc(r.date) + '">' + esc(fmtDate(r.date)) + "</time>" : "") + "</footer></article>";
  }

  // Start observing elements that were added after the page was ready
  function revealNew(scope) {
    if (!readyDone) return;
    each("[data-reveal]", function (el) {
      if (el.classList.contains("is-in")) return;
      if (io) io.observe(el); else el.classList.add("is-in");
    }, scope);
  }

  function renderReviews() {
    var REVIEWS = currentReviews();
    each("[data-reviews]", function (wrap) {
      var mode = wrap.getAttribute("data-reviews");
      var list = mode === "teaser" ? REVIEWS.slice(0, 3) : REVIEWS;
      var hideSel = wrap.getAttribute("data-hide-empty");
      var h = hideSel ? document.querySelector(hideSel) : null;
      if (!list.length) { if (h) h.hidden = true; wrap.innerHTML = ""; return; }
      if (h) h.hidden = false;
      var html = list.map(reviewHTML).join("");
      if (mode === "all") {
        // invitation card at the end of the reviews
        html += '<a class="review review-cta" href="#write" data-reveal>' +
          '<span class="review-cta-icon">' + ICON.star + "</span>" +
          "<strong>" + t("rp.cardTitle") + "</strong>" +
          "<span>" + t("rp.cardText") + "</span>" +
          '<span class="review-cta-btn">' + t("rp.writeBtn") + " " + ICON.arrow + "</span></a>";
      }
      wrap.innerHTML = html;
      revealNew(wrap);
    });
    renderSummary(REVIEWS);
  }

  function renderSummary(REVIEWS) {
    var summary = document.querySelector("[data-review-summary]");
    if (!summary) return;
    var empty = document.querySelector("[data-reviews-empty]");
    if (!REVIEWS.length) {
      summary.hidden = true;
      if (empty) empty.hidden = false;
    } else {
      summary.hidden = false;
      if (empty) empty.hidden = true;
      var total = REVIEWS.reduce(function (s, r) { return s + Number(r.rating); }, 0);
      var avg = total / REVIEWS.length;
      var counts = [0, 0, 0, 0, 0];
      REVIEWS.forEach(function (r) { counts[Math.max(1, Math.min(5, Math.round(r.rating))) - 1]++; });
      var max = Math.max.apply(null, counts) || 1;
      summary.innerHTML =
        '<div class="rs-left"><div class="rs-score">' + avg.toFixed(1).replace(".", lang === "en" ? "." : ",") + "</div>" + starsHTML(avg, "stars-lg") +
        '<p class="rs-based">' + (REVIEWS.length === 1 ? t("rp.based1") : t("rp.based", { n: REVIEWS.length })) + "</p></div>" +
        '<div class="rs-bars">' + [5, 4, 3, 2, 1].map(function (n) {
          return '<div class="rs-bar"><span>' + n + " " + ICON.star + '</span><span class="rs-track"><span style="--v:' + (counts[n - 1] / max).toFixed(3) + '"></span></span><span>' + counts[n - 1] + "</span></div>";
        }).join("") + "</div>" +
        (REVIEWS[0].sample ? '<p class="rs-note">' + t("rp.sampleNote") + "</p>" : "") +
        (!dbReady && isLocal ? '<p class="rs-note">' + t("rp.demoNote") + "</p>" : "");
    }
  }

  renderReviews();

  // Load published reviews from the database
  if (dbReady && document.querySelector("[data-reviews], [data-review-summary]")) {
    fetch(dbEndpoint() + "?select=name,town,country,rating,service,text,lang,created_at&approved=eq.true&order=created_at.desc&limit=300", { headers: dbHeaders() })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (rows) { remoteReviews = (rows || []).map(rowToReview); renderReviews(); })
      .catch(function (err) { if (window.console) console.warn("Reviews could not be loaded:", err); });
  }
  each("[data-google-review]", function (el) {
    if (CFG.googleReviewUrl) { el.href = CFG.googleReviewUrl; el.target = "_blank"; el.rel = "noopener"; }
    else el.hidden = true;
  });

  /* =======================================================
     Split headings into words
     ======================================================= */
  function splitText(el) {
    var index = 0;
    var label = el.textContent.replace(/\s+/g, " ").trim();
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var word = document.createElement("span");
            word.className = "word";
            word.setAttribute("aria-hidden", "true");
            var inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--w", index++);
            word.appendChild(inner);
            frag.appendChild(word);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          walk(child);
        }
      });
    }
    walk(el);
    var sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = label;
    el.appendChild(sr);
  }
  each("[data-split]", splitText);

  /* =======================================================
     Reveal on scroll, counters
     ======================================================= */
  var readyDone = false;
  function onReady() {
    if (readyDone) return;
    readyDone = true;
    root.classList.add("is-ready");
    initReveals();
  }

  var io = null;

  // Give more of the page its own entrance: paragraphs, list items, chips, buttons, small headings…
  function autoReveal() {
    // lists that animate as one block → let every item come in on its own, one after another
    each("main .checklist[data-reveal], main .chips[data-reveal]", function (list) {
      list.removeAttribute("data-reveal");
      Array.prototype.forEach.call(list.children, function (item, i) {
        item.setAttribute("data-reveal", i % 2 ? "right" : "left");
        item.style.setProperty("--i", i % 8);
      });
    });
    var skip = "[data-reveal], [data-split], form, .lightbox, .marquee, .review, .g-item, .project, .filters, .badge, .stack, .hero-meta, .hero-actions, .service-card, .channel, .country, .value, .step, .t-item, .ba-item, .empty-state, .craft3d";
    each("main p, main li, main h3, main .btn, main .link-arrow, main .eyebrow, main figcaption, main .service-num", function (el) {
      if (el.hasAttribute("data-reveal") || el.hasAttribute("data-split")) return;
      if (el.parentElement && el.parentElement.closest(skip)) return;
      var index = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.setAttribute("data-reveal", "");
      if (!el.style.getPropertyValue("--i")) el.style.setProperty("--i", index % 6);
    });
  }

  function initReveals() {
    autoReveal();
    var targets = document.querySelectorAll("[data-reveal], [data-split], [data-count], [data-review-summary], .ba");
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add("is-in"); });
      return;
    }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        if (entry.isIntersecting) {
          if (el.classList.contains("is-in")) return;
          el.classList.add("is-in");
          if (el.hasAttribute("data-count")) countUp(el);
          if (el.classList.contains("ba") && !el.dataset.hinted) { el.dataset.hinted = "1"; hintSlider(el); }
        } else if (entry.boundingClientRect.top > (entry.rootBounds ? entry.rootBounds.bottom : window.innerHeight)) {
          // scrolled back above it: reset so it animates again next time it comes into view
          if (!el.closest(".site-header, .site-footer")) el.classList.remove("is-in");
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.1 });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  function countUp(el) {
    var end = parseFloat(el.getAttribute("data-count")) || 0;
    var dur = reduced ? 0 : 1800, start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = dur ? Math.min((ts - start) / dur, 1) : 1;
      el.textContent = Math.round(end * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Before/after: a small sweep to show the slider can be dragged
  function hintSlider(ba) {
    if (reduced) return;
    var input = ba.querySelector(".ba-range");
    var start = null;
    setTimeout(function () {
      function tick(ts) {
        if (ba.dataset.touched) return;
        if (start === null) start = ts;
        var p = Math.min((ts - start) / 1800, 1);
        var v = 50 - Math.sin(p * Math.PI * 2) * 22 * (1 - p * 0.3);
        if (p === 1) v = 50;
        ba.style.setProperty("--pos", v + "%");
        input.value = v;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, 500);
  }

  /* =======================================================
     Header, progress, parallax
     ======================================================= */
  var header = document.querySelector(".site-header");
  var progressBar = document.querySelector(".scroll-progress");
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var progressEls = Array.prototype.slice.call(document.querySelectorAll("[data-progress]"));
  var lastY = window.scrollY, ticking = false;

  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;
    header.classList.toggle("is-scrolled", y > 40);
    if (!root.classList.contains("menu-open")) header.classList.toggle("is-hidden", y > lastY && y > 320);
    progressBar.style.setProperty("--sp", docH > 0 ? (y / docH).toFixed(4) : 0);
    if (!reduced) {
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        var rect = el.parentElement.getBoundingClientRect();
        el.style.transform = "translate3d(0," + ((rect.top + rect.height / 2 - vh / 2) * speed).toFixed(1) + "px,0)";
      });
    }
    progressEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      el.style.setProperty("--p", Math.max(0, Math.min(1, (vh * 0.75 - rect.top) / (rect.height || 1))).toFixed(3));
    });
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* =======================================================
     Mobile menu
     ======================================================= */
  var toggle = document.querySelector(".menu-toggle");
  function closeMenu() {
    if (!root.classList.contains("menu-open")) return;
    root.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = root.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* =======================================================
     Magnetic buttons & card spotlight
     ======================================================= */
  if (finePointer && !reduced) {
    each("[data-magnetic]", function (el) {
      var strength = parseFloat(el.getAttribute("data-magnetic")) || 0.3;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.transition = "transform 0.2s ease-out";
        el.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * strength + "px," + (e.clientY - r.top - r.height / 2) * strength + "px)";
      });
      el.addEventListener("pointerleave", function () {
        el.style.transition = "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "";
      });
    });
  }
  if (finePointer) {
    each("[data-spotlight]", function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* =======================================================
     Hero canvas: interactive tile floor
     ======================================================= */
  (function heroCanvas() {
    var canvas = document.querySelector(".hero-canvas");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var w = 0, h = 0, size = 84, tiles = [];
    var pointer = { x: -9999, y: -9999, active: false, last: 0 };
    var running = false, visible = true, rafId = null;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      size = w < 700 ? 58 : 88;
      tiles = [];
      var cols = Math.ceil(w / size) + 1, rows = Math.ceil(h / size) + 1;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        tiles.push({ x: c * size, y: r * size, v: 0, seed: Math.random() * 6.283, accent: (r * 7 + c * 3) % 17 === 0 });
      }
      if (!running) draw(performance.now());
    }
    function draw(time) {
      ctx.clearRect(0, 0, w, h);
      var px = pointer.x, py = pointer.y;
      if (!pointer.active || time - pointer.last > 2600) {
        px = w * (0.62 + 0.26 * Math.sin(time * 0.00023));
        py = h * (0.42 + 0.3 * Math.sin(time * 0.00031 + 1.2));
      }
      var radius = Math.max(220, Math.min(w, h) * 0.38);
      for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        var cx = tile.x + size / 2, cy = tile.y + size / 2;
        var d = Math.sqrt((cx - px) * (cx - px) + (cy - py) * (cy - py));
        var target = Math.max(0, 1 - d / radius); target *= target;
        tile.v += (target - tile.v) * (reduced ? 1 : 0.08);
        var shimmer = reduced ? 0 : (Math.sin(time * 0.0008 + tile.seed) + 1) * 0.012;
        var v = tile.v;
        var inset = 1.5 + v * 5, s = size - inset * 2;
        ctx.fillStyle = "rgba(242,238,230," + (0.018 + shimmer + v * 0.04).toFixed(3) + ")";
        ctx.fillRect(tile.x + inset, tile.y + inset, s, s);
        if (v > 0.01) {
          ctx.fillStyle = "rgba(201,160,99," + (v * (tile.accent ? 0.22 : 0.1)).toFixed(3) + ")";
          ctx.fillRect(tile.x + inset, tile.y + inset, s, s);
          ctx.strokeStyle = "rgba(226,191,134," + (v * 0.55).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.strokeRect(tile.x + inset + 0.5, tile.y + inset + 0.5, s - 1, s - 1);
        }
        drawMark(cx, cy, size, v, shimmer);
      }
    }

    // The VSH logo inside a tile: faint at rest; where the light passes, the two
    // diamonds glow, slide together and the gold centre tile grows.
    function diamond(x, y, h) {
      ctx.beginPath();
      ctx.moveTo(x, y - h); ctx.lineTo(x + h, y); ctx.lineTo(x, y + h); ctx.lineTo(x - h, y);
      ctx.closePath();
    }
    function drawMark(cx, cy, s, v, shimmer) {
      var h = s * 0.2;                          // half-height of each diamond
      var off = h * 0.406 * (1 - v * 0.28);     // distance of each diamond from the centre
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(1, s * 0.02);
      diamond(cx - off, cy, h);
      ctx.strokeStyle = "rgba(242,238,230," + (0.045 + shimmer * 1.5 + v * 0.55).toFixed(3) + ")";
      ctx.stroke();
      diamond(cx + off, cy, h);
      ctx.strokeStyle = "rgba(201,160,99," + (0.07 + shimmer * 1.5 + v * 0.85).toFixed(3) + ")";
      ctx.stroke();
      diamond(cx, cy, h * 0.406 * (0.55 + v * 0.55));
      ctx.fillStyle = "rgba(201,160,99," + (0.06 + v * 0.9).toFixed(3) + ")";
      ctx.fill();
    }
    function loop(time) { draw(time); rafId = running ? requestAnimationFrame(loop) : null; }
    function start() { if (running || reduced) return; running = true; rafId = requestAnimationFrame(loop); }
    function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; }
    var hero = canvas.parentElement;
    hero.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true; pointer.last = performance.now();
    });
    hero.addEventListener("pointerleave", function () { pointer.active = false; });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !document.hidden) start(); else stop();
      }).observe(hero);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else if (visible) start(); });
    window.addEventListener("resize", resize);
    resize();
    start();
  })();

  /* =======================================================
     Gallery filter + lightbox
     ======================================================= */
  var lightbox = null;
  if (galleryGrid) {
    var items = Array.prototype.slice.call(galleryGrid.querySelectorAll(".g-item"));
    var filterBtns = document.querySelectorAll(".filter-btn");
    var switchTimer = null;

    // hide filters that have no photos
    Array.prototype.forEach.call(filterBtns, function (b) {
      var f = b.getAttribute("data-filter");
      if (f !== "all" && !GALLERY.some(function (g) { return inTopic(g, f); })) b.hidden = true;
    });

    Array.prototype.forEach.call(filterBtns, function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        Array.prototype.forEach.call(filterBtns, function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        items.forEach(function (it) { it.classList.add("is-out"); });
        clearTimeout(switchTimer);
        switchTimer = setTimeout(function () {
          var shown = 0;
          items.forEach(function (it) {
            var show = f === "all" || (it.getAttribute("data-cat") || "").split(" ").indexOf(f) !== -1;
            it.hidden = !show;
            if (show) {
              it.classList.add("is-in");
              (function (el, d) { setTimeout(function () { el.classList.remove("is-out"); }, 30 + d); })(it, shown++ * 60);
            }
          });
        }, reduced ? 0 : 380);
      });
    });

    // gallery.html?filter=mosaics → open the gallery already filtered
    var wanted = new URLSearchParams(window.location.search).get("filter");
    if (wanted) {
      var wantedBtn = document.querySelector('.filter-btn[data-filter="' + wanted.replace(/[^a-z]/g, "") + '"]');
      if (wantedBtn && !wantedBtn.hidden) setTimeout(function () { wantedBtn.click(); }, 400);
    }

    // Lightbox
    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", t("nav.gallery"));
    lightbox.innerHTML =
      '<div class="lb-backdrop"></div>' +
      '<div class="lb-inner"><div class="lb-stage"></div><div class="lb-caption"></div></div>' +
      '<div class="lb-counter" aria-live="polite"></div>' +
      '<button type="button" class="lb-btn lb-close" aria-label="' + esc(t("lb.close")) + '">' + ICON.close + "</button>" +
      '<button type="button" class="lb-btn lb-prev" aria-label="' + esc(t("lb.prev")) + '">' + ICON.left + "</button>" +
      '<button type="button" class="lb-btn lb-next" aria-label="' + esc(t("lb.next")) + '">' + ICON.arrow + "</button>";
    body.appendChild(lightbox);
    var stage = lightbox.querySelector(".lb-stage");
    var caption = lightbox.querySelector(".lb-caption");
    var counter = lightbox.querySelector(".lb-counter");
    var currentList = [], currentPos = 0, lastFocus = null;

    function slideHTML(item) {
      if (item.src) return '<img src="' + esc(item.src) + '" alt="' + esc(captionText(item)) + '">';
      return '<div class="lb-pat" style="--ratio:' + esc(item.ratio || "4/5") + '"><div class="pat pat-' + esc(item.pattern) + '"></div></div>';
    }
    function show(pos, dir) {
      currentPos = (pos + currentList.length) % currentList.length;
      var item = GALLERY[currentList[currentPos]];
      var slide = document.createElement("div");
      slide.className = "lb-slide" + (dir ? (dir > 0 ? " from-right" : " from-left") : " from-zoom");
      slide.innerHTML = slideHTML(item);
      var old = stage.querySelectorAll(".lb-slide");
      Array.prototype.forEach.call(old, function (o) {
        o.classList.add(dir > 0 ? "to-left" : dir < 0 ? "to-right" : "to-fade");
        setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, 600);
      });
      stage.appendChild(slide);
      void slide.offsetWidth;
      slide.classList.remove("from-right", "from-left", "from-zoom");
      caption.innerHTML = "<small>" + t("cat." + item.cat) + "</small>" + placeText(item);
      counter.textContent = (currentPos + 1) + " / " + currentList.length;
      // preload neighbours
      [1, -1].forEach(function (d) {
        var n = GALLERY[currentList[(currentPos + d + currentList.length) % currentList.length]];
        if (n && n.src) { var im = new Image(); im.src = n.src; }
      });
    }
    function open(index) {
      currentList = items.filter(function (it) { return !it.hidden; }).map(function (it) { return +it.getAttribute("data-index"); });
      lastFocus = document.activeElement;
      stage.innerHTML = "";
      show(Math.max(0, currentList.indexOf(index)), 0);
      lightbox.classList.add("is-open");
      root.classList.add("lb-open");
      lightbox.querySelector(".lb-close").focus();
    }
    function close() {
      lightbox.classList.remove("is-open");
      root.classList.remove("lb-open");
      if (lastFocus) lastFocus.focus();
    }
    items.forEach(function (it) {
      it.addEventListener("click", function () { open(+it.getAttribute("data-index")); });
    });
    lightbox.querySelector(".lb-close").addEventListener("click", close);
    lightbox.querySelector(".lb-backdrop").addEventListener("click", close);
    lightbox.querySelector(".lb-prev").addEventListener("click", function () { show(currentPos - 1, -1); });
    lightbox.querySelector(".lb-next").addEventListener("click", function () { show(currentPos + 1, 1); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(currentPos + 1, 1);
      else if (e.key === "ArrowLeft") show(currentPos - 1, -1);
      else if (e.key === "Tab") {
        var f = lightbox.querySelectorAll("button");
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var sx = null, sy = null;
    stage.addEventListener("pointerdown", function (e) { sx = e.clientX; sy = e.clientY; });
    stage.addEventListener("pointerup", function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(currentPos + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      sx = null;
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !(lightbox && lightbox.classList.contains("is-open"))) closeMenu();
  });

  /* =======================================================
     Forms: estimate request & review → WhatsApp or email
     ======================================================= */
  function fieldLabel(form, name) {
    var input = form.querySelector('[name="' + name + '"]');
    var label = input && form.querySelector('label[for="' + input.id + '"]');
    return label ? label.textContent.replace(/\s*\*$/, "").trim() : name;
  }
  function selectedText(form, name) {
    var s = form.querySelector('select[name="' + name + '"]');
    return s && s.selectedIndex > -1 ? s.options[s.selectedIndex].text : "";
  }

  var estimateForm = document.querySelector("[data-estimate-form]");
  if (estimateForm) {
    estimateForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!estimateForm.reportValidity()) return;
      var d = new FormData(estimateForm);
      var via = (e.submitter && e.submitter.value) || "wa";
      var lines = [t("f.intro"), ""];
      ["name", "phone", "email"].forEach(function (n) { if (d.get(n)) lines.push(fieldLabel(estimateForm, n) + ": " + d.get(n)); });
      lines.push(fieldLabel(estimateForm, "country") + ": " + selectedText(estimateForm, "country"));
      if (d.get("town")) lines.push(fieldLabel(estimateForm, "town") + ": " + d.get("town"));
      lines.push(fieldLabel(estimateForm, "service") + ": " + selectedText(estimateForm, "service"));
      if (d.get("area")) lines.push(fieldLabel(estimateForm, "area") + ": " + d.get("area"));
      lines.push(fieldLabel(estimateForm, "timing") + ": " + selectedText(estimateForm, "timing"));
      if (d.get("message")) { lines.push(""); lines.push(d.get("message")); }
      var text = lines.join("\n");
      var status = estimateForm.querySelector(".form-status");
      if (via === "email") {
        window.location.href = mailHref(t("nav.cta") + ": " + selectedText(estimateForm, "service") + " (" + selectedText(estimateForm, "country") + ")", text);
        status.textContent = t("f.statusMail");
      } else {
        window.open(waHref(text), "_blank", "noopener");
        status.textContent = t("f.statusWa");
      }
    });
  }

  // Review form → published directly on the website
  var reviewForm = document.querySelector("[data-review-form]");
  if (reviewForm) {
    var COOLDOWN_KEY = "vsh-review-posted";
    var rfStatus = reviewForm.querySelector(".form-status");
    var rfButton = reviewForm.querySelector('button[type="submit"]');
    var rfLabel = rfButton.innerHTML;
    var setStatus = function (msg, kind) {
      rfStatus.textContent = msg;
      rfStatus.className = "form-status" + (kind ? " is-" + kind : "");
    };
    var clean = function (v, max) { return String(v || "").replace(/\s+/g, " ").trim().slice(0, max); };

    var afterPublish = function (rv) {
      store(COOLDOWN_KEY, String(Date.now()));
      reviewForm.reset();
      renderReviews();
      setStatus(t(rv.demo ? "rp.demoSaved" : "rp.thanks"), "ok");
      var fresh = document.querySelector('[data-reviews="all"] .review.is-new');
      if (fresh) setTimeout(function () { fresh.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }); }, 600);
    };

    reviewForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (reviewForm.elements.website && reviewForm.elements.website.value) return; // spam bot trap
      if (!reviewForm.reportValidity()) return;
      var last = Number(read(COOLDOWN_KEY)) || 0;
      if (!isLocal && Date.now() - last < 6 * 3600 * 1000) { setStatus(t("rp.wait"), "info"); return; }

      var d = new FormData(reviewForm);
      var rv = {
        name: clean(d.get("name"), 60),
        town: clean(d.get("town"), 60) || null,
        country: d.get("country") || null,
        rating: Math.max(1, Math.min(5, Number(d.get("rating")) || 5)),
        service: d.get("service") || null,
        text: String(d.get("review") || "").trim().slice(0, 1000),
        lang: lang
      };
      var shown = { name: rv.name, town: rv.town, country: rv.country, rating: rv.rating, service: rv.service, text: rv.text, lang: lang, date: new Date().toISOString().slice(0, 10), isNew: true };

      if (!dbReady) {
        if (isLocal) {
          shown.demo = true;
          var list = demoReviews();
          list.unshift(shown);
          try { localStorage.setItem(DEMO_KEY, JSON.stringify(list.slice(0, 20))); } catch (err) {}
          afterPublish(shown);
        } else {
          setStatus(t("rp.error"), "error");
        }
        return;
      }

      rfButton.disabled = true;
      rfButton.innerHTML = "<span>" + t("rp.sending") + "</span>";
      setStatus("", "");
      fetch(dbEndpoint(), { method: "POST", headers: dbHeaders({ Prefer: "return=minimal" }), body: JSON.stringify(rv) })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); })
        .then(function () { remoteReviews.unshift(shown); afterPublish(shown); })
        .catch(function (err) { if (window.console) console.warn("Review not published:", err); setStatus(t("rp.error"), "error"); })
        .then(function () { rfButton.disabled = false; rfButton.innerHTML = rfLabel; });
    });
  }

  each("[data-to-top]", function (el) {
    el.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); });
  });

  enter();
})();
