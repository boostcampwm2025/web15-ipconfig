import type { WidgetList, DockerfileData } from '@/common/types/widgetData';
import { generateDockerfile } from '@/features/widgets/dockerfile/utils/generator';

export function getWidgetContents(widgetList: WidgetList, type: string) {
  const widget = widgetList.find((w) => w.type === type);

  if (!widget?.content) {
    return '아직 작성되지 않았습니다!';
  }

  // Dockerfile은 별도 텍스트 형식으로 생성
  if (type === 'DOCKERFILE') {
    return generateDockerfile(widget.content as DockerfileData);
  }

  // 나머지는 JSON 형식
  return JSON.stringify(widget.content, null, 2);
}
