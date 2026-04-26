# 资源库提示词翻译实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成 525 个英文提示词的中文翻译，支持中英双语显示

**Architecture:** 多 Agent 分批翻译，按分类分组，串行执行，自动验证后合并

**Tech Stack:** Python 脚本 + TypeScript 类型定义 + Claude Agent 翻译

---

## 文件结构

| 文件 | 操作 | 说明 |
|-----|------|------|
| `src/shared/types.ts` | 修改 | 添加 `descriptionEn` 字段 |
| `scripts/translate-preprocess.py` | 创建 | 数据预处理脚本 |
| `scripts/translate-validate.py` | 创建 | 翻译验证脚本 |
| `scripts/translate-merge.py` | 创建 | 合并脚本 |
| `src/data/resource-library/prompts.json` | 修改 | 主数据文件 |
| `translations/*.json` | 创建 | 各分类翻译结果（临时） |

---

## Task 1: 更新类型定义

**Files:**
- Modify: `src/shared/types.ts:50-58`

- [ ] **Step 1: 添加 descriptionEn 字段**

在 `ResourcePrompt` 接口中添加 `descriptionEn` 字段：

```typescript
// Resource library prompt types (from local JSON data)
export interface ResourcePrompt extends Prompt {
  sourceCategory?: string // Original category from source
  previewImage?: string // Preview image URL
  author?: string // Original author name, e.g. "宝玉"
  authorUrl?: string // Author attribution link, e.g. "https://x.com/..."
  // Bilingual fields (optional, supports progressive translation)
  nameEn?: string // English name
  contentEn?: string // English content
  descriptionEn?: string // English description (new field)
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: 提交**

```bash
git add src/shared/types.ts
git commit -m "feat(types): add descriptionEn field for bilingual description"
```

---

## Task 2: 创建数据预处理脚本

**Files:**
- Create: `scripts/translate-preprocess.py`

- [ ] **Step 1: 编写预处理脚本**

```python
#!/usr/bin/env python3
"""
Preprocess prompts.json for translation:
1. Move existing English description to descriptionEn
2. Create backup
"""

import json
from pathlib import Path

INPUT_FILE = Path('src/data/resource-library/prompts.json')
BACKUP_FILE = Path('src/data/resource-library/prompts-backup.json')

def has_chinese(text: str) -> bool:
    """Check if text contains Chinese characters."""
    if not text:
        return False
    for char in text:
        if '一' <= char <= '鿿':
            return True
    return False

def preprocess():
    # Load data
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create backup
    with open(BACKUP_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'[Preprocess] Backup created: {BACKUP_FILE}')
    
    # Process prompts
    prompts = data.get('prompts', [])
    moved_count = 0
    
    for prompt in prompts:
        desc = prompt.get('description')
        if desc and not has_chinese(desc):
            # Move English description to descriptionEn
            prompt['descriptionEn'] = desc
            prompt['description'] = ''
            moved_count += 1
    
    # Save processed data
    with open(INPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f'[Preprocess] Moved {moved_count} descriptions to descriptionEn')
    print(f'[Preprocess] Preprocessed file saved: {INPUT_FILE}')

if __name__ == '__main__':
    preprocess()
```

- [ ] **Step 2: 运行预处理脚本**

Run: `python3 scripts/translate-preprocess.py`
Expected: 
```
[Preprocess] Backup created: src/data/resource-library/prompts-backup.json
[Preprocess] Moved 224 descriptions to descriptionEn
[Preprocess] Preprocessed file saved: src/data/resource-library/prompts.json
```

- [ ] **Step 3: 验证预处理结果**

Run: `cat src/data/resource-library/prompts.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
sample = [p for p in data['prompts'] if p.get('descriptionEn')][0]
print('Sample with descriptionEn:')
print(f'  nameEn: {sample.get(\"nameEn\")}')
print(f'  descriptionEn: {sample.get(\"descriptionEn\")[:60]}...')
print(f'  description: \"{sample.get(\"description\")}\"')
"`
Expected: description 为空字符串，descriptionEn 有内容

- [ ] **Step 4: 提交**

```bash
git add scripts/translate-preprocess.py src/data/resource-library/prompts-backup.json src/data/resource-library/prompts.json
git commit -m "feat(scripts): add preprocess script and preprocess description fields"
```

---

## Task 3: 创建验证脚本

**Files:**
- Create: `scripts/translate-validate.py`

- [ ] **Step 1: 编写验证脚本**

```python
#!/usr/bin/env python3
"""
Validate translation results:
1. Placeholder preservation check
2. JSON structure check
3. Missing translation check
"""

import json
import re
from pathlib import Path

PLACEHOLDER_PATTERNS = [
    r'\{[^}]+\}',    # {Brand Name}, {variable}
    r'\[[^\]]+\]',   # [CITY], [placeholder]
    r'<[^>]+>',      # <placeholder>
]

def extract_placeholders(text: str) -> list[str]:
    """Extract all placeholders from text."""
    if not text:
        return []
    placeholders = []
    for pattern in PLACEHOLDER_PATTERNS:
        placeholders.extend(re.findall(pattern, text))
    return placeholders

def has_chinese(text: str) -> bool:
    """Check if text contains Chinese characters."""
    if not text:
        return False
    for char in text:
        if '一' <= char <= '鿿':
            return True
    return False

def validate_translation(original: dict, translated: dict) -> dict:
    """Validate a single translation. Returns issues list."""
    issues = []
    
    # 1. Placeholder check
    orig_content = original.get('contentEn', '')
    trans_content = translated.get('content', '')
    orig_placeholders = extract_placeholders(orig_content)
    trans_placeholders = extract_placeholders(trans_content)
    
    if set(orig_placeholders) != set(trans_placeholders):
        missing = set(orig_placeholders) - set(trans_placeholders)
        extra = set(trans_placeholders) - set(orig_placeholders)
        if missing:
            issues.append(f"Missing placeholders: {missing}")
        if extra:
            issues.append(f"Extra placeholders: {extra}")
    
    # 2. Required fields check
    required_fields = ['id', 'name', 'content', 'nameEn', 'contentEn']
    for field in required_fields:
        if field not in translated or not translated.get(field):
            issues.append(f"Missing field: {field}")
    
    # 3. ID consistency check
    if original.get('id') != translated.get('id'):
        issues.append(f"ID mismatch: {original.get('id')} vs {translated.get('id')}")
    
    # 4. Chinese content check (no missing translation)
    if not has_chinese(translated.get('name', '')):
        issues.append("name not translated to Chinese")
    if not has_chinese(translated.get('content', '')):
        issues.append("content not translated to Chinese")
    
    # Check description if original had it
    if original.get('descriptionEn'):
        if not has_chinese(translated.get('description', '')):
            issues.append("description not translated to Chinese")
    
    return {
        'id': translated.get('id'),
        'valid': len(issues) == 0,
        'issues': issues
    }

def validate_file(input_file: Path, translation_file: Path) -> dict:
    """Validate entire translation file."""
    with open(input_file, 'r', encoding='utf-8') as f:
        orig_data = json.load(f)
    with open(translation_file, 'r', encoding='utf-8') as f:
        trans_data = json.load(f)
    
    original_prompts = orig_data.get('prompts', [])
    translated_prompts = trans_data.get('translations', [])
    
    # Count check
    if len(original_prompts) != len(translated_prompts):
        return {
            'valid': False,
            'error': f"Count mismatch: {len(original_prompts)} original vs {len(translated_prompts)} translated"
        }
    
    # Validate each prompt
    results = []
    for orig, trans in zip(original_prompts, translated_prompts):
        results.append(validate_translation(orig, trans))
    
    valid_count = sum(1 for r in results if r['valid'])
    invalid_count = len(results) - valid_count
    
    return {
        'valid': invalid_count == 0,
        'total': len(results),
        'valid_count': valid_count,
        'invalid_count': invalid_count,
        'issues': [r for r in results if not r['valid']]
    }

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Validate translation')
    parser.add_argument('--input', required=True, help='Original prompts JSON')
    parser.add_argument('--translation', required=True, help='Translation result JSON')
    args = parser.parse_args()
    
    result = validate_file(Path(args.input), Path(args.translation))
    
    if result['valid']:
        print(f"[Validate] ✓ All {result['total']} translations valid")
    else:
        print(f"[Validate] ✗ {result['invalid_count']} invalid translations")
        for issue in result.get('issues', [])[:5]:
            print(f"  - {issue['id']}: {issue['issues']}")
    
    return 0 if result['valid'] else 1

if __name__ == '__main__':
    exit(main())
```

- [ ] **Step 2: 提交**

```bash
git add scripts/translate-validate.py
git commit -m "feat(scripts): add translation validation script"
```

---

## Task 4: 创建合并脚本

**Files:**
- Create: `scripts/translate-merge.py`

- [ ] **Step 1: 编写合并脚本**

```python
#!/usr/bin/env python3
"""
Merge translation results back into prompts.json
"""

import json
from pathlib import Path

MAIN_FILE = Path('src/data/resource-library/prompts.json')
TRANSLATIONS_DIR = Path('translations')

def merge_translations():
    # Load main data
    with open(MAIN_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    prompts = data.get('prompts', [])
    prompt_map = {p['id']: p for p in prompts}
    
    # Find all translation files
    if not TRANSLATIONS_DIR.exists():
        print(f'[Merge] No translations directory found')
        return
    
    merged_count = 0
    for trans_file in TRANSLATIONS_DIR.glob('*.json'):
        if trans_file.name == 'failed.json':
            continue
        
        with open(trans_file, 'r', encoding='utf-8') as f:
            trans_data = json.load(f)
        
        translations = trans_data.get('translations', [])
        for trans in translations:
            prompt_id = trans.get('id')
            if prompt_id in prompt_map:
                # Update the prompt with translation
                prompt_map[prompt_id]['name'] = trans.get('name')
                prompt_map[prompt_id]['content'] = trans.get('content')
                if trans.get('description'):
                    prompt_map[prompt_id]['description'] = trans.get('description')
                merged_count += 1
        
        print(f'[Merge] Merged {len(translations)} from {trans_file.name}')
    
    # Save merged data
    with open(MAIN_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f'[Merge] Total merged: {merged_count} prompts')
    print(f'[Merge] Saved to {MAIN_FILE}')

if __name__ == '__main__':
    merge_translations()
```

- [ ] **Step 2: 提交**

```bash
git add scripts/translate-merge.py
git commit -m "feat(scripts): add translation merge script"
```

---

## Task 5: 创建翻译输入准备脚本

**Files:**
- Create: `scripts/translate-prepare-input.py`

- [ ] **Step 1: 编写输入准备脚本**

```python
#!/usr/bin/env python3
"""
Prepare translation input for a specific category.
Outputs JSON for Agent input.
"""

import json
import argparse
from pathlib import Path

MAIN_FILE = Path('src/data/resource-library/prompts.json')
OUTPUT_DIR = Path('translations')

def has_chinese(text: str) -> bool:
    if not text:
        return False
    for char in text:
        if '一' <= char <= '鿿':
            return True
    return False

def prepare_category(category_id: str):
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    with open(MAIN_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    prompts = data.get('prompts', [])
    
    # Filter by category and needing translation
    to_translate = [
        p for p in prompts
        if (p.get('categoryId') == category_id or p.get('sourceCategory') == category_id)
        and not has_chinese(p.get('name', ''))
    ]
    
    # Prepare input format for Agent
    input_data = {
        'category': category_id,
        'prompts': [
            {
                'id': p['id'],
                'categoryId': p.get('categoryId'),
                'nameEn': p.get('nameEn', p.get('name')),
                'descriptionEn': p.get('descriptionEn', ''),
                'contentEn': p.get('contentEn', p.get('content')),
            }
            for p in to_translate
        ]
    }
    
    # Save input file
    input_file = OUTPUT_DIR / f'{category_id}-input.json'
    with open(input_file, 'w', encoding='utf-8') as f:
        json.dump(input_data, f, ensure_ascii=False, indent=2)
    
    print(f'[Prepare] Category: {category_id}')
    print(f'[Prepare] Prompts to translate: {len(to_translate)}')
    print(f'[Prepare] Input saved to: {input_file}')
    
    # Print JSON for Agent use
    print('\n[Prepare] Agent input JSON:')
    print(json.dumps(input_data, ensure_ascii=False))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--category', required=True, help='Category ID to translate')
    args = parser.parse_args()
    
    prepare_category(args.category)
```

- [ ] **Step 2: 提交**

```bash
git add scripts/translate-prepare-input.py
git commit -m "feat(scripts): add translation input preparation script"
```

---

## Task 6-N: Agent 翻译执行（逐分类）

每个分类启动一个 Agent 进行翻译。按数量从小到大执行。

### 分类执行顺序

| 序号 | 分类 | 提示词数 |
|-----|------|---------|
| 6 | misc | 4 |
| 7 | minimalist-icons | 7 |
| 8 | 3d-miniatures-dioramas | 9 |
| 9 | anime-manga | 9 |
| 10 | character-design | 10 |
| 11 | food-culinary | 10 |
| 12 | fantasy-scifi | 10 |
| 13 | urban-cityscapes | 10 |
| 14 | architecture-interiors | 10 |
| 15 | nature-landscapes | 10 |
| 16 | logo-branding | 10 |
| 17 | vintage-retro | 10 |
| 18 | cinematic-posters | 10 |
| 19 | product-photography | 14 |
| 20 | sports-action | 15 |
| 21 | portrait-photography | 50 |
| 22 | fashion-photography | 51 |
| 23 | prompts-chat-image | 276 |

### Task N: 翻译分类 {category_id}

**Files:**
- Create: `translations/{category_id}.json`

- [ ] **Step 1: 准备输入**

Run: `python3 scripts/translate-prepare-input.py --category {category_id}`

- [ ] **Step 2: 启动 Agent 翻译**

使用 Agent tool，传入输入 JSON，获取翻译结果。Agent prompt:

```
翻译以下提示词到中文。要求：

1. 保留所有占位符原样：{xxx}、[xxx]、<xxx> 不翻译
2. 翻译三个字段：name、description、content
3. 保持术语一致性
4. 返回有效 JSON 格式

输入：
{input_json}

输出格式：
{"translations": [{"id": "...", "name": "中文", "description": "中文描述", "content": "中文内容", "nameEn": "原文", "descriptionEn": "原文描述", "contentEn": "原文内容"}, ...]}
```

- [ ] **Step 3: 保存翻译结果**

将 Agent 返回的 JSON 保存到 `translations/{category_id}.json`

- [ ] **Step 4: 验证翻译**

Run: `python3 scripts/translate-validate.py --input translations/{category_id}-input.json --translation translations/{category_id}.json`
Expected: `[Validate] ✓ All N translations valid`

- [ ] **Step 5: 合并到主文件**

Run: `python3 scripts/translate-merge.py`
Expected: `[Merge] Merged N from {category_id}.json`

---

## Task 24: 最终验证和提交

**Files:**
- Modify: `src/data/resource-library/prompts.json`

- [ ] **Step 1: 验证所有翻译完成**

Run: `cat src/data/resource-library/prompts.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
prompts = data['prompts']
has_zh = sum(1 for p in prompts if any('一' <= c <= '鿿' for c in p.get('name', '')))
print(f'Total: {len(prompts)}, Chinese: {has_zh}')
print(f'Completion: {has_zh / len(prompts) * 100:.1f}%')
"`
Expected: `Completion: 100.0%`

- [ ] **Step 2: 检查 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: 清理临时文件**

```bash
rm -rf translations/
```

- [ ] **Step 4: 最终提交**

```bash
git add src/data/resource-library/prompts.json
git commit -m "feat(data): complete Chinese translation for all resource library prompts"
```

---

## 执行说明

由于翻译任务需要逐分类启动 Agent，推荐使用 **Subagent-Driven Development**：

1. 先执行 Task 1-5 创建脚本和预处理
2. 然后逐分类执行 Task 6-N，每个分类启动一个 Agent
3. 最后执行 Task 24 验证和提交

每个 Agent 收到分类的提示词 JSON，翻译后返回结果，主进程验证并保存。