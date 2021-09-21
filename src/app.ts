import { ProbeFactory } from "./probe/index.ts";

import { AppModule } from "./app.module.ts";

const createApplication = () => {
  const app = ProbeFactory.createApplication(AppModule);

  app?.setGlobalPrefix("/api");
  app?.listen({ port: 8080 });
};

createApplication();
