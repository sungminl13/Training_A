import { Controller, Get, Headers } from '@nestjs/common';

import { getApiI18n } from './i18n';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Headers('accept-language') acceptLanguage?: string) {
    const { messages, uiLang } = await getApiI18n(acceptLanguage);
    return this.appService.getHello(messages, uiLang);
  }
}
