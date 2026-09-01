import express from 'express';
import http from 'http';
import cors from 'cors';
import { CONFIG } from './config.js';
import apiRoutes from './routes/api.routes.js';
import { initWebSocketServer } from './services/websocket.service.js';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'CONVEY X Telemetry Gateway',
    timestamp: new Date().toISOString(),
    version: '1.0.0-SIH2026'
  });
});

// Initialize Socket.IO Server
initWebSocketServer(server);

// Start HTTP & WebSocket Server
server.listen(CONFIG.PORT, () => {
  console.log(`==================================================`);
  console.log(` CONVEY X - Mining Conveyor Safety Platform API`);
  console.log(` Listening on port: ${CONFIG.PORT}`);
  console.log(` Mode: SIH DEMO SIMULATION & REALTIME TELEMETRY`);
  console.log(`==================================================`);
});
