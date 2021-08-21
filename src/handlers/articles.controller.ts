import { Controller } from '../decorators/Controller.ts';
import { Get } from '../decorators/Get.ts';

@Controller('/articles')
export class ArticlesController {

  @Get()
  public getArticles() {
    return JSON.stringify([]);
  }
}
