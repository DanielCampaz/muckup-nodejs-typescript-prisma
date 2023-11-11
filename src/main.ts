import express from 'express';

import exampleRoute from '@/routes/example.route';
import env from './utils/enviroments';

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  console.log('Someone Ping ' + new Date().toLocaleDateString());
  res.send('Pong');
});

app.use('/example', exampleRoute);

export function Main(): void {
  const PORT = env.EXPRESS_PORT;

  app.listen(PORT, () => {
    console.log(`Server Lisent to Port ${PORT}`);
  });
}

export default app;
