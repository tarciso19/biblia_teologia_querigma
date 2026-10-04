const catalog = window.casaDaPalavraCatalogo ?? {};
const books = catalog.books ?? [];
const bookList = document.querySelector("#book-list");
const bookCategoriesList = document.querySelector("#book-categories");
let selectedBookCategory = "";

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

const descriptionDialog = document.createElement("dialog");
descriptionDialog.id = "book-description-dialog";
descriptionDialog.className = "book-description-dialog";
descriptionDialog.setAttribute("aria-labelledby", "book-description-title");
descriptionDialog.setAttribute("aria-describedby", "book-description-text");
const descriptionHeading = createElement("h2", "", "");
descriptionHeading.id = "book-description-title";
const descriptionText = createElement("p", "", "");
descriptionText.id = "book-description-text";
const descriptionClose = createElement("button", "amazon-link book-description-close", "Fechar");
descriptionClose.type = "button";
descriptionClose.addEventListener("click", () => descriptionDialog.close());
descriptionDialog.append(descriptionHeading, descriptionText, descriptionClose);
descriptionDialog.addEventListener("click", (event) => {
  if (event.target === descriptionDialog) descriptionDialog.close();
});
document.body.append(descriptionDialog);

function getBookCategory(book) {
  return book.category?.trim() || "Sem categoria";
}

function renderBooks() {
  bookList.replaceChildren();
  const visibleBooks = books
    .map((book, index) => ({ book, index }))
    .filter(({ book }) => !selectedBookCategory || getBookCategory(book) === selectedBookCategory);

  if (visibleBooks.length === 0) {
    const message = books.length === 0
      ? "Novas sugestões de leitura serão publicadas em breve."
      : "Ainda não há livros nesta categoria.";
    bookList.append(createElement("p", "book-empty", message));
    return;
  }

  for (const { book, index } of visibleBooks) {
    const item = createElement("article", "book-item book-suggestion");
    const cover = createElement("div", `book-cover ${book.coverClass || "cover-wine"}`);
    cover.setAttribute("aria-hidden", "true");
    cover.append(
      createElement("span", "", book.coverTitle || book.title),
      createElement("small", "", book.author.toLocaleUpperCase("pt-BR")),
      createElement("i", "", "✝"),
    );
    if (book.coverImage) {
      const coverImage = createElement("img", "book-cover-image");
      coverImage.src = book.coverImage;
      coverImage.alt = `Capa do livro ${book.title}`;
      coverImage.loading = "lazy";
      coverImage.decoding = "async";
      cover.classList.add("has-image");
      cover.removeAttribute("aria-hidden");
      coverImage.addEventListener("error", () => {
        cover.classList.remove("has-image");
        cover.setAttribute("aria-hidden", "true");
        coverImage.remove();
      }, { once: true });
      cover.append(coverImage);
    }
    const meta = createElement("div", "book-meta");
    meta.append(
      createElement("span", "book-category", getBookCategory(book)),
      createElement("span", "book-number", String(index + 1).padStart(2, "0")),
    );
    item.append(cover, meta, createElement("h2", "book-title", book.title), createElement("p", "book-author", book.author));

    if (book.description?.trim()) {
      const descriptionButton = createElement("button", "book-description-button", "Ver descrição");
      descriptionButton.type = "button";
      descriptionButton.setAttribute("aria-haspopup", "dialog");
      descriptionButton.setAttribute("aria-controls", descriptionDialog.id);
      descriptionButton.addEventListener("click", () => {
        descriptionHeading.textContent = book.title;
        descriptionText.textContent = book.description.trim();
        descriptionDialog.showModal();
      });
      item.append(descriptionButton);
    }

    if (book.amazonUrl) {
      const amazonLink = createElement("a", "amazon-link", "Ver na Amazon ↗");
      amazonLink.href = book.amazonUrl;
      amazonLink.target = "_blank";
      amazonLink.rel = "noopener noreferrer";
      item.append(amazonLink);
    } else {
      item.append(createElement("span", "amazon-link-pending", "Link da Amazon em breve"));
    }

    bookList.append(item);
  }
}

function selectBookCategory(category) {
  selectedBookCategory = category;
  bookCategoriesList.querySelectorAll(".video-theme").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === category));
  });
  renderBooks();
}

const categories = new Set(catalog.booksCategories ?? []);
books.forEach((book) => categories.add(getBookCategory(book)));

const allButton = createElement("button", "video-theme", "Todos os livros");
allButton.type = "button";
allButton.dataset.category = "";
allButton.setAttribute("aria-pressed", "true");
allButton.setAttribute("aria-controls", "book-list");
allButton.addEventListener("click", () => selectBookCategory(""));
bookCategoriesList.append(allButton);

for (const category of categories) {
  const button = createElement("button", "video-theme", category);
  button.type = "button";
  button.dataset.category = category;
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-controls", "book-list");
  button.addEventListener("click", () => selectBookCategory(category));
  bookCategoriesList.append(button);
}

renderBooks();