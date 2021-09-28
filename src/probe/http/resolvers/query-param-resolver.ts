import { HttpParamResolverFunction } from '../types/http-param-resolver.ts';

export const QueryParamResolver: HttpParamResolverFunction = ({
  key,
  request,
}) => {
  const url = new URL(request.url);

  if (!key) {
    return [...url.searchParams.entries()]
      .reduce((accumulator, [queryParamKey, queryParamValue]) => {
        accumulator[queryParamKey] = queryParamValue;
        return accumulator;
      }, {} as Record<string, string>);
  }
  
  return url.searchParams.get(key);
};
