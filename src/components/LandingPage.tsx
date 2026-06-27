import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Rocket,
  Terminal,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  HeartHandshake,
  Calculator,
  Check,
  Building,
  User as UserIcon,
  Mail,
  Phone,
  Utensils,
  Smartphone,
  ChevronDown,
  Info,
  DollarSign,
  Star,
  Users,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const LandingPage: React.FC = () => {
  const { addWaitlistProspect, waitlist, changeUserRole } = useApp();
  const [isDemosOpen, setIsDemosOpen] = useState(false);

  // Form states
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurantType, setRestaurantType] = useState("Hamburguesería");
  const [monthlyOrders, setMonthlyOrders] = useState("500 - 1000");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [assignedQueue, setAssignedQueue] = useState(128);

  // Calculator states
  const [ordersCount, setOrdersCount] = useState(750);
  const [avgTicket, setAvgTicket] = useState(12500); // in CLP

  // Product Simulator tab state
  const [activeSimTab, setActiveSimTab] = useState<"pos" | "store" | "ai">("pos");

  // POS Simulator state
  const [posCart, setPosCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Store Simulator state
  const [storeCustomization, setStoreCustomization] = useState({ extraCheese: false, spicy: false });
  const [storeOrderStatus, setStoreOrderStatus] = useState<"idle" | "ordered">("idle");

  // AI Chatbot Simulator state
  const [aiChat, setAiChat] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "¡Hola! Soy el asistente inteligente de tu local. ¿Qué te gustaría ordenar o consultar sobre nuestra carta hoy?" }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !ownerName || !email || !phone) return;

    setIsSubmitting(true);
    
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessName,
          ownerName,
          email,
          phone,
          restaurantType,
          monthlyOrders
        })
      });
    } catch (error) {
      console.error("Error submitting waitlist:", error);
    }
    
    // Add to local state context
    addWaitlistProspect({
      businessName,
      ownerName,
      email,
      phone,
      restaurantType,
      monthlyOrders
    });
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setAssignedQueue(164 + waitlist.length);
  };

  // Savings Math
  const totalVolume = ordersCount * avgTicket;
  const commissionPercentage = 0.27;
  const deliveryCommissions = Math.round(totalVolume * commissionPercentage);
  const foodhubFixedSubscription = 59900; // 59.900 CLP flat monthly SaaS fee
  const estimatedSavings = deliveryCommissions - foodhubFixedSubscription;

  // Interactive POS helper functions
  const addPosItem = (item: { id: string; name: string; price: number }) => {
    setPosCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handlePosPayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentDone(true);
      setTimeout(() => {
        setPaymentDone(false);
        setPosCart([]);
      }, 2500);
    }, 1500);
  };

  // Interactive AI chatbot responses
  const triggerAiResponse = (userText: string, aiText: string) => {
    if (isAiTyping) return;
    setAiChat(prev => [...prev, { sender: "user", text: userText }]);
    setIsAiTyping(true);

    setTimeout(() => {
      setAiChat(prev => [...prev, { sender: "ai", text: aiText }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const faqData = [
    {
      q: "¿FoodHub reemplaza por completo a las aplicaciones de delivery tradicionales?",
      a: "No necesariamente. FoodHub te permite convivir con ellas mientras potencias tu propio canal directo sin comisiones. Al dirigir a tus clientes recurrentes a tu tienda FoodHub (vía QR en mesa o links en Instagram), dejas de pagar el 25% - 30% de comisión por aquellos clientes que ya te conocen."
    },
    {
      q: "¿Cómo funciona el Asistente de IA?",
      a: "Está integrado con la API oficial de Google Gemini. Lee de forma automática tu catálogo cargado en FoodHub (ingredientes, precios, disponibilidad) para responder a tus clientes preguntas sobre alérgenos, sugerir acompañamientos o ayudarles a armar su pedido ideal directamente desde WhatsApp o web."
    },
    {
      q: "¿Necesito comprar hardware o terminales especiales?",
      a: "Para nada. La plataforma web de FoodHub es 100% responsiva y corre en cualquier tablet, iPad, computadora o teléfono móvil que ya poseas. Además, es compatible con impresoras de comandas térmicas estándar para despachar pedidos automáticamente a cocina."
    },
    {
      q: "¿Cómo se gestionan los pagos en la tienda online?",
      a: "Tus clientes pagan directo a tu cuenta a través de integraciones locales confiables como Webpay, MercadoPago o mediante transferencias electrónicas automáticas. El dinero llega de forma directa a ti sin intermediarios ni retenciones injustificadas."
    }
  ];

  return (
    <div id="foodhub-artisanal-landing" className="bg-[#FAF9F6] text-neutral-900 min-h-screen selection:bg-neutral-900 selection:text-white font-sans pb-24 antialiased">

      {/* Top Banner / Announcement with sleek black backing */}
      <div className="bg-neutral-950 text-neutral-100 text-center py-2.5 px-4 text-xs font-medium tracking-wide">
        <span className="inline-flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          Ahorra más del 25% de comisiones mensuales migrando a FoodHub Flat SaaS.
        </span>
      </div>

      {/* Elegant Header Navigation */}
      <header className="border-b border-neutral-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-neutral-950 text-white p-2 rounded-xl shadow-sm">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-neutral-950">foodhub</span>
            <span className="bg-neutral-100 border border-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">SAAS</span>
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-medium text-neutral-600">
            <a href="#solucion-integrada" className="hover:text-neutral-950 transition-colors">Características</a>
            <a href="#simulador" className="hover:text-neutral-950 transition-colors">Simulador</a>
            <a href="#calculadora" className="hover:text-neutral-950 transition-colors">Calculadora</a>
            <a href="#faq" className="hover:text-neutral-950 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Custom interactive dropdown for Demos */}
            <div className="relative">
              <button
                onClick={() => setIsDemosOpen(!isDemosOpen)}
                className="bg-white hover:bg-neutral-50 text-neutral-800 px-3.5 py-2 rounded-xl text-xs font-display font-bold tracking-wide transition-all border border-neutral-200 shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Probar Demos</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isDemosOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isDemosOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDemosOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 p-2 py-2.5 space-y-1"
                    >
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest px-3 py-1 block">Módulos del Sistema</span>

                      <button
                        onClick={() => {
                          setIsDemosOpen(false);
                          changeUserRole("admin");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-neutral-50 transition-all flex items-center gap-2 font-medium text-neutral-700 hover:text-neutral-950 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-neutral-950" />
                        <span>Panel Administrador</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDemosOpen(false);
                          changeUserRole("cajero");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-neutral-50 transition-all flex items-center gap-2 font-medium text-neutral-700 hover:text-neutral-950 cursor-pointer"
                      >
                        <Terminal className="w-4 h-4 text-neutral-950" />
                        <span>Terminal POS Caja</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDemosOpen(false);
                          changeUserRole("customer");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-neutral-50 transition-all flex items-center gap-2 font-medium text-neutral-700 hover:text-neutral-950 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-neutral-950" />
                        <span>Tienda E-Commerce</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#waitlist-form-card"
              className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-display font-bold tracking-wide transition-all shadow-sm"
            >
              Unirse
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left: Headline & Key Advantages */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-neutral-950 leading-[1.05]">
                La plataforma de venta sin comisiones que tu negocio merece.
              </h1>

              <p className="text-neutral-600 text-base sm:text-lg max-w-2xl leading-relaxed">
                Diseñado exclusivamente para el rubro gastronómico moderno. FoodHub integra un <strong>Hub de atención ultrarrápido</strong>, tu propio <strong>e-commerce web</strong> independiente de las apps tradicionales de delivery, y un <strong>Asistente inteligente con IA</strong> que atiende comensales por ti.
              </p>

              {/* Grid of Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="bg-neutral-950 text-white p-1.5 rounded-lg mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-neutral-900">Punto de venta Multicanal</h4>
                    <p className="text-xs text-neutral-500">Manejo de caja, cierres de turnos y arqueos instantáneos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-neutral-950 text-white p-1.5 rounded-lg mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-neutral-900">E-Commerce con 0% Comisión</h4>
                    <p className="text-xs text-neutral-500">Recibe pedidos de delivery y retiro directo a tu cuenta.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-neutral-950 text-white p-1.5 rounded-lg mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-neutral-900">Chat de IA Integrado</h4>
                    <p className="text-xs text-neutral-500">Ten un vendedor disponible 24/7.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-neutral-950 text-white p-1.5 rounded-lg mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-neutral-900">Configuración en 10 Minutos</h4>
                    <p className="text-xs text-neutral-500">Carga de menú por lotes e integración local sin fricciones.</p>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="pt-4 flex items-center gap-6 border-t border-neutral-200">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border-2 border-white flex items-center justify-center font-bold text-[10px] text-white">M</div>
                  <div className="w-8 h-8 rounded-full bg-neutral-700 border-2 border-white flex items-center justify-center font-bold text-[10px] text-white">A</div>
                  <div className="w-8 h-8 rounded-full bg-neutral-500 border-2 border-white flex items-center justify-center font-bold text-[10px] text-white">S</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />)}
                  </div>
                  <p className="text-xs text-neutral-500">Más de 100 negocios ya se inscribieron en la lista de espera.</p>
                </div>
              </div>
            </div>

            {/* Right: High-fidelity Premium Sign-up Card */}
            <div id="waitlist-form-card" className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-3xl shadow-xl shadow-neutral-900/5 relative overflow-hidden"
              >
                {/* Visual accent top line - Sleek black line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-950"></div>

                {!isSuccess ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1 pb-2">
                      <h3 className="text-2xl font-serif font-black text-neutral-900 tracking-tight flex items-center gap-2">
                        <Rocket className="text-neutral-950 w-5 h-5" />
                        Acceso Prioritario
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Inscríbete hoy y asegura una tarifa plana preferencial de por vida sin cargos por comisiones de ventas.
                      </p>
                    </div>

                    {/* Local Business Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Nombre de tu Restaurante</label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Ej. Burguesería San Telmo"
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3 pl-11 pr-4 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Contact Owner */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Nombre del Propietario</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Ej. Sofía Mendoza"
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3 pl-11 pr-4 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Email & Phone Rows */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">E-mail Corporativo</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3 w-3.5 h-3.5 text-neutral-400" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sofia@negocio.com"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Teléfono Móvil</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3 w-3.5 h-3.5 text-neutral-400" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+56 9 8765 4321"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Rubro & Volumen Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Rubro Principal</label>
                        <div className="relative">
                          <Utensils className="absolute left-3.5 top-3 w-3.5 h-3.5 text-neutral-400" />
                          <select
                            value={restaurantType}
                            onChange={(e) => setRestaurantType(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-700 focus:outline-none focus:border-neutral-950 focus:bg-white cursor-pointer transition-all appearance-none"
                          >
                            <option value="Hamburguesería">Hamburguesería</option>
                            <option value="Cafetería">Cafetería</option>
                            <option value="Pizzería">Pizzería</option>
                            <option value="Sushi / Asiático">Sushi / Asiático</option>
                            <option value="Bar / Cervecería">Bar / Cervecería</option>
                            <option value="Restaurante Gourmet">Restaurante Gourmet</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Pedidos Mensuales</label>
                        <div className="relative">
                          <TrendingUp className="absolute left-3.5 top-3 w-3.5 h-3.5 text-neutral-400" />
                          <select
                            value={monthlyOrders}
                            onChange={(e) => setMonthlyOrders(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-700 focus:outline-none focus:border-neutral-950 focus:bg-white cursor-pointer transition-all appearance-none"
                          >
                            <option value="Menos de 200">Menos de 200</option>
                            <option value="200 - 500">200 - 500</option>
                            <option value="500 - 1000">500 - 1000</option>
                            <option value="1000 - 2500">1000 - 2500</option>
                            <option value="2500+">Más de 2500</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button - Solid Black */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-display font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-neutral-950/10 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Inscribiendo en base de datos...</span>
                        </>
                      ) : (
                        <>
                          <span>Inscribirme en Lista de Espera</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-neutral-400">
                      Sin compromisos financieros. Tu tarifa plana de lanzamiento garantizada.
                    </p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-4"
                  >
                    <div className="inline-flex items-center justify-center bg-neutral-100 text-neutral-950 p-4 rounded-full border border-neutral-200 shadow-inner">
                      <CheckCircle className="w-12 h-12 stroke-[2.5]" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-serif font-black text-neutral-900 tracking-tight">¡Inscripción Exitosa!</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
                        Hemos registrado tu marca <strong>{businessName}</strong>. Eres parte de nuestra tanda prioritaria de lanzamientos.
                      </p>
                    </div>

                    {/* Modern ticket queue presentation */}
                    <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-1.5 max-w-xs mx-auto">
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">TU POSICIÓN EN LA COLA</span>
                      <h2 className="text-4xl font-extrabold tracking-tight text-neutral-950 font-mono">#{assignedQueue}</h2>
                      <p className="text-[10px] text-neutral-500 leading-tight">
                        Te asignamos un gestor técnico. Recibirás tu invitación beta al correo electrónico provisto.
                      </p>
                    </div>

                    {/* Interactive CTAs inside card */}
                    <div className="pt-3 space-y-2.5">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">¿Quieres probar la aplicación ya mismo?</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => changeUserRole("admin")}
                          className="bg-white hover:bg-neutral-50 text-neutral-800 font-display font-bold py-2.5 px-3 rounded-xl text-xs border border-neutral-200 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-neutral-950" />
                          <span>Ver Admin</span>
                        </button>
                        <button
                          onClick={() => changeUserRole("cajero")}
                          className="bg-white hover:bg-neutral-50 text-neutral-800 font-display font-bold py-2.5 px-3 rounded-xl text-xs border border-neutral-200 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Terminal className="w-3.5 h-3.5 text-neutral-950" />
                          <span>Probar POS</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Badges - Square / Shopify inspired flat monochrome row */}
      <section className="bg-white border-y border-neutral-200/80 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-5">
            CONSTRUIDO CON INFRAESTRUCTURA PREMIUM COMPATIBLE
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="font-mono font-bold text-sm tracking-widest text-neutral-800">SUPABASE</span>
            <span className="font-mono font-bold text-sm tracking-widest text-neutral-800">GEMINI API</span>
            <span className="font-mono font-bold text-sm tracking-widest text-neutral-800">DATOS ENCRIPTADOS</span>
            <span className="font-mono font-bold text-sm tracking-widest text-neutral-800">RESEND</span>
            <span className="font-mono font-bold text-sm tracking-widest text-neutral-800">KAPSO</span>
          </div>
        </div>
      </section>

      {/* Interactive Live Product Simulator Section */}
      <section id="simulador" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono">DEMOSTRACIÓN INTERACTIVA</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-neutral-950 tracking-tight">Prueba el ecosistema FoodHub en vivo</h2>
          <p className="text-neutral-500 text-sm font-sans">
            Interactúa con nuestro simulador a continuación para entender cómo FoodHub unifica todas las áreas del restaurante en un único ecosistema fluido.
          </p>
        </div>

        {/* Tab Switcher - Square Hardware Style */}
        <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0">

          {/* Left: Tab Selectors */}
          <div className="lg:col-span-4 border-r border-neutral-200 bg-neutral-50/50 p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-400 text-xs mb-4 uppercase tracking-wider font-mono">Selecciona un Módulo</h3>

              {/* Tab 1: POS */}
              <button
                onClick={() => setActiveSimTab("pos")}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${activeSimTab === "pos"
                  ? "bg-neutral-950 border-neutral-950 text-white shadow-sm"
                  : "border-transparent hover:bg-neutral-100 text-neutral-500"
                  }`}
              >
                <div className={`p-2.5 rounded-xl ${activeSimTab === "pos" ? "bg-white/15 text-white" : "bg-neutral-100 text-neutral-400"}`}>
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs">Punto de Venta (POS)</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">La terminal de caja rápida para tus camareros.</p>
                </div>
              </button>

              {/* Tab 2: Store */}
              <button
                onClick={() => setActiveSimTab("store")}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${activeSimTab === "store"
                  ? "bg-neutral-950 border-neutral-950 text-white shadow-sm"
                  : "border-transparent hover:bg-neutral-100 text-neutral-500"
                  }`}
              >
                <div className={`p-2.5 rounded-xl ${activeSimTab === "store" ? "bg-white/15 text-white" : "bg-neutral-100 text-neutral-400"}`}>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs">Tienda Delivery Directo</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Tu menú web interactivo para pedidos sin comisiones.</p>
                </div>
              </button>

              {/* Tab 3: AI Assistant */}
              <button
                onClick={() => setActiveSimTab("ai")}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${activeSimTab === "ai"
                  ? "bg-neutral-950 border-neutral-950 text-white shadow-sm"
                  : "border-transparent hover:bg-neutral-100 text-neutral-500"
                  }`}
              >
                <div className={`p-2.5 rounded-xl ${activeSimTab === "ai" ? "bg-white/15 text-white" : "bg-neutral-100 text-neutral-400"}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs">Asistente Inteligente IA</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Atención automatizada entrenada con Google Gemini.</p>
                </div>
              </button>
            </div>

            <div className="pt-6 border-t border-neutral-200 mt-6 lg:mt-0 text-xs text-neutral-400 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-neutral-950" />
              <span>Demostración con datos locales integrados.</span>
            </div>
          </div>

          {/* Right: Simulated Screen View */}
          <div className="lg:col-span-8 p-6 sm:p-10 bg-neutral-950/5 flex items-center justify-center min-h-[440px] relative">
            <div className="absolute inset-0 bg-neutral-950/5 pointer-events-none"></div>

            <div className="w-full max-w-md bg-white text-neutral-800 rounded-2xl shadow-lg border border-neutral-200 overflow-hidden flex flex-col h-[380px]">

              {/* Device Header Bar */}
              <div className="bg-neutral-900 text-white py-2 px-4 text-[10px] flex justify-between items-center font-mono tracking-wider uppercase">
                <span>Simulador de Hardware</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  <span>ONLINE</span>
                </span>
              </div>

              {/* Interactive Screens */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">

                {/* 1. POS TERMINAL SCREEN */}
                {activeSimTab === "pos" && (
                  <div className="h-full flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                        <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide font-display">Caja Registradora #1</span>
                        <span className="bg-neutral-100 border border-neutral-200 text-neutral-800 text-[9px] font-bold px-2 py-0.5 rounded-full">Turno Abierto</span>
                      </div>

                      {/* Products to click */}
                      <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Toca un plato para agregarlo al carro:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => addPosItem({ id: "burger", name: "Doble Burger", price: 7900 })}
                          className="bg-white border border-neutral-200 hover:border-neutral-950 p-2 rounded-xl text-left hover:bg-neutral-50 transition-all cursor-pointer shadow-sm animate-scale-up"
                        >
                          <h5 className="font-bold text-xs text-neutral-800">🍔 Doble Burger</h5>
                          <span className="text-[10px] text-neutral-950 font-bold font-mono">$7.900 CLP</span>
                        </button>
                        <button
                          onClick={() => addPosItem({ id: "beer", name: "Cerveza IPA", price: 4200 })}
                          className="bg-white border border-neutral-200 hover:border-neutral-950 p-2 rounded-xl text-left hover:bg-neutral-50 transition-all cursor-pointer shadow-sm animate-scale-up"
                        >
                          <h5 className="font-bold text-xs text-neutral-800">🍺 Cerveza IPA</h5>
                          <span className="text-[10px] text-neutral-950 font-bold font-mono">$4.200 CLP</span>
                        </button>
                      </div>
                    </div>

                    {/* Cart list preview */}
                    <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-3 flex-1 min-h-[110px] flex flex-col justify-between shadow-inner">
                      <div className="space-y-1 overflow-y-auto max-h-[85px] pr-1">
                        {posCart.length === 0 ? (
                          <p className="text-center text-[11px] text-neutral-400 py-6">El carro del POS está vacío</p>
                        ) : (
                          posCart.map(item => (
                            <div key={item.id} className="flex justify-between text-xs border-b border-neutral-100 pb-1 font-mono">
                              <span>{item.name} x{item.qty}</span>
                              <span className="font-bold">${(item.price * item.qty).toLocaleString("es-CL")}</span>
                            </div>
                          ))
                        )}
                      </div>

                      {posCart.length > 0 && (
                        <div className="border-t border-neutral-200 pt-2 mt-2 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">Total POS</span>
                            <span className="text-sm font-black text-neutral-950 font-mono">
                              ${posCart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0).toLocaleString("es-CL")}
                            </span>
                          </div>

                          {!paymentDone ? (
                            <button
                              onClick={handlePosPayment}
                              disabled={isPaying}
                              className="bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors font-display"
                            >
                              {isPaying ? (
                                <>
                                  <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                  <span>Procesando...</span>
                                </>
                              ) : (
                                <>
                                  <span>Generar Cobro</span>
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-neutral-950 font-mono font-bold text-xs flex items-center gap-1 animate-pulse bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                              <Check className="w-3.5 h-3.5 stroke-[3.5]" /> ¡PAGADO!
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. ONLINE STORE SCREEN */}
                {activeSimTab === "store" && (
                  <div className="h-full flex flex-col justify-between space-y-3 animate-scale-up">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-xl">
                        <span className="text-[10px] text-neutral-500 truncate max-w-[200px] font-mono">tu-local.foodhub.cl</span>
                        <span className="text-[8px] font-bold text-neutral-950 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded-full">Web Oficial</span>
                      </div>

                      <div className="bg-white border border-neutral-200 rounded-xl p-3 flex gap-3 items-center shadow-sm">
                        <div className="bg-neutral-100 text-lg p-2 rounded-xl">🍕</div>
                        <div className="flex-1">
                          <h4 className="font-serif font-bold text-xs text-neutral-800">Pizza Margherita Especial</h4>
                          <p className="text-[9px] text-neutral-400 leading-tight">Mozzarella fresca, albahaca y aceite de oliva extra virgen.</p>
                          <span className="text-xs font-bold text-neutral-950 block mt-1 font-mono">$10.900 CLP</span>
                        </div>
                      </div>
                    </div>

                    {/* Customization checkboxes */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 space-y-2">
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Adicionales:</span>
                      <div className="flex justify-between items-center text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={storeCustomization.extraCheese}
                            onChange={(e) => setStoreCustomization(prev => ({ ...prev, extraCheese: e.target.checked }))}
                            className="rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950 w-4 h-4"
                          />
                          <span>Queso extra (+$1.500)</span>
                        </label>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={storeCustomization.spicy}
                            onChange={(e) => setStoreCustomization(prev => ({ ...prev, spicy: e.target.checked }))}
                            className="rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950 w-4 h-4"
                          />
                          <span>Salsa picante artesanal (+$500)</span>
                        </label>
                      </div>
                    </div>

                    {/* Order action */}
                    <div>
                      {storeOrderStatus === "idle" ? (
                        <button
                          onClick={() => {
                            setStoreOrderStatus("ordered");
                            setTimeout(() => setStoreOrderStatus("idle"), 3500);
                          }}
                          className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-display font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
                        >
                          <span>Ordenar Directo (${(10900 + (storeCustomization.extraCheese ? 1500 : 0) + (storeCustomization.spicy ? 500 : 0)).toLocaleString("es-CL")} CLP)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="bg-neutral-100 border border-neutral-200 text-neutral-900 p-2 rounded-xl text-center text-xs font-bold animate-pulse">
                          🎉 ¡Pedido Enviado! Entró directo al POS sin comisiones.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. AI CHATBOT SCREEN */}
                {activeSimTab === "ai" && (
                  <div className="h-full flex flex-col justify-between space-y-2 animate-scale-up">
                    <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl p-3 flex flex-col space-y-2 overflow-y-auto max-h-[220px] text-xs shadow-inner">
                      {aiChat.map((msg, i) => (
                        <div key={i} className={`p-2.5 rounded-2xl max-w-[85%] leading-tight ${msg.sender === "ai"
                          ? "bg-white border border-neutral-200/50 self-start text-neutral-800 shadow-sm"
                          : "bg-neutral-950 text-white self-end"
                          }`}>
                          {msg.text}
                        </div>
                      ))}
                      {isAiTyping && (
                        <div className="bg-neutral-100 border border-neutral-200/30 text-neutral-400 p-2 rounded-xl self-start text-[10px] font-mono animate-pulse">
                          El bot está redactando respuesta...
                        </div>
                      )}
                    </div>

                    {/* Preset customer messages */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Preguntas de clientes:</span>
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => triggerAiResponse(
                            "¿Tienen opciones sin gluten?",
                            "¡Por supuesto! Nuestras hamburguesas se pueden solicitar al plato o con pan sin gluten libre de trazas. ¿Deseas agregar alguna de nuestras variedades?"
                          )}
                          disabled={isAiTyping}
                          className="bg-white hover:bg-neutral-50 text-neutral-800 text-[10px] font-bold py-1 px-2.5 rounded-lg border border-neutral-200 cursor-pointer shadow-sm disabled:opacity-40"
                        >
                          ¿Celíacos/Gluten-free?
                        </button>
                        <button
                          onClick={() => triggerAiResponse(
                            "¿Tienen entrega hoy a Providencia?",
                            "¡Hola! Sí, despachamos directo a Providencia con una tarifa única fija de $2.500 CLP. ¿Quieres armar tu canasta de delivery?"
                          )}
                          disabled={isAiTyping}
                          className="bg-white hover:bg-neutral-50 text-neutral-800 text-[10px] font-bold py-1 px-2.5 rounded-lg border border-neutral-200 cursor-pointer shadow-sm disabled:opacity-40"
                        >
                          ¿Despacho Providencia?
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Savings Calculator */}
      <section id="calculadora" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Top visual accent bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-neutral-950"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left Column: Sliders */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-900 border border-neutral-200 px-2.5 py-1 rounded-full text-xs font-bold font-mono">
                  <Calculator className="w-4 h-4 text-neutral-950" />
                  <span>Calculadora de Retorno</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-950 tracking-tight">
                  Calcula tu ahorro real
                </h3>
                <p className="text-neutral-500 text-sm font-sans leading-relaxed">
                  Las comisiones ocultas desinflan tus márgenes. Compara lo que estás pagando en comisiones abusivas frente a la tarifa plana sin sorpresas de FoodHub.
                </p>
              </div>

              {/* Slider 1: Orders per month */}
              <div className="space-y-2 p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-neutral-700">Pedidos Mensuales Estimados</span>
                  <span className="text-neutral-950 font-mono text-lg">{ordersCount} pedidos / mes</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={ordersCount}
                  onChange={(e) => setOrdersCount(parseInt(e.target.value))}
                  className="w-full accent-neutral-950 bg-neutral-200 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                  <span>50 pedidos</span>
                  <span>1.500 pedidos</span>
                  <span>3.000 pedidos</span>
                </div>
              </div>

              {/* Slider 2: Average Ticket */}
              <div className="space-y-2 p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-neutral-700">Valor de Ticket Promedio</span>
                  <span className="text-neutral-950 font-mono text-lg">${avgTicket.toLocaleString("es-CL")} CLP</span>
                </div>
                <input
                  type="range"
                  min="4000"
                  max="40000"
                  step="1000"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(parseInt(e.target.value))}
                  className="w-full accent-neutral-950 bg-neutral-200 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                  <span>$4.000 CLP</span>
                  <span>$22.000 CLP</span>
                  <span>$40.000 CLP</span>
                </div>
              </div>
            </div>

            {/* Right Column: Thermal Receipt Simulation */}
            <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm relative">
              <div className="space-y-4 font-mono text-xs">
                <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex justify-between border-b border-neutral-200 pb-3">
                  <span>Volumen Gastronómico Bruto</span>
                  <span className="font-bold text-neutral-800">${totalVolume.toLocaleString("es-CL")} CLP</span>
                </div>

                <div className="space-y-1.5 border-b border-neutral-200 pb-3">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Comisión Apps de Delivery (27%)</span>
                  <p className="text-sm font-bold text-neutral-800">-${deliveryCommissions.toLocaleString("es-CL")} CLP / mes</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Tarifa Plana FoodHub SaaS</span>
                  <p className="text-sm font-bold text-neutral-900">${foodhubFixedSubscription.toLocaleString("es-CL")} CLP / mes</p>
                </div>
              </div>

              {/* Main Net Saving Callout */}
              <div className="bg-neutral-950 text-white rounded-xl p-5 text-center space-y-1">
                <span className="text-[9px] font-mono tracking-widest block text-neutral-400 uppercase">Ahorro Neto Estimado</span>
                <h3 className="text-2xl sm:text-3xl font-black font-mono">
                  ${estimatedSavings > 0 ? estimatedSavings.toLocaleString("es-CL") : 0} CLP
                </h3>
                <span className="text-[9px] block opacity-80 font-mono tracking-wide">✓ Dinero libre para crecer tu negocio</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix Section */}
      <section id="solucion-integrada" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono">TABLA COMPARATIVA</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-neutral-950 tracking-tight">Compara FoodHub con el resto</h2>
          <p className="text-neutral-500 text-sm">
            Control total de tu restaurante, con herramientas hechas para potenciar tu marca independiente.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Funciones</th>
                  <th className="py-4 px-6 bg-neutral-100/60 text-neutral-950 border-x border-neutral-200 font-display">FoodHub Platform</th>
                  <th className="py-4 px-6">Apps de Delivery Clásicas</th>
                  <th className="py-4 px-6">Sistemas POS Tradicionales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-xs text-neutral-700 font-sans">
                <tr className="hover:bg-neutral-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-neutral-900">Comisión por venta</td>
                  <td className="py-4 px-6 bg-neutral-100/30 text-neutral-950 font-bold border-x border-neutral-200">0% Comisión (Suscripción fija)</td>
                  <td className="py-4 px-6 text-neutral-600 font-semibold">25% al 30% por cada orden</td>
                  <td className="py-4 px-6">Costos variables + mantención</td>
                </tr>
                <tr className="hover:bg-neutral-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-neutral-900">Base de datos de clientes</td>
                  <td className="py-4 px-6 bg-neutral-100/30 text-neutral-950 font-bold border-x border-neutral-200">Propia y 100% exportable</td>
                  <td className="py-4 px-6 text-neutral-500">Restringida por la app</td>
                  <td className="py-4 px-6">Aislada (no sincronizada)</td>
                </tr>
                <tr className="hover:bg-neutral-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-neutral-900">Conserjería de IA (Gemini)</td>
                  <td className="py-4 px-6 bg-neutral-100/30 text-neutral-950 font-bold border-x border-neutral-200">✓ Integrado de fábrica para alérgenos y menús</td>
                  <td className="py-4 px-6 text-neutral-400">✗ No disponible</td>
                  <td className="py-4 px-6 text-neutral-400">✗ No disponible</td>
                </tr>
                <tr className="hover:bg-neutral-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-neutral-900">Apertura/Cierre de turnos de caja</td>
                  <td className="py-4 px-6 bg-neutral-100/30 text-neutral-950 font-bold border-x border-neutral-200">✓ Arqueos y reportes automáticos</td>
                  <td className="py-4 px-6 text-neutral-400">✗ No disponible</td>
                  <td className="py-4 px-6">✓ Disponible con hardware caro</td>
                </tr>
                <tr className="hover:bg-neutral-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-neutral-900">Soporte en línea y cambios en tiempo real</td>
                  <td className="py-4 px-6 bg-neutral-100/30 text-neutral-950 font-bold border-x border-neutral-200">✓ Sincronización instantánea</td>
                  <td className="py-4 px-6 text-neutral-500">Aprobación lenta de cartas</td>
                  <td className="py-4 px-6">Requiere visita de técnico</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Elegant Accordion FAQ Section */}
      <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-neutral-950 tracking-tight">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full text-left p-5 font-bold text-neutral-800 flex justify-between items-center cursor-pointer hover:bg-neutral-50/50 transition-colors text-sm sm:text-base font-serif"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4.5 h-4.5 text-neutral-950 transition-transform duration-200 ${openFaqIndex === idx ? "rotate-180" : ""
                  }`} />
              </button>

              <AnimatePresence initial={false}>
                {openFaqIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-500 border-t border-neutral-100 leading-relaxed bg-neutral-50/10">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-neutral-950 text-white rounded-[32px] p-8 sm:p-14 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 left-0 w-48 h-48 bg-white/2 rounded-full blur-2xl pointer-events-none"></div>

          <div className="max-w-2xl mx-auto space-y-4">
            <span className="font-mono text-neutral-400 font-bold text-xs tracking-widest block uppercase">Únete hoy</span>
            <h3 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight leading-none">
              Comienza a operar sin intermediarios
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-sans">
              Regístrate en nuestra lista de espera exclusiva. Disfruta de la libertad gastronómica cobrando de forma directa, sin comisiones sorpresa por orden.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#waitlist-form-card"
              className="bg-white hover:bg-neutral-100 text-neutral-950 font-display font-bold px-8 py-4 rounded-xl text-xs sm:text-sm transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <span>Unirse a Lista de Espera</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
