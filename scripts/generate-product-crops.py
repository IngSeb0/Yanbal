import json
import math
import re
from collections import defaultdict
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
CATALOG_FILE = ROOT / "lib" / "catalog-products.js"
CATALOG_DIR = ROOT / "public" / "catalog"
PRODUCT_DIR = ROOT / "public" / "products"
OUTPUT_SIZE = (640, 800)
TARGET_RATIO = OUTPUT_SIZE[0] / OUTPUT_SIZE[1]


SPECIAL_CROPS = {
    "2040-dulce-amor-edl-eau-de-parfum": (65, 245, 585, 835),
    "5137-esmalte-de-unas-dulce-amor-edl-dulce-amor": (410, 600, 705, 900),
    "200-ohm-parfum-ohm": (360, 300, 720, 850),
    "2037-ohm-parfum-ohm-now": (110, 300, 450, 850),
    "43715-collar-amira": (45, 0, 720, 310),
    "43717-collar-amira-dore": (45, 0, 720, 310),
    "4719-jelly-stick-iluminador-en-barra-cool-shine": (185, 245, 710, 855),
    "5209-balsamo-labial-edicion-limitada-lip-oil-balm-aura-rose": (105, 205, 620, 830),
    "5211-balsamo-labial-edicion-limitada-lip-oil-balm-berry-glow": (105, 205, 620, 830),
    "5212-balsamo-labial-edicion-limitada-lip-oil-balm-cinamoon-glow": (105, 205, 620, 830),
    "5210-balsamo-labial-edicion-limitada-lip-oil-balm-peach-melon": (105, 205, 620, 830),
    "775-biomilk-soy-unica-crema-corporal-edl": (260, 210, 555, 790),
    "2210-soy-unica-colonia": (120, 230, 360, 790),
    "combo-soy-unica-c9": (105, 170, 585, 805),
}


EXTRA_CROPS = {
    "combo-soy-unica-c9": 101,
}


def load_products():
    text = CATALOG_FILE.read_text(encoding="utf-8")
    match = re.search(r"export const catalogProducts = (\[.*\]);\s*$", text, re.S)
    if not match:
        raise RuntimeError("No se pudo leer lib/catalog-products.js")
    return json.loads(match.group(1))


def page_image(page):
    return CATALOG_DIR / f"c9-page-{int(page):03d}.webp"


def clamp_box(box, width, height):
    left, top, right, bottom = box
    return (
        max(0, min(width - 1, int(left))),
        max(0, min(height - 1, int(top))),
        max(1, min(width, int(right))),
        max(1, min(height, int(bottom))),
    )


def fit_box_to_ratio(box, width, height):
    left, top, right, bottom = clamp_box(box, width, height)
    box_width = max(1, right - left)
    box_height = max(1, bottom - top)
    current_ratio = box_width / box_height

    if current_ratio > TARGET_RATIO:
        new_height = box_width / TARGET_RATIO
        center_y = (top + bottom) / 2
        top = center_y - new_height / 2
        bottom = center_y + new_height / 2
    else:
        new_width = box_height * TARGET_RATIO
        center_x = (left + right) / 2
        left = center_x - new_width / 2
        right = center_x + new_width / 2

    if left < 0:
        right -= left
        left = 0
    if right > width:
        left -= right - width
        right = width
    if top < 0:
        bottom -= top
        top = 0
    if bottom > height:
        top -= bottom - height
        bottom = height

    return clamp_box((left, top, right, bottom), width, height)


def generic_grid_box(index, count, width, height):
    if count <= 1:
        return (width * 0.08, height * 0.08, width * 0.92, height * 0.9)

    columns = min(4, max(2, math.ceil(math.sqrt(count * width / height))))
    rows = math.ceil(count / columns)
    left_margin = width * 0.05
    right_margin = width * 0.05
    top_margin = height * 0.08
    bottom_margin = height * 0.1
    usable_width = width - left_margin - right_margin
    usable_height = height - top_margin - bottom_margin
    cell_width = usable_width / columns
    cell_height = usable_height / rows
    column = index % columns
    row = index // columns
    padding_x = cell_width * 0.06
    padding_y = cell_height * 0.06

    return (
        left_margin + column * cell_width + padding_x,
        top_margin + row * cell_height + padding_y,
        left_margin + (column + 1) * cell_width - padding_x,
        top_margin + (row + 1) * cell_height - padding_y,
    )


def save_crop(image, box, target):
    crop = image.crop(fit_box_to_ratio(box, image.width, image.height))
    crop = crop.resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)
    crop.save(target, "WEBP", quality=82, method=6)


def main():
    products = load_products()
    PRODUCT_DIR.mkdir(parents=True, exist_ok=True)

    grouped = defaultdict(list)
    for product in products:
        grouped[int(product["page"])].append(product)

    written = 0
    for page, page_products in grouped.items():
        source = page_image(page)
        if not source.exists():
            continue
        with Image.open(source).convert("RGB") as image:
            for index, product in enumerate(page_products):
                box = SPECIAL_CROPS.get(product["id"]) or generic_grid_box(
                    index,
                    len(page_products),
                    image.width,
                    image.height,
                )
                save_crop(image, box, PRODUCT_DIR / f"{product['id']}.webp")
                written += 1

    for product_id, page in EXTRA_CROPS.items():
        source = page_image(page)
        if not source.exists():
            continue
        with Image.open(source).convert("RGB") as image:
            save_crop(image, SPECIAL_CROPS[product_id], PRODUCT_DIR / f"{product_id}.webp")
            written += 1

    print(f"Generated {written} product WebP crops in {PRODUCT_DIR}")


if __name__ == "__main__":
    main()
