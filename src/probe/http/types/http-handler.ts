import { HttpParamResolverFunction } from './http-param-resolver.ts';

export type HttpHandlerParam = {
  key: string;
  parameterIndex: number;
  resolver: HttpParamResolverFunction;
};

export type HttpHandler = {
  fullPath: string;
  path: string;
  method: string;
  target: (...args: unknown[]) => Promise<undefined> | undefined;
  params: HttpHandlerParam[];
};
