/* global CMS, createClass, h */
/*
 * Template di anteprima per il pannello /admin. Riusano le stesse classi CSS
 * del sito vero (assets/css/style.css, caricato via registerPreviewStyle) cosi'
 * l'anteprima assomiglia davvero alle pagine pubblicate, invece del riquadro
 * grezzo di default.
 *
 * Non e' una copia 1:1: header/nav/footer del sito non compaiono (il banner
 * in cima lo ricorda), e liste/oggetti vengono letti direttamente dai dati
 * invece di passare da widgetFor, perche' vogliamo un layout su misura
 * (card con foto, griglie) e non il rendering generico dei widget.
 */
(function () {
  if (!window.CMS) return;

  CMS.registerPreviewStyle(
    "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap"
  );
  CMS.registerPreviewStyle("/assets/css/style.css");
  CMS.registerPreviewStyle("/admin/preview.css");

  // --- helper -----------------------------------------------------------

  function get(entry, path) {
    var v = entry.getIn(["data"].concat(path));
    return v && v.toJS ? v.toJS() : v;
  }

  function resolveImage(props, path) {
    if (!path) return "";
    var asset = props.getAsset(path);
    return asset ? String(asset) : path;
  }

  function note(text) {
    return h(
      "div",
      { className: "cms-preview-note" },
      "👁 Anteprima approssimativa — " + (text || "manca l'intestazione e il piè di pagina del sito vero.")
    );
  }

  function hero(props, opts) {
    var e = props.entry;
    var img = resolveImage(props, get(e, ["hero_immagine"]));
    return h(
      "section",
      {
        className: "hero page-hero",
        style: { backgroundImage: img ? "url(" + img + ")" : "none" },
      },
      h(
        "div",
        { className: "hero-content" },
        h("h1", {}, get(e, ["hero_titolo"]) || (opts && opts.fallbackTitle)),
        h("p", { className: "tagline" }, get(e, ["hero_sottotitolo"]))
      )
    );
  }

  function section(className, children) {
    return h("section", { className: className }, h("div", { className: "container" }, children));
  }

  function sectionHead(kicker, titolo, testo) {
    return h(
      "div",
      { className: "section-head" },
      kicker ? h("span", { className: "kicker" }, kicker) : null,
      titolo ? h("h2", {}, titolo) : null,
      h("div", { className: "divider" }),
      testo ? h("p", {}, testo) : null
    );
  }

  function photoGrid(props, items, cols, imgKey, capKey) {
    cols = cols || 2;
    return h(
      "div",
      { className: "grid grid-" + cols },
      (items || []).map(function (it, i) {
        return h("img", {
          key: i,
          src: resolveImage(props, it[imgKey]),
          alt: it[capKey] || "",
          style: { borderRadius: "6px", boxShadow: "0 8px 20px rgba(0,0,0,.2)" },
        });
      })
    );
  }

  // --- Menù ---------------------------------------------------------------

  CMS.registerPreviewTemplate(
    "menu",
    createClass({
      render: function () {
        var props = this.props;
        var e = props.entry;

        function piatto(titolo, prezzo, items) {
          return h(
            "div",
            { className: "card" },
            h(
              "div",
              { className: "card-body" },
              h(
                "h3",
                {},
                titolo,
                " ",
                h("span", { className: "price", style: { float: "right" } }, prezzo)
              ),
              (items || []).map(function (it, i) {
                return h(
                  "div",
                  { className: "menu-item", key: i, style: { border: "none" } },
                  h("div", { className: "desc" }, h("p", {}, it.voce))
                );
              })
            )
          );
        }

        return h(
          "div",
          {},
          note(),
          hero(props),
          section("", [
            sectionHead(get(e, ["piatti_kicker"]), get(e, ["piatti_titolo"]), get(e, ["piatti_testo"])),
            h("div", { className: "grid grid-2" }, [
              piatto("Piatto Nanico", get(e, ["nanico_prezzo"]), get(e, ["nanico_items"])),
              piatto("Piatto Elfico", get(e, ["elfico_prezzo"]), get(e, ["elfico_items"])),
            ]),
          ]),
          section("section-alt", [
            sectionHead(get(e, ["spuntini_kicker"]), get(e, ["spuntini_titolo"])),
            h(
              "ul",
              { className: "info-list" },
              (get(e, ["spuntini"]) || []).map(function (s, i) {
                return h("li", { key: i }, s);
              })
            ),
          ]),
          section("section-dark", [
            sectionHead(get(e, ["bevande_kicker"]), get(e, ["bevande_titolo"]), get(e, ["bevande_testo"])),
            photoGrid(props, get(e, ["bevande_foto"]), 2, "immagine", "descrizione"),
          ]),
          section("text-center", [
            h("h2", {}, get(e, ["funziona_titolo"])),
            props.widgetFor("funziona_testo"),
          ])
        );
      },
    })
  );

  // --- Galleria -------------------------------------------------------------

  CMS.registerPreviewTemplate(
    "galleria",
    createClass({
      render: function () {
        var props = this.props;
        var e = props.entry;
        var foto = get(e, ["foto"]) || [];
        return h(
          "div",
          {},
          note(),
          hero(props),
          section("", [
            h(
              "div",
              { className: "gallery-grid" },
              foto.map(function (f, i) {
                return h("img", {
                  key: i,
                  src: resolveImage(props, f.image),
                  alt: f.caption || "",
                });
              })
            ),
          ]),
          section("section-alt text-center", [
            h("h2", {}, get(e, ["chiusura_titolo"])),
            h("p", {}, get(e, ["chiusura_testo"])),
          ])
        );
      },
    })
  );

  // --- Camere -----------------------------------------------------------

  CMS.registerPreviewTemplate(
    "camere",
    createClass({
      render: function () {
        var props = this.props;
        var e = props.entry;

        return h(
          "div",
          {},
          note(),
          hero(props),
          section("", [
            sectionHead(get(e, ["intro_kicker"]), get(e, ["intro_titolo"]), get(e, ["intro_testo"])),
            h(
              "div",
              { className: "grid grid-3" },
              (get(e, ["camere"]) || []).map(function (c, i) {
                return h(
                  "div",
                  { className: "card", key: i },
                  h("img", { src: resolveImage(props, c.immagine), alt: c.nome }),
                  h("div", { className: "card-body" }, h("h3", {}, c.nome), h("p", {}, c.testo))
                );
              })
            ),
          ]),
          section("section-alt", [
            sectionHead(get(e, ["bagni_kicker"]), get(e, ["bagni_titolo"]), get(e, ["bagni_testo"])),
            photoGrid(props, get(e, ["bagni_foto"]), 2, "immagine", "descrizione"),
          ]),
          section("", [
            h(
              "div",
              { className: "split reverse" },
              h(
                "div",
                { className: "split-img" },
                h("img", { src: resolveImage(props, get(e, ["colazione_immagine"])), alt: "" })
              ),
              h(
                "div",
                {},
                h("span", { className: "tag" }, get(e, ["colazione_tag"])),
                h("h2", {}, get(e, ["colazione_titolo"])),
                props.widgetFor("colazione_testo")
              )
            ),
          ]),
          section("section-alt", [
            sectionHead(get(e, ["prezzi_kicker"]), get(e, ["prezzi_titolo"])),
            h(
              "div",
              { className: "grid grid-4" },
              (get(e, ["prezzi"]) || []).map(function (p, i) {
                return h(
                  "div",
                  { className: "card", key: i },
                  h(
                    "div",
                    { className: "card-body text-center" },
                    h("h3", {}, p.tipo),
                    h("p", { className: "price" }, p.prezzo)
                  )
                );
              })
            ),
          ]),
          section("section-dark text-center", [
            h("span", { className: "kicker" }, get(e, ["prenota_kicker"])),
            h("h2", {}, get(e, ["prenota_titolo"])),
            h("p", {}, get(e, ["prenota_testo"])),
          ])
        );
      },
    })
  );

  // --- Home ---------------------------------------------------------------

  CMS.registerPreviewTemplate(
    "home",
    createClass({
      render: function () {
        var props = this.props;
        var e = props.entry;

        return h(
          "div",
          {},
          note(),
          h(
            "section",
            {
              className: "hero",
              style: {
                backgroundImage: "url(" + resolveImage(props, get(e, ["hero_immagine"])) + ")",
              },
            },
            h(
              "div",
              { className: "hero-content" },
              h("h1", {}, get(e, ["hero_titolo"])),
              h("p", { className: "tagline" }, get(e, ["hero_sottotitolo"])),
              h("p", {}, get(e, ["hero_testo"]))
            )
          ),
          section("", [
            sectionHead(get(e, ["intro_kicker"]), get(e, ["intro_titolo"]), get(e, ["intro_testo"])),
            h(
              "div",
              { className: "grid grid-3" },
              (get(e, ["riquadri"]) || []).map(function (r, i) {
                return h(
                  "div",
                  { className: "card", key: i },
                  h("img", { src: resolveImage(props, r.immagine), alt: r.titolo }),
                  h(
                    "div",
                    { className: "card-body" },
                    h("h3", {}, r.titolo),
                    h("p", {}, r.testo),
                    r.link_testo ? h("a", {}, r.link_testo) : null
                  )
                );
              })
            ),
          ]),
          section("section-alt", [
            h(
              "div",
              { className: "split" },
              h(
                "div",
                { className: "split-img" },
                h("img", { src: resolveImage(props, get(e, ["storia_immagine"])), alt: "" })
              ),
              h(
                "div",
                {},
                h("span", { className: "tag" }, get(e, ["storia_tag"])),
                h("h2", {}, get(e, ["storia_titolo"])),
                props.widgetFor("storia_testo")
              )
            ),
          ]),
          section("section-dark", [
            sectionHead(get(e, ["recensioni_kicker"]), get(e, ["recensioni_titolo"])),
            h(
              "div",
              { className: "quote-grid" },
              (get(e, ["recensioni"]) || []).map(function (r, i) {
                return h(
                  "blockquote",
                  { className: "quote", key: i },
                  "«" + r.testo + "»",
                  h("cite", {}, r.fonte)
                );
              })
            ),
          ]),
          section("text-center", [
            h("span", { className: "kicker" }, get(e, ["chiusura_kicker"])),
            h("h2", {}, get(e, ["chiusura_titolo"])),
            h("p", {}, get(e, ["chiusura_testo"])),
          ])
        );
      },
    })
  );

  // --- Chi Siamo ----------------------------------------------------------

  CMS.registerPreviewTemplate(
    "chisiamo",
    createClass({
      render: function () {
        var props = this.props;
        var e = props.entry;

        return h(
          "div",
          {},
          note(),
          hero(props),
          section("", [
            h(
              "div",
              { className: "split" },
              h(
                "div",
                { className: "split-img" },
                h("img", { src: resolveImage(props, get(e, ["storia_immagine"])), alt: "" })
              ),
              h(
                "div",
                {},
                h("span", { className: "tag" }, get(e, ["storia_tag"])),
                h("h2", {}, get(e, ["storia_titolo"])),
                props.widgetFor("storia_testo")
              )
            ),
          ]),
          section("section-alt", [
            h(
              "div",
              { className: "split reverse" },
              h(
                "div",
                { className: "split-img" },
                h("img", { src: resolveImage(props, get(e, ["anima_immagine"])), alt: "" })
              ),
              h(
                "div",
                {},
                h("h2", {}, get(e, ["anima_titolo"])),
                props.widgetFor("anima_testo")
              )
            ),
          ]),
          section("section-dark", [
            sectionHead(get(e, ["spirito_kicker"]), get(e, ["spirito_titolo"])),
            h(
              "div",
              { className: "grid grid-3" },
              (get(e, ["spirito_punti"]) || []).map(function (p, i) {
                return h("div", { key: i }, h("h3", {}, p.titolo), h("p", {}, p.testo));
              })
            ),
          ]),
          section("text-center", [
            h("span", { className: "kicker" }, get(e, ["eventi_kicker"])),
            h("h2", {}, get(e, ["eventi_titolo"])),
            h("p", {}, get(e, ["eventi_testo"])),
            photoGrid(props, get(e, ["eventi_foto"]), 3, "immagine", "descrizione"),
          ]),
          section("section-alt text-center", [h("h2", {}, get(e, ["chiusura_titolo"]))])
        );
      },
    })
  );

  // --- Contatti -------------------------------------------------------------

  CMS.registerPreviewTemplate(
    "contatti",
    createClass({
      render: function () {
        var props = this.props;
        var e = props.entry;

        return h(
          "div",
          {},
          note(),
          hero(props),
          section("", [
            h(
              "div",
              { className: "split" },
              h(
                "div",
                {},
                h("span", { className: "tag" }, get(e, ["tag"])),
                h("h2", {}, get(e, ["titolo"])),
                h(
                  "ul",
                  { className: "info-list" },
                  h("li", {}, get(e, ["nota"]))
                ),
                get(e, ["orari"]) && get(e, ["orari"]).length
                  ? h(
                      "div",
                      {},
                      h("h3", { style: { marginTop: "2rem" } }, "Quando siamo aperti"),
                      h(
                        "ul",
                        { className: "info-list" },
                        get(e, ["orari"]).map(function (o, i) {
                          return h("li", { key: i }, o.giorno + ": " + o.orario);
                        })
                      )
                    )
                  : null
              ),
              h("div", { className: "map-wrap", style: { minHeight: "200px", background: "#ddd" } })
            ),
          ]),
          section("section-alt", [
            sectionHead(get(e, ["indicazioni_kicker"]), get(e, ["indicazioni_titolo"])),
            h(
              "div",
              { className: "grid grid-3" },
              (get(e, ["indicazioni"]) || []).map(function (ind, i) {
                return h(
                  "div",
                  { className: "card", key: i },
                  h("div", { className: "card-body" }, h("h3", {}, ind.da), h("p", {}, ind.testo))
                );
              })
            ),
          ]),
          section("section-dark text-center", [
            h("h2", {}, get(e, ["chiusura_titolo"])),
            h("p", {}, get(e, ["chiusura_testo"])),
          ])
        );
      },
    })
  );
})();
