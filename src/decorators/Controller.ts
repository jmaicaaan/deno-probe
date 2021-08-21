import { setMetadata } from './controller-reflector.ts';

export function Controller(path: string) {
  return function (target: Function) {
    setMetadata(path, target);
  }
}
