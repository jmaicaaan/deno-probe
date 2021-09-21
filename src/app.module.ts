import { Module } from "./probe/decorators/Module.ts";
import { HttpDecorators } from "./probe/constants/http.constants.ts";

import { ArticlesController } from "./controllers/articles-controller.ts";
import { UsersController } from "./controllers/users-controller.ts";

@Module({
  type: HttpDecorators.AppModule,
  controllers: [ArticlesController, UsersController],
})
export class AppModule {}
