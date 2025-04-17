import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';

  interface AuthRequest extends Request {
    user: any;
    cookies: any; 
  }
  
  @Injectable()
  export class JwtCookieAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest<AuthRequest>();
      const token = req.cookies?.auth_token;
      if (!token) throw new UnauthorizedException('No auth token');
  
      try {
        const payload = this.jwtService.verify(token);
        req.user = payload;
        return true;
      } catch {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
  