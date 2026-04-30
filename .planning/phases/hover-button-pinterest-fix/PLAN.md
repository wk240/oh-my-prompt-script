# Hover Button Pinterest 兼容性修复计划

## Context

**问题根源：** `ImageHoverButtonManager` 在 Pinterest 上无法正常显示 hover button，原因是：

1. **现代 CSS 定位未被识别**：Pinterest 使用 `transform`、`contain` 创建层叠上下文（而非传统 `position`），当前 `isPositioned()` 只检测 `position` 属性
2. **遮罩层在监听容器外**：Pinterest hover 时显示的遮罩层（`contentLayer`）是图片容器的兄弟元素，鼠标移入遮罩触发容器的 `mouseleave` → button 消失
3. **尺寸限制过严**：`maxSizeOK` 限制容器不能超过 5x 图片大小，Pinterest grid-item 可能刚好超过

**影响：** 用户无法在 Pinterest 图片上使用"图片转提示词"功能。

---

## 问题分析

### Pinterest Feed 列表页结构

```
data-grid-item (transform 定位，当前不识别)
  └─ pinWrapper
      ├─ a > img (当前监听 a)
      └─ contentLayer (遮罩，兄弟元素，不在监听范围内)
```

**结果：** 鼠标移入遮罩 → `a.mouseleave` → button 消失

### Pinterest 详情页结构

```
div (contain: strict, 当前不识别)
  └─ closeup-image-main > ... > div (parent，无定位属性)
      └─ img
```

**结果：** 找不到定位容器 → fallback 到 `parent` → `parent` 无定位 → 无法正确捕获 hover

---

## 修改方案

### 修改 1：扩展 `isPositioned()` 检测范围

**文件：** `src/content/image-hover-button-manager.tsx`
**位置：** 第 343-347 行

**当前代码：**
```typescript
private isPositioned(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el)
  const position = style.position
  return position === 'relative' || position === 'absolute' || position === 'fixed' || position === 'sticky'
}
```

**修改为：**
```typescript
private isPositioned(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el)

  // 传统定位
  if (['relative', 'absolute', 'fixed', 'sticky'].includes(style.position)) {
    return true
  }

  // 现代层叠上下文创建方式（Pinterest 等现代网站使用）
  if (style.transform !== 'none') return true
  if (style.contain !== 'none') return true
  if (style.willChange !== 'auto') return true

  return false
}
```

**原因：** `transform` 和 `contain` 都会创建新的层叠上下文，其子元素的事件会被该容器捕获，这是现代网站常用的定位方式。

---

### 修改 2：放宽容器尺寸上限

**文件：** `src/content/image-hover-button-manager.tsx`
**位置：** 第 291-292 行

**当前代码：**
```typescript
const minSizeOK = widthRatio >= 1.0 && heightRatio >= 1.0
const maxSizeOK = widthRatio <= 5 && heightRatio <= 5
```

**修改为：**
```typescript
const minSizeOK = widthRatio >= 1.0 && heightRatio >= 1.0
// 放宽上限：Pinterest grid-item 可能超过 5x，移除上限限制
// 只保留最小限制确保有足够的鼠标活动空间
const maxSizeOK = true // 不限制最大尺寸
```

**原因：**
- 上限的初衷是避免选择整个页面作为容器（如 `<body>`）
- 但实际 DOM 树遍历会在找到合适容器后停止（`bestSizeRatio >= 1.5` 时 break）
- `body` 通常距离 img 很远，遍历到中间层就会找到合适的容器
- Pinterest grid-item 虽大但仍是最合适的容器（包含图片和遮罩）

---

### 修改 3：优先选择包含遮罩层的容器

**文件：** `src/content/image-hover-button-manager.tsx`
**位置：** 第 267 行，在现有逻辑前添加

**新增逻辑：**
```typescript
private findBestHoverTarget(img: HTMLImageElement): HTMLElement {
  // 策略 0：优先找同时包含图片和潜在遮罩的容器
  // 遮罩层通常是图片容器的兄弟元素，需要找更上层的共同父容器
  const imgWrapper = img.parentElement
  if (imgWrapper && imgWrapper.parentElement) {
    const grandParent = imgWrapper.parentElement
    // 如果 img 的父元素有兄弟节点（多个子元素），说明可能有遮罩
    if (grandParent.children.length > 1 && this.isPositioned(grandParent)) {
      const grandParentRect = grandParent.getBoundingClientRect()
      const imgRect = img.getBoundingClientRect()
      // 检查 grandParent 是否比 img 大（包含遮罩）
      if (grandParentRect.width >= imgRect.width && grandParentRect.height >= imgRect.height) {
        return grandParent
      }
    }
  }

  // 策略 1：Pinterest 特定标识（可选，作为兜底）
  const pinWrapper = img.closest('[data-test-id="pinWrapper"]')
  if (pinWrapper && this.isPositioned(pinWrapper as HTMLElement)) {
    return pinWrapper as HTMLElement
  }

  // ... 原有逻辑作为 fallback ...
}
```

**原因：**
- 遮罩层通常是图片直接父容器的兄弟元素
- 选择祖父容器可以同时包含图片和遮罩
- 这样鼠标移入遮罩时不会触发容器的 `mouseleave`

---

### 修改 4：增强 `handleImageMouseLeave` 的智能判断

**文件：** `src/content/image-hover-button-manager.tsx`
**位置：** 第 393-426 行

**当前逻辑：** 鼠标离开时总是延迟隐藏

**新增判断：**
```typescript
private handleImageMouseLeave(img: HTMLImageElement, event: MouseEvent): void {
  // 检查 relatedTarget - 鼠标移到哪里
  const relatedTarget = event.relatedTarget as HTMLElement | null

  // 如果移到的是监听容器的子元素（如遮罩层），不隐藏
  const hoverTarget = this.hoverHandlers.get(img)?.target
  if (hoverTarget && relatedTarget) {
    if (hoverTarget.contains(relatedTarget)) {
      // 鼠标仍在监听容器内，取消隐藏
      return
    }
  }

  // ... 原有隐藏逻辑 ...
}
```

**原因：** 有时遮罩层虽然视觉上覆盖图片，但仍在监听容器内，`mouseleave` 的 `relatedTarget` 可以判断是否真的离开了容器。

---

## 修改优先级

| 优先级 | 修改 | 预期效果 | 风险 |
|--------|------|---------|------|
| **P0** | 扩展 `isPositioned()` | 识别 transform/contain 容器 | 低，只是扩展检测范围 |
| **P1** | 放宽尺寸上限 | 选择更大的容器 | 低，遍历逻辑已有保护 |
| **P2** | 优先选择含遮罩容器 | 直接解决 Pinterest 问题 | 中，需要验证其他网站 |
| **P3** | 增强 mouseleave 判断 | 兜底保护 | 低，只是额外判断 |

建议先实现 P0 + P1，验证效果后再考虑 P2。

---

## 验证步骤

1. **本地测试：** `npm run dev` 加载插件
2. **Pinterest Feed 测试：**
   - 打开 Pinterest 首页
   - 鼠标悬停在图片上
   - 等待 Pinterest 遮罩出现
   - 验证 hover button 是否仍然显示
3. **Pinterest 详情页测试：**
   - 点击图片进入详情页
   - 验证 hover button 是否出现
4. **其他网站回归测试：**
   - Lovart、ChatGPT、Claude.ai 等已有平台
   - 验证 hover button 功能正常

---

## 涉及文件

- `src/content/image-hover-button-manager.tsx` — 主要修改文件
  - `isPositioned()` (第 343-347 行)
  - `findBestHoverTarget()` (第 267-338 行)
  - `handleImageMouseLeave()` (第 393-426 行)