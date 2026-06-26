import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Category, Branch, Order, Shift, CashMovement, UserRole, User, WaitlistItem } from "../types";
import { initializeLocalStorage } from "../initialData";

interface AppContextType {
  products: Product[];
  categories: Category[];
  branches: Branch[];
  orders: Order[];
  shifts: Shift[];
  cashMovements: CashMovement[];
  currentUser: User;
  activeBranch: Branch | undefined;
  activeShift: Shift | null;
  waitlist: WaitlistItem[];
  changeUserRole: (role: UserRole) => void;
  changeUserBranch: (branchId: string) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addOrder: (orderData: Omit<Order, "id" | "timestamp" | "subtotal" | "total">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  openShift: (startingCash: number, notes: string) => void;
  closeShift: (actualCash: number, notes: string) => void;
  addCashMovement: (type: "in" | "out", amount: number, reason: string) => void;
  addWaitlistProspect: (prospect: Omit<WaitlistItem, "id" | "status" | "timestamp">) => void;
  updateWaitlistStatus: (id: string, status: WaitlistItem["status"]) => void;
  deleteWaitlistProspect: (id: string) => void;
  resetAllData: () => void;
}

const DEFAULT_WAITLIST: WaitlistItem[] = [
  {
    id: "wait-1",
    businessName: "Café de la Plaza",
    ownerName: "Sofía Mendoza",
    email: "sofia@cafedelaplaza.cl",
    phone: "+56 9 8765 4321",
    restaurantType: "Cafetería",
    monthlyOrders: "500 - 1000",
    status: "pending",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "wait-2",
    businessName: "La Birra & Burger",
    ownerName: "Carlos Pérez",
    email: "carlos@birraburger.cl",
    phone: "+56 9 1234 5678",
    restaurantType: "Hamburguesería / Bar",
    monthlyOrders: "1000 - 2500",
    status: "contacted",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "wait-3",
    businessName: "Pizzería Bella Italia",
    ownerName: "Giovanni Rossi",
    email: "giovanni@bellaitalia.cl",
    phone: "+56 9 5555 1234",
    restaurantType: "Pizzería",
    monthlyOrders: "2500+",
    status: "pending",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [cashMovements, setCashMovements] = useState<CashMovement[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);
  
  // Track currently simulated session user (Admin, Cajero, Customer)
  const [currentUser, setCurrentUser] = useState<User>({
    id: "user-1",
    name: "Prospecto B2B",
    role: "landing", // starts as landing page
    sucursalId: "suc-1"
  });

  // Load state from local storage on mount
  useEffect(() => {
    initializeLocalStorage();
    
    const storedProducts = localStorage.getItem("foodhub_products");
    const storedCategories = localStorage.getItem("foodhub_categories");
    const storedBranches = localStorage.getItem("foodhub_branches");
    const storedOrders = localStorage.getItem("foodhub_orders");
    const storedShifts = localStorage.getItem("foodhub_shifts");
    const storedCashMovements = localStorage.getItem("foodhub_cash_movements");
    const storedWaitlist = localStorage.getItem("foodhub_waitlist");

    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    if (storedBranches) setBranches(JSON.parse(storedBranches));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    if (storedShifts) setShifts(JSON.parse(storedShifts));
    if (storedCashMovements) setCashMovements(JSON.parse(storedCashMovements));

    if (storedWaitlist) {
      setWaitlist(JSON.parse(storedWaitlist));
    } else {
      setWaitlist(DEFAULT_WAITLIST);
      localStorage.setItem("foodhub_waitlist", JSON.stringify(DEFAULT_WAITLIST));
    }
  }, []);

  // Sync state to local storage when state changes
  const saveState = (key: string, data: any) => {
    const mappedKey = key.replace("plato_", "foodhub_");
    localStorage.setItem(mappedKey, JSON.stringify(data));
  };

  const activeBranch = branches.find((b) => b.id === currentUser.sucursalId);
  const activeShift = shifts.find(
    (s) => s.sucursalId === currentUser.sucursalId && s.status === "open"
  ) || null;

  const changeUserRole = (role: UserRole) => {
    const newUser = { ...currentUser, role };
    if (role === "customer") {
      newUser.name = "Cliente Online";
    } else if (role === "cajero") {
      newUser.name = "Juan Cajero";
    } else if (role === "landing") {
      newUser.name = "Prospecto B2B";
    } else {
      newUser.name = "Administrador";
    }
    setCurrentUser(newUser);
  };

  const addWaitlistProspect = (prospect: Omit<WaitlistItem, "id" | "status" | "timestamp">) => {
    const newItem: WaitlistItem = {
      ...prospect,
      id: "wait-" + Date.now(),
      status: "pending",
      timestamp: new Date().toISOString()
    };
    const updated = [newItem, ...waitlist];
    setWaitlist(updated);
    saveState("plato_waitlist", updated);
  };

  const updateWaitlistStatus = (id: string, status: WaitlistItem["status"]) => {
    const updated = waitlist.map((item) => (item.id === id ? { ...item, status } : item));
    setWaitlist(updated);
    saveState("plato_waitlist", updated);
  };

  const deleteWaitlistProspect = (id: string) => {
    const updated = waitlist.filter((item) => item.id !== id);
    setWaitlist(updated);
    saveState("plato_waitlist", updated);
  };

  const changeUserBranch = (branchId: string) => {
    setCurrentUser((prev) => ({ ...prev, sucursalId: branchId }));
  };

  const addProduct = (prodData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...prodData,
      id: "prod-" + Date.now()
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    saveState("plato_products", updated);
  };

  const updateProduct = (updatedProd: Product) => {
    const updated = products.map((p) => (p.id === updatedProd.id ? updatedProd : p));
    setProducts(updated);
    saveState("plato_products", updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveState("plato_products", updated);
  };

  const addOrder = (orderData: Omit<Order, "id" | "timestamp" | "subtotal" | "total">) => {
    const subtotal = orderData.items.reduce(
      (sum, item) => sum + (item.price + (item.selectedVariant?.price || 0)) * item.quantity,
      0
    );
    const total = subtotal; // Simulating no taxes/discounts for MVP

    const newOrder: Order = {
      ...orderData,
      id: "order-" + (orders.length + 1001),
      timestamp: new Date().toISOString(),
      subtotal,
      total
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveState("plato_orders", updatedOrders);

    // If order is POS and cash payment, automatically register cash movement
    if (orderData.type === "pos" && orderData.paymentMethod === "cash" && activeShift) {
      addCashMovement("in", total, `Venta ${orderData.tableNo || "Caja"} (Efectivo)`);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const updatedOrder = { ...o, status };
        // If POS order is completed/cancelled, update status accordingly
        if (status === "completed") {
          updatedOrder.paymentStatus = "paid";
        }
        return updatedOrder;
      }
      return o;
    });
    setOrders(updated);
    saveState("plato_orders", updated);
  };

  const openShift = (startingCash: number, notes: string) => {
    if (activeShift) return; // Shift already open

    const newShiftId = "shift-" + Date.now();
    const newShift: Shift = {
      id: newShiftId,
      sucursalId: currentUser.sucursalId,
      sucursalName: activeBranch?.name || "Sucursal",
      cashierName: currentUser.name,
      openedAt: new Date().toISOString(),
      closedAt: null,
      startingCash,
      expectedCash: startingCash,
      actualCash: null,
      notes,
      status: "open"
    };

    const updatedShifts = [newShift, ...shifts];
    setShifts(updatedShifts);
    saveState("plato_shifts", updatedShifts);

    // Update branch to track activeShiftId
    const updatedBranches = branches.map((b) =>
      b.id === currentUser.sucursalId ? { ...b, activeShiftId: newShiftId } : b
    );
    setBranches(updatedBranches);
    saveState("plato_branches", updatedBranches);

    // Add initial cash movement
    const newMovement: CashMovement = {
      id: "mov-" + Date.now(),
      shiftId: newShiftId,
      type: "in",
      amount: startingCash,
      reason: "Apertura de caja inicial",
      timestamp: new Date().toISOString()
    };
    const updatedMovements = [newMovement, ...cashMovements];
    setCashMovements(updatedMovements);
    saveState("plato_cash_movements", updatedMovements);
  };

  const closeShift = (actualCash: number, notes: string) => {
    if (!activeShift) return;

    const updatedShifts = shifts.map((s) => {
      if (s.id === activeShift.id) {
        return {
          ...s,
          closedAt: new Date().toISOString(),
          actualCash,
          notes: s.notes + `\nCierre: ${notes}`,
          status: "closed" as const
        };
      }
      return s;
    });
    setShifts(updatedShifts);
    saveState("plato_shifts", updatedShifts);

    // Update branch to nullify activeShiftId
    const updatedBranches = branches.map((b) =>
      b.id === currentUser.sucursalId ? { ...b, activeShiftId: null } : b
    );
    setBranches(updatedBranches);
    saveState("plato_branches", updatedBranches);
  };

  const addCashMovement = (type: "in" | "out", amount: number, reason: string) => {
    if (!activeShift) return;

    const newMovement: CashMovement = {
      id: "mov-" + Date.now(),
      shiftId: activeShift.id,
      type,
      amount,
      reason,
      timestamp: new Date().toISOString()
    };

    const updatedMovements = [newMovement, ...cashMovements];
    setCashMovements(updatedMovements);
    saveState("plato_cash_movements", updatedMovements);

    // Update expectedCash on the active shift
    const updatedShifts = shifts.map((s) => {
      if (s.id === activeShift.id) {
        const change = type === "in" ? amount : -amount;
        return {
          ...s,
          expectedCash: s.expectedCash + change
        };
      }
      return s;
    });
    setShifts(updatedShifts);
    saveState("plato_shifts", updatedShifts);
  };

  const resetAllData = () => {
    localStorage.clear();
    initializeLocalStorage();
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        branches,
        orders,
        shifts,
        cashMovements,
        currentUser,
        activeBranch,
        activeShift,
        waitlist,
        changeUserRole,
        changeUserBranch,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        openShift,
        closeShift,
        addCashMovement,
        addWaitlistProspect,
        updateWaitlistStatus,
        deleteWaitlistProspect,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
