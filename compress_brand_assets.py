from pathlib import Path

from PIL import Image


ASSET_DIR = Path("/home/ubuntu/makkaphone/assets/images")
TARGETS = [
    ASSET_DIR / "icon.png",
    ASSET_DIR / "splash-icon.png",
    ASSET_DIR / "favicon.png",
    ASSET_DIR / "android-icon-foreground.png",
]


def compress(path: Path) -> None:
    with Image.open(path) as image:
        rgba = image.convert("RGBA")
        rgba.thumbnail((512, 512), Image.Resampling.LANCZOS)
        rgba.save(path, format="PNG", optimize=True, compress_level=9)


for target in TARGETS:
    compress(target)
