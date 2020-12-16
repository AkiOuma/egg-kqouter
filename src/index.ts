import 'reflect-metadata';
import MethodHandler from './method';
import ControllerHandler from './controller';


const controllers = new Set<any>();
const methodHandler = new MethodHandler(controllers);
const controllerHandler = new ControllerHandler();

export const Qkouter = (app: any) => {

  const { router, middleware } = app;

  for (const controller of controllers.values()) {

    // resolve routers in each controller
    const basePath: string = Reflect.getMetadata('controller', controller.constructor);
    let controllerMiddlewares: string[] = Reflect.getMetadata('controllerMiddleware', controller.constructor);

    const methods: any[] = Reflect.ownKeys(controller)
      .filter((method: any) => {
        return ![ 'constructor', 'pathName', 'fullPath' ].includes(method);
      });

    methods.forEach((method: any) => {
      const subPath = Reflect.getMetadata('path', controller[method]);
      const reuqestMethod: string = Reflect.getMetadata('method', controller[method]);
      if (!subPath) return;
      const path: string = `${basePath}${subPath}`
        .replace(/\/{2,}/g, '/');

      // Instantiate controller class then use method in instance
      const target = async (ctx: any) => {
        const controllerInstance = new controller.constructor(ctx);
        await controllerInstance[method](ctx);
      };

      // resolve middlewares
      let middlewareNameList: string[] | undefined = Reflect.getMetadata('middleware', controller[method]);
      if (!controllerMiddlewares) controllerMiddlewares = [];
      if (!middlewareNameList) middlewareNameList = [];
      const middlewares: any = (controllerMiddlewares.concat(middlewareNameList)).map((middle: string) => {
        return middleware[middle]();
      });
      router[reuqestMethod](path, ...middlewares, target);
    });
  }
};

export const Prefix = controllerHandler.prefix();
export const ControllerMiddleware = controllerHandler.middleware();

export const Middleware = methodHandler.middleware();
export const Get = methodHandler.request('get');
export const Post = methodHandler.request('post');
export const Put = methodHandler.request('put');
export const Delete = methodHandler.request('delete');
