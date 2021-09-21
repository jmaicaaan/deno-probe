import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";
import { pathToRegexp } from "https://deno.land/x/path_to_regexp@v6.2.0/index.ts";

import { HttpDecorators } from "../constants/http.constants.ts";
import { AppModule } from "../types/app.module.ts";
import { HttpApplicationConfig } from "./types/httpApplication.ts";

export const createRouter = (appModule: AppModule) =>
  (config: HttpApplicationConfig) => {
    const controllers = buildControllers(appModule.controllers);
    return createRouteMatching(controllers, config);
  };

const buildControllers = (controllers: AppModule["controllers"]) => {
  const getControllerListMetadata = () => {
    return controllers?.map((controller) => {
      const controllerName = Reflect.getMetadata(
        HttpDecorators.Controller,
        controller,
      );
      const controllerPath = Reflect.getMetadata(
        HttpDecorators.Path,
        controller,
      );

      return {
        name: controllerName,
        path: controllerPath,
        target: controller,
      };
    }).filter((controller) => controller.path);
  };

  const buildControllerAndHandlers = (
    controllerListMetadata: ReturnType<typeof getControllerListMetadata>,
  ) => {
    return controllerListMetadata?.map((controllerMetadata) => {
      const classInstance = new controllerMetadata.target();
      const classPrototype = controllerMetadata.target.prototype;

      const handlers = Object.getOwnPropertyNames(classPrototype)
        .map((handlerName) => {
          const handler = Reflect.getMetadata(
            HttpDecorators.Handler,
            classInstance,
            handlerName,
          );
          const handlerPath = Reflect.getMetadata(
            HttpDecorators.Path,
            classInstance,
            handlerName,
          );
          const handlerMethod = Reflect.getMetadata(
            HttpDecorators.Method,
            classInstance,
            handlerName,
          );

          return {
            fullPath: handlePathTrailingSlash(controllerMetadata.path, true) +
              handlerPath,
            path: handlerPath,
            method: handlerMethod,
            target: handler,
          };
        })
        .filter((handler) => handler.method);

      return {
        ...controllerMetadata,
        handlers,
      };
    });
  };

  const controllerListMetadata = getControllerListMetadata();
  const controllerListWithHandlers = buildControllerAndHandlers(
    controllerListMetadata,
  );

  return controllerListWithHandlers;
};

const createRouteMatching = (
  controllers: ReturnType<typeof buildControllers>,
  config: HttpApplicationConfig,
) =>
  async (requestEvent: Deno.RequestEvent) => {
    const requestUrl = new URL(requestEvent.request.url);
    const requestMethod = requestEvent.request.method;

    // TODO
    const matchRoute: Record<string, any> = {
      handler: undefined,
    };

    controllers?.find((controller) => {
      return controller.handlers.find((handler) => {
        const path = handlePathTrailingSlash(
          config.globalPrefix + handler.fullPath,
          config.disableTrailingSlash,
        );

        const hasMatchResult = pathToRegexp(path).exec(requestUrl.pathname);

        if (!hasMatchResult) {
          return;
        }

        if (handler.method !== requestMethod) {
          return;
        }

        matchRoute.handler = handler.target;
      });
    });

    if (!matchRoute.handler) {
      return requestEvent.respondWith(
        new Response("Not found route", {
          status: 404,
        }),
      );
    }

    // Handlers that return promises
    const handlerResult = await matchRoute.handler(requestEvent.request);
    return requestEvent.respondWith(new Response(handlerResult));
  };

const handlePathTrailingSlash = (
  path: string,
  removeTrailingSlash?: boolean,
) => {
  if (!removeTrailingSlash) {
    return path;
  }

  const hasTrailingSlash = path.lastIndexOf("/") !== 0;
  if (hasTrailingSlash) {
    return path.slice(
      0,
      path.length - 1,
    );
  }

  return path;
};
