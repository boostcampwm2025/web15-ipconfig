import type { Meta, StoryObj } from '@storybook/react-vite';
import { GuidelineBox } from './GuidelineBox';

const meta = {
  title: 'Features/Widgets/NamingConvention/GuidelineBox',
  component: GuidelineBox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GuidelineBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: 'Frontend - Variable',
    description:
      '데이터를 담는 변수는 주로 camelCase를 사용합니다. boolean 타입은 is, has 등을 접두어로 붙입니다.',
  },
  render: (args) => (
    <div className="w-[500px] rounded-lg bg-gray-900 p-4">
      <GuidelineBox {...args} />
    </div>
  ),
};

export const FrontendVariable: Story = {
  args: {
    category: 'Frontend - Variable',
    description:
      '데이터를 담는 변수는 주로 camelCase를 사용합니다. boolean 타입은 is, has 등을 접두어로 붙입니다.',
  },
  render: (args) => (
    <div className="w-[500px] rounded-lg bg-gray-900 p-4">
      <GuidelineBox {...args} />
    </div>
  ),
};

export const FrontendComponent: Story = {
  args: {
    category: 'Frontend - Component',
    description:
      'React 컴포넌트는 PascalCase를 사용해야 합니다. 파일명과 컴포넌트명을 일치시키는 것이 좋습니다.',
  },
  render: (args) => (
    <div className="w-[500px] rounded-lg bg-gray-900 p-4">
      <GuidelineBox {...args} />
    </div>
  ),
};

export const BackendClass: Story = {
  args: {
    category: 'Backend - Class',
    description:
      '클래스명은 명사여야 하며 PascalCase를 사용하는 것이 일반적입니다.',
  },
  render: (args) => (
    <div className="w-[500px] rounded-lg bg-gray-900 p-4">
      <GuidelineBox {...args} />
    </div>
  ),
};

export const LongDescription: Story = {
  args: {
    category: 'Frontend - Function',
    description:
      '함수는 동작을 나타내므로 동사로 시작하는 camelCase를 권장합니다. 예를 들어 handleSubmit, fetchUserData, calculateTotal 등의 네이밍이 좋습니다. 함수명은 가능한 한 명확하고 간결하게 작성하여 코드의 가독성을 높이는 것이 중요합니다.',
  },
  render: (args) => (
    <div className="w-[500px] rounded-lg bg-gray-900 p-4">
      <GuidelineBox {...args} />
    </div>
  ),
};
