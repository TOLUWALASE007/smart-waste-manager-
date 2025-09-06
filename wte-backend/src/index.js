const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: "WTE Backend is running!"
  });
});

// Simple test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Mock data endpoints for frontend
app.get("/api/sites", (req, res) => {
  res.json([
    { id: 1, name: "Cassava Processing Site" },
    { id: 2, name: "Livestock Processing Site" }
  ]);
});

// Mock waste reports endpoint
app.get("/api/waste", (req, res) => {
  res.json([
    {
      id: 1,
      wasteType: "Cassava peels",
      quantity: 50,
      unit: "kg",
      status: "REPORTED",
      contactName: "John Doe",
      contactPhone: "1234567890",
      notes: "Sample waste report",
      createdAt: new Date().toISOString(),
      site: { id: 1, name: "Cassava Processing Site" }
    }
  ]);
});

// Mock waste submission endpoint
app.post("/api/waste", (req, res) => {
  console.log("Waste submission received:", req.body);
  res.json({ 
    success: true, 
    message: "Waste report submitted successfully!",
    id: Math.floor(Math.random() * 1000)
  });
});

// Mock auth endpoints
app.post("/api/auth/register", (req, res) => {
  console.log("Registration attempt:", req.body);
  res.json({ 
    success: true, 
    message: "Account created successfully!",
    id: Math.floor(Math.random() * 1000)
  });
});

app.post("/api/auth/login", (req, res) => {
  console.log("Login attempt:", req.body);
  res.json({ 
    success: true, 
    token: "mock-jwt-token-" + Math.random().toString(36).substr(2, 9)
  });
});

// Mock status update endpoint
app.patch("/api/waste/:id/status", (req, res) => {
  console.log("Status update:", req.params.id, req.body);
  res.json({ 
    success: true, 
    message: "Status updated successfully!",
    id: req.params.id,
    status: req.body.status
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
console.log('🚀 Starting WTE Backend server...');
console.log(`📊 Port: ${PORT}`);

const server = app.listen(PORT, () => {
  console.log(`🚀 WTE Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API endpoints ready!`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use`);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;
