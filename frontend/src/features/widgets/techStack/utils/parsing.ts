export const parseSubject = (subject: string) => {
  const regex = /^\[(?<category>[^\]]+)\]\s*(?<option>\S.*)$/;

  const match = subject.match(regex);

  if (!match || !match.groups) return null;

  return {
    category: match.groups.category,
    option: match.groups.option,
  };
};
