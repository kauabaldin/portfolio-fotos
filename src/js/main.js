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

// Solicita o nome do visitante e o guarda para os próximos contatos.
function getVisitorName(askIfMissing = true) {
  try {
    const stored = localStorage.getItem("visitorName");
    if (stored && stored.trim()) return stored;
  } catch (e) {}

  if (!askIfMissing) return "";

  const name = window.prompt(
    "Olá! Qual é o seu nome?",
  );

  if (name && name.trim()) {
    const visitorName = name.trim();

    try {
      localStorage.setItem("visitorName", visitorName);
    } catch (e) {}

    return visitorName;
  }

  return "";
}

document.addEventListener("DOMContentLoaded", () => {
  getVisitorName();

  document.querySelectorAll(".whatsapp-contact").forEach((el) => {
    el.addEventListener("click", (ev) => {
      ev.preventDefault();

      const phone = el.getAttribute("data-phone") || "5554991940138";
      const name = getVisitorName();
      const text = name
        ? `Oii, sou ${name} e gostaria de saber mais informações.`
        : "Oii, gostaria de saber mais informações.";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

      window.open(url, "_blank", "noopener,noreferrer");
    });
  });
});
