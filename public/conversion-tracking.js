(() => {
  if (window.__yanbalConversionTracking) return;
  window.__yanbalConversionTracking = true;
  const consentKey = "yanbal_analytics_consent";
  const get = (k, fallback = null) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const set = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* Optional storage or analytics must not block shopping. */
    }
  };
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  // Payment access credentials must never reach tags or page_location.
  const url = new URL(location.href);
  const orderId = url.searchParams.get("orderId");
  const access = new URLSearchParams(url.hash.slice(1)).get("access");
  if (orderId && access) {
    try {
      sessionStorage.setItem("yanbal_order_" + orderId, access);
    } catch {
      /* Optional storage or analytics must not block shopping. */
    }
  }
  if (url.pathname.startsWith("/pedido/") || url.pathname === "/gracias") {
    window.yanbalReturn = {
      orderId,
      paymentId: url.searchParams.get("payment_id"),
      accessToken: access,
    };
    history.replaceState(null, "", url.pathname);
  }
  let loaded = false;
  const sessionAttributionKey = "yanbal_attribution";
  function attribution() {
    if (!window.yanbalAnalyticsAllowed()) return {};
    let saved = {};
    try {
      saved = JSON.parse(sessionStorage.getItem(sessionAttributionKey) || "{}");
    } catch {
      /* Optional storage or analytics must not block shopping. */
    }
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
    ]) {
      if (url.searchParams.get(key))
        saved[key] = url.searchParams.get(key).slice(0, 180);
    }
    try {
      sessionStorage.setItem(sessionAttributionKey, JSON.stringify(saved));
    } catch {
      /* Optional storage or analytics must not block shopping. */
    }
    return saved;
  }
  window.yanbalAnalyticsAllowed = () => get(consentKey) === true;
  window.yanbalAttribution = attribution;
  function loadTags() {
    if (loaded || !window.yanbalAnalyticsAllowed()) return;
    loaded = true;
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    const script = (src) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      document.head.append(s);
    };
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    script("https://www.googletagmanager.com/gtm.js?id=GTM-NBHK5MMR");
    script("https://www.googletagmanager.com/gtag/js?id=AW-18340615060");
    window.gtag("js", new Date());
    window.gtag("config", "AW-18340615060");
    // GA4 routing remains owned by the retained GTM container; verify its published configuration.
    window.va =
      window.va ||
      function () {
        (window.vaq = window.vaq || []).push(arguments);
      };
    script("/_vercel/insights/script.js");
    attribution();
  }
  window.yanbalTrack = (event, ecommerce = {}) => {
    if (!window.yanbalAnalyticsAllowed()) return false;
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({ event, ecommerce });
    // Preserve the existing Ads checkout/lead goals. These are not purchase events.
    const adsGoal =
      event === "begin_checkout"
        ? "AW-18340615060/2pBzCITFmOYcEJSnvqlE"
        : event === "whatsapp_click"
          ? "AW-18340615060/JBeHCK6u3ukcEJSnvqlE"
          : null;
    if (adsGoal)
      window.gtag("event", "conversion", {
        send_to: adsGoal,
        currency: "COP",
        ...(Number.isFinite(ecommerce.value) ? { value: ecommerce.value } : {}),
        event_timeout: 650,
      });
    if (event === "whatsapp_click")
      window.gtag("event", "generate_lead", { method: "WhatsApp" });
    return true;
  };
  window.yanbalTrackContent = (event, details = {}) => {
    if (!window.yanbalAnalyticsAllowed()) return false;
    window.dataLayer.push({ event, ...details });
    return true;
  };
  window.yanbalTrackBeginCheckout = ({ cart = [], total = 0 } = {}) =>
    Promise.resolve(
      window.yanbalTrack("begin_checkout", {
        currency: "COP",
        value: total,
        items: cart.map((l) => ({
          item_id: l.sku || l.code || l.id,
          item_name: l.name,
          item_category: l.category,
          price: l.price,
          quantity: l.quantity,
        })),
      }),
    );
  window.yanbalTrackWhatsAppLead = () =>
    Promise.resolve(
      window.yanbalTrack("whatsapp_click", { method: "WhatsApp" }),
    );
  document.addEventListener("click", (e) => {
    const button = e.target.closest("[data-consent]");
    if (button) {
      const yes = button.dataset.consent === "yes";
      set(consentKey, yes);
      document.querySelector("[data-consent-banner]").hidden = true;
      if (yes) loadTags();
      else {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
        try {
          sessionStorage.removeItem(sessionAttributionKey);
        } catch {
          /* Optional storage or analytics must not block shopping. */
        }
      }
      window.dispatchEvent(new Event("yanbal-consent-changed"));
    }
    if (e.target.closest("[data-consent-settings]"))
      document.querySelector("[data-consent-banner]").hidden = false;
    const share = e.target.closest("[data-content-share]");
    if (share) {
      const method = share.dataset.contentShare;
      window.yanbalTrackContent("share", {
        method,
        content_type: "guide",
        item_id: share.dataset.contentId,
      });
      if (method === "native") {
        e.preventDefault();
        const data = {
          title: share.dataset.shareTitle,
          text: share.dataset.shareText,
          url: share.dataset.shareUrl,
        };
        if (navigator.share) navigator.share(data).catch(() => {});
        else if (navigator.clipboard)
          navigator.clipboard.writeText(data.url).then(() => {
            share.textContent = "Enlace copiado";
          });
      }
    }
    const link = e.target.closest("a[href]");
    if (link) {
      try {
        if (["wa.me", "api.whatsapp.com"].includes(new URL(link.href).hostname))
          window.yanbalTrackWhatsAppLead();
      } catch {
        /* Optional storage or analytics must not block shopping. */
      }
    }
  });
  const banner = document.querySelector("[data-consent-banner]");
  if (banner) banner.hidden = get(consentKey) !== null;
  loadTags();
})();
