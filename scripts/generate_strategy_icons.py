"""Rebuild screenshot-reference badges with outlined Pretendard Bold lettering.
Requires fonttools and Pillow (build-time tools only).
Run from repository root: python3 scripts/generate_strategy_icons.py
"""
from pathlib import Path
from math import ceil
from html import escape
import json
import tempfile

from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src/assets/icons/strategy'
OUT.mkdir(parents=True, exist_ok=True)
FONT = TTFont(ROOT / 'src/assets/fonts/woff/Pretendard-Bold.woff')
GLYPHS = FONT.getGlyphSet()
CMAP = FONT.getBestCmap()
UNITS = FONT['head'].unitsPerEm
# Exact theme tokens, after comparing the screenshots in sRGB.
TEAL, DARK, MID, WHITE = '#0D9488', '#115E59', '#0F766E', '#FFFFFF'
ITEMS = [
    ('trade-a', 'A', '#5EEAD4', '#134E4A', True),
    ('trade-p', 'P', '#99F6E4', '#134E4A', True),
    ('trade-h', 'H', '#CCFBF1', '#134E4A', True),
    ('trade-manual', '수동', '#F0FDFA', '#134E4A', False),
    ('cycle-day', '데이', '#CCFBF1', '#134E4A', False),
    ('cycle-position', '포지션', '#99F6E4', '#134E4A', False),
    ('fx', 'F/X', DARK, WHITE, False),
    ('domestic-commodity-futures', '국내 상품 선물', TEAL, WHITE, False),
    ('overseas-commodity-futures', '해외 상품 선물', TEAL, WHITE, False),
    ('domestic-etf', '국내 ETF', MID, WHITE, False),
    ('overseas-etf', '해외 ETF', MID, WHITE, False),
    ('domestic-stock', '국내주식', DARK, WHITE, False),
    ('overseas-stock', '해외주식', DARK, WHITE, False),
    ('domestic-index-futures', '국내 지수 선물', TEAL, WHITE, False),
    ('overseas-index-futures', '해외 지수 선물', TEAL, WHITE, False),
    ('domestic-index-options', '국내 지수 옵션', MID, WHITE, False),
    ('domestic-stock-options', '국내 주식 옵션', MID, WHITE, False),
    ('overseas-stock-options', '해외 주식 옵션', MID, WHITE, False),
    ('overseas-index-options', '해외 지수 옵션', MID, WHITE, False),
]


def geometry(label, size):
    scale = size / UNITS
    cursor, paths, bounds = 0, [], []
    for char in label:
        glyph = GLYPHS[CMAP[ord(char)]]
        pen = SVGPathPen(GLYPHS)
        glyph.draw(pen)
        box = BoundsPen(GLYPHS)
        glyph.draw(box)
        if box.bounds:
            x0, y0, x1, y1 = box.bounds
            bounds.append((cursor+x0, y0, cursor+x1, y1))
        paths.append((cursor, pen.getCommands()))
        cursor += glyph.width
    low = min(b[1] for b in bounds)
    high = max(b[3] for b in bounds)
    return scale, cursor * scale, low, high, paths


assets, manifest = [], []
with tempfile.TemporaryDirectory() as temp:
    ttf = Path(temp) / 'Pretendard-Bold.ttf'
    FONT.flavor = None
    FONT.save(ttf)
    for variant, height in [('small', 22)]:
        for slug, label, badge_bg, foreground, square in ITEMS:
            font_size = 12
            scale, text_width, low, high, paths = geometry(label, font_size)
            width = height if square else ceil(text_width + 16)
            bg = badge_bg
            x = (width-text_width)/2
            baseline = (height+(low+high)*scale)/2
            contents = ''.join(f'<path transform="translate({offset} 0)" d="{path}"/>' for offset, path in paths if path)
            svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="{escape(label)}">'
                   f'<title>{escape(label)}</title><path fill="{bg}" d="M0 0h{width}v{height}H0z"/>'
                   f'<g fill="{foreground}" transform="translate({x:.4f} {baseline:.4f}) scale({scale:.8f} {-scale:.8f})">{contents}</g></svg>\n')
            filename = f'{slug}-{variant}.svg'
            (OUT / filename).write_text(svg)
            manifest.append(dict(slug=slug,label=label,variant=variant,width=width,height=height,background=bg,file=filename))
            # Render a contact sheet with the same font, metrics and colors.
            zoom = 4
            badge = Image.new('RGB', (width*zoom,height*zoom), bg)
            draw = ImageDraw.Draw(badge)
            font = ImageFont.truetype(str(ttf),font_size*zoom)
            draw.text((x*zoom,baseline*zoom),label,font=font,fill=foreground,anchor='ls')
            assets.append((variant,slug,badge))

(OUT / 'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
imports, entries = [], []
for index,(slug,label,*_) in enumerate(ITEMS):
    for variant in ['small']:
        imports.append(f"import badge{index}{variant} from './{slug}-{variant}.svg';")
    entries.append(f"  '{label}': badge{index}small,")
(OUT / 'index.ts').write_text('\n'.join(sorted(imports, key=lambda line: line.split(' from ')[1]))+'\n\nexport const strategyBadgeAssets = {\n'+'\n'.join(entries)+'\n} as const;\n')
# Render a contact sheet at 2x for inspection.
sheet = Image.new('RGB',(500,70+len(ITEMS)*70),'#F4F4F5')
draw = ImageDraw.Draw(sheet)
draw.text((32,20),'SMALL: 22px height (shown at 2x)',fill='#134E4A')
for index,(_,label,*_) in enumerate(ITEMS):
    for col,variant in enumerate(['small']):
        badge = next(im for v,slug,im in assets if v==variant and slug==ITEMS[index][0])
        badge = badge.resize((badge.width//2,badge.height//2),Image.Resampling.LANCZOS)
        sheet.paste(badge,(32+col*468,55+index*70))
sheet.save(OUT / 'preview.png')
print(f'Generated {len(manifest)} outlined SVG badges and preview.png')
