#!/usr/bin/env python3
"""Give every page the same content-addressed stylesheet to avoid stale caches."""
import argparse
import hashlib
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true')
    args = parser.parse_args()
    source = (ROOT / 'styles.css').read_bytes()
    digest = hashlib.sha256(source).hexdigest()[:12]
    filename = f'styles-{digest}.css'
    target = ROOT / filename
    problems = []
    if not target.exists() or target.read_bytes() != source:
        if args.write:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(source)
        else:
            problems.append('Stylesheet fingerprint is stale; run --write')
    pattern = r'href="(?:styles\.css(?:\?[^\"]*)?|styles-[a-f0-9]+\.css|assets/styles/site-[a-f0-9]+\.css)"'
    for path in sorted(ROOT.glob('*.html')):
        before = path.read_text()
        after = re.sub(pattern, f'href="{filename}"', before)
        if before != after:
            if args.write:
                path.write_text(after)
            else:
                problems.append(f'{path.name}: stale stylesheet reference')
        if '<main class="site-shell' in before and not re.search(pattern, before):
            problems.append(f'{path.name}: missing shared stylesheet')
    if problems:
        print('\n'.join(problems), file=sys.stderr)
        return 1
    print(f'All styled pages use {filename}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
