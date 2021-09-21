import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

import { AppModule as ProbeAppModule } from "../types/app.module.ts";

import { AppDecorators } from "../constants/app.constants.ts";

export const Module = (module: ProbeAppModule): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(AppDecorators.Module, module, target);
  };
};
