---
status: testing
phase: 03-data-management-popup-ui
source: [03-01-SUMMARY.md, 03-04-SUMMARY.md, 03-05-SUMMARY.md, 03-06-SUMMARY.md, 03-07-SUMMARY.md, 03-08-SUMMARY.md, 03-09-SUMMARY.md]
started: 2026-04-16T13:05:00.000Z
updated: 2026-04-16T13:05:00.000Z
---

## Current Test

number: 1
name: Popup Opens and Displays Layout
expected: |
  点击浏览器扩展图标后：
  - Popup 窗口打开（300px宽度）
  - Header 显示 "Lovart Injector" 标题和导入/导出图标
  - 左侧显示分类侧边栏（80px宽度）
  - 右侧显示提示词列表区域
  - 底部显示 "添加提示词" 按钮
awaiting: user response

## Tests

### 1. Popup Opens and Displays Layout
expected: 点击扩展图标，Popup打开显示Header、分类侧边栏、提示词列表和底部按钮
result: pending

### 2. Category Selection Works
expected: 点击分类侧边栏中的分类，右侧提示词列表切换显示该分类下的提示词，选中分类有高亮背景
result: pending

### 3. Add New Prompt
expected: 点击底部"添加提示词"按钮，弹出对话框，填写名称和内容后保存，新提示词出现在列表中
result: pending

### 4. Edit Existing Prompt
expected: 点击提示词卡片的三点菜单 → "编辑"，对话框显示现有内容，修改后保存，列表更新显示新内容
result: pending

### 5. Delete Prompt with Confirmation
expected: 点击三点菜单 → "删除"，弹出确认对话框，确认后提示词从列表消失
result: pending

### 6. Add New Category
expected: 点击侧边栏底部的 "+" 按钮，输入分类名称保存，新分类出现在侧边栏列表中
result: pending

### 7. Delete Category Moves Prompts
expected: 悬停非默认分类显示删除图标，点击后弹出确认对话框（显示"提示词将移至默认分类"），确认后分类消失，其提示词移至默认分类
result: pending

### 8. Default Category Cannot Be Deleted
expected: 默认分类"默认分类"不显示删除图标，无法被删除
result: pending

### 9. Export Prompts to JSON
expected: 点击Header的下载图标，浏览器下载JSON文件，文件名格式为 lovart-prompts-{日期}.json
result: pending

### 10. Import Valid JSON
expected: 点击Header的上传图标，选择有效的JSON文件，显示"导入成功"提示，数据正确恢复
result: pending

### 11. Import Invalid JSON Shows Error
expected: 选择无效的JSON文件，显示"导入失败"错误提示
result: pending

### 12. Lovart Dropdown Shows Storage Data
expected: 在Lovart页面，触发按钮出现在输入框旁，点击后下拉菜单显示Popup中存储的提示词数据
result: pending

### 13. Lovart Dropdown Empty State
expected: 当没有提示词时，下拉菜单显示"暂无提示词，请在插件中添加"
result: pending

### 14. Lovart Dropdown Loading State
expected: 下拉菜单打开时先显示"加载中..."，然后显示提示词列表
result: pending

### 15. Data Persists After Browser Restart
expected: 关闭并重新打开浏览器/扩展，Popup中数据仍然存在（chrome.storage.local持久化）
result: pending

## Summary

total: 15
passed: 0
issues: 0
pending: 15
skipped: 0

## Gaps

[none yet]