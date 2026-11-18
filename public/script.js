/* ============================================================
   ✏️  EDIT THIS PART — everything personal lives here
   ============================================================ */
const CONFIG = {
  name: "My Love",          // her name or nickname
  from: "Your Name",        // how you sign the letter

  // Each string is one paragraph of the letter (typed out one by one)
  letter: [
    "Happy birthday to the person who makes ordinary days feel like something worth remembering.",
    "Thank you for your laugh, your patience, and the way you make me feel at home wherever we are.",
    "I don't need a special day to be grateful for you, but today I get an excuse to say it out loud: I'm so lucky it's you.",
    "Here's to another year of us. I can't wait to spend it by your side.",
  ],

  // Tap-to-reveal cards (keep each one short)
  reasons: [
    "Your laugh is my favorite sound",
    "You make the hard days lighter",
    "The way you look at me",
    "You believe in me, even when I don't",
    "Every little adventure with you",
    "You are simply you, and that's everything",
  ],

  finale: "I love you, always.",
};

/* ============================================================
   Below here is the magic ✨ (no need to touch)
   ============================================================ */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s) => document.querySelector(s);

document.querySelectorAll("[data-name]").forEach((el) => (el.textContent = CONFIG.name));
document.querySelectorAll("[data-from]").forEach((el) => (el.textContent = CONFIG.from));
document.title = `Happy Birthday, ${CONFIG.name} 💖`;

/* ---------- Heart shape helper ---------- */
function heartPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
  ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.75, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.75, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3);
  ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
  ctx.closePath();
}

function fitCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

/* ---------- Floating hearts background ---------- */
const heartsCanvas = $("#hearts");
let hctx = fitCanvas(heartsCanvas);
const HEART_COLORS = ["#ff6f91", "#ffc6d3", "#ff8fa7", "#ffd58a", "#e0436b"];
const floaters = [];
const bursts = [];

function makeFloater(initial) {
  const size = 8 + Math.random() * 18;
  return {
    x: Math.random() * innerWidth,
    y: initial ? Math.random() * innerHeight : innerHeight + size,
    size,
    speed: 0.25 + Math.random() * 0.6,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.005 + Math.random() * 0.01,
    alpha: 0.15 + Math.random() * 0.45,
    color: HEART_COLORS[(Math.random() * HEART_COLORS.length) | 0],
  };
}

const floaterCount = reduceMotion ? 8 : innerWidth < 600 ? 18 : 32;
for (let i = 0; i < floaterCount; i++) floaters.push(makeFloater(true));

function drawHearts() {
  hctx.clearRect(0, 0, innerWidth, innerHeight);

  for (const f of floaters) {
    f.y -= f.speed;
    f.sway += f.swaySpeed;
    const x = f.x + Math.sin(f.sway) * 20;
    if (f.y < -40) Object.assign(f, makeFloater(false));
    hctx.globalAlpha = f.alpha;
    hctx.fillStyle = f.color;
    heartPath(hctx, x, f.y, f.size);
    hctx.fill();
  }

  for (let i = bursts.length - 1; i >= 0; i--) {
    const b = bursts[i];
    b.x += b.vx; b.y += b.vy;
    b.vy += 0.05; b.vx *= 0.98;
    b.life -= 0.018;
    if (b.life <= 0) { bursts.splice(i, 1); continue; }
    hctx.globalAlpha = b.life;
    hctx.fillStyle = b.color;
    heartPath(hctx, b.x, b.y, b.size * (0.6 + b.life * 0.4));
    hctx.fill();
  }

  hctx.globalAlpha = 1;
  requestAnimationFrame(drawHearts);
}
requestAnimationFrame(drawHearts);

// Little heart burst wherever she taps
function heartBurst(x, y, n = 9) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
    const v = 1.5 + Math.random() * 2.5;
    bursts.push({
      x, y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 1.5,
      size: 8 + Math.random() * 10,
      life: 1,
      color: HEART_COLORS[(Math.random() * HEART_COLORS.length) | 0],
    });
  }
}
window.addEventListener("pointerdown", (e) => heartBurst(e.clientX, e.clientY, reduceMotion ? 4 : 9));

/* ---------- Confetti ---------- */
const confettiCanvas = $("#confetti");
let cctx = fitCanvas(confettiCanvas);
let confetti = [];
let confettiRunning = false;
const CONFETTI_COLORS = ["#ff6f91", "#ffd58a", "#ffc6d3", "#fff8f1", "#e0436b", "#b8a4ff"];

function launchConfetti(originX, originY) {
  const count = reduceMotion ? 40 : innerWidth < 600 ? 140 : 220;
  for (let i = 0; i < count; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const v = 7 + Math.random() * 10;
    confetti.push({
      x: originX, y: originY,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      tilt: Math.random() * Math.PI,
      heart: Math.random() < 0.25,
      color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
    });
  }
  if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(drawConfetti); }
}

function drawConfetti() {
  cctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = confetti.length - 1; i >= 0; i--) {
    const p = confetti[i];
    p.vy += 0.22; p.vx *= 0.985; p.vy *= 0.985;
    p.x += p.vx; p.y += p.vy;
    p.rot += p.vr; p.tilt += 0.08;
    if (p.y > innerHeight + 30) { confetti.splice(i, 1); continue; }

    cctx.save();
    cctx.translate(p.x, p.y);
    cctx.rotate(p.rot);
    cctx.scale(1, Math.cos(p.tilt));
    cctx.fillStyle = p.color;
    if (p.heart) { heartPath(cctx, 0, -p.w / 2, p.w * 1.4); cctx.fill(); }
    else cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    cctx.restore();
  }
  if (confetti.length) requestAnimationFrame(drawConfetti);
  else { confettiRunning = false; cctx.clearRect(0, 0, innerWidth, innerHeight); }
}

window.addEventListener("resize", () => {
  hctx = fitCanvas(heartsCanvas);
  cctx = fitCanvas(confettiCanvas);
});

/* ---------- Scene navigation ---------- */
const scenes = {
  "scene-intro": () => {},
  "scene-letter": enterLetter,
  "scene-cake": enterCake,
  "scene-reasons": enterReasons,
};

function goTo(id) {
  const current = document.querySelector(".scene.active");
  if (current) {
    current.classList.add("leaving");
    current.classList.remove("active");
    setTimeout(() => current.classList.remove("leaving"), 900);
  }
  const next = document.getElementById(id);
  next.scrollTop = 0;
  next.classList.add("active");
  scenes[id]?.();
}

document.querySelectorAll("[data-next]").forEach((btn) =>
  btn.addEventListener("click", () => goTo(btn.dataset.next))
);

/* ---------- Letter ---------- */
const envelope = $("#envelope");
const envelopeWrap = $("#envelopeWrap");
const letter = $("#letter");
const letterBody = $("#letterBody");
let typingSkip = false;
let typingDone = false;

function enterLetter() {
  envelope.classList.remove("open");
  envelopeWrap.classList.remove("opened", "gone");
  letter.classList.remove("show");
  $("#letterSign").classList.remove("show");
  $("#toCake").classList.remove("show");
  letterBody.innerHTML = "";
  typingSkip = false;
  typingDone = false;
}

envelope.addEventListener("click", () => {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  envelopeWrap.classList.add("opened");
  const r = envelope.getBoundingClientRect();
  setTimeout(() => heartBurst(r.left + r.width / 2, r.top + r.height * 0.3, 14), 500);
  setTimeout(() => {
    envelopeWrap.classList.add("gone");
    letter.classList.add("show");
    typeLetter();
  }, 1700);
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function typeLetter() {
  const caret = document.createElement("span");
  caret.className = "caret";

  for (const paragraph of CONFIG.letter) {
    const p = document.createElement("p");
    letterBody.appendChild(p);
    if (typingSkip || reduceMotion) { p.textContent = paragraph; continue; }

    const text = document.createTextNode("");
    p.append(text, caret);
    for (let i = 0; i < paragraph.length; i++) {
      if (typingSkip) { text.data = paragraph; break; }
      text.data += paragraph[i];
      const ch = paragraph[i];
      await wait(/[.,!?:;]/.test(ch) ? 260 : 28 + Math.random() * 30);
    }
    caret.remove();
    if (!typingSkip) await wait(450);
  }
  typingDone = true;
  $("#letterSign").classList.add("show");
  $("#toCake").classList.add("show");
}

// Tap the letter to skip the typing
letter.addEventListener("click", (e) => {
  if (!typingDone && !e.target.closest("button")) typingSkip = true;
});

/* ---------- Cake ---------- */
const cake = $("#cake");
const candlesEl = $("#candles");
const cakeStage = document.querySelector(".cake-stage");
let blown = false;

function enterCake() {
  blown = false;
  cakeStage.classList.remove("blown");
  $("#hbd").innerHTML = "";
  $("#toReasons").classList.remove("show");
  candlesEl.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const c = document.createElement("span");
    c.className = "candle";
    c.style.animationDelay = `${0.6 + i * 0.15}s`;
    c.innerHTML = `<span class="flame"></span><span class="smoke" style="--sx:-6px"></span><span class="smoke"></span><span class="smoke" style="--sx:10px"></span>`;
    candlesEl.appendChild(c);
  }
}

cake.addEventListener("click", () => {
  if (blown) return;
  blown = true;
  cakeStage.classList.add("blown");

  const candles = [...candlesEl.children];
  candles.forEach((c, i) => setTimeout(() => c.classList.add("out"), i * 160));

  setTimeout(() => {
    const r = cake.getBoundingClientRect();
    launchConfetti(r.left + r.width / 2, r.top + 20);
    showBirthdayText();
  }, candles.length * 160 + 300);

  setTimeout(() => $("#toReasons").classList.add("show"), 3200);
});

function showBirthdayText() {
  const hbd = $("#hbd");
  hbd.innerHTML = "";
  hbd.setAttribute("aria-hidden", "false");
  hbd.setAttribute("aria-label", `Happy Birthday, ${CONFIG.name}!`);
  let i = 0;
  const lines = [["Happy", "Birthday,"], [...`${CONFIG.name}!`.split(" ")]];
  lines.forEach((words, li) => {
    words.forEach((word, wi) => {
      const w = document.createElement("span");
      w.className = "word" + (li === 1 ? " name" : "");
      for (const ch of word) {
        const s = document.createElement("span");
        s.className = "ch";
        s.textContent = ch;
        s.style.setProperty("--i", i++);
        s.setAttribute("aria-hidden", "true");
        w.appendChild(s);
      }
      hbd.appendChild(w);
      if (wi < words.length - 1) hbd.appendChild(document.createTextNode(" "));
    });
    if (li === 0) hbd.appendChild(document.createElement("br"));
  });
}

/* ---------- Reasons ---------- */
const reasonsEl = $("#reasons");
const finale = $("#finale");

function enterReasons() {
  reasonsEl.innerHTML = "";
  finale.classList.remove("show");
  $("#finaleLine").textContent = CONFIG.finale;

  const icons = ["💗", "🌙", "✨", "🌷", "💌", "🫶", "🌸", "⭐"];
  let flipped = 0;

  CONFIG.reasons.forEach((reason, i) => {
    const li = document.createElement("li");
    li.className = "reason";
    li.style.setProperty("--i", i);
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.setAttribute("aria-label", `Reason ${i + 1}, tap to reveal`);
    li.innerHTML = `
      <div class="reason-inner">
        <div class="reason-face reason-front"><span style="--i:${i}">${icons[i % icons.length]}</span></div>
        <div class="reason-face reason-back"></div>
      </div>`;
    li.querySelector(".reason-back").textContent = reason;

    const flip = () => {
      if (li.classList.contains("flipped")) return;
      li.classList.add("flipped");
      li.setAttribute("aria-label", reason);
      if (++flipped === CONFIG.reasons.length) {
        setTimeout(() => {
          finale.classList.add("show");
          const r = finale.getBoundingClientRect();
          launchConfetti(innerWidth / 2, r.top);
        }, 700);
      }
    };
    li.addEventListener("click", flip);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
    reasonsEl.appendChild(li);
  });
}

$("#replay").addEventListener("click", () => goTo("scene-intro"));
