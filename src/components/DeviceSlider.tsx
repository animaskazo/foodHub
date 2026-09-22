import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// @ts-ignore
import sliderAUrl from "../public/slider-a.webp";
// @ts-ignore
import sliderBUrl from "../public/slider-b.webp";
// @ts-ignore
import sliderCUrl from "../public/slider-c.webp";

const slides = [
  {
    id: "pos",
    image: sliderAUrl,
    label: "Punto de Venta",
    description: "Terminal POS ultrarrápido para atención presencial en tablet.",
    badge: "iPad",
  },
  {
    id: "mobile",
    image: sliderBUrl,
    label: "Dashboard Móvil",
    description: "Controla tu negocio desde cualquier lugar con tu smartphone.",
    badge: "iPhone",
  },
  {
    id: "desktop",
    image: sliderCUrl,
    label: "Panel de Administración",
    description: "Dashboard completo, órdenes, métricas y reportes en tiempo real.",
    badge: "Desktop",
  },
];

const AUTOPLAY_INTERVAL = 5000;

export const DeviceSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.92,
    }),
  };

  return (
    <section
      id="main-content"
      className="bg-white text-[#1d1d1f] h-auto flex flex-col relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8 relative z-10 flex flex-col flex-1 min-h-0 pt-8 sm:pt-8">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto space-y-1 sm:space-y-2 mt-6 sm:mt-8 mb-1 sm:mb-4 shrink-0">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-bold tracking-tight text-[#1d1d1f] leading-[1.05]">
            Vende más. <br /> Automatiza todo.
          </h2>
          <p className="text-[15px] sm:text-[18px] text-[#6e6e73] font-normal leading-relaxed max-w-3xl mx-auto">
            Simplifica el trabajo de tu restaurante y multiplica tus ventas. Nuestro ecosistema integral gestiona cada pedido en piloto automático, <span className="relative inline-block"><span className="relative z-10 font-semibold text-[#1d1d1f]">sin comisiones.</span><span className="absolute bottom-1 left-0 w-full h-2.5 bg-green-200/60 -z-10 rounded-sm"></span></span>
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-5xl mx-auto w-full h-[45vh] md:h-[60vh] sm:h-[100vh]">

          {/* Navigation arrows (outside the image for a clean look) */}
          <button
            onClick={prev}
            aria-label="Slide anterior"
            className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center transition-transform hover:scale-110 cursor-pointer border border-neutral-100 text-neutral-600 hover:text-neutral-900"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={next}
            aria-label="Siguiente slide"
            className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center transition-transform hover:scale-110 cursor-pointer border border-neutral-100 text-neutral-600 hover:text-neutral-900"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Area */}
          <div className="relative w-full h-full flex items-end justify-center overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={slides[current].id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 25 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="absolute inset-0 flex items-end justify-center"
              >
                <img
                  src={slides[current].image}
                  alt={slides[current].label}
                  className={`max-w-none object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)] ${slides[current].id === 'mobile'
                    ? 'object-top w-[230%] sm:w-[200%] lg:w-[180%] h-auto relative top-[200px] sm:top-[300px] lg:top-[320px]'
                    : 'object-bottom w-[115%] sm:w-[100%] lg:w-[90%] h-auto'
                    }`}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots navigation */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goTo(index)}
                aria-label={`Ir a ${slide.label}`}
                className="relative cursor-pointer p-1 group flex items-center justify-center"
              >
                <div
                  className={`h-[4px] rounded-full transition-all duration-300 ${index === current
                    ? "w-10 bg-[#1d1d1f]"
                    : "w-4 bg-neutral-200 group-hover:bg-neutral-300"
                    }`}
                />
                {index === current && !isPaused && (
                  <motion.div
                    className="absolute left-1 h-[4px] rounded-full bg-neutral-400"
                    initial={{ width: 0 }}
                    animate={{ width: "2.5rem" }}
                    transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                    key={`progress-${current}`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
