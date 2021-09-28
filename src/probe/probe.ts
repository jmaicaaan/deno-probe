import { ProbeFactory } from "./ProbeFactory.ts";

import { Module } from "./decorators/Module.ts";

import * as HttpDecorators from "./http/decorators/index.ts";

export const Probe = {
  ...ProbeFactory,
  Module,
  Http: {
    ...HttpDecorators,
  },
};
