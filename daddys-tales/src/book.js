/* ==========================================================================
   Daddy's Tales: the book engine.
   Fixed 440x640 pages scaled to fit the screen, so the text paginates the
   same on every device. Two pages side by side on wide screens, one page
   at a time on phones held upright.
   ========================================================================== */
'use strict';
(() => {
  const PW = 440, PH = 640, FLIP_MS = 900;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Curly quotes and apostrophes, so the text sets like a printed book.
  const typeset = (t) => esc(t).replace(/(^|[\s(—-])"/g, '$1“').replace(/"/g, '”').replace(/(\w)'(\w)/g, '$1’$2').replace(/(^|\s)'/g, '$1‘').replace(/'/g, '’').replace(/ - /g, ' – ').replace(/\.\.\./g, '…');
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  /* ------------------------------------------------------------ sound */
  const Snd = (() => {
    let ctx = null, on = store.get('dt-sound') !== 'off';
    const ac = () => { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ctx && ctx.state === 'suspended') ctx.resume(); return ctx; };
    const noiseBuf = () => { const c = ac(), b = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; };
    let NB = null, OUT = null;
    function noise(t, dur, f1, f2, q = 1, gain = .3, type = 'bandpass') {
      const c = ac(); if (!c) return; NB = NB || noiseBuf();
      const s = c.createBufferSource(); s.buffer = NB; const fl = c.createBiquadFilter(); fl.type = type; fl.Q.value = q;
      fl.frequency.setValueAtTime(f1, t); fl.frequency.exponentialRampToValueAtTime(Math.max(f2, 20), t + dur);
      const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + Math.min(.02, dur / 4)); g.gain.exponentialRampToValueAtTime(.001, t + dur);
      s.connect(fl).connect(g).connect(OUT || c.destination); s.start(t, Math.random()); s.stop(t + dur + .05);
    }
    function tone(t, dur, f1, f2, type = 'sine', gain = .2, vib = 0) {
      const c = ac(); if (!c) return;
      const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(Math.max(f2, 20), t + dur);
      if (vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = vib; lg.gain.value = f1 * .04; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + dur); }
      const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + .015); g.gain.exponentialRampToValueAtTime(.001, t + dur);
      o.connect(g).connect(OUT || c.destination); o.start(t); o.stop(t + dur + .05);
    }
    const knock = (t) => { tone(t, .12, 160, 70, 'sine', .5); noise(t, .06, 900, 300, 2, .35); };
    const coo = (t) => { tone(t, .28, 680, 640, 'sine', .22, 6); tone(t + .34, .45, 540, 500, 'sine', .22, 6); };
    const S = {
      flip(t) { noise(t, .32, 3000, 900, .8, .16); noise(t + .18, .25, 1800, 500, .7, .12); },
      pop(t) { tone(t, .18, 220, 90, 'sine', .25); noise(t, .12, 1600, 600, 1, .12); },
      click(t) { noise(t, .04, 3000, 2000, 3, .25); tone(t, .05, 1200, 900, 'square', .04); },
      peek(t) { tone(t, .5, 220, 330, 'triangle', .12, 9); tone(t + .45, .35, 330, 260, 'triangle', .1, 12); },
      fridge(t) { noise(t, .08, 800, 400, 2, .3); tone(t + .1, 1.2, 60, 62, 'sawtooth', .04); },
      snap(t) { noise(t, .07, 4000, 1500, 2, .5); tone(t, .08, 900, 300, 'square', .08); },
      cork(t) { tone(t, .1, 500, 1400, 'sine', .3); noise(t, .1, 2000, 800, 2, .2); },
      chomp(t) { for (let i = 0; i < 3; i++) noise(t + i * .16, .09, 1400, 500, 1.5, .35); },
      creak(t) { tone(t, 1.1, 90, 140, 'sawtooth', .06, 23); },
      knock13(t) { for (let i = 0; i < 13; i++) knock(t + i * .24); noise(t + 3.3, 1.8, 900, 2400, 6, .12); tone(t + 3.3, 1.8, 900, 1300, 'sine', .08, 7); },
      knock3(t) { for (let i = 0; i < 3; i++) knock(t + i * .22); tone(t + .8, .6, 120, 70, 'sawtooth', .07); },
      bobby(t) { tone(t, 1, 200, 500, 'sine', .12); tone(t + 1.02, .22, 150, 50, 'sine', .5); noise(t + 1.02, .3, 1200, 200, .7, .4); },
      growl(t) { noise(t, 1.2, 300, 120, 3, .35, 'lowpass'); tone(t, 1.2, 70, 55, 'sawtooth', .1, 30); tone(t + 1.1, .7, 300, 240, 'sawtooth', .06, 14); },
      burp(t) { tone(t, .55, 95, 70, 'sawtooth', .22, 25); noise(t, .5, 400, 200, 2, .2, 'lowpass'); tone(t + .6, .5, 300, 420, 'triangle', .07); },
      tin(t) { tone(t + .35, .25, 2200, 1800, 'triangle', .08); noise(t + .35, .05, 5000, 3000, 3, .3); this.chomp(t + .7); },
      hooves(t) { for (let i = 0; i < 6; i++) { noise(t + i * .22, .05, 1200, 600, 3, .35); noise(t + i * .22 + .09, .05, 1000, 500, 3, .25); } noise(t + .2, 2.2, 200, 60, 1, .5, 'lowpass'); tone(t + 1.5, .5, 420, 300, 'sawtooth', .08, 8); tone(t + 2, .6, 300, 420, 'sawtooth', .08, 8); },
      rattle(t) { for (let i = 0; i < 8; i++) noise(t + i * .07, .05, 2500, 1800, 4, .25); tone(t + .6, .6, 900, 1500, 'sawtooth', .07, 18); },
      squawk(t) { tone(t + .3, .25, 900, 600, 'sawtooth', .12, 30); tone(t + .6, .3, 1000, 700, 'sawtooth', .1, 30); },
      hum(t) { tone(t, 2.4, 110, 112, 'triangle', .09, 3); tone(t, 2.4, 165, 166, 'sine', .05); },
      cuckoo(t) { this.squelch(t); coo(t + 1); coo(t + 1.9); },
      squelch(t) { noise(t, .35, 400, 150, 4, .3); },
      cuckoo3(t) { coo(t); coo(t + .9); coo(t + 1.8); },
      bark(t) { for (let i = 0; i < 4; i++) { tone(t + i * .28, .12, 500, 300, 'sawtooth', .1); noise(t + i * .28, .1, 900, 400, 2, .2); } tone(t + 1.2, .4, 300, 120, 'sine', .3); },
      bubbles(t) { for (let i = 0; i < 8; i++) tone(t + i * .12, .08, 500 + Math.random() * 500, 1200, 'sine', .08); tone(t + 1, 1.2, 55, 45, 'sawtooth', .07, 4); },
      pour(t) { noise(t + .4, 1.4, 1500, 900, 1.2, .14); tone(t + 1.4, .3, 600, 900, 'triangle', .05); },
      freak(t) { noise(t, 1, 1200, 700, 1, .15); for (let i = 0; i < 5; i++) tone(t + .2 + i * .14, .07, 400, 900, 'sine', .07); tone(t + 1.2, .8, 1100, 1700, 'sawtooth', .07, 25); },
      whisper(t) { noise(t, .2, 1200, 1000, 1, .2); for (let i = 0; i < 3; i++) noise(t + 1 + i * .5, .3, 3000, 2200, 2, .1); },
      bell(t) { tone(t, 1, 2100, 2080, 'sine', .18); tone(t, 1, 5200, 5100, 'sine', .05); tone(t + .25, 1, 2100, 2080, 'sine', .18); },
    };

    /* ---- ambience: a quiet, looping soundscape for whichever story is open ---- */
    let bus = null, stops = [], timers = [], ambKey = null, mode3 = +(store.get('dt-sndmode') || (on ? 0 : 2));
    const ambBus = () => { const c = ac(); if (!bus) { bus = c.createGain(); bus.gain.value = 0; bus.connect(c.destination); } return bus; };
    function loopNoise(type, freq, q, gain, lfo) {
      const c = ac(); NB = NB || noiseBuf();
      const s = c.createBufferSource(); s.buffer = NB; s.loop = true;
      const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = freq; fl.Q.value = q;
      const g = c.createGain(); g.gain.value = gain;
      s.connect(fl).connect(g).connect(ambBus()); s.start(0, Math.random() * 1.5);
      const nodes = [s];
      if (lfo) { const l = c.createOscillator(); l.frequency.value = lfo.rate; const d = c.createGain(); d.gain.value = lfo.depth || 0; l.connect(d).connect(fl.frequency); if (lfo.g) { const d2 = c.createGain(); d2.gain.value = lfo.g; l.connect(d2).connect(g.gain); } l.start(); nodes.push(l); }
      stops.push(() => nodes.forEach((n) => { try { n.stop(); } catch (e) {} }));
    }
    function loopTone(freqs, type, gain, lp = 2000, wob = 0) {
      const c = ac(); const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp;
      const g = c.createGain(); g.gain.value = gain; fl.connect(g).connect(ambBus()); const nodes = [];
      freqs.forEach((fq) => { const o = c.createOscillator(); o.type = type; o.frequency.value = fq; o.connect(fl); o.start(); nodes.push(o); });
      if (wob) { const l = c.createOscillator(); l.frequency.value = wob; const d = c.createGain(); d.gain.value = gain * .6; l.connect(d).connect(g.gain); l.start(); nodes.push(l); }
      stops.push(() => nodes.forEach((n) => { try { n.stop(); } catch (e) {} }));
    }
    const R = (a, b) => a + Math.random() * (b - a);
    const BED = {
      wind: (v = .07) => { loopNoise('lowpass', 420, 1, v, { rate: .06, depth: 260, g: v * .7 }); loopNoise('bandpass', 900, 3, v * .35, { rate: .11, depth: 500, g: v * .3 }); },
      rain: () => { loopNoise('highpass', 2600, .5, .07); loopNoise('bandpass', 1100, .6, .04, { rate: .2, depth: 200 }); },
      stream: () => loopNoise('bandpass', 1300, .8, .06, { rate: .35, depth: 500, g: .02 }),
      sea: () => loopNoise('lowpass', 650, .7, .1, { rate: .085, depth: 380, g: .09 }),
      hum: () => loopTone([50, 100.4], 'sine', .022),
      drone: () => loopTone([55, 55.5, 82.6], 'sawtooth', .03, 260, .05),
      dark: () => loopTone([41.2, 41.6, 61.8, 87.3], 'sawtooth', .032, 200, .08),
      tv: () => loopNoise('highpass', 5200, .5, .012),
      traffic: () => loopNoise('lowpass', 240, .7, .11, { rate: .05, depth: 80, g: .04 }),
      fire: () => loopNoise('lowpass', 320, .7, .03, { rate: 2.3, depth: 120, g: .015 }),
      rumble: () => loopNoise('lowpass', 140, .8, .05, { rate: .03, depth: 40, g: .03 }),
    };
    const EV = {
      owl(t) { tone(t, .45, 410, 380, 'sine', .07, 5); tone(t + .7, .25, 400, 380, 'sine', .05, 5); tone(t + 1, .55, 400, 360, 'sine', .06, 5); },
      crickets(t) { const f = R(4200, 4800); for (let i = 0; i < 3; i++) tone(t + i * .07, .04, f, f, 'sine', .018); },
      birds(t) { const n = 2 + Math.floor(Math.random() * 4), f = R(2200, 3400); for (let i = 0; i < n; i++) tone(t + i * .12, .08, f, f * R(1.2, 1.6), 'sine', .04); },
      drip(t) { const f = R(900, 1500); tone(t, .09, f, f * .5, 'sine', .07); tone(t + .28, .09, f, f * .5, 'sine', .025); tone(t + .56, .09, f, f * .5, 'sine', .01); },
      creak(t) { tone(t, R(.8, 1.6), R(70, 110), R(120, 170), 'sawtooth', .025, R(15, 30)); },
      giggle(t) { for (let i = 0; i < 6; i++) tone(t + i * .11, .1, 520 + i * 40 + (i % 2) * 90, 480 + i * 40, 'triangle', .03, 14); },
      knock(t) { for (let i = 0; i < 3; i++) { tone(t + i * .3, .12, 150, 70, 'sine', .14); noise(t + i * .3, .05, 800, 300, 2, .06); } },
      baa(t) { tone(t, .9, 290, 250, 'sawtooth', .025, 9); },
      howl(t) { tone(t, 2.6, 330, 560, 'sine', .035, 5); tone(t + 1.6, 1.6, 560, 380, 'sine', .03, 5); },
      thunder(t) { noise(t, 3.2, 160, 35, .6, .32, 'lowpass'); noise(t + .4, 2.4, 90, 30, .6, .25, 'lowpass'); },
      hooves(t) { for (let i = 0; i < 8; i++) { noise(t + i * .24, .04, 900, 500, 3, .06 * (1 - i / 10)); noise(t + i * .24 + .1, .04, 800, 400, 3, .04 * (1 - i / 10)); } },
      gull(t) { for (let i = 0; i < 3; i++) tone(t + i * .26, .22, 1500, 950, 'sawtooth', .02, 22); },
      screech(t) { tone(t, .5, 900, 1500, 'sawtooth', .025, 28); tone(t + .55, .4, 1300, 800, 'sawtooth', .02, 28); },
      bark(t) { for (let i = 0; i < 2; i++) { tone(t + i * .3, .1, 480, 300, 'sawtooth', .03); noise(t + i * .3, .08, 800, 400, 2, .05); } },
      coo(t) { tone(t, .3, 690, 650, 'sine', .07, 6); tone(t + .38, .5, 545, 500, 'sine', .07, 6); },
      whisper(t) { for (let i = 0; i < 5; i++) noise(t + i * R(.12, .2), R(.08, .18), R(2400, 4200), 2000, 2, .05); },
      squelch(t) { noise(t, .3, 500, 140, 4, .12); noise(t + .25, .25, 380, 120, 4, .08); },
      chime(t) { [440, 523, 587, 659, 698, 659, 587, 494, 392, 440, 494, 523, 440].forEach((f, i) => tone(t + i * .26, .24, f * 2, f * 2, 'triangle', .02)); },
      bell(t) { tone(t, .7, 2100, 2080, 'sine', .04); tone(t + .18, .7, 2100, 2080, 'sine', .04); },
      scurry(t) { for (let i = 0; i < 9; i++) noise(t + i * .045, .02, 3500, 2500, 3, .04); },
      snap(t) { noise(t, .05, 2500, 1200, 2, .14); noise(t + .06, .04, 1800, 900, 2, .08); },
      frog(t) { for (let i = 0; i < 2; i++) tone(t + i * .25, .18, 160, 140, 'square', .02, 40); },
      gurgle(t) { for (let i = 0; i < 7; i++) tone(t + i * .09, .07, R(250, 500), R(600, 900), 'sine', .045); },
      tick(t) { noise(t, .02, 3200, 3000, 6, .05); },
      till(t) { tone(t, .09, 1800, 1800, 'square', .015); tone(t + .14, .09, 1800, 1800, 'square', .015); },
      fizz(t) { for (let i = 0; i < 6; i++) tone(t + i * R(.03, .08), .03, R(2500, 5000), 6000, 'sine', .015); },
      wail(t) { tone(t, 3.4, 650, 1050, 'sine', .03, 6); tone(t + 1.8, 2.4, 1050, 700, 'sine', .025, 7); },
      crackle(t) { for (let i = 0; i < 4; i++) noise(t + R(0, .5), .015, R(2000, 5000), 1500, 3, .06); },
      spore(t) { tone(t, .5, R(1800, 2600), R(2600, 3200), 'sine', .015); },
      bubbles(t) { for (let i = 0; i < 6; i++) tone(t + i * .1, .06, R(300, 600), R(800, 1200), 'sine', .03); },
    };
    const MOODS = {
      front: { beds: [['wind', .045]], ev: [['owl', 25, 50], ['crickets', 1.5, 4]] },
      end: { beds: [['wind', .03]], ev: [['crickets', 1, 3], ['owl', 30, 60], ['tick', 1, 1]] },
      well: { beds: [['wind', .06]], ev: [['crickets', 1, 3], ['drip', 4, 9], ['giggle', 16, 32], ['owl', 22, 45]] },
      walls: { beds: [['hum']], ev: [['tick', 1, 1], ['creak', 9, 18], ['scurry', 10, 22]] },
      butter: { beds: [['hum']], ev: [['tick', 1, 1], ['scurry', 6, 14], ['creak', 14, 28]] },
      jamie: { beds: [['hum'], ['rumble']], ev: [['till', 5, 12]] },
      corn: { beds: [['sea', .5], ['rumble']], ev: [['birds', 2, 5]] },
      weeman: { beds: [['wind', .09]], ev: [['creak', 6, 13], ['snap', 5, 11], ['owl', 22, 40], ['giggle', 30, 55]] },
      banshee: { beds: [['wind', .12], ['rain']], ev: [['wail', 14, 28], ['thunder', 18, 36], ['knock', 30, 60]] },
      bobby: { beds: [], ev: [['birds', 2, 5], ['chime', 18, 32]] },
      box: { beds: [['wind', .06]], ev: [['frog', 3, 8], ['knock', 14, 28], ['crickets', 2, 4]] },
      weresheep: { beds: [['wind', .08]], ev: [['baa', 7, 16], ['howl', 18, 36], ['crickets', 1.5, 4]] },
      coke: { beds: [], ev: [['birds', 2, 5], ['fizz', 1, 3]] },
      bear: { beds: [['stream']], ev: [['birds', 1.5, 4]] },
      donkey: { beds: [['rain'], ['wind', .08]], ev: [['thunder', 10, 22], ['hooves', 22, 40]] },
      monkey: { beds: [['wind', .03]], ev: [['birds', 2.5, 6], ['screech', 12, 26]] },
      birdie: { beds: [['sea'], ['wind', .04]], ev: [['gull', 4, 10]] },
      fungus: { beds: [['dark']], ev: [['spore', 2, 5], ['crickets', 3, 6]] },
      cleanup: { beds: [['tv']], ev: [['tick', 1, 1], ['squelch', 12, 26], ['coo', 28, 50]] },
      pooman: { beds: [['stream']], ev: [['birds', 2, 5], ['bark', 9, 20]] },
      shadow: { beds: [['stream'], ['drone']], ev: [['bubbles', 5, 12]] },
      coocoo: { beds: [['fire'], ['wind', .04]], ev: [['crickets', 1, 3], ['crackle', 1, 3], ['coo', 11, 24], ['owl', 30, 50]] },
      tea: { beds: [], ev: [['tick', 1, 1], ['birds', 4, 9]] },
      freak: { beds: [['rain']], ev: [['drip', 3, 7], ['gurgle', 8, 16], ['whisper', 18, 36]] },
      yellow: { beds: [['dark']], ev: [['squelch', 9, 18], ['whisper', 7, 15], ['tick', 2, 2]] },
      rats: { beds: [['traffic']], ev: [['bell', 10, 20], ['scurry', 6, 14]] },
    };
    function stopAmb(fade = 1.2) {
      const c = ctx; if (!c || !bus) return;
      timers.forEach(clearTimeout); timers = [];
      const old = stops; stops = [];
      bus.gain.cancelScheduledValues(c.currentTime); bus.gain.setValueAtTime(bus.gain.value, c.currentTime); bus.gain.linearRampToValueAtTime(0, c.currentTime + fade);
      setTimeout(() => old.forEach((s) => s()), fade * 1000 + 50);
    }
    function startAmb(key) {
      const m = MOODS[key] || MOODS.front, c = ac(); if (!c) return;
      const go = () => {
        if (ambKey !== key) return;
        // the new bus fades in after the old one has faded out
        bus = null; ambBus();
        m.beds.forEach(([n, v]) => BED[n](v));
        bus.gain.setValueAtTime(0, c.currentTime); bus.gain.linearRampToValueAtTime(.9, c.currentTime + 2.5);
        m.ev.forEach(([n, lo, hi]) => {
          const loop = () => { if (ambKey !== key) return; OUT = bus; EV[n](c.currentTime + .05); OUT = null; timers.push(setTimeout(loop, R(lo, hi) * 1000)); };
          timers.push(setTimeout(loop, R(Math.min(lo, 2), lo) * 1000));
        });
      };
      setTimeout(go, bus ? 1250 : 0);
    }
    return {
      get on() { return on; },
      get mode() { return mode3; },
      // 0 = sounds + ambience, 1 = sounds only, 2 = silent
      cycle() { mode3 = (mode3 + 1) % 3; on = mode3 < 2; store.set('dt-sndmode', mode3); store.set('dt-sound', on ? 'on' : 'off'); const k = ambKey; ambKey = null; if (mode3 === 0) this.ambience(k || 'front'); else stopAmb(.5); if (on) this.play('click'); return mode3; },
      ambience(key) { if (mode3 !== 0 || !ctx) { ambKey = key; return; } if (key === ambKey) return; stopAmb(); ambKey = key; startAmb(key); },
      pause(p) { if (!ctx) return; p ? ctx.suspend() : ctx.resume(); },
      play(name) { if (!on) return; const c = ac(); if (!c || !S[name]) return; S[name].call(S, c.currentTime + .02); },
      unlock() { const c = ac(); if (c && !this._u) { this._u = 1; if (mode3 === 0 && ambKey) { const k = ambKey; ambKey = null; setTimeout(() => this.ambience(k), 50); } try { const s = c.createBufferSource(); s.buffer = c.createBuffer(1, 1, 22050); s.connect(c.destination); s.start(0); } catch (e) {} } },
    };
  })();

  const firstTouch = () => { Snd.unlock(); removeEventListener('pointerdown', firstTouch, true); removeEventListener('touchend', firstTouch, true); };
  addEventListener('pointerdown', firstTouch, true); addEventListener('touchend', firstTouch, true);
  if (/iP(hone|ad|od)|Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS|Edg/.test(navigator.userAgent)) document.documentElement.classList.add('safari');
  if (/gamesdevni|github\.io/.test(location.hostname)) document.documentElement.classList.add('onsite');

  /* ------------------------------------------------------------ pages */
  const pages = [];
  const keys = Scenes.ORDER;
  const add = (p) => { pages.push(p); return pages.length - 1; };

  const medal = (seedN) => {
    Art.seed(seedN);
    return `<svg class="medal" viewBox="0 0 180 180"><circle cx="90" cy="90" r="80" fill="#1f2448"/><g filter="url(#wc)">${Art.moon(112, 70, 18, '#1f2448')}<path d="M10,120Q50,96 90,112T170,110V180H10Z" fill="#3a3a6a"/><path d="M10,138Q60,122 100,134T170,130V180H10Z" fill="#2a2e50"/>${Art.pine(46, 140, 46, '#1a2a24')}${Art.pine(140, 142, 38, '#1a2a24')}</g>${Art.stars(14, 90, seedN)}<circle cx="90" cy="90" r="80" fill="none" stroke="#d9a441" stroke-width="3"/><circle cx="90" cy="90" r="86" fill="none" stroke="#b08850" stroke-width="1"/></svg>`;
  };

  function frontMatter() {
    add({ type: 'cover' });
    add({ type: 'endpaper' });
    add({ type: 'dedication' });
    add({ type: 'howto' });
    add({ type: 'toc' });
  }

  // Lay out a story's text across as many pages as it needs.
  const mBody = $('#measure .tbody');
  const fits = () => mBody.scrollHeight <= mBody.clientHeight + 1;
  function paginate(story, idx) {
    const out = [];
    const head = `<div class="ttl"><div class="kicker">${idx < 23 ? 'Tale the ' + ORD[idx] : 'Book Two · Tale the First'}</div><h2>${typeset(story.title)}</h2><div class="rule"><span></span></div></div>`;
    const paras = story.paras.map((p) => typeset(p));
    let html = head, first = true, i = 0, contRest = null;
    mBody.innerHTML = html;
    const flush = () => { out.push(mBody.innerHTML); mBody.innerHTML = ''; };
    while (i < paras.length || contRest) {
      let text, cls;
      if (contRest) { text = contRest; cls = 'cont'; contRest = null; }
      else { text = paras[i++]; cls = first ? 'first' : ''; first = false; }
      const p = document.createElement('p'); if (cls) p.className = cls; p.innerHTML = text; mBody.appendChild(p);
      if (fits()) continue;
      // Too long: split the paragraph at the last word that fits.
      const words = text.split(' ');
      let lo = 0, hi = words.length;
      while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); p.innerHTML = words.slice(0, mid).join(' '); if (fits()) lo = mid; else hi = mid - 1; }
      if (lo < 3) { p.remove(); flush(); contRest = text; if (cls === 'first') { contRest = null; i--; first = true; } continue; }
      p.innerHTML = words.slice(0, lo).join(' ');
      p.style.textAlignLast = 'justify';
      flush();
      contRest = words.slice(lo).join(' ');
    }
    // Finish with a fleuron if it fits on the last page.
    const f = document.createElement('div'); f.className = 'fin'; f.textContent = '❦'; mBody.appendChild(f);
    if (!fits()) f.remove();
    flush();
    if (out[out.length - 1].replace(/<div class="fin">.*?<\/div>/, '').trim() === '') out.pop();
    return out;
  }
  const ORD = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth', 'Twentieth', 'Twenty-first', 'Twenty-second', 'Twenty-third', 'Twenty-fourth'];

  const tocEntries = [];
  function buildPages() {
    pages.length = 0; tocEntries.length = 0;
    frontMatter();
    STORIES.forEach((st, i) => {
      if (i === 23) { // Book Two starts on a right-hand page
        if (pages.length % 2 === 1) add({ type: 'filler', next: 'Book Two', seed: 99 });
        add({ type: 'booktwo' });
        tocEntries.push({ book: true });
      }
      if (pages.length % 2 === 0) add({ type: 'filler', next: st.title, seed: i + 3 });
      const at = add({ type: 'scene', key: keys[i], title: st.title, n: i });
      tocEntries.push({ title: st.title, page: at });
      const texts = paginate(st, i);
      texts.forEach((h, k) => add({ type: 'text', html: h, title: st.title, first: k === 0, key: keys[i] }));
    });
    if (pages.length % 2 === 0) add({ type: 'blank' });
    add({ type: 'end' });
    if (pages.length % 2 === 0) add({ type: 'endpaper2' });
    add({ type: 'back' });
    mBody.innerHTML = '';
  }

  /* ------------------------------------------------------------ page renderers */
  const corner = (rot) => `<svg class="corner" viewBox="0 0 44 44" style="transform:rotate(${rot}deg)"><path d="M4,40V12Q4,4 12,4H40M10,40V16Q10,10 16,10H40" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="16" cy="16" r="3" fill="currentColor"/><path d="M22,16q8,-8 14,0M16,22q-8,8 0,14" stroke="currentColor" fill="none"/></svg>`;
  const endpaperSVG = () => {
    let o = '<svg viewBox="0 0 440 640">'; Art.seed(31);
    for (let y = 20; y < 660; y += 70) for (let x = 20 + ((y / 70) % 2) * 40; x < 460; x += 80) {
      const k = Math.floor(Art.rnd() * 4);
      o += `<g transform="translate(${x},${y})" opacity=".55">` + [
        `<path d="M8,-10a12,12 0 1 0 0,20a9,9 0 1 1 0,-20Z" fill="#d9a441"/>`,
        `<circle cx="-5" cy="0" r="3.5" fill="#f3d488"/><circle cx="5" cy="0" r="3.5" fill="#f3d488"/><circle cx="-5" cy="0" r="1.2" fill="#24305a"/><circle cx="5" cy="0" r="1.2" fill="#24305a"/>`,
        `<path d="M0,-10l2.5,7h7l-5.5,4.5l2,7l-6,-4.5l-6,4.5l2,-7l-5.5,-4.5h7Z" fill="#d9a441"/>`,
        `<path d="M-9,4q9,-18 18,0Z" fill="#c98a5a"/><rect x="-2.5" y="4" width="5" height="8" fill="#f3d488"/>`][k] + '</g>';
    }
    return o + '</svg>';
  };

  function renderScene(key, opts = {}) {
    const sc = Scenes.S[key]();
    let clip = '';
    if (!opts.noFrame) { // ragged torn-paper edge, the same every time for a given scene
      Art.seed(key.length * 7 + key.charCodeAt(0)); const pts = [], j = () => Art.rr(4, 11), step = 9;
      for (let x = 0; x <= 400; x += step) pts.push(`${Math.min(x, 400)}px ${j()}px`);
      for (let y = step; y <= 500; y += step) pts.push(`${400 - j()}px ${Math.min(y, 500)}px`);
      for (let x = 400 - step; x >= 0; x -= step) pts.push(`${x}px ${500 - j()}px`);
      for (let y = 500 - step; y > 0; y -= step) pts.push(`${j()}px ${y}px`);
      const poly = `polygon(${pts.join(',')})`; clip = ` style="clip-path:${poly};-webkit-clip-path:${poly}"`;
    }
    let html = `<div class="scene sc-${key}${opts.noFrame ? ' noframe' : ''}" data-key="${key}"${clip}>`;
    let i = 0;
    sc.layers.forEach((L) => {
      if (L.kind === 'pop') { i++; html += `<div class="lw" data-depth="${i}"><div class="layer pop" style="--i:${i};transform-origin:50% ${(L.base / 500) * 100}%">${L.svg}</div></div>`; }
      else html += `<div class="lw" data-depth="${L.kind === 'fx' ? i + 1 : 0}"><div class="layer ${L.kind}">${L.svg}</div></div>`;
    });
    html += '</div>';
    return { html, sc };
  }

  const R = {
    cover: () => `<div class="page cover"><div class="gilt"></div><div style="position:absolute;left:22px;top:22px">${corner(0)}</div><div style="position:absolute;right:22px;top:22px">${corner(90)}</div><div style="position:absolute;right:22px;bottom:22px">${corner(180)}</div><div style="position:absolute;left:22px;bottom:22px">${corner(270)}</div>
      <h1>Daddy’s Tales</h1><div class="sub">Stories for Aaron &amp; Connor</div>
      <div class="window">${renderScene('cover', { noFrame: true }).html}</div>
      <div class="by">by their Daddy, James Bell</div><div class="open">tap to open</div></div>`,
    endpaper: () => `<div class="page endpaper">${endpaperSVG()}</div>`,
    endpaper2: () => `<div class="page endpaper">${endpaperSVG()}</div>`,
    blank: () => `<div class="page"></div>`,
    dedication: () => `<div class="page"><div class="mid ded"><h3>Dedicated to</h3><div class="names">Aaron Bell<em>&amp;</em>Connor Bell</div><div class="rule" style="margin-top:22px"><span></span></div><p>My boys. I wrote these tales for you as you grew up, at bedtimes and on long days out. Every word in them is your Daddy’s own.</p><div class="sign">Love, Daddy</div></div></div>`,
    howto: () => `<div class="page"><div class="mid howto"><h3>How to Read This Book</h3><div class="rule"><span></span></div><ul>
      <li><svg viewBox="0 0 46 46"><path d="M8,6H34V40H8Z" fill="#f6ecd2" stroke="#8a6a48"/><path d="M34,28L24,40H34Z" fill="#d9c69a" stroke="#8a6a48"/><path d="M14,14h14M14,20h14M14,26h9" stroke="#b8946a"/></svg><span>Tap the right-hand page, or swipe, to turn over. Tap the left page to go back.</span></li>
      <li><svg viewBox="0 0 46 46"><rect x="3" y="21" width="40" height="5" rx="2.5" fill="#3a2414"/><rect x="10" y="15" width="28" height="17" rx="8" fill="#f2e4bc" stroke="#8a6a48"/><circle cx="17" cy="23.5" r="4.5" fill="#d9a441"/></svg><span>Every picture has a <i>pull-tab</i>. Pull it, or tap the picture, and something happens.</span></li>
      <li><svg viewBox="0 0 46 46"><circle cx="23" cy="23" r="19" fill="#4a2610" stroke="#d9a441" stroke-width="2"/><text x="23" y="30" text-anchor="middle" font-size="20" fill="#f6dfa8">♫</text></svg><span>Turn your sound up for knocks, burps, coo coos and creaks.</span></li>
      </ul><div class="warn">Some of these tales are scary. Best read with the big light on.</div></div></div>`,
    toc: () => `<div class="page"><div class="toc"><h3>Contents</h3><div class="rule"><span></span></div><ol>${tocEntries.map((e) => e.book ? `<li class="bk">— Book Two —</li>` : `<li data-go="${e.page}"><span>${typeset(e.title)}</span><span class="d"></span><span>${e.page}</span></li>`).join('')}</ol></div></div>`,
    filler: (p) => `<div class="page filler"><div class="mid">${medal(p.seed)}<div class="next">Turn the page for</div><div class="nt">${typeset(p.next)}</div></div></div>`,
    booktwo: () => `<div class="page booktwo"><div class="mid">${medal(77)}<div class="next" style="margin-top:26px">Daddy’s Tales</div><div class="big">Book Two</div></div></div>`,
    scene: (p) => { const { html, sc } = renderScene(p.key); p.tab = sc.tab; p.css = sc.css;
      return `<div class="page">${html}<div class="caption"><small>Tale the ${p.n < 23 ? ORD[p.n] : 'First, Book Two'}</small>${typeset(p.title)}</div>${sc.tab ? `<div class="tab" role="button" tabindex="0" aria-label="${sc.tab.label}"><div class="slot"></div><div class="knob"><i></i><b>${sc.tab.label}</b></div></div>` : ''}</div>`; },
    text: (p, idx) => `<div class="page">${p.first ? '' : `<div class="runhead">${idx % 2 ? 'Daddy’s Tales' : typeset(p.title)}</div>`}<div class="tbody">${p.html}</div><div class="folio">${idx}</div></div>`,
    end: () => { const { html } = renderScene('end'); return `<div class="page endp">${html}<div class="big">The End</div><div class="night">Night night, Aaron and Connor.</div></div>`; },
    back: () => `<div class="page cover backc"><div class="gilt"></div><div class="blurb"><b>Daddy’s Tales</b>Twenty-four tales of wee men, butter lickers, weresheep and one very brave coo coo bird.<br><br>Written for Aaron &amp; Connor Bell by their Daddy.</div><div class="small">Free to read<br><br>Every picture &amp; sound is drawn in code</div></div>`,
  };

  /* ------------------------------------------------------------ book DOM */
  const book = $('#book'), box = $('#bookbox');
  let mode = null, sheets = [], turned = 0, scale = 1, busy = 0;
  const injected = new Set();

  function pageEl(i) {
    const p = pages[i]; if (!p) return '<div class="page"></div>';
    return (R[p.type] || R.blank)(p, i);
  }
  function makeSheets() {
    book.querySelectorAll('.sheet').forEach((s) => s.remove());
    sheets = [];
    const n = mode === 'spread' ? Math.ceil(pages.length / 2) : pages.length;
    for (let k = 0; k < n; k++) {
      const el = document.createElement('div'); el.className = 'sheet';
      el.style.width = PW + 'px'; el.style.height = PH + 'px'; el.style.left = (mode === 'spread' ? PW : 0) + 'px';
      el.innerHTML = `<div class="face front"></div><div class="face back"></div>`;
      const front = mode === 'spread' ? 2 * k : k, back = mode === 'spread' ? 2 * k + 1 : -1;
      sheets.push({ el, front, back, frontEl: el.children[0], backEl: el.children[1], rendered: { f: false, b: false } });
      book.appendChild(el);
    }
  }
  function renderFace(s, side) {
    const idx = side === 'f' ? s.front : s.back, el = side === 'f' ? s.frontEl : s.backEl;
    if (s.rendered[side]) return;
    s.rendered[side] = true;
    if (idx < 0 || idx >= pages.length) { el.innerHTML = '<div class="page"></div>'; return; }
    el.innerHTML = pageEl(idx);
    const p = pages[idx];
    if (p.css && !injected.has(p.key)) { injected.add(p.key); const st = document.createElement('style'); st.textContent = p.css; document.head.appendChild(st); }
    if (side === 'f' && (p.type === 'text' || p.type === 'scene' || p.type === 'filler' || p.type === 'booktwo' || p.type === 'toc' || p.type === 'dedication' || p.type === 'howto') && idx < pages.length - 2) el.firstElementChild.insertAdjacentHTML('beforeend', '<div class="curl"></div>');
    wirePage(el, idx);
  }
  function unrenderFace(s, side) { if (!s.rendered[side]) return; s.rendered[side] = false; (side === 'f' ? s.frontEl : s.backEl).innerHTML = ''; }

  function visiblePages(t = turned) {
    if (mode === 'spread') return [2 * t - 1, 2 * t].filter((i) => i >= 0 && i < pages.length);
    return [t];
  }
  function refreshWindow() {
    const vis = visiblePages();
    const lo = Math.min(...vis) - 4, hi = Math.max(...vis) + 4;
    sheets.forEach((s) => {
      for (const side of ['f', 'b']) {
        const idx = side === 'f' ? s.front : s.back;
        if (side === 'b' && mode === 'single') { if (!s.rendered.b) { s.backEl.innerHTML = '<div class="page"></div>'; s.rendered.b = true; } continue; }
        if (idx >= lo && idx <= hi) renderFace(s, side);
        else if (idx < lo - 6 || idx > hi + 6) unrenderFace(s, side);
      }
    });
  }
  function faceOf(idx) {
    for (const s of sheets) { if (s.front === idx) return s.frontEl; if (s.back === idx) return s.backEl; }
    return null;
  }
  // Pop the scenes on the pages now showing; fold the rest flat and reset their tabs.
  function popScenes(delay = 0) {
    const vis = visiblePages();
    sheets.forEach((s) => [[s.front, s.frontEl], [s.back, s.backEl]].forEach(([idx, el]) => {
      const pg = el.querySelector('.page'); if (!pg) return;
      const isVis = vis.includes(idx);
      pg.classList.toggle('vis', isVis);
      el.querySelectorAll('.scene').forEach((sc) => {
        if (isVis) { if (!sc.classList.contains('up')) setTimeout(() => { sc.classList.add('up'); if (pages[idx] && pages[idx].type !== 'cover') Snd.play('pop'); }, delay); }
        else { sc.classList.remove('up', 'on', 'late'); const t = el.querySelector('.tab'); if (t) t.classList.remove('pulled'); }
      });
    }));
  }

  function layout(anim) {
    const N = sheets.length;
    sheets.forEach((s, i) => {
      const t = i < turned;
      s.el.classList.toggle('turned', t);
      if (!s.el.classList.contains('flipping')) { s.el.style.zIndex = t ? i + 1 : N - i + 1; s.frontEl.style.visibility = t ? 'hidden' : 'visible'; s.backEl.style.visibility = t && mode === 'spread' ? 'visible' : 'hidden'; }
      if (mode === 'single') s.el.classList.toggle('gone', t && !s.el.classList.contains('flipping'));
    });
    // Centre the closed book on its cover (or back cover).
    let shift = 0;
    if (mode === 'spread') { if (turned === 0) shift = -PW / 2; else if (turned === N) shift = PW / 2; }
    book.style.translate = `${shift * scale}px 0`;
    const sh = book.querySelector('.shadow');
    if (mode === 'spread') { sh.style.left = (turned === 0 ? PW : 0) + 'px'; sh.style.right = (turned === N ? PW : 0) + 'px'; }
    else { sh.style.left = '0'; sh.style.right = '0'; }
    updateBar();
  }

  function turnTo(target, opts = {}) {
    target = Math.max(0, Math.min(sheets.length, target));
    if (target === turned) return;
    Snd.unlock();
    const dir = target > turned ? 1 : -1, steps = Math.abs(target - turned);
    const gap = steps > 1 ? Math.min(90, 600 / steps) : 0;
    const from = turned;
    // Pre-render everything we will flip past or land on.
    const save = turned; turned = target; refreshWindow(); turned = save;
    for (let k = 0; k < steps; k++) {
      const i = dir > 0 ? from + k : from - k - 1;
      const s = sheets[i];
      renderFace(s, 'f'); if (mode === 'spread') renderFace(s, 'b');
      setTimeout(() => {
        s.el.classList.add('flipping', dir > 0 ? 'flipF' : 'flipB');
        s.el.classList.remove('gone');
        s.el.style.zIndex = 1000 + (dir > 0 ? k : steps - k);
        s.frontEl.style.visibility = dir > 0 ? 'visible' : 'hidden'; s.backEl.style.visibility = dir > 0 ? 'hidden' : 'visible';
        setTimeout(() => { s.frontEl.style.visibility = dir > 0 ? 'hidden' : 'visible'; s.backEl.style.visibility = dir > 0 ? 'visible' : 'hidden'; }, FLIP_MS / 2);
        requestAnimationFrame(() => { s.el.classList.toggle('turned', dir > 0); });
        busy++;
        setTimeout(() => { s.el.classList.remove('flipping', 'flipF', 'flipB'); busy--; layout(); }, FLIP_MS + 30);
      }, k * gap);
    }
    if (steps < 4) Snd.play('flip'); else { for (let k = 0; k < Math.min(steps, 6); k++) setTimeout(() => Snd.play('flip'), k * 110); }
    turned = target;
    store.set('dt-page', String(currentPage()));
    // Book recentres at the same time as the page turns.
    setTimeout(() => layout(), 20);
    popScenes(Math.round(FLIP_MS * .55) + (steps - 1) * gap);
    setTimeout(() => refreshWindow(), FLIP_MS + steps * gap + 60);
    setTimeout(moodNow, FLIP_MS * .6);
  }
  function moodNow() {
    const v = visiblePages(); let k = 'front';
    v.forEach((i) => { const p = pages[i]; if (p && p.key) k = p.key; if (p && (p.type === 'end' || p.type === 'back' || p.type === 'endpaper2')) k = 'end'; });
    Snd.ambience(k);
  }
  const next = () => { if (busy > 2) return; turnTo(turned + 1); };
  const prev = () => { if (busy > 2) return; turnTo(turned - 1); };
  const currentPage = () => { const v = visiblePages(); return v[v.length - 1] ?? 0; };
  function goPage(i) {
    if (mode === 'spread') turnTo(i % 2 === 0 ? i / 2 : (i + 1) / 2);
    else turnTo(i);
  }

  /* ------------------------------------------------------------ page interaction */
  function wirePage(face, idx) {
    const p = pages[idx];
    face.querySelectorAll('[data-go]').forEach((li) => li.addEventListener('click', (e) => { e.stopPropagation(); goPage(+li.dataset.go); }));
    const sc = face.querySelector('.scene'), tab = face.querySelector('.tab');
    if (!sc || !p || !p.tab) return;
    const fire = () => {
      const on = !sc.classList.contains('on');
      sc.classList.toggle('on', on); sc.classList.remove('late');
      if (tab) { tab.classList.toggle('pulled', on); tab.style.setProperty('--pull', (320 - tab.querySelector('.knob').offsetWidth) + 'px'); }
      Snd.play('click');
      if (on) { Snd.play(p.tab.snd); if (p.tab.delay) setTimeout(() => { if (sc.classList.contains('on')) sc.classList.add('late'); }, p.tab.delay); }
    };
    sc.addEventListener('click', (e) => { if (dragMoved) return; e.stopPropagation(); fire(); });
    if (tab) {
      tab.addEventListener('click', (e) => { e.stopPropagation(); if (dragMoved) return; fire(); });
      tab.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
      // Drag the knob along the slot to pull it.
      let x0 = null;
      tab.addEventListener('pointerdown', (e) => { e.stopPropagation(); x0 = e.clientX; });
      tab.addEventListener('pointermove', (e) => { if (x0 === null) return; const dx = (e.clientX - x0) / scale; if (Math.abs(dx) > 26) { const want = dx > 0; x0 = null; if (want !== sc.classList.contains('on')) { dragMoved = true; fire(); setTimeout(() => (dragMoved = false), 50); } } });
      tab.addEventListener('pointerup', () => (x0 = null));
    }
    // Gentle parallax as the pointer moves over the picture.
    sc.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = sc.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      sc.querySelectorAll('.lw').forEach((w) => { const d = +w.dataset.depth; w.style.transform = `translate(${-px * d * 4}px,${-py * d * 2}px)`; });
    });
    sc.addEventListener('pointerleave', () => sc.querySelectorAll('.lw').forEach((w) => (w.style.transform = '')));
  }

  // Tap or click a page to turn; swipe on phones.
  let dragMoved = false, sx = null, sy = null;
  const stage = $('#stage');
  stage.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; dragMoved = false; });
  stage.addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) { dragMoved = true; setTimeout(() => (dragMoved = false), 60); dx < 0 ? next() : prev(); }
  });
  stage.addEventListener('click', (e) => {
    if (dragMoved) return;
    const r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
    if (e.clientY < r.top || e.clientY > r.bottom) return;
    if (mode === 'spread') { if (turned === 0) next(); else if (turned === sheets.length) prev(); else x > .5 ? next() : prev(); }
    else { x > .35 ? next() : prev(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') next();
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev();
    else if (e.key === 'Home') turnTo(0);
    else if (e.key === 'End') turnTo(sheets.length);
  });
  $('#next').onclick = next; $('#prev').onclick = prev;
  $('#tocb').onclick = () => goPage(4);
  const sndBtn = $('#snd');
  const SNDLBL = ['Spooky sounds and ambience on', 'Sound effects only', 'Sound off'];
  const paintSnd = () => { const m = Snd.mode; sndBtn.style.opacity = m === 2 ? .45 : 1; sndBtn.innerHTML = m === 0 ? '&#9835;' : m === 1 ? '&#9834;' : '&#9834;<s style="position:absolute;left:9px;right:9px;top:50%;height:2px;background:#f6dfa8;transform:rotate(-40deg)"></s>'; sndBtn.title = SNDLBL[m]; sndBtn.setAttribute('aria-label', SNDLBL[m]); };
  sndBtn.onclick = (e) => { e.stopPropagation(); Snd.unlock(); Snd.cycle(); paintSnd(); const h = $('#hint'); h.textContent = SNDLBL[Snd.mode]; h.classList.add('show'); clearTimeout(h._t); h._t = setTimeout(() => h.classList.remove('show'), 1800); };
  document.addEventListener('visibilitychange', () => Snd.pause(document.hidden));
  paintSnd();

  function updateBar() {
    $('#prev').disabled = turned === 0;
    $('#next').disabled = turned >= sheets.length;
    const v = visiblePages();
    const p = pages[v[v.length - 1]];
    let label = '';
    if (turned === 0) label = 'Cover';
    else if (turned >= sheets.length) label = 'Back cover';
    else label = mode === 'spread' ? `${v[0]}–${v[v.length - 1]}` : `${v[0]}`;
    $('#pg').textContent = label + (p && p.type !== 'cover' ? '' : '');
  }

  /* ------------------------------------------------------------ fit to screen */
  function fit(first) {
    const barH = $('#bar').offsetHeight || 64;
    $('#stage').style.bottom = barH + 'px';
    const sr = $('#stage').getBoundingClientRect(), vw = sr.width || innerWidth, vh = sr.height || innerHeight - barH;
    const spreadScale = Math.min((vw - 24) / (PW * 2), (vh - 24) / PH);
    const newMode = vw / vh > 1.05 && spreadScale >= .6 ? 'spread' : 'single';
    const bw = newMode === 'spread' ? PW * 2 : PW;
    scale = Math.min((vw - 24) / bw, (vh - 24) / PH);
    box.style.width = bw * scale + 'px'; box.style.height = PH * scale + 'px';
    book.style.width = bw + 'px'; book.style.height = PH + 'px';
    book.style.transform = `scale(${scale})`;
    document.body.classList.toggle('single', newMode === 'single');
    if (newMode !== mode) {
      const keep = first ? +(store.get('dt-page') || 0) : currentPage();
      mode = newMode; makeSheets();
      turned = mode === 'spread' ? (keep % 2 === 0 ? keep / 2 : (keep + 1) / 2) : keep;
      turned = Math.max(0, Math.min(sheets.length, turned));
      refreshWindow(); layout(); popScenes(first ? 500 : 50); moodNow();
    } else layout();
  }
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => fit(false), 120); });

  /* ------------------------------------------------------------ start */
  const fontsReady = Promise.all(['17.5px "EB Garamond"', 'italic 17.5px "EB Garamond"', '31px "IM Fell English"', '13px "IM Fell English SC"'].map((f) => document.fonts.load(f))).catch(() => {});
  fontsReady.then(() => document.fonts.ready).then(() => {
    buildPages();
    fit(true);
    const h = $('#hint');
    h.textContent = mode === 'spread' ? 'Click the book or press → to turn the page' : 'Tap the page or swipe to turn';
    h.classList.add('show'); setTimeout(() => h.classList.remove('show'), 4200);
    window.__book = { snd: Snd, pages, goPage, turnTo, get turned() { return turned; }, get mode() { return mode; } };
  });
})();
