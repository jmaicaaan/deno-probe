import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

import { AppDecorators } from "./constants/app.constants.ts";
import { AppModule } from "./types/app.module.ts";

import { createHttpApplication } from "./http/createHttpApplication.ts";

export const probeCreateApplication = (classAppModule: unknown) => {
  const appModule: AppModule = Reflect.getMetadata(
    AppDecorators.Module,
    classAppModule,
  );

  if (appModule.type === "http") {
    return createHttpApplication(appModule);
  }
  // TODO other module types
  return undefined;
};
