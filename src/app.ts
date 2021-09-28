import { Probe } from "./probe/probe.ts";

import { AppModule } from "./app.module.ts";

const createApplication = () => {
  const app = Probe.createApplication(AppModule);

  app?.setGlobalPrefix("/api");
  app?.listen({ port: 8080 });
};

createApplication();
