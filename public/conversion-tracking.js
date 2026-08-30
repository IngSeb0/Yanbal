(() => {
  if (window.__yanbalConversionTracking) {
    return;
  }
  window.__yanbalConversionTracking = true;

  const googleAdsCheckoutConversion = "AW-18340615060/2pBzCITFmOYcEJSnvqlE";
  const googleAdsWhatsAppConversion = "AW-18340615060/JBeHCK6u3ukcEJSnvqlE";

  function hasGtag() {
    return typeof window.gtag === "function";
  }

  function isWhatsAppUrl(value) {
    try {
      const url = new URL(value, window.location.href);
      return url.hostname === "wa.me" || url.hostname === "api.whatsapp.com";
    } catch {
      return false;
    }
  }

  function eventValue(value) {
    const number = Number(value || 0);
    return Number.isFinite(number) && number > 0 ? number : undefined;
  }

  function trackConversion(params = {}) {
    if (!hasGtag()) {
      return Promise.resolve(false);
    }

    const sendTo = params.sendTo || googleAdsCheckoutConversion;

    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve(true);
      };

      window.setTimeout(finish, 650);
      window.gtag("event", "conversion", {
        send_to: sendTo,
        currency: "COP",
        value: eventValue(params.value),
        transaction_id: params.transactionId || `WA-${Date.now()}`,
        event_callback: finish,
        event_timeout: 650,
      });
    });
  }

  window.yanbalTrackBeginCheckout = function yanbalTrackBeginCheckout({
    cart = [],
    total = 0,
    orderId,
    payment = "whatsapp",
  } = {}) {
    if (!hasGtag()) {
      return Promise.resolve(false);
    }

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

    return trackConversion({
      sendTo: payment === "whatsapp" ? googleAdsWhatsAppConversion : googleAdsCheckoutConversion,
      value: total,
      transactionId: orderId,
    });
  };

  window.yanbalTrackWhatsAppLead = function yanbalTrackWhatsAppLead(label = "WhatsApp") {
    if (!hasGtag()) {
      return Promise.resolve(false);
    }

    window.gtag("event", "generate_lead", {
      method: "WhatsApp",
      event_category: "WhatsApp",
      event_label: label,
      page_location: window.location.href,
    });

    return trackConversion({
      sendTo: googleAdsWhatsAppConversion,
      transactionId: `WA-${Date.now()}`,
    });
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || !isWhatsAppUrl(link.href)) {
      return;
    }

    const label =
      link.dataset.whatsappCta ||
      link.getAttribute("aria-label") ||
      link.textContent?.trim() ||
      "WhatsApp";

    if (!link.target || link.target === "_self") {
      event.preventDefault();
      window.yanbalTrackWhatsAppLead(label).finally(() => {
        window.location.href = link.href;
      });
      return;
    }

    window.yanbalTrackWhatsAppLead(label);
  });
})();
