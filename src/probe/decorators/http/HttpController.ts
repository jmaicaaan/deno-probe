import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

import { HttpDecorators } from "../../constants/http.constants.ts";

export const Controller = (path: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(HttpDecorators.Controller, target.name, target);
    Reflect.defineMetadata(HttpDecorators.Path, path, target);
  };
};
