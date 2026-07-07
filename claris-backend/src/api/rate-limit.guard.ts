import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';


const requests = new Map<
    string,
    {
        count: number;
        resetAt: number;
    }
>();


@Injectable()
export class RateLimitGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const ip = request.ip;
        const now = Date.now();
        const windowMs = 60 * 1000;
        const maxRequests = 10;
        let entry = requests.get(ip);
        if (!entry || now > entry.resetAt) {
            entry = {
                count: 0,
                resetAt: now + windowMs,
            };
            requests.set(ip, entry);
        }
        entry.count++;
        if (entry.count > maxRequests) {
            throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
}
