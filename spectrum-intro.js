/* 3BL_Indie: a ZX Spectrum tape-loading intro for the front page.
 *
 * What happens, as on a real 48K Spectrum:
 *   LOAD "" is typed at the bottom with the flashing L cursor, then ENTER.
 *   Pilot tone: the border flashes in thick red and cyan bands.
 *   Header block: thin blue and yellow stripes, then "Program: 3BL_INDIE" appears.
 *   A short BASIC loader, another pilot, then "Bytes: LOADSCREEN".
 *   The SCREEN$ loads byte by byte in the Spectrum's own memory order: the picture
 *   arrives in thirds, one pixel row of each character line at a time, in black and
 *   white; then the colour attributes pour in from the top.
 *   The border goes black and the site appears.
 *
 * The picture is a real 6912-byte SCREEN$ (brand/3bl_loading.scr, made by
 * brand/make_loading_scr.py), embedded below so it works offline.
 *
 * Plays once per browser visit, about eleven seconds. Any key skips it. The first tap or
 * click on the screen turns the tape sound on (browsers block sound that starts by itself);
 * a second tap, or the SKIP button, skips. On iPhones the sound is set to play even with
 * the silent switch on, as a video would.
 * Never plays for people whose device asks for reduced motion.
 * Add ?intro to the address to see it again, ?nointro to skip it.
 */
(function () {
  "use strict";
  var q = location.search;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen = false;
  try { seen = sessionStorage.getItem("3bl_intro") === "1"; } catch (e) {}
  if (q.indexOf("nointro") >= 0) return;
  if ((seen || reduce) && q.indexOf("intro") < 0) return;
  try { sessionStorage.setItem("3bl_intro", "1"); } catch (e) {}

  var SCR_B64 = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8////PDgBF8Af//H8AAAkXP////3/AAAAAAAAQik3/gP88f//gHMP2///2X/+f/h///H//AAAACCQLwDwAB/+fgD/4f/8AAAAAAAHj////n/+LwD+AF8gGAFBfgPEL/h///4QAAAAAAAAAAAAAAAAf/8CBQw/3CADAQC//+h/oAAAAAAAAAAAAAAAAAAAAAR///AAkIAZANkA/L03/9+CAAAAAAAAAAAAAAAAAAAAAH//+/kAAA9DwufAH//H//4AAAAAAAAAAAAAAAAAAAAAf/////+ADfx/5///3gDfAH////////6F//////////5/////8QA/B///hv/////+fwAD8P/D+BA/wcIPg////n///9/3//////////////5////x//+CAT/AP/8gP/H+f///wPwAAAAAB+gBAAAABn///gCAAABQAAQA4PcQf/5//t8A/gB9IAGCAH8Dwg/+f//zEAAAAAAAAAAAAAAAAH//CAQBcIIAAQFQC///f4AAAAAAAAAAAAAAAAAAAAAAf//4APCAHQifAOTeD///ggAAAAAAAAAAAAAAAAAAAAB//v/+gAAtA9D/+APy///+AAAAAAAAAAAAAAAAAAAAAH//////6AX//6f2f//IgwB////////+Df/////////+f///////YX////v//////n///Af///8Dv/g///////5///////7////////////+AAAAAAAP+oe6A2/Aj8f//n/////8AAIwCCb+fAAAAAp//P4ADHj/AHAAAP+//w/+f/w+EP4Ab2AHgAj/A9AX/n7/nwAAAAAAAAAAAAAAAAB//wAEGisAAAENUA7/f/+gAAAAAAAAAAAAAAAAAAAApH/3/gD6gB8CpwbhAD///4YAAAAAAAAAAAAAAAAAAAAAf//t/+AADwO5v/4AZv///gAAAAAAAAAAAAAAAAAAAAB9//////wN///Dv///8ABgf////////gH//////////n////////////////////5/////////D//////////+f///////f////////////n//////gAYCoEAA///4PHB//////FASEAA2ekPQAAAAf4/EAc/////AvwD/AP/4AH/9HiD+AGfAAAI4/xPgD/xf+H8AAAAAAAAAAAAAAAAAf/8CBDJTgAACBXgf////gAAAAAAAAAAAAAAAAAAAACJ///8AjgAdB54E/gAP///GAAAAAAAAAAAAAAAAAAAAAH/////wAAMDcI3/wJ7f//4AAAAAAAAAAAAAAAAAAAAAf/z////9B///2f////4AzH////////8F//////////5///////////////gB9ABif////////wN//////////n/////3+Bg////Af/////5///8O///7gMAADw///+9+f//zf/z+X8A8Af//sAAAAH/4AAD/v/////8A/wYAH/x//QAwXgB9wCgDkv8b/i/2f+/8AAAAAAAAAAAAAAAAAH//AARAG6EgAhzgBv///4AAAAAAAAAAAAAAAAAAAAACf///wJyADgNHI/8AH////gAAAAAAAAAAAAAAAAAAAAB//////AAHA/wP//iB3f9+AAAAAAAAAAAAAAAAAAAAAH///////gf///////4/wPB/////////Bf/////////+f////////6f/pX6//f3//gAoUgkFKMNCSL//v8N6fv5/////8sgHP/4B+AB////+A///CL/7PwHwAB/gA//hzn//8Q/85X9AKA3/+AMAAAAHx/8AHv//////AP8Af/9+f/4AAP4AJeAIBzD/D/w/8H4f/wAAAAAAAAAAAAAAAAB//wICIAeAaRImAH////9AAAAAAAAAAAAAAAAAAAAAAH///+DwABoG40c/AA////4AAAAAAAAAAAAAAAAAAAAAf//7//4ADUD4B//+AJu/+gAAAAAAAAAAAAAAAAAAAAB///////+///////////j+f////////wf//////////n///////////////wD///4B+//v/+d/R//AUG1/+//+f//eALDgB5/BDuA+oAAB/n////CgD+eDwAAN//AAP/B//4A//LlTQBiA036EAAAAf///Avv/8P///wD/AAD/8n/+AADyADVAAi4S/5/8P8B5//8AAAAAAAAAAAAAAAAAf/8CAgoIA+ebQcAuP///4AAAAAAAAAAAAAAAAAAAAAB/7//4tAALQ34LxwAf76/+AAAAAAAAAAAAAAAAAAAAAH//////gAcQeAf//8ATv/4AAAAAAAAAAAAAAAAAAAAAf///////z9//////////HgP////D//8H//////////5////////////////////+E5//9x///wJ/u////L///gAf4WBwgAENQADgAAw/wD5/+GAH//wsAAAAD//////+f/+AB/x5X+AQxEB+D8AAAHf//yvP/+D/f/gADwAA/f5//gAE+gAEYAT9IP9f+H+AR///AAAAAAAAAAAAAAAAAH//AAJgAgHgTwABQD///8AAAAAAAAAAAAAAAAAAAABAf////PQADwfABjgAX8f/fgAAAAAAAAAAAAAAAAAAAAB//7///8AFAD0H///4sz/+AAAAAAAAAAAAAAAAAAAAAH/////////f///////f/yIAAAAAAAAAAAAAAAAAAAAAd//////////////////+/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAA/AAABgAB//wP/wBwAAAAAP+BwBwP/wB/wP/+AADD/w//w/8GAAAAHA4H4HAAAAAAHAH4HA4H4A4A4AAAAMDMA88AzAYAAAAcDgfgcAAAAAAcAcD8DgfgDgDgAAAAwAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH////////////////////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMD8D//A/AYAAf/8D/8AcAAAAAD/gcAcD/8Af8D//gAAwPwD/wD8BgAAP/wP/wBwAAAAABwBxxwOB+AOAP/wAADDzw/Pw88GAAAAHA4H4HAAAAAAHAHA/A4H4A4A4AAAAMAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/////////////////v//+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA/A//wPwGAAH//A//AHAAAAAA/4HAHA//AH/A//4AAMD8A/8A/AYAAD/8D/8AcAAAAAAcAcccDgfgDgD/8AAAw88Pz8PPBgAB//wP/wB//wP/wP+BwBwP/wB/wP/+AAD////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//////////////////7/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwPwP/8D8BgAAABwOB+BwAAAAABwB+BwOB+AOAOAAAADA/APPAPwGAAA//A//AHAAAAAAHAHHHA4H4A4A//AAAMAAAAAAAAYAAf/8D/8Af/8D/8D/gcAcD/8Af8D//gAA////////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH////////////////////4A////////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMD8D//A/AYAAAAcDgfgcAAAAAAcAfgcDgfgDgDgAAAAwPwDzwD8BgAAABwOB+BwAAAAABwBwPwOB+AOAOAAAADAAAAAAAAGAAH//A//AH//A//A/4HAHA//AH/A//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB////////////////////+Af///////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAA/AAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADD/w//w/8GAAAAHA4H4HAAAAAAHAH4HA4H4A4A4AAAAMDMA88AzAYAAAAcDgfgcAAAAAAcAcD8DgfgDgDgAAAAwAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//f/////////////////gMAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAPwAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAw/8P/8P/BgAAABwOB+BwAAAAABwB+BwOB+AOAOAAAADAzAPPAMwGAAAAHA4H4HAAAAAAHAHA/A4H4A4A4AAAAMAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAD8AAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMP/D//D/wYAAAAcDgfgcAAAAAAcAfgcDgfgDgDgAAAAwMwDzwDMBgAAABwOB+BwAAAAABwBwPwOB+AOAOAAAADAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAff+Wt+gAAAAAAAB///8AAAAAAAAf8wAA///+AAAAAAobfhGf2FOIAAAAAHAAAAAAAAAA3////wDwQS4AAAAAIALz7///n9/zgAAAYHGA///////wAAsP/8AAAgAAAAAAFOAAAARvAJIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACD8CAMAAAP/8B/////////8f/AD///4AAAAAAAAAAAIAKh+EgAAA/////////////////////gAAAAAAAAAAAAAJ4AAAAAB////////////////////+AAAAAAAAAGQAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAOP/QgTyAAAAAAAAf///AAAAAAAAf/wAAP///gAAAAARCevz49p84gAAAABIAAAAAAAAAP////8A9AAuAAAAADgA/3///+f0fOAAAEDh4H//////8BwAf//wAAIAAAAAAL84AAAA5gD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/CIAAAAD//AAAAAAAAAAAA/4A///+AAAAAAAAAAAGACYewAAAAP////////////////////4AAAAAAAAAAAAIDcAAAAAA/////////////////////gAAAAAAAAGaAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAACP/AAGOIAAAAAAAH//rwAAAAAABf//AAD///4AAAAAMPjftrn6+TsAAAAAIAAAAAAAAADAP///APoAAgAAAAAuIPzP/9/53v8wAABR4fBEf30Pj/wCP/wB4DAAAAAAAAABTgAAADgAigAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPyIAAAAA//wAAAAAAAAAAAf+AP///gAAAAAAAAAAAAAuJiAAAAD///////////////+////+AAAAAAAAAAAACIQAAAAAAP////////////////////4AAAAAAAAHbgAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAACP70BB44gAAAAAAB/Qw8AAAAAAAP//4AA///+AAAAADQ7/6++ePTLAAAAAAAAAAAAAAAA/+H/BwDwAAAAAAAAE4j/z//33wc/AAAAAAAQNACBUEgH/yAEKAAAgAAAAAAAC5OAABh/AKmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG+OcAAAAP/8AAAAAAAAAAAHvgD///4AAAAAAAAAAAAAEqKAAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAABAAAAAAAAD////////////////////+AAAAAAAAP57z0AAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAL//BMbxiAAAAAAAeAAPAAAAAAAH//+AAP///gAAAAB0Lf/v/5/88wAAAAAQAAf/AAAAAP/Q/9cA4AAAAAAAAATi/3v/7XzwTwAAAAIIkAAIIAECIAQEIABhAAAAAAAAAAIg4AByvwCucAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAd+P8BgAAD//AAAAAAAAAAAB/4A///+AAAAAAAAAAAAACkgYAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAEAAAAAAAA/////////////////////gAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAD9fAG3/cIAAAAAAHgBHwAAAAAAF///0AD//74AAAAAfTn/87/n/v3gAAAAAAAB/wAAAADAAAAPANAAAAAAAAADON28P/ZxzjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AADgByD8AvvgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWI+F4AAA//wAAAAAAAAAAAf+AP///gAAAAAAAAAAAIQP4BgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADkAAAAAAP////////////////////4AAAAAAAL///3oAAAAAAAAAAAAAAAAAAAA/v8AAAAAAAAAAAAA93EP//5YgAAAAABwAA8AAAAAAA///+AA/9s+AAAAADAwv4YfuvX7mAAAADAAAf8AAAAA+wAADwCgAAAAAAAAAE4ynB/54zgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAIBwD/AP74AAB//Af///////////7////+AAAAAAAAAAAAemAg3+AAAP/+AAAAAAAAAAAP/gD///4AAAAAAAAAAAOEDJAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeQAAAAAD////////////////////+AAAAAAAIAAAACAAAAAAAAAAAAAAAAAAAAMAPAAAAAAAAAAAAALc3Abv/TiAAAAAAeAABAAAAAAAv///oAPhSHgAAAAAMIM+5/9588M4AAABgEQD///////AAAA/+wAAGAAAAAACziLAD33jiQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAA/wBW8AAA//wH/////////////////gAAAAAAAAAAAAnrCZPAAAD//4AAAAAAAAAAB/wA///+AAAAAAAAAAAEEAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwcHB0dHBwdHR0dHBwcHBwUFBQUFBQUFBQUFBQcFBQUHBwcHBwcHBwcHBwcHBwcHBRUVBQUVFQUFBQUFBQUFBQUFBQcHBwcHBwcHBwcHBwcEDBQEDAUVBwUEBAQEBQUFBQUFBwUFBQEFBQ4FDwcFBQQEQgcMDAcHBQUFBAQEBAQHBQUMDAwMDAwMDAwMDA4OBAQFBQcFBQUFBwUEDAQEBAwMDAwMDAwMDAwODg4MDAcEBAwMBQUFBwUGBAUEDAQEDAwMDAwMDAUMDAwMDAwMDAQEBAQMDAUHBAwUFAQMBAQMDAwMDAUFBQUFDAwMDAUFBAQUFBQEBAQEBAQEBAQUBgUFBQUFBQUFBQUFBQUFBQUEBAQEBAQEBAQEBAQEBAQEQkJCQkJCQkJHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dCRkZGRkZGQkdGRkZGRkZGRkVFRUVFRUVFRUVFRUVFR0JGRkZGRkZCR0ZGRkZGRkZGRUVFRUVFRUVFRUVFRUVHQkZGRkZGRkJHRkZGRkZGRkZFRUVFRUVFRUVFRUVFRUdCRkZGRkZGQkdGRkZGRkZGRkVFRUVFRUVFRUVFRUVFR0JCQkJCQkJCR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHAgICAgICAgICAgICAgICAgEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgICAgICAQEBAQEHBwcHBwcBAQEBARQUFBQUFBQUFAICFBQUFBQBAQEHBwICBwYGBwcHAQEBQkJCVlZWVlYWRkYWVkJCQgEBBwcCAgICQgYWBgcDAwFCBgYWVlZWVgYHRgZWQgJCAQEHBwcHAgICAkIGBgcHAwYGBgYGBgYGBgYGBgYGBgYBAQEHBwcHBwcHAhQCBwcHAgICAgICAgICAgIGAgICAgEBAQcHBgcHBwICBwcHAwMCAgICAgICAgICBhYUAgICAQEBAQEHRwICBwcCBwcDAQICAgICAgICAgICAgICAgIBAQEBAQEDBwcHBgYHBwMB";
  var scr = (function () { var s = atob(SCR_B64), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; })();

  // 0-7 black blue red magenta green cyan yellow white; 8-15 the BRIGHT versions
  var PAL = [[0,0,0],[0,0,215],[215,0,0],[215,0,215],[0,215,0],[0,215,215],[215,215,0],[215,215,215],
             [0,0,0],[0,0,255],[255,0,0],[255,0,255],[0,255,0],[0,255,255],[255,255,0],[255,255,255]];
  var RED = 2, BLUE = 1, CYAN = 5, YELLOW = 6;

  // ---------------------------------------------------------------- timeline (seconds)
  var TL = [
    // [start, end, border, block] ; block: what the tape is doing
    [0.00, 1.05, "white", null],
    [1.05, 2.05, "pilot", "pilot"],
    [2.05, 2.20, "data",  "header1"],
    [2.20, 2.80, "pilot", "pilot"],
    [2.80, 3.10, "data",  "basic"],
    [3.10, 3.70, "pilot", "pilot"],
    [3.70, 3.85, "data",  "header2"],
    [3.85, 4.35, "pilot", "pilot"],
    [4.35, 9.55, "data",  "screen"],
    [9.55, 11.0, "black", null]
  ];
  var T_TYPE = 0.30, T_ENTER = 0.95, T_SCR = 4.35, T_SCR_END = 9.55, T_HOLD = 11.0, T_FADE = 0.45;
  function phase(t) { for (var i = 0; i < TL.length; i++) if (t < TL[i][1]) return TL[i]; return TL[TL.length - 1]; }

  // ---------------------------------------------------------------- overlay
  var css = document.createElement("style");
  css.textContent =
    "#zx{position:fixed;inset:0;z-index:99999;background:#000;display:flex;align-items:center;justify-content:center;transition:opacity " + T_FADE + "s}" +
    "#zx canvas{width:min(100vw,133.33vh);height:auto;aspect-ratio:4/3;image-rendering:pixelated;image-rendering:crisp-edges}" +
    "#zx button{position:absolute;bottom:14px;font:12px/1 monospace;letter-spacing:.12em;padding:9px 12px;background:#000;color:#fff;border:2px solid #fff;cursor:pointer}" +
    "#zx .zx-skip{right:14px}#zx .zx-snd{left:14px}" +
    "#zx .zx-hint{position:absolute;top:14px;left:50%;transform:translateX(-50%);font:12px/1 monospace;letter-spacing:.14em;color:#fff;background:#000;padding:8px 12px;border:2px solid #fff;animation:zxblink 1s steps(2) infinite}" +
    "@keyframes zxblink{50%{opacity:0}}#zx button:focus-visible{outline:3px solid #ff0}";
  document.head.appendChild(css);
  var box = document.createElement("div"); box.id = "zx";
  box.setAttribute("role", "img");
  box.setAttribute("aria-label", "3BL_Indie loading screen in the style of a ZX Spectrum loading from tape. Press any key to skip.");
  var cv = document.createElement("canvas"); cv.width = 320; cv.height = 240; box.appendChild(cv);
  var snd = document.createElement("button"); snd.className = "zx-snd"; snd.type = "button"; snd.textContent = "SOUND OFF";
  var skip = document.createElement("button"); skip.className = "zx-skip"; skip.type = "button"; skip.textContent = "SKIP";
  var hint = document.createElement("div"); hint.className = "zx-hint"; hint.textContent = "TAP FOR SOUND";
  box.appendChild(snd); box.appendChild(skip); box.appendChild(hint);
  document.body.insertBefore(box, document.body.firstChild);
  var oldOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  var ctx = cv.getContext("2d"), img = ctx.createImageData(256, 192);

  // ---------------------------------------------------------------- 8x8 text, thresholded to 1-bit
  var gcv = document.createElement("canvas"); gcv.width = 256; gcv.height = 8;
  var gx = gcv.getContext("2d"), fontReady = false;
  function bits(str) {
    gx.clearRect(0, 0, 256, 8); gx.fillStyle = "#fff"; gx.textBaseline = "top";
    gx.font = fontReady ? "8px PS2P" : "bold 8px monospace";
    for (var i = 0; i < str.length; i++) gx.fillText(str[i], i * 8, 0);
    var d = gx.getImageData(0, 0, 256, 8).data, o = new Uint8Array(2048);
    for (var p = 0; p < 2048; p++) o[p] = d[p * 4 + 3] > 110 ? 1 : 0;
    return o;
  }
  var TX = {};
  function buildText() { TX.load = bits('LOAD ""'); TX.prog = bits("Program: 3BL_INDIE"); TX.bytes = bits("Bytes: LOADSCREEN"); TX.L = bits("L"); }
  buildText();
  try {
    var ff = new FontFace("PS2P", "url(carpet-grand-prix/fonts/PressStart2P.woff)");
    ff.load().then(function (f) { document.fonts.add(f); fontReady = true; buildText(); }).catch(function () {});
  } catch (e) {}

  // ---------------------------------------------------------------- tape sound
  var actx = null, src = null, buf = null, soundOn = false, t0 = performance.now();
  function buildSound() {
    var sr = actx.sampleRate, n = Math.ceil(sr * T_SCR_END), b = actx.createBuffer(1, n, sr), d = b.getChannelData(0);
    TL.forEach(function (seg) {
      var s0 = Math.floor(sr * seg[0]), s1 = Math.min(n, Math.floor(sr * seg[1])), i = s0;
      if (seg[3] === "pilot") { var h = sr / 807 / 2; for (; i < s1; i++) d[i] = (((i - s0) / h) | 0) % 2 ? 0.28 : -0.28; }
      else if (seg[3]) {
        // sync pulse, then bits: a 0 is a short pulse pair, a 1 twice as long
        while (i < s1) { var half = sr / (Math.random() < 0.5 ? 2044 : 1022) / 2; for (var k = 0; k < half * 2 && i < s1; k++, i++) d[i] = k < half ? 0.25 : -0.25; }
      }
    });
    return b;
  }
  function startSound() {
    try {
      // iPhone/iPad: without this, Web Audio is silenced by the ring/silent switch
      try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      buf = buf || buildSound();
      var at = (performance.now() - t0) / 1000;
      if (at >= T_SCR_END) return;
      src = actx.createBufferSource(); src.buffer = buf; src.connect(actx.destination); src.start(0, at);
    } catch (e) {}
  }
  function stopSound() { try { if (src) src.stop(); } catch (e) {} src = null; }
  function toggleSound() {
    soundOn = !soundOn; snd.textContent = soundOn ? "SOUND ON" : "SOUND OFF";
    if (soundOn) startSound(); else stopSound();
  }
  snd.addEventListener("click", function (ev) { ev.stopPropagation(); toggleSound(); });

  // ---------------------------------------------------------------- finish / skip
  var done = false;
  function finish() {
    if (done) return; done = true; stopSound();
    box.style.opacity = "0";
    window.removeEventListener("keydown", onKey, true);
    setTimeout(function () {
      box.remove(); css.remove(); document.documentElement.style.overflow = oldOverflow;
      try { if (actx) actx.close(); } catch (e) {}
    }, T_FADE * 1000 + 30);
  }
  function onKey(e) {
    if ((e.target === snd || e.target === skip) && (e.key === "Enter" || e.key === " ")) return;
    if (e.key === "Tab") return;
    e.preventDefault(); finish();
  }
  window.addEventListener("keydown", onKey, true);
  skip.addEventListener("click", function (ev) { ev.stopPropagation(); finish(); });
  // first tap on the screen: sound on (the tap is what lets the browser play it); next tap: skip
  var tapped = false;
  box.addEventListener("click", function () {
    if (!tapped) { tapped = true; if (!soundOn) toggleSound(); hint.style.display = "none"; return; }
    finish();
  });

  // ---------------------------------------------------------------- the Spectrum's screen memory
  var mem = new Uint8Array(6912);
  for (var a = 6144; a < 6912; a++) mem[a] = 0x38;          // PAPER 7 INK 0, as after NEW
  function rowAddr(y) { return ((y & 0xC0) << 5) | ((y & 7) << 8) | ((y & 0x38) << 2); }
  function printAt(row, col, b, len, inverse) {              // write 8x8 text straight into screen memory
    for (var y = 0; y < 8; y++) for (var c = 0; c < len; c++) {
      var v = 0; for (var k = 0; k < 8; k++) v = (v << 1) | b[y * 256 + c * 8 + k];
      mem[rowAddr(row * 8 + y) + col + c] = inverse ? v ^ 255 : v;
    }
  }
  function clearRow(row) { for (var y = 0; y < 8; y++) for (var c = 0; c < 32; c++) mem[rowAddr(row * 8 + y) + c] = 0; }

  var loaded = 0, printedProg = false, printedBytes = false;
  var stripe = 0, lastT = 0;
  function rgb(c) { var p = PAL[c]; return "rgb(" + p[0] + "," + p[1] + "," + p[2] + ")"; }

  function drawBorder(kind) {
    if (kind === "white") { ctx.fillStyle = rgb(7); ctx.fillRect(0, 0, 320, 240); return; }
    if (kind === "black") { ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 320, 240); return; }
    var y, on = stripe & 1;
    if (kind === "pilot") {
      // thick, slowly rolling red and cyan bands
      y = -(stripe * 3 % 22);
      while (y < 240) { ctx.fillStyle = rgb(on ? RED : CYAN); ctx.fillRect(0, y, 320, 11); y += 11; on ^= 1; }
    } else {
      // thin, jittering blue and yellow data stripes
      y = 0;
      while (y < 240) { var h = 2 + Math.floor(Math.random() * 5); ctx.fillStyle = rgb(on ? BLUE : YELLOW); ctx.fillRect(0, y, 320, h); y += h; on ^= 1; }
    }
    stripe++;
  }

  function frame() {
    if (done) return;
    var t = (performance.now() - t0) / 1000;
    var ph = phase(t);

    // keyboard: LOAD "" with the flashing L cursor, then ENTER clears it
    if (t < T_ENTER) {
      clearRow(23);
      if (t >= T_TYPE) {
        var n = t < T_TYPE + 0.25 ? 5 : t < T_TYPE + 0.45 ? 6 : 7;     // LOAD is one key on a Spectrum
        printAt(23, 0, TX.load, n, false);
        if (Math.floor(t / 0.32) % 2 === 0) printAt(23, n, TX.L, 1, true);
      }
    } else if (lastT < T_ENTER) clearRow(23);
    if (!printedProg && t >= 2.20) { printAt(0, 0, TX.prog, 18, false); printedProg = true; }
    if (!printedBytes && t >= 3.85) { printAt(1, 0, TX.bytes, 17, false); printedBytes = true; }

    // the SCREEN$ block: copy bytes in arrival order (bitmap first, attributes last)
    if (t >= T_SCR) {
      var target = Math.min(6912, Math.floor((t - T_SCR) / (T_SCR_END - T_SCR) * 6912));
      for (; loaded < target; loaded++) mem[loaded] = scr[loaded];
    }

    drawBorder(ph[2]);
    var d = img.data;
    for (var y = 0; y < 192; y++) {
      var ra = rowAddr(y), aa = 6144 + (y >> 3) * 32;
      for (var c = 0; c < 32; c++) {
        var at = mem[aa + c], br = (at & 64) ? 8 : 0, ink = PAL[(at & 7) + br], paper = PAL[((at >> 3) & 7) + br];
        var flash = (at & 128) && (Math.floor(t / 0.32) % 2);
        var v = mem[ra + c];
        for (var k = 0; k < 8; k++) {
          var on = (v >> (7 - k)) & 1; if (flash) on ^= 1;
          var p = on ? ink : paper, o = (y * 256 + c * 8 + k) * 4;
          d[o] = p[0]; d[o + 1] = p[1]; d[o + 2] = p[2]; d[o + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 32, 24);
    lastT = t;
    if (t >= T_HOLD) { finish(); return; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
