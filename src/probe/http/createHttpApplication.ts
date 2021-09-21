import { AppModule } from "../types/app.module.ts";

import { createServer } from "./createServer.ts";
import { createRouter } from "./createRouter.ts";

import { HttpApplicationConfig } from "./types/httpApplication.ts";

export const createHttpApplication = (appModule: AppModule) => {
  const config: HttpApplicationConfig = {
    globalPrefix: "/api",
    disableTrailingSlash: true,
  };

  const setGlobalPrefix = (prefix: string) => {
    config.globalPrefix = prefix;
  };

  const disableTrailingSlash = (disabled: boolean) => {
    config.disableTrailingSlash = disabled;
  };

  const lazyRouter = createRouter(appModule);
  const lazyServer = createServer();

  return {
    setGlobalPrefix,
    disableTrailingSlash,
    listen: (listenOptions: Deno.ListenOptions) => {
      const router = lazyRouter(config);
      lazyServer(listenOptions, router);
    },
  };
};
