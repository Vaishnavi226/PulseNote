import { Request, Response } from 'express';

export const getHealth = (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'UP',
      service: 'PulseNote REST API',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
  });
};
