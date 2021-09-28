import { Probe } from "../probe/probe.ts";

@Probe.Http.Controller("/users")
export class UsersController {
  @Probe.Http.Get()
  public getUsers() {
    return JSON.stringify(["hello"]);
  }
}
