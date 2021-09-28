import { Probe } from "./probe/probe.ts";

import { ArticlesController } from "./controllers/articles-controller.ts";
import { UsersController } from "./controllers/users-controller.ts";

@Probe.Module({
  type: "http",
  controllers: [ArticlesController, UsersController],
})
export class AppModule {}
