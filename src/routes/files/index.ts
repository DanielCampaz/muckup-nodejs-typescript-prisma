import type IRouter from '@/types/IRouter';
import VideoRouter from './video/videorouter.router';
import ImageRouter from './image/imagerouter.router';
import DocumentRouter from './document/documentrouter.router';
import AudioRouter from './audio/audiorouter.router';

export const fileRoutes: IRouter[] = [
  VideoRouter.getInstance(),
  ImageRouter.getInstance(),
  DocumentRouter.getInstance(),
  AudioRouter.getInstance()
];

export default function ImportFilesRoute(fn: (rt: IRouter) => void): void {
  fileRoutes.forEach(fn);
}
