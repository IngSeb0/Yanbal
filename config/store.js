// Edit only with confirmed business information. Null never means free shipping.
export const store = {
  name: "Yanbal · Belleza en Colombia",
  url: "https://yanbal-promos-cucuta-bogota.vercel.app",
  whatsapp: "573026293535",
  consultant: { name: "", photo: "" },
  campaign: {
    number: 9,
    name: "Catálogo C9 2026",
    startDate: null,
    endDate: null,
    banner: "/yanbal-banner.webp",
  },
  featuredProducts: [
    "200-ohm-parfum-ohm",
    "2040-dulce-amor-edl-eau-de-parfum",
    "2203-pasion-parfum",
    "combo-soy-unica-c9",
    "231-ccori-parfum",
    "2191-icono-eau-de-parfum",
  ],
  availability: {},
  // Merchant Center must only advertise stock confirmed for each product id.
  merchantAvailability: {},
  relatedProducts: {},
  testimonials: [],
  deliveryPhotos: [],
  // Additional manual bundles: { id, name, productIds, price, image, description }.
  combos: [],
};
export const shippingConfig = {
  methods: ["standard"], // express/pickup must be explicitly configured before display.
  // Priority: exact DIVIPOLA city override -> Cúcuta/Bogotá special -> national default.
  // Use integer COP values. Keep null to block checkout; zero is an explicit free rate.
  cities: {},
  nationalDefault: 14000,
  cucuta: 0,
  bogota: 0,
  minimumOrder: 50000,
  // Applies only after a destination has a configured rate. Null disables it.
  freeShippingThreshold: 150000,
};
