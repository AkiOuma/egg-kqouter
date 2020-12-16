# egg-qkouter

decorators for router and middleware in egg.js



## Use

```typescript
// router.ts
import { Application } from 'egg';
import { Qkouter } from 'egg-qkouter';

export default (app: Application) => {
  Qkouter(app);
};
```

### Router and Middleware decorator
```typescript
import { Controller } from 'egg';
import { Get, Prefix, Middleware, Post, Put, Delete, ControllerMiddleware } from 'egg-qkouter';

@Prefix('/user')
@ControllerMiddleware([ 'admin' ])
export default class UserController extends Controller {

  @Get('/')
  @Middleware([ 'general' ])
  public async findUser() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('user');
  }

  @Post('/')
  @Middleware([ 'general' ])
  async createUser() {
    this.ctx.body = {
      code: 200,
      msg: 'creating user',
    };
  }

  @Put()
  @Middleware([ 'general' ])
  async updateUser() {
    this.ctx.body = {
      code: 200,
      msg: `updating user: ${this.ctx.params.id}`,
      data: this.ctx.request.body,
    };
  }

  @Delete()
  @Middleware([ 'general' ])
  async deleteUser() {
    this.ctx.body = {
      code: 200,
      msg: `deleting user: ${this.ctx.params.id}`,
    };
  }
}

```
___
#### Router decorators

* Prefix(path?: string)

  declare prefix path of each controller
  
  if parameter 'path' is not provided then will be assigned to '\\' instead.

* Get(path?: string)

  declare path for request method get.

  if parameter 'path' is not provided then will be assigned to '\\' instead.

* Post(path?: string)

  declare path for request method get.

  if parameter 'path' is not provided then will be assigned to '\\' instead.

* Put(path?: string)

  declare path for request method get.

  if parameter 'path' is not provided then will be assigned to '\\' instead.

* Delete(path?: string)

  declare path for request method get.

  if parameter 'path' is not provided then will be assigned to '\\' instead.

___
#### Middleware decorators

* ControllerMiddleware(middlewares: string[])

  declare name list of middlewares for controller

* Middleware(middlewares: string[])

  declare name list of middlewares for method

