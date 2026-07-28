import markdownIt from "markdown-it";

export default function (eleventyConfig) {
  // Immagini, CSS, JS e pannello CMS vengono copiati così come sono
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");

  // Rigenera il sito quando cambiano CSS o JS
  eleventyConfig.addWatchTarget("assets/css/");
  eleventyConfig.addWatchTarget("assets/js/");

  // Filtro markdown: permette grassetto/corsivo/link nei campi di testo del pannello
  const md = markdownIt({ html: false, breaks: true, linkify: true });
  eleventyConfig.addFilter("md", (value) => (value ? md.render(String(value)) : ""));
  eleventyConfig.addFilter("mdInline", (value) =>
    value ? md.renderInline(String(value)) : ""
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
