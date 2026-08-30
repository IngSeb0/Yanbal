(function () {
  const copyByStatus = {
    success: {
      eyebrow: "Pago recibido",
      title: "Gracias, recibimos tu pago",
      copy:
        "Tu pedido Yanbal quedó registrado. Te escribiré por WhatsApp Business para confirmar disponibilidad, entrega y datos finales.",
    },
    approved: {
      eyebrow: "Pago aprobado",
      title: "Gracias, recibimos tu pago",
      copy:
        "Tu pedido Yanbal quedó registrado. Te escribiré por WhatsApp Business para confirmar disponibilidad, entrega y datos finales.",
    },
    pending: {
      eyebrow: "Pago en revisión",
      title: "Gracias, tu pago está pendiente",
      copy:
        "Mercado Pago está revisando la transacción. Puedes confirmar por WhatsApp para separar el pedido mientras se actualiza el estado.",
    },
    failure: {
      eyebrow: "Pago no finalizado",
      title: "Te ayudo a terminar la compra",
      copy:
        "El intento de pago no se completó. Escríbeme por WhatsApp y revisamos otra forma de finalizar tu pedido Yanbal.",
    },
    rejected: {
      eyebrow: "Pago rechazado",
      title: "Te ayudo a terminar la compra",
      copy:
        "El intento de pago fue rechazado. Escríbeme por WhatsApp y revisamos otra forma de finalizar tu pedido Yanbal.",
    },
  };

  const params = new URLSearchParams(window.location.search);
  const status = copyByStatus[params.get("status")] ? params.get("status") : "pending";
  const copy = copyByStatus[status];
  const orderId = params.get("orderId") || "";
  const product = params.get("product") || "";
  const reference = params.get("reference") || "";
  const whatsapp = params.get("wa");

  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  setText("[data-thanks-eyebrow]", copy.eyebrow);
  setText("[data-thanks-title]", copy.title);
  setText("[data-thanks-copy]", copy.copy);
  setText("[data-thanks-status-line]", `estado: ${copy.eyebrow.toLowerCase()}`);
  setText("[data-thanks-order]", orderId || "Pedido Yanbal");
  setText("[data-thanks-product]", product || "Producto o carrito de campaña");

  if (whatsapp) {
    document.querySelectorAll("[data-thanks-whatsapp]").forEach((link) => {
      link.setAttribute("href", whatsapp);
    });
  }

  const statusList = document.querySelector("[data-thanks-status-list]");

  if (statusList) {
    statusList.replaceChildren();

    const statusPill = document.createElement("span");
    statusPill.className = "status-pill";
    statusPill.textContent = copy.eyebrow;
    statusList.append(statusPill);

    if (reference) {
      const referencePill = document.createElement("span");
      referencePill.textContent = `Referencia Mercado Pago: ${reference}`;
      statusList.append(referencePill);
    }

    if (orderId) {
      const orderPill = document.createElement("span");
      orderPill.textContent = `Pedido: ${orderId}`;
      statusList.append(orderPill);
    }
  }
})();
