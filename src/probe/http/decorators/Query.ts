import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

import { HttpDecorators } from "../../constants/http.constants.ts";

import { QueryParamResolver } from "../../http/resolvers/query-param-resolver.ts";

export const Query = (key?: string): ParameterDecorator => {
  return (target, propertyKey, paramaterIndex) => {
    const existingMetadata = Reflect.getMetadata(
      HttpDecorators.Query,
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
      resolver: QueryParamResolver,
    });

    Reflect.defineMetadata(
      HttpDecorators.Query,
      metaValue,
      target,
      propertyKey,
    );
  };
};
