import { Http } from "../probe/index.ts";

@Http.Controller("/articles")
export class ArticlesController {
  @Http.Get("/:id")
  public getArticle(@Http.Param() id: number) {
    // console.log('id', id);
    return JSON.stringify(["Get article"]);
  }

  @Http.Get()
  public getMoreArticles() {
    return JSON.stringify(["Get articles"]);
  }

  @Http.Post()
  public createArticle(article: any) {
    return article;
  }

  @Http.Delete("/:id")
  public deleteArticle(id: number, article: any) {
    return JSON.stringify({});
  }

  @Http.Patch("/:id")
  public patchArticle(id: number, article: any) {
    return article;
  }

  @Http.Put("/:id")
  public updateArticle(id: number, article: any) {
    return article;
  }
}
