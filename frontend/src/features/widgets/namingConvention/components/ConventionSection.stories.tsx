import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConventionSection } from './ConventionSection';
import { useState } from 'react';
import type {
  NamingCase,
  FrontendNamingConvention,
  BackendNamingConvention,
} from '../types/namingConvention';

const meta = {
  title: 'Features/Widgets/NamingConvention/ConventionSection',
  component: ConventionSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConventionSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFrontendConvention: FrontendNamingConvention = {
  variable: 'camelCase',
  function: 'camelCase',
  component: 'PascalCase',
  constant: 'UPPER_SNAKE_CASE',
};

const defaultBackendConvention: BackendNamingConvention = {
  variable: 'camelCase',
  function: 'camelCase',
  class: 'PascalCase',
  constant: 'UPPER_SNAKE_CASE',
};

export const FrontendSection: Story = {
  args: {
    category: 'frontend',
    title: 'Frontend',
    titleColor: 'text-indigo-400',
    convention: defaultFrontendConvention,
    onChange: () => {},
    onHover: () => {},
  },
  render: () => {
    const [convention, setConvention] = useState<FrontendNamingConvention>(
      defaultFrontendConvention,
    );

    const handleChange = (key: string, value: NamingCase) => {
      setConvention((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    const handleHover = (_key: string, _label: string) => {};

    return (
      <div className="w-[500px] rounded-lg bg-gray-900 p-4">
        <ConventionSection
          category="frontend"
          title="Frontend"
          titleColor="text-indigo-400"
          convention={convention}
          onChange={handleChange}
          onHover={handleHover}
        />
      </div>
    );
  },
};

export const BackendSection: Story = {
  args: {
    category: 'backend',
    title: 'Backend',
    titleColor: 'text-green-400',
    convention: defaultBackendConvention,
    onChange: () => {},
    onHover: () => {},
  },
  render: () => {
    const [convention, setConvention] = useState<BackendNamingConvention>(
      defaultBackendConvention,
    );

    const handleChange = (key: string, value: NamingCase) => {
      setConvention((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    const handleHover = (_key: string, _label: string) => {};

    return (
      <div className="w-[500px] rounded-lg bg-gray-900 p-4">
        <ConventionSection
          category="backend"
          title="Backend"
          titleColor="text-green-400"
          convention={convention}
          onChange={handleChange}
          onHover={handleHover}
        />
      </div>
    );
  },
};

export const BothSections = {
  args: {
    category: 'frontend',
    title: 'Frontend',
    titleColor: 'text-indigo-400',
    convention: defaultFrontendConvention,
    onChange: () => {},
    onHover: () => {},
  },
  render: () => {
    const [frontendConvention, setFrontendConvention] =
      useState<FrontendNamingConvention>(defaultFrontendConvention);
    const [backendConvention, setBackendConvention] =
      useState<BackendNamingConvention>(defaultBackendConvention);

    return (
      <div className="w-[500px] space-y-4 rounded-lg bg-gray-900 p-4">
        <ConventionSection
          category="frontend"
          title="Frontend"
          titleColor="text-indigo-400"
          convention={frontendConvention}
          onChange={(key, value) => {
            setFrontendConvention((prev) => ({
              ...prev,
              [key]: value,
            }));
          }}
          onHover={(_key, _label) => {}}
        />
        <div className="my-4 border-t border-gray-700" />
        <ConventionSection
          category="backend"
          title="Backend"
          titleColor="text-green-400"
          convention={backendConvention}
          onChange={(key, value) => {
            setBackendConvention((prev) => ({
              ...prev,
              [key]: value,
            }));
          }}
          onHover={(_key, _label) => {}}
        />
      </div>
    );
  },
};

export const WithCustomValues: Story = {
  args: {
    category: 'frontend',
    title: 'Frontend',
    titleColor: 'text-indigo-400',
    convention: defaultFrontendConvention,
    onChange: () => {},
    onHover: () => {},
  },
  render: () => {
    const [convention, setConvention] = useState<FrontendNamingConvention>({
      variable: 'snake_case',
      function: 'kebab-case',
      component: 'PascalCase',
      constant: 'UPPER_SNAKE_CASE',
    });

    const handleChange = (key: string, value: NamingCase) => {
      setConvention((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    return (
      <div className="w-[500px] rounded-lg bg-gray-900 p-4">
        <ConventionSection
          category="frontend"
          title="Frontend"
          titleColor="text-indigo-400"
          convention={convention}
          onChange={handleChange}
          onHover={(_key, _label) => {}}
        />
      </div>
    );
  },
};
