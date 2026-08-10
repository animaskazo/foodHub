import React from "react";
import { Star, ExternalLink, Quote, Store, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  businessName: string;
  businessType: string;
  image: string; // Space/URL for photo (supports placeholder image or custom photo)
  rating: number;
  comment: string;
  storeUrl: string;
  metricsBadge?: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: "1",
    name: "Matías Silva",
    role: "Fundador y Chef",
    businessName: "San Telmo Craft Burgers",
    businessType: "Hamburguesería",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5,
    comment:
      "Desde que migramos las ventas directas a FoodHub dejamos de regalar el 28% en comisiones por delivery. La integración del e-commerce con la pantalla del cajero tomó menos de una tarde.",
    storeUrl: "https://santelmo.foodhub.cl",
    metricsBadge: "Ahorro: $420.000 / mes"
  },
  {
    id: "2",
    name: "Camila Rojas",
    role: "Administradora General",
    businessName: "Pizzería Napoli Craft",
    businessType: "Pizzería Artesanal",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5,
    comment:
      "El asistente de IA integrado con Gemini fue una revelación. Atiende las consultas sobre alérgenos e ingredientes a cualquier hora y despacha los pedidos directo a la impresora de comandas.",
    storeUrl: "https://napoli.foodhub.cl",
    metricsBadge: "+35% en pedidos directos"
  },
  {
    id: "3",
    name: "Gonzalo Morales",
    role: "Dueño",
    businessName: "Kofi Specialty & Bakery",
    businessType: "Cafetería y Pastelería",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5,
    comment:
      "Nuestros clientes recurrentes aman pedir desde el link en nuestra biografía de Instagram. La plataforma funciona perfecto en cualquier tablet sin tener que comprar hardware costoso.",
    storeUrl: "https://kofibakery.foodhub.cl",
    metricsBadge: "0% comisiones extras"
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonios" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-950" />
          <span>Testimonios de Clientes</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-neutral-950 tracking-tight">
          Restaurantes reales que multiplicaron sus márgenes
        </h2>
        <p className="text-neutral-500 text-sm font-sans max-w-2xl mx-auto">
          Conoce la experiencia de gastronómicos que tomaron el control de sus ventas directas y eliminaron las altas comisiones.
        </p>
      </div>

      {/* Grid of 3 Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonialsData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-950 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="space-y-4">
              {/* Header: Photo + Profile Info */}
              <div className="flex items-center gap-3.5 pb-2 border-b border-neutral-100">
                {/* Photo Space / Image Placeholder */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={`Foto de ${item.name}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback display if image URL fails to load
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                    {/* Fallback avatar visual indicator */}
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 text-neutral-600 text-xs font-bold font-mono -z-10">
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Store Badge Icon */}
                  <div className="absolute -bottom-1 -right-1 bg-neutral-950 text-white p-1 rounded-md shadow-sm" title="Tienda Activa">
                    <Store className="w-3 h-3" />
                  </div>
                </div>

                {/* Name & Business Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-sm text-neutral-950 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-medium truncate">
                    {item.role}
                  </p>
                  <p className="text-xs font-bold text-neutral-800 truncate mt-0.5 flex items-center gap-1">
                    <span>{item.businessName}</span>
                  </p>
                </div>
              </div>

              {/* Rating & Metric Badge */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
                {item.metricsBadge && (
                  <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                    {item.metricsBadge}
                  </span>
                )}
              </div>

              {/* Review Text / Comment */}
              <div className="relative">
                <Quote className="w-5 h-5 text-neutral-200 absolute -top-1 -left-1 rotate-180 -z-10" />
                <p className="text-xs text-neutral-600 font-sans leading-relaxed pt-1 italic">
                  "{item.comment}"
                </p>
              </div>
            </div>

            {/* Store Link Action */}
            <div className="pt-5 mt-4 border-t border-neutral-100">
              <a
                href={item.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-neutral-50 hover:bg-neutral-950 hover:text-white text-neutral-800 border border-neutral-200 rounded-xl py-2.5 px-3.5 text-xs font-bold transition-all duration-200 flex items-center justify-between group/btn cursor-pointer"
              >
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Store className="w-3.5 h-3.5 text-neutral-500 group-hover/btn:text-white transition-colors" />
                  <span>Ver tienda online</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-white transition-colors" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
