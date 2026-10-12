export interface ProjectConfig {
  repositoryUrl: string | null;
  privateRemovalUrl: string | null;
  editorialUrl: string | null;
}
export function projectConfig(): ProjectConfig {
  const repository =
    process.env.NEXT_PUBLIC_REPOSITORY_URL ??
    'https://github.com/yuna-yang/chinese-diaspora-atlas';
  const contact =
    process.env.NEXT_PUBLIC_REMOVAL_URL ?? 'mailto:placeholder@example.invalid';
  const editorial =
    process.env.NEXT_PUBLIC_EDITORIAL_URL ??
    'mailto:placeholder@example.invalid';
  return {
    editorialUrl:
      /^mailto:[^@\s?]+@[^@\s?]+\.[^@\s?]+$/.test(editorial) &&
      !editorial.includes('example')
        ? editorial
        : null,
    repositoryUrl:
      repository &&
      /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(repository) &&
      !repository.includes('example')
        ? repository.replace(/\/$/, '')
        : null,
    privateRemovalUrl:
      contact &&
      (/^https:\/\/[^\s]+$/.test(contact) ||
        /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact)) &&
      !contact.includes('example')
        ? contact
        : null,
  };
}
export function issueUrl(
  template: 'add.yml' | 'correct.yml' | 'translate.yml' | 'remove.yml',
  id?: string,
) {
  const { repositoryUrl } = projectConfig();
  if (!repositoryUrl) return null;
  const query = new URLSearchParams({ template });
  if (id) query.set('organization_id', id);
  return `${repositoryUrl}/issues/new?${query}`;
}
