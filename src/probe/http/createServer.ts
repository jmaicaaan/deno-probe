import { HttpRouter } from "./types/httpRouter.ts";

export const createServer = () => {
  return async (listenOptions: Deno.ListenOptions, router: HttpRouter) => {
    const server = Deno.listen(listenOptions);

    for await (const conn of server) {
      const httpConn = Deno.serveHttp(conn);

      for await (const requestEvent of httpConn) {
        router(requestEvent);
      }
    }
    return server;
  };
};
