import { WidgetData } from './create-widget.dto';

export class UpdateWidgetDto {
  widgetId: string;
  data: Partial<WidgetData>;
}
