import { Module } from '@nestjs/common';
import { WidgetGateway } from './widget.gateway';
import { WidgetService } from './widget.service';

@Module({
  providers: [WidgetGateway, WidgetService],
})
export class WidgetModule {}
