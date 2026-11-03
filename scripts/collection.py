"""
Compose one 'VIRAZ collection' image from the perfume campaign art and the
soap range poster: the perfume line-up (left) and the six soap boxes (right)
cropped free of their own headlines, joined by a gold hairline and the
emblem. Writes a wide desktop version and a stacked mobile version.

    python3 scripts/collection.py   (then: npm run images)
"""
from PIL import Image, ImageDraw, ImageFilter

SRC = 'assets-src/'
perf_full = Image.open(SRC + 'BANNER-mobile.jpg').convert('RGB')
soap_full = Image.open(SRC + 'soap-range-poster.jpg').convert('RGB')
emblem = Image.open(SRC + 'mark-gold.png').convert('RGBA')  # from scripts/logo.py

PERF_BOX = (0, 690, 941, 1672)      # bottle cluster, below the banner's own logo/headline
SOAP_BOX = (0, 470, 1170, 1150)     # six boxes, between the poster's title and footer band


def h_fade(img, width, side):
    """Alpha mask that fades `img` out over `width` px on the given side."""
    m = Image.new('L', img.size, 255)
    d = ImageDraw.Draw(m)
    for i in range(width):
        a = round(255 * (i / width) ** 1.3)
        x = img.width - 1 - i if side == 'right' else i
        d.line([(x, 0), (x, img.height)], fill=a)
    return m


def v_fade(img, height, side):
    m = Image.new('L', img.size, 255)
    d = ImageDraw.Draw(m)
    for i in range(height):
        a = round(255 * (i / height) ** 1.3)
        y = img.height - 1 - i if side == 'bottom' else i
        d.line([(0, y), (img.width, y)], fill=a)
    return m


def gold_line(size, vertical):
    """Polished-gold hairline that fades out at both ends."""
    w, h = size
    line = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(line)
    n = h if vertical else w
    for i in range(n):
        t = i / (n - 1)
        a = round(255 * min(1, 4 * t, 4 * (1 - t)))
        c = (232, 207, 143, a) if abs(t - 0.5) < 0.25 else (201, 160, 74, a)
        if vertical:
            d.line([(0, i), (w, i)], fill=c)
        else:
            d.line([(i, 0), (i, h)], fill=c)
    return line


def medallion(d):
    """Emblem on a noir disc with a gold ring and soft shadow."""
    pad = d // 2
    m = Image.new('RGBA', (d + 2 * pad, d + 2 * pad), (0, 0, 0, 0))
    sh = Image.new('L', m.size, 0)
    ImageDraw.Draw(sh).ellipse((pad, pad + d // 14, pad + d, pad + d + d // 14), fill=150)
    m.putalpha(sh.filter(ImageFilter.GaussianBlur(d // 9)))
    m = Image.composite(Image.new('RGBA', m.size, (0, 0, 0, 255)), Image.new('RGBA', m.size, (0, 0, 0, 0)), m.getchannel('A'))
    dr = ImageDraw.Draw(m)
    dr.ellipse((pad, pad, pad + d, pad + d), fill=(11, 9, 6, 255))
    ring = max(3, d // 60)
    dr.ellipse((pad, pad, pad + d, pad + d), outline=(201, 160, 74, 255), width=ring)
    dr.ellipse((pad + ring * 3, pad + ring * 3, pad + d - ring * 3, pad + d - ring * 3), outline=(201, 160, 74, 110), width=max(1, ring // 2))
    e = emblem.copy()
    e.thumbnail((int(d * 0.6), int(d * 0.6)), Image.LANCZOS)
    m.alpha_composite(e, (pad + (d - e.width) // 2, pad + (d - e.height) // 2))
    return m


def desktop(out, H=1000):
    perf = perf_full.crop(PERF_BOX)
    soap = soap_full.crop(SOAP_BOX)
    perf = perf.resize((round(perf.width * H / perf.height), H), Image.LANCZOS)
    soap = soap.resize((round(soap.width * H / soap.height), H), Image.LANCZOS)
    ov = 70
    W = perf.width + soap.width - ov
    c = Image.new('RGBA', (W, H))
    c.paste(soap, (perf.width - ov, 0))
    c.paste(perf, (0, 0), h_fade(perf, ov, 'right'))
    seam = perf.width - ov // 2
    lw = 4
    c.alpha_composite(gold_line((lw, H), True), (seam - lw // 2, 0))
    md = medallion(200)
    c.alpha_composite(md, (seam - md.width // 2, H // 2 - md.height // 2))
    c.convert('RGB').save(out, quality=95)
    return c.size


def mobile(out, W=1080):
    perf = perf_full.crop(PERF_BOX)
    soap = soap_full.crop(SOAP_BOX)
    perf = perf.resize((W, round(perf.height * W / perf.width)), Image.LANCZOS)
    soap = soap.resize((W, round(soap.height * W / soap.width)), Image.LANCZOS)
    ov = 50
    H = perf.height + soap.height - ov
    c = Image.new('RGBA', (W, H))
    c.paste(soap, (0, perf.height - ov))
    c.paste(perf, (0, 0), v_fade(perf, ov, 'bottom'))
    seam = perf.height - ov // 2
    lw = 4
    c.alpha_composite(gold_line((W, lw), False), (0, seam - lw // 2))
    md = medallion(180)
    # sit on the perfume side's dark floor, clear of the soap boxes
    c.alpha_composite(md, (W // 2 - md.width // 2, seam - md.height // 2 - 70))
    c.convert('RGB').save(out, quality=95)
    return c.size


if __name__ == '__main__':
    print('desktop', desktop(SRC + 'collection-desktop.jpg'))
    print('mobile', mobile(SRC + 'collection-mobile.jpg'))
