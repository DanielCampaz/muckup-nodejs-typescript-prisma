import type { Config } from './StreamTypes';

/*
{
  ip:"::1",
  method:"GET",
  streamPath:"/live657a64276eba2f5d6eae77ad_657a616805978cdafaccd2c6/5c6d78cffa59e129f040fcec2d788532",
  query:{}
}
{
  "app":"live657a64276eba2f5d6eae77ad_657a616805978cdafaccd2c6",
  "type":"nonprivate",
  "flashVer":"FMLE/3.0 (compatible; FMSc/1.0)",
  "swfUrl":"rtmp://localhost/live/657a64276eba2f5d6eae77ad_657a616805978cdafaccd2c6","
  tcUrl":"rtmp://localhost/live/657a64276eba2f5d6eae77ad_657a616805978cdafaccd2c6"
}
*/
declare module 'node-media-server' {
  export interface NodeRtmpSession {
    reject: () => void;
    stop: () => void;
    run: () => void;
  }

  const NodeRtmpSession: {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new (): NodeRtmpSession;
  };
  export type EventOn =
    | 'preConnect'
    | 'postConnect'
    | 'doneConnect'
    | 'prePublish'
    | 'postPublish'
    | 'donePublish'
    | 'prePlay'
    | 'postPlay'
    | 'donePlay';

  export interface ArgsConnectDonePlayEvent {
    app: string;
    type: string;
    flashVer: string;
    swfUrl: string;
    tcUrl: string;
  }
  export interface ArgsPlayEvent {
    ip: string;
    method: string;
    streamPath: string;
    query: Record<string, string>;
  }
  export type EventFunctionFnS = (
    id: string,
    StreamPath: string,
    args: object
  ) => void;
  export type EventFunctionFnC<T> = (id: string, args: T) => void;
  export type EventFunction<T extends EventOn> = T extends 'preConnect'
    ? EventFunctionFnC<ArgsConnectDonePlayEvent | ArgsPlayEvent>
    : T extends 'postConnect'
    ? EventFunctionFnC<ArgsConnectDonePlayEvent | ArgsPlayEvent>
    : T extends 'doneConnect'
    ? EventFunctionFnC<ArgsConnectDonePlayEvent | ArgsPlayEvent>
    : T extends 'prePublish'
    ? EventFunctionFnS
    : T extends 'postPublish'
    ? EventFunctionFnS
    : T extends 'donePublish'
    ? EventFunctionFnS
    : T extends 'prePlay'
    ? EventFunctionFnS
    : T extends 'postPlay'
    ? EventFunctionFnS
    : T extends 'donePlay'
    ? EventFunctionFnS
    : EventFunctionFnS;
  interface NodeMediaServer {
    run: () => void;
    on: <T extends EventOn>(eventName: T, listener: EventFunction<T>) => void;

    stop: () => void;
    getSession: (id: string) => NodeRtmpSession;
  }

  const NodeMediaServer: {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new (config: Config): NodeMediaServer;
  };

  export default NodeMediaServer;
}
