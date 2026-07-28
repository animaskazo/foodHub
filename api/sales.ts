import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, message } = req.body || {};

    if (!email || !name || !phone) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    if (process.env.RESEND_API_KEY) {
      console.log("Nueva solicitud de ventas recibida:", req.body);
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: 'FoodHub <food@digital-solutions.work>',
        to: email,
        bcc: 'hola@digital-solutions.work',
        subject: 'Hemos recibido tu solicitud de contacto comercial - FoodHub',
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
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">foodhub <span style="font-size: 12px; background: #262626; padding: 2px 8px; border-radius: 12px; margin-left: 8px; vertical-align: middle;">ENTERPRISE</span></h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px;">
                <h2 style="color: #0a0a0a; margin-top: 0; font-size: 22px; font-weight: 800;">¡Hola ${name}!</h2>
                <p style="color: #525252; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hemos recibido tu solicitud de contacto para desarrollos a medida. Un ejecutivo de ventas se pondrá en contacto contigo a la brevedad.</p>
                
                <!-- Info Box -->
                <div style="background: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                  <div style="margin-bottom: 16px;">
                    <span style="color: #737373; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Nombre</span>
                    <span style="color: #171717; font-weight: 600; font-size: 15px;">${name}</span>
                  </div>
                  <div style="margin-bottom: 16px;">
                    <span style="color: #737373; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Teléfono de Contacto</span>
                    <span style="color: #171717; font-weight: 600; font-size: 15px;">${phone}</span>
                  </div>
                  <div style="margin-bottom: 16px;">
                    <span style="color: #737373; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Mensaje</span>
                    <span style="color: #171717; font-weight: 600; font-size: 15px;">${message || 'Sin mensaje'}</span>
                  </div>
                </div>
                
                <p style="color: #171717; font-size: 16px; font-weight: 600; margin-bottom: 0;">¡Hablemos pronto!</p>
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

      if (error) {
        console.error("Error devuelto por Resend:", error);
        return res.status(500).json({ error: "No se pudo enviar el correo: " + error.message });
      }
      
      console.log("Correo enviado exitosamente. ID de Resend:", data?.id);
    } else {
      console.warn("WARNING: RESEND_API_KEY is not defined. Email was not sent.");
    }

    return res.status(200).json({ success: true, message: "Contacto de ventas exitoso" });
  } catch (error: any) {
    console.error("Resend API Error:", error);
    return res.status(500).json({ error: error.message || "Error al enviar el correo." });
  }
}
