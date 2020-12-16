import 'reflect-metadata';

export default class MethodHandler {
  controllers: Set<any>;

  constructor(controllers: Set<any>) {
    this.controllers = controllers;
  }

  request(method: string) {
    return (path?: string) => {
      return (target: any, _: string, descriptor: any) => {
        path = this.handleMissingPath(path, method);
        Reflect.defineMetadata('path', path, descriptor.value);
        Reflect.defineMetadata('method', method, descriptor.value);
        this.controllers.add(target);
      };
    };
  }

  middleware() {
    return (middlewareList: string[]) => {
      return (_: any, __: string, descriptor: any) => {
        Reflect.defineMetadata('middleware', middlewareList, descriptor.value);
      };
    };
  }

  handleMissingPath(path: string | undefined, method: string) {
    if (path) return path;
    if ([ 'put', 'delete' ].includes(method)) {
      return '/:id';
    }
    return '/';
  }
}
