import express from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './src/db.js'; // Note: using .js because of ESM in node
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'farvez-fashion-secret-key-2026';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  // Middleware to verify JWT
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  };

  // --- Auth Routes ---
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword);
      const token = jwt.sign({ id: result.lastInsertRowid, email, role: 'user' }, JWT_SECRET);
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ user: { id: result.lastInsertRowid, name, email, role: 'user' }, token });
    } catch (err: any) {
      res.status(400).json({ error: err.message.includes('UNIQUE') ? 'Email already exists' : 'Registration failed' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  });

  app.get('/api/auth/me', authenticate, (req: any, res) => {
    const user: any = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });

  // --- Product Routes ---
  app.get('/api/products', (req, res) => {
    const { category, featured, trending, limit } = req.query;
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category) {
      conditions.push('c.slug = ?');
      params.push(category);
    }
    if (featured === 'true') conditions.push('p.is_featured = 1');
    if (trending === 'true') conditions.push('p.is_trending = 1');

    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY p.created_at DESC';
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit as string));
    }

    const products = db.prepare(query).all(...params);
    res.json(products.map((p: any) => ({ ...p, images: JSON.parse(p.images || '[]'), variants: JSON.parse(p.variants || '[]') })));
  });

  app.get('/api/products/:slug', (req, res) => {
    const product: any = db.prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?').get(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ ...product, images: JSON.parse(product.images || '[]'), variants: JSON.parse(product.variants || '[]') });
  });

  app.get('/api/categories', (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  });

  // --- Cart Routes ---
  app.get('/api/cart', authenticate, (req: any, res) => {
    const items = db.prepare(`
      SELECT ci.*, p.name, p.price, p.discount_price, p.images, p.slug 
      FROM cart_items ci 
      JOIN products p ON ci.product_id = p.id 
      WHERE ci.user_id = ?
    `).all(req.user.id);
    res.json(items.map((i: any) => ({ ...i, images: JSON.parse(i.images || '[]') })));
  });

  app.post('/api/cart', authenticate, (req: any, res) => {
    const { product_id, quantity, variant } = req.body;
    const existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND variant = ?').get(req.user.id, product_id, JSON.stringify(variant));
    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity || 1, (existing as any).id);
    } else {
      db.prepare('INSERT INTO cart_items (user_id, product_id, quantity, variant) VALUES (?, ?, ?, ?)').run(req.user.id, product_id, quantity || 1, JSON.stringify(variant));
    }
    res.json({ success: true });
  });

  app.delete('/api/cart/:id', authenticate, (req: any, res) => {
    db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ success: true });
  });

  // --- Order Routes ---
  app.post('/api/orders', authenticate, (req: any, res) => {
    const { customerName, customerEmail, phone, items, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    try {
      const transaction = db.transaction(() => {
        const orderResult = db.prepare(`
          INSERT INTO orders (user_id, customer_name, customer_email, phone, total_amount, shipping_address, payment_method)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(req.user.id, customerName, customerEmail, phone, totalAmount, shippingAddress, paymentMethod);

        const orderId = orderResult.lastInsertRowid;

        const insertItem = db.prepare(`
          INSERT INTO order_items (order_id, product_id, quantity, price, variant)
          VALUES (?, ?, ?, ?, ?)
        `);

        for (const item of items) {
          insertItem.run(orderId, item.product_id, item.quantity, item.price, JSON.stringify(item.variant));
          // Update stock
          db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.product_id);
        }

        // Clear cart
        db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);

        return orderId;
      });

      const orderId = transaction();
      res.json({ success: true, orderId });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/orders/me', authenticate, (req: any, res) => {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(orders);
  });

  // --- Admin Routes ---
  app.post('/api/admin/products', authenticate, isAdmin, (req, res) => {
    const { name, slug, description, price, discount_price, stock, sku, category_id, images, variants, is_featured, is_trending } = req.body;
    try {
      db.prepare(`
        INSERT INTO products (name, slug, description, price, discount_price, stock, sku, category_id, images, variants, is_featured, is_trending)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, slug, description, price, discount_price, stock, sku, category_id, JSON.stringify(images), JSON.stringify(variants), is_featured ? 1 : 0, is_trending ? 1 : 0);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/admin/stats', authenticate, isAdmin, (req, res) => {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
    const totalRevenue = db.prepare("SELECT SUM(total_amount) as sum FROM orders WHERE status != 'canceled'").get() as any;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'").get() as any;
    
    // Sales analytics for last 7 days
    const salesAnalytics = db.prepare(`
      SELECT date(created_at) as date, SUM(total_amount) as revenue
      FROM orders
      WHERE created_at >= date('now', '-7 days')
      GROUP BY date(created_at)
      ORDER BY date ASC
    `).all();

    res.json({
      orders: totalOrders.count,
      revenue: totalRevenue.sum || 0,
      products: totalProducts.count,
      users: totalUsers.count,
      salesAnalytics
    });
  });

  app.get('/api/admin/orders', authenticate, isAdmin, (req, res) => {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    res.json(orders);
  });

  app.patch('/api/admin/orders/:id/status', authenticate, isAdmin, (req, res) => {
    const { status, payment_status } = req.body;
    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (payment_status) {
      updates.push('payment_status = ?');
      params.push(payment_status);
    }

    if (updates.length === 0) return res.status(400).json({ error: 'No updates provided' });

    params.push(req.params.id);
    db.prepare(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => res.sendFile('dist/index.html', { root: '.' }));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
