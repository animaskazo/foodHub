import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Product, OrderItem, Variant, PaymentMethod } from "../types";
import { 
  Flame, Pizza, Salad, CupSoda, IceCream, Plus, Minus, Trash, 
  CreditCard, DollarSign, RefreshCw, Printer, X, FileText, Check, 
  Lock, KeyRound, Calculator, ArrowUpRight, ArrowDownLeft, AlertCircle
} from "lucide-react";

export const PosTerminal: React.FC = () => {
  const { 
    products, 
    categories, 
    activeBranch, 
    activeShift, 
    openShift, 
    closeShift, 
    addCashMovement, 
    cashMovements,
    addOrder,
    currentUser
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState("hamburguesas");
  const [posCart, setPosCart] = useState<OrderItem[]>([]);
  const [tableNo, setTableNo] = useState("Mesa 1");
  const [customerName, setCustomerName] = useState("Cliente Local");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  // Dialog / Modal States
  const [isOpeningShift, setIsOpeningShift] = useState(false);
  const [openingCash, setOpeningCash] = useState("50000");
  const [openingNotes, setOpeningNotes] = useState("Inicio de turno estándar de caja.");

  const [isClosingShift, setIsClosingShift] = useState(false);
  const [closingCash, setClosingCash] = useState("");
  const [closingNotes, setClosingNotes] = useState("");

  const [isCashMovement, setIsCashMovement] = useState(false);
  const [moveType, setMoveType] = useState<"in" | "out">("out");
  const [moveAmount, setMoveAmount] = useState("");
  const [moveReason, setMoveReason] = useState("");

  const [activeVariantSelector, setActiveVariantSelector] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(undefined);

  const [lastCheckoutOrder, setLastCheckoutOrder] = useState<any | null>(null);

  // Math helpers
  const cartSubtotal = posCart.reduce(
    (sum, item) => sum + (item.price + (item.selectedVariant?.price || 0)) * item.quantity,
    0
  );

  const handleOpenShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openShift(Number(openingCash) || 0, openingNotes);
    setIsOpeningShift(false);
  };

  const handleCloseShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeShift(Number(closingCash) || 0, closingNotes);
    setIsClosingShift(false);
    setClosingCash("");
    setClosingNotes("");
  };

  const handleCashMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveAmount || !moveReason) return;
    addCashMovement(moveType, Number(moveAmount), moveReason);
    setIsCashMovement(false);
    setMoveAmount("");
    setMoveReason("");
  };

  const handleAddProductToCart = (prod: Product) => {
    if (prod.variants && prod.variants.length > 0) {
      // Must choose variant first
      setActiveVariantSelector(prod);
      setSelectedVariant(prod.variants[0]);
    } else {
      addToCartWithDetails(prod, undefined);
    }
  };

  const addToCartWithDetails = (prod: Product, variant?: Variant) => {
    const cartItemId = variant ? `${prod.id}-${variant.name}` : prod.id;
    const existingIndex = posCart.findIndex(item => item.id === cartItemId);

    if (existingIndex > -1) {
      const updated = [...posCart];
      updated[existingIndex].quantity += 1;
      setPosCart(updated);
    } else {
      setPosCart([
        ...posCart,
        {
          id: cartItemId,
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: 1,
          selectedVariant: variant
        }
      ]);
    }
    setActiveVariantSelector(null);
    setSelectedVariant(undefined);
  };

  const handleIncrementQuantity = (id: string) => {
    setPosCart(posCart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const handleDecrementQuantity = (id: string) => {
    const item = posCart.find(i => i.id === id);
    if (!item) return;

    if (item.quantity === 1) {
      setPosCart(posCart.filter(i => i.id !== id));
    } else {
      setPosCart(posCart.map(i => i.id === id ? { ...item, quantity: item.quantity - 1 } : item));
    }
  };

  const handleRemoveItem = (id: string) => {
    setPosCart(posCart.filter(i => i.id !== id));
  };

  const handleCheckout = () => {
    if (posCart.length === 0) return;

    const newOrder = addOrder({
      sucursalId: activeBranch?.id || "suc-1",
      sucursalName: activeBranch?.name || "Sucursal",
      tableNo: tableNo,
      items: posCart,
      status: "completed", // Cashier orders complete instantly
      type: "pos",
      paymentMethod,
      paymentStatus: "paid",
      customerName: customerName || "Cliente Local",
      cashierName: currentUser.name
    });

    setLastCheckoutOrder(newOrder);
    setPosCart([]);
    setCustomerName("Cliente Local");
  };

  // Category Icon Map Helper
  const renderCategoryIcon = (iconName: string) => {
    const props = { className: "w-4 h-4" };
    switch (iconName) {
      case "Flame": return <Flame {...props} />;
      case "Pizza": return <Pizza {...props} />;
      case "Salad": return <Salad {...props} />;
      case "CupSoda": return <CupSoda {...props} />;
      case "IceCream": return <IceCream {...props} />;
      default: return <Flame {...props} />;
    }
  };

  // IF BOX IS CLOSED, SCREEN REVEAL COVERS SCREEN FOR APERTURA
  if (!activeShift) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-neutral-200 shadow-xl space-y-6 text-center animate-fade-in" id="pos-closed-turn-view">
        <div className="w-16 h-16 bg-neutral-950 text-white rounded-full flex items-center justify-center mx-auto shadow">
          <Lock className="w-6 h-6 text-amber-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Caja Registradora Cerrada</h2>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Para comenzar a vender en <span className="font-semibold text-neutral-800">{activeBranch?.name}</span>, debes abrir el turno de caja e ingresar el efectivo inicial de resguardo.
          </p>
        </div>

        <form onSubmit={handleOpenShiftSubmit} className="space-y-4 max-w-sm mx-auto pt-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Efectivo Inicial en Caja ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-neutral-400 font-bold">$</span>
              <input
                id="input-open-cash"
                type="number"
                required
                value={openingCash}
                onChange={(e) => setOpeningCash(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-8 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-950 font-mono font-bold"
              />
            </div>
            <p className="text-[10px] text-neutral-400">Dinero disponible en caja para dar vuelto a clientes.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Notas de Apertura</label>
            <textarea
              id="textarea-open-notes"
              rows={2}
              value={openingNotes}
              onChange={(e) => setOpeningNotes(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-950 text-neutral-600"
            />
          </div>

          <button
            id="btn-submit-open-shift"
            type="submit"
            className="w-full bg-neutral-950 text-white hover:bg-neutral-800 py-3 rounded-xl font-bold text-xs tracking-wide uppercase shadow transition-colors cursor-pointer mt-4"
          >
            Abrir Caja y Comenzar Turno
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-90px)] p-4 animate-fade-in" id="pos-terminal-active-view">
      
      {/* 1. SECCION IZQUIERDA (CATALOGO DE POS) - 7 columnas */}
      <div className="lg:col-span-7 flex flex-col justify-between gap-4 h-full overflow-hidden">
        
        {/* Superior Header de Caja */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="space-y-0.5">
            <h2 className="font-bold text-neutral-950 text-sm tracking-tight">{activeBranch?.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <span>Cajero: <span className="text-neutral-800 font-semibold">{currentUser.name}</span></span>
              <span>•</span>
              <span className="font-mono text-emerald-600 font-semibold">Caja: ${activeShift.expectedCash.toLocaleString("es-CL")}</span>
            </div>
          </div>

          {/* POS Action Buttons */}
          <div className="flex gap-2">
            <button
              id="btn-pos-movement"
              onClick={() => setIsCashMovement(true)}
              className="bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-neutral-500" />
              Mov. Caja
            </button>
            <button
              id="btn-pos-close-shift"
              onClick={() => setIsClosingShift(true)}
              className="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              Cerrar Turno
            </button>
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-neutral-950 border-neutral-950 text-white shadow-sm"
                  : "bg-white border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
              }`}
            >
              {renderCategoryIcon(cat.icon)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Grid de Productos (Venta Rápida) */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-neutral-50 p-1.5 rounded-2xl border border-neutral-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {products
              .filter(p => p.category === selectedCategory && p.isAvailable)
              .map(p => (
                <button
                  key={p.id}
                  onClick={() => handleAddProductToCart(p)}
                  className="bg-white hover:border-neutral-400 hover:shadow-md active:bg-neutral-50 rounded-xl border border-neutral-200 p-3 text-left transition-all flex flex-col justify-between h-36 cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-neutral-950 text-xs tracking-tight line-clamp-2 leading-snug">{p.name}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-50 shrink-0">
                    <span className="font-mono font-bold text-neutral-900 text-xs">${p.price.toLocaleString("es-CL")}</span>
                    {p.variants && p.variants.length > 0 && (
                      <span className="bg-amber-100 text-amber-800 text-[8px] font-mono font-bold px-1 rounded">
                        Extras
                      </span>
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>

      </div>

      {/* 2. PANEL DE ORDEN/CART DEL POS (SECCION DERECHA) - 5 columnas */}
      <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between h-full overflow-hidden">
        
        {/* Cart Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-neutral-950 text-sm flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-neutral-500" />
            Venta Actual
          </h3>
          <span className="bg-neutral-100 text-neutral-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
            {posCart.reduce((acc, item) => acc + item.quantity, 0)} items
          </span>
        </div>

        {/* Input fields for Order Metadata */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-100 grid grid-cols-2 gap-3 shrink-0">
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider">Mesa / Ubicación</label>
            <input
              type="text"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              placeholder="Mesa 4 o Para Llevar"
              className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider">Cliente (Nombre)</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium"
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {posCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 space-y-2">
              <Calculator className="w-8 h-8 text-neutral-300" />
              <p className="text-xs">Orden vacía. Selecciona platos del menú a la izquierda para cargarlos aquí.</p>
            </div>
          ) : (
            posCart.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2 border-b border-neutral-50 pb-2.5 last:border-0">
                <div className="space-y-0.5 max-w-[60%]">
                  <span className="font-bold text-neutral-900 text-xs block leading-tight">{item.name}</span>
                  {item.selectedVariant && (
                    <span className="text-[10px] text-neutral-500 block">
                      Opción: {item.selectedVariant.name} (+${item.selectedVariant.price})
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-neutral-400 block">
                    ${(item.price + (item.selectedVariant?.price || 0)).toLocaleString("es-CL")} c/u
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                    <button
                      onClick={() => handleDecrementQuantity(item.id)}
                      className="p-1 hover:bg-white text-neutral-600 rounded transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-xs px-1.5 text-neutral-900">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrementQuantity(item.id)}
                      className="p-1 hover:bg-white text-neutral-600 rounded transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-neutral-400 hover:text-rose-500 cursor-pointer p-1"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Checkout area */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 shrink-0 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-neutral-500">
              <span>Subtotal:</span>
              <span className="font-mono">${cartSubtotal.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-neutral-950">Total a Pagar:</span>
              <span className="font-mono font-extrabold text-neutral-900 text-lg">
                ${cartSubtotal.toLocaleString("es-CL")}
              </span>
            </div>
          </div>

          {/* Payment selector tabs */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider">Método de Cobro</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl border gap-1 cursor-pointer transition-all ${
                  paymentMethod === "card"
                    ? "bg-neutral-950 border-neutral-950 text-white shadow"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px] font-bold">Tarjeta</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl border gap-1 cursor-pointer transition-all ${
                  paymentMethod === "cash"
                    ? "bg-neutral-950 border-neutral-950 text-white shadow"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span className="text-[10px] font-bold">Efectivo</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("transfer")}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl border gap-1 cursor-pointer transition-all ${
                  paymentMethod === "transfer"
                    ? "bg-neutral-950 border-neutral-950 text-white shadow"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-[10px] font-bold">Transf.</span>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            id="btn-pos-checkout"
            onClick={handleCheckout}
            disabled={posCart.length === 0}
            className={`w-full py-3 rounded-2xl font-bold text-xs tracking-wide uppercase shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              posCart.length === 0
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none"
                : "bg-neutral-950 text-white hover:bg-neutral-800"
            }`}
          >
            <Check className="w-4 h-4" />
            Registrar Pago e Imprimir
          </button>
        </div>

      </div>

      {/* MODAL 1: VARIANTES/EXTRAS DE PRODUCTO */}
      {activeVariantSelector && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xl max-w-sm w-full space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h4 className="font-bold text-neutral-950 text-sm tracking-tight">Opciones del Plato</h4>
              <button
                onClick={() => setActiveVariantSelector(null)}
                className="text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-neutral-900 text-sm">{activeVariantSelector.name}</span>
              <p className="text-xs text-neutral-500 leading-normal">{activeVariantSelector.description}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Elige tu variante/extra:</label>
              <div className="space-y-1.5">
                {activeVariantSelector.variants.map((v, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedVariant?.name === v.name
                        ? "bg-neutral-950 border-neutral-950 text-white font-semibold"
                        : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    <span>{v.name}</span>
                    <span className="font-mono font-bold">+${v.price.toLocaleString("es-CL")}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => addToCartWithDetails(activeVariantSelector, selectedVariant)}
              className="w-full bg-neutral-950 text-white hover:bg-neutral-800 py-2.5 rounded-xl text-xs font-semibold shadow cursor-pointer mt-2"
            >
              Agregar con Selección
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: MOVIMIENTO DE CAJA */}
      {isCashMovement && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCashMovementSubmit} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xl max-w-sm w-full space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h4 className="font-bold text-neutral-950 text-sm tracking-tight flex items-center gap-1">
                <Calculator className="w-4 h-4 text-neutral-500" />
                Movimiento Manual de Caja
              </h4>
              <button
                type="button"
                onClick={() => setIsCashMovement(false)}
                className="text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMoveType("in")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs cursor-pointer ${
                  moveType === "in"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 font-semibold"
                    : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                Ingreso
              </button>
              <button
                type="button"
                onClick={() => setMoveType("out")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs cursor-pointer ${
                  moveType === "out"
                    ? "bg-rose-500/10 border-rose-500 text-rose-700 font-semibold"
                    : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                Egreso
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Monto ($)</label>
              <input
                type="number"
                required
                placeholder="10000"
                value={moveAmount}
                onChange={(e) => setMoveAmount(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Motivo / Razón</label>
              <input
                type="text"
                required
                placeholder="Ej. Pago panadero o Arqueo sencillo"
                value={moveReason}
                onChange={(e) => setMoveReason(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-950 text-white hover:bg-neutral-800 py-2.5 rounded-xl text-xs font-semibold shadow cursor-pointer mt-2"
            >
              Registrar Movimiento
            </button>
          </form>
        </div>
      )}

      {/* MODAL 3: CIERRE DE TURNO */}
      {isClosingShift && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCloseShiftSubmit} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xl max-w-sm w-full space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h4 className="font-bold text-neutral-950 text-sm tracking-tight flex items-center gap-1 text-rose-600">
                <Lock className="w-4 h-4" />
                Cerrar Turno de Caja
              </h4>
              <button
                type="button"
                onClick={() => setIsClosingShift(false)}
                className="text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Efectivo de Apertura:</span>
                <span className="font-mono font-semibold">${activeShift.startingCash.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-1.5">
                <span>Ventas / Movimientos Hoy:</span>
                <span className="font-mono font-semibold text-emerald-600">+${(activeShift.expectedCash - activeShift.startingCash).toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-950 text-sm pt-0.5">
                <span>Efectivo Teórico Esperado:</span>
                <span className="font-mono">${activeShift.expectedCash.toLocaleString("es-CL")}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Efectivo Real Contado en Caja ($) *</label>
              <input
                id="input-close-cash"
                type="number"
                required
                placeholder="Ej. 63000"
                value={closingCash}
                onChange={(e) => setClosingCash(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Notas de Arqueo / Cierre</label>
              <textarea
                id="textarea-close-notes"
                rows={2}
                placeholder="Comentarios adicionales sobre el conteo de dinero."
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <button
              id="btn-submit-close-shift"
              type="submit"
              className="w-full bg-rose-600 text-white hover:bg-rose-700 py-2.5 rounded-xl text-xs font-bold shadow cursor-pointer uppercase tracking-wider mt-2"
            >
              Cerrar Turno e Imprimir Arqueo
            </button>
          </form>
        </div>
      )}

      {/* MODAL 4: SIMULADOR DE BOLETA TERMICA (RECETA DE COBRO) */}
      {lastCheckoutOrder && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xl max-w-sm w-full space-y-4 animate-scale-up relative">
            
            <button
              onClick={() => setLastCheckoutOrder(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-1 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                ✓ Cobro Exitoso
              </span>
            </div>

            {/* MOCK THERMAL TICKET */}
            <div className="bg-amber-50/40 border border-dashed border-neutral-300 p-5 rounded-2xl font-mono text-[11px] text-neutral-800 space-y-4">
              <div className="text-center space-y-1">
                <span className="font-bold text-sm tracking-widest uppercase">PLATO CHILE</span>
                <p className="text-[9px] text-neutral-500">
                  {activeBranch?.name}<br />
                  {activeBranch?.address}
                </p>
                <div className="border-b border-dashed border-neutral-300 my-2"></div>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>BOLETA ELECTRÓNICA:</span>
                  <span className="font-bold">{lastCheckoutOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>FECHA:</span>
                  <span>{new Date(lastCheckoutOrder.timestamp).toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between">
                  <span>CAJERO:</span>
                  <span>{lastCheckoutOrder.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>MESA / UBICACIÓN:</span>
                  <span className="font-bold">{lastCheckoutOrder.tableNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>CLIENTE:</span>
                  <span>{lastCheckoutOrder.customerName}</span>
                </div>
              </div>

              <div className="border-b border-dashed border-neutral-300 my-2"></div>

              {/* Items listing */}
              <div className="space-y-1.5 text-[10px]">
                {lastCheckoutOrder.items.map((item: any, idx: number) => {
                  const unitPrice = item.price + (item.selectedVariant?.price || 0);
                  return (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between">
                        <span>{item.quantity}x {item.name.toUpperCase()}</span>
                        <span className="font-bold">${(unitPrice * item.quantity).toLocaleString("es-CL")}</span>
                      </div>
                      {item.selectedVariant && (
                        <div className="text-[9px] text-neutral-500 pl-2">
                          * EX: {item.selectedVariant.name.toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-b border-dashed border-neutral-300 my-2"></div>

              {/* Total calculations */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>TOTAL COBRADO:</span>
                  <span>${lastCheckoutOrder.total.toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>PAGO REGISTRADO:</span>
                  <span className="font-bold">
                    {lastCheckoutOrder.paymentMethod === "card" && "TARJETA DEB/CRÉD"}
                    {lastCheckoutOrder.paymentMethod === "cash" && "EFECTIVO"}
                    {lastCheckoutOrder.paymentMethod === "transfer" && "TRANSFERENCIA"}
                  </span>
                </div>
              </div>

              <div className="border-b border-dashed border-neutral-300 my-2"></div>

              <div className="text-center space-y-1 pt-1">
                <p className="text-[8px] text-neutral-400">
                  DOCUMENTO TRIBUTARIO SIMULADO<br />
                  ¡GRACIAS POR TU PREFERENCIA!
                </p>
                {/* Simulated barcode */}
                <div className="h-6 w-full bg-neutral-900/10 flex items-center justify-center tracking-[4px] text-[8px] text-neutral-500 select-none font-bold overflow-hidden">
                  ||||| | | |||| ||| |||| | ||| | |||
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setLastCheckoutOrder(null)}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-center"
              >
                Cerrar Ticket
              </button>
              <button
                onClick={() => {
                  alert("Impresora térmica simulada: ¡Ticket de compra enviado al spooler!");
                  setLastCheckoutOrder(null);
                }}
                className="flex-1 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 rounded-xl shadow flex items-center justify-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir Boleta
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
