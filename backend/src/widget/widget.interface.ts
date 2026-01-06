import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { UpdateWidgetLayoutDto } from './dto/update-widget-layout.dto';
import { WidgetType } from './dto/widget-content.dto';

export interface IWidgetService {
  create(
    workspaceId: string,
    createWidgetDto: CreateWidgetDto,
  ): Promise<CreateWidgetDto>;

  findAll(workspaceId: string): Promise<CreateWidgetDto[]>;

  findOne(workspaceId: string, widgetId: string): Promise<CreateWidgetDto>;

  findOneByWidgetType(
    workspaceId: string,
    widgetType: WidgetType,
  ): Promise<CreateWidgetDto | null>;
  update(
    workspaceId: string,
    updateWidgetDto: UpdateWidgetDto,
  ): Promise<CreateWidgetDto>;

  updateLayout(
    workspaceId: string,
    updateWidgetLayoutDto: UpdateWidgetLayoutDto,
  ): Promise<CreateWidgetDto>;

  remove(workspaceId: string, widgetId: string): Promise<{ widgetId: string }>;

  lock(workspaceId: string, widgetId: string, userId: string): Promise<boolean>;

  unlock(
    workspaceId: string,
    widgetId: string,
    userId: string,
  ): Promise<boolean>;

  getLockOwner(workspaceId: string, widgetId: string): Promise<string | null>;

  unlockAllByUser(workspaceId: string, userId: string): Promise<string[]>;
}

export const WIDGET_SERVICE = 'WIDGET_SERVICE';
