import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

import { HttpDecorators } from "../../constants/http.constants.ts";

import { ParamResolver } from "../../http/resolvers/param-resolver.ts";

export const Param = (key?: string): ParameterDecorator => {
  return (target, propertyKey, paramaterIndex) => {
    const existingMetadata = Reflect.getMetadata(
      HttpDecorators.Param,
      target,
      propertyKey,
    );
    const metaValue = [];

    if (existingMetadata) {
      metaValue.push(...existingMetadata);
    }

    metaValue.push({
      key,
      paramaterIndex,
      resolver: ParamResolver,
    });

    Reflect.defineMetadata(
      HttpDecorators.Param,
      metaValue,
      target,
      propertyKey,
    );
  };
};
