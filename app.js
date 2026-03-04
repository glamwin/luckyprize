(() => {
  const copyBtn = document.getElementById("copyBtn");
  const copyTarget = document.getElementById("copyTarget");
  const toast = document.getElementById("toast");
  const year = document.getElementById("year");

  year.textContent = new Date().getFullYear();

  function setToast(msg) {
    toast.textContent = msg;
    toast.style.opacity = "1";
    clearTimeout(setToast._t);
    setToast._t = setTimeout(() => {
      toast.style.opacity = "0.9";
      toast.textContent = "";
    }, 1600);
  }

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
    const text = (copyTarget.textContent || "").trim();
    if (!text || text === '""') {
      setToast("Set your link first (edit index.html).");
      return;
    }
    const ok = await copyText(text);
    setToast(ok ? "Copied." : "Copy failed.");
  });
})();
