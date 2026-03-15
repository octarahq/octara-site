import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'server', 'status-snapshot.json')
    const data = await fs.promises.readFile(filePath, 'utf8')
    const json = JSON.parse(data)
    return NextResponse.json(json)
  } catch (err) {
    const e: any = err
    if (e && e.code === 'ENOENT') {
      const g: any = globalThis as any
      if (g && g.__octara_status_projects_snapshot) {
        return NextResponse.json(g.__octara_status_projects_snapshot)
      }
      return NextResponse.json({ projects: [] })
    }
    
    const g: any = globalThis as any
    if (g && g.__octara_status_projects_snapshot) {
      return NextResponse.json(g.__octara_status_projects_snapshot)
    }
    return NextResponse.json({ error: 'failed to read snapshot' }, { status: 500 })
  }
}
