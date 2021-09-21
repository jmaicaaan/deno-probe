import { Class } from "./class.ts";

type AppController = Class[];

export type AppModule = {
  controllers?: AppController;
  type?: "http" | "standalone";
};
