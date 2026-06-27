import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history = [], catalog = [], currentSucursal = "Principal" } = req.body || {};
    
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response when no API key is set
      const matchedItem = catalog.find((p: any) => message.toLowerCase().includes(p.name.toLowerCase()));
      let responseText = `¡Hola! Soy el asistente virtual de FoodHub. Como estamos en modo de prueba sin API key, simulo una respuesta: `;
      if (matchedItem) {
        responseText += `¡Excelente elección! El plato "${matchedItem.name}" cuesta $${matchedItem.price} y es uno de los más recomendados de nuestra sucursal de ${currentSucursal}. ¿Te gustaría agregar algo más a tu carrito?`;
      } else {
        responseText += `¡Hola! Veo que estás interesado en nuestra carta para ${currentSucursal}. Te recomiendo probar: ${catalog.slice(0, 2).map((p: any) => p.name).join(", ") || "nuestras ricas opciones gastronómicas"}. ¿Te puedo ayudar a resolver alguna duda o personalizar tu orden?`;
      }
      return res.status(200).json({ text: responseText });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

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

    return res.status(200).json({ text: response.text || "Lo siento, no pude procesar tu solicitud." });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || "Ocurrió un error en el servidor." });
  }
}
