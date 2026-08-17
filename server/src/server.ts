import { createApp } from './app';
import { env } from './config/env';

const app = createApp();
const PORT = parseInt(env.PORT, 10) || 5000;

app.listen(PORT, () => {
  console.log(`PulseNote REST API Server running on port ${PORT} [${env.NODE_ENV}]`);
});
