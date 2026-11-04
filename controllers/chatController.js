const https = require('https');
const dbStore = require('../data/dbStore');

// Sanjai AI Assistant System Instruction
const SYSTEM_INSTRUCTION = `You are "Sanjai AI Assistant", the official AI shopping and customer service advisor for BharatBazaar (India's Trusted Online Megastore).
You provide helpful, concise, warm, and accurate shopping assistance to Indian e-commerce customers in fluent English.

Store Details:
- Store Name: BharatBazaar 🇮🇳
- Currency: Indian Rupee (INR ₹)
- Categories: Electronics (Headphones, Earphones, Smartphones, Laptops, Power Banks, Extension Boards), Ethnic Fashion (Banarasi Sarees, Kanjivaram Silk, Kurtas, Nehru Jackets), Home & Kitchen (Tri-Ply Cookware, Clay Handis, Pooja Thalis), Ayurveda & Beauty (Kumkumadi Tailam, Herbal Powders, Bhringraj Oils), and Daily Groceries (Royal Basmati Rice, Kashmiri Saffron, A2 Desi Ghee).
- Top Products: boAt Rockerz 450 Pro (₹1,999), OnePlus Nord CE 4 (₹24,999), Dell Inspiron 15 (₹54,990), Xiaomi Mi Shield Surge Protector (₹839), Kanjivaram Pure Silk Saree (₹4,899), Manyavar Royal Kurta (₹2,499), Hawkins Tri-Ply Handi (₹2,150), Royal Basmati Rice (₹649), Forest Essentials Kumkumadi Tailam (₹1,875).
- Delivery: Deliveries to 28,000+ Indian PIN codes via Delhivery Surface Express and Blue Dart Air. Superhubs located in Bhiwandi (Mumbai), Nelamangala (Bengaluru), and Okhla (Delhi). Free delivery on orders over ₹499.
- Payment Methods: Instant UPI (Google Pay, PhonePe, Paytm, BHIM with dynamic QR code simulator), Cash on Delivery (COD) with Safe Delivery OTP, RuPay / Cards, and Net Banking (SBI, HDFC, ICICI, Axis).
- Invoices & Taxes: 100% compliant with Indian tax law. Includes GSTIN (07AABCB9123F1Z4), PAN, CIN, and CGST/SGST tax breakdown on official downloadable PDF tax invoices.
- Active Coupons: FESTIVE20 (20% OFF), DIWALI500 (Flat ₹500 OFF over ₹2,500), FREESHIP (Free Express Delivery).
- Returns: 7-day easy doorstep replacement policy.

Guidelines:
1. Greet politely as "Sanjai AI Assistant".
2. Keep replies concise, helpful, and formatted with bullet points and emojis.
3. Suggest relevant products with realistic INR prices when asked.
4. When asked about order tracking or delivery, explain how our live Delhivery tracking and PIN code lookup work.`;

// Call Gemini API with models/gemini-3.5-flash-lite
const callGeminiAPI = (userMessage, history = []) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    if (!apiKey) {
      return reject(new Error('GEMINI_API_KEY not configured'));
    }

    const contents = [
      {
        role: 'user',
        parts: [{ text: `[System Context: ${SYSTEM_INSTRUCTION}]\n\nCustomer Message: ${userMessage}` }]
      }
    ];

    // Append prior conversational turn if provided
    if (Array.isArray(history) && history.length > 0) {
      history.slice(-4).forEach((h) => {
        if (h.sender === 'user' || h.sender === 'bot') {
          contents.push({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        }
      });
      // Add current message as the latest turn
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
    }

    const payload = JSON.stringify({ contents });

    const req = https.request(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 10000
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const data = JSON.parse(raw);
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
              resolve(data.candidates[0].content.parts[0].text);
            } else if (data.error) {
              reject(new Error(data.error.message || 'Gemini error'));
            } else {
              reject(new Error('Invalid Gemini response format'));
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini API request timed out'));
    });

    req.write(payload);
    req.end();
  });
};

// Fallback intelligent response generator if offline / error
const generateFallbackReply = (msg) => {
  const q = msg.toLowerCase();

  if (q.includes('headphone') || q.includes('earphone') || q.includes('audio') || q.includes('boat')) {
    return `🎧 **Top Audio Recommendations by Sanjai AI:**
• **boAt Rockerz 450 Pro Wireless Headphones** — ₹1,999 (70 hrs playback, ASAP charge)
• **boAt Airdopes 141 TWS Earbuds** — ₹1,299 (8mm drivers, ENx noise cancellation)
• **OnePlus Bullets Wireless Z2** — ₹1,999 (Fast charging, booming bass)

All backed by official brand warranty and eligible for **Free Express Delivery**!`;
  }

  if (q.includes('laptop') || q.includes('computer') || q.includes('dell')) {
    return `💻 **Top Laptop Recommendations by Sanjai AI:**
• **Dell Inspiron 15 Core i5 (16GB RAM / 512GB SSD)** — ₹54,990 (FHD 120Hz display, Windows 11 + MS Office)
• **HP 15s Ryzen 5 (16GB / 512GB SSD)** — ₹46,990 (Thin & lightweight)

Includes official manufacturer warranty and eligible for door-to-door delivery with safe OTP verification!`;
  }

  if (q.includes('saree') || q.includes('silk') || q.includes('ethnic') || q.includes('kurta')) {
    return `✨ **Handcrafted Ethnic Wear Suggestions:**
• **Kanjivaram Pure Silk Zari Saree** — ₹4,899 (With unstitched matching blouse, Silk Mark certified)
• **Banarasi Royal Brocade Saree** — ₹3,499 (Traditional golden floral motifs)
• **Manyavar Embroidered Silk Kurta Set** — ₹2,499 (Festival special)

All handcrafted by certified Indian master artisans with 7-day easy returns!`;
  }

  if (q.includes('track') || q.includes('order') || q.includes('status') || q.includes('courier')) {
    return `📦 **Order & Tracking Assistance:**
You can track all your active orders in real time under the **Orders** page!
• Every parcel is dispatched via **Delhivery Surface Express** or **Blue Dart**.
• You receive a live tracking number (e.g. \`DEL-169172465IN\`) and a **Safe Delivery OTP** that you share with the delivery agent only after checking your package.`;
  }

  if (q.includes('pin') || q.includes('delivery') || q.includes('hub') || q.includes('bengaluru') || q.includes('mumbai') || q.includes('delhi')) {
    return `📍 **Delivery & Pincode Coverage:**
BharatBazaar delivers across **28,000+ Indian PIN codes**!
• Dispatched from superhubs in **Bhiwandi (Mumbai)**, **Nelamangala (Bengaluru)**, and **Okhla (Delhi)**.
• Metros receive **Next-Day Delivery** by 4:00 PM if ordered before the daily cutoff!
• Cash on Delivery (COD) and doorstep UPI QR scan are available everywhere.`;
  }

  if (q.includes('coupon') || q.includes('discount') || q.includes('offer') || q.includes('code')) {
    return `🏷️ **Active Festival Coupons on BharatBazaar:**
• \`FESTIVE20\` — Flat **20% OFF** on your entire cart
• \`DIWALI500\` — Flat **₹500 OFF** on orders above ₹2,500
• \`FREESHIP\` — **Free Express Shipping** on any order value!

Enter any of these codes at Checkout to apply your savings instantly.`;
  }

  return `Hello! I am **Sanjai AI Assistant**, your personal shopping guide for BharatBazaar 🇮🇳. 
I can help you:
• Recommend top gadgets, laptops, smartphones & ethnic fashion
• Check live delivery dates and logistics hubs for your PIN code
• Track your orders with Delhivery and retrieve your Delivery OTP
• Explain festival discount coupons, 18% GST tax invoices, and 7-day returns!

What would you like to explore today?`;
};

// POST /api/chat
exports.sendMessage = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    try {
      // Attempt live Gemini response
      const reply = await callGeminiAPI(message.trim(), history);
      return res.json({
        reply,
        source: 'gemini-3.5-flash-lite',
        assistant: 'Sanjai AI Assistant'
      });
    } catch (apiErr) {
      console.warn('Gemini API call failed, using intelligent local engine:', apiErr.message);
      const fallback = generateFallbackReply(message.trim());
      return res.json({
        reply: fallback,
        source: 'local-fallback-engine',
        assistant: 'Sanjai AI Assistant'
      });
    }
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ message: error.message });
  }
};
