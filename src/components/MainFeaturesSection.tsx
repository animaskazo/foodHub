import React, { useState } from "react";
import {
  Terminal,
  ShoppingBag,
  Sparkles,
  Navigation,
  Clock,
  CheckCircle2,
  Users,
  UtensilsCrossed,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  MapPin
} from "lucide-react";
import { motion } from "motion/react";

export const MainFeaturesSection: React.FC = () => {
  // Table floor plan interactive state for Feature 3
  const [tables, setTables] = useState([
    { id: 1, label: "Mesa 01", capacity: 4, status: "occupied", orderTotal: 28900, time: "25 min" },
    { id: 2, label: "Mesa 02", capacity: 2, status: "available", orderTotal: 0, time: "-" },
    { id: 3, label: "Mesa 03", capacity: 6, status: "paying", orderTotal: 45200, time: "42 min" },
    { id: 4, label: "Mesa 04", capacity: 4, status: "available", orderTotal: 0, time: "-" }
  ]);

  const toggleTableStatus = (id: number) => {
    setTables(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        if (t.status === "available") return { ...t, status: "occupied", orderTotal: 19900, time: "5 min" };
        if (t.status === "occupied") return { ...t, status: "paying", orderTotal: t.orderTotal, time: t.time };
        return { ...t, status: "available", orderTotal: 0, time: "-" };
      })
    );
  };

  return (
    <section id="funciones-clave" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
          <Zap className="w-3.5 h-3.5 text-neutral-950" />
          <span>Ecosistema de Alto Rendimiento</span>
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-950 tracking-tight leading-tight">
          Diseñado para maximizar la eficiencia y rentabilidad de tu negocio
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base font-sans max-w-2xl mx-auto">
          Potencia tus ventas directas, automatiza tus despachos y gestiona la atención presencial con herramientas modernas de nivel profesional.
        </p>
      </div>

      {/* Feature 1: 3 Canales de Venta (Hero Full-Width Card) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
      >
        {/* Subtle accent corner */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-neutral-950/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold font-mono text-neutral-400 uppercase tracking-widest">
              CANAL DE VENTAS 360°
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-950 tracking-tight leading-tight">
              3 Canales de venta para aumentar la conversión
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm font-sans leading-relaxed">
              Capta clientes en todos los puntos de contacto. Vende en caja presencial, en tu sitio web independiente sin comisiones y responde clientes 24/7 con IA.
            </p>

            <ul className="space-y-2.5 pt-2">
              <li className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-neutral-950 shrink-0" />
                <span>Punto de Venta (POS) ultrarrápido para atención presencial</span>
              </li>
              <li className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-neutral-950 shrink-0" />
                <span>Tienda e-Commerce propia 0% comisiones por orden</span>
              </li>
              <li className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-neutral-950 shrink-0" />
                <span>Asistente con Inteligencia Artificial para ventas en WhatsApp</span>
              </li>
            </ul>
          </div>

          {/* Right Minimal Illustration (3 Sales Nodes) */}
          <div className="lg:col-span-7 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">

              {/* Node 1: POS */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white border border-neutral-200 p-4 rounded-2xl shadow-sm text-center space-y-3 relative group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-neutral-950 text-white flex items-center justify-center shadow-sm">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-neutral-950">1. POS Presencial</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Caja & Comandas</p>
                </div>
                <span className="inline-block bg-neutral-100 text-neutral-800 text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border border-neutral-200">
                  En Vivo
                </span>
              </motion.div>

              {/* Node 2: Store */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white border border-neutral-950 p-4 rounded-2xl shadow-md text-center space-y-3 relative group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-neutral-950 text-white flex items-center justify-center shadow-sm">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-neutral-950">2. Tienda Web</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">e-Commerce Directo</p>
                </div>
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border border-emerald-200">
                  0% Comisión
                </span>
              </motion.div>

              {/* Node 3: AI Assistant */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white border border-neutral-200 p-4 rounded-2xl shadow-sm text-center space-y-3 relative group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-neutral-950 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-neutral-950">3. Chatbot IA</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Inteligencia Artificial 24/7</p>
                </div>
                <span className="inline-block bg-neutral-100 text-neutral-800 text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border border-neutral-200">
                  Auto-Venta
                </span>
              </motion.div>

            </div>

            {/* Conversion Summary Banner */}
            <div className="mt-6 pt-5 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-neutral-700 font-medium">Sincronización centralizada en un único panel</span>
              </div>
              <span className="font-mono text-neutral-950 font-bold bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
                +40% Ventas Directas
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid of 2 Cards: Features 2 & 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Feature 2: Uber Direct Integration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="space-y-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center shadow-sm">
              <Navigation className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-widest">
                LOGÍSTICA SIN COMPLICACIONES
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-neutral-950 tracking-tight">
                Integración directa con Uber Direct
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm font-sans leading-relaxed">
                Si no tienes delivery, nos integramos con Uber Direct para enviar tus pedidos de forma rápida y segura. Asignación automática de repartidores sin cobros fijos de flota.
              </p>
            </div>
          </div>

          {/* Minimal Uber Direct Route Illustration */}
          <div className="bg-neutral-950 text-white rounded-2xl p-5 space-y-4 border border-neutral-800 shadow-inner">
            <div className="flex justify-between items-center text-xs border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-mono text-neutral-300 font-bold uppercase tracking-wider text-[10px]">Uber Direct Dispatch</span>
              </div>
              <span className="font-mono text-neutral-400 text-[10px]">Pedido #4092</span>
            </div>

            {/* Minimal Map & Timeline */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="w-0.5 h-6 bg-neutral-700 my-1"></div>
                  <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                </div>
                <div className="space-y-3 flex-1 text-[11px]">
                  <div>
                    <span className="text-neutral-400 block text-[9px]">ORIGEN (Tu Cocina)</span>
                    <span className="font-bold text-white">Av. Italia 1420, Providencia</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[9px]">DESTINO DE CLIENTE</span>
                    <span className="font-bold text-neutral-200">Pedro de Valdivia 850</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dispatch Status Pill */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 flex justify-between items-center text-[11px] font-mono">
              <span className="text-neutral-400">Estado:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Repartidor en camino (12 min)
              </span>
            </div>
          </div>
        </motion.div>

        {/* Feature 3: Table Management for Sit-down Restaurants */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="space-y-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-widest">
                GESTIÓN DE SALÓN & COMANDAS
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-neutral-950 tracking-tight">
                Organización simple de mesas y atención organizada
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm font-sans leading-relaxed">
                Si tienes un restorant, puedes organizar de manera simple tus mesas y atender de forma organizada a tus clientes. Asignación rápida de comensales, control de tiempos de espera y cierres de cuenta sin enredos.
              </p>
            </div>
          </div>

          {/* Minimal Interactive Floor Plan Illustration */}
          <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                PLANO DE SALÓN INTERACTIVO
              </span>
              <span className="text-[10px] text-neutral-500 font-sans">
                Haz clic en una mesa para cambiar estado
              </span>
            </div>

            {/* Table Grid */}
            <div className="grid grid-cols-2 gap-3">
              {tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => toggleTableStatus(table.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer select-none relative ${
                    table.status === "available"
                      ? "bg-white border-neutral-200 hover:border-neutral-400"
                      : table.status === "occupied"
                      ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
                      : "bg-amber-500/10 border-amber-500 text-amber-950 font-bold"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-display font-bold text-xs">{table.label}</span>
                    <span className="text-[9px] font-mono opacity-75">{table.capacity} pax</span>
                  </div>

                  <div className="flex justify-between items-end text-[10px] font-mono mt-2">
                    <span className="capitalize font-semibold">
                      {table.status === "available" && "Libre"}
                      {table.status === "occupied" && "Ocupada"}
                      {table.status === "paying" && "Cobrando"}
                    </span>
                    {table.orderTotal > 0 && (
                      <span className="font-bold">
                        ${table.orderTotal.toLocaleString("es-CL")}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-around items-center pt-2 text-[10px] font-mono text-neutral-500 border-t border-neutral-200/60">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white border border-neutral-300"></span> Libre
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-neutral-950"></span> Ocupada
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Cobrando
              </span>
            </div>
          </div>
        </motion.div>

      </div>

    </section>
  );
};
