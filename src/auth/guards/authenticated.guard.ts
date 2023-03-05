import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      //console.log(ctx.getContext());
      return request.isAuthenticated();
    }
    const request = context.switchToHttp().getRequest();
    //console.log(request);
    return request.isAuthenticated();
  }
}
