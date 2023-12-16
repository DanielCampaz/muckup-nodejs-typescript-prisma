/*
  Los Tipos de Node Media Server No Funcionan Correctamente Asi que se desarrollo un archivo de Tipos para NMS en la direccion
  FIXME: Es necesario nombrarlo .d.ts para que en la compilacion no se tome encuenta 
  ./src/types/node-media-server.d.ts
*/
import NodeMediaServer, {
  type ArgsPlayEvent,
  type ArgsConnectDonePlayEvent,
  type EventFunctionFnC,
  type EventFunctionFnS,
  type NodeRtmpSession
} from 'node-media-server';
import StreamRouter from './StreamRouter';
import { config } from './config';
import { getUrlStream, seprStreamKey, verifyStructur } from './utils';
import StreamUrlDataBase from '@/db/streamUrl/streamUrl.db';
import UrlComDatabase from '@/db/urlCom/urlCom.db';
import { type StreamUrl } from '@prisma/client';
import CONSTS from '../consts';
import { VerifyIDStream, VerifyIDUserAdmin } from '../functions';

/*
    FIXME: Links Generate Functionals

    FIXME: Node Media Server une los dos primeros parametros del link de transmision rtpm si el link es este 
    "rtmp://localhost/live/example" y la contrasena es esta "1234"
    se recibira lo siguiente "/liveexample/1234" mas esto es nuevo en el codigo asi que el programa tambien recibira "/live/example/1234" por si en algun momento lo 
    llegan a corregir en el codigo 

    Por ende los links de acceso quedarian asi 
    http://localhost:8000/liveexample/1234.flv
    rtmp://localhost/liveexample/1234
    http://localhost:8000/liveexample/1234/index.m3u8
    http://localhost:8000/liveexample/1234/index.mpd

    En este caso se habilito seguridad por Querys asi que la url termina siendo esta
    http://localhost:8000/liveexample/1234.flv?auth=AUTH_KEY
    rtmp://localhost/liveexample/1234?auth=AUTH_KEY
    http://localhost:8000/liveexample/1234/index.m3u8?auth=AUTH_KEY
    http://localhost:8000/liveexample/1234/index.mpd?auth=AUTH_KEY

    FIXME: Como se Constituciona el Url RTMP para conexion de servidor 
    "rtmp://localhost/live/1234_5678"
    "rtmp://<url-servidor>/<name-app-en-config>/<idStream>_<idUser>"
    y la contrasena elegida en ese Momento <9512>

    FIXME: Como LLega el link de conexion
    "rtmp://localhost/live1234_5678/9512"
    "rtmp://stream.example.com/live1234_5678/9512"
    "rtmp://<url-servidor><name-app-en-config>/<idStream>_<idUser>/<contrasena>"

    FIXME: Link de conexion y vizualicacion del Stream Ejemplos

    FLV Connection: http://localhost:8000/live1234_5678/9512.flv?auth=KEY
    FLV Connection: http://stream.example.com/live1234_5678/9512.flv?auth=KEY
    RTMPLink: rtmp://localhost/live/1234_5678
    RTMPLink: rtmp://stream.example.com/live/1234_5678
    RTMPPassword 9512

    FIXME: Para conectamer a la Api en stream y server para obtener la informacion se debe envia el Username y la Password de la siguente manera:

    const username = 'admin';
    const password = '1234';
    const url = '<ruta-api>/api/stream';

    // Codifica el nombre de usuario y contraseña en base64
    const base64Credentials = btoa(`${username}:${password}`);

    // Realiza una solicitud con la autorización básica
    fetch(url, {
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
      },
    })

*/

/*
  Clase Stream Server que ayuda a la conexion y acoplacion con la estructura del proyecto

  FIXME: Utilizamos la el retorno de funciones por si se necesita enviar algo necesario que no se lea durante la ejecucion por falla de contexto
*/
export default class StreamServer {
  static instance: StreamServer | null = null;
  private readonly nms: NodeMediaServer;
  private constructor() {
    this.nms = new NodeMediaServer(config);
    this.importEvents();
  }

  private importEvents(): void {
    /* Todos los eventos Relacionados con Node Media Server */
    this.nms.on('preConnect', this.ConnectEvents('preConnect'));
    this.nms.on('postConnect', this.ConnectEvents('postConnect'));
    this.nms.on('doneConnect', this.ConnectEvents('doneConnect'));
    this.nms.on('prePublish', this.PrePublish());
    this.nms.on('postPublish', this.OtherEvents('postPublish'));
    this.nms.on('donePublish', this.OtherEvents('donePublish'));
    this.nms.on('prePlay', this.OtherEvents('prePlay'));
    this.nms.on('postPlay', this.OtherEvents('postPlay'));
    this.nms.on('donePlay', this.OtherEvents('donePlay'));
  }

  /* Init Server RTMP, RTMPS, HTTPS, HTTP, Api */
  run(): void {
    this.nms.run();
  }

  /* Stop Server RTMP, RTMPS, HTTPS, HTTP, Api */
  stop(): void {
    this.nms.stop();
  }

  /* Obtenemos Session Con la cual podemos Rechazar la conexion con session.reject() */
  getSession(id: string): NodeRtmpSession {
    return this.nms.getSession(id);
  }

  /* Como no estoy Utilizando todos los eventos Utilizo esta funcion para rastrearlos */
  private OtherEvents(name: string): EventFunctionFnS {
    return async (_id: string, _StreamPath: string, _args: object) => {
      console.log(`[NodeEvent on ${name}]`);
    };
  }

  /* Cuando se Desconecta una Transmision */
  private DoneConnect(): EventFunctionFnS {
    return async (_id: string, StreamPath: string, _args: object) => {
      /* Update Stream Database */
      /* Obtenemos los datos del StreamPath */
      const dataStream = seprStreamKey(StreamPath);

      try {
        /* Obtenemos Las bases de datos Stream */
        const strem = StreamUrlDataBase.getInstance();
        const data = await strem.readById(dataStream.idStream);

        /* Verificamos que Stream Existe en la Base de Datos */
        if (data !== null) {
          /* Creamos el nuewvo Objeto Del stream Para actualizarlo */
          const newStream: StreamUrl = {
            ...data,
            url: '',
            active: false
          };

          /* Actualizamos el Stream */
          await strem.update(
            {
              active: newStream.active,
              name: newStream.name,
              password: newStream.password,
              type: newStream.type,
              url: newStream.url
            },
            data.id
          );

          console.log('[Stream Stream Update]');
        }
      } catch (error) {}
    };
  }

  /* Como no estoy Utilizando todos los eventos Utilizo esta funcion para rastrearlos; este es para los eventos Connects que necesitan otro tipo de funcion */
  private ConnectEvents(
    name: string
  ): EventFunctionFnC<ArgsConnectDonePlayEvent | ArgsPlayEvent> {
    return async (
      id: string,
      args: ArgsConnectDonePlayEvent | ArgsPlayEvent
    ) => {
      /*
        Esta funcion bajo los eventos de Connect se Ejecuta en dos Ocaciones Cuando se Conecta un RTMP para transmision 
        o cuando se conecta un HTTP O RTMP para visualizacion o como lo llamamos Cliente

        Cuando "args" contiene la propiedad "ip" es un cliente que quiere visualizar la transmision
        Mas Cuando "args" contiene la propiedad "app" es alguna aplicacion que quiere conectarse para transmitir
      */
      console.log(`[NodeEvent on ${name}]`);
      if ('ip' in args) {
        /*
          Cuando la "ip" es "::1" o "127.0.0.1" o "localhost" <este ultimo nunca viene>
          quiere decir que es el mismo servidor que ejecuta la transmision quien se queiere conectar como cliente a visualizar la conexion
        */
        if (args.ip !== '::1') {
          /*
            Verificamos que la query "auth" exista y que sea lo que necesitamos si no rechazamos la conexion
          */
          if (
            args.query.auth === undefined ||
            args.query.auth !== CONSTS.NMS_AUTH_KEY
          ) {
            const session = this.getSession(id);
            session.reject();
          }
        }
      } else if ('app' in args) {
        this.DoneConnect()(id, `/${args.app}/1234`, args);
      }
    };
  }

  /*
    Esta Funcion PrePublish Se utiliza para la Aceptar o Rechazar la conexion a una aplicacion que quiera conectarse por RTMP
  */
  private PrePublish(): EventFunctionFnS {
    return async (id: string, StreamPath: string, _args: object) => {
      /* Optenemos la session con el ID */
      const session = this.getSession(id);
      /* Verificamps la estructura del StreamPath que sea como la tenemos Arriba */
      if (!verifyStructur(StreamPath)) session.reject();
      /* Obtenemos los datos del StreamPath */
      const dataStream = seprStreamKey(StreamPath);

      /* Verificamos el Id del Stream y del User y que el usuario sea ADMIN */
      const isUser = await VerifyIDUserAdmin(dataStream.idUser);
      const isStream = await VerifyIDStream(dataStream.idStream);

      if (!isUser.isAdmin || !isStream.is) session.reject();

      console.log('[NodeEvent on prePublish]');

      try {
        /* Obtenemos Las bases de datos Correspondientes */
        const strem = StreamUrlDataBase.getInstance();
        const urlcom = UrlComDatabase.getInstance();
        const data = await strem.readById(dataStream.idStream);

        /* Verificamos que Stream Existe en la Base de Datos */
        if (data !== null && data.password === dataStream.password) {
          console.log('[Stream Stream Authorization]');

          /* Obtenemos la Url Del Servidor */
          const da = await urlcom.readFirst(data.type);

          /* Verificamos que la Url Exista en la Base de Datos */
          if (da !== null) {
            /* Obtenemos la URL completa para la transmision Por defecto envia el .flv */
            const url = getUrlStream(da.url, dataStream.streamPath);
            /* Creamos el nuewvo Objeto Del stream Para actualizarlo */
            const newStream: StreamUrl = {
              ...data,
              url,
              active: true
            };

            /* Actualizamos el Stream */
            await strem.update(
              {
                active: newStream.active,
                name: newStream.name,
                password: newStream.password,
                type: newStream.type,
                url: newStream.url
              },
              data.id
            );

            console.log('[Stream Stream Update]');
          } else {
            /* Rechazamos la conexion Si no habia ningun Url De conexion */
            console.log(
              '[Stream Stream Error]',
              `Unauthenticated Stream Key id=${id}`
            );
            session.reject();
          }
        } else {
          /* Rechazamos la conexion Si no habia ningun Stream Object en la base de Datos De conexion */
          console.log(
            '[Stream Stream Error]',
            `Unauthenticated Stream Key id=${id}`
          );
          session.reject();
        }
      } catch (error) {
        /* Rechazamos la conexion Si Recibimos Algun Error en el transcurso de Obtension de datos ETC */
        console.log(
          '[Stream Stream Error]',
          `Error to search Data: ${JSON.stringify(error)}`
        );
        session.reject();
      }
    };
  }

  /* Obtenmos La instancia ya que esto esta creado bajo el patron Singleton */
  static getInstance(): StreamServer {
    if (this.instance === null) {
      this.instance = new StreamServer();
    }
    return this.instance;
  }

  /* Obtenmos La instancia del Router del Stream ya que esto esta creado bajo el patron Singleton */
  static getRouter(): StreamRouter {
    return StreamRouter.getInstance();
  }
}
