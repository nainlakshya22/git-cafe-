(function () {
  const catalog = window.GBCatalog || [];
  const cartKey = "glitterBeanCart.v1";
  const money = (value) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value);
  let storageWarningShown = false;

  function showNotice(message) {
    let status = document.querySelector("#preview-status");
    if (!status) {
      status = document.createElement("div");
      status.id = "preview-status";
      status.className = "preview-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      document.body.append(status);
    }
    status.textContent = message;
    status.hidden = false;
  }

  function readCart() {
    try {
      const raw = localStorage.getItem(cartKey);
      const saved = JSON.parse(raw || "[]");
      if (!Array.isArray(saved)) {
        if (raw !== null && !storageWarningShown) {
          showNotice("The preview cart contains invalid saved data and could not be loaded.");
          storageWarningShown = true;
        }
        return [];
      }
      const validItems = saved.filter((item) => {
        if (!item || typeof item !== "object" || typeof item.id !== "string") return false;
        const product = catalog.find((entry) => entry.id === item.id);
        const validVariant = item.variant === undefined || item.variant === "" ||
          (typeof item.variant === "string" && product?.variants.includes(item.variant));
        return Boolean(product) &&
          validVariant &&
          Number.isSafeInteger(item.quantity) &&
          item.quantity > 0 &&
          item.quantity <= 99;
      }).map((item) => {
        const product = catalog.find((entry) => entry.id === item.id);
        return { ...item, variant: item.variant || product.variants[0] || "" };
      });
      if (validItems.length !== saved.length && !storageWarningShown) {
        showNotice("Invalid saved preview cart items were skipped.");
        storageWarningShown = true;
      }
      return validItems;
    } catch {
      if (!storageWarningShown) {
        showNotice("The preview cart could not be read from this browser. Check browser storage settings and reload.");
        storageWarningShown = true;
      }
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch {
      showNotice("The preview cart could not be saved in this browser. Check browser storage settings and try again.");
      return false;
    }
    updateCartCount();
    return true;
  }

  function updateCartCount() {
    const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll(".bag-count").forEach((badge) => {
      badge.textContent = String(count);
      badge.setAttribute("aria-label", `${count} items in preview cart`);
    });
  }

  function addToCart(id, quantity = 1, variant = "") {
    const product = catalog.find((item) => item.id === id);
    if (!product || product.category === "Gift Cards" || product.category === "Subscriptions") {
      showNotice("This item is a preview only. Contact the café to confirm availability.");
      return;
    }
    const selectedVariant = variant || product.variants[0] || "";
    const cart = readCart();
    const key = `${id}:${selectedVariant}`;
    const existing = cart.find((item) => `${item.id}:${item.variant || ""}` === key);
    if (existing) existing.quantity = Math.min(99, existing.quantity + quantity);
    else cart.push({ id, quantity: Math.min(99, quantity), variant: selectedVariant });
    if (!saveCart(cart)) return;
    showNotice(`${product.name} added to your preview cart. Online ordering is not enabled.`);
  }

  function renderCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.productId = product.id;
    card.innerHTML = `
      <a class="product-media" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${product.name}">
        ${product.featured ? '<span class="product-badges"><span class="product-badge">Featured concept</span></span>' : ""}
        <img src="${product.image}" alt="${product.name} concept image (stock photo)" loading="lazy" />
      </a>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3><a href="product.html?id=${encodeURIComponent(product.id)}">${product.name}</a></h3>
        <p>Concept only: ${product.description}</p>
        <div class="product-meta"><span class="price">Preview ${money(product.price)}</span><span class="availability">${product.availability}</span></div>
        <div class="product-actions">
          <button class="small-btn primary-btn" type="button" data-add-to-cart="${product.id}">Add to preview cart</button>
          <a class="small-btn ghost-btn" href="product.html?id=${encodeURIComponent(product.id)}">Details</a>
        </div>
      </div>`;
    return card;
  }

  function productMatchesFilter(product, filter) {
    const value = (filter || "").toLowerCase();
    if (!value || value === "all" || value === "all roasts") return true;
    if (value.includes("coffee beans")) return product.category === "Coffee Beans";
    if (value.includes("coffee") || value.includes("roast") || value.includes("espresso") || value.includes("single origin") || value.includes("light") || value.includes("medium")) {
      return ["Coffee Beans", "Specialty Blends", "Seasonal Collection"].includes(product.category);
    }
    if (value.includes("signature")) return product.category === "Signature Drinks";
    if (value.includes("merch")) return product.category === "Merchandise";
    if (value.includes("gift")) return product.category === "Gift Cards";
    if (value.includes("subscription")) return product.category === "Subscriptions";
    return product.category.toLowerCase() === value;
  }

  function initializeCatalogs() {
    document.querySelectorAll("[data-catalog]").forEach((grid) => {
      const scope = grid.dataset.catalog || "all";
      const params = new URLSearchParams(window.location.search);
      const query = (params.get("q") || "").trim().toLowerCase();
      let products = catalog.filter((product) => {
        const inScope = scope === "all" ||
          (scope === "featured" && product.featured) ||
          (scope === "coffee" && ["Coffee Beans", "Specialty Blends", "Seasonal Collection"].includes(product.category)) ||
          (scope === "drinks" && product.category === "Signature Drinks") ||
          (scope === "merch" && product.category === "Merchandise") ||
          (scope === "gifts" && product.category === "Gift Cards") ||
          (scope === "subscriptions" && product.category === "Subscriptions");
        return inScope && productMatchesFilter(product, grid.dataset.filter) &&
          (!query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query));
      });

      const sort = grid.dataset.sort || "featured";
      if (sort === "alphabetical") products.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
      if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
      if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
      grid.replaceChildren(...products.map(renderCard));

      const empty = grid.parentElement.querySelector("[data-empty-search]");
      if (empty) empty.hidden = products.length > 0;
    });

    document.querySelectorAll("[data-filter]").forEach((button) => {
      if (!button.dataset.filterBound) {
        button.dataset.filterBound = "true";
        button.addEventListener("click", () => {
        const grid = button.closest(".container")?.querySelector("[data-catalog]");
        if (!grid) return;
        grid.dataset.filter = button.dataset.filter;
        button.parentElement.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        initializeCatalogs();
        });
      }
    });

    const sort = document.querySelector("#sort");
    if (sort && !sort.dataset.sortBound) {
      sort.dataset.sortBound = "true";
      sort.addEventListener("change", () => {
        const grid = sort.closest(".container")?.querySelector("[data-catalog]");
        if (!grid) return;
        grid.dataset.sort = sort.value;
        initializeCatalogs();
      });
    }
  }

  function initializeProductPage() {
    const detail = document.querySelector("[data-product-detail]");
    if (!detail) return;
    const id = new URLSearchParams(window.location.search).get("id") || "sunrise-bloom";
    const product = catalog.find((item) => item.id === id);
    if (!product) {
      detail.innerHTML = "<div class=\"empty-state\"><h3>Product not found</h3><p>This product preview is unavailable.</p><a class=\"primary-btn\" href=\"shop.html\">Return to shop</a></div>";
      return;
    }
    const image = document.querySelector("[data-detail-image]");
    const name = detail.querySelector("[data-detail-name]");
    const category = detail.querySelector("[data-detail-category]");
    const description = detail.querySelector("[data-detail-description]");
    const price = detail.querySelector("[data-detail-price]");
    const variants = detail.querySelector("[data-detail-variants]");
    const selectedVariantLabel = detail.querySelector("[data-detail-selected-variant]");
    const add = detail.querySelector("[data-detail-add]");
    if (image) { image.src = product.image; image.alt = `${product.name} concept image (stock photo)`; }
    if (name) name.textContent = product.name;
    if (category) category.textContent = product.category;
    if (description) description.textContent = `Concept only: ${product.description}`;
    if (price) price.textContent = `Preview ${money(product.price)}`;
    if (selectedVariantLabel) selectedVariantLabel.textContent = product.variants[0] || "Standard";
    if (variants) variants.replaceChildren(...product.variants.map((variant, index) => {
      const button = document.createElement("button");
      button.className = `option-pill${index === 0 ? " selected" : ""}`;
      button.type = "button";
      button.textContent = variant;
      button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      button.addEventListener("click", () => {
        variants.querySelectorAll(".option-pill").forEach((pill) => {
          pill.classList.remove("selected");
          pill.setAttribute("aria-pressed", "false");
        });
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
        if (selectedVariantLabel) selectedVariantLabel.textContent = variant;
      });
      return button;
    }));
    if (add) add.dataset.addToCart = product.id;
    document.title = `${product.name} | Glitter Bean Café`;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const socialTitle = document.querySelector('meta[property="og:title"]');
    const socialDescription = document.querySelector('meta[property="og:description"]');
    const pageDescription = `Preview concept for ${product.name}. Product details, availability, and pricing require café confirmation.`;
    if (descriptionMeta) descriptionMeta.content = pageDescription;
    if (socialTitle) socialTitle.content = document.title;
    if (socialDescription) socialDescription.content = pageDescription;
  }

  function initializeCart() {
    const root = document.querySelector("[data-cart-items]");
    const cart = readCart();
    let subtotal = 0;
    if (root) root.replaceChildren();
    cart.forEach((item) => {
      const product = catalog.find((entry) => entry.id === item.id);
      if (!product) return;
      subtotal += product.price * item.quantity;
      if (!root) return;
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div><h4>${product.name}</h4><p>${item.variant || product.category} · Preview only</p>
          <div class="cart-item-controls">
            <div class="qty-picker" aria-label="Quantity for ${product.name}">
              <button type="button" data-quantity="-1" data-id="${product.id}" data-variant="${item.variant || ""}" aria-label="Decrease quantity for ${product.name} ${item.variant || ""}">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-quantity="1" data-id="${product.id}" data-variant="${item.variant || ""}" aria-label="Increase quantity for ${product.name} ${item.variant || ""}">+</button>
            </div>
            <button type="button" class="small-btn ghost-btn" data-remove-item="${product.id}" data-variant="${item.variant || ""}">Remove</button>
          </div>
        </div><div class="price">${money(product.price * item.quantity)}</div>`;
      root.append(row);
    });
    if (root && !cart.length) {
      root.innerHTML = '<div class="empty-state"><h3>Your preview cart is empty</h3><p>Explore the catalog and add an item to see how the cart works.</p><a class="primary-btn" href="shop.html">Continue shopping</a></div>';
    }
    document.querySelectorAll("[data-cart-subtotal]").forEach((el) => { el.textContent = money(subtotal); });
    document.querySelectorAll("[data-cart-shipping]").forEach((el) => { el.textContent = "Not calculated"; });
    document.querySelectorAll("[data-cart-tax]").forEach((el) => { el.textContent = "Not calculated"; });
    document.querySelectorAll("[data-cart-total]").forEach((el) => { el.textContent = money(subtotal); });
  }

  function initializeSearch() {
    document.querySelectorAll('button[aria-label="Search"]').forEach((button) => {
      button.addEventListener("click", () => {
        let dialog = document.querySelector("#site-search");
        if (!dialog) {
          dialog = document.createElement("dialog");
          dialog.id = "site-search";
          dialog.className = "search-dialog";
          dialog.innerHTML = '<form method="dialog"><label for="site-search-input">Search products</label><input id="site-search-input" type="search" name="q" autocomplete="off" /><div class="search-dialog-actions"><button type="button" class="ghost-btn" data-close-search>Close</button><button type="submit" class="primary-btn">Search</button></div></form>';
          document.body.append(dialog);
          dialog.querySelector("[data-close-search]").addEventListener("click", () => dialog.close());
          dialog.querySelector("form").addEventListener("submit", (event) => {
            event.preventDefault();
            const query = dialog.querySelector("input").value.trim();
            window.location.href = `shop.html?q=${encodeURIComponent(query)}`;
          });
        }
        dialog.showModal();
        dialog.querySelector("input").focus();
      });
    });
  }

  function initializeFaqSearch() {
    const search = document.querySelector("#faq-search");
    const list = document.querySelector("[data-faq-list]");
    if (!search || !list) return;
    const items = [...list.querySelectorAll(".faq-item")];
    const empty = document.querySelector("[data-faq-empty]");
    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      let matches = 0;
      items.forEach((item) => {
        const visible = item.textContent.toLowerCase().includes(query);
        item.hidden = !visible;
        if (visible) matches += 1;
      });
      if (empty) empty.hidden = matches > 0;
    });
  }

  function initializeContactAndNewsletterForms() {
    document.querySelectorAll(".newsletter-form, .contact-card form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        let status = form.querySelector("[data-form-status]");
        if (!status) {
          status = document.createElement("p");
          status.dataset.formStatus = "";
          status.setAttribute("role", "status");
          status.setAttribute("aria-live", "polite");
          form.append(status);
        }
        status.textContent = "This preview form is not connected. Nothing was sent; café contact details need owner confirmation.";
      });
    });
  }

  document.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add-to-cart]");
    if (add) {
      const quantity = Number(document.querySelector("[data-product-quantity]")?.textContent || 1);
      const variant = document.querySelector("[data-detail-variants] .selected")?.textContent || "";
      addToCart(add.dataset.addToCart, Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 1, variant);
      return;
    }
    const remove = event.target.closest("[data-remove-item]");
    if (remove) {
      const removedId = remove.dataset.removeItem;
      const removedVariant = remove.dataset.variant || "";
      saveCart(readCart().filter((item) => item.id !== removedId || (item.variant || "") !== removedVariant));
      initializeCart();
      return;
    }
    const change = event.target.closest("[data-quantity]");
    if (change) {
      const delta = Number(change.dataset.quantity);
      const cart = readCart();
      const variant = change.dataset.variant || "";
      const item = cart.find((entry) => entry.id === change.dataset.id && (entry.variant || "") === variant);
      if (item) item.quantity = Math.max(1, Math.min(99, item.quantity + delta));
      saveCart(cart);
      initializeCart();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const nav = document.querySelector(".top-nav");
    if (header && nav) {
      const toggle = document.createElement("button");
      toggle.className = "mobile-menu-toggle";
      toggle.type = "button";
      toggle.textContent = "Menu";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", "primary-navigation");
      nav.id = "primary-navigation";
      nav.setAttribute("aria-label", "Main navigation");
      header.querySelector(".navbar")?.insertBefore(toggle, nav);
      toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    if (header && !document.querySelector(".preview-notice")) {
      const notice = document.createElement("div");
      notice.className = "preview-notice";
      notice.setAttribute("role", "note");
      notice.textContent = "Website preview · Business details, products, prices, and availability need café confirmation · Online orders and payments are not enabled";
      header.before(notice);
    }

    initializeCatalogs();
    initializeProductPage();
    initializeCart();
    initializeSearch();
    initializeFaqSearch();
    updateCartCount();

    document.querySelectorAll("img").forEach((image) => {
      image.decoding = "async";
      if (image.closest(".hero-card")) {
        image.loading = "eager";
        image.fetchPriority = "high";
      } else {
        image.loading = "lazy";
      }
    });

    const footerDestinations = {
      Shop: "shop.html",
      "Coffee Collection": "coffee.html",
      Subscriptions: "subscriptions.html",
      "Gift Cards": "gift-cards.html",
    };
    document.querySelectorAll(".footer-links li").forEach((item) => {
      const destination = footerDestinations[item.textContent.trim()];
      if (!destination) return;
      const link = document.createElement("a");
      link.href = destination;
      link.textContent = item.textContent;
      item.replaceChildren(link);
    });

    document.querySelectorAll("[data-quantity-step]").forEach((button) => {
      button.addEventListener("click", () => {
        const value = document.querySelector("[data-product-quantity]");
        if (!value) return;
        value.textContent = String(Math.max(1, Math.min(99, Number(value.textContent) + Number(button.dataset.quantityStep))));
      });
    });

    document.querySelectorAll(".gallery-thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const mainImage = document.querySelector("[data-detail-image]");
        const thumbImage = thumb.querySelector("img");
        if (mainImage && thumbImage) {
          mainImage.src = thumbImage.src;
          mainImage.alt = thumbImage.alt;
          document.querySelectorAll(".gallery-thumb").forEach((item) => {
            item.classList.remove("active");
            item.setAttribute("aria-pressed", "false");
          });
          thumb.classList.add("active");
          thumb.setAttribute("aria-pressed", "true");
        }
      });
    });

    initializeContactAndNewsletterForms();
  });
})();
