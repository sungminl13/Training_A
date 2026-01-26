import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  BadRequestException,
} from '@nestjs/common';

import type { CreateLinkDto, UpdateLinkDto } from '@repo/api';

import { LinksService } from './links.service';
import { getApiI18n } from '../i18n';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  private parseId(id: string) {
    const parsed = Number(id);
    if (Number.isNaN(parsed)) {
      throw new BadRequestException({ code: 'INVALID_ID' });
    }
    return parsed;
  }

  @Post()
  async create(
    @Body() createLinkDto: CreateLinkDto,
    @Headers('accept-language') acceptLanguage?: string
  ) {
    const { messages, uiLang } = await getApiI18n(acceptLanguage);
    return this.linksService.create(createLinkDto, messages, uiLang);
  }

  @Get()
  async findAll(@Headers('accept-language') acceptLanguage?: string) {
    const { messages, uiLang } = await getApiI18n(acceptLanguage);
    return this.linksService.findAll(messages, uiLang);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('accept-language') acceptLanguage?: string
  ) {
    const { messages, uiLang } = await getApiI18n(acceptLanguage);
    return this.linksService.findOne(this.parseId(id), messages, uiLang);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto,
    @Headers('accept-language') acceptLanguage?: string
  ) {
    const { messages, uiLang } = await getApiI18n(acceptLanguage);
    return this.linksService.update(
      this.parseId(id),
      updateLinkDto,
      messages,
      uiLang
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('accept-language') acceptLanguage?: string
  ) {
    const { messages, uiLang } = await getApiI18n(acceptLanguage);
    return this.linksService.remove(this.parseId(id), messages, uiLang);
  }
}
