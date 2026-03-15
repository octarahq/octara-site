import { NextResponse } from 'next/server'

export const GET = async () => {
  const token = process.env.GITHUB_TOKEN || process.env.OCTARA_GITHUB_TOKEN
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
  if (token) headers.Authorization = `token ${token}`

  let page = 1
  let total = 0

  try {
    while (true) {
      const res = await fetch(`https://api.github.com/orgs/octarahq/repos?per_page=100&page=${page}`, {
        headers,
        next: { revalidate: 300 },
      })

      if (!res.ok) break
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) break

      total += data.reduce((s: number, r: any) => s + (r.stargazers_count || 0), 0)

      if (data.length < 100) break
      page += 1
    }
  } catch (e) {
    
  }

  return NextResponse.json({ total })
}
