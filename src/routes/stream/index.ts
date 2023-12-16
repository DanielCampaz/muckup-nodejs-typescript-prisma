import type IRouter from '@/types/IRouter';
import StreamUrlRouter from './streamurl/streamurlrouter.router';
import UrlComRouter from './urlcom/urlcomrouter.router';

export const streamRoutes: IRouter[] = [
  StreamUrlRouter.getInstance(),
  UrlComRouter.getInstance()
];

export default function ImportStreamRoute(fn: (rt: IRouter) => void): void {
  streamRoutes.forEach(fn);
}
