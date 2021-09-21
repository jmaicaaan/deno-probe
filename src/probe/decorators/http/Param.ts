import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

import { HttpDecorators } from "../../constants/http.constants.ts";

export const Param = (property?: string): ParameterDecorator => {
  return (target, property, paramaterIndex) => {
    console.log("target", target);
    // TODO TODO TODO

    // const a = Reflect.getOwnMetadata(
    //   requiredMetadataKey, target, propertyKey
    // );
    // console.log('property', property);
    // console.log('paramaterIndex', paramaterIndex);
    const targetInstance = Reflect.getMetadata(
      HttpDecorators.Handler,
      target,
      property,
    );
    console.log("targetInstance", targetInstance);
    const a = Reflect.getMetadataKeys(target);
    console.log("a", a);
    // Reflect.defineMetadata(HttpDecorators.Handler, descriptor.value, target, propertyKey);
  };
};
