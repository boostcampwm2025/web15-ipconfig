import { Module } from '@nestjs/common';
import { MarkdownController } from './markdown.controller';
import { MarkdownService } from './markdown.service';
import {
  SECTION_BUILDERS,
  TechStackBuilder,
  NamingConventionBuilder,
  FormatBuilder,
  GitConventionBuilder,
  CollaborationBuilder,
  CommunicationBuilder,
} from './builders';

@Module({
  controllers: [MarkdownController],
  providers: [
    MarkdownService,
    TechStackBuilder,
    NamingConventionBuilder,
    FormatBuilder,
    GitConventionBuilder,
    CollaborationBuilder,
    CommunicationBuilder,
    {
      provide: SECTION_BUILDERS,
      useFactory: (
        techStack: TechStackBuilder,
        naming: NamingConventionBuilder,
        format: FormatBuilder,
        git: GitConventionBuilder,
        collaboration: CollaborationBuilder,
        communication: CommunicationBuilder,
      ) => [techStack, naming, format, git, collaboration, communication],
      inject: [
        TechStackBuilder,
        NamingConventionBuilder,
        FormatBuilder,
        GitConventionBuilder,
        CollaborationBuilder,
        CommunicationBuilder,
      ],
    },
  ],
})
export class MarkdownModule {}
