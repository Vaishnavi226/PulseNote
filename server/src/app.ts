import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRoutes from './routes/healthRoutes';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

export const createApp = (): Application => {
  const app = express();

  // Security & Utility Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(morgan('dev'));
  app.use(express.json());

  // API Routes
  app.use('/api', healthRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
