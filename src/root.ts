/* TODO: This template was developed by Daniel Campaz: 
    I hope it helps you, this is the template I use when I create apis with node js
    https://github.com/DanielCampaz 
*/
/*
    Project Settings

    In ts-node-dev the parameters used are:

        FIXME: --respawn: It is so that the server is reset at the time of an error
        FIXME: --ignore-watch node_modules: Will ignore errors generated in node_modules
        FIXME: -r tsconfig-paths/register: Both the module and this command are to register absolute paths

*/

import { Main } from '@/main';
import PrismaConnect from './db/prisma.class';

Main(true);

/* Verificamos la conexion a la base de Datos sea Correcta */
PrismaConnect.getInstance()
  .checkConnection()
  .catch((err) => {
    console.log(err);
  });
