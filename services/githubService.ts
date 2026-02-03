
import { User, FileNode } from '../types';

/**
 * REAL GitHub Integration Service
 * Uses GitHub REST API to interact with the user's account.
 */

function toBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
    return btoa(binString);
  } catch (err) {
    console.error('Base64 encoding failed:', err);
    return '';
  }
}

export async function createGitHubRepo(user: User, files: FileNode[]) {
  if (!user.accessToken || user.provider !== 'github') {
    throw new Error('Valid GitHub token required for sync.');
  }

  const repoName = `devhub-project-${Math.random().toString(36).substring(7)}`;
  const token = user.accessToken;

  try {
    // 1. Create Repository
    const createResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        description: 'Created via Developers Hub Pro IDE',
        private: false,
        auto_init: true
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(errorData.message || 'Failed to create repository');
    }

    const repoData = await createResponse.json();
    const owner = repoData.owner.login;

    // 2. Upload Files (Sequentially for simplicity in this example)
    for (const file of files) {
      if (!file.content) continue;

      const path = file.name;
      const contentBase64 = toBase64(file.content);

      await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add ${file.name} from Developers Hub`,
          content: contentBase64
        })
      });
    }

    return {
      success: true,
      name: repoName,
      url: repoData.html_url
    };
  } catch (err: any) {
    console.error('GitHub Sync Error:', err);
    throw err;
  }
}
