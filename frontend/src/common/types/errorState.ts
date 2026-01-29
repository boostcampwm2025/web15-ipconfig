export type ErrorState =
  | {
      title?: string;
      message?: string;
      status?: number;
    }
  | undefined
  | null;
