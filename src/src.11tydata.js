// Ogni pagina dichiara `pagina: <nome>` e quel nome corrisponde al suo file in
// _data/. Qui prendiamo titolo e descrizione per Google direttamente da lì, così
// non vanno ripetuti nel front matter di ogni template.
export default {
  eleventyComputed: {
    seo_titolo: (data) => (data.pagina && data[data.pagina]?.seo_titolo) || data.site?.nome,
    seo_descrizione: (data) => (data.pagina && data[data.pagina]?.seo_descrizione) || "",
  },
};
