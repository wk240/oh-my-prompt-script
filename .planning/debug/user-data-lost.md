---
status: fixed
trigger: 用户的数据丢失了 - 全部分类下用户数据没有正确加载出来
created: 2026-04-23
updated: 2026-04-23
---

## Symptoms

- **Expected behavior:** 用户之前添加的提示词和分类应该保留在 storage 中
- **Actual behavior:** 全部分类下看不到用户数据，prompts 为空数组
- **Error messages:** 无明确的错误信息
- **Timeline:** 最近发现数据丢失
- **Reproduction:** 打开下拉菜单 → 选择"全部分类" → 提示词列表为空

## Current Focus

hypothesis: bidirectional-sync-manager 的 cacheChanged 判断错误导致空数据覆盖
next_action: 验证修复方案并实施

## Evidence

- timestamp: 2026-04-23T-initial
  type: code_analysis
  source: tests/*.json backup files
  finding: 备份数据中 prompts 为空数组，categories 有7个内置分类
  details: |
    - omp-latest.json: prompts=[], categories=[7个内置分类]
    - 内置数据 BUILT_IN_PROMPTS 有46个提示词
    - 数据丢失发生在 backup 时间之前

- timestamp: 2026-04-23T-code-review
  type: code_review
  source: src/lib/store.ts + src/lib/storage.ts
  finding: 两处 getDefaultState/getDefaultData 不一致
  details: |
    **store.ts getDefaultState()** (第78-84行):
    ```typescript
    function getDefaultState() {
      return { prompts: [], categories: [] }  // 空数组！
    }
    ```
    
    **storage.ts getDefaultData()** (第63-70行):
    ```typescript
    getDefaultData() {
      return { userData: { prompts: BUILT_IN_PROMPTS, ... } }  // 正确
    }
    ```
    
    **storage.ts getData() catch 块** (第128-135行):
    ```typescript
    catch (error) {
      return this.getDefaultData()  // 返回默认数据但不保存
    }
    ```
    
    **store.ts loadFromStorage() catch 块** (第162-172行):
    ```typescript
    catch (error) {
      const defaultState = getDefaultState()
      set({ prompts: [], categories: [], ... })  // 设置空数组！
    }
    ```

- timestamp: 2026-04-23T-sync-analysis
  type: code_review
  source: src/lib/sync/bidirectional-sync-manager.ts
  finding: **根本原因: cacheChanged 判断错误导致空数据覆盖**
  details: |
    **bidirectional-sync-manager.ts 第74行**:
    ```typescript
    const cacheChanged = cacheData.prompts.length > 0
    ```
    
    这是**存在性检测**，不是**变化检测**！
    
    **问题场景**:
    1. 用户之前有数据，某个操作清空了 prompts
    2. 备份文件保存了空数据 (prompts: [])
    3. 用户后来添加新数据
    4. 触发同步时:
       - cacheChanged = true (因为 prompts.length > 0)
       - fileChanged 可能 = true (时间戳检测)
       - 双向同步可能用空文件数据覆盖用户数据
    
    **第89-98行危险逻辑**:
    ```typescript
    if (fileChanged && !cacheChanged) {
      const fileData = await readFromLocalFolder(handle)
      await storageManager.updateUserData(fileData)  // 可能用空数据覆盖！
    }
    ```
    
    如果 fileChanged=true 且用户数据空，会用文件（可能也空）覆盖缓存。

- timestamp: 2026-04-23T-change-detection
  type: code_review
  source: src/lib/sync/file-sync.ts
  finding: 文件变化检测基于时间戳，不是内容
  details: |
    **file-sync.ts 第188-200行**:
    ```typescript
    const changed = metadata.lastModified > lastSyncTime
    ```
    
    任何文件修改（包括云同步）都会触发 fileChanged=true，即使内容实际没变。

## Root Cause

**bidirectional-sync-manager.ts 的 cacheChanged 判断逻辑错误导致数据丢失**

第74行用 `cacheData.prompts.length > 0` 判断缓存是否有变化，这是存在性检测而非变化检测。

**数据丢失场景**:
1. 某个操作导致用户 prompts 被清空（原因待查）
2. triggerSync() 被调用，备份空数据到文件
3. 用户后来添加新数据
4. 下次同步时，双向同步可能用空文件数据覆盖用户的新数据

**次要问题**:
- store.ts getDefaultState() 返回空数组，当 loadFromStorage() 失败时设置空状态
- file-sync.ts 文件变化检测基于时间戳而非内容hash

## Resolution

root_cause: bidirectional-sync-manager.ts 第74行 cacheChanged 用 prompts.length>0 判断变化，导致空数据场景下同步逻辑错误，可能用空文件数据覆盖用户数据
fix: 修复 cacheChanged 判断逻辑，增加空数据保护
verification: 测试同步场景，确保不会用空数据覆盖
files_changed:
  - src/lib/sync/bidirectional-sync-manager.ts (修复 cacheChanged 逻辑)
  - src/lib/store.ts (修复 getDefaultState 返回内置数据)