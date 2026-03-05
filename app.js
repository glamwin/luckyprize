(() => {
  const app = document.getElementById("app");
  const FIXED_LINK = app.dataset.fixedLink || '""';

  const locked = document.getElementById("locked");
  const unlocked = document.getElementById("unlocked");

  const holdBtn = document.getElementById("holdBtn");
  const holdFill = document.getElementById("holdFill");
  const holdText = document.getElementById("holdText");
  const status = document.getElementById("status");

  const idInput = document.getElementById("idInput");
  const genBtn = document.getElementById("genBtn");
  const outWrap = document.getElementById("outWrap");
  const linkOut = document.getElementById("linkOut");

  const HOLD_MS = 3000;
  let activated = false;
  let holding = false;
  let t0 = 0;
  let raf = 0;

  function setFill(pct){ holdFill.style.width = `${pct}%`; }

  function unlock(){
    activated = true;
    locked.hidden = true;
    unlocked.hidden = false;
  }

  function stopHold(){
    if (!holding) return;
    holding = false;
    cancelAnimationFrame(raf);

    if (!activated){
      setFill(0);
      holdText.textContent = "Hold 3s to activate";
      status.textContent = "Not activated";
    }
  }

  function tick(now){
    if (!holding) return;

    const dt = now - t0;
    const pct = Math.min(100, (dt / HOLD_MS) * 100);
    setFill(pct);

    if (dt >= HOLD_MS){
      holding = false;
      setFill(100);
      status.textContent = "Activated";
      holdText.textContent = "Activated";
      unlock();
      return;
    }

    const left = Math.max(1, Math.ceil((HOLD_MS - dt) / 1000));
    holdText.textContent = `Hold ${left}s`;
    raf = requestAnimationFrame(tick);
  }

  function startHold(){
    if (activated) return;
    holding = true;
    t0 = performance.now();
    status.textContent = "Activating…";
    raf = requestAnimationFrame(tick);
  }

  holdBtn.addEventListener("mousedown", startHold);
  holdBtn.addEventListener("touchstart", (e) => { e.preventDefault(); startHold(); }, { passive:false });

  window.addEventListener("mouseup", stopHold);
  window.addEventListener("touchend", stopHold);
  window.addEventListener("touchcancel", stopHold);
  holdBtn.addEventListener("mouseleave", stopHold);

  genBtn.addEventListener("click", () => {
    if (!activated) return;
    const id = (idInput.value || "").trim();
    if (!id) {
      idInput.focus();
      return;
    }
    linkOut.textContent = FIXED_LINK;
    outWrap.hidden = false;
  });
})();


