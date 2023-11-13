import App from '@/app';
import ExampleRouter from '@/routes/example/example.route';

export function Main(init: boolean): void {
  const app = App.getInstance();
  app.import(ExampleRouter.getInstance());
  if (init) app.initialize();
}
