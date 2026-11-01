/* Portfolio logic. Data lives in content.js (window.SITE). */
const FOLLOW = 1; // 1 = card moves toward the mouse, -1 = moves opposite

(function () {
  "use strict";
  var S = window.SITE || {};
  var C = S.contact || {};
  var GH = S.github || { username: "", featuredRepos: [] };
  var doc = document, body = doc.body;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var pad = function (n) { return "[" + (n < 10 ? "0" : "") + n + "]"; };
  var icon = function (n) { return '<span class="material-symbols-outlined" aria-hidden="true">' + n + "</span>"; };

  /* ---------- 1. INTRO ---------- */
  var intro = $("#intro"), rig = $("#rig"), swing = $("#swing"), card = $("#idCard"), shine = $("#shine");
  var shell = [$("#nav"), $("#main"), $(".footer")];
  var card$ = S.card || {};
  $$("[data-photo]").forEach(function (i) { i.src = S.photo || ""; });
  $$("[data-name]").forEach(function (e) { e.textContent = S.name || ""; });
  $$("[data-short]").forEach(function (e) { e.textContent = S.shortName || ""; });
  $$("[data-college]").forEach(function (e) { e.textContent = card$.college || ""; });
  $$("[data-aff]").forEach(function (e) { e.textContent = card$.affiliation || ""; });
  $$("[data-batch]").forEach(function (e) { e.textContent = card$.batch || ""; });
  $$("[data-stamp]").forEach(function (e) { e.textContent = card$.stamp || ""; });

  var running = false, opened = false;
  var tx = 0, ty = 0, cx = 0, cy = 0;

  if (intro) {
    shell.forEach(function (el) { if (el) el.inert = true; });
    try { card.focus({ preventScroll: true }); } catch (e) { /* ignore */ }

    if (!reduce) {
      rig.classList.add("drop");
      var startLoop = function () {
        if (running || opened) return;
        rig.classList.remove("drop");
        running = true;
        requestAnimationFrame(loop);
      };
      rig.addEventListener("animationend", startLoop, { once: true });
      setTimeout(startLoop, 1900);
      if (!touch) {
        window.addEventListener("mousemove", function (e) {
          tx = (e.clientX / window.innerWidth) * 2 - 1;
          ty = (e.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });
      }
    }

    function loop(t) {
      if (!running) return;
      if (touch) { tx = Math.sin(t / 2200) * 0.55; ty = Math.sin(t / 3100) * 0.3; }
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      var f = FOLLOW, idle = Math.sin(t / 1500) * 1.4;
      swing.style.transform = "translate(" + (cx * f * 16).toFixed(2) + "px," + (cy * f * 8).toFixed(2) + "px) rotate(" + (-cx * f * 6 + idle).toFixed(2) + "deg)";
      card.style.transform = "perspective(800px) rotateX(" + (-cy * f * 10).toFixed(2) + "deg) rotateY(" + (cx * f * 12).toFixed(2) + "deg)";
      shine.style.setProperty("--sx", (50 + cx * f * 40).toFixed(1) + "%");
      shine.style.setProperty("--sy", (40 + cy * f * 35).toFixed(1) + "%");
      requestAnimationFrame(loop);
    }

    var openSite = function () {
      if (opened) return;
      opened = true;
      running = false;
      rig.classList.remove("drop");
      if (!reduce) intro.classList.add("launching");
      intro.classList.add("done");
      setTimeout(function () {
        intro.remove();
        body.classList.remove("intro-open");
        shell.forEach(function (el) { if (el) el.inert = false; });
        window.scrollTo(0, 0);
        startReveal();
      }, 820);
    };
    card.addEventListener("click", openSite);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openSite(); }
    });
  }

  /* ---------- 2. SECTIONS ---------- */
  var head = function (n, kicker, title, sub) {
    return '<div class="sec-head reveal"><div class="kicker">[Section ' + (n < 10 ? "0" : "") + n + "] " + esc(kicker) + '</div><br><h2 class="h-lg">' + esc(title) + "</h2>" + (sub ? '<p class="sub">' + esc(sub) + "</p>" : "") + "</div>";
  };
  var set = function (id, html) { var el = doc.getElementById(id); if (el) el.innerHTML = html; };

  // Hero
  set("home",
    '<div class="hero-left reveal">' +
      '<div class="greet"><span class="hand">hey, I\'m</span><span class="rule"></span></div>' +
      '<h1 class="display">' + esc(S.name) + ".</h1>" +
      '<svg class="hero-underline" viewBox="0 0 450 16" fill="none" aria-hidden="true"><path d="M2.5 9.5C65.5 3.5 178 3.5 284 8C337 10.25 398.5 12.5 447.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-width="4.5"/><path d="M12 12C95 6.5 210 5.5 315 9.5C365 11.5 408 12 438 8.5" stroke="#A62715" stroke-linecap="round" stroke-width="2"/></svg>' +
      '<p class="role">' + esc(S.role) + "</p>" +
      '<p class="lead">' + esc(S.intro) + "</p>" +
      '<div class="btn-row"><a class="btn btn-primary" href="#projects"><span>See my work</span>' + icon("arrow_forward") + '</a><a class="btn" href="#contact">Get in touch</a></div>' +
      '<div class="scroll-hint"><div class="circ">' + icon("arrow_downward") + '</div><span class="hand">scroll down for more</span></div>' +
    "</div>" +
    '<div class="hero-right reveal"><div class="hcard-wrap">' +
      '<div class="hcard-anchor" aria-hidden="true"><div class="tape"></div><div class="strap"></div><div class="hook"></div></div>' +
      '<div class="paper hcard"><div class="slot"></div>' +
        '<div class="hcard-head"><div><span class="tiny">Student ID</span><br><strong>' + esc(card$.college) + "</strong></div></div>" +
        '<div class="hcard-grid"><div class="hcard-photo"><img src="' + esc(S.photo) + '" alt="Photo of ' + esc(S.name) + '" width="160" height="200"></div>' +
        "<div><h3>" + esc(S.name) + '</h3><p class="c2">' + esc(card$.affiliation) + '</p><div class="tl"><span class="tiny">Batch</span><br><b>' + esc(card$.batch) + "</b></div></div></div>" +
        '<div class="stamp" aria-hidden="true">' + esc(card$.stamp) + "</div>" +
        '<div class="hcard-foot"><div class="barcode" aria-hidden="true"></div></div>' +
      "</div></div></div>");

  // About
  var bio = String(S.bio || "");
  var cut = bio.indexOf(". ");
  var bioHead = cut > 0 ? bio.slice(0, cut + 1) : bio, bioRest = cut > 0 ? bio.slice(cut + 2) : "";
  set("about", head(1, "About", "A bit about me.") +
    '<div class="about-grid">' +
      '<figure class="paper polaroid reveal" style="margin:0"><div class="tape tape-top"></div><div class="ph"><img src="' + esc(S.aboutPhoto) + '" alt="' + esc(S.name) + ' with a camera" loading="lazy" width="400" height="500"></div><figcaption>' + esc(S.photoCaption) + "</figcaption></figure>" +
      '<div class="reveal"><div class="paper bio-card"><h3>' + esc(bioHead) + "</h3><p>" + esc(bioRest) + "</p></div>" +
        '<div class="label-rule">Skills</div><div class="chips">' +
        (S.skills || []).map(function (s) {
          var t = s.tag === "specialty" ? '<span class="chip-stamp">' + esc(s.tag) + "</span>" : s.tag ? '<span class="chip-sage">' + esc(s.tag) + "</span>" : "";
          return '<span class="chip">' + esc(s.name) + t + "</span>";
        }).join("") + "</div></div>" +
    "</div>" +
    '<div class="sub-head reveal"><h3>Outside of code</h3><span class="hand" style="font-size:24px;color:var(--brick-d)">what I do for fun</span></div>' +
    '<div class="hobby-grid">' + (S.hobbies || []).map(function (h, i) {
      return '<div class="paper hobby reveal"><div class="tape tape-top"></div><div class="hobby-top"><span>' + pad(i + 1) + "</span>" + icon(h.icon || "star") + "</div><h4>" + esc(h.name) + "</h4></div>";
    }).join("") + "</div>");

  // Qualification
  set("qualification", head(2, "Qualification", "Where I'm studying.") +
    '<div class="timeline">' + (S.education || []).map(function (e, i) {
      return '<div class="tl-item reveal"><article class="paper tl-card">' + (i === 0 ? '<div class="tape tape-top"></div>' : "") +
        '<div class="tl-top"><span class="tiny">' + esc(e.place) + "</span>" + (e.years ? '<span class="pill-box">' + esc(e.years) + "</span>" : '<span class="badge">' + esc(e.status) + "</span>") + "</div>" +
        "<h3>" + esc(e.title) + "</h3>" +
        (e.years ? '<div class="tl-foot"><span class="status-stamp">' + esc(e.status) + "</span>" + (e.note ? '<span class="hand">' + esc(e.note) + "</span>" : "") + "</div>" : "") +
        "</article></div>";
    }).join("") + "</div>");

  // Projects shell
  set("projects", head(3, "Projects", "Things I've built.", "My public GitHub repos, pulled in live.").replace('</div>', "</div>") +
    '<div class="proj-head reveal" style="padding-top:0"><div class="tabs" role="tablist" aria-label="Sort projects" style="margin:0">' +
      '<button class="tab" role="tab" id="tab-all" data-sort="all" aria-selected="true">All</button>' +
      '<button class="tab" role="tab" id="tab-recent" data-sort="recent" aria-selected="false">Recent</button>' +
      '<button class="tab" role="tab" id="tab-liked" data-sort="liked" aria-selected="false">Most liked</button></div>' +
      (GH.username ? '<a class="gh-link" href="https://github.com/' + esc(GH.username) + '" target="_blank" rel="noopener">github.com/' + esc(GH.username) + " ↗</a>" : "") +
    "</div>" +
    '<div class="proj-grid" id="projGrid" aria-live="polite"></div><p class="proj-status" id="projStatus"></p>');

  // Achievements
  var ledger = function (items, fn) { return '<ol class="ledger">' + items.map(fn).join("") + "</ol>"; };
  set("achievements", head(4, "Achievements", "Achievements.") +
    ledger(S.achievements || [], function (a, i) {
      return '<li class="paper reveal"><span class="num">' + pad(i + 1) + "</span><div><h3>" + esc(a.title) + '</h3><p class="meta">' + esc(a.date) + "</p></div><span></span></li>";
    }));

  // Certifications
  var certs = S.certifications || [];
  set("certifications", head(5, "Certifications", "Certifications.") +
    (certs.length ? '<div class="cert-grid">' + certs.map(function (c) {
      var inner = (c.image ? '<img src="' + esc(c.image) + '" alt="' + esc(c.title) + ' certificate" loading="lazy" width="400" height="300">' : "") +
        "<h3>" + esc(c.title) + '</h3><p class="tiny" style="margin-top:6px">' + esc([c.issuer, c.date].filter(Boolean).join(" · ")) + "</p>";
      return '<div class="paper cert reveal">' + (c.url ? '<a href="' + esc(c.url) + '" target="_blank" rel="noopener" style="text-decoration:none">' + inner + "</a>" : inner) + "</div>";
    }).join("") + "</div>"
    : '<div class="empty-slot reveal"><div class="ico">' + icon("workspace_premium") + '</div><p class="hand">' + esc(S.certEmpty || "First certificate coming soon") + "</p></div>"));

  // Hackathons
  set("hackathons", head(6, "Hackathons", "Hackathons.") +
    ledger(S.hackathons || [], function (h, i) {
      return '<li class="paper reveal"><span class="num">' + pad(i + 1) + "</span><div><h3>" + esc(h.name) + '</h3><p class="meta">' + esc(h.date) + '</p></div><span class="badge">' + esc(h.result) + "</span></li>";
    }));

  // Contact
  var links = [
    C.email && { i: "alternate_email", href: "mailto:" + C.email, t: C.email },
    C.linkedin && { i: "work", href: C.linkedin, t: "LinkedIn" },
    C.instagram && { i: "photo_camera", href: C.instagram, t: "Instagram" },
    GH.username && { i: "code", href: "https://github.com/" + GH.username, t: "GitHub" }
  ].filter(Boolean);
  set("contact", head(7, "Contact", "Say hi.") +
    '<div class="paper contact-card reveal"><div><h3>Write to me.</h3><p class="intro-txt">Have an idea, a question, or just want to say hi? Send me a message and I\'ll reply by email.</p>' +
      '<ul class="links">' + links.map(function (l) {
        var ext = l.href.indexOf("mailto:") === 0 ? "" : ' target="_blank" rel="noopener"';
        return "<li>" + icon(l.i) + '<a href="' + esc(l.href) + '"' + ext + ">" + esc(l.t) + "</a></li>";
      }).join("") + "</ul></div>" +
      '<form class="form" id="contactForm" novalidate>' +
        '<div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" placeholder="Your name" required><span class="err" id="e-name"></span></div>' +
        '<div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required><span class="err" id="e-email"></span></div>' +
        '<div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" placeholder="What\'s on your mind?" required></textarea><span class="err" id="e-msg"></span></div>' +
        '<div class="hp" aria-hidden="true"><label for="f-bot">Leave empty</label><input id="f-bot" name="botcheck" tabindex="-1" autocomplete="off"></div>' +
        '<div><button class="btn btn-primary" type="submit" id="sendBtn">' + icon("mail") + "<span>Send message</span></button></div>" +
        '<p class="form-msg" id="formMsg" role="status" hidden></p>' +
      "</form></div>");

  // Footer + resume
  var footer = $("#footer");
  if (footer) footer.innerHTML = '<div class="f-brand"><b>' + esc(S.shortName) + '.</b><p>© ' + new Date().getFullYear() + " " + esc(S.name) + '</p></div><nav aria-label="Footer"><a href="#home">Home</a><a href="#about">About</a><a href="#projects">Projects</a><a href="#contact">Contact</a>' +
    (GH.username ? '<a href="https://github.com/' + esc(GH.username) + '" target="_blank" rel="noopener">GitHub</a>' : "") + "</nav>";
  var rb = $("#resumeBtn");
  if (rb && S.resume) { rb.href = S.resume; rb.hidden = false; }

  /* ---------- Nav: active section + mobile menu ---------- */
  var navLinks = $("#navLinks"), menuBtn = $("#menuBtn");
  var linkFor = { about: "about", qualification: "qualification", projects: "projects", achievements: "achievements", certifications: "achievements", hackathons: "achievements", contact: "contact" };
  if (menuBtn) menuBtn.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  $$("a", navLinks).forEach(function (a) { a.addEventListener("click", function () { navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }); });
  if ("IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var target = linkFor[en.target.id];
        $$("a", navLinks).forEach(function (a) { a.classList.toggle("active", !!target && a.getAttribute("href") === "#" + target); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section").forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- Reveal ---------- */
  var hasIO = "IntersectionObserver" in window;
  if (hasIO && !reduce) doc.documentElement.classList.add("reveal-on");
  function startReveal() {
    if (!hasIO || reduce) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
    setTimeout(function () { // fallback: never leave visible content hidden
      $$(".reveal:not(.in)").forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in"); });
    }, 1000);
  }
  if (!intro) startReveal();

  /* ---------- 3. GITHUB PROJECTS ---------- */
  var grid = $("#projGrid"), status = $("#projStatus");
  var featured = (GH.featuredRepos || []).map(function (s) { return s.toLowerCase(); });
  var repos = [], sortMode = "all";
  var FALLBACK = { name: "This portfolio", description: "The site you're on right now, built with plain HTML, CSS and JavaScript.", langs: ["HTML", "CSS", "JavaScript"], html_url: "https://github.com/moretsu-ai/prakhar-portfolio", homepage: "", stargazers_count: 0, pushed_at: null, _fallback: true };

  var ago = function (iso) {
    if (!iso) return "";
    var s = (Date.now() - new Date(iso).getTime()) / 1000, u = [[31536000, "year"], [2592000, "month"], [86400, "day"], [3600, "hour"], [60, "minute"]];
    for (var i = 0; i < u.length; i++) { var n = Math.floor(s / u[i][0]); if (n >= 1) return n + " " + u[i][1] + (n > 1 ? "s" : "") + " ago"; }
    return "just now";
  };
  var isFeat = function (r) { return featured.indexOf(String(r.name).toLowerCase()) > -1 || (r._fallback && featured.indexOf("prakhar-portfolio") > -1); };
  var safeUrl = function (u) { return /^https?:\/\//i.test(u || "") ? u : ""; };

  function cardHTML(r) {
    var langs = r.langs || (r.language ? [r.language] : []);
    var live = safeUrl(r.homepage);
    return '<article class="paper proj"><div class="tape tape-top"></div>' +
      '<div class="proj-top"><span class="lang">' + esc(langs[0] || "Repo") + "</span>" + (isFeat(r) ? '<span class="feat">Featured</span>' : "") + "</div>" +
      "<h3>" + esc(r.name) + "</h3><p>" + esc(r.description || "No description yet.") + "</p>" +
      (langs.length ? '<div class="tags">' + langs.map(function (l) { return '<span class="tag">' + esc(l) + "</span>"; }).join("") + "</div>" : "") +
      '<div class="proj-foot"><div class="proj-meta"><span><span class="star">★</span> ' + (r.stargazers_count || 0) + "</span>" + (r.pushed_at ? "<span>|</span><span>updated " + ago(r.pushed_at) + "</span>" : "") + "</div>" +
      '<div class="proj-btns">' + (live ? '<a class="btn btn-primary" href="' + esc(live) + '" target="_blank" rel="noopener" aria-label="Live demo of ' + esc(r.name) + '">Live ' + icon("open_in_new") + "</a>" : "") +
      '<a class="btn" href="' + esc(safeUrl(r.html_url)) + '" target="_blank" rel="noopener" aria-label="Code for ' + esc(r.name) + '">Code ' + icon("arrow_outward") + "</a></div></div></article>";
  }

  function renderProjects() {
    if (!grid) return;
    var list = repos.slice();
    var hasPortfolio = list.some(function (r) { return String(r.name).toLowerCase() === "prakhar-portfolio"; });
    var others = list.filter(function (r) { return String(r.name).toLowerCase() !== "prakhar-portfolio"; }).length;
    if (!hasPortfolio) list.push(FALLBACK);
    var t = function (r) { return r.pushed_at ? new Date(r.pushed_at).getTime() : 0; };
    if (sortMode === "recent") list.sort(function (a, b) { return t(b) - t(a); });
    else if (sortMode === "liked") list.sort(function (a, b) { return (b.stargazers_count || 0) - (a.stargazers_count || 0) || t(b) - t(a); });
    else list.sort(function (a, b) { return (isFeat(b) ? 1 : 0) - (isFeat(a) ? 1 : 0) || t(b) - t(a); });
    var html = list.map(cardHTML).join("");
    if (!others) html += '<div class="proj-empty"><p class="hand">next project goes here...</p><p>I\'m still building. Check back soon.</p></div>';
    grid.innerHTML = html;
  }

  $$(".tab").forEach(function (b) {
    b.addEventListener("click", function () {
      sortMode = b.getAttribute("data-sort");
      $$(".tab").forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
      renderProjects();
    });
  });

  function loadRepos() {
    renderProjects(); // fallback first, so the block is never empty
    if (!GH.username) return;
    var key = "gh-repos:" + GH.username, cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(key) || "null"); } catch (e) { cached = null; }
    var done = function (data) {
      repos = data.filter(function (r) { return !r.fork; });
      if (status) status.textContent = repos.length + " public " + (repos.length === 1 ? "repository" : "repositories") + " on GitHub.";
      renderProjects();
    };
    if (cached && Date.now() - cached.t < 600000 && Array.isArray(cached.d)) return done(cached.d);
    fetch("https://api.github.com/users/" + encodeURIComponent(GH.username) + "/repos?per_page=100&sort=pushed", { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { if (!r.ok) throw new Error("GitHub " + r.status); return r.json(); })
      .then(function (data) {
        if (!Array.isArray(data)) throw new Error("bad data");
        var slim = data.map(function (r) { return { name: r.name, description: r.description, language: r.language, stargazers_count: r.stargazers_count, pushed_at: r.pushed_at, html_url: r.html_url, homepage: r.homepage, fork: r.fork }; });
        try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d: slim })); } catch (e) { /* storage full */ }
        done(slim);
      })
      .catch(function () { if (status) status.textContent = "Couldn't reach GitHub right now. Showing what I have."; });
  }
  loadRepos();

  /* ---------- 4. CONTACT FORM ---------- */
  var form = $("#contactForm"), msg = $("#formMsg"), sendBtn = $("#sendBtn");
  var mailto = function (d) {
    return "mailto:" + (C.email || "") + "?subject=" + encodeURIComponent("New message from your portfolio") +
      "&body=" + encodeURIComponent((d.message || "") + "\n\n— " + (d.name || "") + " (" + (d.email || "") + ")");
  };
  var show = function (ok, html) { msg.hidden = false; msg.className = "form-msg " + (ok ? "ok" : "bad"); msg.innerHTML = html; };
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var F = form.elements;
    var d = { name: F.name.value.trim(), email: F.email.value.trim(), message: F.message.value.trim() };
    var errs = {
      name: d.name.length < 2 ? "Please enter your name." : "",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) ? "" : "Please enter a valid email.",
      msg: d.message.length < 10 ? "Message should be at least 10 characters." : ""
    };
    $("#e-name").textContent = errs.name; $("#e-email").textContent = errs.email; $("#e-msg").textContent = errs.msg;
    F.name.setAttribute("aria-invalid", !!errs.name); F.email.setAttribute("aria-invalid", !!errs.email); F.message.setAttribute("aria-invalid", !!errs.msg);
    if (errs.name || errs.email || errs.msg) { form.querySelector('[aria-invalid="true"]').focus(); return; }
    if (F.botcheck.value) { show(true, "Thanks! Your message was sent."); form.reset(); return; }
    var fallback = function (lead) {
      show(false, esc(lead) + ' <a href="' + esc(mailto(d)) + '">Email me directly instead</a>.');
    };
    if (!C.web3formsKey) {
      show(true, 'Opening your email app… If nothing happens, <a href="' + esc(mailto(d)) + '">click here to email me</a>.');
      window.location.href = mailto(d);
      return;
    }
    sendBtn.disabled = true;
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: C.web3formsKey, subject: "New message from your portfolio", from_name: d.name, name: d.name, email: d.email, message: d.message, botcheck: "" })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.success) throw new Error("fail");
        show(true, "Thanks! Your message was sent. I'll get back to you soon.");
        form.reset();
      })
      .catch(function () { fallback("Sorry, the message couldn't be sent."); })
      .then(function () { sendBtn.disabled = false; });
  });
})();
