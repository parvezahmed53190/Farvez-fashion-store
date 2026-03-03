import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const db = new Database('store.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    discount_price REAL,
    stock INTEGER DEFAULT 0,
    sku TEXT UNIQUE,
    category_id INTEGER,
    images TEXT, -- JSON array of image URLs
    variants TEXT, -- JSON array of variants (size, color)
    is_featured BOOLEAN DEFAULT 0,
    is_trending BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    customer_name TEXT,
    customer_email TEXT,
    phone TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'unpaid',
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    variant TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    variant TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

// Seed Admin User
const adminEmail = 'parvezahmed53190@gmail.com';
const adminPassword = '34996944';
const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);

if (!existingAdmin) {
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    'Admin User',
    adminEmail,
    hashedPassword,
    'admin'
  );
  console.log('Admin user seeded.');
}

// Seed some categories if empty
const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
if (categoryCount.count === 0) {
  const categories = [
    { name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Wallets', slug: 'wallets', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Panjabi', slug: 'panjabi', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1964&auto=format&fit=crop' },
  ];
  const insertCategory = db.prepare('INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)');
  categories.forEach(c => insertCategory.run(c.name, c.slug, c.image));
}

// Seed some products if empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (productCount.count === 0) {
  const products = [
    {
      name: 'Midnight Velvet Blazer',
      slug: 'midnight-velvet-blazer',
      description: 'A luxurious midnight blue velvet blazer with gold-toned buttons. Perfect for evening events.',
      price: 299,
      discount_price: 249,
      stock: 15,
      sku: 'MVB-001',
      category_id: 1, // Men
      images: JSON.stringify(['https://images.unsplash.com/photo-1594932224491-9944ef66bca3?q=80&w=1974&auto=format&fit=crop']),
      variants: JSON.stringify([{ size: 'M' }, { size: 'L' }, { size: 'XL' }]),
      is_featured: 1,
      is_trending: 1
    },
    {
      name: 'Silk Evening Gown',
      slug: 'silk-evening-gown',
      description: 'Flowing silk gown in emerald green. Elegant silhouette for formal occasions.',
      price: 450,
      discount_price: null,
      stock: 10,
      sku: 'SEG-002',
      category_id: 2, // Women
      images: JSON.stringify(['https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1908&auto=format&fit=crop']),
      variants: JSON.stringify([{ size: 'S' }, { size: 'M' }, { size: 'L' }]),
      is_featured: 1,
      is_trending: 0
    },
    {
      name: 'Gold-Plated Watch',
      slug: 'gold-plated-watch',
      description: 'Timeless design with 18k gold plating and sapphire crystal glass.',
      price: 599,
      discount_price: 499,
      stock: 5,
      sku: 'GPW-003',
      category_id: 3, // Accessories
      images: JSON.stringify(['https://images.unsplash.com/photo-1524592091214-8c97af1c0db4?q=80&w=1974&auto=format&fit=crop']),
      variants: JSON.stringify([]),
      is_featured: 1,
      is_trending: 1
    },
    {
      name: 'Leather Bifold Wallet',
      slug: 'leather-bifold-wallet',
      description: 'Handcrafted Italian leather wallet with multiple card slots and a sleek profile.',
      price: 89,
      discount_price: null,
      stock: 50,
      sku: 'LBW-004',
      category_id: 4, // Wallets
      images: JSON.stringify(['https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1974&auto=format&fit=crop']),
      variants: JSON.stringify([]),
      is_featured: 0,
      is_trending: 1
    },
    {
      name: 'Premium Cotton Panjabi',
      slug: 'premium-cotton-panjabi',
      description: 'Traditional Panjabi with modern embroidery details. Breathable premium cotton.',
      price: 120,
      discount_price: 99,
      stock: 30,
      sku: 'PCP-005',
      category_id: 5, // Panjabi
      images: JSON.stringify(['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1964&auto=format&fit=crop']),
      variants: JSON.stringify([{ size: '40' }, { size: '42' }, { size: '44' }]),
      is_featured: 1,
      is_trending: 0
    }
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (name, slug, description, price, discount_price, stock, sku, category_id, images, variants, is_featured, is_trending)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  products.forEach(p => {
    insertProduct.run(
      p.name, p.slug, p.description, p.price, p.discount_price, p.stock, p.sku, p.category_id, p.images, p.variants, p.is_featured, p.is_trending
    );
  });
}

// Seed some orders for stats if empty
const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
if (orderCount.count === 0) {
  const adminUser: any = db.prepare('SELECT id FROM users WHERE role = "admin"').get();
  if (adminUser) {
    const insertOrder = db.prepare(`
      INSERT INTO orders (user_id, customer_name, customer_email, phone, total_amount, status, payment_method, payment_status, shipping_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0] + ' 12:00:00';
      
      // Add 1-2 orders per day
      insertOrder.run(adminUser.id, 'Test Customer', 'test@example.com', '01700000000', 100 + (i * 50), 'delivered', 'cod', 'paid', 'Dhaka, Bangladesh', dateStr);
      if (i % 2 === 0) {
        insertOrder.run(adminUser.id, 'Another Customer', 'another@example.com', '01800000000', 200 + (i * 20), 'pending', 'cod', 'unpaid', 'Chittagong, Bangladesh', dateStr);
      }
    }
    console.log('Seed orders created.');
  }
}

export default db;
