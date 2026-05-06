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
    profile_photo TEXT,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Migration: Add columns if they don't exist (for existing databases)
  -- profile_photo
  -- phone
  -- address
`);

// Add columns individually if they don't exist
const tableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
const columns = tableInfo.map(c => c.name);

if (!columns.includes('profile_photo')) {
  db.exec("ALTER TABLE users ADD COLUMN profile_photo TEXT");
}
if (!columns.includes('phone')) {
  db.exec("ALTER TABLE users ADD COLUMN phone TEXT");
}
if (!columns.includes('address')) {
  db.exec("ALTER TABLE users ADD COLUMN address TEXT");
}

const productTableInfo = db.prepare("PRAGMA table_info(products)").all() as any[];
const productColumns = productTableInfo.map(c => c.name);
if (!productColumns.includes('video_url')) {
  db.exec("ALTER TABLE products ADD COLUMN video_url TEXT");
}

// Newsletter subscribers migration
const newsletterTableInfo = db.prepare("PRAGMA table_info(newsletter_subscribers)").all() as any[];
const newsletterColumns = newsletterTableInfo.map(c => c.name);
if (!newsletterColumns.includes('subscribed_at')) {
  db.exec("ALTER TABLE newsletter_subscribers ADD COLUMN subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS user_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    zip TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT NOT NULL,
    is_default BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
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
    address TEXT,
    product_name TEXT,
    size TEXT,
    color TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'Pending',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'unpaid',
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Migration: Capitalize statuses for existing orders
  UPDATE orders SET status = 'Pending' WHERE status = 'pending';
  UPDATE orders SET status = 'Confirmed' WHERE status = 'confirmed';
  UPDATE orders SET status = 'Processing' WHERE status = 'processing';
  UPDATE orders SET status = 'Shipped' WHERE status = 'shipped';
  UPDATE orders SET status = 'Delivered' WHERE status = 'delivered';
  UPDATE orders SET status = 'Canceled' WHERE status = 'canceled';

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

  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'order', 'user', 'stock', 'system'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Categories
const newCategories = [
  { name: "Men's Collection", slug: "mens-collection", image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop" },
  { name: "Women's Collection", slug: "womens-collection", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" },
  { name: "Kids' Wear", slug: "kids-wear", image: "https://images.unsplash.com/photo-1519704943920-18445840aba3?q=80&w=2070&auto=format&fit=crop" },
  { name: "New Arrivals", slug: "new-arrivals", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" },
  { name: "Best Sellers", slug: "best-sellers", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" },
  { name: "Festive/Eid Collection", slug: "festive-eid-collection", image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=1974&auto=format&fit=crop" },
  { name: "Sustainable Fashion", slug: "sustainable-fashion", image: "https://images.unsplash.com/photo-1544441893-675973e306bc?q=80&w=2070&auto=format&fit=crop" },
  { name: "Footwear", slug: "footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop" },
  { name: "Bags & Wallets", slug: "bags-wallets", image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=2070&auto=format&fit=crop" },
  { name: "Jewelry", slug: "jewelry", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop" },
  { name: "Fragrances", slug: "fragrances", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1922&auto=format&fit=crop" },
  { name: "Home Decor", slug: "home-decor", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop" }
];

for (const cat of newCategories) {
  const exists = db.prepare('SELECT id FROM categories WHERE slug = ?').get(cat.slug);
  if (!exists) {
    db.prepare('INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)').run(cat.name, cat.slug, cat.image);
  }
}

// Seed Admin User
const adminEmail = 'parvezahmed53190@gmail.com';
const adminPassword = '34996944';
const adminName = 'Farvez Ahmed';
const adminPhone = '+880 1934996944';

const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);

if (!existingAdmin) {
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);
  db.prepare('INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)').run(
    adminName,
    adminEmail,
    hashedPassword,
    'admin',
    adminPhone
  );
  console.log('Admin user seeded.');
} else {
  // Ensure existing admin has correct name and phone
  db.prepare('UPDATE users SET name = ?, phone = ? WHERE email = ?').run(adminName, adminPhone, adminEmail);
}

// Ensure Admin has the specific address
const adminRecord: any = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
if (adminRecord) {
  const addressExists = db.prepare('SELECT id FROM user_addresses WHERE user_id = ? AND address LIKE ?').get(adminRecord.id, '%Mominkhola%');
  if (!addressExists) {
    db.prepare(`
      INSERT INTO user_addresses (user_id, customer_name, address, city, zip, country, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(adminRecord.id, adminName, 'Mominkhola, Sylhet 3100, dakshin surma', 'Sylhet', '3100', 'Bangladesh', adminPhone);
    console.log('Admin address seeded.');
  }
}

export default db;
