export const HttpMethods = {
  Get: "GET",
  Post: "POST",
  Put: "PUT",
  Delete: "DELETE",
  Patch: "PATCH",
} as const;

export const HttpDecorators = {
  AppModule: "http",
  Controller: "httpController",
  Handler: "httpHandler",
  Path: "httpPath",
  Method: "httpMethod",
  Param: "httpParam",
  Query: "httpQueryParam",
} as const;
