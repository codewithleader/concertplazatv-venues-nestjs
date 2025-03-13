import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envsConfig, joiSchema } from 'src/config/envs';
import { VenuesModule } from './venues/venues.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envsConfig],
      validationSchema: joiSchema,
    }),
    VenuesModule,
    IamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
