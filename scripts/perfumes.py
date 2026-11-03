"""
Cut the ten VIRAZ eau de parfum bottles (and the collection band) out of
the range poster. The poster is the only artwork with every bottle, so
each crop is small (~120x240); edges are feathered so the bottle sits
softly on the site's perfume card. Replace with studio photos when
available (see README).

    python3 scripts/perfumes.py      (then: npm run images)
"""
import numpy as np
from PIL import Image, ImageFilter

SRC = 'assets-src/'
poster = Image.open(SRC + 'range-poster-full.png').convert('RGB')

Y0, Y1 = 902, 1142
BOTTLES = {  # id: (x0, x1, top) in the poster; `top` sits just above each cap, clear of the title plaque
    'oud': (40, 174, 904), 'amber': (171, 294, 912), 'blue': (290, 407, 918), 'royal': (401, 522, 935),
    'floral': (518, 634, 935), 'rose': (630, 737, 935), 'musk': (733, 837, 926), 'oudh': (833, 937, 924),
    'silver': (928, 1042, 908), 'zen': (1038, 1164, 920),
}


def feather(img, fx=0.16, fy=0.07):
    """Soft alpha falloff on all four edges."""
    w, h = img.size
    x = np.minimum(np.arange(w), np.arange(w)[::-1]) / (w * fx)
    y = np.minimum(np.arange(h), np.arange(h)[::-1]) / (h * fy)
    a = np.clip(np.minimum.outer(np.clip(y, 0, 1), np.clip(x, 0, 1)), 0, 1) ** 1.4
    out = img.convert('RGBA')
    out.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
    return out


for pid, (x0, x1, top) in BOTTLES.items():
    crop = poster.crop((x0, top, x1, Y1))
    crop = crop.resize((crop.width * 2, crop.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.6, percent=60, threshold=2))
    crop = feather(crop, fy=0.05)
    # pad to a common height (transparent on top) so every bottle renders at the same scale
    full = Image.new('RGBA', (crop.width, (Y1 - Y0) * 2), (0, 0, 0, 0))
    full.alpha_composite(crop, (0, full.height - crop.height))
    full.save(SRC + f'perfume-{pid}.png')

poster.crop((0, 828, 1199, 1145)).save(SRC + 'perfume-collection.png', quality=95)
print('ok', len(BOTTLES))
