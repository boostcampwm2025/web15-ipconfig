export const COMMUNICATION_OPTIONS = {
  urgent: ['Phone', 'Slack Huddle', 'Zoom'],
  sync: ['Slack', 'Discord', 'Teams'],
  async: ['Notion', 'Jira', 'GitHub', 'Figma'],
  official: ['Email', 'Slack Channel', 'Townhall'],
};

export const CORE_TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  return `${i.toString().padStart(2, '0')}:00`;
});
