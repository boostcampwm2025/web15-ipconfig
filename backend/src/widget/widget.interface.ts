import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

export interface IWidgetService {
  create(createWidgetDto: CreateWidgetDto): Promise<CreateWidgetDto>;
  findAll(): Promise<CreateWidgetDto[]>;
  findOne(id: string): Promise<CreateWidgetDto>;
  update(updateWidgetDto: UpdateWidgetDto): Promise<CreateWidgetDto>;
  remove(widgetId: string): Promise<{ widgetId: string }>;
}

// DI 토큰
export const WIDGET_SERVICE = 'WIDGET_SERVICE';
