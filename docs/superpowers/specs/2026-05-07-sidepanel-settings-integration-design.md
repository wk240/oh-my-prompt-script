# SidePanel 设置视图集成设计

> 将 backup、settings、api-config 三个独立页面合并到 SidePanel，解决权限恢复问题并简化架构。

## 背景

### 当前问题

1. **权限恢复失败**：SidePanel 打开时尝试自动恢复文件夹权限，但用户手势已被 Chrome 消耗（用于打开 SidePanel），导致 `requestPermission()` 调用失败
2. **代码膨胀**：SidePanelApp.tsx 2075 行，三个配置页面共 1342 行，维护困难
3. **入口分散**：用户需要在不同标签页间跳转完成配置

### 核心洞察

- Content Script 中的权限恢复能成功，因为点击按钮产生新手势，权限请求在同步消息链中执行
- SidePanel 内用户点击按钮同样产生新手势，可用于权限请求
- 关键区别：**自动恢复**（无手势）vs **用户主动触发**（有手势）

## 设计决策

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 设置入口 | 全屏视图切换 | 保持界面简洁，设置完成后返回主界面 |
| 设置内布局 | 顶部标签栏 | 功能分组清晰，切换便捷 |
| 标签划分 | 备份 / Vision / 导入导出 | 功能导向，各标签职责独立 |
| 历史版本布局 | 卡片列表 | 适配 SidePanel 窄屏（~320px） |
| Vision 配置 | 表单样式 | 与 popup 一致，简单直接 |
| 架构方案 | 组件拆分 + 懒加载 | 主界面性能不受设置代码影响 |

## 架构

### 文件结构

```
src/sidepanel/
├── SidePanelApp.tsx          # 主入口，视图切换（~100行）
├── views/
│   ├── PromptListView.tsx    # 提示词列表视图（从 SidePanelApp 提取）
│   └── SettingsView.tsx      # 设置视图容器，标签切换（懒加载）
├── settings/
│   ├── BackupSection.tsx     # 备份标签内容
│   ├── VisionSection.tsx     # Vision 标签内容
│   ├── ImportExportSection.tsx # 导入导出标签内容
│   └── components/
│       ├── BackupStatusCard.tsx    # 同步状态卡片
│       ├── VersionCard.tsx         # 单个历史版本卡片
│       └── RestoreDialog.tsx       # 恢复确认对话框
```

### 移除文件

- `src/popup/backup.html`
- `src/popup/backup.tsx`
- `src/popup/settings.html`
- `src/popup/settings.tsx`
- `src/popup/api-config.html`
- `src/popup/api-config.tsx`

## 视图切换逻辑

### SidePanelApp.tsx

```tsx
const [currentView, setCurrentView] = useState<'prompts' | 'settings'>('prompts')

// 设置图标点击 → setCurrentView('settings')
// 返回按钮点击 → setCurrentView('prompts')

// 懒加载设置视图（不影响主界面首次加载）
const SettingsView = lazy(() => import('./views/SettingsView'))

return (
  currentView === 'prompts' 
    ? <PromptListView onOpenSettings={() => setCurrentView('settings')} />
    : <Suspense fallback={<Loading />}>
        <SettingsView onBack={() => setCurrentView('prompts')} />
      </Suspense>
)
```

### SettingsView.tsx

```tsx
const [activeTab, setActiveTab] = useState<'backup' | 'vision' | 'import-export'>('backup')

return (
  <div className="settings-view">
    <header>
      <button onClick={onBack}>返回</button>
      <h1>设置</h1>
    </header>
    
    <div className="tabs">
      <button onClick={() => setActiveTab('backup')}>备份</button>
      <button onClick={() => setActiveTab('vision')}>Vision</button>
      <button onClick={() => setActiveTab('import-export')}>导入导出</button>
    </div>
    
    <div className="tab-content">
      {activeTab === 'backup' && <BackupSection />}
      {activeTab === 'vision' && <VisionSection />}
      {activeTab === 'import-export' && <ImportExportSection />}
    </div>
  </div>
)
```

## 各标签内容

### 备份标签 (BackupSection.tsx)

**组件：**
- 文件夹选择按钮（`showDirectoryPicker()`）
- 同步状态卡片（BackupStatusCard）
  - 显示：文件夹名称、权限状态、上次同步时间
  - 状态：已启用同步 / 权限需恢复 / 未配置
- 手动备份按钮
- 历史版本卡片列表（VersionCard[]）
- 恢复确认对话框（RestoreDialog）

**权限恢复流程：**
```
用户点击「恢复权限」按钮 ← 产生新用户手势
    ↓
调用 handle.requestPermission() ← 在手势上下文中，成功 ✅
    ↓
权限授予，触发同步
```

### 历史版本卡片 (VersionCard.tsx)

```tsx
<div className="version-card">
  <div className="version-header">
    <span className="version-time">2024-01-15 14:30</span>
    <span className="version-count">12 条提示词</span>
  </div>
  <div className="version-actions">
    <button onClick={handleRestore}>恢复</button>
  </div>
</div>
```

样式：卡片间距 8px，圆角 8px，浅灰背景。

### Vision 标签 (VisionSection.tsx)

**组件：**
- 提供商下拉选择（OpenAI / Anthropic / Google）
- API Key 输入框
- 保存按钮
- 测试连接按钮（可选）

保持与 ApiConfigApp.tsx 一致的表单样式。

### 导入导出标签 (ImportExportSection.tsx)

**组件：**
- 导出按钮 → 触发 JSON 文件下载
- 导入按钮 → 打开文件选择器 → 合并数据

保持与 SettingsApp.tsx 中导入导出部分一致的逻辑。

## 消息处理更新

### 需更新的消息类型

| 消息 | 当前行为 | 新行为 |
|------|----------|--------|
| `OPEN_BACKUP_PAGE` | 新标签页打开 backup.html | 不再需要，SidePanel 内直接操作 |
| `OPEN_SETTINGS_PAGE` | 新标签页打开 settings.html | 不再需要 |
| `OPEN_API_CONFIG_PAGE` | 新标签页打开 api-config.html | 不再需要 |
| `GET_SYNC_STATUS` | popup 调用 | SidePanel 备份标签调用 |
| `RESTORE_PERMISSION` | popup 调用 | SidePanel 备份标签调用（用户点击按钮触发） |

### 移除的消息处理

Service worker 中移除：
- `case MessageType.OPEN_BACKUP_PAGE`
- `case MessageType.OPEN_SETTINGS_PAGE`
- `case MessageType.OPEN_API_CONFIG_PAGE`

## 依赖关系

```
SidePanelApp
    ├── PromptListView（提取现有逻辑）
    │   └── 现有组件（DropdownContainer, PromptPreviewModal 等）
    │
    └── SettingsView（懒加载）
        ├── BackupSection
        │   ├── BackupStatusCard
        │   ├── VersionCard[]
        │   └── RestoreDialog
        │   └── 使用：sync-manager.ts, file-sync.ts
        │
        ├── VisionSection
        │   └── 使用：vision-api.ts, storage.ts
        │
        └── ImportExportSection
            │   └── 使用：import-export.ts, storage.ts
```

## 实现步骤

1. 创建目录结构和新组件文件
2. 从 SidePanelApp 提取 PromptListView
3. 创建 SettingsView 标签容器
4. 迁移 BackupApp → BackupSection（适配窄屏卡片布局）
5. 迁移 ApiConfigApp → VisionSection
6. 迁移 SettingsApp 导入导出部分 → ImportExportSection
7. 更新 SidePanelApp 视图切换逻辑
8. 移除旧 popup 文件和消息处理
9. 测试权限恢复流程
10. 测试所有设置功能

## 测试要点

1. **权限恢复**：在 SidePanel 内点击「恢复权限」按钮，确认权限授予成功
2. **文件夹选择**：在 SidePanel 内点击「选择文件夹」，确认 `showDirectoryPicker()` 正常弹出
3. **视图切换**：主界面 ↔ 设置切换流畅，无闪烁
4. **懒加载**：首次打开 SidePanel 不加载设置代码，点击设置后才加载
5. **历史版本**：卡片列表正确显示，恢复对话框正常工作
6. **Vision 配置**：API Key 保存和测试连接正常
7. **导入导出**：文件读写正常，数据合并正确

## 风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| 窄屏样式适配问题 | 提取 CSS 变量统一管理，测试时覆盖各种宽度 |
| 迁移遗漏功能 | 对比原页面功能清单，逐一验证 |
| 消息处理遗漏移除 | 清理 service-worker.ts 中相关 case |

## 成功标准

- SidePanel 打开后，用户可在设置视图内完成所有配置（无需跳转新标签页）
- 权限恢复在用户点击按钮时成功（不再失败）
- 代码结构清晰，SidePanelApp.tsx < 200 行
- 设置视图懒加载，主界面首次加载不受影响