import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConventionRow } from './ConventionRow';
import { useState } from 'react';
import type { NamingCase } from '../types/namingConvention';

const meta = {
  title: 'Features/Widgets/NamingConvention/ConventionRow',
  component: ConventionRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConventionRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Variable',
    value: 'camelCase' as NamingCase,
    onChange: () => {},
    onHover: () => {},
  },
  render: () => {
    const [value, setValue] = useState<NamingCase>('camelCase');

    return (
      <div className="w-[400px] rounded-lg bg-gray-900 p-4">
        <ConventionRow
          label="Variable"
          value={value}
          onChange={setValue}
          onHover={() => {}}
        />
      </div>
    );
  },
};

export const AllNamingCases: Story = {
  args: {
    label: 'Variable',
    value: 'camelCase' as NamingCase,
    onChange: () => {},
    onHover: () => {},
  },
  render: () => {
    const [variable, setVariable] = useState<NamingCase>('camelCase');
    const [functionName, setFunctionName] = useState<NamingCase>('camelCase');
    const [component, setComponent] = useState<NamingCase>('PascalCase');
    const [constant, setConstant] = useState<NamingCase>('UPPER_SNAKE_CASE');

    return (
      <div className="w-[400px] space-y-1 rounded-lg bg-gray-900 p-4">
        <ConventionRow
          label="Variable"
          value={variable}
          onChange={setVariable}
          onHover={() => {}}
        />
        <ConventionRow
          label="Function"
          value={functionName}
          onChange={setFunctionName}
          onHover={() => {}}
        />
        <ConventionRow
          label="Component"
          value={component}
          onChange={setComponent}
          onHover={() => {}}
        />
        <ConventionRow
          label="Constant"
          value={constant}
          onChange={setConstant}
          onHover={() => {}}
        />
      </div>
    );
  },
};

export const WithDifferentValues: Story = {
  args: {
    label: 'Variable',
    value: 'camelCase' as NamingCase,
    onChange: () => {},
    onHover: () => {},
  },
  render: () => {
    const cases: NamingCase[] = [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ];

    return (
      <div className="w-[400px] space-y-1 rounded-lg bg-gray-900 p-4">
        {cases.map((caseValue) => {
          const [value, setValue] = useState<NamingCase>(caseValue);
          return (
            <ConventionRow
              key={caseValue}
              label={caseValue}
              value={value}
              onChange={setValue}
              onHover={() => {}}
            />
          );
        })}
      </div>
    );
  },
};
