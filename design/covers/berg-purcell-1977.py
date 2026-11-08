"""Run: python design/covers/berg-purcell-1977.py src/assets/posts/berg-purcell-1977/cover.png 7  (needs skia-python)
Cover for the Berg & Purcell post in the manner of a journal cover, drawn with Skia: an E. coli,
lit from the sugar-rich side it is swimming towards, in a dark medium full of glowing sugar molecules,
near ones sharp and far ones out of focus. Colours from the metachow dark theme (sky #7aaee8,
ochre #e3a14a, ink night). Output 1600 x 900 PNG."""
import math, random, sys
import skia

W, H = 1600, 900
out = sys.argv[1]; seed = int(sys.argv[2]) if len(sys.argv) > 2 else 7
rnd = random.Random(seed)

def C(hexs, a=1.0):
    v = int(hexs.lstrip("#"), 16); return skia.Color((v >> 16) & 255, (v >> 8) & 255, v & 255, int(round(255 * a)))
SKY, SKY_HI, OCHRE, OCHRE_HI = "#7aaee8", "#cfe6ff", "#e3a14a", "#ffe1a8"
def blur(s): return skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, s) if s > 0 else None
def paint(col, a=1.0, s=0, stroke=None, mode=None, shader=None):
    p = skia.Paint(AntiAlias=True)
    if shader is not None: p.setShader(shader)
    else: p.setColor(C(col, a))
    if stroke is not None:
        p.setStyle(skia.Paint.kStroke_Style); p.setStrokeWidth(stroke)
        p.setStrokeCap(skia.Paint.kRound_Cap); p.setStrokeJoin(skia.Paint.kRound_Join)
    if s: p.setMaskFilter(blur(s))
    if mode: p.setBlendMode(mode)
    return p
SCREEN, PLUS = skia.BlendMode.kScreen, skia.BlendMode.kPlus

surface = skia.Surface(W, H); cv = surface.getCanvas()

# ---- the medium: deep night blue, brighter and warmer towards the sugar on the upper right
cv.drawRect(skia.Rect(0, 0, W, H), skia.Paint(Shader=skia.GradientShader.MakeRadial(
    skia.Point(1180, 330), 1250, [C("#1b3a5e"), C("#0d1d31"), C("#05090f")], [0, 0.5, 1])))
cv.drawCircle(1500, 250, 720, paint(OCHRE, 0.16, s=160, mode=SCREEN))
cv.drawCircle(1250, 380, 420, paint(SKY, 0.10, s=140, mode=SCREEN))

def density(x, y): return 0.06 + 0.94 * (x / W) ** 1.6 * (0.6 + 0.4 * (1 - y / H))

# ---- far layer: out-of-focus sugars (bokeh)
for _ in range(900):
    x, y = rnd.uniform(-50, W + 50), rnd.uniform(-50, H + 50)
    if rnd.random() > density(max(0, x), max(0, y)) * 0.12: continue
    r = rnd.uniform(6, 26); col = OCHRE if rnd.random() < 0.75 else SKY
    cv.drawCircle(x, y, r, paint(col, rnd.uniform(0.05, 0.16), s=r * 0.45, mode=SCREEN))

# ---- the cell's frame
CX, CY, ANG = 800, 470, -14.0
L2, R = 235, 96
def to_world(x, y):
    a = math.radians(ANG); return CX + x * math.cos(a) - y * math.sin(a), CY + x * math.sin(a) + y * math.cos(a)
def local(px, py):
    a = -math.radians(ANG); dx, dy = px - CX, py - CY
    return dx * math.cos(a) - dy * math.sin(a), dx * math.sin(a) + dy * math.cos(a)
def dist_body(px, py):
    x, y = local(px, py); return math.hypot(x - max(-L2, min(L2, x)), y) - R

# ---- faint diffusion threads of a few molecules
for _ in range(16):
    x, y = rnd.uniform(500, W), rnd.uniform(0, H)
    p = skia.Path(); p.moveTo(x, y)
    for _ in range(90): x += rnd.gauss(0, 4.5); y += rnd.gauss(0, 4.5); p.lineTo(x, y)
    cv.drawPath(p, paint(OCHRE, 0.05, s=0.8, stroke=1.2, mode=SCREEN))

# ---- flagella: four helices wound into a bundle, receding (and blurring) behind the cell
cv.save(); cv.translate(CX, CY); cv.rotate(ANG)
x0, x_end, lam = -L2 - R - 10, -L2 - R - 820, 150.0
segs = []                                   # (depth z, blur, path points, filament)
for i in range(4):
    ph = i * math.pi / 2
    pts = []
    # hook from the rear of the body into the bundle
    sx, sy = -L2 - 0.35 * R, (-1) ** i * 0.4 * R * (1 + i // 2) / 2   # inside the rear cap, hidden by the body
    for k in range(20):
        t = k / 19; bx = sx + (x0 - sx) * t; by = sy * (1 - t) ** 2 + 12 * math.sin(ph) * t
        pts.append((bx, by, 0.6))
    x = x0
    while x > x_end:
        x -= 2.5; d = x0 - x; th = 2 * math.pi * d / lam + ph
        amp = 34 * min(1, d / 200) + 12
        pts.append((x, amp * math.sin(th), math.cos(th)))
    for a, b in zip(pts[:-1], pts[1:]):
        dfrac = max(0.0, (x0 - b[0]) / (x0 - x_end))
        segs.append((b[2], dfrac, a, b))
for back in (True, False):
    for z, dfrac, a, b in segs:
        if (z < 0) != back: continue
        s = 0.4 + 7.5 * dfrac ** 1.4                       # depth of field
        w = 3.0 + 2.6 * max(0, z)
        col = SKY_HI if z > 0.3 else SKY
        alpha = (0.35 + 0.55 * (z + 1) / 2) * (1 - 0.55 * dfrac)
        p = skia.Path(); p.moveTo(a[0], a[1]); p.lineTo(b[0], b[1])
        cv.drawPath(p, paint(col, alpha * 0.45, s=s + 5, stroke=w + 6, mode=SCREEN))   # glow
        cv.drawPath(p, paint(col, alpha, s=s, stroke=w))
cv.restore()

# ---- the body: a translucent capsule, lit from the upper right
cv.save(); cv.translate(CX, CY); cv.rotate(ANG)
body = skia.RRect.MakeRectXY(skia.Rect(-L2 - R, -R, L2 + R, R), R, R)
cv.drawRRect(body, paint(SKY, 0.35, s=40, mode=SCREEN))                       # outer glow
cv.drawRRect(body, skia.Paint(AntiAlias=True, Shader=skia.GradientShader.MakeLinear(
    [skia.Point(0, -R), skia.Point(0, R)], [C("#6fa7dc", 0.95), C("#2a5d92", 0.95), C("#0d2846", 0.97)], [0, 0.45, 1])))
cv.drawRRect(body, skia.Paint(AntiAlias=True, Shader=skia.GradientShader.MakeLinear(
    [skia.Point(-L2 - R, 0), skia.Point(L2 + R, 0)], [C("#05090f", 0.45), C("#05090f", 0.0), C(OCHRE, 0.18)], [0, 0.55, 1])))
# insides: the nucleoid as a tangled glowing thread, and ribosome speckles
cv.save(); cv.clipRRect(body, doAntiAlias=True)
for k in range(5):
    p = skia.Path(); x, y = rnd.uniform(-120, -40), rnd.uniform(-20, 20); p.moveTo(x, y)
    for _ in range(140):
        x += rnd.gauss(1.4, 6); y += rnd.gauss(0, 6); y = max(-48, min(48, y)); x = max(-170, min(170, x)); p.lineTo(x, y)
    cv.drawPath(p, paint(SKY_HI, 0.10, s=1.2, stroke=2.2, mode=SCREEN))
for _ in range(500):
    x, y = rnd.uniform(-L2 - R, L2 + R), rnd.uniform(-R, R)
    cv.drawCircle(x, y, rnd.uniform(1.0, 2.2), paint(SKY_HI, rnd.uniform(0.05, 0.16), s=0.5, mode=SCREEN))
# specular highlight along the top
hl = skia.RRect.MakeRectXY(skia.Rect(-L2 + 20, -R + 14, L2 + 30, -R + 46), 16, 16)
cv.drawRRect(hl, paint("#ffffff", 0.28, s=14, mode=SCREEN))
cv.restore()
# rim light: strong on the lit (upper, forward) side
rim = skia.GradientShader.MakeLinear([skia.Point(-L2 - R, R), skia.Point(L2 + R, -R)],
                                     [C(SKY, 0.25), C(SKY_HI, 0.75), C(OCHRE_HI, 1.0)], [0, 0.6, 1])
cv.drawRRect(body, skia.Paint(AntiAlias=True, Shader=rim, Style=skia.Paint.kStroke_Style, StrokeWidth=3.2))
p = skia.Paint(AntiAlias=True, Shader=rim, Style=skia.Paint.kStroke_Style, StrokeWidth=12,
               MaskFilter=blur(8), BlendMode=SCREEN); p.setAlphaf(0.5); cv.drawRRect(body, p)
# receptors: small glowing bumps all over the surface (more visible near the outline)
def outline_point(t):
    straight, arc = 2 * L2, math.pi * R; s = t * (2 * straight + 2 * arc)
    if s < straight: return (-L2 + s, -R), (0.0, -1.0)
    s -= straight
    if s < arc: a = -math.pi / 2 + s / R; return (L2 + R * math.cos(a), R * math.sin(a)), (math.cos(a), math.sin(a))
    s -= arc
    if s < straight: return (L2 - s, R), (0.0, 1.0)
    s -= straight; a = math.pi / 2 + s / R; return (-L2 + R * math.cos(a), R * math.sin(a)), (math.cos(a), math.sin(a))
for k in range(34):
    (px, py), (nx, ny) = outline_point((k + rnd.uniform(0.2, 0.8)) / 34)
    if px < -L2 - R * 0.4: continue
    cv.drawCircle(px + 3 * nx, py + 3 * ny, 3.6, paint(SKY_HI, 0.9))
    cv.drawCircle(px + 3 * nx, py + 3 * ny, 9, paint(SKY_HI, 0.35, s=5, mode=SCREEN))
cv.save(); cv.clipRRect(body, doAntiAlias=True)
for _ in range(70):
    x, y = rnd.uniform(-L2 - 40, L2 + R - 10), rnd.uniform(-R + 8, R - 8)
    f = 1 - (abs(y) / R) ** 2                       # foreshortened towards the edges
    cv.drawOval(skia.Rect(x - 2.6, y - 2.6 * f - 0.6, x + 2.6, y + 2.6 * f + 0.6), paint(SKY_HI, 0.55 * f + 0.1))
cv.restore()
# the receptor at the front that has just caught a sugar
(px, py), (nx, ny) = outline_point(0.36)
hx, hy = px + 14 * nx, py + 14 * ny
cv.restore()
HX, HY = to_world(hx, hy)

# ---- sugars in focus: glowing beads, denser towards the light; one just caught at the front
def bead(x, y, r, glow=1.0):
    cv.drawCircle(x, y, r * 3.2, paint(OCHRE, 0.22 * glow, s=r * 1.6, mode=SCREEN))
    cv.drawCircle(x, y, r, skia.Paint(AntiAlias=True, Shader=skia.GradientShader.MakeRadial(
        skia.Point(x - r * 0.35, y - r * 0.4), r * 1.25, [C("#fff4dc"), C(OCHRE_HI), C(OCHRE), C("#8a5512")], [0, 0.25, 0.65, 1])))
placed = []
for _ in range(6000):
    if len(placed) >= 95: break
    x, y = rnd.uniform(20, W - 20), rnd.uniform(20, H - 20)
    if rnd.random() > density(x, y) * 0.9 or dist_body(x, y) < 40: continue
    if any(math.hypot(x - a, y - b) < 46 for a, b in placed): continue
    placed.append((x, y))
for x, y in placed: bead(x, y, rnd.uniform(3.2, 6.8), glow=rnd.uniform(0.6, 1.2))
# the caught one, with the short path it came along
p = skia.Path(); x, y = HX + 70, HY - 120; p.moveTo(x, y)
for k in range(60):
    t = (k + 1) / 60; x += (HX - x) * 0.08 + rnd.gauss(0, 3.5) * (1 - t); y += (HY - y) * 0.08 + rnd.gauss(0, 3.5) * (1 - t); p.lineTo(x, y)
cv.drawPath(p, paint(OCHRE_HI, 0.35, s=0.8, stroke=1.6, mode=SCREEN))
cv.drawCircle(HX, HY, 60, paint(OCHRE, 0.45, s=30, mode=SCREEN))
cv.drawCircle(HX, HY, 22, paint(OCHRE_HI, 0.5, s=10, mode=SCREEN))
bead(HX, HY, 11, glow=2.0)

# ---- foreground bokeh for depth
for x, y, r, col, a in [(110, 120, 90, SKY, 0.07), (1480, 810, 130, OCHRE, 0.10), (1380, 90, 60, OCHRE, 0.10),
                        (260, 820, 70, SKY, 0.06), (1560, 470, 50, OCHRE, 0.12)]:
    cv.drawCircle(x, y, r, paint(col, a, s=r * 0.5, mode=SCREEN))

# ---- vignette and a whisper of grain
cv.drawRect(skia.Rect(0, 0, W, H), skia.Paint(Shader=skia.GradientShader.MakeRadial(
    skia.Point(W * 0.55, H * 0.48), 980, [C("#000000", 0.0), C("#000000", 0.0), C("#000000", 0.55)], [0, 0.55, 1])))
grain = skia.Paint(Shader=skia.PerlinNoiseShader.MakeFractalNoise(0.9, 0.9, 2, 0.0)); grain.setAlphaf(0.05)
grain.setBlendMode(skia.BlendMode.kOverlay); cv.drawRect(skia.Rect(0, 0, W, H), grain)

surface.makeImageSnapshot().save(out, skia.kPNG)
print("saved", out)
