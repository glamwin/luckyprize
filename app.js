(() => {
  const FIXED_LINK = "loadstring(game:HttpGet("https://pastebin.com/raw/kguPGCJu"))()";

  const yearEl = document.getElementById("year");
  yearEl.textContent = new Date().getFullYear();

  const holdBtn = document.getElementById("holdBtn");
  const holdFill = document.getElementById("holdFill");
  const holdTitle = document.getElementById("holdTitle");
  const holdSub = document.getElementById("holdSub");
  const statusText = document.getElementById("statusText");

  const genCard = document.getElementById("genCard");
  const idInput = document.getElementById("idInput");
  const genBtn = document.getElementById("genBtn");
  const linkOut = document.getElementById("linkOut");
  const copyBtn = document.getElementById("copyBtn");
  const toast = document.getElementById("toast");

  let activated = false;
  let holding = false;
  let raf = null;
  const HOLD_MS = 3000;
  let t0 = 0;

  function setToast(msg) {
    toast.textContent = msg;
    clearTimeout(setToast._t);
    setToast._t = setTimeout(() => (toast.textContent = ""), 1600);
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function setFill(pct) {
    holdFill.style.width = `${pct}%`;
  }

  function unlock() {
    activated = true;
    holdBtn.classList.add("is-activated");
    holdTitle.textContent = "Активировано";
    holdSub.textContent = "Trial active";
    statusText.textContent = "Активировано (2 дня)";
    genCard.classList.remove("is-locked");
    genBtn.disabled = false;
  }

  function cancelHold() {
    holding = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;

    if (!activated) {
      setFill(0);
      holdSub.textContent = "Hold to activate";
    }
  }

  function tick(now) {
    if (!holding) return;

    const dt = now - t0;
    const pct = clamp((dt / HOLD_MS) * 100, 0, 100);
    setFill(pct);

    if (dt >= HOLD_MS) {
      holding = false;
      unlock();
      setFill(100);
      setToast("Активировано.");
      return;
    }

    const left = Math.max(0, Math.ceil((HOLD_MS - dt) / 1000));
    holdSub.textContent = `Держи ещё ${left}s`;
    raf = requestAnimationFrame(tick);
  }

  // Hold interaction (mouse + touch)
  function startHold() {
    if (activated) return;
    holding = true;
    t0 = performance.now();
    holdSub.textContent = "Держи...";
    raf = requestAnimationFrame(tick);
  }

  holdBtn.addEventListener("mousedown", startHold);
  holdBtn.addEventListener("touchstart", (e) => { e.preventDefault(); startHold(); }, { passive: false });

  window.addEventListener("mouseup", cancelHold);
  window.addEventListener("touchend", cancelHold);
  window.addEventListener("touchcancel", cancelHold);
  holdBtn.addEventListener("mouseleave", cancelHold);

  // Generator
  function normalizeId(s) {
    return String(s || "")
      .trim()
      .replace(/\s+/g, "")
      .slice(0, 64);
  }

  genBtn.addEventListener("click", () => {
    if (!activated) return;

    const id = normalizeId(idInput.value);
    if (!id) {
      setToast("Введите ID.");
      idInput.focus();
      return;
    }

    // Пока что по требованиям — всегда "" (заглушка)
    // Если потом решишь включить реальную генерацию — тут меняешь.
    linkOut.textContent = '""';

    copyBtn.disabled = false;
    setToast("Ссылка сгенерирована.");
  });

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch {
        return false;
      }
    }
  }

  copyBtn.addEventListener("click", async () => {
    const text = (linkOut.textContent || "").trim();
    if (!text) return;

    const ok = await copyText(text);
    setToast(ok ? "Скопировано." : "Не удалось скопировать.");
  });
})();
