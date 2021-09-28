import { Probe } from "../probe/probe.ts";

@Probe.Http.Controller("/articles")
export class ArticlesController {
  @Probe.Http.Get("/:id")
  public getArticle(
    @Probe.Http.Param("id") id: number,
    @Probe.Http.Query("text") text: string,
  ) {
    return JSON.stringify(["Get article", id, text]);
  }

  @Probe.Http.Get()
  public getMoreArticles() {
    return JSON.stringify(["Get articles"]);
  }

  @Probe.Http.Post()
  public createArticle(article: any) {
    return article;
  }

  @Probe.Http.Delete("/:id")
  public deleteArticle(id: number, article: any) {
    return JSON.stringify({});
  }

  @Probe.Http.Patch("/:id")
  public patchArticle(id: number, article: any) {
    return article;
  }

  @Probe.Http.Put("/:id")
  public updateArticle(id: number, article: any) {
    return article;
  }
}
