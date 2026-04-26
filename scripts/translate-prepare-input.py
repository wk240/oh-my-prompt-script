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