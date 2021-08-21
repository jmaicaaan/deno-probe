import { serve } from "https://deno.land/std/http/server.ts";

export const createServer = () => {
  const PORT = 8080;
  const server = serve({ port: PORT });
  return server;
};
