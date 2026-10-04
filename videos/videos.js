const catalog = window.casaDaPalavraCatalogo ?? { videos: [] };
const videoList = document.querySelector("#video-list");
const videoThemes = document.querySelector("#video-themes");
const videoTopicExpansion = document.querySelector("#video-topic-expansion");
const siteRoot = new URL("../", window.location.href);
let selectedVideoCategory = "";

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function getCategory(material) {
  return material.category?.trim() || "Sem categoria";
}

function renderVideos() {
  videoList.replaceChildren();
  const materials = catalog.videos.filter((material) => !selectedVideoCategory || getCategory(material) === selectedVideoCategory);

  for (const material of materials) {
    const entry = createElement("article", "video-entry");
    if (material.id) entry.id = `video-${material.id}`;
    entry.append(createElement("h2", "video-card-title", material.title));
    const card = createElement("div", "video-card");
    if (material.embedUrl) {
      const frame = document.createElement("iframe");
      frame.className = "instagram-embed";
      frame.src = material.embedUrl;
      frame.title = material.title;
      frame.loading = "lazy";
      frame.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      card.append(frame);
      if (material.link) {
        const openInstagram = createElement("a", "instagram-link", "Abrir no Instagram ↗");
        openInstagram.href = material.link;
        openInstagram.target = "_blank";
        openInstagram.rel = "noopener noreferrer";
        card.append(openInstagram);
      }
    } else {
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "metadata";
      video.src = new URL(material.file, siteRoot).href;
      if (material.poster) video.poster = new URL(material.poster, siteRoot).href;
      video.setAttribute("aria-label", material.title);
      card.append(video);
    }
    const details = [material.author, material.category].filter(Boolean);
    if (Number.isFinite(material.views)) {
      details.push(`${new Intl.NumberFormat("pt-BR").format(material.views)} visualizações`);
    }
    entry.append(card, createElement("p", "video-detail", details.join(" · ")));
    videoList.append(entry);
  }

  if (materials.length === 0) {
    videoList.append(createElement("p", "no-results", "Ainda não há vídeos neste tema."));
  }
}

function renderVideoTopicExpansion() {
  videoTopicExpansion.replaceChildren();
  videoTopicExpansion.hidden = !selectedVideoCategory;
  if (!selectedVideoCategory) return;

  const heading = createElement("h2", "video-topic-heading", selectedVideoCategory);
  const list = createElement("ul", "video-topic-list");
  const materials = catalog.videos.filter((material) => getCategory(material) === selectedVideoCategory);

  for (const material of materials) {
    const item = createElement("li");
    const link = createElement("a", "video-topic-link", material.title);
    link.href = `#video-${material.id}`;
    item.append(link);
    list.append(item);
  }

  videoTopicExpansion.append(heading, list);
}

function selectVideoCategory(category) {
  selectedVideoCategory = category;
  videoThemes.querySelectorAll(".video-theme").forEach((button) => {
    const isSelected = button.dataset.category === category;
    button.setAttribute("aria-pressed", String(isSelected));
    button.setAttribute("aria-expanded", String(Boolean(category) && isSelected));
  });
  renderVideoTopicExpansion();
  renderVideos();
}

const categories = new Set(catalog.videoCategories ?? []);
catalog.videos.forEach((material) => categories.add(getCategory(material)));

const allButton = createElement("button", "video-theme", "Todos os vídeos");
allButton.type = "button";
allButton.dataset.category = "";
allButton.setAttribute("aria-pressed", "true");
allButton.setAttribute("aria-controls", "video-topic-expansion");
allButton.setAttribute("aria-expanded", "false");
allButton.addEventListener("click", () => selectVideoCategory(""));
videoThemes.append(allButton);

for (const category of categories) {
  const button = createElement("button", "video-theme", category);
  button.type = "button";
  button.dataset.category = category;
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-controls", "video-topic-expansion");
  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => selectVideoCategory(category));
  videoThemes.append(button);
}

renderVideos();