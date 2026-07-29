(function () {
  "use strict";

  var TELEGRAM_USERNAME = "MilenaLagutkina";

  /* Mobile nav */
  var navToggle = document.querySelector(".nav-toggle");
  var navMain = document.querySelector(".nav-main");
  if (navToggle && navMain) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMain.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    navMain.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMain.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Footer year */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ------------------------------------------------------------------
     Booking modal
     Since the site has no payment/booking backend yet, submitting the
     form opens a prefilled Telegram chat with Milena so the request is
     delivered immediately. See README for how to wire up a real backend
     later.
     ------------------------------------------------------------------ */
  var modalOverlay = document.querySelector("[data-modal='booking']");
  var modalForm = modalOverlay ? modalOverlay.querySelector("form") : null;
  var modalSuccess = modalOverlay ? modalOverlay.querySelector(".form-success") : null;
  var modalTitle = modalOverlay ? modalOverlay.querySelector("[data-modal-title]") : null;
  var modalServiceField = modalOverlay ? modalOverlay.querySelector("[name='service']") : null;
  var lastFocused = null;

  function openModal(presetService) {
    if (!modalOverlay) return;
    lastFocused = document.activeElement;
    modalOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (modalForm) modalForm.style.display = "";
    if (modalSuccess) modalSuccess.classList.remove("is-visible");
    if (presetService && modalServiceField) {
      modalServiceField.value = presetService;
    }
    var firstInput = modalOverlay.querySelector("input, select, textarea");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-open-booking]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.getAttribute("data-open-booking") || "");
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
    modalOverlay.querySelectorAll("[data-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) closeModal();
    });
  }

  /* Any booking form on the page (modal or inline on Contacts) shares
     this submit behaviour: build a prefilled Telegram message and open it. */
  document.querySelectorAll("form.js-booking-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var contact = (data.get("contact") || "").toString().trim();
      var service = (data.get("service") || "").toString().trim();
      var time = (data.get("time") || "").toString().trim();
      var comment = (data.get("comment") || "").toString().trim();

      var lines = ["Здравствуйте, Милена! Хочу записаться."];
      if (service) lines.push("Услуга: " + service);
      if (name) lines.push("Имя: " + name);
      if (contact) lines.push("Контакт: " + contact);
      if (time) lines.push("Удобное время: " + time);
      if (comment) lines.push("Комментарий: " + comment);

      var text = encodeURIComponent(lines.join("\n"));
      var tgUrl = "https://t.me/" + TELEGRAM_USERNAME + "?text=" + text;

      window.open(tgUrl, "_blank", "noopener");

      var wrap = form.closest(".booking-form-wrap") || form.parentElement;
      var success = wrap ? wrap.querySelector(".form-success") : null;
      form.style.display = "none";
      if (success) success.classList.add("is-visible");
      form.reset();
    });
  });

  /* Buy-a-guide buttons build their own prefilled Telegram message */
  document.querySelectorAll("[data-buy-guide]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var title = btn.getAttribute("data-buy-guide");
      var text = encodeURIComponent(
        "Здравствуйте, Милена! Хочу приобрести методичку «" + title + "»."
      );
      window.open("https://t.me/" + TELEGRAM_USERNAME + "?text=" + text, "_blank", "noopener");
    });
  });
})();
