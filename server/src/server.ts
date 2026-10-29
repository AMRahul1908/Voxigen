import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`✨ Voxigen Vedic Astrology API Server`);
    console.log(`🌌 Tagline: "Discover Your Cosmic Blueprint"`);
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    console.log(`✨ Provider: ${process.env.NAVAMSHA_API_KEY ? 'Navamsha API + Vedic Astronomy Engine' : 'Vedic Astronomy Engine (Lahiri Ayanamsha)'}`);
    console.log(`======================================================\n`);
  });

  const shutdown = () => {
    console.log('\n[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] Closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch(err => {
  console.error('[Server] Startup error:', err);
  process.exit(1);
});
