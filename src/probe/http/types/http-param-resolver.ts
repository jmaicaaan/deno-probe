export type HttpParamResolverArgs = {
  key: string;
  path: string;
  pathWithGlobalPrefix: string;
  method: string;
  request: Deno.RequestEvent['request'];
};
export type HttpParamResolverFunction = (args: HttpParamResolverArgs) => unknown;
