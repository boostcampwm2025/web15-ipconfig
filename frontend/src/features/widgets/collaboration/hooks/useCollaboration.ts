import type { CollaborationData } from '../components/CollaborationWidget';

interface UseCollaborationProps {
  data: CollaborationData;
  onDataChange: (data: CollaborationData) => void;
}

export function useCollaboration({
  data,
  onDataChange,
}: UseCollaborationProps) {
  const updatePRRules = (prRules: Partial<CollaborationData['prRules']>) => {
    onDataChange({
      ...data,
      prRules: { ...data.prRules, ...prRules },
    });
  };

  const updateReviewPolicy = (
    reviewPolicy: Partial<CollaborationData['reviewPolicy']>,
  ) => {
    onDataChange({
      ...data,
      reviewPolicy: { ...data.reviewPolicy, ...reviewPolicy },
    });
  };

  const updateWorkflow = (workflow: Partial<CollaborationData['workflow']>) => {
    onDataChange({
      ...data,
      workflow: { ...data.workflow, ...workflow },
    });
  };

  return {
    prRules: data.prRules,
    reviewPolicy: data.reviewPolicy,
    workflow: data.workflow,
    actions: {
      updatePRRules,
      updateReviewPolicy,
      updateWorkflow,
    },
  };
}
