"""
Build the VIRAZ logo files from the supplied glow artwork.

The supplied PNG is a white glow, but its alpha channel is a crisp
silhouette of the logo (ink ~254, background 0): mark at y 22-914 and the
tagline "THE ESSENCE OF ELEGANCE" at y 933-973. We fill that silhouette
with polished gold (or ink) to get sharp logos for any background.

    python3 scripts/logo.py      (then: npm run images)

Writes to assets-src/: logo-gold.png (full lockup), mark-gold.png (mark
only), logo-ink.png (lockup in noir for light backgrounds).
"""
import numpy as np
from PIL import Image

SRC = 'assets-src/'
alpha = np.asarray(Image.open(SRC + 'logo-glow.png'))[..., 3].astype(np.float32)
# clean the 0-3 noise in the background, keep the anti-aliased edge
alpha = np.clip((alpha - 4) / (250 - 4), 0, 1)


def trim(a):
    ys, xs = np.where(a > 0.02)
    pad = 6
    return a[max(ys.min() - pad, 0):ys.max() + pad, max(xs.min() - pad, 0):xs.max() + pad]


def gold(a):
    h, w = a.shape
    t = np.linspace(0, 1, h)[:, None]
    stops = [(0.0, (138, 98, 21)), (0.28, (232, 207, 143)), (0.5, (201, 160, 74)), (0.72, (246, 236, 210)), (1.0, (168, 120, 28))]
    rgb = np.zeros((h, 1, 3))
    for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
        m = (t >= p0) & (t <= p1)
        f = np.where(m, (t - p0) / (p1 - p0), 0)
        for k in range(3):
            rgb[..., k] = np.where(m, c0[k] + (c1[k] - c0[k]) * f, rgb[..., k])
    rgb = np.repeat(rgb, w, axis=1)
    # faint diagonal sheen
    x = np.linspace(0, 1, w)[None, :]
    sheen = np.exp(-((x - t * 0.6 - 0.2) ** 2) / 0.004) * 30
    rgb = np.clip(rgb + sheen[..., None], 0, 255)
    return Image.fromarray(np.dstack([rgb, a * 255]).astype(np.uint8), 'RGBA')


def solid(a, color):
    h, w = a.shape
    rgb = np.broadcast_to(np.array(color, dtype=np.float32), (h, w, 3))
    return Image.fromarray(np.dstack([rgb, a * 255]).astype(np.uint8), 'RGBA')


full = trim(alpha)
mark = trim(alpha[:925])
gold(full).save(SRC + 'logo-gold.png')
gold(mark).save(SRC + 'mark-gold.png')
solid(full, (21, 17, 11)).save(SRC + 'logo-ink.png')
print('lockup', full.shape[::-1], 'mark', mark.shape[::-1])
