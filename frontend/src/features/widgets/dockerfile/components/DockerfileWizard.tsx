import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { Container } from 'lucide-react';
import { useDockerfileWizard } from '../hooks/useDockerfileWizard';
import { FrameworkSelector } from './FrameworkSelector';
import { WidgetPreview } from '@/common/components/widgetFrame/WidgetPreview';
import { generateDockerfile } from '../utils/generator';
import { NodeOptions } from './wizard/NodeOptions';

function DockerfileWizard() {
  const { content, framework, updateField, setFramework } =
    useDockerfileWizard();

  if (!content) return null;

  return (
    <WidgetFrame
      title="Dockerfile"
      icon={<Container className="h-4 w-4 text-blue-500" />}
    >
      <div className="relative flex h-full flex-row">
        <div className="h-full w-[400px]">
          <div className="h-full overflow-y-auto p-4">
            <FrameworkSelector
              selectedId={framework || 'Node.js'}
              onSelect={setFramework}
            />
            <div className="mt-4 space-y-4">
              <NodeOptions content={content} onChange={updateField} />
            </div>
          </div>
        </div>

        <WidgetPreview
          code={generateDockerfile(content)}
          fileName="Dockerfile"
          language="dockerfile"
        />
      </div>
    </WidgetFrame>
  );
}

export default DockerfileWizard;
