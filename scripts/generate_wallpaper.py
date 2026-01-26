from PIL import Image, ImageDraw, ImageFilter, ImageOps
import math
from pathlib import Path

OUTPUT = Path(__file__).resolve().parent.parent / "public" / "wallpapers" / "win11.jpg"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

w, h = 1920, 1080
bg = Image.new("RGB", (w, h), "#0a1e3f")
draw = ImageDraw.Draw(bg, "RGBA")

centers = [(w * 0.65, h * 0.45), (w * 0.45, h * 0.65), (w * 0.3, h * 0.4)]
colors = [(60, 140, 255), (40, 100, 220), (30, 80, 200)]
for idx, center in enumerate(centers):
    for r in range(150, 750, 40):
        alpha = max(0, 140 - r // 6)
        draw.ellipse([center[0] - r, center[1] - r, center[0] + r, center[1] + r], fill=colors[idx] + (alpha,))

for i in range(12):
    angle = math.radians(12 * i)
    radius = 900 - i * 40
    bbox = [w / 2 - radius, h / 2 - radius * 0.6, w / 2 + radius, h / 2 + radius * 0.6]
    color = (70 + i * 8, 160 - i * 4, 255 - i * 6, 90)
    draw.arc(bbox, start=math.degrees(angle), end=math.degrees(angle) + 200, fill=color, width=22)

gradient = Image.new("RGBA", (w, h))
g_draw = ImageDraw.Draw(gradient)
for y in range(h):
    alpha = int(140 * max(0, 1 - abs((y - h * 0.45) / (h * 0.6))))
    g_draw.rectangle([0, y, w, y + 1], fill=(40, 120, 255, alpha))
gradient = gradient.filter(ImageFilter.GaussianBlur(90))
bg = Image.alpha_composite(bg.convert("RGBA"), gradient)

noise = Image.effect_noise((w, h), 8).convert("L")
noise = ImageOps.autocontrast(noise)
noise_colored = Image.merge("RGBA", (noise, noise, noise, noise.point(lambda p: int(p * 0.12))))
bg = Image.alpha_composite(bg, noise_colored)

vignette = Image.new("L", (w, h), 0)
v_draw = ImageDraw.Draw(vignette)
v_draw.ellipse([w * -0.1, h * -0.2, w * 1.1, h * 1.2], fill=255)
vignette = vignette.filter(ImageFilter.GaussianBlur(140))
vignette = ImageOps.invert(vignette)
vignette = ImageOps.colorize(vignette, "black", "white").split()[0]
base_rgb = bg.convert("RGB")
base_rgb.putalpha(ImageOps.invert(vignette).point(lambda p: p * 0.85))
final = Image.alpha_composite(Image.new("RGBA", (w, h), "#071227"), base_rgb)

final = final.convert("RGB")
final.save(OUTPUT, quality=92)
print(f"Wallpaper written to {OUTPUT}")
