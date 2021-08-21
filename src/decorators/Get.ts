import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

export function Get(path = '/') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const metadata = {
      path,
      method: 'GET',
    };
    Reflect.defineMetadata('http:get', metadata, target);
  };
}
