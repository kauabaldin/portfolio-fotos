// phone-loader.js
// Loads private phone numbers from /private/phone.json (gitignored)
// Expected structure: { "whatsapp": "+5554991940138" }

document.addEventListener("DOMContentLoaded", async () => {
  const els = Array.from(
    document.querySelectorAll(".whatsapp-contact[data-phone-id]"),
  );
  if (!els.length) return;

  try {
    const res = await fetch("/private/phone.json", { cache: "no-store" });
    if (!res.ok) throw new Error("phone file not found");
    const data = await res.json();
    els.forEach((el) => {
      const key = el.dataset.phoneId;
      const number = data[key];
      if (!number) return;
      // set data-phone for any existing scripts that expect it
      el.dataset.phone = number;
      const digits = number.replace(/\D/g, "");
      el.href = `https://wa.me/${digits}`;
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  } catch (err) {
    // If private file doesn't exist, leave links disabled and log a warning
    // Optionally you could enable a fallback behavior here.
    // console.warn('phone-loader:', err.message);
  }
});
