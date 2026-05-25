import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(__dirname, '../../../..')

describe('UpdateGuideModal copy', () => {
  it('guides users through local backup folder setup and restore instead of manual import/export', () => {
    const source = readFileSync(
      resolve(repoRoot, 'src/content/components/UpdateGuideModal.tsx'),
      'utf8',
    )

    expect(source).toContain('设置本地备份文件夹')
    expect(source).toContain('恢复本地备份文件夹')
    expect(source).toContain('重新选择同一个备份文件夹')
    expect(source).not.toContain('导出数据备份')
    expect(source).not.toContain('导入数据恢复')
    expect(source).not.toContain('导出数据')
    expect(source).not.toContain('导入数据')
  })

  it('does not add action buttons to the first and last local backup steps', () => {
    const source = readFileSync(
      resolve(repoRoot, 'src/content/components/UpdateGuideModal.tsx'),
      'utf8',
    )

    expect(source).not.toContain('handleOpenBackupSettings')
    expect(source).not.toContain('打开备份设置')
    expect(source).not.toContain('打开恢复入口')
    expect(source).not.toContain('MessageType.OPEN_SIDEPANEL_FOR_SETTINGS')
  })
})
