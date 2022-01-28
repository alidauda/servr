import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constant";
import { User } from "./entites/User";

export default {
    entities: [User],
    dbName: 'myshop',
    type: 'postgresql',
    debug:!__prod__ ,
    migrations: {
       
        path:  path.join(__dirname, './migrations',) , // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
       
      },
    
    // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
  } as  Parameters<typeof MikroORM.init>[0];