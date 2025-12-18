import { Test, TestingModule } from '@nestjs/testing';
import { WidgetGateway } from './widget.gateway';

describe('WidgetGateway', () => {
  let gateway: WidgetGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WidgetGateway],
    }).compile();

    gateway = module.get<WidgetGateway>(WidgetGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
