import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup Gemini SDK if key is available
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI Chatbot functionality will use fallback responses.");
  }

  // API Endpoint: Chat with Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [], catalog = [], currentSucursal = "Principal" } = req.body;
      
      if (!message) {
        res.status(400).json({ error: "Message is required." });
        return;
      }

      if (!ai) {
        // Fallback response when no API key is set
        setTimeout(() => {
          const matchedItem = catalog.find((p: any) => message.toLowerCase().includes(p.name.toLowerCase()));
          let responseText = `¡Hola! Soy el asistente virtual de FoodHub. Como estamos en modo de prueba local sin API key, simulo una respuesta: `;
          if (matchedItem) {
            responseText += `¡Excelente elección! El plato "${matchedItem.name}" cuesta $${matchedItem.price} y es uno de los más recomendados de nuestra sucursal de ${currentSucursal}. ¿Te gustaría agregar algo más a tu carrito?`;
          } else {
            responseText += `¡Hola! Veo que estás interesado en nuestra carta para ${currentSucursal}. Te recomiendo probar: ${catalog.slice(0, 2).map((p: any) => p.name).join(", ") || "nuestras ricas opciones gastronómicas"}. ¿Te puedo ayudar a resolver alguna duda o personalizar tu orden?`;
          }
          res.json({ text: responseText });
        }, 800);
        return;
      }

      // Convert history to Gemini parts format
      const contents = history.map((h: any) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      }));

      // Add user message
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      // Construct system instruction with catalog details
      const catalogText = catalog.map((p: any) => {
        const variantsText = p.variants && p.variants.length > 0 
          ? ` (Opciones/Extras: ${p.variants.map((v: any) => `${v.name} por +$${v.price}`).join(", ")})` 
          : "";
        return `- [Categoría: ${p.category}] ${p.name}: $${p.price}. Descripción: ${p.description || "Deliciosa opción disponible."}${variantsText}`;
      }).join("\n");

      const systemInstruction = `Eres "FoodHub IA", el asistente inteligente y experto en servicio de un negocio de comida / restaurant de primer nivel.
Estás diseñado para ayudar a los clientes de la tienda online a elegir su pedido, resolver dudas de la carta, sugerir combinaciones, detallar ingredientes y guiar su experiencia gastronómica.

Información sobre el negocio actual:
- Sucursal activa actual: ${currentSucursal}
- Menú de productos disponibles hoy:
${catalogText || "No hay productos registrados en el catálogo en este momento."}

Instrucciones de comportamiento:
1. Sé cálido, entusiasta, educado y habla un español impecable con modismos amables locales (chileno/latinoamericano).
2. Si te preguntan sobre platos, descríbelos de forma apetitosa basándote ESTRICTAMENTE en los detalles del catálogo provisto arriba. Sugiere agregar extras o variantes si existen para ese plato.
3. Si el usuario desea comprar o agregar un producto, infórmale amablemente que puede hacer clic en el botón "+ Agregar" que aparece directamente en la tarjeta de ese producto en la pantalla de la izquierda.
4. Mantén las respuestas fluidas, naturales pero concisas (máximo 2 a 3 párrafos cortos) para asegurar que se lean perfectamente bien en el chat flotante. ¡Haz que la comida suene deliciosa!
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text || "Lo siento, no pude procesar tu solicitud." });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Ocurrió un error en el servidor." });
    }
  });

  // Waitlist endpoint with Resend
  const resend = new Resend(process.env.RESEND_API_KEY);

  app.post("/api/waitlist", async (req, res) => {
    try {
      const { businessName, ownerName, email, phone, restaurantType, monthlyOrders } = req.body;

      if (!email || !businessName || !ownerName) {
        res.status(400).json({ error: "Faltan campos requeridos." });
        return;
      }

      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'FoodHub <food@digital-solutions.work>',
          to: email,
          bcc: 'hola@digital-solutions.work',
          subject: '¡Bienvenido a la lista de espera de FoodHub!',
          html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="utf-8">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf9f6; margin: 0; padding: 40px 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.05);">
                
                <!-- Header -->
                <div style="background: #0a0a0a; padding: 32px 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">foodhub <span style="font-size: 12px; background: #262626; padding: 2px 8px; border-radius: 12px; margin-left: 8px; vertical-align: middle;">SAAS</span></h1>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px;">
                  <h2 style="color: #0a0a0a; margin-top: 0; font-size: 22px; font-weight: 800;">¡Hola ${ownerName}!</h2>
                  <p style="color: #525252; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Nos emociona confirmarte que <strong>${businessName}</strong> ha sido registrado exitosamente en nuestra lista de espera prioritaria.</p>
                  
                  <!-- Info Box -->
                  <div style="background: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <div style="margin-bottom: 16px;">
                      <span style="color: #737373; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Restaurante / Negocio</span>
                      <span style="color: #171717; font-weight: 600; font-size: 15px;">${businessName}</span>
                    </div>
                    <div style="margin-bottom: 16px;">
                      <span style="color: #737373; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Rubro</span>
                      <span style="color: #171717; font-weight: 600; font-size: 15px;">${restaurantType}</span>
                    </div>
                    <div style="margin-bottom: 16px;">
                      <span style="color: #737373; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Teléfono de Contacto</span>
                      <span style="color: #171717; font-weight: 600; font-size: 15px;">${phone}</span>
                    </div>
                    <div>
                      <span style="color: #737373; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Volumen Mensual</span>
                      <span style="color: #171717; font-weight: 600; font-size: 15px;">${monthlyOrders} pedidos</span>
                    </div>
                  </div>
                  
                  <p style="color: #525252; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">Un gestor técnico asignado revisará tu perfil y se pondrá en contacto contigo muy pronto para coordinar tu acceso anticipado a la plataforma.</p>
                  
                  <p style="color: #171717; font-size: 16px; font-weight: 600; margin-bottom: 0;">¡Prepárate para operar sin comisiones!</p>
                </div>
                
                <!-- Footer -->
                <div style="border-top: 1px solid #e5e5e5; padding: 24px 40px; text-align: center; background: #fafafa;">
                  <p style="color: #a3a3a3; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} FoodHub Inc. Todos los derechos reservados.</p>
                </div>
                
              </div>
            </body>
            </html>
          `
        });
      } else {
        console.warn("WARNING: RESEND_API_KEY is not defined. Email was not sent.");
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Resend API Error:", error);
      res.status(500).json({ error: error.message || "Error al enviar el correo." });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
