import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Link, CreateLinkDto, UpdateLinkDto } from '@repo/api';
import { getMessage, type ErrorMessages } from '@repo/messages';

@Injectable()
export class LinksService {
  private readonly _links: Array<
    Link & { titleKey?: string; descriptionKey?: string }
  > = [
    {
      id: 0,
      url: 'https://turborepo.dev/docs/getting-started/installation',
      title: 'Installation',
      description: 'Get started with Turborepo in a few moments using',
      titleKey: 'LINK_TITLE_INSTALLATION',
      descriptionKey: 'LINK_DESC_INSTALLATION',
    },
    {
      id: 1,
      url: 'https://turborepo.dev/docs/crafting-your-repository',
      title: 'Crafting',
      description: 'Architecting a monorepo is a careful process.',
      titleKey: 'LINK_TITLE_CRAFTING',
      descriptionKey: 'LINK_DESC_CRAFTING',
    },
    {
      id: 2,
      url: 'https://turborepo.dev/docs/getting-started/add-to-existing-repository',
      title: 'Add Repositories',
      description:
        'Turborepo can be incrementally adopted in any repository, single or multi-package, to speed up the developer and CI workflows of the repository.',
      titleKey: 'LINK_TITLE_ADD_REPOS',
      descriptionKey: 'LINK_DESC_ADD_REPOS',
    },
  ];

  private assertCreatePayload(payload: CreateLinkDto) {
    const missingFields = ['title', 'url', 'description'].filter((field) => {
      const value = payload?.[field as keyof CreateLinkDto];
      return typeof value !== 'string' || value.trim().length === 0;
    });

    if (missingFields.length > 0) {
      throw new BadRequestException({
        code: 'VALIDATION_MISSING_FIELDS',
        details: { missingFields },
      });
    }
  }

  private assertUpdatePayload(payload: UpdateLinkDto) {
    const fields: Array<keyof UpdateLinkDto> = ['title', 'url', 'description'];
    const providedFields = fields.filter((field) => payload?.[field] !== undefined);

    if (providedFields.length === 0) {
      throw new BadRequestException({
        code: 'VALIDATION_NO_FIELDS',
        details: { reason: 'NO_FIELDS' },
      });
    }

    const invalidFields = providedFields.filter((field) => {
      const value = payload?.[field];
      return typeof value !== 'string' || value.trim().length === 0;
    });

    if (invalidFields.length > 0) {
      throw new BadRequestException({
        code: 'VALIDATION_INVALID_FIELDS',
        details: { invalidFields },
      });
    }
  }

  private findLinkOrThrow(id: number) {
    const link = this._links.find((item) => item.id === id);
    if (!link) {
      throw new NotFoundException({
        code: 'LINK_NOT_FOUND',
        details: { id },
      });
    }
    return link;
  }

  private localizeLink(
    link: Link & { titleKey?: string; descriptionKey?: string },
    messages: ErrorMessages,
    lang: string
  ): Link {
    return {
      id: link.id,
      url: link.url,
      title: getMessage(messages, link.titleKey ?? '', lang, link.title),
      description: getMessage(
        messages,
        link.descriptionKey ?? '',
        lang,
        link.description
      ),
    };
  }

  private getNextId() {
    return this._links.length === 0
      ? 0
      : Math.max(...this._links.map((link) => link.id)) + 1;
  }

  create(createLinkDto: CreateLinkDto, messages: ErrorMessages, lang: string) {
    this.assertCreatePayload(createLinkDto);
    const newLink: Link = {
      id: this.getNextId(),
      title: createLinkDto.title.trim(),
      url: createLinkDto.url.trim(),
      description: createLinkDto.description.trim(),
    };
    this._links.push(newLink);
    return this.localizeLink(newLink, messages, lang);
  }

  findAll(messages: ErrorMessages, lang: string) {
    return this._links.map((link) => this.localizeLink(link, messages, lang));
  }

  findOne(id: number, messages: ErrorMessages, lang: string) {
    const link = this.findLinkOrThrow(id);
    return this.localizeLink(link, messages, lang);
  }

  update(
    id: number,
    updateLinkDto: UpdateLinkDto,
    messages: ErrorMessages,
    lang: string
  ) {
    this.assertUpdatePayload(updateLinkDto);
    const link = this.findLinkOrThrow(id);
    const updatedLink = {
      ...link,
      title: updateLinkDto.title?.trim() ?? link.title,
      url: updateLinkDto.url?.trim() ?? link.url,
      description: updateLinkDto.description?.trim() ?? link.description,
      titleKey: undefined,
      descriptionKey: undefined,
    };
    const index = this._links.findIndex((item) => item.id === id);
    this._links[index] = updatedLink;
    return this.localizeLink(updatedLink, messages, lang);
  }

  remove(id: number, messages: ErrorMessages, lang: string) {
    const link = this.findLinkOrThrow(id);
    const index = this._links.findIndex((item) => item.id === id);
    const [removed] = this._links.splice(index, 1);
    return this.localizeLink(removed ?? link, messages, lang);
  }
}
