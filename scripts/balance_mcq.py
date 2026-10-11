import os
import json
import random
import re
import sys

# Seed for reproducible high-entropy distribution
random.seed(42)

pattern_step = re.compile(r'\b(Đáp án|Phương án)\s+[A-D]\b', re.IGNORECASE)

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return text
    # Replace "Đáp án A", "Phương án A", etc. with "Phương án chính xác"
    text = re.sub(r'\bĐáp án\s+[A-D]\b', 'Đáp án chính xác', text)
    text = re.sub(r'\bPhương án\s+[A-D]\b', 'Phương án chính xác', text)
    text = re.sub(r'\bđáp án\s+[A-D]\b', 'đáp án chính xác', text)
    text = re.sub(r'\bphương án\s+[A-D]\b', 'phương án chính xác', text)
    return text

def balance_directory(dir_path: str):
    total_mcq = 0
    shuffled_mcq = 0
    id_counts = {}

    for root, dirs, files in os.walk(dir_path):
        for f in files:
            if not f.endswith('.json'):
                continue
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8') as fp:
                    data = json.load(fp)
            except Exception as e:
                print(f"Error reading {p}: {e}")
                continue

            if not isinstance(data, list):
                continue

            modified = False
            for item in data:
                ans = item.get('answer', {})
                if ans.get('kind') == 'mcq-single':
                    total_mcq += 1
                    options = ans.get('options', [])
                    correct_id = ans.get('correctId')

                    if len(options) >= 2 and correct_id:
                        # Find the correct option
                        correct_opt = next((o for o in options if o.get('id') == correct_id), None)
                        if correct_opt is not None:
                            # Detect prefix convention: 'opt-a' vs 'a'
                            is_opt_prefix = all(o.get('id', '').startswith('opt-') for o in options)
                            
                            # Shuffle options
                            shuffled_opts = list(options)
                            random.shuffle(shuffled_opts)

                            # Re-assign IDs
                            letters = ['a', 'b', 'c', 'd', 'e', 'f']
                            new_correct_id = None
                            for idx, opt in enumerate(shuffled_opts):
                                let = letters[idx] if idx < len(letters) else str(idx + 1)
                                new_id = f"opt-{let}" if is_opt_prefix else let
                                if opt is correct_opt:
                                    new_correct_id = new_id
                                opt['id'] = new_id

                            ans['options'] = shuffled_opts
                            ans['correctId'] = new_correct_id
                            shuffled_mcq += 1
                            id_counts[new_correct_id] = id_counts.get(new_correct_id, 0) + 1
                            modified = True

                # Clean up steps and finalSolution
                for s in item.get('steps', []):
                    if 'body' in s and pattern_step.search(s['body']):
                        s['body'] = clean_text(s['body'])
                        modified = True
                    if 'title' in s and pattern_step.search(s['title']):
                        s['title'] = clean_text(s['title'])
                        modified = True
                for h in item.get('hints', []):
                    if 'text' in h and pattern_step.search(h['text']):
                        h['text'] = clean_text(h['text'])
                        modified = True
                if 'finalSolution' in item and pattern_step.search(item['finalSolution']):
                    item['finalSolution'] = clean_text(item['finalSolution'])
                    modified = True

            if modified:
                with open(p, 'w', encoding='utf-8') as fp:
                    json.dump(data, fp, ensure_ascii=False, indent=2)

    print(f"\nDirectory: {dir_path}")
    print(f"Total MCQ: {total_mcq}, Shuffled: {shuffled_mcq}")
    print("New distribution of correctId:")
    for k, v in sorted(id_counts.items()):
        print(f"  {k}: {v} ({v / shuffled_mcq * 100:.1f}%)")

if __name__ == '__main__':
    balance_directory('src/content/biology')
