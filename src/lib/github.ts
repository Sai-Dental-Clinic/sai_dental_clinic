const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const OWNER = process.env.GITHUB_OWNER || 'Sai-Dental-Clinic'
const REPO = process.env.GITHUB_REPO || 'sai_dental_clinic'
const BRANCH = 'main'

const API_BASE = 'https://api.github.com'

interface GitHubFile {
  content: string
  encoding: string
  sha?: string
}

async function githubRequest(
  method: string,
  path: string,
  body?: unknown,
): Promise<any> {
  const url = `${API_BASE}${path}`
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'sai-dental-blog',
  }

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub API error ${res.status}: ${err}`)
  }

  return res.json()
}

function encodeBase64(data: string): string {
  return Buffer.from(data, 'utf-8').toString('base64')
}

function decodeBase64(data: string): string {
  return Buffer.from(data, 'base64').toString('utf-8')
}

export async function getFile(path: string): Promise<GitHubFile | null> {
  try {
    return await githubRequest('GET', `/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`)
  } catch {
    return null
  }
}

export async function createOrUpdateFile(
  path: string,
  content: string,
  message: string,
  encode: 'base64' | 'utf8' = 'utf8',
): Promise<void> {
  const existing = await getFile(path)
  const body: any = {
    message,
    branch: BRANCH,
  }

  if (encode === 'base64') {
    body.content = content
  } else {
    body.content = encodeBase64(content)
  }

  if (existing?.sha) {
    body.sha = existing.sha
  }

  await githubRequest('PUT', `/repos/${OWNER}/${REPO}/contents/${path}`, body)
}

export async function listDirectory(path: string): Promise<{ name: string; type: string; download_url: string | null }[]> {
  try {
    const data = await githubRequest('GET', `/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function getFileContent(path: string): Promise<string | null> {
  try {
    const data = await githubRequest('GET', `/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`)
    if (data?.content && data?.encoding === 'base64') {
      return decodeBase64(data.content)
    }
    return null
  } catch {
    return null
  }
}

export async function deleteFile(path: string, message: string): Promise<void> {
  const existing = await getFile(path)
  if (!existing?.sha) return
  await githubRequest('DELETE', `/repos/${OWNER}/${REPO}/contents/${path}`, {
    message,
    branch: BRANCH,
    sha: existing.sha,
  })
}

export function isProduction(): boolean {
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
}

export function hasGitHubToken(): boolean {
  return !!GITHUB_TOKEN
}
