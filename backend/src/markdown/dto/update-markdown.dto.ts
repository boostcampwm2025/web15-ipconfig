import { PartialType } from '@nestjs/swagger';
import { CreateMarkdownDto } from './create-markdown.dto';

export class UpdateMarkdownDto extends PartialType(CreateMarkdownDto) {}
