import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AZERTY Studio database...');

  // 1. Clean existing records in dependency order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.stripeEvent.deleteMany();

  // 2. Seed Default Users
  console.log('Creating initial users...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@azertystudio.com',
      passwordHash: 'admin123', // In production, hashed with bcrypt/argon2
      name: 'Mihnea (Admin)',
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@azertystudio.com',
      passwordHash: 'customer123',
      name: 'Alex Gamer',
      role: Role.CUSTOMER,
    },
  });

  // 3. Seed 5 Categories
  console.log('Creating 5 categories...');
  const categoriesData = [
    {
      name: 'Keyboards',
      slug: 'keyboards',
      description: 'Complete mechanical keyboards, tuned and ready to type on straight out of the box.',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Cases',
      slug: 'cases',
      description: 'Precision CNC housings, acrylic shells, and premium wooden cases for custom keyboard builds.',
      imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Keycaps',
      slug: 'keycaps',
      description: 'Dye-sublimated PBT and double-shot ABS keycap sets across Cherry, OEM, KAT, and SA profiles.',
      imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Switches',
      slug: 'switches',
      description: 'Ultra-smooth linears, satisfying tactiles, and crisp clickies sold in packs of 35 or 70.',
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Custom coiled cables, switch pullers, ergonomic wrist rests, lube kits, and travel cases.',
      imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created.id;
  }

  // 4. Seed Exactly 35 Products (7 per Category)
  console.log('Creating 35 products (7 per category)...');
  const products = [
    // --- KEYBOARDS (7 products) ---
    {
      name: 'AZERTY Apex 75 Wireless',
      slug: 'azerty-apex-75-wireless',
      categoryId: categories['keyboards'],
      price: 18999, // €189.99
      stock: 14,
      lowStockThreshold: 5,
      isFeatured: true,
      description: 'Gasket-mounted 75% mechanical keyboard with CNC aluminium frame, tri-mode wireless (2.4G/Bluetooth/USB-C), hot-swap sockets, and pre-lubed stabilizer pack.',
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'],
      specs: {
        layout: '75%',
        connectivity: 'Tri-Mode (2.4GHz, Bluetooth 5.1, USB-C)',
        mount: 'Gasket Mount',
        hotswap: true,
        switches: 'Gateron Pro Yellow (Pre-lubed)',
        keycaps: 'Cherry Profile PBT Dye-Sub',
        weight: '1450g',
      },
    },
    {
      name: 'Stealth TKL Custom Board',
      slug: 'stealth-tkl-custom-board',
      categoryId: categories['keyboards'],
      price: 16999,
      stock: 8,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Understated matte black tenkeyless layout engineered for competitive esports and clean desk setups. Features sound-dampening silicone poron foam.',
      images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80'],
      specs: {
        layout: 'TKL (80%)',
        connectivity: 'Detachable USB-C (1000Hz Polling)',
        mount: 'Top Mount',
        hotswap: true,
        switches: 'Kailh Box Black',
        keycaps: 'Double-Shot PBT Shine-Through',
        weight: '1200g',
      },
    },
    {
      name: 'RetroClassic 65% Wooden Board',
      slug: 'retro-classic-65-wooden-board',
      categoryId: categories['keyboards'],
      price: 21999,
      stock: 4, // Low stock test
      lowStockThreshold: 5,
      isFeatured: true,
      description: 'Handcrafted solid walnut wood housing with brass weight bar and warm retro aesthetic. Brass plate yields deep, crisp typing acoustics.',
      images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'],
      specs: {
        layout: '65%',
        connectivity: 'USB-C Braided',
        mount: 'Tray Mount with O-Ring Dampening',
        hotswap: true,
        switches: 'Gateron Milky Yellow Pro',
        keycaps: 'SA Profile Cream Beige PBT',
        weight: '1350g',
      },
    },
    {
      name: 'Cyberpunk Neon 60 Compact',
      slug: 'cyberpunk-neon-60-compact',
      categoryId: categories['keyboards'],
      price: 13999,
      stock: 19,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Compact 60% form factor built inside a translucent frosted acrylic housing with per-key south-facing RGB and underglow lighting.',
      images: ['https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=80'],
      specs: {
        layout: '60%',
        connectivity: 'USB-C',
        mount: 'Integrated Plate Mount',
        hotswap: true,
        switches: 'Gateron G Pro Red',
        keycaps: 'OEM Profile Translucent Pudding',
        weight: '850g',
      },
    },
    {
      name: 'Studio Master 100 Full-Size',
      slug: 'studio-master-100-full-size',
      categoryId: categories['keyboards'],
      price: 23999,
      stock: 11,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Full-size 104-key board equipped with a rotary encoder knob, dedicated media controls, and silent tactile switches ideal for quiet office environments.',
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'],
      specs: {
        layout: '100% (104 keys)',
        connectivity: 'USB-C & Bluetooth 5.0 Dual Mode',
        mount: 'Gasket Mount',
        hotswap: true,
        switches: 'Outemu Silent Peach Linear',
        keycaps: 'Cherry Profile Minimalist Gray',
        weight: '1680g',
      },
    },
    {
      name: 'Valkyrie Hall Effect Rapid-Trigger 65',
      slug: 'valkyrie-hall-effect-rapid-trigger-65',
      categoryId: categories['keyboards'],
      price: 24999,
      stock: 2, // Low stock test
      lowStockThreshold: 5,
      isFeatured: true,
      description: 'Magnetic Hall Effect switches offering adjustable actuation from 0.1mm to 4.0mm and instantaneous rapid-trigger reset for maximum FPS responsiveness.',
      images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80'],
      specs: {
        layout: '65%',
        connectivity: 'Ultra-low latency USB-C (8000Hz)',
        mount: 'Aluminium Plate Mount',
        hotswap: true,
        switches: 'Gateron Magnetic Jade (Hall Effect)',
        keycaps: 'Dye-Sub PBT Blackout',
        weight: '1100g',
      },
    },
    {
      name: 'Macaron Pastel 68 Hot-Swap',
      slug: 'macaron-pastel-68-hot-swap',
      categoryId: categories['keyboards'],
      price: 12999,
      stock: 15,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Pleasant pastel mint and lavender aesthetic with factory-tuned stabs, high-density plate foam, and quiet linear switches for everyday typing.',
      images: ['https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=80'],
      specs: {
        layout: '68%',
        connectivity: 'USB-C Detachable',
        mount: 'Tray Mount',
        hotswap: true,
        switches: 'Akko Matcha Green Linear',
        keycaps: 'XDA Profile Pastel Dye-Sub',
        weight: '920g',
      },
    },

    // --- CASES (7 products) ---
    {
      name: 'Anodized CNC Aluminium 75 Case',
      slug: 'anodized-cnc-aluminium-75-case',
      categoryId: categories['cases'],
      price: 11999,
      stock: 12,
      lowStockThreshold: 5,
      isFeatured: true,
      description: 'Aerospace-grade 6063 CNC aluminium casing with chamfered edges, sandblasted finish, and integrated brass internal weight.',
      images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'],
      specs: {
        compatibility: 'Standard 75% PCBs (KBD75, GMMK Pro format)',
        material: '6063 Anodized Aluminium',
        typingAngle: '7 degrees',
        weight: '1200g',
        color: 'Space Gray',
      },
    },
    {
      name: 'Frosted Acrylic 60 Shell Case',
      slug: 'frosted-acrylic-60-shell-case',
      categoryId: categories['cases'],
      price: 4999,
      stock: 22,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'CNC cut frosted acrylic casing designed to evenly diffuse PCB underglow lighting into a soft, immersive desk glow.',
      images: ['https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=80'],
      specs: {
        compatibility: 'GH60, DZ60, standard 60% PCBs',
        material: 'Matte Frosted Acrylic',
        typingAngle: '5 degrees',
        weight: '480g',
        color: 'Frosted White',
      },
    },
    {
      name: 'Solid Walnut Wood 65 Case',
      slug: 'solid-walnut-wood-65-case',
      categoryId: categories['cases'],
      price: 7499,
      stock: 6,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Natural North American walnut carved with precision CNC routers, finished with organic tung oil to highlight natural wood grains.',
      images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'],
      specs: {
        compatibility: 'Tada68, KBD67 rev2, standard 65% PCBs',
        material: 'American Walnut Hardwood',
        typingAngle: '6 degrees',
        weight: '620g',
        color: 'Natural Dark Walnut',
      },
    },
    {
      name: 'Polycarbonate Smoky TKL Housing',
      slug: 'polycarbonate-smoky-tkl-housing',
      categoryId: categories['cases'],
      price: 8999,
      stock: 9,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Smoky semi-transparent polycarbonate shell offering a deep, bass-heavy acoustic signature and durable impact resistance.',
      images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80'],
      specs: {
        compatibility: 'Standard 87-key TKL PCBs',
        material: 'Molded Polycarbonate',
        typingAngle: '6.5 degrees',
        weight: '750g',
        color: 'Smoky Translucent Black',
      },
    },
    {
      name: 'Heavy Brass Ingot 60 Case',
      slug: 'heavy-brass-ingot-60-case',
      categoryId: categories['cases'],
      price: 15999,
      stock: 3, // Low stock test
      lowStockThreshold: 5,
      isFeatured: true,
      description: 'Solid machined brass casing weighing over 2.1kg for zero desk sliding and a dense, resonance-free acoustic profile.',
      images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'],
      specs: {
        compatibility: 'Standard 60% GH60 mounting',
        material: 'Solid PVD Coated Brass',
        typingAngle: '8 degrees',
        weight: '2150g',
        color: 'PVD Mirror Gold',
      },
    },
    {
      name: 'Gasket-Mount Carbon Fiber 75 Housing',
      slug: 'gasket-mount-carbon-fiber-75-housing',
      categoryId: categories['cases'],
      price: 13499,
      stock: 7,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Real 3K twill carbon fiber upper frame with sound-absorbing silicone gasket strips and anodized aluminium base.',
      images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'],
      specs: {
        compatibility: '75% Gasket-mount PCBs',
        material: '3K Carbon Fiber + Aluminium Base',
        typingAngle: '7 degrees',
        weight: '980g',
        color: 'Matte Carbon Weave',
      },
    },
    {
      name: 'Retro Classic Beige ABS Case 60',
      slug: 'retro-classic-beige-abs-case-60',
      categoryId: categories['cases'],
      price: 3499,
      stock: 25,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Thick injection-molded retro beige ABS plastic shell reminiscent of vintage IBM Model M terminal computers.',
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'],
      specs: {
        compatibility: 'GH60 / Poker mounting holes',
        material: 'Reinforced ABS Plastic',
        typingAngle: '5 degrees',
        weight: '380g',
        color: 'Industrial Vintage Beige',
      },
    },

    // --- KEYCAPS (7 products) ---
    {
      name: 'AZERTY Studio Botanical PBT Keycaps',
      slug: 'azerty-studio-botanical-pbt-keycaps',
      categoryId: categories['keycaps'],
      price: 5999,
      stock: 18,
      lowStockThreshold: 5,
      isFeatured: true,
      description: 'Earthy forest sage and deep green dye-sublimated PBT set with crisp legends and lush succulent novelty accents.',
      images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'],
      specs: {
        profile: 'Cherry Profile',
        material: '1.5mm PBT Plastic',
        process: 'Dye-Sublimation',
        keysCount: 142,
        compatibility: 'ISO & ANSI (60%, 65%, 75%, TKL, Full-size)',
      },
    },
    {
      name: 'Midnight Navy Double-Shot ABS Keycaps',
      slug: 'midnight-navy-double-shot-abs-keycaps',
      categoryId: categories['keycaps'],
      price: 7999,
      stock: 10,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Deep midnight blue with golden yellow legends. Double-shot ABS injection ensures razor-sharp legend clarity and crisp acoustic clack.',
      images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'],
      specs: {
        profile: 'Cherry Profile',
        material: 'Double-Shot ABS',
        process: 'Double-Shot Injection',
        keysCount: 156,
        compatibility: 'Full ISO-UK / ANSI layout coverage',
      },
    },
    {
      name: 'KAT Profile Monochrome Minimal Keycaps',
      slug: 'kat-profile-monochrome-minimal-keycaps',
      categoryId: categories['keycaps'],
      price: 6499,
      stock: 5, // At threshold
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Smooth spherical KAT profile keycaps in pure contrast black and white with high-durability thick PBT construction.',
      images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'],
      specs: {
        profile: 'KAT Profile (Spherical sculpted)',
        material: '1.6mm Ultra-thick PBT',
        process: 'Reverse Dye-Sublimation',
        keysCount: 138,
        compatibility: '60%, 65%, 75%, TKL',
      },
    },
    {
      name: 'SA Retro 1984 High-Profile Keycaps',
      slug: 'sa-retro-1984-high-profile-keycaps',
      categoryId: categories['keycaps'],
      price: 8499,
      stock: 3, // Low stock test
      lowStockThreshold: 5,
      isFeatured: true,
      description: 'Tall vintage SA sculpted profile with deep spherical finger cups, classic off-white and burnt orange colorway.',
      images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'],
      specs: {
        profile: 'SA Sculpted (1-1-2-3-4-3)',
        material: 'ABS Double-Shot',
        process: 'High-Pressure Double-Shot',
        keysCount: 165,
        compatibility: 'All standard layouts including Alice/Split Space',
      },
    },
    {
      name: 'MOA Honey & Milk Pastel PBT Keycaps',
      slug: 'moa-honey-milk-pastel-pbt-keycaps',
      categoryId: categories['keycaps'],
      price: 4499,
      stock: 20,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Cute uniform height MOA profile keycaps featuring rounded edges, cute mascot novelties, and soft milk yellow accents.',
      images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'],
      specs: {
        profile: 'MOA Uniform Profile',
        material: 'Dye-Sub PBT',
        process: 'Thermal 5-Sided Dye-Sub',
        keysCount: 140,
        compatibility: '60%, 65%, 75%, 96%, Full-size',
      },
    },
    {
      name: 'Cyber Neon Purple Shine-Through Keycaps',
      slug: 'cyber-neon-purple-shine-through-keycaps',
      categoryId: categories['keycaps'],
      price: 3999,
      stock: 14,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Backlit shine-through legends optimized for south-facing and north-facing RGB LEDs in vivid neon purple and cyan.',
      images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'],
      specs: {
        profile: 'OEM Profile',
        material: 'Double-Shot PBT',
        process: 'Double-Shot Shine-Through',
        keysCount: 128,
        compatibility: 'Standard ANSI keyboards',
      },
    },
    {
      name: 'CNC Aluminium Artisan Keycap - Esc Key',
      slug: 'cnc-aluminium-artisan-keycap-esc-key',
      categoryId: categories['keycaps'],
      price: 2999,
      stock: 7,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Solid anodized aviation aluminium R4 escape keycap with enamel filled AZERTY Studio monogram logo.',
      images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'],
      specs: {
        profile: 'Cherry R4 / OEM R4',
        material: 'CNC Anodized Aluminium',
        process: 'Laser Engraved & Hand Enamelled',
        keysCount: 1,
        compatibility: 'Standard MX stem switches',
      },
    },

    // --- SWITCHES (7 products) ---
    {
      name: 'Gateron Oil King Linear (Pack of 70)',
      slug: 'gateron-oil-king-linear-pack-of-70',
      categoryId: categories['switches'],
      price: 4899,
      stock: 30,
      lowStockThreshold: 5,
      isFeatured: true,
      description: 'Legendary factory-lubed deep sounding linear switch. Features an all-black nylon housing and POM stem for butter-smooth travel.',
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'],
      specs: {
        type: 'Linear',
        actuationForce: '55g',
        bottomOutForce: '65g',
        preTravel: '2.0mm',
        totalTravel: '4.0mm',
        pins: '5-Pin PCB Mount',
        factoryLubed: true,
      },
    },
    {
      name: 'Boba U4T Thocky Tactile (Pack of 70)',
      slug: 'boba-u4t-thocky-tactile-pack-of-70',
      categoryId: categories['switches'],
      price: 5299,
      stock: 4, // Low stock test
      lowStockThreshold: 5,
      isFeatured: true,
      description: 'Famous for its pronounced D-shaped tactile bump with zero pre-travel and deep, resonant thocky bottom-out sound.',
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'],
      specs: {
        type: 'Tactile',
        actuationForce: '62g',
        bottomOutForce: '68g',
        preTravel: '0.0mm (Bump starts at top)',
        totalTravel: '4.0mm',
        pins: '5-Pin PCB Mount',
        factoryLubed: false,
      },
    },
    {
      name: 'Kailh Box White V2 Clicky (Pack of 70)',
      slug: 'kailh-box-white-v2-clicky-pack-of-70',
      categoryId: categories['switches'],
      price: 3699,
      stock: 16,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Patented click-bar mechanism generating a crisp, double click on downstroke and upstroke with IP56 dust and moisture resistance.',
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'],
      specs: {
        type: 'Clicky (Click Bar)',
        actuationForce: '45g',
        bottomOutForce: '50g',
        preTravel: '1.8mm',
        totalTravel: '3.6mm',
        pins: '3-Pin / 5-Pin compatible',
        factoryLubed: true,
      },
    },
    {
      name: 'Tangerine 62g Smooth Linear (Pack of 70)',
      slug: 'tangerine-62g-smooth-linear-pack-of-70',
      categoryId: categories['switches'],
      price: 4999,
      stock: 8,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'C3 Equalz signature UHMWPE housing for unmatched ultra-low friction travel and vibrant translucent orange aesthetic.',
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'],
      specs: {
        type: 'Linear',
        actuationForce: '62g (Gold-plated spring)',
        bottomOutForce: '67g',
        preTravel: '2.0mm',
        totalTravel: '4.0mm',
        pins: '5-Pin PCB Mount',
        factoryLubed: true,
      },
    },
    {
      name: 'Durock T1 Shrimp Silent Tactile (Pack of 70)',
      slug: 'durock-t1-shrimp-silent-tactile-pack-of-70',
      categoryId: categories['switches'],
      price: 5499,
      stock: 12,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Silent tactile switch with silicone dampening pads on the stem rails, delivering strong tactility with whisper-quiet office acoustics.',
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'],
      specs: {
        type: 'Silent Tactile',
        actuationForce: '67g',
        bottomOutForce: '67g',
        preTravel: '2.0mm',
        totalTravel: '3.8mm',
        pins: '5-Pin PCB Mount',
        factoryLubed: true,
      },
    },
    {
      name: 'Akko CS Lavender Purple (Pack of 70)',
      slug: 'akko-cs-lavender-purple-pack-of-70',
      categoryId: categories['switches'],
      price: 2799,
      stock: 24,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Budget-friendly tactile switch with an early tactile bump and progressive extension spring for responsive bounce-back.',
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'],
      specs: {
        type: 'Tactile',
        actuationForce: '36g',
        bottomOutForce: '50g',
        preTravel: '1.9mm',
        totalTravel: '4.0mm',
        pins: '3-Pin Plate Mount',
        factoryLubed: false,
      },
    },
    {
      name: 'Cherry MX Black Hyperglide (Pack of 70)',
      slug: 'cherry-mx-black-hyperglide-pack-of-70',
      categoryId: categories['switches'],
      price: 3999,
      stock: 15,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'The definitive standard for heavy linears. The Hyperglide tooling doubles the operational lifespan to 100 million keystrokes.',
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'],
      specs: {
        type: 'Heavy Linear',
        actuationForce: '60g',
        bottomOutForce: '80g',
        preTravel: '2.0mm',
        totalTravel: '4.0mm',
        pins: '5-Pin PCB Mount',
        factoryLubed: false,
      },
    },

    // --- ACCESSORIES (7 products) ---
    {
      name: 'Custom Coiled Aviator Cable (USB-C)',
      slug: 'custom-coiled-aviator-cable-usb-c',
      categoryId: categories['accessories'],
      price: 3499,
      stock: 20,
      lowStockThreshold: 5,
      isFeatured: true,
      description: 'Double-sleeved with Techflex and Paracord, tight 15cm heat-reversed coil, and heavy-duty 4-pin GX16 metal aviator connector.',
      images: ['https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80'],
      specs: {
        connector: 'USB-A to USB-C',
        coilLength: '15cm (6 inches)',
        straightLength: '1.2m',
        aviator: 'GX16 4-Pin Silver',
        sheathing: 'PET Techflex + Paracord',
      },
    },
    {
      name: 'Ergonomic Solid Walnut Wrist Rest (75% / TKL)',
      slug: 'ergonomic-solid-walnut-wrist-rest',
      categoryId: categories['accessories'],
      price: 2899,
      stock: 15,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Slope-beveled solid walnut wood wrist rest with non-slip silicone anti-skid rubber feet. Prevents wrist fatigue during long sessions.',
      images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'],
      specs: {
        dimensions: '320mm x 80mm x 18mm',
        material: 'Solid Walnut Wood',
        finish: 'Matte Natural Oil',
        feet: 'Anti-slip rubber feet included',
      },
    },
    {
      name: '2-in-1 Keycap & Switch Puller Tool',
      slug: '2-in-1-keycap-and-switch-puller-tool',
      categoryId: categories['accessories'],
      price: 1199,
      stock: 45,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Dual-ended stainless steel wire keycap puller and precision switch clip extractor. Prevents scratching keycaps or housing clips.',
      images: ['https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80'],
      specs: {
        material: 'Stainless Steel & ABS Grip',
        length: '16.5cm',
        compatibility: 'All MX-style switches and keycaps',
      },
    },
    {
      name: 'Krytox 205g0 Switch Lubricant Kit (5ml)',
      slug: 'krytox-205g0-switch-lubricant-kit',
      categoryId: categories['accessories'],
      price: 1999,
      stock: 28,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Genuine Krytox GPL 205 Grade 0 lubricant in leak-proof jar, accompanied by two fine nylon detail brushes and stem pick.',
      images: ['https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80'],
      specs: {
        volume: '5ml (Lubes ~150-200 switches)',
        viscosity: 'Grade 0 Grease',
        includes: 'Jar, 2x Brushes, Precision Stem Claw',
      },
    },
    {
      name: 'Hard-Shell Keyboard Travel Carry Case',
      slug: 'hard-shell-keyboard-travel-carry-case',
      categoryId: categories['accessories'],
      price: 3299,
      stock: 10,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Water-resistant EVA hard-shell carrying case with plush velvet lining, internal cable mesh pouch, and elastic retaining straps.',
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'],
      specs: {
        fit: 'Up to 75% / 65% keyboards (33cm x 15cm x 5cm)',
        material: 'Molded EVA + 600D Oxford Cloth',
        closure: 'Dual Heavy-Duty Zippers',
      },
    },
    {
      name: 'Minimalist Felt Desk Mat XXL (900x400mm)',
      slug: 'minimalist-felt-desk-mat-xxl',
      categoryId: categories['accessories'],
      price: 2499,
      stock: 18,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Large surface wool-blend felt desk pad providing soft acoustic dampening under the keyboard and a comfortable warm arm rest.',
      images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80'],
      specs: {
        size: '900mm x 400mm x 3mm',
        material: 'Premium Wool Blend Felt',
        backing: 'Rubberized Anti-Slip Grip Dots',
        color: 'Dark Charcoal Gray',
      },
    },
    {
      name: 'CNC Aluminium MX Switch Opener',
      slug: 'cnc-aluminium-mx-switch-opener',
      categoryId: categories['accessories'],
      price: 1599,
      stock: 35,
      lowStockThreshold: 5,
      isFeatured: false,
      description: 'Magnetic 2-in-1 switch opener compatible with Cherry MX 4-clip switches and Kailh 2-latch switches in seconds.',
      images: ['https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80'],
      specs: {
        compatibility: 'Cherry MX, Gateron, Kailh Box, Outemu',
        material: 'CNC Anodized Aluminium with Neodymium Magnets',
        color: 'Titanium Gray',
      },
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seeding completed successfully!');
  console.log(`Summary:`);
  console.log(`- 2 Users (1 Admin, 1 Customer)`);
  console.log(`- 5 Categories`);
  console.log(`- 35 Products (7 per Category)`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
