import express from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './src/db.ts'; // Note: using .ts for tsx resolution
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

  const tryAuthenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
      } catch (err) {
        // Ignore invalid token for optional auth
      }
    }
    next();
  };

  // --- Notification Helper ---
  const createNotification = (type: string, title: string, message: string, link?: string) => {
    try {
      db.prepare('INSERT INTO notifications (type, title, message, link) VALUES (?, ?, ?, ?)').run(type, title, message, link || null);
    } catch (err) {
      console.error('Failed to create notification:', err);
    }
  };

  // --- Auth Routes ---
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword);
      
      // Notify admin about new user
      createNotification('user', 'New User Registered', `${name} (${email}) just joined Farvez Fashion Store.`, '/admin?tab=customers');

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
    const user: any = db.prepare('SELECT id, name, email, role, profile_photo, phone, address FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });

  // --- Product Routes ---
  app.get('/api/products', (req, res) => {
    const { category, featured, trending, limit, q, minPrice, maxPrice, color, size, sort } = req.query;
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
    const params: any[] = [];
    const conditions: string[] = [];

    if (category) {
      conditions.push('c.slug = ?');
      params.push(category);
    }
    if (q) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (featured === 'true') conditions.push('p.is_featured = 1');
    if (trending === 'true') conditions.push('p.is_trending = 1');
    
    if (minPrice) {
      conditions.push('p.price >= ?');
      params.push(parseFloat(minPrice as string));
    }
    if (maxPrice) {
      conditions.push('p.price <= ?');
      params.push(parseFloat(maxPrice as string));
    }
    if (color) {
      conditions.push('p.variants LIKE ?');
      params.push(`%${color}%`);
    }
    if (size) {
      conditions.push('p.variants LIKE ?');
      params.push(`%${size}%`);
    }

    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');

    // Sorting logic
    if (sort === 'price_asc') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'name_asc') {
      query += ' ORDER BY p.name ASC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }

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

  // --- Wishlist Routes ---
  app.get('/api/wishlist', authenticate, (req: any, res) => {
    const items = db.prepare(`
      SELECT w.id, w.product_id, p.name, p.price, p.discount_price, p.images, p.slug
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
    `).all(req.user.id);
    res.json(items.map((i: any) => ({ ...i, image: JSON.parse(i.images || '[]')[0] })));
  });

  app.post('/api/wishlist', authenticate, (req: any, res) => {
    const { product_id } = req.body;
    try {
      db.prepare('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)').run(req.user.id, product_id);
      res.json({ success: true });
    } catch (err: any) {
      if (err.message.includes('UNIQUE')) {
        return res.json({ success: true, message: 'Already in wishlist' });
      }
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/wishlist/:productId', authenticate, (req: any, res) => {
    db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?').run(req.user.id, req.params.productId);
    res.json({ success: true });
  });

  // --- Newsletter Route ---
  app.post('/api/newsletter/subscribe', (req, res) => {
    const { email } = req.body;
    try {
      db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(email);
      res.json({ success: true, message: 'Subscribed successfully' });
    } catch (err: any) {
      if (err.message.includes('UNIQUE')) {
        return res.json({ success: true, message: 'Already subscribed' });
      }
      res.status(400).json({ error: 'Subscription failed' });
    }
  });

  // --- Contact Routes ---
  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
      db.prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject, message);
      
      // Notify admin about new message
      createNotification('system', 'New Contact Message', `New inquiry from ${name} about "${subject}".`, '/admin?tab=support');
      
      res.json({ success: true, message: 'Message sent successfully' });
    } catch (err: any) {
      res.status(400).json({ error: 'Failed to send message' });
    }
  });

  // --- Order Routes ---
  app.post('/api/orders', tryAuthenticate, (req: any, res) => {
    const { customerName, customerEmail, phone, items, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    try {
      const transaction = db.transaction(() => {
        const orderResult = db.prepare(`
          INSERT INTO orders (user_id, customer_name, customer_email, phone, total_amount, shipping_address, payment_method)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(req.user?.id || null, customerName, customerEmail, phone, totalAmount, shippingAddress, paymentMethod);

        const orderId = orderResult.lastInsertRowid;

        const insertItem = db.prepare(`
          INSERT INTO order_items (order_id, product_id, quantity, price, variant)
          VALUES (?, ?, ?, ?, ?)
        `);

        for (const item of items) {
          insertItem.run(orderId, item.product_id, item.quantity, item.price, item.variant);
          // Update stock
          db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.product_id);
          
          // Check for low stock
          const product: any = db.prepare('SELECT name, stock FROM products WHERE id = ?').get(item.product_id);
          if (product && product.stock < 5) {
            createNotification('stock', 'Low Stock Alert', `Product "${product.name}" is running low on stock (${product.stock} left).`, '/admin?tab=products');
          }
        }

        // Clear cart if logged in
        if (req.user?.id) {
          db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
        }

        // Notify admin about new order
        const orderType = req.user ? 'Order' : 'Guest Order';
        createNotification('order', `New ${orderType} Received`, `${orderType} #${orderId} for $${totalAmount} has been placed by ${customerName}.`, '/admin?tab=orders');

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
    const { name, slug, description, price, discount_price, stock, sku, category_id, images, variants, is_featured, is_trending, video_url } = req.body;
    try {
      db.prepare(`
        INSERT INTO products (name, slug, description, price, discount_price, stock, sku, category_id, images, variants, is_featured, is_trending, video_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, slug, description, price, discount_price, stock, sku, category_id, JSON.stringify(images), JSON.stringify(variants), is_featured ? 1 : 0, is_trending ? 1 : 0, video_url || null);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/admin/products/:id', authenticate, isAdmin, (req, res) => {
    const { name, slug, description, price, discount_price, stock, sku, category_id, images, variants, is_featured, is_trending, video_url } = req.body;
    try {
      const updates = [];
      const params = [];

      if (name !== undefined) { updates.push('name = ?'); params.push(name); }
      if (slug !== undefined) { updates.push('slug = ?'); params.push(slug); }
      if (description !== undefined) { updates.push('description = ?'); params.push(description); }
      if (price !== undefined) { updates.push('price = ?'); params.push(price); }
      if (discount_price !== undefined) { updates.push('discount_price = ?'); params.push(discount_price); }
      if (stock !== undefined) { updates.push('stock = ?'); params.push(stock); }
      if (sku !== undefined) { updates.push('sku = ?'); params.push(sku); }
      if (category_id !== undefined) { updates.push('category_id = ?'); params.push(category_id); }
      if (images !== undefined) { updates.push('images = ?'); params.push(JSON.stringify(images)); }
      if (variants !== undefined) { updates.push('variants = ?'); params.push(JSON.stringify(variants)); }
      if (is_featured !== undefined) { updates.push('is_featured = ?'); params.push(is_featured ? 1 : 0); }
      if (is_trending !== undefined) { updates.push('is_trending = ?'); params.push(is_trending ? 1 : 0); }
      if (video_url !== undefined) { updates.push('video_url = ?'); params.push(video_url); }

      if (updates.length === 0) return res.status(400).json({ error: 'No updates provided' });

      params.push(req.params.id);
      db.prepare(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`).run(...params);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/products/:id', authenticate, isAdmin, (req, res) => {
    try {
      db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
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
    const pendingOrdersCount = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'").get() as any;
    
    // Recent orders
    const recentOrders = db.prepare(`
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o 
      ORDER BY created_at DESC 
      LIMIT 5
    `).all();

    // Sales analytics for last 7 days
    const salesAnalytics = db.prepare(`
      SELECT date(created_at) as date, SUM(total_amount) as revenue
      FROM orders
      WHERE created_at >= date('now', '-7 days')
      GROUP BY date(created_at)
      ORDER BY date ASC
    `).all();

    // Top selling products
    const topProducts = db.prepare(`
      SELECT p.id, p.name, SUM(oi.quantity) as total_sold, p.price, p.images
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 5
    `).all();

    res.json({
      orders: totalOrders.count,
      revenue: totalRevenue.sum || 0,
      products: totalProducts.count,
      users: totalUsers.count,
      pendingOrdersCount: pendingOrdersCount.count,
      recentOrders,
      salesAnalytics,
      topProducts
    });
  });

  app.get('/api/admin/orders', authenticate, isAdmin, (req, res) => {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all() as any[];
    const ordersWithItems = orders.map(order => {
      const items = db.prepare(`
        SELECT oi.*, p.name, p.images 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = ?
      `).all(order.id);
      return { 
        ...order, 
        items: items.map((item: any) => {
          let image = '';
          try {
            const imgs = JSON.parse(item.images || '[]');
            image = Array.isArray(imgs) ? imgs[0] : '';
          } catch (e) {
            image = '';
          }
          return { ...item, image };
        }) 
      };
    });
    res.json(ordersWithItems);
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

  // --- Admin Profile & Address Routes ---
  app.patch('/api/admin/profile', authenticate, isAdmin, (req: any, res) => {
    const { name, email, phone, address, profile_photo } = req.body;
    try {
      db.prepare(`
        UPDATE users 
        SET name = ?, email = ?, phone = ?, address = ?, profile_photo = ? 
        WHERE id = ?
      `).run(name, email, phone, address, profile_photo, req.user.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/admin/password', authenticate, isAdmin, (req: any, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
      const user: any = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
      if (!bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(401).json({ error: 'Current password incorrect' });
      }
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedNewPassword, req.user.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/admin/addresses', authenticate, isAdmin, (req: any, res) => {
    const addresses = db.prepare('SELECT * FROM user_addresses WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(addresses);
  });

  app.post('/api/admin/addresses', authenticate, isAdmin, (req: any, res) => {
    const { customer_name, address, city, zip, country, phone } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO user_addresses (user_id, customer_name, address, city, zip, country, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(req.user.id, customer_name, address, city, zip, country, phone);
      res.json({ id: result.lastInsertRowid, success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/admin/addresses/:id', authenticate, isAdmin, (req: any, res) => {
    const { customer_name, address, city, zip, country, phone } = req.body;
    try {
      db.prepare(`
        UPDATE user_addresses 
        SET customer_name = ?, address = ?, city = ?, zip = ?, country = ?, phone = ? 
        WHERE id = ? AND user_id = ?
      `).run(customer_name, address, city, zip, country, phone, req.params.id, req.user.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/admin/addresses/:id', authenticate, isAdmin, (req: any, res) => {
    db.prepare('DELETE FROM user_addresses WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ success: true });
  });

  // --- Notification Routes ---
  app.get('/api/admin/notifications', authenticate, isAdmin, (req, res) => {
    const notifications = db.prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50').all();
    res.json(notifications);
  });

  app.patch('/api/admin/notifications/:id/read', authenticate, isAdmin, (req, res) => {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.patch('/api/admin/notifications/read-all', authenticate, isAdmin, (req, res) => {
    db.prepare('UPDATE notifications SET is_read = 1').run();
    res.json({ success: true });
  });

  app.delete('/api/admin/notifications/:id', authenticate, isAdmin, (req, res) => {
    db.prepare('DELETE FROM notifications WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/admin/notifications', authenticate, isAdmin, (req, res) => {
    db.prepare('DELETE FROM notifications').run();
    res.json({ success: true });
  });

  app.get('/api/admin/users', authenticate, isAdmin, (req, res) => {
    const users = db.prepare(`
      SELECT u.id, u.name, u.email, u.role, u.phone, u.address, u.profile_photo, u.created_at,
        (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = u.id AND status != 'canceled') as total_spent,
        (SELECT MAX(created_at) FROM orders WHERE user_id = u.id) as last_order_at
      FROM users u 
      WHERE u.role = 'user' 
      ORDER BY u.created_at DESC
    `).all();
    res.json(users);
  });

  app.get('/api/admin/newsletter', authenticate, isAdmin, (req, res) => {
    const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC').all();
    res.json(subscribers);
  });

  app.delete('/api/admin/newsletter/:id', authenticate, isAdmin, (req, res) => {
    db.prepare('DELETE FROM newsletter_subscribers WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.get('/api/admin/messages', authenticate, isAdmin, (req, res) => {
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    res.json(messages);
  });

  app.patch('/api/admin/messages/:id/read', authenticate, isAdmin, (req, res) => {
    db.prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/admin/messages/:id', authenticate, isAdmin, (req, res) => {
    db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
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
