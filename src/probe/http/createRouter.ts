import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";
import { pathToRegexp } from "https://deno.land/x/path_to_regexp@v6.2.0/index.ts";

import { HttpDecorators } from "../constants/http.constants.ts";
import { AppModule } from "../types/app.module.ts";
import { HttpApplicationConfig } from "./types/httpApplication.ts";
import { HttpHandler } from "./types/http-handler.ts";

type MatchRouteHandler = HttpHandler & {
  pathWithGlobalPrefix: string;
};

export const createRouter = (appModule: AppModule) =>
  (config: HttpApplicationConfig) => {
    const controllers = buildControllers(appModule.controllers);
    return createRouteMatchingAndRespond(controllers, config);
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
          const handlerParams = Reflect.getMetadata(
            HttpDecorators.Param,
            classInstance,
            handlerName,
          ) || [];
          const handlerQueries = Reflect.getMetadata(
            HttpDecorators.Query,
            classInstance,
            handlerName,
          ) || [];

          return {
            fullPath: handlePathTrailingSlash(controllerMetadata.path, true) +
              handlerPath,
            path: handlerPath,
            method: handlerMethod,
            target: handler,
            params: [
              ...handlerParams,
              ...handlerQueries,
            ],
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

const createRouteMatchingAndRespond = (
  controllers: ReturnType<typeof buildControllers>,
  config: HttpApplicationConfig,
) =>
  async (requestEvent: Deno.RequestEvent) => {
    const requestUrl = new URL(requestEvent.request.url);
    const requestMethod = requestEvent.request.method;

    const matchedRouteHandler = controllers?.reduce(
      (accumulator, controller) => {
        controller.handlers.find((handler) => {
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

          accumulator = {
            ...handler,
            pathWithGlobalPrefix: path,
          };
        });

        return accumulator;
      },
      {} as MatchRouteHandler,
    );

    if (!matchedRouteHandler || !matchedRouteHandler.target) {
      return requestEvent.respondWith(
        new Response("Not found route", {
          status: 404,
        }),
      );
    }

    // Handlers that return promises
    const enhancedHandler = enhanceHandler({
      matchedRouteHandler,
      request: requestEvent.request,
    });
    const handlerResult = await enhancedHandler.target();
    return requestEvent.respondWith(new Response(handlerResult));
  };

const enhanceHandler = ({
  matchedRouteHandler,
  request,
}: {
  matchedRouteHandler: MatchRouteHandler;
  request: Deno.RequestEvent["request"];
}): MatchRouteHandler => {
  const attachDecoratedParamsToHandler = () => {
    const handlerParams = matchedRouteHandler.params
      /**
     * Map and resolve the value from the resolver
     */
      .map((param) => {
        const resolverArgs = {
          ...matchedRouteHandler,
          key: param.key,
          request,
        };

        return {
          value: param.resolver(resolverArgs),
          parameterIndex: param.parameterIndex,
        };
      })
      /**
       * Make sure the parameters are in order
       */
      .sort((a, b) => a.parameterIndex - b.parameterIndex)
      /**
       * Unpack/unwrap the param from the object
       */
      .map((param) => param.value);

    const enhancedTarget = () => matchedRouteHandler.target(...handlerParams);

    return {
      ...matchedRouteHandler,
      target: enhancedTarget,
    };
  };

  return attachDecoratedParamsToHandler();
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
      path.length,
    );
  }

  return path;
};
