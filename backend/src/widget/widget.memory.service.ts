import { Injectable, NotFoundException } from '@nestjs/common';
import { IWidgetService } from './widget.interface';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

@Injectable()
export class WidgetMemoryService implements IWidgetService {
  private widgets: Map<string, CreateWidgetDto> = new Map();

  async create(createWidgetDto: CreateWidgetDto): Promise<CreateWidgetDto> {
    const { widgetId } = createWidgetDto;
    this.widgets.set(widgetId, createWidgetDto);
    return Promise.resolve(createWidgetDto);
  }

  async findAll(): Promise<CreateWidgetDto[]> {
    return Promise.resolve(Array.from(this.widgets.values()));
  }

  async findOne(id: string): Promise<CreateWidgetDto> {
    const widget = this.widgets.get(id);
    if (!widget) {
      throw new NotFoundException(`Widget with ID ${id} not found`);
    }
    return Promise.resolve(widget);
  }

  async update(updateWidgetDto: UpdateWidgetDto): Promise<CreateWidgetDto> {
    const { widgetId, data } = updateWidgetDto;
    const existingWidget = await this.findOne(widgetId);

    const updatedWidget = {
      ...existingWidget,
      data: {
        ...existingWidget.data,
        ...data,
        content: data.content
          ? { ...existingWidget.data.content, ...data.content }
          : existingWidget.data.content,
      },
    } as CreateWidgetDto;

    this.widgets.set(widgetId, updatedWidget);
    return updatedWidget;
  }

  async remove(widgetId: string): Promise<{ widgetId: string }> {
    await this.findOne(widgetId); // 존재 확인
    this.widgets.delete(widgetId);
    return { widgetId };
  }
}
