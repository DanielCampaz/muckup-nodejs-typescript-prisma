import { Router } from 'express';

const exampleRoute = Router();

exampleRoute.get('/exampleroute', (_req, res) => {
  res.send('example Route');
});

export default exampleRoute;
