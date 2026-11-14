/*
  Gute Form Light: an optional add-on for gute-form.css (a plain script, no dependencies).

  It moves the one light of the library as the page scrolls. A lamp stays put in the
  window: above the top edge, left of centre, some way in front of the page. The page
  scrolls under it, so each block catches the light differently as it passes: low in the
  window it is lit steeply from above and its shadows are long; they shorten as it nears
  the lamp; once it has passed the lamp it is lit from slightly below. It is optional: the
  CSS library works without it, with its fixed light (--gf-light-x -0.35, --gf-light-y
  -0.8), and a block in the middle of the window gets nearly those values.

  Use: one line in the page's <head>; it starts by itself:

    <script defer src="gute-form-light.js"></script>

  For each lit block in or near the window it works out the direction from the block's
  centre to the lamp and writes --gf-light-x and --gf-light-y (numbers from -1 to 1) on
  that block as inline custom properties. The CSS turns them into shadows and sheen, and
  everything inside the block inherits them.

  Lit blocks (few on purpose, to keep it cheap; not every button):
    .gf-panel, .gf-product, .gf-menubar   by default (GuteFormLight.selector)
    data-gf-light                         on any other element: light it on its own
    data-gf-light="off"                   on an element, an ancestor or <html>: no moving
                                          light there (values already written are removed)
  After adding or removing blocks, or changing data-gf-light, call GuteFormLight.refresh().

  It does nothing, and removes what it wrote, under prefers-reduced-motion: reduce and
  under forced-colors: active (both are watched), so the fixed CSS light stays.

  window.GuteFormLight:
    start()      switch the moving light on (it is on from the start)
    stop()       switch it off and remove the values it wrote
    refresh()    find the lit blocks again and light them now
    enabled      true while it is writing light values (started and not held back by
                 reduced motion, forced colours or data-gf-light="off" on <html>); read-only
    lamp         { x, y, height, spread }: change a value, then call refresh()
                   x, y     the lamp's place as fractions of the window's width and height
                            from its top left corner (default 0.25, -0.1: above the top edge)
                   height   how far the lamp is in front of the page, as a fraction of the
                            window's height (default 0.4); lower gives a harder change
                   spread   how much a block's sideways place counts, 0 to 1 (default 0.5;
                            0 lights two columns alike, 1 is a true point lamp)
                 Sideways distances are measured in window widths and the others in window
                 heights, so a phone and a wide screen are lit alike.
    selector     the default lit blocks (a CSS selector); change it, then call refresh()
    at(x, y)     the light at a point of the window in px: { x, y }, the two numbers
                 that would be written on a block centred there

  Event: "gf-light" on document, each time the lighting is worked out again (start,
  refresh, a scroll or resize frame) and when it is switched on or off. event.detail:
    on           true while the moving light is on
    x, y         the lamp's place in window px (from the top left corner; y is negative
                 above the top edge)
    height       the lamp's distance in front of the page, in px
    spread       as lamp.spread
  A listener can call GuteFormLight.at(x, y) for the light at its own place, or read
  --gf-light-x / --gf-light-y from a lit block's computed style.

  Cost: an IntersectionObserver keeps the list of blocks in or near the window; scroll and
  resize (passive listeners) ask for one animation frame, which reads every rectangle
  first and then writes, and only where a value moved by 0.01 or more.
*/
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.document || window.GuteFormLight) return;

  var doc = document;
  var root = doc.documentElement;
  var PX = "--gf-light-x";
  var PY = "--gf-light-y";
  var REACH = 0.25;  // blocks this far beyond the window (in window heights) are still lit,
                     // and a tall block's centre counts no further out than this

  var lamp = { x: 0.25, y: -0.1, height: 0.4, spread: 0.5 };
  var selector = ".gf-panel, .gf-product, .gf-menubar";

  var wanted = true;         // start() / stop()
  var active = false;        // wanted and not held back
  var blocks = [];           // every lit block
  var near = new Set();      // the lit blocks in or near the window
  var written = new Map();   // block -> { x, y } as written (strings)
  var frame = 0;
  var io = null;
  var listening = false;

  var still = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var forced = window.matchMedia ? window.matchMedia("(forced-colors: active)") : null;

  function held() {
    return (still && still.matches) || (forced && forced.matches) ||
      root.getAttribute("data-gf-light") === "off";
  }

  function clamp(n, lo, hi) { return n < lo ? lo : n > hi ? hi : n; }

  // The light at a window point (px), in a window of vw by vh px: the direction from the
  // point to the lamp, as a unit vector's x and y, rounded to 0.01.
  function lightAt(px, py, vw, vh) {
    if (!(vw > 0) || !(vh > 0)) return null;
    var u = clamp(px / vw, 0, 1);
    var v = clamp(py / vh, -REACH, 1 + REACH);
    var dx = lamp.x - (0.5 + (u - 0.5) * clamp(lamp.spread, 0, 1));
    var dy = lamp.y - v;
    var h = Math.max(lamp.height, 0.01);
    var len = Math.sqrt(dx * dx + dy * dy + h * h);
    var x = clamp(Math.round(dx / len * 100) / 100, -1, 1) + 0;  // + 0: never "-0"
    var y = clamp(Math.round(dy / len * 100) / 100, -1, 1) + 0;
    if (x !== x || y !== y) return null;
    return { x: x, y: y };
  }

  function clear(el) {
    el.style.removeProperty(PX);
    el.style.removeProperty(PY);
    if (el.getAttribute("style") === "") el.removeAttribute("style");
    written.delete(el);
  }

  function announce() {
    var vw = window.innerWidth, vh = window.innerHeight;
    doc.dispatchEvent(new CustomEvent("gf-light", {
      detail: { on: active, x: lamp.x * vw, y: lamp.y * vh, height: lamp.height * vh, spread: lamp.spread }
    }));
  }

  // Find the lit blocks; take the light off blocks that are no longer lit.
  function scan() {
    var found = [];
    var all;
    try { all = doc.querySelectorAll(selector + ", [data-gf-light]"); }
    catch (e) { all = doc.querySelectorAll("[data-gf-light]"); }
    for (var i = 0; i < all.length; i++) {
      if (!all[i].closest('[data-gf-light="off"]')) found.push(all[i]);
    }
    var keep = new Set(found);
    written.forEach(function (v, el) { if (!keep.has(el)) clear(el); });
    blocks = found;
    near.clear();
    if (io) {
      io.disconnect();
      for (var j = 0; j < blocks.length; j++) io.observe(blocks[j]);
    }
  }

  // Light the blocks. A full pass looks at every lit block and works out for itself which
  // are near the window; otherwise only the blocks the observer reported are read.
  function pass(full) {
    if (!active) return;
    var vw = window.innerWidth, vh = window.innerHeight;
    var all = full || !io;
    var list = all ? blocks : Array.from(near);
    var rects = [];
    var i, r, el;
    for (i = 0; i < list.length; i++) rects.push(list[i].getBoundingClientRect());  // read all
    for (i = 0; i < list.length; i++) {                                              // then write
      r = rects[i];
      el = list[i];
      if (!r.width && !r.height) { near.delete(el); continue; }  // not drawn (a closed dialog)
      if (all) {
        if (r.bottom < -REACH * vh || r.top > (1 + REACH) * vh) { near.delete(el); continue; }
        near.add(el);
      }
      var v = lightAt(r.left + r.width / 2, r.top + r.height / 2, vw, vh);
      if (!v) continue;
      var sx = String(v.x), sy = String(v.y);
      var was = written.get(el);
      if (was && was.x === sx && was.y === sy) continue;
      if (!was || was.x !== sx) el.style.setProperty(PX, sx);
      if (!was || was.y !== sy) el.style.setProperty(PY, sy);
      written.set(el, { x: sx, y: sy });
    }
    announce();
  }

  function schedule() {
    if (!active || frame) return;
    frame = window.requestAnimationFrame(function () { frame = 0; pass(false); });
  }

  function seen(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) near.add(entries[i].target);
      else near.delete(entries[i].target);
    }
    schedule();
  }

  function listen(on) {
    if (on === listening) return;
    listening = on;
    var how = on ? "addEventListener" : "removeEventListener";
    doc[how]("scroll", schedule, { passive: true, capture: true });  // capture: inner scrollers too
    window[how]("resize", schedule, { passive: true });
    window[how]("load", schedule);
    if (on && !io && "IntersectionObserver" in window) {
      io = new IntersectionObserver(seen, { rootMargin: REACH * 100 + "% 0px" });
    }
    if (!on) {
      if (io) { io.disconnect(); io = null; }
      if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
    }
  }

  // Bring everything in line with start/stop, the media settings and the markup.
  // It announces once whenever the light is on, or has just gone off.
  function sync() {
    var was = active;
    active = wanted && !held();
    if (active) {
      listen(true);
      scan();
      pass(true);
    } else {
      listen(false);
      blocks = [];
      near.clear();
      written.forEach(function (v, el) { clear(el); });
      if (was) announce();
    }
  }

  function watch(mq) {
    if (!mq) return;
    if (mq.addEventListener) mq.addEventListener("change", sync);
    else if (mq.addListener) mq.addListener(sync);
  }
  watch(still);
  watch(forced);

  window.GuteFormLight = {
    start: function () { wanted = true; sync(); },
    stop: function () { wanted = false; sync(); },
    refresh: function () { sync(); },
    at: function (x, y) { return lightAt(x, y, window.innerWidth, window.innerHeight); },
    get enabled() { return active; },
    get lamp() { return lamp; },
    set lamp(v) {
      if (!v) return;
      ["x", "y", "height", "spread"].forEach(function (k) {
        if (typeof v[k] === "number" && isFinite(v[k])) lamp[k] = v[k];
      });
    },
    get selector() { return selector; },
    set selector(v) { if (typeof v === "string" && v) selector = v; }
  };

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", sync);
  else sync();
})();
