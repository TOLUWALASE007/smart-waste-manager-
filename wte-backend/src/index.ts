import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword, createToken } from "./utils/auth";
import { requireAuth } from "./middleware/auth";

const app: Express = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Test database connection (non-blocking)
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️  Continuing without database connection...');
  });

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ---------- AUTH ROUTES ----------

// Register admin (one-time, then login always)
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already used" });

  const hashed = await hashPassword(password);
  const user = await prisma.adminUser.create({ data: { email, password: hashed } });
  res.json({ id: user.id, email: user.email });
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = createToken(user.id);
  res.json({ token });
});

// ---------- PUBLIC ROUTES (Workers) ----------

// Get all sites (for worker form)
app.get("/api/sites", async (req, res) => {
  const sites = await prisma.site.findMany();
  res.json(sites);
});

// Submit waste report (workers)
app.post("/api/waste", async (req, res) => {
  const { siteId, wasteType, quantity, unit, notes, contactName, contactPhone } = req.body;
  
  if (!siteId || !wasteType || !quantity || !unit || !contactName || !contactPhone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const wasteReport = await prisma.wasteReport.create({
    data: {
      siteId: parseInt(siteId),
      wasteType,
      quantity: parseFloat(quantity),
      unit,
      notes,
      contactName,
      contactPhone,
    },
    include: { site: true },
  });

  res.json(wasteReport);
});

// ---------- PROTECTED ROUTES (Admins) ----------

// List waste reports (admin only)
app.get("/api/waste", requireAuth, async (req, res) => {
  const status = req.query.status as any;
  const where = status ? { status } : {};
  const items = await prisma.wasteReport.findMany({
    where,
    include: { site: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  res.json(items);
});

// Update status (admin only)
app.patch("/api/waste/:id/status", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const updated = await prisma.wasteReport.update({
    where: { id },
    data: { status },
    include: { site: true },
  });
  res.json(updated);
});

// Get waste report by ID (admin only)
app.get("/api/waste/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const wasteReport = await prisma.wasteReport.findUnique({
    where: { id },
    include: { site: true },
  });
  
  if (!wasteReport) {
    return res.status(404).json({ error: "Waste report not found" });
  }
  
  res.json(wasteReport);
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server with error handling
console.log('🚀 Starting WTE Backend server...');
console.log(`📊 Port: ${PORT}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

const server = app.listen(PORT, () => {
  console.log(`🚀 WTE Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API endpoints ready!`);
});

// Handle server errors
server.on('error', (error: any) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use`);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

export default app;
