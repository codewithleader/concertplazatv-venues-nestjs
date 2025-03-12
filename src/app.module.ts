import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envsConfig, joiSchema } from 'src/config/envs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envsConfig],
      validationSchema: joiSchema,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
