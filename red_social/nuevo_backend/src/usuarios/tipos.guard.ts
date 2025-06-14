import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TiposGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const tipos = this.reflector.get<string[]>('tipos', context.getHandler());
    if (!tipos) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return tipos.includes(user.tipo);
  }
}