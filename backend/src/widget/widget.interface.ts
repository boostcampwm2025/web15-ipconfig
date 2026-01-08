import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { WidgetType } from './dto/widget-content.dto';
import { UpdateWidgetLayoutDto } from './dto/update-widget-layout.dto';

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
}

export const WIDGET_SERVICE = 'WIDGET_SERVICE';
