import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

import { HttpDecorators, HttpMethods } from "../../constants/http.constants.ts";

export function Get(path = "/"): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    Reflect.defineMetadata(
      HttpDecorators.Handler,
      descriptor.value,
      target,
      propertyKey,
    );
    Reflect.defineMetadata(HttpDecorators.Path, path, target, propertyKey);
    Reflect.defineMetadata(
      HttpDecorators.Method,
      HttpMethods.Get,
      target,
      propertyKey,
    );

    descriptor.writable = true;
    const originalMethod: any = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return 1;
    } as any;
  };
}
// export const Get = (path = "/"): MethodDecorator => {
//   return (target, propertyKey, descriptor) => {
//     Reflect.defineMetadata(HttpDecorators.Handler, descriptor.value, target, propertyKey);
//     Reflect.defineMetadata(HttpDecorators.Path, path, target, propertyKey);
//     Reflect.defineMetadata(HttpDecorators.Method, HttpMethods.Get, target, propertyKey);

//     const originalMethod = descriptor.value;

//     descriptor.value = (...args) => {
//       console.log('1', 1);
//       originalMethod.apply(this)
//     }

//     return descriptor;
//   };
// }
