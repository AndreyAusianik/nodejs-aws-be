import { handlerPath } from '@libs/handlerResolver';
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: {
          origins: "*",
          headers: "*",
          methods: ["POST", "OPTIONS"],
        },
        request: {
          schema: {
            "application/json": schema
          }
        }
      }
    }
  ]
}
