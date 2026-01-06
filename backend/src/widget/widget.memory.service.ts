import { Injectable, NotFoundException } from '@nestjs/common';
import { IWidgetService } from './widget.interface';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { UpdateWidgetLayoutDto } from './dto/update-widget-layout.dto';
import { WidgetType } from './dto/widget-content.dto';

@Injectable()
export class WidgetMemoryService implements IWidgetService {
  private readonly workspaces = new Map<string, Map<string, CreateWidgetDto>>();
  private readonly locks = new Map<string, string>();

  private getWidgetsMap(workspaceId: string): Map<string, CreateWidgetDto> {
    if (!this.workspaces.has(workspaceId)) {
      this.workspaces.set(workspaceId, new Map());
    }
    return this.workspaces.get(workspaceId)!;
  }

  async create(
    workspaceId: string,
    createWidgetDto: CreateWidgetDto,
  ): Promise<CreateWidgetDto> {
    const widgets = this.getWidgetsMap(workspaceId);
    widgets.set(createWidgetDto.widgetId, createWidgetDto);
    return Promise.resolve(createWidgetDto);
  }

  async findAll(workspaceId: string): Promise<CreateWidgetDto[]> {
    const widgets = this.getWidgetsMap(workspaceId);
    return Promise.resolve(Array.from(widgets.values()));
  }

  async findOne(
    workspaceId: string,
    widgetId: string,
  ): Promise<CreateWidgetDto> {
    const widgets = this.getWidgetsMap(workspaceId);
    const widget = widgets.get(widgetId);
    if (!widget) {
      throw new NotFoundException(`Widget with ID ${widgetId} not found`);
    }
    return Promise.resolve(widget);
  }

  async findOneByWidgetType(
    workspaceId: string,
    widgetType: WidgetType,
  ): Promise<CreateWidgetDto | null> {
    const widgets = this.getWidgetsMap(workspaceId);
    const widget = Array.from(widgets.values()).find(
      (widget) => widget.data.content.widgetType === widgetType,
    );
    if (!widget) {
      return Promise.resolve(null);
    }
    return Promise.resolve(widget);
  }

  async update(
    workspaceId: string,
    updateWidgetDto: UpdateWidgetDto,
  ): Promise<CreateWidgetDto> {
    const widgets = this.getWidgetsMap(workspaceId);
    const existingWidget = widgets.get(updateWidgetDto.widgetId);

    if (!existingWidget) {
      throw new NotFoundException(
        `Widget with ID ${updateWidgetDto.widgetId} not found`,
      );
    }

    const updatedWidget = {
      ...existingWidget,
      data: {
        ...existingWidget.data,
        content: {
          ...existingWidget.data.content,
          ...updateWidgetDto.data.content,
        },
      },
    } as CreateWidgetDto;

    widgets.set(updateWidgetDto.widgetId, updatedWidget);
    return Promise.resolve(updatedWidget);
  }

  async updateLayout(
    workspaceId: string,
    layoutDto: UpdateWidgetLayoutDto,
  ): Promise<CreateWidgetDto> {
    const widgets = this.getWidgetsMap(workspaceId);
    const existingWidget = widgets.get(layoutDto.widgetId);

    if (!existingWidget) {
      throw new NotFoundException(
        `Widget with ID ${layoutDto.widgetId} not found`,
      );
    }

    const { widgetId, ...layoutChanges } = layoutDto;

    const updatedWidget = {
      ...existingWidget,
      data: {
        ...existingWidget.data,
        ...layoutChanges,
      },
    } as CreateWidgetDto;

    widgets.set(widgetId, updatedWidget);
    return Promise.resolve(updatedWidget);
  }

  async remove(
    workspaceId: string,
    widgetId: string,
  ): Promise<{ widgetId: string }> {
    const widgets = this.getWidgetsMap(workspaceId);
    if (!widgets.has(widgetId)) {
      throw new NotFoundException(`Widget with ID ${widgetId} not found`);
    }
    widgets.delete(widgetId);
    this.locks.delete(widgetId);
    return Promise.resolve({ widgetId });
  }

  async lock(
    workspaceId: string,
    widgetId: string,
    userId: string,
  ): Promise<boolean> {
    const widgets = this.getWidgetsMap(workspaceId);
    if (!widgets.has(widgetId)) {
      throw new NotFoundException(`Widget with ID ${widgetId} not found`);
    }

    const currentOwner = this.locks.get(widgetId);
    if (currentOwner && currentOwner !== userId) {
      return Promise.resolve(false);
    }

    this.locks.set(widgetId, userId);
    return Promise.resolve(true);
  }

  async unlock(
    workspaceId: string,
    widgetId: string,
    userId: string,
  ): Promise<boolean> {
    const currentOwner = this.locks.get(widgetId);
    if (currentOwner === userId) {
      this.locks.delete(widgetId);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  async getLockOwner(
    workspaceId: string,
    widgetId: string,
  ): Promise<string | null> {
    return Promise.resolve(this.locks.get(widgetId) || null);
  }

  async unlockAllByUser(
    workspaceId: string,
    userId: string,
  ): Promise<string[]> {
    const unlockedWidgetIds: string[] = [];
    for (const [widgetId, ownerId] of this.locks.entries()) {
      if (ownerId === userId) {
        this.locks.delete(widgetId);
        unlockedWidgetIds.push(widgetId);
      }
    }
    return Promise.resolve(unlockedWidgetIds);
  }
}
