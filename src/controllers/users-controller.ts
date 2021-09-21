import { Http } from "../probe/index.ts";

@Http.Controller("/users")
export class UsersController {
  @Http.Get()
  public getUsers() {
    return JSON.stringify(["hello"]);
  }
}
