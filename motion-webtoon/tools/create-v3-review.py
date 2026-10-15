"""Create small review copies without displaying or modifying the originals."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
target = root / "work/review-640"
target.mkdir(parents=True, exist_ok=True)
names = ["scene-1.png", "scene-2-refined.png", "scene-3.png",
         "scene-4-refined.png", "scene-5-refined.png", "scene-6-refined.png"]
for name in names:
    source = root / "public/assets/keyframes-v3/generated-originals" / name
    with Image.open(source) as original:
        review = original.convert("RGB")
        if review.width > 640:
            review = review.resize((640, round(review.height * 640 / review.width)), Image.Resampling.LANCZOS)
        destination = target / (source.stem + ".jpg")
        review.save(destination, quality=85)
    print(f"{source.name}: exists, {source.stat().st_size} bytes; review: {destination.stat().st_size} bytes")
