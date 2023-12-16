import App from '@/app';
import ImportFilesRoute from './routes/files';
import UserRouter from './routes/user/userrouter.router';
import ImportStreamRoute from './routes/stream';
import StreamServer from './utils/stream_server/StreamServer';
import ImportAuthRoute from './routes/auth';

/* Endpoint de Entrada para Toda La aplicacion */
export function Main(init: boolean): void {
  const app = App.getInstance();

  /* Importamos Auth Routes */
  ImportAuthRoute((routeAuth) => {
    app.import(routeAuth);
  });

  /* Import Routes User */
  app.import(UserRouter.getInstance());

  // FIXME: Import Files Routes
  ImportFilesRoute((routeFile) => {
    app.import(routeFile);
  });

  // FIXME: Import Stream Routes
  ImportStreamRoute((routeStream) => {
    app.import(routeStream);
  });

  /* Importamos las Rutas del Stream */
  app.import(StreamServer.getRouter());

  /* Si "init" es false no se inicializa la App ya que lo utilizamos para Testearlo */
  if (init) {
    app.initialize();
  }
}
