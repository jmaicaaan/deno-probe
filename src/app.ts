import { createServer } from './server.ts';
import { pathToRegexp } from 'https://deno.land/x/path_to_regexp@v6.2.0/index.ts';

import { ArticlesController } from './handlers/articles.controller.ts';
import { getMetadata } from './decorators/controller-reflector.ts';

const createApplication = async () => {
  const server = createServer();

  for await (const req of server) {
    console.log(req.url);
    const route = req.url;

    const articlesController = new ArticlesController();
    // TODO - gather all class methods with decorators metadata
    const controllerPath = getMetadata(ArticlesController);

    console.log('controllerPath', controllerPath);

    const reg = pathToRegexp('/api' + controllerPath);
    const match = reg.exec(route);
    if (match) {

      req.respond({ body: articlesController.getArticles() });
      return;
    }
    req.respond({ body: "hello world" }); // respond response
  }
};

createApplication();
