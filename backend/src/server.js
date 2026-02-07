import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/index.js';
import connectDB from './config/database.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: config.cors.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    errorCode: 'RATE_LIMIT_EXCEEDED',
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});
app.use('/api', limiter);

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '..', config.upload.path)));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API EventHub',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

app.use(notFoundHandler);

app.use(errorHandler);

const PORT = config.port;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`
  ======================================================
  |                                                    |
  |   EventHub API Server                              |
  |                                                    |
  |   Mode: ${config.nodeEnv.padEnd(38)}|
  |   Port: ${String(PORT).padEnd(38)}|
  |   URL:  http://localhost:${String(PORT).padEnd(22)}|
  |                                                    |
  ======================================================
      `);
    });
  } catch (error) {
    console.error('Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();

export default app;
