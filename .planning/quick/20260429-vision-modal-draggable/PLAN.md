---
slug: vision-modal-draggable
created: 2026-04-29
---

# VisionModal 弹窗改进：可拖动、可缩小、无遮罩

## 需求
- 点击其他区域不关闭（移除 overlay 点击关闭逻辑）
- 去除遮罩（移除半透明背景）
- 可拖动（通过 header 拖动整个弹窗）
- 可缩小（最小化到角落，点击展开）

## 实现方案

### 1. VisionModal.tsx 改动
- 添加 `isMinimized` state 控制最小化状态
- 添加 `position` state 记录弹窗位置 `{ x, y }`
- 添加拖动逻辑：mousedown on header → mousemove → mouseup
- 移除 overlay 的 `onClick` 关闭逻辑
- 最小化状态：缩小到右下角小卡片，显示标题和展开按钮
- Header 添加最小化按钮（Minus 图标）

### 2. vision-modal-manager.tsx 改动
- 移除 `.modal-overlay` 的背景色 `rgba(0,0,0,0.5)`
- 弹窗默认位置改为固定位置（右上角），便于拖动
- 添加 `.modal-card.minimized` 样式
- 添加 `.modal-header.draggable` cursor 样式

## 文件
- `src/content/components/VisionModal.tsx`
- `src/content/vision-modal-manager.tsx`