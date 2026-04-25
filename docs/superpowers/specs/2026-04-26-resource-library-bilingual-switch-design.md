# 资源库提示词中英双语切换功能设计

## 概述

为资源库的 276 条提示词增加中英双语切换功能，允许用户在浏览和插入提示词时选择中文或英文版本。

## 需求确认

- **切换范围**：名称 + 内容都切换
- **偏好保存**：全局设置，持久化到 chrome.storage.local
- **数据来源**：用户提供的翻译数据（JSON 中添加英文字段）
- **UI 位置**：资源库列表顶部全局切换 + 详情弹窗内单独切换

## 数据结构扩展

### 1. ResourcePrompt 类型扩展

文件：`src/shared/types.ts`

```typescript
export interface ResourcePrompt extends Prompt {
  sourceCategory?: string
  previewImage?: string
  author?: string
  authorUrl?: string
  // 新增双语字段（optional，支持渐进式翻译）
  nameEn?: string      // 英文名称
  contentEn?: string   // 英文内容
}
```

### 2. SyncSettings 类型扩展

文件：`src/shared/types.ts`

```typescript
export interface SyncSettings {
  showBuiltin: boolean
  syncEnabled: boolean
  lastSyncTime?: number
  hasUnsyncedChanges?: boolean
  dismissedBackupWarning?: boolean
  // 新增语言偏好
  resourceLanguage?: 'zh' | 'en'  // 默认 'zh'
}
```

### 3. JSON 数据格式

文件：`src/data/resource-library/prompts.json`

每条提示词增加英文字段：

```json
{
  "id": "resource-gpt-image-0",
  "name": "杜甫 X 平台推文截图",
  "nameEn": "Du Fu X Platform Tweet Screenshot",
  "content": "...中文内容...",
  "contentEn": "...English content...",
  ...
}
```

## UI 设计

### 位置 A：资源库列表顶部

在 `DropdownContainer.tsx` 中，资源库模式下在 header 区域增加语言切换按钮：

- 显示位置：与"检查更新"、"备份"等按钮并列，或单独一行
- 样式：简洁的 [中文/EN] 切换按钮
- 仅在资源库模式（`isResourceLibrary === true`）时显示
- 点击后立即更新 storage 并刷新列表显示

### 位置 B：详情弹窗内

在 `PromptPreviewModal.tsx` 中，内容区域下方增加切换按钮：

- 显示位置：内容文本下方，footer 上方
- 样式：[中文版本 / 英文版本] 二选一按钮组
- 默认选中全局偏好语言
- 点击切换仅影响当前弹窗预览
- 插入按钮使用弹窗内当前选择的语言版本

## 组件改动范围

| 文件 | 改动内容 |
|------|----------|
| `types.ts` | 添加 `nameEn`, `contentEn`, `resourceLanguage` 字段定义 |
| `resource-library.ts` | 添加 `getResourcePromptsByLanguage()` 语言过滤函数 |
| `DropdownContainer.tsx` | 顶部语言切换按钮 + 读取/写入语言偏好 |
| `NetworkPromptCard.tsx` | 接收语言偏好 prop，显示对应语言的名称和内容 |
| `PromptPreviewModal.tsx` | 弹窗内语言切换按钮 + 使用弹窗语言版本插入 |
| `store.ts` | 语言偏好读写接口（可选，可直接在组件中使用 chrome.storage） |

## 数据加载逻辑

文件：`src/lib/resource-library.ts`

新增函数：

```typescript
/**
 * 根据语言偏好返回提示词列表
 * 将原始提示词的 name/content 替换为对应语言版本
 */
export function getResourcePromptsByLanguage(lang: 'zh' | 'en'): ResourcePrompt[] {
  const prompts = getResourcePrompts()
  return prompts.map(p => ({
    ...p,
    name: lang === 'en' && p.nameEn ? p.nameEn : p.name,
    content: lang === 'en' && p.contentEn ? p.contentEn : p.content,
  }))
}
```

## 状态管理

### 初始化流程

1. DropdownContainer 打开时，从 chrome.storage.local 读取 `settings.resourceLanguage`
2. 默认值为 'zh'（首次使用）
3. 资源库模式下调用 `getResourcePromptsByLanguage()` 应用语言过滤
4. 传递语言偏好到 NetworkPromptCard 组件

### 切换流程

**全局切换**：
1. 用户点击顶部切换按钮
2. 更新 chrome.storage.local 中的 `settings.resourceLanguage`
3. 刷新资源库列表显示（使用新语言版本）

**弹窗内切换**：
1. 用户在详情弹窗内点击切换按钮
2. 仅更新弹窗本地状态，不影响全局设置
3. 预览内容立即切换
4. 插入时使用弹窗内当前选择的语言版本

## 插入行为

| 场景 | 插入内容来源 |
|------|-------------|
| 卡片直接注入（一键注入按钮） | 使用全局语言偏好 |
| 弹窗内插入按钮 | 使用弹窗内当前选择的语言版本（覆盖全局） |

## 错误处理

- 如果某条提示词缺少英文版本（`nameEn` 或 `contentEn` 为空），显示中文版本作为 fallback
- 切换到英文时，列表中所有提示词都应用 fallback 规则，无需特殊提示

## 数据准备

用户需提供的翻译数据：
- 276 条提示词的 `nameEn` 和 `contentEn` 字段
- JSON 格式，直接合并到现有 `prompts.json`

## 测试要点

1. 全局切换按钮正常工作，偏好持久化
2. 弹窗内切换不影响全局设置
3. 插入内容使用正确的语言版本
4. 缺少英文字段时正确 fallback 到中文
5. 刷新页面后语言偏好保持