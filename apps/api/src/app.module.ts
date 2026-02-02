import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';

@Module({
  imports: [LinksModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
