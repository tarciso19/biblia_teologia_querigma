const catalog = window.casaDaPalavraCatalogo ?? { articles: [], pdfs: [] };
const articleList = document.querySelector("#article-list");
const articleCount = document.querySelector("#article-count");
const articleCountLabel = document.querySelector("#article-count-label");
const articleSearch = document.querySelector("#article-search");
const articleSearchControl = document.querySelector("#article-search-control");
const articleHeading = document.querySelector("#articles-heading");
const articleBreadcrumbs = document.querySelector("#article-breadcrumbs");
const historyFlowOpen = document.querySelector("#history-flow-open");
const historyFlowDialog = document.querySelector("#history-flow-dialog");
const historyFlowSteps = document.querySelector("#history-flow-steps");
const historyFlowPosition = document.querySelector("#history-flow-position");
const historyFlowStepTitle = document.querySelector("#history-flow-step-title");
const historyFlowStepDescription = document.querySelector("#history-flow-step-description");
const historyFlowRead = document.querySelector("#history-flow-read");
const historyFlowPrevious = document.querySelector("#history-flow-previous");
const historyFlowNext = document.querySelector("#history-flow-next");
const pdfList = document.querySelector("#pdf-list");
const pdfCount = document.querySelector("#pdf-count");
const pdfSearch = document.querySelector("#pdf-search");
const pdfCategoryFilter = document.querySelector("#pdf-category-filter");
const siteRoot = new URL("../", window.location.href);
const historyFlowOrder = [
  ["01-saul.html", "Monarquia nascente", "Saul", "A liderança tribal dá lugar à monarquia em meio à ameaça filisteia e à crise das instituições de Israel."],
  ["02-davi.html", "Reino unificado", "Davi", "Davi reúne as tribos, estabelece Jerusalém como centro político e religioso e recebe a promessa davídica."],
  ["03-salomao.html", "Reino unificado", "Salomão", "O reino alcança prosperidade e constrói o Templo, mas os custos sociais e políticos preparam uma crise."],
  ["04-olhar_teologico_primeiros_anos_da_monarquia.html", "Leitura teológica", "A monarquia", "Uma leitura da passagem da confederação tribal ao Estado e do sentido teológico da monarquia."],
  ["05-cisma.html", "Reino dividido", "A cisão", "A ruptura após Salomão forma os reinos de Israel, ao norte, e Judá, ao sul."],
  ["06-casa_amri.html", "Reino do Norte", "Casa de Amri", "A dinastia de Amri fortalece politicamente Israel, enquanto enfrenta a crítica profética à apostasia cultual."],
  ["08-jéu.html", "Reino do Norte", "Jeú", "O golpe de Jeú encerra a dinastia de Amri e marca um período de instabilidade nos reinos divididos."],
  ["09-profetismo_antes_assiria.html", "Profetas do século VIII", "Profetismo", "Em meio à prosperidade, Amós e Oseias denunciam a injustiça e a infidelidade à aliança."],
  ["07-invasao_assiria.html", "Queda do Reino do Norte", "Invasão assíria", "A instabilidade política e a pressão assíria culminam na queda de Samaria e no fim do Reino do Norte."],
];
let activeHistoryFlowIndex = 0;

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function populatePdfCategoryFilter() {
  const categories = [...new Set(catalog.pdfs.map((material) => material.category).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, "pt-BR"));
  for (const category of categories) {
    const option = createElement("option", "", category);
    option.value = category;
    pdfCategoryFilter.append(option);
  }
}

function getArticleCategory(article) {
  return article.category || "Estudo bíblico";
}

function getArticleCategories() {
  return [...new Set([
    ...Object.keys(catalog.articleCategories ?? {}),
    ...(catalog.articles ?? []).map(getArticleCategory),
  ])].sort((first, second) => first.localeCompare(second, "pt-BR"));
}

function getArticleSubcategories(category) {
  const configured = catalog.articleCategories?.[category] ?? [];
  const presentInArticles = (catalog.articles ?? [])
    .filter((article) => getArticleCategory(article) === category)
    .map((article) => article.subcategory)
    .filter(Boolean);
  return [...new Set([...configured, ...presentInArticles])]
    .sort((first, second) => first.localeCompare(second, "pt-BR"));
}

function getArticleUrl(category = "", subcategory = "") {
  const url = new URL(window.location.href);
  url.search = "";
  if (category) url.searchParams.set("categoria", category);
  if (subcategory) url.searchParams.set("subcategoria", subcategory);
  return url;
}

function getHistoryFlowArticles() {
  const articlesByFile = new Map((catalog.articles ?? []).map((article) => {
    const normalizedPath = article.htmlFile?.replace(/\\/g, "/") ?? "";
    return [normalizedPath.slice(normalizedPath.lastIndexOf("/") + 1), article];
  }));
  return historyFlowOrder
    .map(([filename, period, label, description]) => {
      const article = articlesByFile.get(filename);
      return article ? { ...article, flowPeriod: period, flowLabel: label, flowDescription: description } : null;
    })
    .filter(Boolean);
}

function renderHistoryFlowStep(index) {
  const articles = getHistoryFlowArticles();
  if (!articles.length) return;
  activeHistoryFlowIndex = Math.max(0, Math.min(index, articles.length - 1));
  const article = articles[activeHistoryFlowIndex];

  historyFlowPosition.textContent = `${article.flowPeriod} · Etapa ${activeHistoryFlowIndex + 1} de ${articles.length}`;
  historyFlowStepTitle.textContent = article.title;
  historyFlowStepDescription.textContent = article.flowDescription;
  historyFlowRead.href = new URL(article.htmlFile, siteRoot).href;
  historyFlowPrevious.disabled = activeHistoryFlowIndex === 0;
  historyFlowNext.disabled = activeHistoryFlowIndex === articles.length - 1;

  for (const [stepIndex, button] of [...historyFlowSteps.children].entries()) {
    const isActive = stepIndex === activeHistoryFlowIndex;
    button.setAttribute("aria-pressed", String(isActive));
    if (isActive) button.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

function populateHistoryFlow() {
  historyFlowSteps.replaceChildren();
  for (const [index, article] of getHistoryFlowArticles().entries()) {
    const step = createElement("button", "history-flow-step", "");
    step.type = "button";
    step.setAttribute("aria-pressed", "false");
    step.setAttribute("aria-label", `Etapa ${index + 1}: ${article.flowLabel}, ${article.flowPeriod}`);
    step.append(
      createElement("span", "history-flow-step-number", String(index + 1).padStart(2, "0")),
      createElement("span", "history-flow-step-name", article.flowLabel),
      createElement("span", "history-flow-step-period", article.flowPeriod),
    );
    step.addEventListener("click", () => renderHistoryFlowStep(index));
    historyFlowSteps.append(step);
  }
  renderHistoryFlowStep(activeHistoryFlowIndex);
}

function renderArticleCard(article) {
  if (article.htmlFile) {
    const card = createElement("article", "article-entry article-file-entry");
    const taxonomy = createElement("p", "article-category");
    taxonomy.textContent = [getArticleCategory(article), article.subcategory].filter(Boolean).join(" / ");
    const title = createElement("h3", "", article.title);
    const excerpt = createElement("p", "article-excerpt", article.excerpt || "");
    const actions = createElement("div", "article-actions");
    const read = createElement("a", "article-read", "Ler artigo ↗");
    read.href = new URL(article.htmlFile, siteRoot).href;
    actions.append(read);
    if (article.pdfFile) {
      const download = createElement("a", "material-download", "Baixar PDF ↓");
      download.href = new URL(article.pdfFile, siteRoot).href;
      download.setAttribute("download", "");
      download.setAttribute("aria-label", `Baixar PDF: ${article.title}`);
      actions.append(download);
    }
    card.append(taxonomy, title, excerpt, actions);
    return card;
  }

  const details = createElement("details", "article-entry");
  const summary = document.createElement("summary");
  const taxonomy = createElement("span", "article-category", [getArticleCategory(article), article.subcategory].filter(Boolean).join(" / "));
  const title = createElement("h3", "", article.title);
  const excerpt = createElement("p", "article-excerpt", article.excerpt || "");
  summary.append(taxonomy, title, excerpt);
  details.append(summary);

  for (const section of article.sections ?? []) {
    const content = createElement("div", "article-section-content");
    if (section.heading) content.append(createElement("h4", "", section.heading));
    for (const paragraph of section.paragraphs ?? []) content.append(createElement("p", "", paragraph));
    details.append(content);
  }

  if (article.author || article.reference) {
    details.append(createElement("p", "article-byline", [article.author, article.reference].filter(Boolean).join(" · ")));
  }
  if (article.pdfFile) {
    const download = createElement("a", "material-download article-inline-download", "Baixar PDF ↓");
    download.href = new URL(article.pdfFile, siteRoot).href;
    download.setAttribute("download", "");
    download.setAttribute("aria-label", `Baixar PDF: ${article.title}`);
    details.append(download);
  }
  return details;
}

function createArticleNavigationCard(title, description, count, href, className) {
  const card = createElement("a", className, "");
  card.href = href.href;
  card.classList.add("article-navigation-card", "article-navigation-link");
  const eyebrow = createElement("span", "article-navigation-kicker", className === "article-category-card" ? "Categoria" : "Subcategoria");
  const heading = createElement("h3", "", title);
  const summary = createElement("p", "article-navigation-description", description);
  const footer = createElement("span", "article-navigation-count", count);
  card.append(eyebrow, heading, summary, footer);
  return card;
}

function setArticleBreadcrumbs(category, subcategory) {
  articleBreadcrumbs.replaceChildren();
  articleBreadcrumbs.hidden = !category;
  if (!category) return;

  const allCategories = createElement("a", "article-navigation-link", "Todas as categorias");
  allCategories.href = getArticleUrl().href;
  articleBreadcrumbs.append(allCategories);
  if (subcategory) {
    const categoryLink = createElement("a", "article-navigation-link", category);
    categoryLink.href = getArticleUrl(category).href;
    articleBreadcrumbs.append(createElement("span", "", " / "), categoryLink);
    articleBreadcrumbs.append(createElement("span", "article-breadcrumb-current", ` / ${subcategory}`));
  } else {
    articleBreadcrumbs.append(createElement("span", "article-breadcrumb-current", ` / ${category}`));
  }
}

function renderArticles() {
  const parameters = new URLSearchParams(window.location.search);
  const requestedCategory = parameters.get("categoria") || "";
  const requestedSubcategory = parameters.get("subcategoria") || "";
  const categories = getArticleCategories();
  const category = categories.includes(requestedCategory) ? requestedCategory : "";
  const subcategories = category ? getArticleSubcategories(category) : [];
  const subcategory = subcategories.includes(requestedSubcategory) ? requestedSubcategory : "";
  const isArticleView = Boolean(category && (subcategory || subcategories.length === 0));

  if ((requestedCategory && !category) || (requestedSubcategory && !subcategory)) {
    history.replaceState(null, "", getArticleUrl(category, subcategory));
  }

  articleSearch.value = "";
  articleList.replaceChildren();
  articleBreadcrumbs.replaceChildren();
  articleBreadcrumbs.hidden = !category;
  historyFlowOpen.hidden = category !== "História de Israel";
  articleSearchControl.hidden = !isArticleView;

  if (!category) {
    articleHeading.textContent = "Categorias";
    articleList.className = "article-grid article-category-grid";
    articleCount.textContent = String(categories.length);
    articleCountLabel.textContent = categories.length === 1 ? "categoria" : "categorias";
    for (const item of categories) {
      const itemSubcategories = getArticleSubcategories(item);
      const articleTotal = catalog.articles.filter((article) => getArticleCategory(article) === item).length;
      const description = itemSubcategories.length
        ? `${itemSubcategories.length} ${itemSubcategories.length === 1 ? "tema disponível" : "temas disponíveis"}`
        : "Artigos desta categoria";
      const count = itemSubcategories.length
        ? `${itemSubcategories.length} ${itemSubcategories.length === 1 ? "subcategoria" : "subcategorias"}`
        : `${articleTotal} ${articleTotal === 1 ? "artigo" : "artigos"}`;
      articleList.append(createArticleNavigationCard(
        item,
        description,
        count,
        getArticleUrl(item),
        "article-category-card",
      ));
    }
    return;
  }

  setArticleBreadcrumbs(category, subcategory);
  if (subcategories.length > 0 && !subcategory) {
    articleHeading.textContent = category;
    articleList.className = "article-grid article-subcategory-grid";
    articleCount.textContent = String(subcategories.length);
    articleCountLabel.textContent = subcategories.length === 1 ? "subcategoria" : "subcategorias";
    for (const item of subcategories) {
      const articleTotal = catalog.articles.filter((article) =>
        getArticleCategory(article) === category && article.subcategory === item).length;
      articleList.append(createArticleNavigationCard(
        item,
        articleTotal ? "Artigos bíblicos e materiais de estudo" : "Novos artigos em preparação",
        `${articleTotal} ${articleTotal === 1 ? "artigo" : "artigos"}`,
        getArticleUrl(category, item),
        "article-subcategory-card",
      ));
    }
    return;
  }

  articleHeading.textContent = subcategory || category;
  articleList.className = "article-grid article-results-grid";
  articleCountLabel.textContent = "artigos";
  const query = articleSearch.value.trim().toLocaleLowerCase("pt-BR");
  const matches = catalog.articles.filter((article) => {
    const searchableText = [article.title, article.author, getArticleCategory(article), article.subcategory, article.excerpt]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");
    return searchableText.includes(query)
      && getArticleCategory(article) === category
      && (!subcategory || article.subcategory === subcategory);
  });
  articleCount.textContent = String(matches.length);
  articleCountLabel.textContent = matches.length === 1 ? "artigo" : "artigos";

  if (matches.length === 0) {
    const empty = createElement("div", "article-empty");
    const title = createElement("h3", "", query ? "Nenhum artigo encontrado" : "Novos estudos em preparação");
    const message = createElement("p", "", query
      ? "Tente buscar por outro tema, título ou autor."
      : "Em breve, esta página reunirá exposições bíblicas e teológicas para apoiar o estudo e a pregação.");
    empty.append(title, message);
    articleList.append(empty);
    return;
  }

  for (const article of matches) articleList.append(renderArticleCard(article));
}

function renderArticleSearchResults() {
  const query = articleSearch.value.trim().toLocaleLowerCase("pt-BR");
  const parameters = new URLSearchParams(window.location.search);
  const category = parameters.get("categoria") || "";
  const subcategory = parameters.get("subcategoria") || "";
  const matches = catalog.articles.filter((article) => {
    const searchableText = [article.title, article.author, getArticleCategory(article), article.subcategory, article.excerpt]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");
    return searchableText.includes(query)
      && getArticleCategory(article) === category
      && (!subcategory || article.subcategory === subcategory);
  });
  articleList.replaceChildren();
  articleCount.textContent = String(matches.length);
  articleCountLabel.textContent = matches.length === 1 ? "artigo" : "artigos";
  if (matches.length === 0) {
    const empty = createElement("div", "article-empty");
    empty.append(
      createElement("h3", "", "Nenhum artigo encontrado"),
      createElement("p", "", "Tente buscar por outro tema, título ou autor."),
    );
    articleList.append(empty);
    return;
  }
  for (const article of matches) articleList.append(renderArticleCard(article));
}

function renderPdfs() {
  const query = pdfSearch.value.trim().toLocaleLowerCase("pt-BR");
  const category = pdfCategoryFilter.value;
  const materials = catalog.pdfs.filter((material) => {
    const searchableText = [material.title, material.author, material.category]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");
    return searchableText.includes(query) && (!category || material.category === category);
  });

  pdfList.replaceChildren();
  pdfCount.textContent = String(catalog.pdfs.length);

  if (materials.length === 0) {
    const empty = createElement("p", "pdf-empty", catalog.pdfs.length ? "Nenhum PDF corresponde à busca." : "Novos materiais de estudo estarão disponíveis em breve.");
    pdfList.append(empty);
    return;
  }

  for (const material of materials) {
    const card = createElement("article", "material-card");
    const symbol = createElement("span", "pdf-symbol", "PDF");
    const info = createElement("div", "material-info");
    const title = createElement("h3", "", material.title);
    const detail = createElement("p", "", [material.author, material.category].filter(Boolean).join(" · "));
    const download = createElement("a", "material-download", "Baixar PDF ↓");
    info.append(title, detail);
    download.href = new URL(material.file, siteRoot).href;
    download.setAttribute("download", "");
    download.setAttribute("aria-label", `Baixar PDF: ${material.title}`);
    card.append(symbol, info, download);
    pdfList.append(card);
  }
}

articleSearch.addEventListener("input", renderArticleSearchResults);
historyFlowOpen.addEventListener("click", () => {
  populateHistoryFlow();
  historyFlowDialog.showModal();
});
document.querySelector("#history-flow-close").addEventListener("click", () => historyFlowDialog.close());
historyFlowPrevious.addEventListener("click", () => renderHistoryFlowStep(activeHistoryFlowIndex - 1));
historyFlowNext.addEventListener("click", () => renderHistoryFlowStep(activeHistoryFlowIndex + 1));
historyFlowDialog.addEventListener("click", (event) => {
  if (event.target === historyFlowDialog) historyFlowDialog.close();
});
articleList.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest("a.article-navigation-link");
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  history.pushState(null, "", link.href);
  renderArticles();
  document.querySelector(".article-library").scrollIntoView({ behavior: "smooth", block: "start" });
});
articleBreadcrumbs.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest("a.article-navigation-link");
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  history.pushState(null, "", link.href);
  renderArticles();
  document.querySelector(".article-library").scrollIntoView({ behavior: "smooth", block: "start" });
});
window.addEventListener("popstate", renderArticles);
pdfSearch.addEventListener("input", renderPdfs);
pdfCategoryFilter.addEventListener("change", renderPdfs);
populatePdfCategoryFilter();
renderArticles();
renderPdfs();