import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthorizationInterceptor } from 'src/iam/authorization/authorization.interceptor';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthorizationInterceptor,
    },
  ],
})
export class IamModule {}
