import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Product, OrderItem, Variant } from "../types";
import { AiAssistant } from "./AiAssistant";
import { 
  Flame, Pizza, Salad, CupSoda, IceCream, Plus, Minus, Trash, 
  ShoppingBag, ShoppingCart, X, HelpCircle, Bot, Phone, MapPin, 
  CheckCircle, ArrowRight, ShieldCheck, ClipboardCheck
} from "lucide-react";

export const OnlineStore: React.FC = () => {
  const { products, categories, activeBranch, addOrder } = useApp();

  const [selectedCategory, setSelectedCategory] = useState("hamburguesas");
  const [storeCart, setStoreCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup" | "table">("pickup");
  const [addressOrTable, setAddressOrTable] = useState("Mesa de la sucursal");
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<any | null>(null);

  // Variant modal states
  const [activeVariantSelector, setActiveVariantSelector] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(undefined);

  // Chatbot floating state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Math Calculations
  const cartItemCount = storeCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = storeCart.reduce(
    (sum, item) => sum + (item.price + (item.selectedVariant?.price || 0)) * item.quantity,
    0
  );

  const handleAddProduct = (prod: Product) => {
    if (prod.variants && prod.variants.length > 0) {
      setActiveVariantSelector(prod);
      setSelectedVariant(prod.variants[0]);
    } else {
      addToCartWithDetails(prod, undefined);
    }
  };

  const addToCartWithDetails = (prod: Product, variant?: Variant) => {
    const cartItemId = variant ? `${prod.id}-${variant.name}` : prod.id;
    const existingIndex = storeCart.findIndex(item => item.id === cartItemId);

    if (existingIndex > -1) {
      const updated = [...storeCart];
      updated[existingIndex].quantity += 1;
      setStoreCart(updated);
    } else {
      setStoreCart([
        ...storeCart,
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

  const handleIncrement = (id: string) => {
    setStoreCart(storeCart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const handleDecrement = (id: string) => {
    const item = storeCart.find(i => i.id === id);
    if (!item) return;

    if (item.quantity === 1) {
      setStoreCart(storeCart.filter(i => i.id !== id));
    } else {
      setStoreCart(storeCart.map(i => i.id === id ? { ...item, quantity: item.quantity - 1 } : item));
    }
  };

  const handleRemove = (id: string) => {
    setStoreCart(storeCart.filter(i => i.id !== id));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeCart.length === 0 || !orderName) return;

    const tableOrInfo = deliveryType === "table" 
      ? `Mesa ${addressOrTable}` 
      : deliveryType === "pickup" 
        ? "Online - Retiro" 
        : `Online - Envío: ${addressOrTable}`;

    const newOrder = addOrder({
      sucursalId: activeBranch?.id || "suc-1",
      sucursalName: activeBranch?.name || "Sucursal",
      tableNo: tableOrInfo,
      items: storeCart,
      status: "pending", // Starts as pending pipeline for admin to prepare
      type: "online",
      paymentMethod: "cash", // Simulated Cash on delivery/pickup
      paymentStatus: "pending",
      customerName: orderName,
      customerPhone: orderPhone
    });

    setCheckoutSuccessOrder(newOrder);
    setStoreCart([]);
    setIsCheckingOut(false);
    setIsCartOpen(false);
  };

  const handleApplyAiSuggestedItem = (prod: Product, variant?: Variant) => {
    addToCartWithDetails(prod, variant);
    // Show short floating indicator or open cart to confirm add
    setIsCartOpen(true);
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in relative min-h-[calc(100vh-140px)]" id="online-store-view">
      
      {/* 1. HERO BANNER DE PRESENTACIÓN DE TIENDA */}
      <div className="bg-neutral-950 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-between h-[340px] md:h-[300px]">
        {/* Background visual detail */}
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 bg-[radial-gradient(circle_at_top_right,var(--color-amber-500),transparent_60%)] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-5 bg-[radial-gradient(circle_at_bottom_left,var(--color-emerald-500),transparent_50%)] pointer-events-none"></div>

        <div className="space-y-4 max-w-xl z-10">
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20 text-[10px] uppercase font-mono tracking-wider w-max">
            <Bot className="w-3.5 h-3.5" />
            Asistente IA Conectado
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none text-white">
            Ordena Fácil, Rápido y Personalizado.
          </h1>
          <p className="text-neutral-400 text-sm max-w-lg">
            Explora nuestra carta, personaliza tus ingredientes con la ayuda de nuestro chatbot experto en gastronomía y retira al instante.
          </p>
        </div>

        {/* Store location tag / Cart status */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800/60 pt-6 z-10">
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-neutral-200">Pidiento en: {activeBranch?.name}</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">{activeBranch?.address}</span>
          </div>

          <button
            id="btn-open-store-cart"
            onClick={() => setIsCartOpen(true)}
            className="bg-white hover:bg-neutral-100 text-neutral-950 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            Mi Carrito
            {cartItemCount > 0 && (
              <span className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-mono animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. CATEGORIES SELECTOR */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide border-b border-neutral-200">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat.id
                ? "bg-neutral-950 border-neutral-950 text-white shadow-sm"
                : "bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            {renderCategoryIcon(cat.icon)}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 3. MENU LISTING GRID */}
      <div className="space-y-6">
        <h2 className="font-bold text-neutral-950 text-xl tracking-tight uppercase">
          {categories.find(c => c.id === selectedCategory)?.name || "Menú"}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products
            .filter((p) => p.category === selectedCategory && p.isAvailable)
            .map((p) => (
              <div 
                key={p.id} 
                className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-neutral-300 group"
              >
                <div>
                  <div className="h-52 bg-neutral-100 overflow-hidden relative">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-neutral-200 font-mono text-xs font-extrabold text-neutral-900 shadow">
                      ${p.price.toLocaleString("es-CL")}
                    </span>
                  </div>

                  <div className="p-5 space-y-1.5">
                    <h3 className="font-bold text-neutral-950 text-sm tracking-tight">{p.name}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3">{p.description}</p>
                    
                    {p.variants && p.variants.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {p.variants.map((v, idx) => (
                          <span key={idx} className="bg-neutral-50 border border-neutral-100 text-[9px] text-neutral-500 px-2 py-0.5 rounded font-medium">
                            {v.name} (+${v.price})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    id={`btn-add-store-${p.id}`}
                    onClick={() => handleAddProduct(p)}
                    className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 4. MODAL DE VARIANTES / ADICIONALES */}
      {activeVariantSelector && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xl max-w-sm w-full space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h4 className="font-bold text-neutral-950 text-sm tracking-tight">Opciones de Menú</h4>
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
              Agregar Selección
            </button>
          </div>
        </div>
      )}

      {/* 5. SLIDE-OUT DRAWER DE CARRITO DE COMPRAS */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex justify-end z-50 animate-fade-in">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-slide-left p-6 relative">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="font-bold text-neutral-950 text-base flex items-center gap-1.5">
                <ShoppingBag className="w-5 h-5 text-neutral-800" />
                Mi Carrito
              </h3>
              <button
                id="btn-close-store-cart"
                onClick={() => setIsCartOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 p-1 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {storeCart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-neutral-200 animate-pulse" />
                  <p className="text-sm max-w-[200px]">Tu carrito está vacío. ¡Elige tus antojos para agregarlos!</p>
                </div>
              ) : (
                storeCart.map((item) => {
                  const unitPrice = item.price + (item.selectedVariant?.price || 0);
                  return (
                    <div key={item.id} className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4 last:border-0">
                      <div className="space-y-1 flex-1">
                        <span className="font-bold text-neutral-900 text-xs block leading-tight">{item.name}</span>
                        {item.selectedVariant && (
                          <span className="text-[10px] text-neutral-500 block">
                            Adicional: {item.selectedVariant.name} (+${item.selectedVariant.price})
                          </span>
                        )}
                        <span className="font-mono text-xs font-semibold text-neutral-700 block">
                          ${unitPrice.toLocaleString("es-CL")} c/u
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                          <button
                            onClick={() => handleDecrement(item.id)}
                            className="p-1 hover:bg-white text-neutral-600 rounded transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs px-1.5 text-neutral-950">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrement(item.id)}
                            className="p-1 hover:bg-white text-neutral-600 rounded transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-neutral-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Checkout Form section */}
            {storeCart.length > 0 && (
              <div className="border-t border-neutral-100 pt-4 space-y-4 bg-neutral-50 -mx-6 -mb-6 p-6">
                {!isCheckingOut ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-neutral-950">Total de tu Pedido:</span>
                      <span className="font-mono font-extrabold text-neutral-950 text-xl">
                        ${cartSubtotal.toLocaleString("es-CL")}
                      </span>
                    </div>

                    <button
                      id="btn-start-checkout"
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
                    >
                      <span>Ir a la Caja</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Detalles de Entrega</h4>
                      <button
                        type="button"
                        onClick={() => setIsCheckingOut(false)}
                        className="text-[10px] font-semibold text-neutral-500 hover:text-neutral-950"
                      >
                        ← Volver al carro
                      </button>
                    </div>

                    {/* Delivery type selectors */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryType("pickup");
                          setAddressOrTable("Retiro en sucursal");
                        }}
                        className={`py-2 px-1 rounded-lg border text-[10px] font-semibold cursor-pointer text-center ${
                          deliveryType === "pickup"
                            ? "bg-neutral-950 border-neutral-950 text-white"
                            : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                        }`}
                      >
                        Retirar en Local
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryType("delivery");
                          setAddressOrTable("");
                        }}
                        className={`py-2 px-1 rounded-lg border text-[10px] font-semibold cursor-pointer text-center ${
                          deliveryType === "delivery"
                            ? "bg-neutral-950 border-neutral-950 text-white"
                            : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                        }`}
                      >
                        A Domicilio
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryType("table");
                          setAddressOrTable("Mesa 1");
                        }}
                        className={`py-2 px-1 rounded-lg border text-[10px] font-semibold cursor-pointer text-center ${
                          deliveryType === "table"
                            ? "bg-neutral-950 border-neutral-950 text-white"
                            : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                        }`}
                      >
                        Estoy en la Mesa
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Tu Nombre"
                        value={orderName}
                        onChange={(e) => setOrderName(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-950"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Teléfono (Ej. +56912345678)"
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-950 text-neutral-800"
                      />
                      <input
                        type="text"
                        required
                        placeholder={
                          deliveryType === "delivery" 
                            ? "Dirección completa de entrega" 
                            : deliveryType === "table" 
                              ? "Número de mesa (Ej. Mesa 5)" 
                              : "Detalles del retiro"
                        }
                        value={addressOrTable}
                        onChange={(e) => setAddressOrTable(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-950"
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs py-1">
                      <span className="text-neutral-500">Monto total final:</span>
                      <span className="font-mono font-bold text-sm">${cartSubtotal.toLocaleString("es-CL")}</span>
                    </div>

                    <button
                      id="btn-submit-store-order"
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow cursor-pointer"
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      Enviar Pedido a Cocina
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* 6. MODAL DE CONFIRMACION EXITOSA DE PEDIDO ONLINE */}
      {checkoutSuccessOrder && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xl max-w-sm w-full space-y-4 text-center animate-scale-up">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-neutral-950 text-lg tracking-tight">¡Pedido Recibido Exitosamente!</h3>
              <p className="text-xs text-neutral-500 leading-normal">
                Tu orden ha sido inyectada directamente en la cocina de la sucursal <span className="font-semibold text-neutral-800">{checkoutSuccessOrder.sucursalName}</span>.
              </p>
            </div>

            {/* Ticket details */}
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-left space-y-1.5 text-xs text-neutral-600 font-mono">
              <div className="flex justify-between font-bold text-neutral-900">
                <span>CÓDIGO DE ORDEN:</span>
                <span>{checkoutSuccessOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>CLIENTE:</span>
                <span>{checkoutSuccessOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>ENTREGA:</span>
                <span>{checkoutSuccessOrder.tableNo}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-1.5 font-bold text-neutral-950">
                <span>TOTAL A PAGAR:</span>
                <span>${checkoutSuccessOrder.total.toLocaleString("es-CL")}</span>
              </div>
              <div className="text-[10px] text-neutral-400 mt-2 text-center font-sans">
                Puedes consultar el estado de tu comida directamente con nuestro Asistente de IA abajo a la derecha.
              </div>
            </div>

            <button
              onClick={() => setCheckoutSuccessOrder(null)}
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Entendido, Seguir Mirando
            </button>
          </div>
        </div>
      )}

      {/* 7. FLOATING AI ASSISTANT TRIGGERS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Expanded Chatbot Modal */}
        {isChatOpen && (
          <div className="w-[360px] h-[500px] bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col animate-scale-up">
            <div className="bg-neutral-950 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center text-neutral-950 font-bold shadow-md">
                  <Bot className="w-4 h-4 text-neutral-950" />
                </div>
                <div>
                  <h4 className="font-bold text-xs tracking-wide">FoodHub Inteligente</h4>
                  <p className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span>
                    Online y Asistente
                  </p>
                </div>
              </div>
              <button
                id="btn-close-ai-chat"
                onClick={() => setIsChatOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Embedded chatbot logic */}
            <div className="flex-1 min-h-0 bg-neutral-50">
              <AiAssistant 
                onAddToCart={handleApplyAiSuggestedItem} 
                isEmbedded={true}
              />
            </div>
          </div>
        )}

        {/* Floating Bubble Toggle Button */}
        <button
          id="btn-toggle-ai-chat"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-neutral-950 hover:bg-neutral-800 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center shadow-2xl transition-all border border-neutral-800 cursor-pointer relative group"
          title="Hablar con FoodHub IA"
        >
          {isChatOpen ? (
            <X className="w-6 h-6 animate-spin-once" />
          ) : (
            <>
              <Bot className="w-6 h-6 text-white animate-bounce-slow" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-neutral-950">
                <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full animate-ping"></span>
              </span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
