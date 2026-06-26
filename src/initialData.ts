import { Product, Category, Branch, Order, Shift, CashMovement } from "./types";

export const INITIAL_CATEGORIES: Category[] = [
  { id: "hamburguesas", name: "Hamburguesas", icon: "Flame" },
  { id: "pizzas", name: "Pizzas", icon: "Pizza" },
  { id: "acompanamientos", name: "Acompañamientos", icon: "Salad" },
  { id: "bebidas", name: "Bebidas", icon: "CupSoda" },
  { id: "postres", name: "Postres", icon: "IceCream" }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Smash Burger Cheddar",
    price: 6900,
    category: "hamburguesas",
    description: "Dos carnes Angus smash de 100g, triple queso cheddar fundido, cebolla picada, pepinillos y salsa secreta en pan brioche.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
    variants: [
      { name: "Sencilla", price: 0 },
      { name: "Doble Carne (+ Angus)", price: 1800 },
      { name: "Triple Burger (+ Bacon)", price: 3200 }
    ],
    isAvailable: true
  },
  {
    id: "prod-2",
    name: "Burger Italiana Premium",
    price: 7500,
    category: "hamburguesas",
    description: "Carne Angus grillada de 150g, palta fresca molida, tomate laminado y mayonesa casera FoodHub en pan brioche artesanal.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=400",
    variants: [
      { name: "Normal", price: 0 },
      { name: "Con Tocino Crujiente", price: 1000 },
      { name: "Extra Queso Cheddar", price: 800 }
    ],
    isAvailable: true
  },
  {
    id: "prod-3",
    name: "Pizza Margherita Di Bufala",
    price: 8900,
    category: "pizzas",
    description: "Masa madurada por 48 horas, salsa de tomates italianos San Marzano, mozzarella de búfala fresca, hojas de albahaca silvestre y oliva extra virgen.",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=400",
    variants: [
      { name: "Individual (22cm)", price: 0 },
      { name: "Familiar (33cm)", price: 4500 }
    ],
    isAvailable: true
  },
  {
    id: "prod-4",
    name: "Pizza Diavola & Pepperoni",
    price: 9800,
    category: "pizzas",
    description: "Salsa de tomate casera, queso mozzarella hilado, pepperoni americano curado de alta calidad y un toque sutil de aceite picante infundido en la casa.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
    variants: [
      { name: "Individual (22cm)", price: 0 },
      { name: "Familiar (33cm)", price: 4900 },
      { name: "Borde relleno de Queso", price: 2000 }
    ],
    isAvailable: true
  },
  {
    id: "prod-5",
    name: "Papas Fritas Rústicas FoodHub",
    price: 3400,
    category: "acompanamientos",
    description: "Papas rústicas con piel cortadas a mano, doble cocción para máxima crocancia, sazonadas con sal de mar, romero fresco y alioli de ajo asado.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
    variants: [
      { name: "Porción Simple", price: 0 },
      { name: "Bañadas en Cheddar & Tocino", price: 1500 },
      { name: "Formato Familiar", price: 2200 }
    ],
    isAvailable: true
  },
  {
    id: "prod-6",
    name: "Aros de Cebolla al Panko",
    price: 3600,
    category: "acompanamientos",
    description: "Gruesos aros de cebolla dulce, apanados en panko japonés crujiente, servidos con salsa barbacoa FoodHub ahumada al bourbon.",
    image: "https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&q=80&w=400",
    variants: [
      { name: "Normal", price: 0 }
    ],
    isAvailable: true
  },
  {
    id: "prod-7",
    name: "Cerveza Craft IPA Barril",
    price: 3800,
    category: "bebidas",
    description: "Cerveza artesanal local estilo India Pale Ale, de amargor medio, notas cítricas intensas y aromas a lúpulo fresco. 5.8% ABV.",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=400",
    variants: [
      { name: "Pinta 470ml", price: 0 },
      { name: "Schop Chico 330ml", price: -800 }
    ],
    isAvailable: true
  },
  {
    id: "prod-8",
    name: "Limonada Menta Jengibre",
    price: 2900,
    category: "bebidas",
    description: "Jugo de limón natural exprimido, hojas de menta fresca maceradas, jengibre orgánico prensado y endulzado a la perfección.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
    variants: [
      { name: "Vaso 450ml", price: 0 },
      { name: "Jarra 1.5L", price: 4000 }
    ],
    isAvailable: true
  },
  {
    id: "prod-9",
    name: "Volcán de Chocolate Belga",
    price: 4500,
    category: "postres",
    description: "Bizcocho húmedo de cacao fino, corazón de chocolate líquido fundido al instante, servido tibio con una bola de helado de vainilla bourbon artesanal.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400",
    variants: [],
    isAvailable: true
  }
];

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: "suc-1",
    name: "FoodHub Providencia",
    address: "Av. Providencia 1240, Providencia, Santiago",
    activeShiftId: "shift-mock-active"
  },
  {
    id: "suc-2",
    name: "FoodHub Las Condes",
    address: "Isidora Goyenechea 3250, Las Condes, Santiago",
    activeShiftId: null
  }
];

// Reusable timestamps for mock orders
const today = new Date();
const formatWithHourOffset = (hoursAgo: number) => {
  const date = new Date(today.getTime() - hoursAgo * 60 * 60 * 1000);
  return date.toISOString();
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: "order-1001",
    sucursalId: "suc-1",
    sucursalName: "FoodHub Providencia",
    tableNo: "Mesa 4",
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        name: "Smash Burger Cheddar",
        price: 6900,
        quantity: 2,
        selectedVariant: { name: "Doble Carne (+ Angus)", price: 1800 }
      },
      {
        id: "item-2",
        productId: "prod-5",
        name: "Papas Fritas Rústicas FoodHub",
        price: 3400,
        quantity: 1,
        selectedVariant: { name: "Bañadas en Cheddar & Tocino", price: 1500 }
      },
      {
        id: "item-3",
        productId: "prod-8",
        name: "Limonada Menta Jengibre",
        price: 2900,
        quantity: 2,
        selectedVariant: { name: "Vaso 450ml", price: 0 }
      }
    ],
    subtotal: 23200,
    total: 23200,
    status: "completed",
    type: "pos",
    paymentMethod: "card",
    paymentStatus: "paid",
    customerName: "Carlos González",
    cashierName: "Juan Cajero",
    timestamp: formatWithHourOffset(1.5)
  },
  {
    id: "order-1002",
    sucursalId: "suc-1",
    sucursalName: "FoodHub Providencia",
    tableNo: "Online - Envío",
    items: [
      {
        id: "item-4",
        productId: "prod-3",
        name: "Pizza Margherita Di Bufala",
        price: 8900,
        quantity: 1,
        selectedVariant: { name: "Familiar (33cm)", price: 4500 }
      },
      {
        id: "item-5",
        productId: "prod-7",
        name: "Cerveza Craft IPA Barril",
        price: 3800,
        quantity: 2,
        selectedVariant: { name: "Pinta 470ml", price: 0 }
      }
    ],
    subtotal: 21000,
    total: 21000,
    status: "preparing",
    type: "online",
    paymentMethod: "transfer",
    paymentStatus: "paid",
    customerName: "Camila Jara",
    timestamp: formatWithHourOffset(0.5)
  },
  {
    id: "order-1003",
    sucursalId: "suc-1",
    sucursalName: "FoodHub Providencia",
    tableNo: "Mesa 12",
    items: [
      {
        id: "item-6",
        productId: "prod-2",
        name: "Burger Italiana Premium",
        price: 7500,
        quantity: 1,
        selectedVariant: { name: "Con Tocino Crujiente", price: 1000 }
      },
      {
        id: "item-7",
        productId: "prod-9",
        name: "Volcán de Chocolate Belga",
        price: 4500,
        quantity: 1
      }
    ],
    subtotal: 13000,
    total: 13000,
    status: "ready",
    type: "pos",
    paymentMethod: "cash",
    paymentStatus: "paid",
    customerName: "Sofía Martínez",
    cashierName: "Juan Cajero",
    timestamp: formatWithHourOffset(0.2)
  },
  {
    id: "order-1004",
    sucursalId: "suc-2",
    sucursalName: "FoodHub Las Condes",
    tableNo: "Online - Retiro",
    items: [
      {
        id: "item-8",
        productId: "prod-4",
        name: "Pizza Diavola & Pepperoni",
        price: 9800,
        quantity: 1,
        selectedVariant: { name: "Borde relleno de Queso", price: 2000 }
      },
      {
        id: "item-9",
        productId: "prod-6",
        name: "Aros de Cebolla al Panko",
        price: 3600,
        quantity: 1,
        selectedVariant: { name: "Normal", price: 0 }
      }
    ],
    subtotal: 15400,
    total: 15400,
    status: "pending",
    type: "online",
    paymentMethod: "cash",
    paymentStatus: "pending",
    customerName: "Diego Toledo",
    timestamp: formatWithHourOffset(0.1)
  },
  {
    id: "order-1005",
    sucursalId: "suc-1",
    sucursalName: "FoodHub Providencia",
    tableNo: "Mesa 2",
    items: [
      {
        id: "item-10",
        productId: "prod-1",
        name: "Smash Burger Cheddar",
        price: 6900,
        quantity: 1,
        selectedVariant: { name: "Sencilla", price: 0 }
      },
      {
        id: "item-11",
        productId: "prod-8",
        name: "Limonada Menta Jengibre",
        price: 2900,
        quantity: 1,
        selectedVariant: { name: "Vaso 450ml", price: 0 }
      }
    ],
    subtotal: 9800,
    total: 9800,
    status: "completed",
    type: "pos",
    paymentMethod: "card",
    paymentStatus: "paid",
    customerName: "Valentina Paz",
    cashierName: "Juan Cajero",
    timestamp: formatWithHourOffset(3.2)
  }
];

export const INITIAL_SHIFT: Shift = {
  id: "shift-mock-active",
  sucursalId: "suc-1",
  sucursalName: "FoodHub Providencia",
  cashierName: "Juan Cajero",
  openedAt: formatWithHourOffset(4),
  closedAt: null,
  startingCash: 50000,
  expectedCash: 63000, // 50000 + 13000 cash order
  actualCash: null,
  notes: "Turno inicial de almuerzo iniciado sin novedades.",
  status: "open"
};

export const INITIAL_CASH_MOVEMENTS: CashMovement[] = [
  {
    id: "mov-1",
    shiftId: "shift-mock-active",
    type: "in",
    amount: 50000,
    reason: "Apertura de caja inicial",
    timestamp: formatWithHourOffset(4)
  },
  {
    id: "mov-2",
    shiftId: "shift-mock-active",
    type: "in",
    amount: 13000,
    reason: "Venta Mesa 12 (Efectivo)",
    timestamp: formatWithHourOffset(0.2)
  }
];

// Helper to initialize LocalStorage
export function initializeLocalStorage() {
  if (typeof window === "undefined") return;

  // Migrate old keys if they exist
  const keys = ["categories", "products", "branches", "orders", "shifts", "cash_movements", "waitlist"];
  keys.forEach(k => {
    const oldVal = localStorage.getItem(`plato_${k}`);
    const newVal = localStorage.getItem(`foodhub_${k}`);
    if (oldVal && !newVal) {
      localStorage.setItem(`foodhub_${k}`, oldVal);
    }
  });

  if (!localStorage.getItem("foodhub_categories")) {
    localStorage.setItem("foodhub_categories", JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem("foodhub_products")) {
    localStorage.setItem("foodhub_products", JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem("foodhub_branches")) {
    localStorage.setItem("foodhub_branches", JSON.stringify(INITIAL_BRANCHES));
  }
  if (!localStorage.getItem("foodhub_orders")) {
    localStorage.setItem("foodhub_orders", JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem("foodhub_shifts")) {
    localStorage.setItem("foodhub_shifts", JSON.stringify([INITIAL_SHIFT]));
  }
  if (!localStorage.getItem("foodhub_cash_movements")) {
    localStorage.setItem("foodhub_cash_movements", JSON.stringify(INITIAL_CASH_MOVEMENTS));
  }
}
