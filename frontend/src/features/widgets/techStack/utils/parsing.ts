export const parseSubject = (subject: string) => {
  const regex = /\[(?<category>[^\]]+)\]\s*(?<option>.+)/;
  const match = subject.match(regex);
  if (!match || !match.groups || !match.groups.category || !match.groups.option)
    return null;
  return {
    category: match.groups?.category,
    option: match.groups?.option,
  };
};
