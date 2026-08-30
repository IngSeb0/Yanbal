from __future__ import annotations

import json
import re
from pathlib import Path

import pdfplumber
import pypdfium2 as pdfium
from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
CATALOG_PDF = Path(r"C:\Users\Acer\Downloads\COL_2026_C09 (1) (1).pdf")
WEEKLY_PDF = Path(r"C:\Users\Acer\Downloads\Solo para ti_C9_S2_COL.pdf")

CATALOG_DIR = ROOT / "public" / "catalog"
WEEKLY_DIR = ROOT / "public" / "weekly"
OUTPUT_TS = ROOT / "app" / "catalog-data.ts"


SECTION_RANGES = [
    (2, 3, "Destacados"),
    (4, 23, "Perfumes y colonias"),
    (24, 43, "Joyería para mujer"),
    (44, 71, "Maquillaje"),
    (72, 89, "Tratamiento facial"),
    (90, 95, "Protección solar"),
    (96, 107, "Cuidado personal"),
    (108, 123, "Mundo hombre"),
    (124, 127, "Bebés y niños"),
]


GIFT_PAGES = {
    2,
    3,
    5,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    37,
    39,
    45,
    46,
    47,
    101,
    109,
}


def clean_text(text: str) -> str:
    text = text.replace("\u0000", " ").replace("\ufffd", "")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def section_for_page(page_number: int) -> str:
    for start, end, section in SECTION_RANGES:
        if start <= page_number <= end:
            return section
    return "Catálogo Yanbal"


def prices_from_text(text: str) -> list[str]:
    prices = re.findall(r"\$\s?[0-9][0-9.]*", text)
    normalized: list[str] = []
    for price in prices:
        value = re.sub(r"\s+", "", price)
        if value not in normalized:
            normalized.append(value)
    return normalized[:8]


def codes_from_text(text: str) -> list[str]:
    codes = re.findall(r"C.D.\s*([0-9]{2,6})", text, flags=re.IGNORECASE)
    normalized: list[str] = []
    for code in codes:
        if code not in normalized:
            normalized.append(code)
    return normalized[:8]


def autocrop(image: Image.Image) -> Image.Image:
    background = Image.new(image.mode, image.size, image.getpixel((0, 0)))
    diff = ImageChops.difference(image, background)
    diff = ImageChops.add(diff, diff, 2.0, -18)
    bbox = diff.getbbox()
    if bbox:
        return image.crop(bbox)
    return image


def clean_output_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)
    for image in path.glob("*.webp"):
        image.unlink()


def render_page_image(pdf: pdfium.PdfDocument, index: int, width: int) -> Image.Image:
    page = pdf[index]
    page_width, _ = page.get_size()
    scale = width / page_width
    bitmap = page.render(scale=scale)
    image = bitmap.to_pil().convert("RGB")
    return autocrop(image)


def save_webp(image: Image.Image, output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, "WEBP", quality=68, method=6)


def render_page(pdf: pdfium.PdfDocument, index: int, output: Path, width: int) -> None:
    save_webp(render_page_image(pdf, index, width), output)


def extract_texts(path: Path) -> list[str]:
    texts: list[str] = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            texts.append(clean_text(page.extract_text(x_tolerance=2, y_tolerance=3) or ""))
    return texts


def build_catalog() -> list[dict[str, object]]:
    texts = extract_texts(CATALOG_PDF)
    pdf = pdfium.PdfDocument(str(CATALOG_PDF))
    pages: list[dict[str, object]] = []

    for index, text in enumerate(texts):
        page_number = index + 1
        prices = prices_from_text(text)
        codes = codes_from_text(text)
        if page_number > 1 and not prices and not codes:
            continue

        filename = f"c9-page-{page_number:03d}.webp"
        render_page(pdf, index, CATALOG_DIR / filename, 760)
        section = section_for_page(page_number)
        pages.append(
            {
                "page": page_number,
                "section": section,
                "title": f"{section} - pág. {page_number}",
                "image": f"/catalog/{filename}",
                "prices": prices,
                "codes": codes,
                "searchText": text[:900],
                "isGiftable": page_number in GIFT_PAGES,
            }
        )
    return pages


def build_weekly() -> list[dict[str, object]]:
    texts = extract_texts(WEEKLY_PDF)
    pdf = pdfium.PdfDocument(str(WEEKLY_PDF))
    pages: list[dict[str, object]] = []

    offer_index = 1
    for index, text in enumerate(texts):
        page_number = index + 1
        image = render_page_image(pdf, index, 900)
        chunk_height = 1650
        chunks = [image]
        if image.height > chunk_height * 1.35:
            chunks = []
            for top in range(0, image.height, chunk_height):
                bottom = min(top + chunk_height, image.height)
                if bottom - top < 520 and chunks:
                    previous = chunks.pop()
                    merged = Image.new("RGB", (image.width, previous.height + (bottom - top)), "white")
                    merged.paste(previous, (0, 0))
                    merged.paste(image.crop((0, top, image.width, bottom)), (0, previous.height))
                    chunks.append(merged)
                else:
                    chunks.append(image.crop((0, top, image.width, bottom)))

        for chunk_number, chunk in enumerate(chunks, start=1):
            filename = f"solo-c9-s2-page-{page_number:03d}-{chunk_number:02d}.webp"
            save_webp(chunk, WEEKLY_DIR / filename)
            pages.append(
                {
                    "page": page_number,
                    "title": f"Oferta semanal {offer_index}",
                    "image": f"/weekly/{filename}",
                    "prices": prices_from_text(text),
                    "codes": codes_from_text(text),
                    "searchText": text[:900],
                }
            )
            offer_index += 1
    return pages


def write_ts(catalog_pages: list[dict[str, object]], weekly_pages: list[dict[str, object]]) -> None:
    body = f"""export type CatalogPage = {{
  page: number;
  section: string;
  title: string;
  image: string;
  prices: string[];
  codes: string[];
  searchText: string;
  isGiftable: boolean;
}};

export type WeeklyOfferPage = {{
  page: number;
  title: string;
  image: string;
  prices: string[];
  codes: string[];
  searchText: string;
}};

export const catalogPages = {json.dumps(catalog_pages, ensure_ascii=False, indent=2)} satisfies CatalogPage[];

export const weeklyOfferPages = {json.dumps(weekly_pages, ensure_ascii=False, indent=2)} satisfies WeeklyOfferPage[];
"""
    OUTPUT_TS.write_text(body, encoding="utf-8")


def main() -> None:
    clean_output_dir(CATALOG_DIR)
    clean_output_dir(WEEKLY_DIR)
    catalog_pages = build_catalog()
    weekly_pages = build_weekly()
    write_ts(catalog_pages, weekly_pages)
    print(f"catalog pages: {len(catalog_pages)}")
    print(f"weekly pages: {len(weekly_pages)}")


if __name__ == "__main__":
    main()
