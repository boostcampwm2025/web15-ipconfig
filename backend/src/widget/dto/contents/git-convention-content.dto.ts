import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsObject, ValidateNested } from 'class-validator';
import { WidgetType } from '../widget-type.enum';
import { BaseContentDto } from './base-content.dto';

export type GitStrategy = 'GITHUB_FLOW' | 'GIT_FLOW' | 'TRUNK_BASED';

export interface BranchRuleState {
  mainBranch: string;
  developBranch?: string;
  prefixes: string[];
}

export interface CommitConventionState {
  useGitmoji: boolean;
  commitTypes: string[];
}

export interface GitConventionData {
  strategy: GitStrategy;
  branchRules: BranchRuleState;
  commitConvention: CommitConventionState;
}

export class GitConventionContentDto implements BaseContentDto {
  @ApiProperty({ example: WidgetType.GIT_CONVENTION })
  @IsEnum(WidgetType)
  readonly widgetType = WidgetType.GIT_CONVENTION;

  @ApiProperty({
    example: {
      strategy: 'GITHUB_FLOW',
      branchRules: {
        mainBranch: 'main',
        developBranch: 'develop',
        prefixes: [],
      },
      commitConvention: { useGitmoji: false, commitTypes: [] },
    },
  })
  @IsObject()
  @ValidateNested()
  readonly data: GitConventionData;
}

// Update용 Partial DTO Export
export class PartialGitConventionContentDto extends PartialType(
  GitConventionContentDto,
) {}
