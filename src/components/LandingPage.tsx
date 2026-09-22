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
import videoHeroUrl from "../public/video-hero.mp4";
import { TestimonialsSection } from "./TestimonialsSection";
import { MainFeaturesSection } from "./MainFeaturesSection";
import { DeviceSlider } from "./DeviceSlider";

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
          <a href="https://app.foodhub.work" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-white/70 hover:text-white transition-colors">Reservar cupo →</a>
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
            <span className="font-bold text-[17px] tracking-[-0.03em] text-[#1d1d1f]">FoodHub</span>
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
              href="https://app.foodhub.work" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-[#1d1d1f] text-white hover:bg-[#3a3a3c]"
            >
              Unirse
            </a>
          </div>
        </div>
      </header>

      {/* Hero: Device Showcase Slider */}
      <DeviceSlider />

      {/* Main Content Info Section (Refined, center-aligned) */}
      <section id="unete" className="relative overflow-hidden py-20 sm:py-24 bg-[#fcfcfd]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="text-center space-y-10"
          >
            <div className="space-y-4">
              <h2 className="text-[36px] sm:text-[46px] font-bold tracking-tight text-[#1d1d1f] leading-[1.05]">
                La plataforma de venta sin comisiones que tu negocio merece.
              </h2>
              <p className="text-[#6e6e73] text-[17px] sm:text-[19px] max-w-2xl mx-auto leading-relaxed tracking-tight">
                Diseñado para el rubro gastronómico. FoodHub integra un <strong className="text-[#1d1d1f] font-semibold">Hub de atención ultrarrápido</strong>, tu propio <strong className="text-[#1d1d1f] font-semibold">e-commerce web</strong> sin comisiones, y un <strong className="text-[#1d1d1f] font-semibold">Asistente IA</strong> que atiende comensales por ti.
              </p>
            </div>

            {/* Feature Grid Centered */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-3xl mx-auto text-left">
              {[
                { title: "Punto de venta Multicanal", desc: "Cierres de turnos y arqueos instantáneos con máxima fluidez." },
                { title: "E-Commerce 0% Comisión", desc: "Recibe pedidos directo a tu cuenta sin cargos ocultos." },
                { title: "Chat de IA Integrado", desc: "Vendedor virtual disponible 24/7 respondiendo al instante." },
                { title: "Configuración en Minutos", desc: "Carga de menú por lotes e integración rápida para vender hoy." },
              ].map((f) => (
                <div key={f.title} className="bg-white border border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[20px] p-6 flex flex-col gap-3 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow">
                  <div className="w-8 h-8 rounded-[10px] bg-[#1d1d1f] flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[15px] text-[#1d1d1f] tracking-tight mb-1">{f.title}</h4>
                    <p className="text-[14px] text-[#6e6e73] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex -space-x-2.5" aria-label="Clientes destacados" role="img">
                {["#1d1d1f", "#3a3a3c", "#6e6e73"].map((bg, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[12px] font-bold text-white shadow-sm" style={{ background: bg }}>
                    {["M", "A", "S"][i]}
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#1d1d1f] text-[#1d1d1f]" />)}
                </div>
                <p className="text-[13px] font-medium text-[#6e6e73]">Más de 100 negocios ya confían en nosotros.</p>
              </div>
            </div>
          </motion.div>
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
                href="https://app.foodhub.work" target="_blank" rel="noopener noreferrer"
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
              className="bg-[#1d1d1f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.2)] transition-all relative flex flex-col group scale-100 lg:scale-105 z-10"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-4 py-1 rounded-full font-mono tracking-wider flex items-center gap-1.5 shadow-lg">
                <Crown className="w-3.5 h-3.5" />
                <span>Más Popular</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white/10 text-white p-2 rounded-xl group-hover:bg-white/20 transition-colors">
                    <Crown className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Plan Premium</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      {annualBilling ? "$21.165" : "$24.900"}
                    </span>
                    <span className="text-white/50 text-sm font-medium">/mes <span className="text-[10px]">+ IVA</span></span>
                  </div>
                  {annualBilling && (
                    <p className="text-[10px] text-emerald-400 font-bold font-mono">$253.980 año — 2 meses gratis</p>
                  )}
                  <p className="text-xs text-white/60">Todo lo del Plan Base, más integración WhatsApp.</p>
                </div>
              </div>

              <ul className="space-y-3 my-6 flex-1">
                <li className="flex items-start gap-3 text-xs text-white/80 pb-2 border-b border-white/10">
                  <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
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
                    <li key={i} className="flex items-start gap-3 text-xs text-white/80">
                      <Icon className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                      <span>{feature.text}</span>
                    </li>
                  );
                })}
              </ul>

              <a
                href="https://app.foodhub.work" target="_blank" rel="noopener noreferrer"
                onClick={() => setSelectedPlan("premium")}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer bg-white text-[#1d1d1f] hover:bg-white/90 w-full mt-2"
              >
                <span>Elegir Premium</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <p className="text-[10px] text-white/40 text-center pt-3">14 días gratis. Sin tarjeta. Cancela cuando quieras.</p>
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
                href="https://app.foodhub.work" target="_blank" rel="noopener noreferrer"
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

      {/* Final CTA (Comienza Ahora) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-[#1d1d1f] text-white rounded-[32px] p-8 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 left-0 w-48 h-48 bg-white/2 rounded-full blur-2xl pointer-events-none"></div>

          <div className="bg-white/10 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/10 backdrop-blur-sm">
            <Rocket className="w-8 h-8" />
          </div>
          
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-[32px] sm:text-[44px] font-bold tracking-tight leading-[1.1]">
              Comienza ahora y toma el control
            </h3>
            <p className="text-white/70 text-[16px] sm:text-[18px] leading-relaxed max-w-lg mx-auto">
              Crea tu cuenta, accede a todo el ecosistema FoodHub en minutos y dile adiós a las comisiones para siempre.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://app.foodhub.work"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[16px] font-semibold tracking-tight transition-all duration-200 cursor-pointer bg-white text-[#1d1d1f] hover:bg-white/90 hover:scale-105 shadow-lg w-full sm:w-auto"
            >
              <span>Regístrate aquí</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Elegant Accordion FAQ Section */}
      <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[11px] font-bold text-[#aeaeb2] uppercase tracking-widest font-mono">FAQ</span>
          <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[#1d1d1f]">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-black/[0.05] rounded-2xl overflow-hidden transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <button
                id={`faq-btn-${idx}`}
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                aria-expanded={openFaqIndex === idx}
                aria-controls={`faq-panel-${idx}`}
                className="w-full text-left p-5 font-semibold text-[#1d1d1f] flex justify-between items-center cursor-pointer hover:bg-[#fcfcfd] transition-colors text-[15px] sm:text-[16px] tracking-tight"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4.5 h-4.5 text-[#1d1d1f] transition-transform duration-200 ${openFaqIndex === idx ? "rotate-180" : ""
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
                    <div id={`faq-panel-${idx}`} role="region" aria-labelledby={`faq-btn-${idx}`} className="px-5 pb-5 pt-1 text-[14px] text-[#6e6e73] leading-relaxed border-t border-black/[0.03] bg-white">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
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
            <span className="font-bold text-[17px] tracking-[-0.03em] text-[#1d1d1f]">Foodhub</span>
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
