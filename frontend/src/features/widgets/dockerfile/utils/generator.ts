import type { DockerfileData } from '@/common/types/yjsWidgetContent';

const generateNodeDockerfile = (content: DockerfileData): string => {
  const {
    version = '22',
    port = 3000,
    packageManager = 'npm',
    command = 'npm run dev',
  } = content;

  // 커맨드를 공백으로 분리하여 exec form으로 변환
  const rawParts = command.split(' ').filter(Boolean);
  const cmdParts = ['npm', 'yarn', 'pnpm', 'bun'].includes(rawParts[0])
    ? [packageManager, ...rawParts.slice(1)]
    : rawParts;
  const cmdInstruction = JSON.stringify(cmdParts);

  return `# Node.js Dockerfile
FROM node:${version}-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* bun.lockb* ./

RUN ${packageManager} install

COPY . .

ENV NODE_ENV=development
ENV HOSTNAME="0.0.0.0"

EXPOSE ${port}

CMD ${cmdInstruction}`;
};

export const generateDockerfile = (content: DockerfileData): string => {
  switch (content.framework) {
    case 'Node.js':
      return generateNodeDockerfile(content);
    default:
      return '# Select a framework to generate Dockerfile';
  }
};
