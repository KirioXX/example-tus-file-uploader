import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class SupabaseAuthorisationGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization }: any = request.headers;
    if (!authorization) {
      return false;
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return false;
    }
    return true;
  }
}
