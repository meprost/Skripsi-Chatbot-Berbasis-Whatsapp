import env from '@/lib/env';
import app from '@/server';

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: `);
  console.error(err);

  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Unhandled Rejection Reason: ${reason}`);
  console.error(`Unhandled Rejection Promise: ${JSON.stringify(promise)}`);

  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Gracefully shutdown...');
  process.exit(0);
});

process.on('exit', (code) => {
  console.log(`Process exited with code ${code}`);
});

app.listen(env.PORT, () => {
  console.log(`App is up and running on http://localhost:${env.PORT}`);
});
