(() => {
  const cartKey = "yanbal_cart_v1";
  const maxUploadBytes = 12 * 1024 * 1024;
  const googleAdsCheckoutConversion = "AW-18340615060/2pBzCITFmOYcEJSnvqlE";
  const googleAdsWhatsAppConversion = "AW-18340615060/JBeHCK6u3ukcEJSnvqlE";
  const money = new Intl.NumberFormat("es-CO");

  const selectors = {
    count: "[data-cart-count]",
    items: "[data-cart-items]",
    empty: "[data-cart-empty]",
    total: "[data-cart-total]",
    drawer: "[data-cart-drawer]",
    backdrop: "[data-cart-backdrop]",
    status: "[data-cart-status]",
    campaignFeed: "[data-campaign-feed]",
    uploadStatus: "[data-upload-status]",
    productSearch: "[data-product-search]",
    productCategoryFilter: "[data-product-category-filter]",
    productLine: "[data-product-line]",
  };

  function readCart() {
    try {
      const value = JSON.parse(localStorage.getItem(cartKey) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function writeCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  function formatCop(value) {
    return `$${money.format(Number(value || 0))}`;
  }

  function setStatus(message, fallbackUrl) {
    const status = document.querySelector(selectors.status);
    if (!status) {
      return;
    }

    status.replaceChildren();
    if (message) {
      status.append(document.createTextNode(message));
    }
    if (fallbackUrl) {
      const link = document.createElement("a");
      link.href = fallbackUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = " Finalizar por WhatsApp";
      status.append(link);
    }
  }

  function getProductFromElement(element) {
    return {
      id: element.dataset.productId,
      name: element.dataset.productName,
      category: element.dataset.productCategory,
      price: Number(element.dataset.productPrice || 0),
      image: element.dataset.productImage,
      code: element.dataset.productCode,
      page: element.dataset.productPage,
      variant: element.dataset.productVariant,
    };
  }

  function trackBeginCheckout({ cart, total, orderId, payment }) {
    if (typeof window.yanbalTrackBeginCheckout === "function") {
      return window.yanbalTrackBeginCheckout({ cart, total, orderId, payment });
    }

    if (typeof window.gtag !== "function") {
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve(true);
      };

      window.setTimeout(finish, 650);

      const items = cart.map((item) => ({
        item_id: item.code || item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity,
      }));

      window.gtag("event", "begin_checkout", {
        currency: "COP",
        value: Number(total || 0),
        transaction_id: orderId,
        payment_type: payment === "mercadopago" ? "Mercado Pago" : "WhatsApp",
        items,
      });

      window.gtag("event", "conversion", {
        send_to: payment === "whatsapp" ? googleAdsWhatsAppConversion : googleAdsCheckoutConversion,
        value: Number(total || 0),
        currency: "COP",
        transaction_id: orderId,
        event_callback: finish,
        event_timeout: 650,
      });
    });
  }

  function trackAddToCart(product) {
    if (typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", "add_to_cart", {
      currency: "COP",
      value: Number(product.price || 0),
      items: [
        {
          item_id: product.code || product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  }

  function addToCart(product) {
    if (!product.id || !product.price) {
      return;
    }

    const cart = readCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    writeCart(cart);
    trackAddToCart(product);
    renderCart();
    openCart();
  }

  function updateQuantity(id, delta) {
    const cart = readCart()
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      )
      .filter((item) => item.quantity > 0);
    writeCart(cart);
    renderCart();
  }

  function removeItem(id) {
    writeCart(readCart().filter((item) => item.id !== id));
    renderCart();
  }

  function setCartOpen(open) {
    document.querySelectorAll(`${selectors.drawer}, ${selectors.backdrop}`).forEach((element) => {
      element.hidden = !open;
    });
    document.body.style.overflow = open ? "hidden" : "";
  }

  function openCart() {
    setCartOpen(true);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function renderCart() {
    const cart = readCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

    document.querySelectorAll(selectors.count).forEach((element) => {
      element.textContent = count > 0 ? String(count) : "";
      element.hidden = count === 0;
    });

    document.querySelectorAll("[data-cart-open]").forEach((element) => {
      element.setAttribute(
        "aria-label",
        count > 0 ? `Abrir carrito con ${count} producto${count === 1 ? "" : "s"}` : "Abrir carrito",
      );
    });

    document.querySelectorAll(selectors.total).forEach((element) => {
      element.textContent = formatCop(total);
    });

    const list = document.querySelector(selectors.items);
    const empty = document.querySelector(selectors.empty);
    if (!list || !empty) {
      return;
    }

    list.replaceChildren();
    empty.hidden = cart.length > 0;

    cart.forEach((item) => {
      const article = document.createElement("article");
      article.className = "cart-item";

      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.name;
      image.loading = "lazy";

      const body = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = item.name;
      const meta = document.createElement("p");
      const details = [
        item.category,
        item.code ? `Cód. ${item.code}` : "",
        item.page ? `Pág. ${item.page}` : "",
        item.variant || "",
        `${formatCop(item.price)} c/u`,
      ].filter(Boolean);
      meta.textContent = details.join(" · ");

      const controls = document.createElement("div");
      controls.className = "cart-item__controls";

      const minus = document.createElement("button");
      minus.type = "button";
      minus.dataset.cartDec = item.id;
      minus.textContent = "-";

      const quantity = document.createElement("strong");
      quantity.textContent = String(item.quantity);

      const plus = document.createElement("button");
      plus.type = "button";
      plus.dataset.cartInc = item.id;
      plus.textContent = "+";

      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.cartRemove = item.id;
      remove.textContent = "×";
      remove.ariaLabel = `Quitar ${item.name}`;

      const lineTotal = document.createElement("strong");
      lineTotal.textContent = formatCop(item.quantity * item.price);

      controls.append(minus, quantity, plus, remove, lineTotal);
      body.append(title, meta, controls);
      article.append(image, body);
      list.append(article);
    });
  }

  async function submitCart(form, submitter) {
    const cart = readCart();
    if (!cart.length) {
      setStatus("Agrega al menos un producto.");
      return;
    }

    const data = new FormData(form);
    const payment = submitter?.value || "mercadopago";
    setStatus(payment === "mercadopago" ? "Abriendo pago seguro con Mercado Pago..." : "Preparando pedido por WhatsApp...");

    let result;
    try {
      const response = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment,
          items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
          customer: {
            name: data.get("name"),
            phone: data.get("phone"),
            city: data.get("city"),
            address: data.get("address"),
            notes: data.get("notes"),
          },
        }),
      });
      result = await response.json();
    } catch {
      setStatus("No se pudo conectar con el servidor. Intenta de nuevo o escríbeme por WhatsApp.");
      return;
    }

    if (!result.ok) {
      setStatus(result.error || "No se pudo preparar el pedido.", result.whatsappUrl);
      return;
    }

    const nextUrl = payment === "mercadopago" ? result.checkoutUrl : result.whatsappUrl;
    if (!nextUrl) {
      setStatus(
        payment === "mercadopago"
          ? "Mercado Pago no devolvió una pasarela disponible. Tu carrito sigue guardado."
          : "No se pudo abrir WhatsApp. Tu carrito sigue guardado.",
        result.whatsappUrl,
      );
      return;
    }

    setStatus(
      payment === "mercadopago"
        ? "Abriendo pasarela segura de Mercado Pago..."
        : "Abriendo WhatsApp para confirmar el pedido...",
    );
    await trackBeginCheckout({
      cart,
      total: result.total,
      orderId: result.orderId,
      payment,
    });
    writeCart([]);
    renderCart();
    window.location.href = nextUrl;
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function uploadCampaign(form) {
    const status = document.querySelector(selectors.uploadStatus);
    const data = new FormData(form);
    const file = data.get("catalogFile");
    const externalUrl = String(data.get("externalUrl") || "").trim();

    if (!externalUrl && (!file || !file.size)) {
      if (status) status.textContent = "Adjunta un archivo o pega una URL pública.";
      return;
    }

    if (file?.size > maxUploadBytes) {
      if (status) status.textContent = "El archivo supera 12 MB. Usa una URL pública para PDFs grandes.";
      return;
    }

    if (status) status.textContent = "Subiendo campaña...";

    const payload = {
      adminToken: data.get("adminToken"),
      campaignCode: data.get("campaignCode"),
      campaignName: data.get("campaignName"),
      title: data.get("title"),
      notes: data.get("notes"),
      externalUrl,
    };

    if (file && file.size) {
      payload.fileName = file.name;
      payload.mimeType = file.type || "application/pdf";
      payload.sizeBytes = file.size;
      payload.fileBase64 = await readFileAsDataUrl(file);
    }

    const response = await fetch("/api/admin/upload-catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!result.ok) {
      if (status) status.textContent = result.error || "No se pudo subir la campaña.";
      return;
    }

    if (status) status.textContent = "Campaña guardada. Actualizando catálogo...";
    form.reset();
    await loadCampaigns();
  }

  function campaignCard(upload) {
    const article = document.createElement("article");
    article.className = "catalog-card";

    const body = document.createElement("div");
    body.className = "catalog-card__body";

    const eyebrow = document.createElement("p");
    eyebrow.className = "catalog-card__eyebrow";
    eyebrow.textContent = "Catálogo cargado";

    const title = document.createElement("h3");
    title.textContent = upload.title;

    const description = document.createElement("p");
    description.className = "catalog-card__description";
    const uploaded = upload.uploaded_at
      ? new Date(upload.uploaded_at).toLocaleDateString("es-CO")
      : "fecha reciente";
    description.textContent = `${upload.file_name} · ${uploaded}`;

    const link = document.createElement("a");
    link.className = "order-link";
    link.href = upload.public_url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Abrir catálogo";

    body.append(eyebrow, title, description, link);
    article.append(body);
    return article;
  }

  async function loadCampaigns() {
    const feed = document.querySelector(selectors.campaignFeed);
    if (!feed) {
      return;
    }

    try {
      const response = await fetch("/api/catalog/list", { headers: { accept: "application/json" } });
      const result = await response.json();
      feed.replaceChildren();

      if (!result.uploads?.length) {
        const empty = document.createElement("article");
        empty.className = "catalog-card catalog-card--empty";
        const body = document.createElement("div");
        body.className = "catalog-card__body";
        const eyebrow = document.createElement("p");
        eyebrow.className = "catalog-card__eyebrow";
        eyebrow.textContent = result.databaseConfigured ? "Servidor activo" : "Base de datos pendiente";
        const title = document.createElement("h3");
        title.textContent = result.databaseConfigured
          ? "Sin catálogos cargados aún"
          : "Configura Supabase en Vercel";
        const text = document.createElement("p");
        text.className = "catalog-card__description";
        text.textContent = result.databaseConfigured
          ? "Usa el panel de administrador para subir el primer catálogo de campaña."
          : "Cuando estén las variables de Supabase, esta sección mostrará las campañas cargadas.";
        body.append(eyebrow, title, text);
        empty.append(body);
        feed.append(empty);
        return;
      }

      result.uploads.forEach((upload) => feed.append(campaignCard(upload)));
    } catch {
      return;
    }
  }

  function filterProducts() {
    const search = document.querySelector(selectors.productSearch)?.value.trim().toLowerCase() || "";
    const category = document.querySelector(selectors.productCategoryFilter)?.value || "";
    const hasFilter = Boolean(search || category);

    document.querySelectorAll(".defined-product-group").forEach((group) => {
      let visibleCount = 0;
      group.querySelectorAll(selectors.productLine).forEach((card) => {
        const matchesSearch = !search || card.dataset.searchText?.includes(search);
        const matchesCategory = !category || card.dataset.productCategory === category;
        const visible = Boolean(matchesSearch && matchesCategory);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      group.hidden = hasFilter && visibleCount === 0;
      if (hasFilter && visibleCount > 0) {
        group.open = true;
      }
    });
  }

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      addToCart(getProductFromElement(addButton));
      return;
    }

    if (event.target.closest("[data-cart-open]")) {
      event.preventDefault();
      openCart();
      return;
    }

    if (event.target.closest("[data-cart-close]") || event.target.closest(selectors.backdrop)) {
      closeCart();
      return;
    }

    const inc = event.target.closest("[data-cart-inc]");
    if (inc) {
      updateQuantity(inc.dataset.cartInc, 1);
      return;
    }

    const dec = event.target.closest("[data-cart-dec]");
    if (dec) {
      updateQuantity(dec.dataset.cartDec, -1);
      return;
    }

    const remove = event.target.closest("[data-cart-remove]");
    if (remove) {
      removeItem(remove.dataset.cartRemove);
    }
  });

  document.addEventListener("submit", (event) => {
    const cartForm = event.target.closest("[data-cart-checkout-form]");
    if (cartForm) {
      event.preventDefault();
      submitCart(cartForm, event.submitter);
      return;
    }

    const uploadForm = event.target.closest("[data-catalog-upload-form]");
    if (uploadForm) {
      event.preventDefault();
      uploadCampaign(uploadForm);
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches(selectors.productSearch)) {
      filterProducts();
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches(selectors.productCategoryFilter)) {
      filterProducts();
    }
  });

  renderCart();
  loadCampaigns();
  filterProducts();
})();
