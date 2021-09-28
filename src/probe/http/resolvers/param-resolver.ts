import {
  parse,
  pathToRegexp,
} from "https://deno.land/x/path_to_regexp@v6.2.0/index.ts";

import { HttpParamResolverFunction } from "../types/http-param-resolver.ts";

export const ParamResolver: HttpParamResolverFunction = ({
  key,
  pathWithGlobalPrefix,
  request,
}) => {
  const requestUrl = new URL(request.url);
  const result = pathToRegexp(pathWithGlobalPrefix).exec(requestUrl.pathname);

  if (!result) {
    return;
  }

  // TODO - beautify
  const [, ...matchResult] = result;
  const parsedPath = parse(pathWithGlobalPrefix)
    .filter((result) => typeof result === "object")
    .map((result) => (result as any).name);

  const pathIndex = parsedPath.findIndex((result: string) => result === key);

  const allParamsInObject = parsedPath.reduce(
    (accumulator, currentValue, index) => {
      accumulator[currentValue] = matchResult[index];
      return accumulator;
    },
    {},
  );

  return matchResult[pathIndex] || allParamsInObject;
};
