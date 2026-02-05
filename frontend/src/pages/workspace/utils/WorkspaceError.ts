export class WorkspaceError extends Error {
  status: number;
  title: string;

  constructor(status: number, title: string, message: string) {
    super(message);
    this.name = 'WorkspaceError';
    this.status = status;
    this.title = title;
  }
}
