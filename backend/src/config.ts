import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'conveyx-industrial-super-secret-key-sih2026',
  DEMO_MODE: process.env.DEMO_MODE !== 'false',
  SIMULATION_INTERVAL_MS: 1000,
};
