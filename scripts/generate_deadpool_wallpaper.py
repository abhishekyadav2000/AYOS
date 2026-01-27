from PIL import Image, ImageDraw, ImageFilter, ImageFont
from pathlib import Path

OUTPUT = Path(__file__).resolve().parent.parent / "public" / "wallpapers" / "deadpool.jpg"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

w, h = 1920, 1080

# Create base with Deadpool's signature red
bg = Image.new("RGB", (w, h), "#8B0000")  # Dark red

draw = ImageDraw.Draw(bg, "RGBA")

# Create dramatic red to black gradient
for y in range(h):
    intensity = int(139 * (1 - y / h))  # Gradient from dark red to black
    draw.rectangle([0, y, w, y + 1], fill=(intensity + 40, 0, 0))

# Add black radial vignette from corners
for i in range(200):
    alpha = int(255 * (i / 200) * 0.4)
    draw.rectangle([0, 0, w, h], outline=(0, 0, 0, alpha))

# Add abstract geometric shapes in Deadpool style
# Red diamonds
for i in range(8):
    x = (w // 8) * i + w // 16
    y = h // 2 + (i % 2 - 0.5) * 200
    size = 80 + (i % 3) * 30
    points = [(x, y - size), (x + size, y), (x, y + size), (x - size, y)]
    alpha = 30 + (i % 3) * 20
    draw.polygon(points, fill=(139, 0, 0, alpha))

# Add diagonal stripes for texture
for i in range(0, w + h, 100):
    draw.line([(i, 0), (i - h, h)], fill=(0, 0, 0, 15), width=40)

# Add some red accent circles
centers = [(w * 0.25, h * 0.3), (w * 0.75, h * 0.7), (w * 0.5, h * 0.5)]
for center in centers:
    for r in range(50, 300, 50):
        alpha = max(0, 60 - r // 8)
        draw.ellipse([center[0] - r, center[1] - r, center[0] + r, center[1] + r], 
                     fill=(220, 0, 0, alpha))

# Apply blur for smoothness
bg = bg.filter(ImageFilter.GaussianBlur(3))

# Add subtle texture
overlay = Image.new("RGBA", (w, h))
o_draw = ImageDraw.Draw(overlay)
import random
random.seed(42)
for _ in range(5000):
    x, y = random.randint(0, w), random.randint(0, h)
    size = random.randint(1, 3)
    alpha = random.randint(10, 40)
    o_draw.ellipse([x, y, x + size, y + size], fill=(255, 255, 255, alpha))

bg = Image.alpha_composite(bg.convert("RGBA"), overlay)

# Convert and save
final = bg.convert("RGB")
final.save(OUTPUT, quality=95)
print(f"Deadpool wallpaper written to {OUTPUT}")
