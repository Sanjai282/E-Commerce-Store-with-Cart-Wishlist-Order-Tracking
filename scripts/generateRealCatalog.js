const fs = require('fs');
const path = require('path');

// Badges rotation
const badges = ['Bestseller', 'Top Rated', 'Great Indian Choice', 'Festival Special', 'Trending', null, 'Amazon Choice'];

// Randomized realistic Indian delivery speeds
const deliveryOptions = [
  '⚡ Delivery by Tomorrow, 2 PM',
  '⚡ Free Delivery by Tomorrow, 5 PM',
  '🚚 Delivery in 2 Days (Express)',
  '🚚 Delivery in 2 - 3 Days',
  '🚚 Standard Delivery in 3 - 4 Days',
  '⚡ Same-Day Delivery (Order within 3 hrs)',
  '🚚 Delivery in 3 Days (Regional Hub)',
  '⚡ 24-Hour Express Dispatch'
];

// ==========================================
// 1. ELECTRONICS: 100 REAL PRODUCTS WITH SUBCATEGORIES
// ==========================================
function generateElectronics() {
  const templates = [
    // Laptops
    {
      subcategory: 'Laptops',
      brand: 'HP',
      model: '15s 12th Gen Intel Core i5 15.6" FHD Laptop (16GB RAM / 512GB SSD / Windows 11)',
      price: 52990,
      mrp: 75900,
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
      hsn: '84713010',
      spec: { processor: 'Intel Core i5-1235U 12th Gen', ram: '16GB DDR4', storage: '512GB PCIe NVMe M.2 SSD', display: '15.6" Full HD Micro-Edge Anti-Glare' }
    },
    {
      subcategory: 'Laptops',
      brand: 'ASUS',
      model: 'Vivobook 15 Thin & Light Laptop (Intel Core i3 12th Gen / 8GB / 512GB SSD / Win 11)',
      price: 38990,
      mrp: 49990,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
      hsn: '84713010',
      spec: { processor: 'Intel Core i3-1215U', ram: '8GB DDR4', storage: '512GB SSD', display: '15.6" FHD 60Hz Slim Bezel' }
    },
    {
      subcategory: 'Laptops',
      brand: 'Dell',
      model: 'Inspiron 3520 15.6" 120Hz Laptop (Intel Core i5 12th Gen / 16GB / 512GB SSD / Carbon Black)',
      price: 54990,
      mrp: 72990,
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80',
      hsn: '84713010',
      spec: { processor: 'Intel Core i5-1235U', ram: '16GB High-Speed RAM', storage: '512GB M.2 PCIe NVMe', display: '15.6" FHD 120Hz 250 nits' }
    },
    {
      subcategory: 'Laptops',
      brand: 'Lenovo',
      model: 'IdeaPad Slim 3 15.6" FHD IPS Laptop (AMD Ryzen 5 7520U / 16GB / 512GB SSD / Arctic Grey)',
      price: 46990,
      mrp: 62990,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
      hsn: '84713010',
      spec: { processor: 'AMD Ryzen 5 7520U Quad-Core', ram: '16GB LPDDR5', storage: '512GB SSD', audio: 'Dolby Audio 2x 1.5W' }
    },

    // Tablets
    {
      subcategory: 'Tablets',
      brand: 'Apple',
      model: 'iPad 10th Gen 10.9" Wi-Fi 64GB with A14 Bionic Chip & Liquid Retina Display (Silver)',
      price: 34900,
      mrp: 39900,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      hsn: '84713020',
      spec: { display: '10.9" Liquid Retina True Tone', chip: 'A14 Bionic 6-Core CPU', camera: '12MP Ultra Wide Front + 12MP Rear', battery: 'All-Day 10 Hours' }
    },
    {
      subcategory: 'Tablets',
      brand: 'Samsung',
      model: 'Galaxy Tab A9+ 11" 90Hz Display Wi-Fi Tablet (8GB RAM / 128GB Storage / Graphite)',
      price: 18999,
      mrp: 25999,
      image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      hsn: '84713020',
      spec: { display: '11.0" WQXGA 90Hz Refresh Rate', ram: '8GB RAM + 128GB Expandable', audio: 'Quad Speakers with Dolby Atmos', battery: '7,040 mAh Fast Charge' }
    },

    // Mobile Phones
    {
      subcategory: 'Mobile Phones',
      brand: 'OnePlus',
      model: 'Nord CE 3 Lite 5G 108MP Camera (8GB RAM / 128GB Storage / Pastel Lime)',
      price: 17499,
      mrp: 19999,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
      hsn: '85171300',
      spec: { camera: '108MP Main Camera + 3x Lossless Zoom', display: '6.72" 120Hz FHD+ Display', charging: '67W SUPERVOOC 5000 mAh', processor: 'Snapdragon 695 5G' }
    },
    {
      subcategory: 'Mobile Phones',
      brand: 'realme',
      model: '12 Pro 5G with Periscope Portrait Camera (8GB RAM / 256GB Storage / Submarine Blue)',
      price: 24999,
      mrp: 29999,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
      hsn: '85171300',
      spec: { camera: '32MP Sony IMX709 Telephoto + 50MP Sony OIS', display: '120Hz Curved Vision AMOLED', processor: 'Snapdragon 6 Gen 1', design: 'Luxury Watch Vegan Leather Design' }
    },

    // Over-Ear Headphones
    {
      subcategory: 'Over-Ear Headphones',
      brand: 'boAt',
      model: 'Rockerz 550 Over-Ear Wireless Headphones with 50mm Dynamic Drivers (Army Green)',
      price: 1999,
      mrp: 4999,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      hsn: '85183000',
      spec: { drivers: '50mm Dynamic Sound Drivers', playback: '20 Hours Battery Playback', padding: 'Plush Ergonomic Earcups', connectivity: 'Bluetooth 5.0 + AUX Support' }
    },
    {
      subcategory: 'Over-Ear Headphones',
      brand: 'Noise',
      model: 'Two Wireless Over-Ear Headphones with 50-Hour Playtime & Low Latency (Calm White)',
      price: 1699,
      mrp: 3999,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
      hsn: '85183000',
      spec: { playback: '50 Hours Marathon Battery', drivers: '40mm High Precision Bass Drivers', modes: 'Tru Bass Dual Equalizer Mode', calling: 'Built-in Clear Mic' }
    },

    // TWS Earbuds
    {
      subcategory: 'TWS Earbuds',
      brand: 'boAt',
      model: 'Airdopes 141 Truly Wireless Earbuds with 42H Playtime & ENx Quad Mics (Bold Black)',
      price: 1299,
      mrp: 4490,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
      hsn: '85183000',
      spec: { battery: '42 Hours Playback with ASAP Charge', mics: 'ENx Quad Mics for Environmental Noise Cancellation', latency: 'BEAST Mode 80ms Ultra-Low Latency', rating: 'IPX4 Water Resistant' }
    },
    {
      subcategory: 'TWS Earbuds',
      brand: 'Boult Audio',
      model: 'Z40 Truly Wireless Earbuds with 60H Playtime & Zen ENC Tech (Denim Blue)',
      price: 1199,
      mrp: 4999,
      image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80',
      hsn: '85183000',
      spec: { battery: '60 Hours Total Battery Life', drivers: '10mm BoomX Rich Bass Drivers', charging: 'Lightning Type-C ASAP Fast Charging', touch: 'Full Smart Touch Controls' }
    },

    // Smartwatches
    {
      subcategory: 'Smartwatches',
      brand: 'Noise',
      model: 'ColorFit Pulse 2 Max 1.85" Display Bluetooth Calling Smartwatch (Jet Black)',
      price: 1499,
      mrp: 5999,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      hsn: '85176290',
      spec: { display: '1.85" TFT LCD 550 Nits Brightness', calling: 'Single-Chip Tru Sync Bluetooth Calling', health: 'Noise Health Suite (SpO2, 24x7 Heart Rate)', sports: '100 Sports Modes' }
    },
    {
      subcategory: 'Smartwatches',
      brand: 'Fire-Boltt',
      model: 'Ninja Call Pro Plus 1.83" Smartwatch with AI Voice Assistance & 120 Sports Modes',
      price: 1399,
      mrp: 6999,
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
      hsn: '85176290',
      spec: { display: '1.83" HD Touch Display 280 Nits', voice: 'AI Voice Assistant (Siri / Google)', battery: '8 Days Standby, 5 Days Normal Use', games: 'Built-in Casual Games & Calculator' }
    },

    // Bluetooth Speakers
    {
      subcategory: 'Bluetooth Speakers',
      brand: 'boAt',
      model: 'Stone 352 10W Portable Bluetooth Speaker with IPX7 Water Resistance (Raging Black)',
      price: 1499,
      mrp: 3490,
      image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&q=80',
      hsn: '85182100',
      spec: { sound: '10W RMS boAt Signature Stereo Sound', battery: '12 Hours Continuous Music Playback', waterproof: 'IPX7 Certified Splash & Dust Resistant', pairing: 'True Wireless Dual Stereo Pairing' }
    },
    {
      subcategory: 'Bluetooth Speakers',
      brand: 'JBL',
      model: 'Go 3 Ultra Portable Waterproof & Dustproof Bluetooth Speaker (Squad Green)',
      price: 2999,
      mrp: 3999,
      image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=600&q=80',
      hsn: '85182100',
      spec: { sound: 'JBL Pro Sound with Punchy Bass', design: 'Ultra-Portable Fabric with Integrated Loop', rating: 'IP67 Waterproof & Dustproof', battery: '5 Hours Playtime on Single Charge' }
    },

    // Keyboards & Mice
    {
      subcategory: 'Keyboards & Mice',
      brand: 'Zebronics',
      model: 'Zeb-Transformer Mechanical RGB Backlit Gaming Keyboard with Aluminum Frame',
      price: 1899,
      mrp: 3999,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
      hsn: '84716040',
      spec: { switches: 'Tactile Mechanical Blue Switches', rgb: 'Multicolor Backlit with 4 Brightness Modes', build: 'Heavy-Duty Aluminum Alloy Top Panel', cable: 'Gold-Plated Braided USB Cable' }
    },
    {
      subcategory: 'Keyboards & Mice',
      brand: 'pTron',
      model: 'Viper Wireless Ergonomic Rechargeable Silent Optical Mouse (Matte Black)',
      price: 699,
      mrp: 1499,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
      hsn: '84716070',
      spec: { dpi: '800-1200-1600 Adjustable DPI Sensor', click: '90% Noise Reduced Silent Buttons', battery: 'Rechargeable 500mAh Lithium Cell', range: '10m 2.4GHz Cordless Freedom' }
    },

    // Power Banks & Chargers
    {
      subcategory: 'Power Banks & Chargers',
      brand: 'Portronics',
      model: 'Adapto 65W GaN Multi-Port Fast Charger for Laptops, MacBooks & Phones (White)',
      price: 1499,
      mrp: 2999,
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80',
      hsn: '85044030',
      spec: { tech: 'GaN III Ultra Fast Charging Tech', ports: '2x Type-C (65W Max) + 1x USB-A (30W)', protection: 'Short Circuit, Surge & Overheat Safe', compatibility: 'Supports PD, QC 3.0 & PPS Protocols' }
    },
    {
      subcategory: 'Power Banks & Chargers',
      brand: 'Mi',
      model: '10000mAh Power Bank 3i with 18W Fast Charging & Dual Output (Metallic Blue)',
      price: 1299,
      mrp: 2199,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
      hsn: '85044030',
      spec: { capacity: '10000mAh High-Density Li-Polymer', charging: '18W Fast Two-Way Quick Charge', output: 'Dual USB Output + Type-C Input/Output', safety: '12-Layer Advanced Circuit Protection' }
    },
    {
      subcategory: 'Extension Boards & Plugs',
      brand: 'Havells',
      model: '4-Way Surge & Spike Protected Extension Board with 2 Metre Heavy Duty Cord',
      price: 649,
      mrp: 1095,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
      hsn: '85366990',
      spec: { sockets: '4 Universal Sockets with Individual LED Switches', surge: 'Built-in Varistor Surge & Spike Suppression', cord: '2 Metre 100% Pure Virgin Copper Cable', rating: '6A 240V AC 50Hz Heavy Duty' }
    }
  ];

  const products = [];
  for (let i = 0; i < 100; i++) {
    const t = templates[i % templates.length];
    const id = `prod-elec-${String(i + 1).padStart(3, '0')}`;
    const variantNum = Math.floor(i / templates.length) + 1;
    const name = variantNum > 1 ? `${t.brand} ${t.model} (Edition ${variantNum})` : `${t.brand} ${t.model}`;
    const priceMod = (i % 5) * 50;
    const price = Math.round(t.price + priceMod);
    const mrp = Math.round(t.mrp + priceMod * 1.5);
    const discount = Math.round(((mrp - price) / mrp) * 100);

    products.push({
      _id: id,
      id,
      name,
      description: `Experience authentic high-performance tech with ${name}. Built with industry-leading standards, genuine manufacturer warranty, and certified for Indian electrical conditions.`,
      price,
      mrp,
      discount,
      category: 'Electronics',
      subcategory: t.subcategory, // SUB-DOMAIN / SUBCATEGORY
      image: t.image,
      stock: 15 + ((i * 7) % 85),
      rating: parseFloat((4.1 + ((i % 8) * 0.1)).toFixed(1)),
      reviewsCount: 85 + ((i * 33) % 1900),
      badge: badges[i % badges.length],
      deliverySpeed: deliveryOptions[(i * 3 + 1) % deliveryOptions.length],
      deliveryTime: deliveryOptions[(i * 3 + 1) % deliveryOptions.length],
      hsnCode: t.hsn,
      gstRate: 18,
      brand: t.brand,
      origin: 'India',
      warranty: '1 Year Brand Manufacturer Replacement Warranty',
      specifications: {
        'Brand': t.brand,
        'Category': 'Electronics',
        'Subcategory': t.subcategory,
        ...t.spec
      }
    });
  }
  return products;
}

// ==========================================
// 2. ETHNIC FASHION: 100 REAL PRODUCTS WITH SUBCATEGORIES
// ==========================================
function generateEthnicFashion() {
  const templates = [
    {
      subcategory: 'Banarasi Sarees',
      brand: 'Meena Bazaar',
      model: 'Pure Banarasi Woven Katan Silk Zari Saree with Contrast Blouse Piece (Peacock Blue)',
      price: 3499,
      mrp: 7999,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
      hsn: '5007',
      spec: { fabric: 'Pure Katan Art Silk', weave: 'Traditional Kadwa Gold Zari', length: '6.3 Meters with Blouse Piece', occasion: 'Weddings & Celebrations' }
    },
    {
      subcategory: 'Banarasi Sarees',
      brand: 'Taneira',
      model: 'Handcrafted Festive Banarasi Brocade Silk Saree with Meenakari Pallu (Royal Maroon)',
      price: 3899,
      mrp: 8499,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80',
      hsn: '5007',
      spec: { fabric: 'Mulberry Silk Blend', border: 'Intricate Temple Meenakari Border', wash: 'Dry Clean Only', artisan: 'Varanasi Weavers Cluster' }
    },
    {
      subcategory: 'Kanchipuram Silk Sarees',
      brand: 'Jaypore',
      model: 'Kanchipuram Temple Border Silk Saree with Heavy Gold Floral Motif (Deep Crimson)',
      price: 4299,
      mrp: 9999,
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80',
      hsn: '5007',
      spec: { origin: 'Kanchipuram, Tamil Nadu', zari: 'Tested Half-Fine Gold Zari', texture: 'Stately Rich Drape', weight: '720 Grams' }
    },
    {
      subcategory: 'Kurtas & Kurtis',
      brand: 'FabIndia',
      model: 'Handwoven Chanderi Silk Blend Straight Kurta with Mandarin Collar (Mustard Gold)',
      price: 2199,
      mrp: 4499,
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80',
      hsn: '6204',
      spec: { fabric: 'Chanderi Silk Blend', lining: 'Breathable Mulmul Cotton', fit: 'Regular Comfort Fit', pockets: '2 Side Slit Pockets' }
    },
    {
      subcategory: 'Kurtas & Kurtis',
      brand: 'W for Woman',
      model: 'Lucknowi Hand Chikankari Embroidered Mulmul Cotton Kurti (Pastel Mint Green)',
      price: 1499,
      mrp: 2999,
      image: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=600&q=80',
      hsn: '6206',
      spec: { craft: 'Authentic Lucknowi Shadow Handwork', fabric: '100% Breathable Combed Cotton', sleeves: 'Three-Quarter Sleeves', occasion: 'Office & Festive Casual' }
    },
    {
      subcategory: 'Anarkali Sets',
      brand: 'Biba',
      model: 'Printed Anarkali Kurta with Churidar & Dupatta Festive 3-Piece Set (Wine Red)',
      price: 2799,
      mrp: 5499,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
      hsn: '6204',
      spec: { top: 'Flared Calf-Length Anarkali', bottom: 'Cotton Lycra Churidar', dupatta: 'Chiffon Border Dupatta', design: 'Traditional Foil Print Accents' }
    },
    {
      subcategory: "Men's Sherwanis",
      brand: 'Manyavar',
      model: 'Royal Jacquard Silk Men\'s Sherwani with Stole and Churidar Set (Cream & Gold)',
      price: 4999,
      mrp: 11999,
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600&q=80',
      hsn: '6203',
      spec: { fabric: 'Art Silk Brocade Jacquard', collar: 'Embellished Mandarin Collar', buttons: 'Antique Gold Metal Buttons', set: 'Includes Sherwani, Churidar & Stole' }
    },
    {
      subcategory: "Men's Kurtas & Pyjamas",
      brand: 'House of Pataudi',
      model: 'Men Pure Linen Straight Kurta & Pyjama Set with Nehru Pocket (Navy Blue)',
      price: 1899,
      mrp: 3799,
      image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&q=80',
      hsn: '6203',
      spec: { fabric: '100% European Flax Linen', style: 'Mandarin Collar Front Button Placket', fit: 'Tailored Comfort', weave: 'Plain Slub Weave' }
    },
    {
      subcategory: 'Bridal Lehengas',
      brand: 'Soch',
      model: 'Embroidered Semi-Stitched Velvet Bridal Lehenga Choli with Resham Zari (Deep Plum)',
      price: 5999,
      mrp: 14999,
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80',
      hsn: '6204',
      spec: { flare: '4.2 Meters Circular Flare', lehenga: 'Micro Velvet with Intricate Dori & Zari', dupatta: 'Soft Net with Embellished Four-Sided Lace', blouse: 'Unstitched 1 Meter Velvet Fabric' }
    }
  ];

  const products = [];
  for (let i = 0; i < 100; i++) {
    const t = templates[i % templates.length];
    const id = `prod-ethnic-${String(i + 1).padStart(3, '0')}`;
    const variantNum = Math.floor(i / templates.length) + 1;
    const name = variantNum > 1 ? `${t.brand} ${t.model} (V-${variantNum})` : `${t.brand} ${t.model}`;
    const priceMod = (i % 6) * 60;
    const price = Math.round(t.price + priceMod);
    const mrp = Math.round(t.mrp + priceMod * 1.8);
    const discount = Math.round(((mrp - price) / mrp) * 100);

    products.push({
      _id: id,
      id,
      name,
      description: `Elevate your festive grace with ${name}. Mastercrafted by renowned Indian textile artisans with genuine attention to embroidery, drape, and enduring elegance.`,
      price,
      mrp,
      discount,
      category: 'Ethnic Fashion',
      subcategory: t.subcategory,
      image: t.image,
      stock: 12 + ((i * 11) % 55),
      rating: parseFloat((4.2 + ((i % 7) * 0.1)).toFixed(1)),
      reviewsCount: 45 + ((i * 29) % 850),
      badge: badges[i % badges.length],
      deliverySpeed: deliveryOptions[(i * 3 + 2) % deliveryOptions.length],
      deliveryTime: deliveryOptions[(i * 3 + 2) % deliveryOptions.length],
      hsnCode: t.hsn,
      gstRate: 5,
      brand: t.brand,
      origin: 'India',
      warranty: 'Authentic Artisan Guarantee - 7 Days Easy Return',
      specifications: {
        'Brand': t.brand,
        'Category': 'Ethnic Fashion',
        'Subcategory': t.subcategory,
        ...t.spec
      }
    });
  }
  return products;
}

// ==========================================
// 3. HOME & KITCHEN: 100 REAL PRODUCTS WITH SUBCATEGORIES
// ==========================================
function generateHomeKitchen() {
  const templates = [
    {
      subcategory: 'Mixer Grinders',
      brand: 'Prestige',
      model: 'Iris Plus 750W 4-Jar Mixer Grinder with Pure Copper Motor (White & Blue)',
      price: 2999,
      mrp: 5495,
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80',
      hsn: '85094010',
      spec: { motor: '750 Watt 100% Pure Copper Winding', jars: '1.5L Wet, 1L Dry, 0.4L Chutney, 1.5L Juicer Jar', blades: 'Surgical Grade SS 304 Blades', overload: 'Auto Cut-Off Overload Protection' }
    },
    {
      subcategory: 'Pressure Cookers',
      brand: 'Hawkins',
      model: 'Contura Hard Anodized 3 Litre Induction Base Pressure Cooker (Black)',
      price: 1699,
      mrp: 2750,
      image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&q=80',
      hsn: '76151011',
      spec: { capacity: '3.0 Litres Inner Lid', material: 'Hard Anodized Scratch-Proof Surface', base: 'Thick Induction & Gas Compatible Base', safety: 'Controlled Gasket Release Valve' }
    },
    {
      subcategory: 'Pressure Cookers',
      brand: 'Vinod',
      model: 'Platinum SAS Triply Stainless Steel 5 Litre Outer Lid Pressure Cooker',
      price: 2499,
      mrp: 3890,
      image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&q=80',
      hsn: '73239300',
      spec: { construction: 'SAS Tri-Ply (Steel-Aluminium-Steel)', capacity: '5.0 Litres Family Size', handles: 'Stay-Cool Ergonomic Bakelite Handles', base: '360 Induction Thermal Base' }
    },
    {
      subcategory: 'Cookware Sets',
      brand: 'Prestige',
      model: 'Omega Deluxe Granite 3-Piece Non-Stick Cookware Set (Kadai, Tawa, Fry Pan)',
      price: 2199,
      mrp: 4500,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
      hsn: '76151021',
      spec: { coating: '5-Layer German Greblon Granite Coating', pfoaFree: '100% PFOA Free Non-Toxic Cooking', compatibility: 'Gas & Induction Stove Compatible', lid: 'Toughened Glass Lid with Steam Release' }
    },
    {
      subcategory: 'Cast Iron Tawas',
      brand: 'Meyer',
      model: 'Pre-Seasoned Cast Iron 28cm Dosa Tawa & Roti Skillet (Black)',
      price: 1399,
      mrp: 2400,
      image: 'https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?w=600&q=80',
      hsn: '73239100',
      spec: { seasoning: 'Pre-Seasoned with 100% Organic Flaxseed Oil', thickness: '4.5mm Heavy Gauge Base', iron: 'Fortifies Every Meal with Natural Dietary Iron', handles: 'Dual Integrated Helper Handles' }
    },
    {
      subcategory: 'Thermos & Flasks',
      brand: 'Milton',
      model: 'Thermosteel 1000ml Vacuum Insulated Double Wall Stainless Steel Flask',
      price: 899,
      mrp: 1450,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
      hsn: '96170011',
      spec: { retention: '24 Hours Hot & Cold Thermal Retention', steel: 'Rust-Proof Food Grade 304 Stainless Steel', lid: 'Leak-Proof Spout Cap with Serving Cup', capacity: '1000 ml Hydration' }
    },
    {
      subcategory: 'Dinner Sets',
      brand: 'Cello',
      model: 'Opalware Imperial 18-Piece Chip Resistant Floral Dinner Set (White Bloom)',
      price: 1799,
      mrp: 3290,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80',
      hsn: '69120010',
      spec: { contents: '6 Dinner Plates, 6 Quarter Plates, 6 Veg Bowls', material: 'Bone-Ash Free 100% Vegetarian Opalware', features: 'Microwave Safe, Dishwasher Safe, Chip Resistant', finish: 'Glossy Floral Fade-Proof Glaze' }
    },
    {
      subcategory: 'Spice Boxes',
      brand: 'Solimo',
      model: 'Stainless Steel Traditional Masala Dabba with 7 Containers & See-Through Acrylic Lid',
      price: 649,
      mrp: 1199,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
      hsn: '73239390',
      spec: { cups: '7 Individual Removable Spice Cups + Steel Measuring Spoon', lid: 'Airtight Transparent Acrylic Viewing Lid', finish: 'Mirror Finish Food Grade Stainless Steel', capacity: 'Stores 7 Daily Indian Cooking Spices' }
    },
    {
      subcategory: 'Electric Kettles',
      brand: 'Pigeon',
      model: 'Amaze Plus 1.5 Litre Stainless Steel Fast Boil Electric Kettle (1500W)',
      price: 799,
      mrp: 1495,
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80',
      hsn: '85167920',
      spec: { power: '1500 Watt Concealed Rapid Heating Element', safety: 'Automatic Shut-Off & Boil-Dry Protection', base: '360 Swivel Cordless Base', capacity: '1.5 Litres Boils in 4 Minutes' }
    }
  ];

  const products = [];
  for (let i = 0; i < 100; i++) {
    const t = templates[i % templates.length];
    const id = `prod-kitchen-${String(i + 1).padStart(3, '0')}`;
    const variantNum = Math.floor(i / templates.length) + 1;
    const name = variantNum > 1 ? `${t.brand} ${t.model} (Series ${variantNum})` : `${t.brand} ${t.model}`;
    const priceMod = (i % 5) * 40;
    const price = Math.round(t.price + priceMod);
    const mrp = Math.round(t.mrp + priceMod * 1.6);
    const discount = Math.round(((mrp - price) / mrp) * 100);

    products.push({
      _id: id,
      id,
      name,
      description: `Upgrade your daily culinary routine with ${name}. Designed for rugged Indian kitchen usage, energy efficiency, and long-lasting food safety.`,
      price,
      mrp,
      discount,
      category: 'Home & Kitchen',
      subcategory: t.subcategory,
      image: t.image,
      stock: 18 + ((i * 9) % 75),
      rating: parseFloat((4.0 + ((i % 9) * 0.1)).toFixed(1)),
      reviewsCount: 60 + ((i * 31) % 1200),
      badge: badges[i % badges.length],
      deliverySpeed: deliveryOptions[(i * 3 + 3) % deliveryOptions.length],
      deliveryTime: deliveryOptions[(i * 3 + 3) % deliveryOptions.length],
      hsnCode: t.hsn,
      gstRate: 18,
      brand: t.brand,
      origin: 'India',
      warranty: '2 Years Manufacturer Brand Warranty',
      specifications: {
        'Brand': t.brand,
        'Category': 'Home & Kitchen',
        'Subcategory': t.subcategory,
        ...t.spec
      }
    });
  }
  return products;
}

// ==========================================
// 4. AYURVEDA & BEAUTY: 100 REAL PRODUCTS WITH SUBCATEGORIES
// ==========================================
function generateAyurvedaBeauty() {
  const templates = [
    {
      subcategory: 'Radiance Creams',
      brand: 'Forest Essentials',
      model: 'Soundarya Radiance Cream Infused with 24K Pure Gold Bhasma & Cow Ghee (50g)',
      price: 2999,
      mrp: 4800,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
      hsn: '33049910',
      spec: { actives: '24K Pure Gold Bhasma, Cow Ghee, Kashmiri Saffron', skinType: 'All Skin Types / Anti-Ageing Radiance', texture: 'Velvety Rich Whipped Cream', weight: '50g Luxury Jar' }
    },
    {
      subcategory: 'Radiance Creams',
      brand: 'Plum',
      model: 'Green Tea Oil-Free Daily Moisturizer with Niacinamide & Hyaluronic Acid (50ml)',
      price: 499,
      mrp: 750,
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80',
      hsn: '33049990',
      spec: { actives: 'Green Tea Extracts + 3% Niacinamide', benefit: 'Controls Acne & Hydrates Without Oiliness', vegan: '100% Vegan & Cruelty Free', volume: '50ml Pump' }
    },
    {
      subcategory: 'Facial Serums',
      brand: 'Kama Ayurveda',
      model: 'Kumkumadi Miraculous Ayurvedic Night Beauty Fluid Serum with Saffron (30ml)',
      price: 1999,
      mrp: 3200,
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&q=80',
      hsn: '33049930',
      spec: { formula: 'Classical Ayurvedic Ashtanga Hridaya Recipe', herbs: 'Kashmiri Saffron, Sandalwood, Indian Madder, Lotus', usage: '3-4 Drops Massaged at Bedtime', volume: '30ml UV Glass Dropper' }
    },
    {
      subcategory: 'Rosewater & Toners',
      brand: 'Forest Essentials',
      model: 'Pure Steam-Distilled Kannauj Desi Gulab Facial Water Tonic Mist (200ml)',
      price: 899,
      mrp: 1450,
      image: 'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&q=80',
      hsn: '33030010',
      spec: { sourcing: 'Selected Fragrant Kannauj Damask Rose Petals', method: 'Hydro-Steam Distillation in Traditional Deg-Bhapka', freeFrom: 'Alcohol, Parabens & Artificial Fragrance', volume: '200ml Spray Bottle' }
    },
    {
      subcategory: 'Ayurvedic Hair Oils',
      brand: 'Biotique',
      model: 'Bio Bhringraj Therapeutic Oil for Severe Hairfall Control & Follicle Care (200ml)',
      price: 449,
      mrp: 750,
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80',
      hsn: '33059011',
      spec: { ingredients: 'Pure Bhringraj, Amla, Brahmi, Cow Milk, Sesame Oil', therapy: 'Invigorates Scalp & Prevents Premature Greying', test: '100% Botanical Extracts Dermatologist Tested', volume: '200ml' }
    },
    {
      subcategory: 'Herbal Soaps',
      brand: 'Khadi Natural',
      model: 'Handmade Sandalwood & Wild Honey Herbal Bathing Bar (Family Pack of 3)',
      price: 349,
      mrp: 599,
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&q=80',
      hsn: '34011110',
      spec: { aroma: 'Pure Mysore Sandalwood Essential Oil', base: 'Cold Process Coconut Oil & Glycerin', benefit: 'Moisturizes & Relieves Prickly Heat', pack: '3 x 125g Bars' }
    },
    {
      subcategory: 'Chyawanprash & Immunity',
      brand: 'Dabur',
      model: 'Chyawanprash 2kg Double Immunity Health Booster with 40+ Rare Ayurvedic Herbs',
      price: 799,
      mrp: 1150,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
      hsn: '30049011',
      spec: { herbs: 'Amla (Indian Gooseberry), Ashwagandha, Pippali, Giloy', clinical: 'Clinically Proven 2X Infection Protection', dosage: '1 Tablespoon Daily with Warm Milk', weight: '2000g Family Tub' }
    }
  ];

  const products = [];
  for (let i = 0; i < 100; i++) {
    const t = templates[i % templates.length];
    const id = `prod-ayur-${String(i + 1).padStart(3, '0')}`;
    const variantNum = Math.floor(i / templates.length) + 1;
    const name = variantNum > 1 ? `${t.brand} ${t.model} (Botanical Edition ${variantNum})` : `${t.brand} ${t.model}`;
    const priceMod = (i % 4) * 30;
    const price = Math.round(t.price + priceMod);
    const mrp = Math.round(t.mrp + priceMod * 1.5);
    const discount = Math.round(((mrp - price) / mrp) * 100);

    products.push({
      _id: id,
      id,
      name,
      description: `Harness the pure healing wisdom of Ayurveda with ${name}. Made with sustainably harvested herbs, zero toxic chemicals, and certified by the Ministry of Ayush.`,
      price,
      mrp,
      discount,
      category: 'Ayurveda & Beauty',
      subcategory: t.subcategory,
      image: t.image,
      stock: 25 + ((i * 17) % 85),
      rating: parseFloat((4.3 + ((i % 6) * 0.1)).toFixed(1)),
      reviewsCount: 65 + ((i * 33) % 1100),
      badge: badges[i % badges.length],
      deliverySpeed: deliveryOptions[(i * 3 + 4) % deliveryOptions.length],
      deliveryTime: deliveryOptions[(i * 3 + 4) % deliveryOptions.length],
      hsnCode: t.hsn,
      gstRate: 12,
      brand: t.brand,
      origin: 'India',
      warranty: '100% Genuine Ayush Certified Guarantee',
      specifications: {
        'Brand': t.brand,
        'Category': 'Ayurveda & Beauty',
        'Subcategory': t.subcategory,
        ...t.spec
      }
    });
  }
  return products;
}

// ==========================================
// 5. DAILY GROCERIES: 100 REAL PRODUCTS WITH SUBCATEGORIES
// ==========================================
function generateDailyGroceries() {
  const templates = [
    {
      subcategory: 'Basmati Rice & Grains',
      brand: 'India Gate',
      model: 'Classic Aged Royal Basmati Rice (5kg Bag) - Longest Slender Grains',
      price: 899,
      mrp: 1250,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
      hsn: '10063020',
      spec: { grainLength: '8.5mm Extra Slender Pearl Grain', aging: 'Aged for 2+ Years in Climate Controlled Silos', aroma: 'Authentic Sweet Himalayan Aroma', weight: '5 kg Heavy Bag' }
    },
    {
      subcategory: 'Wheat Atta & Flours',
      brand: 'Aashirvaad',
      model: 'Shudh Chakki Fresh 100% Whole Wheat Atta with Natural Dietary Fiber (10kg)',
      price: 449,
      mrp: 575,
      image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&q=80',
      hsn: '11010000',
      spec: { grain: '100% MP Sehore Heavy Golden Wheat', milling: 'Traditional Slow Stone Chakki Cold Process', nutrition: 'High Fiber, 0% Added Maida or Starch', weight: '10 kg Pack' }
    },
    {
      subcategory: 'Pure Cow Desi Ghee',
      brand: 'Amul',
      model: 'Pure Cow Desi Ghee Traditional Bilona Churned (1 Litre Sealed Tin)',
      price: 699,
      mrp: 899,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
      hsn: '04059020',
      spec: { source: '100% Grass-Fed Pure Cow Milk Fat', texture: 'Golden Granular (Danedar) Consistency', health: 'Rich in Vitamin A, D & Natural Antioxidants', volume: '1000ml Food-Grade Tin' }
    },
    {
      subcategory: 'Cooking Oils',
      brand: 'Fortune',
      model: 'Sunlite Refined Pure Sunflower Cooking Oil with Vitamin A, D & E (5 Litre Can)',
      price: 749,
      mrp: 999,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80',
      hsn: '15121910',
      spec: { nutrition: 'Enriched with Vitamins A, D & E', absorption: 'Low Absorb Technology for Light Cooking', smokePoint: 'High Smoke Point Ideal for Deep Frying', volume: '5 Litres Easy-Pour Can' }
    },
    {
      subcategory: 'Tea & Chai Spices',
      brand: 'Tata Tea',
      model: 'Gold Rich Taste & Assam CTC Tea Granules with 15% Gently Rolled Long Leaves (1kg)',
      price: 549,
      mrp: 720,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80',
      hsn: '09023020',
      spec: { blend: 'CTC Granules Blended with 15% Long Leaves', origin: 'Selected Assam Valley Tea Gardens', liquor: 'Rich Kadak Amber Color with Aromatics', weight: '1000g Airtight Jar' }
    },
    {
      subcategory: 'Tea & Chai Spices',
      brand: 'Brooke Bond',
      model: 'Red Label Natural Care Chai with 5 Ayurvedic Herbs: Tulsi, Ashwagandha & Ginger (1kg)',
      price: 599,
      mrp: 799,
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&q=80',
      hsn: '09024020',
      spec: { herbs: 'Ashwagandha, Tulsi, Cardamom, Ginger & Mulethi', health: 'Clinically Proven to Enhance Everyday Immunity', weight: '1000g Zip Pouch', taste: 'Warm Spiced Kadak Chai' }
    },
    {
      subcategory: 'Dals & Pulses',
      brand: 'Tata Sampann',
      model: 'Unpolished High-Protein Toor / Arhar Dal (1kg Pouch)',
      price: 179,
      mrp: 240,
      image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=600&q=80',
      hsn: '07136000',
      spec: { processing: '100% Unpolished (No Water, Oil or Marble Polish)', protein: 'Rich in Dietary Fiber & 22g Plant Protein', purity: '5-Step Laser Sortex Cleaned', weight: '1 kg' }
    },
    {
      subcategory: 'Spices & Turmeric',
      brand: 'Everest',
      model: 'Shahi Garam Masala Hand-Pounded Royal Spice Blend (200g Box)',
      price: 129,
      mrp: 180,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
      hsn: '09109100',
      spec: { spices: 'Cardamom, Cinnamon, Cloves, Mace, Nutmeg, Star Anise', roasting: 'Slow Cold-Ground Whole Spices at Low Temp', purity: '0% Added Colors or Preservatives', weight: '200g Box' }
    },
    {
      subcategory: 'Spices & Turmeric',
      brand: '24 Mantra Organic',
      model: 'Organic Turmeric / Haldi Powder High Curcumin Certified (500g)',
      price: 159,
      mrp: 220,
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80',
      hsn: '09103030',
      spec: { curcumin: 'Guaranteed 3.5%+ Natural Curcumin', cert: '100% Certified Organic NPOP & USDA', process: 'Steam Sterilized & Pesticide Free', weight: '500g Zip Pouch' }
    },
    {
      subcategory: 'Dry Fruits & Nuts',
      brand: 'Haldirams',
      model: 'Special Roasted California Salted Almonds / Badam (500g Zip Lock)',
      price: 449,
      mrp: 699,
      image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=600&q=80',
      hsn: '08021200',
      spec: { grade: 'Jumbo Size 20/22 Nonpareil Almonds', roasting: 'Dry Roasted with Himalayan Pink Salt', packing: 'Nitrogen Flushed for Maximum Crunch', weight: '500g' }
    }
  ];

  const products = [];
  for (let i = 0; i < 100; i++) {
    const t = templates[i % templates.length];
    const id = `prod-groc-${String(i + 1).padStart(3, '0')}`;
    const variantNum = Math.floor(i / templates.length) + 1;
    const name = variantNum > 1 ? `${t.brand} ${t.model} (Pack ${variantNum})` : `${t.brand} ${t.model}`;
    const priceMod = (i % 4) * 15;
    const price = Math.round(t.price + priceMod);
    const mrp = Math.round(t.mrp + priceMod * 1.5);
    const discount = Math.round(((mrp - price) / mrp) * 100);

    products.push({
      _id: id,
      id,
      name,
      description: `Stock your pantry with farm-fresh purity. ${name} is sourced directly from certified farms across India, packed for maximum nutrition and freshness.`,
      price,
      mrp,
      discount,
      category: 'Daily Groceries',
      subcategory: t.subcategory,
      image: t.image,
      stock: 35 + ((i * 19) % 110),
      rating: parseFloat((4.4 + ((i % 5) * 0.1)).toFixed(1)),
      reviewsCount: 95 + ((i * 41) % 2100),
      badge: badges[i % badges.length],
      deliverySpeed: deliveryOptions[(i * 3 + 5) % deliveryOptions.length],
      deliveryTime: deliveryOptions[(i * 3 + 5) % deliveryOptions.length],
      hsnCode: t.hsn,
      gstRate: 5,
      brand: t.brand,
      origin: 'India',
      warranty: 'FSSAI Certified Freshness Guarantee',
      specifications: {
        'Brand': t.brand,
        'Category': 'Daily Groceries',
        'Subcategory': t.subcategory,
        ...t.spec
      }
    });
  }
  return products;
}

// Generate the complete catalog
const allProducts = [
  ...generateElectronics(),
  ...generateEthnicFashion(),
  ...generateHomeKitchen(),
  ...generateAyurvedaBeauty(),
  ...generateDailyGroceries()
];

console.log(`Generated ${allProducts.length} products with category and subcategory!`);

// Write to productsData.js
const productsDataPath = path.join(__dirname, '..', 'data', 'productsData.js');
const jsContent = `// Real Indian E-Commerce Product Catalog (500 Products across 5 Categories & Subcategories)
module.exports = ${JSON.stringify(allProducts, null, 2)};
`;
fs.writeFileSync(productsDataPath, jsContent, 'utf-8');
console.log(`Written to ${productsDataPath}`);

// Update data/store.json
const storePath = path.join(__dirname, '..', 'data', 'store.json');
let store = {};
if (fs.existsSync(storePath)) {
  try {
    store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
  } catch (e) {
    console.error('Error reading store.json, creating fresh', e);
  }
}
store.products = allProducts;
fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
console.log(`Updated ${storePath} with ${allProducts.length} authentic products.`);
