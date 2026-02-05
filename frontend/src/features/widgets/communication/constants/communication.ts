export const COMMUNICATION_OPTIONS = {
  meeting: ['Phone', 'Slack Huddle', 'Zoom', 'Discord', 'Google Meet'],
  chat: ['Slack', 'Discord', 'Teams'],
  doc: ['Notion', 'Jira', 'GitHub', 'Figma'],
  announce: ['Email', 'Slack Channel', 'Townhall'],
};

export const CORE_TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  return `${i.toString().padStart(2, '0')}:00`;
});
