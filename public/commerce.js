(async () => {
  if (window.__yanbalCommerce) return;
  window.__yanbalCommerce = true;
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const money = (n) => "$" + Number(n).toLocaleString("es-CO");
  const normalize = (s) =>
    String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const escape = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const read = (k, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const save = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* Optional storage or analytics must not block shopping. */
    }
  };
  const track = (event, data) => window.yanbalTrack?.(event, data);
  const toast = (message) => {
    const box = $("[data-toast]");
    box.textContent = message;
    box.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => (box.hidden = true), 3200);
  };
  let catalog;
  try {
    const r = await fetch("/commerce-products.json");
    if (!r.ok) throw Error();
    catalog = await r.json();
  } catch {
    toast("No pudimos cargar los productos. Recarga para intentar nuevamente.");
    return;
  }
  const products = catalog.products,
    byId = new Map(products.map((p) => [p.id, p]));
  const path = (p) => "/producto/" + p.slug;
  const support = (p) =>
    "https://wa.me/" +
    catalog.whatsapp +
    "?text=" +
    encodeURIComponent(
      "Hola, tengo una pregunta sobre " +
        p.name +
        ", código " +
        p.sku +
        ". Precio: " +
        money(p.price) +
        ". " +
        location.origin +
        path(p),
    );
  const isAvailable = (p) => p.availability === "AVAILABLE_FOR_ORDER";
  const giftProfile = {
    perfume: /perfume|colonia/i,
    joyeria: /joyer[ií]a|aretes|collar|pulsera|accesorio/i,
    set: /set|combo|colecci[oó]n/i,
    sorpresa: /./,
  };
  const giftRecipient = {
    pareja: "para una pareja o alguien especial",
    amistad: "para agradecer a una amistad",
    familia: "para un familiar",
    yo: "para ti",
  };
  const giftCandidates = () =>
    products.filter(
      (p) =>
        isAvailable(p) &&
        p.giftable &&
        !p.promotionGroup &&
        p.price >= 50000 &&
        p.price <= 200000,
    );
  const giftCard = (p) => {
    const article = document.createElement("article");
    article.className = "gift-quiz-card";
    article.innerHTML =
      '<a href="' +
      path(p) +
      '"><img src="' +
      escape(p.image) +
      '" alt="' +
      escape(p.name) +
      '" width="400" height="480" loading="lazy"></a><div><small>' +
      escape(p.category) +
      " · Cód. " +
      escape(p.sku) +
      "</small><h3>" +
      escape(p.name) +
      "</h3><strong>" +
      money(p.price) +
      '</strong><button class="button button--ghost" type="button" data-add-to-cart="' +
      escape(p.id) +
      '" data-gift-quiz-result="' +
      escape(p.id) +
      '">Agregar al carrito</button></div>';
    return article;
  };
  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-gift-quiz]");
    if (!form) return;
    event.preventDefault();
    const answers = new FormData(form);
    const budget = Number(answers.get("budget"));
    const interest = String(answers.get("interest") || "sorpresa");
    const recipient = String(answers.get("recipient") || "pareja");
    const profile = giftProfile[interest] || giftProfile.sorpresa;
    const ranked = giftCandidates()
      .filter((p) => p.price <= budget)
      .filter((p) => profile.test(p.category + " " + p.name))
      .sort((a, b) => b.price - a.price);
    const chosen = (ranked.length
      ? ranked
      : giftCandidates().filter((p) => p.price <= budget)
    ).slice(0, 4);
    const results = $("[data-gift-quiz-results]");
    const cards = $("[data-gift-quiz-cards]");
    const heading = $("[data-gift-quiz-title]");
    const summary = $("[data-gift-quiz-summary]");
    const shipping = $("[data-gift-quiz-shipping]");
    if (!results || !cards || !heading || !summary || !shipping) return;
    cards.replaceChildren(...chosen.map(giftCard));
    heading.textContent = "Ideas " + (giftRecipient[recipient] || "para regalar");
    summary.textContent = chosen.length
      ? "Estas opciones corresponden a productos disponibles en el catálogo hasta " + money(budget) + "."
      : "No encontramos una opción en ese rango. Revisa el catálogo o consulta por WhatsApp.";
    shipping.textContent =
      budget >= 150000
        ? "Envío nacional gratis desde $150.000. Cúcuta y Bogotá tienen envío gratis sin mínimo adicional."
        : "Pedido mínimo $50.000. Cúcuta y Bogotá tienen envío gratis; en otros destinos el envío se confirma en checkout y es gratis desde $150.000.";
    results.hidden = false;
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    window.yanbalTrackContent?.("gift_quiz_complete", {
      content_type: "gift_quiz",
      budget,
      recipient,
      interest,
      result_count: chosen.length,
    });
  });
  document.addEventListener("click", (event) => {
    const result = event.target.closest("[data-gift-quiz-result]");
    if (result)
      window.yanbalTrackContent?.("gift_quiz_result_click", {
        content_type: "gift_quiz",
        item_id: result.dataset.giftQuizResult,
      });
  });
  const legacy = read("yanbal_cart_v1", []);
  let stored = read("yanbal_cart_v2", null);
  let cart =
    stored && Date.now() - stored.updatedAt < 30 * 86400000
      ? stored.items
      : !stored && Array.isArray(legacy)
        ? legacy
        : [];
  cart = (Array.isArray(cart) ? cart : [])
    .filter(
      (l) =>
        l && byId.has(l.id) && Number.isInteger(l.quantity) && l.quantity > 0,
    )
    .map((l) => ({ id: l.id, quantity: Math.min(20, l.quantity) }));
  const persist = () => {
    save("yanbal_cart_v2", { items: cart, updatedAt: Date.now() });
  };
  const lines = () =>
    cart.map((l) => ({ ...byId.get(l.id), quantity: l.quantity }));
  const subtotal = () => lines().reduce((s, l) => s + l.quantity * l.price, 0);
  const ecommerce = (list = lines()) => ({
    currency: "COP",
    value: list.reduce((s, l) => s + l.price * l.quantity, 0),
    items: list.map((l) => ({
      item_id: l.sku,
      item_name: l.name,
      item_category: l.category,
      price: l.price,
      quantity: l.quantity,
    })),
  });
  const card = (p) =>
    '<article class="shop-card" data-product-card><a class="shop-card__image" href="' +
    path(p) +
    '"><img src="' +
    escape(p.image) +
    '" alt="' +
    escape(p.name) +
    '" width="400" height="480" loading="lazy" decoding="async">' +
    (p.discount
      ? '<span class="discount-badge">−' + p.discount + "%</span>"
      : "") +
    '</a><div class="shop-card__body"><small>' +
    escape(p.category) +
    " · Cód. " +
    escape(p.sku) +
    '</small><h3><a href="' +
    path(p) +
    '">' +
    escape(p.name) +
    "</a></h3><p>" +
    escape(p.content || p.variant || "Producto Yanbal") +
    '</p><p class="price">' +
    (p.normal_price ? "<del>" + money(p.normal_price) + "</del>" : "") +
    "<strong>" +
    money(p.price) +
    "</strong></p>" +
    (p.savings
      ? '<p class="saving">Ahorras ' + money(p.savings) + "</p>"
      : "") +
    (p.saleLabel
      ? '<p class="promotion-note">' + escape(p.saleLabel) + "</p>"
      : "") +
    '<p class="availability">' +
    (isAvailable(p) ? "Disponible para pedido" : "Agotado temporalmente") +
    '</p><div class="buy-buttons"><button class="button button--primary" data-buy-now="' +
    escape(p.id) +
    '" ' +
    (!isAvailable(p) ? "disabled" : "") +
    '>Comprar ahora</button><button class="button button--ghost" data-add-to-cart="' +
    escape(p.id) +
    '" ' +
    (!isAvailable(p) ? "disabled" : "") +
    '>+ Agregar</button></div><a class="support-link" href="' +
    escape(support(p)) +
    '" target="_blank" rel="noreferrer">¿Preguntas? WhatsApp</a></div></article>';
  const itemMarkup = (l) =>
    '<article class="cart-row"><img src="' +
    escape(l.image) +
    '" alt="' +
    escape(l.name) +
    '" width="64" height="80"><div><a href="' +
    path(l) +
    '">' +
    escape(l.name) +
    "</a><small>Cód. " +
    escape(l.sku) +
    (l.unitsPerPack > 1 ? " · Paquete de 2 unidades" : "") +
    "</small><p>" +
    money(l.price) +
    " × " +
    l.quantity +
    " = <strong>" +
    money(l.price * l.quantity) +
    '</strong></p><div class="quantity-actions"><button type="button" data-quantity="-1" data-id="' +
    escape(l.id) +
    '" aria-label="Reducir cantidad de ' +
    escape(l.name) +
    '">−</button><span>' +
    l.quantity +
    '</span><button type="button" data-quantity="1" data-id="' +
    escape(l.id) +
    '" aria-label="Aumentar cantidad de ' +
    escape(l.name) +
    '">+</button><button type="button" data-remove="' +
    escape(l.id) +
    '">Eliminar</button></div></div></article>';
  let quote = null,
    quoteVersion = 0,
    checkoutKey = null;
  function renderCart() {
    const list = lines();
    $$("[data-cart-count]").forEach(
      (e) => (e.textContent = cart.reduce((s, l) => s + l.quantity, 0)),
    );
    $("[data-cart-items]").innerHTML = list.length
      ? list.map(itemMarkup).join("")
      : "<p>Aún no has agregado productos.</p>";
    $("[data-cart-subtotal]").textContent = "Subtotal: " + money(subtotal());
    $("[data-checkout-link]").hidden = !list.length;
    if ($("[data-checkout-items]")) {
      $("[data-checkout-items]").innerHTML = list.length
        ? list.map(itemMarkup).join("")
        : '<p>Tu carrito está vacío. <a href="/catalogo">Ver catálogo</a></p>';
      $("[data-subtotal]").textContent = money(subtotal());
    }
    const rec = products
      .filter(
        (p) =>
          isAvailable(p) &&
          !cart.some((l) => l.id === p.id) &&
          list.some((l) => l.category === p.category),
      )
      .slice(0, 2);
    $("[data-cross-sell]").hidden = !list.length || !rec.length;
    $("[data-recommendations]").innerHTML = rec
      .map(
        (p) =>
          "<p>" +
          escape(p.name) +
          " · " +
          money(p.price) +
          ' <button type="button" data-add-to-cart="' +
          escape(p.id) +
          '">+ Agregar</button></p>',
      )
      .join("");
  }
  function changed() {
    persist();
    renderCart();
    quote = null;
    checkoutKey = null;
    if ($("[data-checkout-form]")) refreshQuote();
  }
  function add(id, buy) {
    const p = byId.get(id);
    if (!p || !isAvailable(p)) return;
    const step = buy && p.promotionGroup ? 2 : 1,
      existing = cart.find((l) => l.id === id);
    if (existing && existing.quantity + step > 20)
      return toast("Máximo 20 por referencia.");
    if (existing) existing.quantity += step;
    else cart.push({ id, quantity: step });
    changed();
    track("add_to_cart", ecommerce([{ ...p, quantity: step }]));
    if (buy) location.href = "/checkout";
    else toast(p.name + " agregado al carrito");
  }
  document.addEventListener("click", (e) => {
    const buy = e.target.closest("[data-buy-now]"),
      addButton = e.target.closest("[data-add-to-cart]");
    if (buy) {
      e.preventDefault();
      add(buy.dataset.buyNow, true);
    } else if (addButton) {
      e.preventDefault();
      add(addButton.dataset.addToCart || addButton.dataset.productId, false);
    }
    if (e.target.closest("[data-cart-open]")) {
      e.preventDefault();
      renderCart();
      $("[data-cart-dialog]").showModal();
      track("view_cart", ecommerce());
    }
    if (e.target.closest("[data-cart-close]")) $("[data-cart-dialog]").close();
    const qty = e.target.closest("[data-quantity]"),
      remove = e.target.closest("[data-remove]");
    if (qty) {
      const l = cart.find((l) => l.id === qty.dataset.id);
      if (l) {
        l.quantity = Math.min(20, l.quantity + Number(qty.dataset.quantity));
        cart = cart.filter((l) => l.quantity > 0);
        changed();
      }
    }
    if (remove) {
      cart = cart.filter((l) => l.id !== remove.dataset.remove);
      changed();
    }
  });
  window.addEventListener("storage", (e) => {
    if (e.key === "yanbal_cart_v2") {
      const v = read("yanbal_cart_v2", { items: [] });
      cart = (Array.isArray(v?.items) ? v.items : [])
        .filter(
          (l) =>
            l &&
            byId.has(l.id) &&
            Number.isInteger(l.quantity) &&
            l.quantity > 0,
        )
        .map((l) => ({ id: l.id, quantity: Math.min(20, l.quantity) }));
      renderCart();
      if ($("[data-checkout-form]")) refreshQuote();
    }
  });
  persist();
  renderCart();
  const productId = $("[data-product-detail]")?.dataset.productDetail;
  if (productId) {
    const p = byId.get(productId);
    if (p) {
      let viewed = false;
      const view = () => {
        if (!viewed && window.yanbalAnalyticsAllowed?.()) {
          track("view_item", ecommerce([{ ...p, quantity: 1 }]));
          viewed = true;
        }
      };
      view();
      window.addEventListener("yanbal-consent-changed", view);
      $(".help-fab").href = support(p);
    }
  }
  const filterForm = $("[data-catalog-form]");
  if (filterForm) {
    const query = new URLSearchParams(location.search);
    for (const [key, value] of query) {
      const input = filterForm.elements.namedItem(key);
      if (input) {
        if (input.type === "checkbox") input.checked = value === "1";
        else input.value = value;
      }
    }
    let limit = 24,
      filtered = products,
      timer;
    function filter(searchEvent = false) {
      const f = Object.fromEntries(new FormData(filterForm)),
        q = normalize(f.q);
      filtered = products.filter((p) => {
        const text = normalize(
          [
            p.name,
            p.sku,
            p.category,
            p.variant,
            p.content,
            p.description,
            p.promotion_detail,
          ].join(" "),
        );
        return (
          (!q || q.split(/\s+/).every((t) => text.includes(t))) &&
          (!f.category || p.category === f.category) &&
          (!f.min || p.price >= Number(f.min)) &&
          (!f.max || p.price <= Number(f.max)) &&
          p.discount >= Number(f.discount || 0) &&
          (!f.offers ||
            p.discount > 0 ||
            p.promotionGroup ||
            p.unitsPerPack > 1) &&
          (!f.gifts || p.giftable) &&
          (!f.type || text.includes(normalize(f.type))) &&
          (!f.gender ||
            (f.gender === "hombre"
              ? /masculin|hombre/.test(text)
              : !/masculin|hombre/.test(text)))
        );
      });
      const rank = (p) => {
        const n = catalog.featured.indexOf(p.id);
        return n < 0 ? 999 : n;
      };
      filtered.sort((a, b) =>
        f.sort === "price"
          ? a.price - b.price
          : f.sort === "price-desc"
            ? b.price - a.price
            : f.sort === "discount"
              ? b.discount - a.discount
              : f.sort === "name"
                ? a.name.localeCompare(b.name, "es")
                : rank(a) - rank(b),
      );
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(f))
        if (value && value !== "0" && value !== "featured")
          params.set(key, value === "on" ? "1" : value);
      history.replaceState(
        null,
        "",
        location.pathname + (params.size ? "?" + params : "") + location.hash,
      );
      renderResults();
      if (searchEvent && q)
        track("search", { search_term: q, results_count: filtered.length });
    }
    function renderResults() {
      $("[data-catalog-grid]").innerHTML = filtered
        .slice(0, limit)
        .map(card)
        .join("");
      $("[data-results-count]").textContent =
        filtered.length +
        " productos · Mostrando " +
        Math.min(filtered.length, limit);
      $("[data-catalog-empty]").hidden = !!filtered.length;
      $("[data-load-more]").hidden = filtered.length <= limit;
    }
    filterForm.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        limit = 24;
        filter(true);
      }, 250);
    });
    filterForm.addEventListener("change", () => {
      clearTimeout(timer);
      limit = 24;
      filter(true);
    });
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      limit = 24;
      filter(true);
    });
    filterForm.addEventListener("reset", () =>
      setTimeout(() => {
        limit = 24;
        filter();
      }, 0),
    );
    $("[data-load-more]").addEventListener("click", () => {
      limit += 24;
      renderResults();
    });
    filter();
  }
  async function post(url, payload) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return { response, data };
  }
  const form = $("[data-checkout-form]");
  async function refreshQuote() {
    if (!form) return;
    const version = ++quoteVersion;
    quote = null;
    $("[data-pay]").disabled = true;
    $("[data-total]").textContent = "—";
    $("[data-shipping]").textContent = "Por calcular";
    const departmentCode = form.elements.departmentCode.value,
      cityCode = form.elements.cityCode.value;
    if (!cart.length || !departmentCode || !cityCode) {
      $("[data-shipping-message]").textContent = cart.length
        ? "Selecciona tu municipio para calcular el envío."
        : "Agrega productos para calcular el envío.";
      $("[data-free-shipping]").textContent = "";
      return;
    }
    $("[data-shipping-message]").textContent = "Calculando envío…";
    try {
      const { data } = await post("/api/cart/quote", {
        items: cart,
        departmentCode,
        cityCode,
      });
      if (version !== quoteVersion) return;
      if (!data.ok) throw Error(data.error);
      quote = data;
      $("[data-subtotal]").textContent = money(data.subtotal);
      $("[data-shipping]").textContent = data.configured
        ? data.shipping === 0
          ? "Gratis"
          : money(data.shipping)
        : "Requiere confirmación";
      $("[data-total]").textContent = data.configured
        ? money(data.total)
        : "Pendiente de envío";
      $("[data-shipping-message]").textContent = data.message;
      $("[data-pay]").disabled = !data.checkoutEligible;
      $("[data-free-shipping]").textContent =
        data.configured && data.freeShipping
          ? "Tu pedido tiene envío gratis."
          : data.configured && data.freeShippingThreshold
            ? data.subtotal >= data.freeShippingThreshold
              ? "Tu pedido tiene envío gratis."
              : "Te faltan " +
                money(data.freeShippingThreshold - data.subtotal) +
                " para obtener envío gratis."
            : "";
      if (data.checkoutEligible)
        track("add_shipping_info", {
          ...ecommerce(data.items),
          shipping_tier: "standard",
        });
    } catch (err) {
      if (version === quoteVersion)
        $("[data-shipping-message]").textContent =
          err.message || "No pudimos calcular el envío. Intenta nuevamente.";
    }
  }
  if (form) {
    track("begin_checkout", ecommerce());
    let locations = [];
    try {
      const r = await fetch("/municipalities.json");
      locations = await r.json();
    } catch {
      $("[data-checkout-status]").textContent =
        "No pudimos cargar los municipios. Recarga para reintentar.";
    }
    const department = form.elements.departmentCode,
      city = form.elements.cityCode;
    const departments = [
      ...new Map(
        locations.map((m) => [m.departmentCode, m.department]),
      ).entries(),
    ].sort((a, b) => a[1].localeCompare(b[1], "es"));
    department.innerHTML =
      '<option value="">Selecciona tu departamento</option>' +
      departments
        .map(
          ([code, name]) =>
            '<option value="' + code + '">' + escape(name) + "</option>",
        )
        .join("");
    function updateCities() {
      city.innerHTML =
        '<option value="">Selecciona tu municipio</option>' +
        locations
          .filter((m) => m.departmentCode === department.value)
          .sort((a, b) => a.name.localeCompare(b.name, "es"))
          .map(
            (m) =>
              '<option value="' + m.code + '">' + escape(m.name) + "</option>",
          )
          .join("");
      city.disabled = !department.value;
    }
    department.addEventListener("change", () => {
      updateCities();
      refreshQuote();
    });
    city.addEventListener("change", () => {
      checkoutKey = null;
      refreshQuote();
    });
    $$("[data-city]").forEach((b) =>
      b.addEventListener("click", () => {
        const m = locations.find((m) => m.code === b.dataset.city);
        department.value = m.departmentCode;
        updateCities();
        city.value = m.code;
        checkoutKey = null;
        refreshQuote();
      }),
    );
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!cart.length) return;
      const customer = Object.fromEntries(new FormData(form)),
        errors = {};
      const phone = String(customer.phone)
        .replace(/[\s()+.-]/g, "")
        .replace(/^57(?=3\d{9}$)/, "");
      if (String(customer.name).trim().length < 3)
        errors.name = "Escribe tu nombre completo.";
      if (!/^3\d{9}$/.test(phone))
        errors.phone = "Escribe un celular colombiano de 10 dígitos.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
        errors.email = "Revisa tu correo electrónico.";
      if (String(customer.address).trim().length < 5)
        errors.address = "Escribe la dirección de entrega.";
      for (const key of ["neighborhood", "departmentCode", "cityCode"])
        if (!customer[key]) errors[key] = "Completa este campo.";
      $$("[data-error]").forEach((el) => {
        el.textContent = errors[el.dataset.error] || "";
        const input = form.elements.namedItem(el.dataset.error);
        input.setAttribute("aria-invalid", String(!!errors[el.dataset.error]));
      });
      if (Object.keys(errors).length) {
        form.elements.namedItem(Object.keys(errors)[0]).focus();
        return;
      }
      if (!quote?.configured) {
        await refreshQuote();
        return;
      }
      $("[data-pay]").disabled = true;
      $("[data-checkout-status]").textContent = "Preparando tu pedido…";
      checkoutKey = checkoutKey || crypto.randomUUID();
      try {
        const { response, data } = await post("/api/cart/checkout", {
          customer,
          items: cart,
          acceptedTotal: quote.total,
          idempotencyKey: checkoutKey,
          analyticsConsent: window.yanbalAnalyticsAllowed?.() === true,
          attribution: window.yanbalAttribution?.() || {},
        });
        if (data.orderId && data.accessToken) {
          try {
            sessionStorage.setItem(
              "yanbal_order_" + data.orderId,
              data.accessToken,
            );
            sessionStorage.setItem("yanbal_last_order", data.orderId);
          } catch {
            /* The signed return carries access in its fragment if storage is unavailable. */
          }
        }
        if (!data.ok) {
          if (response.status !== 409) checkoutKey = null;
          if (data.fields)
            for (const [field, error] of Object.entries(data.fields)) {
              const el = $('[data-error="' + field + '"]');
              if (el) el.textContent = error;
            }
          if (response.status === 409) await refreshQuote();
          throw Error(data.error);
        }
        const paymentData = {
          ...ecommerce(),
          payment_type: "Mercado Pago",
        };
        track("add_payment_info", paymentData);
        track("payment_click", paymentData);
        // Keep cart until the server reports an approved payment.
        location.assign(data.checkoutUrl);
      } catch (err) {
        $("[data-checkout-status]").textContent =
          err.message || "No pudimos abrir el pago. Tu carrito se conserva.";
        $("[data-pay]").disabled = !quote?.checkoutEligible;
      }
    });
  }
  const result = $("[data-order-result]");
  if (result) {
    const returned = window.yanbalReturn || {},
      params = new URLSearchParams(location.search);
    let orderId = returned.orderId || params.get("orderId");
    try {
      orderId = orderId || sessionStorage.getItem("yanbal_last_order");
    } catch {
      /* Optional storage or analytics must not block shopping. */
    }
    let accessToken = returned.accessToken;
    try {
      accessToken =
        accessToken || sessionStorage.getItem("yanbal_order_" + orderId);
    } catch {
      /* Optional storage or analytics must not block shopping. */
    }
    let order = null;
    async function purchase() {
      if (!order?.paid || !window.yanbalAnalyticsAllowed?.()) return;
      try {
        const { data } = await post("/api/cart/purchase", {
          orderId,
          accessToken,
          analyticsConsent: true,
        });
        if (data.event) track("purchase", data.event);
      } catch {
        /* Optional storage or analytics must not block shopping. */
      }
    }
    async function refresh() {
      $("[data-refresh-order]").disabled = true;
      try {
        if (!orderId || !accessToken)
          throw Error(
            "No pudimos verificar este pedido en tu navegador. Consulta por WhatsApp con tu número de pedido.",
          );
        const { data } = await post("/api/mercadopago/payment-status", {
          orderId,
          accessToken,
          paymentId: returned.paymentId,
        });
        if (!data.ok) throw Error(data.error);
        order = data.order;
        const failed = ["rejected", "cancelled", "preference_failed"].includes(
            order.paymentStatus,
          ),
          refunded = ["refunded", "charged_back"].includes(order.paymentStatus);
        $("[data-order-title]").textContent = order.paid
          ? "¡Tu pedido está confirmado!"
          : refunded
            ? "Tu pago fue devuelto"
            : failed
              ? "No pudimos completar el pago"
              : "Tu pago está pendiente";
        $("[data-order-message]").textContent = order.paid
          ? "Pago recibido. Ya podemos procesar tu pedido."
          : refunded
            ? "Contáctanos si necesitas información sobre la devolución."
            : failed
              ? "Tu carrito se conserva. Puedes intentar nuevamente con los medios disponibles en Mercado Pago."
              : "Mercado Pago todavía está procesando el pago. Tu pedido se confirmará cuando recibamos la aprobación.";
        $("[data-order-summary]").innerHTML =
          "<h2>Pedido #" +
          escape(order.id) +
          "</h2>" +
          order.items
            .map(
              (l) =>
                "<p>" +
                escape(l.name) +
                " × " +
                l.quantity +
                " — " +
                money(l.price * l.quantity) +
                "</p>",
            )
            .join("") +
          "<p>Subtotal: " +
          money(order.subtotal) +
          " · Envío: " +
          money(order.shipping) +
          "</p><p><strong>Total: " +
          money(order.total) +
          "</strong></p><p>Entrega: " +
          escape(order.city) +
          " · " +
          escape(order.department) +
          "</p>";
        $("[data-retry]").hidden = !failed;
        $("[data-order-next]").hidden = !order.paid;
        $("[data-order-support]").href =
          "https://wa.me/" +
          catalog.whatsapp +
          "?text=" +
          encodeURIComponent(
            "Hola, quiero consultar el estado del pedido #" + order.id + ".",
          );
        $("[data-order-support]").textContent =
          "Consultar mi pedido por WhatsApp";
        if (order.paid) {
          const key = "yanbal_cleared_" + order.id;
          if (!read(key, false)) {
            for (const item of order.items) {
              const found = cart.find((l) => l.id === item.id);
              if (found)
                found.quantity = Math.max(0, found.quantity - item.quantity);
            }
            cart = cart.filter((l) => l.quantity > 0);
            persist();
            renderCart();
            save(key, true);
          }
          await purchase();
        }
      } catch (err) {
        $("[data-order-title]").textContent = "No pudimos verificar el estado";
        $("[data-order-message]").textContent = err.message;
      } finally {
        $("[data-refresh-order]").disabled = false;
      }
    }
    $("[data-refresh-order]").addEventListener("click", refresh);
    window.addEventListener("yanbal-consent-changed", purchase);
    await refresh();
  }
})();
