document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    document.addEventListener("click", function (e) {
      var link = e.target.closest("[data-lightbox]");
      if (!link) return;
      e.preventDefault();
      lightboxImg.src = link.getAttribute("href");
      lightboxImg.alt = link.getAttribute("data-caption") || "";
      lightbox.classList.add("open");
    });
    function chiudi() {
      lightbox.classList.remove("open");
      lightboxImg.removeAttribute("src");
    }
    lightbox.addEventListener("click", chiudi);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") chiudi();
    });
  }
});
