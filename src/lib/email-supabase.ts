/**
 * Supabase Email Service
 *
 * Uses Supabase Edge Functions to send emails via Resend
 * This is more reliable and doesn't require SMTP configuration
 */

import { supabaseAdmin } from './supabase';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email using Supabase Edge Function
 * Note: You need to create an edge function named 'send-email' in your Supabase project
 */
export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabaseAdmin.functions.invoke('send-email', {
      body: {
        to,
        subject,
        html,
      },
    });

    if (error) {
      console.error('Error sending email via Supabase:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendPriceAlertEmail(
  email: string,
  origin: string,
  destination: string,
  currentPrice: number,
  previousPrice: number,
  priceChange: number
) {
  const subject = priceChange < 0
    ? `✈️ Price Drop Alert: ${origin} → ${destination}`
    : `✈️ Price Alert: ${origin} → ${destination}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2563eb;
          color: white;
          padding: 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }
        .price-box {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid ${priceChange < 0 ? '#10b981' : '#f59e0b'};
        }
        .price {
          font-size: 32px;
          font-weight: bold;
          color: ${priceChange < 0 ? '#10b981' : '#f59e0b'};
        }
        .price-change {
          font-size: 18px;
          color: ${priceChange < 0 ? '#10b981' : '#f59e0b'};
          margin-top: 10px;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✈️ Flight Price Alert</h1>
        </div>
        <div class="content">
          <h2>Price Update for Your Flight</h2>
          <p>We're monitoring prices for your flight from <strong>${origin}</strong> to <strong>${destination}</strong>.</p>

          <div class="price-box">
            <div class="price">₦${currentPrice.toLocaleString()}</div>
            <div class="price-change">
              ${priceChange < 0 ? '📉' : '📈'}
              ${priceChange < 0 ? 'Decreased' : 'Increased'} by ₦${Math.abs(priceChange).toLocaleString()}
              (${Math.abs((priceChange / previousPrice) * 100).toFixed(1)}%)
            </div>
            <p style="margin-top: 10px; color: #6b7280;">Previous price: ₦${previousPrice.toLocaleString()}</p>
          </div>

          ${priceChange < 0 ? '<p><strong>This is a great time to book!</strong></p>' : ''}

          <a href="https://www.google.com/flights?q=${origin}+to+${destination}" class="button">
            View Flights
          </a>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            You're receiving this email because you set up a price alert on Wingman Travel.
          </p>
        </div>
        <div class="footer">
          <p>Wingman Travel - Your Conversational Flight Search Assistant</p>
          <p>This email was sent to ${email}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

export async function sendWelcomeEmail(email: string) {
  const subject = 'Welcome to Wingman Travel! ✈️';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2563eb;
          color: white;
          padding: 30px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Wingman Travel! ✈️</h1>
        </div>
        <div class="content">
          <p>Hi there!</p>
          <p>Thanks for signing up for price alerts with Wingman Travel. We're excited to help you find the best flight deals across Nigeria and beyond!</p>

          <h3>What you can expect:</h3>
          <ul>
            <li>📧 Email notifications when prices change</li>
            <li>📊 Price tracking for domestic and international routes</li>
            <li>💰 Alerts when we find great deals</li>
            <li>🇳🇬 Special focus on Nigerian airports and airlines</li>
          </ul>

          <p>We'll keep an eye on your flights and notify you when there are significant price changes.</p>

          <p>Happy travels!</p>
          <p><strong>The Wingman Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}
