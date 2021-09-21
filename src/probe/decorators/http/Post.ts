import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

import { HttpDecorators, HttpMethods } from "../../constants/http.constants.ts";

export const Post = (path = "/"): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(
      HttpDecorators.Handler,
      descriptor.value,
      target,
      propertyKey,
    );
    Reflect.defineMetadata(HttpDecorators.Path, path, target, propertyKey);
    Reflect.defineMetadata(
      HttpDecorators.Method,
      HttpMethods.Post,
      target,
      propertyKey,
    );
  };
};
