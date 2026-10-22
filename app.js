(function () {
  "use strict";
  var S = window.SITE || {};
  var $ = function (id) { return document.getElementById(id); };

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "class") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }
  function empty(text, cls) { return el("div", { class: "empty " + (cls || ""), text: text }); }
  function safeUrl(u) { return /^https?:\/\//i.test(u || "") ? u : ""; }

  /* ---------- Basics ---------- */
  $("firstName").textContent = S.firstName || "";
  $("lastName").textContent = S.lastName || "";
  $("tagline").textContent = S.tagline || "";
  $("intro").textContent = S.intro || "";
  $("year").textContent = new Date().getFullYear();

  var ig = safeUrl(S.social && S.social.instagram);
  var yt = safeUrl(S.social && S.social.youtube);
  var fb = safeUrl(S.social && S.social.facebook);
  if (ig) { $("igLink").href = ig; $("footIg").href = ig; }
  if (S.instagram && S.instagram.handle) $("igLink").textContent = "Open @" + S.instagram.handle + " on Instagram";
  if (yt) { $("ytLink").href = yt; $("ytLink").hidden = false; $("footYt").href = yt; $("footYt").hidden = false; }
  if (fb) $("footFb").href = fb; else $("footFb").hidden = true;

  /* ---------- Viewer ---------- */
  var viewer = $("viewer"), viewerBody = $("viewerBody");
  function openViewer(kind, src, alt) {
    viewerBody.textContent = "";
    if (kind === "video") {
      var v = el("video", { src: src, controls: "", autoplay: "", playsinline: "", loop: "" });
      viewerBody.appendChild(v);
    } else {
      viewerBody.appendChild(el("img", { src: src, alt: alt || "" }));
    }
    viewer.showModal();
  }
  viewer.addEventListener("close", function () { viewerBody.textContent = ""; });
  viewer.addEventListener("click", function (e) { if (e.target === viewer) viewer.close(); });

  /* Tiles that preview on hover and open the viewer on click */
  function videoTile(item, kind) {
    var b = el("button", { class: "tile", type: "button", "aria-label": "Play " + (item.title || item.caption || "clip") });
    var v = el("video", { src: item.src, muted: "", loop: "", playsinline: "", preload: "metadata" });
    if (item.poster) v.setAttribute("poster", item.poster);
    v.muted = true;
    b.appendChild(v);
    if (item.title) b.appendChild(el("span", { class: "cap", text: item.title }));
    b.addEventListener("mouseenter", function () { v.play().catch(function () {}); });
    b.addEventListener("mouseleave", function () { v.pause(); v.currentTime = 0; });
    b.addEventListener("click", function () { openViewer("video", item.src); });
    return b;
  }

  /* ---------- Hero ---------- */
  (function () {
    var f = $("heroFrame"), h = S.hero || {};
    if (h.video) {
      var v = el("video", { src: h.video, autoplay: "", muted: "", loop: "", playsinline: "" });
      if (h.poster) v.setAttribute("poster", h.poster);
      v.muted = true;
      f.appendChild(v);
    } else if (h.poster) {
      f.appendChild(el("img", { src: h.poster, alt: "Antwon Leslie skateboarding" }));
    } else {
      f.appendChild(empty("Featured clip coming soon"));
      f.firstChild.style.height = "100%";
    }
  })();

  /* ---------- Hero: board rides the top of his name, then kickflips off the edge (plays once) ---------- */
  (function () {
    var hero = document.querySelector(".hero");
    var wrap = hero && hero.querySelector(".board-ride");
    var name = $("firstName");
    if (!wrap || !name || !wrap.animate) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function start() {
      var svg = wrap.querySelector(".board");
      var hr = hero.getBoundingClientRect(), nr = name.getBoundingClientRect();
      var cs = getComputedStyle(name);
      var fs = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight) || fs * 0.82;

      // Find the top and bottom of the capital letters, whatever font actually loaded
      var capTop = nr.top + fs * 0.08, baseline = capTop + fs * 0.72; // fallback guesses
      try {
        var ctx = document.createElement("canvas").getContext("2d");
        ctx.font = cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
        var m = ctx.measureText("H");
        var fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent;
        if (fa && fd && m.actualBoundingBoxAscent) {
          baseline = nr.top + (lh - (fa + fd)) / 2 + fa;
          capTop = baseline - m.actualBoundingBoxAscent;
        }
      } catch (err) {}

      var w = Math.max(54, Math.min(90, nr.width * 0.16)), h = w * 26 / 90;
      svg.setAttribute("width", w); svg.setAttribute("height", h);
      var wheelsY = h * (24.6 / 26);                 // wheel bottoms sit at 24.6 of 26 in the artwork
      var y0 = capTop - hr.top - wheelsY;            // board top when riding on the letters
      var gY = baseline - hr.top;                    // the landing line sits at the bottom of "ANTWON"
      var yLand = gY - wheelsY;                      // board top when riding on the landing line
      var L0 = nr.left - hr.left;                    // board left edge at the start of the name
      var nameRight = nr.right - hr.left;
      var Le = nameRight - w * 0.6;                  // where the pop happens, near the last letter
      var lineStart = nameRight + 10;                // the landing line starts just past the last letter
      var Lland = Math.min(nameRight + w * 0.6, hr.width - w - 4); // landing spot, kept on screen
      Lland = Math.max(Lland, Le + w * 0.35);
      var D = 4200;

      // The landing line: draws out to the right edge, then fades once the board is gone
      var exit = document.createElement("div");
      exit.className = "centerline";
      exit.setAttribute("aria-hidden", "true");
      exit.style.cssText = "position:absolute;z-index:1;pointer-events:none;opacity:0;transform-origin:left center;" +
        "left:" + lineStart + "px;top:" + gY + "px;width:" + Math.max(0, hr.width - lineStart) + "px;";
      hero.appendChild(exit);
      exit.animate([
        { offset: 0,    opacity: 0, transform: "scaleX(0)" },
        { offset: 0.28, opacity: 1, transform: "scaleX(0)", easing: "cubic-bezier(.3,.5,.4,1)" },
        { offset: 0.50, opacity: 1, transform: "scaleX(1)" },
        { offset: 0.93, opacity: 1, transform: "scaleX(1)" },
        { offset: 1,    opacity: 0, transform: "scaleX(1)" }
      ], { duration: D, fill: "both" });

      wrap.style.visibility = "visible";
      wrap.animate([
        { offset: 0,    transform: "translate(" + L0 + "px," + (y0 - 80) + "px)", opacity: 0, easing: "cubic-bezier(.3,0,.9,.6)" },
        { offset: 0.09, transform: "translate(" + L0 + "px," + y0 + "px)", opacity: 1, easing: "cubic-bezier(.4,0,.6,1)" },
        { offset: 0.48, transform: "translate(" + Le + "px," + y0 + "px)", opacity: 1, easing: "cubic-bezier(.3,.6,.5,1)" },
        { offset: 0.58, transform: "translate(" + (Le + (Lland - Le) * 0.4) + "px," + (y0 - 12) + "px)", opacity: 1, easing: "cubic-bezier(.5,0,.9,.6)" },
        { offset: 0.74, transform: "translate(" + Lland + "px," + yLand + "px)", opacity: 1, easing: "cubic-bezier(.4,0,.9,.85)" },
        { offset: 1,    transform: "translate(" + (hr.width + 20) + "px," + yLand + "px)", opacity: 1 }
      ], { duration: D, fill: "both" });

      // The kickflip: one full turn around the board's long axis, with a little nose-up pop. It lands flat.
      svg.animate([
        { offset: 0,    transform: "rotateX(0deg) rotate(0deg)" },
        { offset: 0.48, transform: "rotateX(0deg) rotate(0deg)", easing: "ease-out" },
        { offset: 0.51, transform: "rotateX(0deg) rotate(-12deg)", easing: "cubic-bezier(.3,.2,.4,1)" },
        { offset: 0.70, transform: "rotateX(360deg) rotate(4deg)", easing: "ease-out" },
        { offset: 0.74, transform: "rotateX(360deg) rotate(0deg)" },
        { offset: 1,    transform: "rotateX(360deg) rotate(0deg)" }
      ], { duration: D, fill: "both" });
    }

    var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    ready.then(function () { setTimeout(start, 350); });
  })();

  /* ---------- Reels ---------- */
  (function () {
    var g = $("reelGrid"), list = S.reels || [];
    if (!list.length) { for (var i = 0; i < 4; i++) g.appendChild(empty("Clip coming soon")); return; }
    list.forEach(function (r) { g.appendChild(videoTile(r)); });
  })();

  /* ---------- Photos ---------- */
  (function () {
    var g = $("photoGrid"), list = S.photos || [];
    if (!g) return; // Photos section is hidden for now
    if (!list.length) { for (var i = 0; i < 3; i++) g.appendChild(empty("Photo coming soon")); return; }
    list.forEach(function (p) {
      var b = el("button", { class: "tile", type: "button", "aria-label": "View photo: " + (p.alt || "photo") });
      b.appendChild(el("img", { src: p.src, alt: p.alt || "", loading: "lazy" }));
      b.addEventListener("click", function () { openViewer("image", p.src, p.alt); });
      g.appendChild(b);
    });
  })();

  /* ---------- Instagram (official post embeds, scrollable in place) ---------- */
  (function () {
    var box = $("igScroller"), posts = (S.instagram && S.instagram.posts) || [];
    var valid = posts.filter(function (u) { return /^https:\/\/(www\.)?instagram\.com\/(p|reel|tv)\//i.test(u); });
    if (!valid.length) {
      var e = empty("");
      e.appendChild(el("span", { text: "Posts will show here, and you can scroll through them without leaving the site." }));
      if (ig) e.appendChild(el("a", { class: "btn btn-line", href: ig, target: "_blank", rel: "noopener noreferrer", text: "Open on Instagram" }));
      box.appendChild(e);
      return;
    }
    valid.forEach(function (u) {
      var bq = el("blockquote", { class: "instagram-media", "data-instgrm-permalink": u.split("?")[0] + "?utm_source=ig_embed", "data-instgrm-version": "14" });
      box.appendChild(bq);
    });
    var s = el("script", { src: "https://www.instagram.com/embed.js", async: "" });
    document.body.appendChild(s);
  })();

  /* ---------- YouTube (click to load, privacy-friendly) ---------- */
  (function () {
    var g = $("ytGrid"), list = (S.youtube && S.youtube.videos) || [];
    if (!list.length) { g.appendChild(empty("Videos coming soon")); g.appendChild(empty("Videos coming soon")); return; }
    list.forEach(function (v) {
      if (!/^[A-Za-z0-9_-]{11}$/.test(v.id || "")) return;
      var box = el("div", { class: "yt" });
      var btn = el("button", { type: "button", "aria-label": "Play " + (v.title || "video") });
      btn.appendChild(el("img", { src: "https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg", alt: "", loading: "lazy" }));
      btn.appendChild(el("span", { class: "play" }));
      if (v.title) btn.appendChild(el("span", { class: "ttl", text: v.title }));
      btn.addEventListener("click", function () {
        var f = el("iframe", {
          src: "https://www.youtube-nocookie.com/embed/" + v.id + "?autoplay=1&rel=0",
          title: v.title || "YouTube video", allow: "autoplay; encrypted-media; picture-in-picture", allowfullscreen: ""
        });
        box.textContent = "";
        box.appendChild(f);
      });
      box.appendChild(btn);
      g.appendChild(box);
    });
  })();

  /* ---------- Mission ---------- */
  $("missionStatement").textContent = (S.mission && S.mission.statement) || "";
  (function () {
    var ul = $("goalList");
    ((S.mission && S.mission.goals) || []).forEach(function (t) { ul.appendChild(el("li", { text: t })); });
  })();

  /* ---------- Sponsors ---------- */
  (function () {
    var g = $("sponsorGrid"), list = S.sponsors || [];
    list.forEach(function (s) {
      var a = el("a", { class: "sponsor", href: safeUrl(s.url) || "#", target: "_blank", rel: "noopener noreferrer", "aria-label": s.name });
      a.appendChild(el("img", { src: s.logo, alt: s.name, loading: "lazy" }));
      g.appendChild(a);
    });
    var spots = list.length ? 1 : 3;
    for (var i = 0; i < spots; i++) {
      var b = el("button", { class: "empty", type: "button", text: "Your brand here. Start the conversation." });
      b.setAttribute("data-open-contact", "");
      b.setAttribute("data-reason", "Sponsorship");
      g.appendChild(b);
    }
  })();

  /* ---------- Gear ---------- */
  (function () {
    var body = $("gearBody");
    (S.gear || []).forEach(function (r) {
      var tr = el("tr");
      tr.appendChild(el("th", { scope: "row", text: r.item || "" }));
      tr.appendChild(el("td", r.brand ? { text: r.brand } : { class: "todo", text: "To be added" }));
      var td = el("td");
      if (r.where && safeUrl(r.url)) td.appendChild(el("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", text: r.where }));
      else if (r.where) td.textContent = r.where;
      else { td.className = "todo"; td.textContent = "To be added"; }
      tr.appendChild(td);
      body.appendChild(tr);
    });
  })();

  /* ---------- Bloopers ---------- */
  (function () {
    var g = $("blooperGrid"), list = S.bloopers || [];
    if (!list.length) { for (var i = 0; i < 3; i++) g.appendChild(empty("Blooper coming soon")); return; }
    list.forEach(function (b) {
      var btn = el("button", { class: "blooper", type: "button", "aria-label": "Play blooper: " + (b.caption || "") });
      var frame = el("span", { class: "frame", style: "display:block" });
      var v = el("video", { src: b.src, muted: "", loop: "", playsinline: "", preload: "metadata" });
      if (b.poster) v.setAttribute("poster", b.poster);
      v.muted = true;
      frame.appendChild(v);
      btn.appendChild(frame);
      if (b.caption) btn.appendChild(el("span", { class: "note", text: b.caption }));
      btn.addEventListener("mouseenter", function () { v.play().catch(function () {}); });
      btn.addEventListener("mouseleave", function () { v.pause(); v.currentTime = 0; });
      btn.addEventListener("click", function () { openViewer("video", b.src); });
      g.appendChild(btn);
    });
  })();

  /* ---------- Contact dialog ---------- */
  var dlg = $("contactDialog"), form = $("contactForm"), status = $("formStatus"), sendBtn = $("sendBtn");
  function openContact(reason) {
    if (reason) {
      var sel = $("reason");
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === reason) sel.selectedIndex = i;
    }
    status.textContent = ""; status.className = "form-status";
    dlg.showModal();
  }
  document.addEventListener("click", function (e) {
    var open = e.target.closest("[data-open-contact]");
    if (open) { openContact(open.getAttribute("data-reason")); return; }
    var close = e.target.closest("[data-close]");
    if (close) { var d = close.closest("dialog"); if (d) d.close(); }
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  function setStatus(msg, cls) { status.textContent = msg; status.className = "form-status " + (cls || ""); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements, bad = false;
    ["name", "email", "message"].forEach(function (n) { f[n].removeAttribute("aria-invalid"); });
    if (!f.name.value.trim()) { f.name.setAttribute("aria-invalid", "true"); bad = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { f.email.setAttribute("aria-invalid", "true"); bad = true; }
    if (!f.message.value.trim()) { f.message.setAttribute("aria-invalid", "true"); bad = true; }
    if (bad) { setStatus("Fill in your name, a valid email, and a message.", "err"); return; }
    if (f.website.value) { setStatus("Message sent. Thank you.", "ok"); return; } // spam trap

    var endpoint = safeUrl(S.formEndpoint);
    if (!endpoint) {
      var to = S.fallbackEmail || "";
      var href = "mailto:" + encodeURIComponent(to) +
        "?subject=" + encodeURIComponent("[Site] " + f.reason.value + " from " + f.name.value.trim()) +
        "&body=" + encodeURIComponent(f.message.value.trim() + "\n\n" + f.name.value.trim() + "\n" + f.email.value.trim());
      setStatus("Preview mode: the live form is not connected yet. ", "err");
      status.appendChild(el("a", { href: href, text: "Send by email instead." }));
      return;
    }

    sendBtn.disabled = true; setStatus("Sending...", "");
    var body = new URLSearchParams({
      name: f.name.value.trim(), email: f.email.value.trim(), org: f.org.value.trim(),
      reason: f.reason.value, message: f.message.value.trim(), website: f.website.value
    });
    // Apps Script web apps do not send CORS headers, so the reply cannot be read. no-cors still delivers the POST.
    fetch(endpoint, { method: "POST", mode: "no-cors", body: body })
      .then(function () {
        form.reset();
        setStatus("Message sent. I will get back to you soon.", "ok");
        setTimeout(function () { if (dlg.open) dlg.close(); sendBtn.disabled = false; }, 2200);
      })
      .catch(function () {
        sendBtn.disabled = false;
        setStatus("Could not send. Check your connection and try again.", "err");
      });
  });
})();
