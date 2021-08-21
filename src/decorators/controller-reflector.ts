import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

type ControllerPath = string;
export type ControllerMetadata = ControllerPath;

export const getMetadata = (controller: Function): ControllerMetadata => {
  return Reflect.getMetadata(`controller:${controller.name}`, controller);
};

export const setMetadata = (path: string, target: any) => {
  return Reflect.defineMetadata(`controller:${target.name}`, path, target);
};
