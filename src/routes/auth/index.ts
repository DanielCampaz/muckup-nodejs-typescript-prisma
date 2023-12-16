import type IRouter from '@/types/IRouter';
import AuthRouter from './authrouter.router';

export const authRoutes: IRouter[] = [AuthRouter.getInstance()];

export default function ImportAuthRoute(fn: (rt: IRouter) => void): void {
  authRoutes.forEach(fn);
}
