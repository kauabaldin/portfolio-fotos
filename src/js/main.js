const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".header nav");

menuButton.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

// Perguntar o nome do visitante ao carregar a página e armazenar em localStorage
function getVisitorName() {
  try {
    const stored = localStorage.getItem("visitorName");
    if (stored && stored.trim()) return stored;
  } catch (e) {}
  const name = window.prompt(
    "Olá! Como devemos chamar você? (se preferir, deixe em branco)",
  );
  if (name && name.trim()) {
    try {
      localStorage.setItem("visitorName", name.trim());
    } catch (e) {}
    return name.trim();
  }
  return "";
}

document.addEventListener("DOMContentLoaded", () => {
  // prefetch name so prompt appears once
  const _ = getVisitorName();

  document.querySelectorAll(".whatsapp-contact").forEach((el) => {
    el.addEventListener("click", (ev) => {
      ev.preventDefault();
      const phone = el.getAttribute("data-phone") || "5554991940138";
      const name = (localStorage.getItem("visitorName") || "").trim();
      const text = name
        ? `Olá, meu nome é ${name}. Gostaria de informações sobre as fotos.`
        : "Olá, gostaria de informações sobre as fotos.";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    });
  });
});
