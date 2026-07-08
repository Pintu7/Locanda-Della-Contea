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
    lightbox.addEventListener("click", function () {
      lightbox.classList.remove("open");
      lightboxImg.src = "";
    });
  }

  var galleryGrid = document.querySelector(".gallery-grid");
  if (galleryGrid) {
    fetch("data/gallery.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var foto = data.foto || [];
        if (!foto.length) return;
        galleryGrid.innerHTML = foto.map(function (f) {
          var caption = (f.caption || "").replace(/"/g, "&quot;");
          var src = f.image;
          return '<a href="' + src + '" data-lightbox data-caption="' + caption + '">' +
                 '<img src="' + src + '" alt="' + caption + '" loading="lazy"></a>';
        }).join("");
      })
      .catch(function () { /* keep static fallback markup */ });
  }

  var nanicoCard = document.querySelector("[data-menu='nanico']");
  var elficoCard = document.querySelector("[data-menu='elfico']");
  if (nanicoCard && elficoCard) {
    fetch("data/menu.json")
      .then(function (r) { return r.json(); })
      .then(function (m) {
        fillMenuCard(nanicoCard, "Piatto Nanico", m.nanico_prezzo, m.nanico_items);
        fillMenuCard(elficoCard, "Piatto Elfico", m.elfico_prezzo, m.elfico_items);
      })
      .catch(function () { /* keep static fallback markup */ });
  }

  function fillMenuCard(card, title, prezzo, items) {
    if (!prezzo || !items) return;
    var rows = items.map(function (it) {
      var testo = typeof it === "string" ? it : (it && it.riga) || "";
      return '<div class="menu-item" style="border:none;"><div class="desc"><p>' + testo + "</p></div></div>";
    }).join("");
    card.innerHTML = "<h3>" + title + ' <span class="price" style="float:right;">' + prezzo + "</span></h3>" + rows;
  }
});
