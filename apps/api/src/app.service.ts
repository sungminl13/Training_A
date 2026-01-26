import { Injectable } from '@nestjs/common';
import { getMessage, type ErrorMessages } from '@repo/messages';

@Injectable()
export class AppService {
  getHello(messages: ErrorMessages, lang: string): string {
    return getMessage(messages, 'API_HELLO', lang, 'Hello World!');
  }
}
