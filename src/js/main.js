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

const visitorDialog = document.querySelector(".visitor-dialog");
const visitorForm = document.querySelector(".visitor-form");
const visitorNameInput = document.querySelector("#visitor-name");
const visitorError = document.querySelector(".visitor-error");
let pendingContact = null;

function getStoredVisitorName() {
  try {
    const stored = localStorage.getItem("visitorName");
    if (stored && stored.trim()) return stored;
  } catch (e) {}

  return "";
}

function saveVisitorName(name) {
  try {
    localStorage.setItem("visitorName", name);
  } catch (e) {}
}

function openNameDialog(contact = null) {
  pendingContact = contact;
  visitorError.textContent = "";

  if (!visitorDialog.open) {
    visitorDialog.showModal();
  }

  requestAnimationFrame(() => visitorNameInput.focus());
}

function openWhatsApp(contact, name) {
  const phone = contact.getAttribute("data-phone") || "5554991940138";
  const text = `Oii, sou ${name}! Vim pelo site do seu portfólio e gostaria de saber mais informações sobre os seus serviços.`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".whatsapp-contact").forEach((el) => {
    el.addEventListener("click", (ev) => {
      ev.preventDefault();

      const name = getStoredVisitorName();

      if (name) {
        openWhatsApp(el, name);
        return;
      }

      openNameDialog(el);
    });
  });

  visitorForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = visitorNameInput.value.trim();

    if (!name) {
      visitorError.textContent = "Digite seu nome para continuar.";
      visitorNameInput.focus();
      return;
    }

    saveVisitorName(name);
    visitorDialog.close();

    if (pendingContact) {
      openWhatsApp(pendingContact, name);
      pendingContact = null;
    }
  });

  if (!getStoredVisitorName()) {
    openNameDialog();
  }
});
