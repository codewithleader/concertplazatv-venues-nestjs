import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InternalAxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationInterceptor implements NestInterceptor {
  private AUTHORIZATION_TOKEN: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.AUTHORIZATION_TOKEN = `Bearer ${this.configService.get<string>('authorizationToken')}`;
    this.httpService.axiosRef.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers.Authorization = this.AUTHORIZATION_TOKEN;
        return config;
      },
      (error) =>
        Promise.reject(
          new Error(
            error.message || 'AuthorizationInterceptor: Request failed',
          ),
        ),
    );
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}
