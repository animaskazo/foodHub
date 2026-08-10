import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Rocket,
  Terminal,
  ShoppingBag,
  Sparkles,
  Crown,
  MessageCircle,
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
  Award,
  Store,
  Bot,
  BellRing,
  Send,
  MessageSquare,
  Headset,
  CheckCheck,
  LayoutGrid,
  ClipboardList,
  Receipt,
  UserCircle,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import videoUrl from "../public/video-foodhub.mp4";
// @ts-ignore
import videoHeroUrl from "../public/video-hero.mp4";
import { TestimonialsSection } from "./TestimonialsSection";
import { MainFeaturesSection } from "./MainFeaturesSection";

export const LandingPage: React.FC = () => {
  const { addWaitlistProspect, waitlist, changeUserRole } = useApp();


  // Form states
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurantType, setRestaurantType] = useState("Hamburguesería");
  const [monthlyOrders, setMonthlyOrders] = useState("500 - 1000");

  const [selectedPlan, setSelectedPlan] = useState<string>("base");
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

  // Billing toggle
  const [annualBilling, setAnnualBilling] = useState(false);

  // Back to top visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll listener for back-to-top
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          monthlyOrders,
          selectedPlan
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
      monthlyOrders,
      selectedPlan: selectedPlan as "base" | "premium"
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    setAssignedQueue(164 + waitlist.length);
  };

  // Savings Math
  const totalVolume = ordersCount * avgTicket;
  const commissionPercentage = 0.27;
  const deliveryCommissions = Math.round(totalVolume * commissionPercentage);
  const foodhubFixedSubscription = 24900; // 59.900 CLP flat monthly SaaS fee
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
      a: "Nuestro asistente utiliza Inteligencia Artificial para leer de forma automática tu catálogo cargado en FoodHub (ingredientes, precios, disponibilidad) y responder a tus clientes preguntas sobre alérgenos, sugerir acompañamientos o ayudarles a armar su pedido ideal directamente desde WhatsApp o web."
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
    <div id="foodhub-artisanal-landing" className="bg-[#f5f5f7] text-[#1d1d1f] min-h-screen selection:bg-[#1d1d1f] selection:text-white font-sans pb-24 antialiased">

      {/* Top Banner */}
      <div className="bg-[#1d1d1f] text-white text-center py-2.5 px-4">
        <span className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[-0.01em]">
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">Últimos cupos</span>
          Asegura tu tarifa plana de por vida antes del lanzamiento oficial.
          <a href="#waitlist-form-card" className="underline underline-offset-2 text-white/70 hover:text-white transition-colors">Reservar cupo →</a>
        </span>
      </div>

      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="fixed -top-20 left-4 z-[100] bg-[#1d1d1f] text-white px-4 py-2 rounded-b-xl text-xs font-semibold transition-all focus:top-0"
      >
        Ir al contenido principal
      </a>

      {/* Header Navigation */}
      <header className="bg-[rgba(245,245,247,0.85)] backdrop-blur-xl border-b border-black/[0.06] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#1d1d1f] text-white p-1.5 rounded-lg" aria-hidden="true">
              <Utensils className="w-4 h-4" />
            </div>
            <span className="font-bold text-[17px] tracking-[-0.03em] text-[#1d1d1f]">foodhub</span>
            <span className="text-[#6e6e73] text-[11px] font-medium tracking-[-0.01em]">SaaS</span>
          </div>

          <nav aria-label="Navegación principal">
            <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] font-medium text-[#6e6e73]">
              <a href="#solucion-integrada" className="hover:text-[#1d1d1f] transition-colors duration-200">Características</a>
              <a href="#funciones-clave" className="hover:text-[#1d1d1f] transition-colors duration-200">Funciones</a>
              <a href="#planes" className="hover:text-[#1d1d1f] transition-colors duration-200">Planes</a>
              <a href="#calculadora" className="hover:text-[#1d1d1f] transition-colors duration-200">Calculadora</a>
              <a href="#faq" className="hover:text-[#1d1d1f] transition-colors duration-200">FAQ</a>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#waitlist-form-card"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-[#1d1d1f] text-white hover:bg-[#3a3a3c]"
            >
              Unirse
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="main-content" className="relative min-h-[100vh] bg-[#111111] overflow-hidden flex flex-col-reverse lg:flex-row items-stretch -mt-[52px]">
        
        {/* Left: Video */}
        <div className="w-full lg:w-1/2 h-[60vh] lg:min-h-[100vh] relative flex-shrink-0">
          <video
            src={videoHeroUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Gradient to blend video with background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/20 to-transparent pointer-events-none z-10 lg:hidden"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#111111]/20 to-[#111111] pointer-events-none z-10 hidden lg:block"></div>
        </div>

        {/* Right: Text Content */}
        <div className="w-full lg:w-1/2 flex items-center lg:pl-12 xl:pl-20 2xl:pl-24">
          <div className="w-full max-w-2xl px-6 sm:px-12 lg:px-0 py-20 lg:py-32 z-10 text-center lg:text-left mx-auto lg:mx-0">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white/50 text-[13px] font-semibold tracking-[0.05em] uppercase mb-4 sm:mb-5"
            >
              Plataforma SaaS Gastronómica
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-[44px] sm:text-[56px] lg:text-[72px] font-bold tracking-tight text-white leading-[1.05]"
            >
              Deja de pagar comisiones abusivas.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-6 text-[17px] sm:text-[20px] text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Recupera hasta un 30% de tus ganancias con nuestro ecosistema de ventas y gestión de tarifa plana. Tu esfuerzo, tus ganancias.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <a href="#unete" className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] sm:text-[16px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-white text-[#1d1d1f] hover:bg-white/90">
                Comenzar ahora <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#funciones-clave" className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] sm:text-[16px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-white/10 text-white hover:bg-white/20 border border-white/10">
                Ver funciones
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Info Section */}
      <section id="unete" className="relative overflow-hidden pt-20 pb-16 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left: Headline & Key Advantages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-7 space-y-8 text-left"
            >
              <h2 className="text-[38px] sm:text-[46px] font-bold tracking-[-0.04em] text-[#1d1d1f] leading-[1.04]">
                La plataforma de venta sin comisiones que tu negocio merece.
              </h2>

              <p className="text-[#6e6e73] text-[17px] max-w-xl leading-[1.6] tracking-[-0.01em]">
                Diseñado para el rubro gastronómico. FoodHub integra un <strong className="text-[#1d1d1f] font-semibold">Hub de atención ultrarrápido</strong>, tu propio <strong className="text-[#1d1d1f] font-semibold">e-commerce web</strong> sin comisiones, y un <strong className="text-[#1d1d1f] font-semibold">Asistente IA</strong> que atiende comensales por ti.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  { title: "Punto de venta Multicanal", desc: "Cierres de turnos y arqueos instantáneos con máxima fluidez." },
                  { title: "E-Commerce 0% Comisión", desc: "Recibe pedidos directo a tu cuenta sin cargos ocultos." },
                  { title: "Chat de IA Integrado", desc: "Vendedor virtual disponible 24/7 respondiendo al instante." },
                  { title: "Configuración en Minutos", desc: "Carga de menú por lotes e integración rápida para vender hoy." },
                ].map((f) => (
                  <div key={f.title} className="apple-card p-5 flex flex-col gap-3">
                    <div className="w-7 h-7 rounded-[8px] bg-[#1d1d1f] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[14px] text-[#1d1d1f] tracking-[-0.02em] mb-0.5">{f.title}</h4>
                      <p className="text-[13px] text-[#6e6e73] leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="pt-5 flex items-center gap-5 border-t border-black/[0.07]">
                <div className="flex -space-x-2.5" aria-label="Clientes destacados" role="img">
                  {["#1d1d1f", "#3a3a3c", "#6e6e73"].map((bg, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#f5f5f7] flex items-center justify-center text-[10px] font-bold text-white" style={{ background: bg }}>
                      {["M", "A", "S"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#1d1d1f] text-[#1d1d1f]" />)}
                  </div>
                  <p className="text-[12px] text-[#6e6e73] mt-0.5">Más de 100 negocios ya confían en nosotros.</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Sign-up Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.15 }}
              id="waitlist-form-card"
              className="lg:col-span-5 relative"
            >
              <div className="bg-white border border-black/[0.07] p-6 sm:p-8 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.06),0_16px_48px_rgba(0,0,0,0.08)] relative overflow-hidden">

                {!isSuccess ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5 pb-1">
                      <h3 className="text-[22px] font-bold tracking-[-0.03em] text-[#1d1d1f] flex items-center gap-2">
                        <Rocket className="text-red-500 w-5 h-5" />
                        Cupos de Fundador Limitados
                      </h3>
                      <p className="text-[13px] text-[#6e6e73] leading-relaxed">
                        Solo los primeros 50 restaurantes asegurarán nuestra tarifa plana de por vida. Bloquea tu precio hoy y dile adiós a las comisiones para siempre.
                      </p>
                    </div>

                    {/* Local Business Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-[#6e6e73] tracking-[-0.01em] ml-0.5">Nombre de tu Restaurante</label>
                      <div className="relative">
                        <Building aria-hidden="true" className="absolute left-3.5 top-3.5 w-4 h-4 text-[#aeaeb2]" />
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Ej. Burguesería San Telmo"
                          className="apple-input w-full py-3 pl-10 pr-4 text-[14px] placeholder-[#aeaeb2]"
                        />
                      </div>
                    </div>

                    {/* Contact Owner */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-[#6e6e73] tracking-[-0.01em] ml-0.5">Nombre del Propietario</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-[#aeaeb2]" />
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Ej. Sofía Mendoza"
                          className="apple-input w-full py-3 pl-10 pr-4 text-[14px] placeholder-[#aeaeb2]"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-[#6e6e73] tracking-[-0.01em] ml-0.5">E-mail</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3 w-3.5 h-3.5 text-[#aeaeb2]" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sofia@negocio.com"
                            className="apple-input w-full py-2.5 pl-10 pr-3 text-[13px] placeholder-[#aeaeb2]"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-[#6e6e73] tracking-[-0.01em] ml-0.5">Teléfono</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3 w-3.5 h-3.5 text-[#aeaeb2]" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+56 9 8765 4321"
                            className="apple-input w-full py-2.5 pl-10 pr-3 text-[13px] placeholder-[#aeaeb2]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Rubro & Volumen */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-[#6e6e73] tracking-[-0.01em] ml-0.5">Rubro</label>
                        <div className="relative">
                          <Utensils className="absolute left-3.5 top-3 w-3.5 h-3.5 text-[#aeaeb2]" />
                          <select
                            value={restaurantType}
                            onChange={(e) => setRestaurantType(e.target.value)}
                            className="apple-input w-full py-2.5 pl-10 pr-3 text-[13px] text-[#1d1d1f] cursor-pointer appearance-none"
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
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-[#6e6e73] tracking-[-0.01em] ml-0.5">Pedidos / mes</label>
                        <div className="relative">
                          <TrendingUp className="absolute left-3.5 top-3 w-3.5 h-3.5 text-[#aeaeb2]" />
                          <select
                            value={monthlyOrders}
                            onChange={(e) => setMonthlyOrders(e.target.value)}
                            className="apple-input w-full py-2.5 pl-10 pr-3 text-[13px] text-[#1d1d1f] cursor-pointer appearance-none"
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

                    {/* Plan Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-[#6e6e73] tracking-[-0.01em] ml-0.5">Plan de Interés</label>
                      <div className="relative">
                        <Award className="absolute left-3.5 top-3 w-3.5 h-3.5 text-[#aeaeb2]" />
                        <select
                          value={selectedPlan}
                          onChange={(e) => setSelectedPlan(e.target.value)}
                          className="apple-input w-full py-2.5 pl-10 pr-3 text-[13px] text-[#1d1d1f] cursor-pointer appearance-none"
                        >
                          <option value="base">Plan Base ($14.900/mes + IVA)</option>
                          <option value="premium">Plan Premium ($24.900/mes + IVA)</option>
                          <option value="pro">Restorant Pro ($49.900/mes + IVA)</option>
                        </select>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-[#1d1d1f] text-white hover:bg-[#3a3a3c] w-full disabled:opacity-50 mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <span>Asegurar mi cupo sin comisiones</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[12px] text-center text-[#aeaeb2] pt-1.5">
                      Sin compromisos. Tarifa plana de lanzamiento garantizada.
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
                          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.08] hover:bg-[#e5e5ea]"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Ver Admin</span>
                        </button>
                        <button
                          onClick={() => changeUserRole("cajero")}
                          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.08] hover:bg-[#e5e5ea]"
                        >
                          <Terminal className="w-3.5 h-3.5 text-neutral-950" />
                          <span>Probar POS</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="bg-[#1d1d1f] text-white py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="eyebrow text-white/40">Demostración</p>
            <h2 className="text-[36px] sm:text-[46px] font-bold tracking-[-0.04em] text-white leading-[1.04]">
              Control total en una sola pantalla
            </h2>
            <p className="text-[17px] text-white/50 leading-relaxed tracking-[-0.01em] font-normal">
              Órdenes del e-commerce, flujo del cajero y comandas directas a cocina sincronizados en tiempo real.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-[20px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] bg-[#2c2c2e] relative">
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover aspect-video"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1f]/40 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Trust Row */}
      <section className="bg-white border-y border-black/[0.06] py-7">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center eyebrow text-[#aeaeb2] mb-5">
            Infraestructura compatible
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
            {["Supabase", "Inteligencia Artificial", "Datos Encriptados", "Resend", "Klap", "Kapso"].map(t => (
              <span key={t} className="text-[13px] font-semibold tracking-[-0.01em] text-[#aeaeb2]">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Main 3 Features Section (Replacing Interactive Simulator) */}
      <MainFeaturesSection />

      {/* Interactive Savings Calculator */}
      <section id="calculadora" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="apple-card p-8 sm:p-12">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* Left Column: Header + Sliders */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-3">
                <p className="eyebrow text-[#6e6e73]">Calculadora de Retorno</p>
                <h3 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#1d1d1f] leading-[1.04]">
                  Calcula tu ahorro real
                </h3>
                <p className="text-[#6e6e73] text-[15px] leading-relaxed tracking-[-0.01em]">
                  Las comisiones ocultas desinflan tus márgenes. Compara lo que pagas en apps de delivery frente a la tarifa plana de FoodHub.
                </p>
              </div>

              {/* Slider 1: Orders per month */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline gap-3">
                  <span className="text-[13px] font-semibold text-[#1d1d1f] tracking-[-0.01em] shrink-0">Pedidos mensuales</span>
                  <span className="text-[17px] font-bold text-[#1d1d1f] tracking-[-0.02em] font-mono tabular-nums text-right">{ordersCount.toLocaleString("es-CL")} <span className="text-[13px] font-medium text-[#6e6e73]">pedidos</span></span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={ordersCount}
                  onChange={(e) => setOrdersCount(parseInt(e.target.value))}
                  className="w-full h-[3px] rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #1d1d1f ${((ordersCount - 50) / (3000 - 50)) * 100}%, rgba(0,0,0,0.1) ${((ordersCount - 50) / (3000 - 50)) * 100}%)` }}
                />
                <div className="flex justify-between text-[12px] text-[#aeaeb2] font-medium">
                  <span>50</span>
                  <span>3.000 pedidos / mes</span>
                </div>
              </div>

              {/* Slider 2: Average Ticket */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline gap-3">
                  <span className="text-[13px] font-semibold text-[#1d1d1f] tracking-[-0.01em] shrink-0">Ticket promedio</span>
                  <span className="text-[17px] font-bold text-[#1d1d1f] tracking-[-0.02em] font-mono tabular-nums text-right">${avgTicket.toLocaleString("es-CL")} <span className="text-[13px] font-medium text-[#6e6e73]">CLP</span></span>
                </div>
                <input
                  type="range"
                  min="4000"
                  max="40000"
                  step="1000"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(parseInt(e.target.value))}
                  className="w-full h-[3px] rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #1d1d1f ${((avgTicket - 4000) / (40000 - 4000)) * 100}%, rgba(0,0,0,0.1) ${((avgTicket - 4000) / (40000 - 4000)) * 100}%)` }}
                />
                <div className="flex justify-between text-[12px] text-[#aeaeb2] font-medium">
                  <span>$4.000</span>
                  <span>$40.000 CLP</span>
                </div>
              </div>
            </div>

            {/* Right Column: Results Panel */}
            <div className="lg:col-span-5 flex flex-col gap-3">

              {/* Metrics rows */}
              <div className="bg-[#f5f5f7] rounded-[18px] p-6 space-y-4">
                <div className="flex justify-between items-center gap-2 pb-4 border-b border-black/[0.07]">
                  <span className="text-[13px] text-[#6e6e73] tracking-[-0.01em] shrink-0">Volumen bruto mensual</span>
                  <span className="text-[13px] font-bold text-[#1d1d1f] font-mono tabular-nums text-right">${totalVolume.toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between items-center gap-2 pb-4 border-b border-black/[0.07]">
                  <div className="shrink-0">
                    <span className="text-[13px] text-[#6e6e73] tracking-[-0.01em]">Apps de delivery</span>
                    <span className="ml-1.5 text-[11px] text-[#aeaeb2] font-mono">~27%</span>
                  </div>
                  <span className="text-[13px] font-bold text-rose-500 font-mono tabular-nums text-right">−${deliveryCommissions.toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[13px] text-[#6e6e73] tracking-[-0.01em] shrink-0">FoodHub tarifa plana</span>
                  <span className="text-[13px] font-bold text-[#1d1d1f] font-mono tabular-nums text-right">${foodhubFixedSubscription.toLocaleString("es-CL")}</span>
                </div>
              </div>

              {/* Savings callout */}
              <div className="bg-[#1d1d1f] rounded-[18px] px-6 py-7 text-center">
                <p className="eyebrow text-white/30 mb-4">Ahorro neto estimado / mes</p>
                <div className="flex items-baseline justify-center gap-1.5 flex-wrap">
                  <span className="text-[28px] font-bold text-white/50 font-mono">$</span>
                  <span className="text-[32px] sm:text-[40px] font-bold tracking-[-0.04em] text-white leading-none font-mono tabular-nums break-all">
                    {estimatedSavings > 0 ? estimatedSavings.toLocaleString("es-CL") : "0"}
                  </span>
                </div>
                <p className="text-[12px] text-white/30 mt-2 font-mono tracking-[0.04em] uppercase">CLP</p>
                <p className="text-[13px] text-white/40 mt-1 tracking-[-0.01em]">dinero directo a tu negocio</p>
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
                  <td className="py-4 px-6 font-semibold text-neutral-900">Asistente de Inteligencia Artificial</td>
                  <td className="py-4 px-6 bg-neutral-100/30 text-neutral-950 font-bold border-x border-neutral-200">✓ Integrado para alérgenos, menús y pedidos</td>
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

      {/* Pricing Plans Section */}
      <section id="planes" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono">PRECIOS</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-neutral-950 tracking-tight">
            Planes diseñados para tu negocio
          </h2>
          <p className="text-neutral-500 text-sm">
            Sin comisiones por venta. Todo el ecosistema FoodHub con una tarifa plana mensual.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs font-bold transition-colors ${!annualBilling ? "text-neutral-950" : "text-neutral-400"}`}>
              Mensual
            </span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              aria-label={annualBilling ? "Cambiar a facturación mensual" : "Cambiar a facturación anual"}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${annualBilling ? "bg-neutral-950" : "bg-neutral-300"}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${annualBilling ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
            <span className={`text-xs font-bold transition-colors ${annualBilling ? "text-neutral-950" : "text-neutral-400"}`}>
              Anual
            </span>
            {annualBilling && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2.5 py-1 rounded-full font-mono tracking-wider border border-emerald-200"
              >
                Ahorra 2 meses
              </motion.span>
            )}
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Ambient glow behind premium card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-72 bg-neutral-950/5 blur-[100px] rounded-full pointer-events-none hidden md:block"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {/* Base Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all relative flex flex-col group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-neutral-100 text-neutral-950 p-2 rounded-xl group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">Plan Base</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-mono">
                      {annualBilling ? "$12.650" : "$14.900"}
                    </span>
                    <span className="text-neutral-400 text-sm font-medium">/mes <span className="text-[10px]">+ IVA</span></span>
                  </div>
                  {annualBilling && (
                    <p className="text-[10px] text-emerald-600 font-bold font-mono">$151.800 año — 2 meses gratis</p>
                  )}
                  <p className="text-xs text-neutral-500">Tarifa plana sin comisiones por venta.</p>
                </div>
              </div>

              <ul className="space-y-3 my-6 flex-1">
                {[
                  { icon: Terminal, text: "POS terminal con arqueo de caja" },
                  { icon: ShoppingBag, text: "Tienda online con dominio propio" },
                  { icon: Sparkles, text: "Asistente de Inteligencia Artificial" },
                  { icon: Smartphone, text: "Menú digital sincronizado" },
                  { icon: Zap, text: "Comandas directas a cocina" },
                  { icon: HeartHandshake, text: "Soporte técnico prioritario" },
                  { icon: Check, text: "Actualizaciones gratuitas" }
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <li key={i} className="flex items-start gap-3 text-xs text-neutral-700">
                      <Icon className="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" />
                      <span>{feature.text}</span>
                    </li>
                  );
                })}
              </ul>

              <a
                href="#waitlist-form-card"
                onClick={() => setSelectedPlan("base")}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-[#1d1d1f] text-white hover:bg-[#3a3a3c] w-full mt-2"
              >
                <span>Comenzar gratis</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <p className="text-[10px] text-neutral-400 text-center pt-3">14 días gratis. Sin tarjeta.</p>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white border-2 border-neutral-950 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all relative flex flex-col group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-bold px-4 py-1 rounded-full font-mono tracking-wider flex items-center gap-1.5 shadow-lg">
                <Crown className="w-3.5 h-3.5" />
                <span>Más Popular</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-neutral-950 text-white p-2 rounded-xl group-hover:bg-neutral-800 transition-colors">
                    <Crown className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">Plan Premium</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-mono">
                      {annualBilling ? "$21.165" : "$24.900"}
                    </span>
                    <span className="text-neutral-400 text-sm font-medium">/mes <span className="text-[10px]">+ IVA</span></span>
                  </div>
                  {annualBilling && (
                    <p className="text-[10px] text-emerald-600 font-bold font-mono">$253.980 año — 2 meses gratis</p>
                  )}
                  <p className="text-xs text-neutral-500">Todo lo del Plan Base, más integración WhatsApp.</p>
                </div>
              </div>

              <ul className="space-y-3 my-6 flex-1">
                <li className="flex items-start gap-3 text-xs text-neutral-700 pb-2 border-b border-neutral-100">
                  <Check className="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" />
                  <span className="font-semibold">Todo lo del Plan Base</span>
                </li>
                {[
                  { icon: Bot, text: "Integración WhatsApp Business API" },
                  { icon: BellRing, text: "Notificaciones automáticas a clientes" },
                  { icon: Send, text: "Recepción de pedidos por WhatsApp" },
                  { icon: MessageSquare, text: "Ventas directas sin comisiones por chat" },
                  { icon: CheckCheck, text: "Validación de delivery por conversación" },
                  { icon: Headset, text: "Soporte técnico premium 24/7" }
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <li key={i} className="flex items-start gap-3 text-xs text-neutral-700">
                      <Icon className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                      <span>{feature.text}</span>
                    </li>
                  );
                })}
              </ul>

              <a
                href="#waitlist-form-card"
                onClick={() => setSelectedPlan("premium")}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-[#1d1d1f] text-white hover:bg-[#3a3a3c] w-full mt-2"
              >
                <span>Elegir Premium</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <p className="text-[10px] text-neutral-400 text-center pt-3">14 días gratis. Sin tarjeta. Cancela cuando quieras.</p>
            </motion.div>

            {/* Restorant Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all relative flex flex-col group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-neutral-100 text-neutral-950 p-2 rounded-xl group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                    <Store className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">Restorant Pro</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-mono">
                      {annualBilling ? "$42.415" : "$49.900"}
                    </span>
                    <span className="text-neutral-400 text-sm font-medium">/mes <span className="text-[10px]">+ IVA</span></span>
                  </div>
                  {annualBilling && (
                    <p className="text-[10px] text-emerald-600 font-bold font-mono">$499.000 año — 2 meses gratis</p>
                  )}
                  <p className="text-xs text-neutral-500">Todo Premium, más gestión integral de salón presencial.</p>
                </div>
              </div>

              <ul className="space-y-3 my-6 flex-1">
                <li className="flex items-start gap-3 text-xs text-neutral-700 pb-2 border-b border-neutral-100">
                  <Check className="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" />
                  <span className="font-semibold">Todo lo del Plan Premium</span>
                </li>
                {[
                  { icon: LayoutGrid, text: "Administración gráfica de mesas" },
                  { icon: ClipboardList, text: "Comandas especiales para salón" },
                  { icon: Receipt, text: "Control de cuentas divididas" },
                  { icon: UserCircle, text: "Múltiples perfiles de vendedores" },
                  { icon: Coins, text: "Control de propinas detallado" }
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <li key={i} className="flex items-start gap-3 text-xs text-neutral-700">
                      <Icon className="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" />
                      <span>{feature.text}</span>
                    </li>
                  );
                })}
              </ul>

              <a
                href="#waitlist-form-card"
                onClick={() => setSelectedPlan("pro")}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-[#1d1d1f] text-white hover:bg-[#3a3a3c] w-full mt-2"
              >
                <span>Elegir Pro</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <p className="text-[10px] text-neutral-400 text-center pt-3">14 días gratis. Cancela cuando quieras.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Hidden for now) */}
      {/* <TestimonialsSection /> */}

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
                id={`faq-btn-${idx}`}
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                aria-expanded={openFaqIndex === idx}
                aria-controls={`faq-panel-${idx}`}
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
                    <div id={`faq-panel-${idx}`} role="region" aria-labelledby={`faq-btn-${idx}`} className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-500 border-t border-neutral-100 leading-relaxed bg-neutral-50/10">
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
            <span className="font-mono text-neutral-400 font-bold text-xs tracking-widest block uppercase">Última Oportunidad</span>
            <h3 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight leading-none">
              Cada día que pasas en las apps, pierdes un 30% de tu dinero
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-sans">
              Toma el control hoy. Únete a los negocios que ya multiplicaron su rentabilidad. Asegura uno de los últimos cupos para la tarifa plana fundadora.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#waitlist-form-card"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-white text-[#1d1d1f] hover:bg-white/90"
            >
              <span>Reclamar mi Tarifa Plana</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
      {/* Back to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0.8 }}
        className="fixed bottom-6 right-6 z-50 bg-[#1d1d1f] text-white p-3 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:bg-[#3a3a3c] active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Volver arriba"
      >
        <ChevronDown className="w-5 h-5 rotate-180" />
      </motion.button>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] bg-[#f5f5f7] py-10 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-[#1d1d1f] text-white p-1.5 rounded-lg">
              <Utensils className="w-4 h-4" />
            </div>
            <span className="font-bold text-[17px] tracking-[-0.03em] text-[#1d1d1f]">foodhub</span>
            <span className="text-[12px] text-[#aeaeb2] ml-1.5">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <a
              href="mailto:hola@digital-solutions.work"
              className="flex items-center gap-2 text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors duration-200"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>hola@digital-solutions.work</span>
            </a>
            <a
              href="https://wa.me/56995355996"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] text-[#6e6e73] hover:text-[#25D366] transition-colors duration-200"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+56 9 9535 5996</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};
