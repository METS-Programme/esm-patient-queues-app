export function requireWorkspaceProps<T extends object>(workspaceProps: T | null, workspaceName: string): T {
  if (!workspaceProps) {
    throw new Error(`${workspaceName} requires workspace props`);
  }

  return workspaceProps;
}
