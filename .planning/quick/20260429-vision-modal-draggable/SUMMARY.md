---
slug: vision-modal-draggable
status: complete
created: 2026-04-29
completed: 2026-04-29
---

# VisionModal 弹窗改进 - 完成

## 实现内容
1. **点击其他区域不关闭** - 移除了 overlay 的 onClick 关闭逻辑
2. **去除遮罩** - `.modal-overlay` 背景改为透明，`pointer-events: none`
3. **可拖动** - 通过 header 区域 mousedown/mousemove/mouseup 实现拖动
4. **可缩小** - 添加最小化按钮，最小化时显示状态条和展开按钮

## 改动文件
- `src/content/components/VisionModal.tsx` - 添加拖动/最小化逻辑
- `src/content/vision-modal-manager.tsx` - 更新样式（无遮罩、最小化样式）

## 验证
- TypeScript 检查通过
- 构建成功