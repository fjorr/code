#!/usr/bin/env python3
"""Build Fjorr Pro web fonts from the Inter variable source plus recipe.py."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from copy import deepcopy

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

from recipe import (
    COMPACT_F,
    COMPACT_T,
    FAMILY,
    OPEN_DIGITS,
    SINGLE_STORY_A,
    TEXT_OPSZ,
    TEXT_SIDEBEARING,
    TIGHT_FAMILY,
    TIGHT_OPSZ,
    TIGHT_SIDEBEARING,
    TITTLE_DROP,
    TITTLE_SCALE,
    WEIGHTS,
)

VENDOR = ROOT / "vendor" / "InterVariable.ttf"
OUT = ROOT.parents[1] / "public" / "fonts" / "fjorr-pro"
TITTLE_GLYPHS = ("i", "j")
TITTLE_COMPONENT = "uni0307"

# Latin text the site actually sets, plus a few punctuation marks.
UNICODES = (
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x100))
    + [
        0x2013,
        0x2014,
        0x2018,
        0x2019,
        0x201C,
        0x201D,
        0x2022,
        0x2026,
        0x20AC,
    ]
)


def postscript_name(family: str, style: str) -> str:
    return f"{family.replace(' ', '')}-{style}"


def set_name(font: TTFont, name_id: int, value: str) -> None:
    name = font["name"]
    name.setName(value, name_id, 3, 1, 0x409)
    name.setName(value, name_id, 1, 0, 0)


def rename(font: TTFont, family: str, style: str, weight: int) -> None:
    ps = postscript_name(family, style)
    full = f"{family} {style}"
    copyright = font["name"].getDebugName(0) or "Copyright 2016 The Inter Project Authors"
    notice = (
        f"{copyright} Fjorr Pro is a modified version of Inter, "
        "renamed under the SIL Open Font License."
    )
    set_name(font, 0, notice)
    set_name(font, 1, family)
    set_name(font, 2, style)
    set_name(font, 3, f"1.000;FJRR;{ps}")
    set_name(font, 4, full)
    set_name(font, 6, ps)
    set_name(font, 16, family)
    set_name(font, 17, style)

    os2 = font["OS/2"]
    os2.usWeightClass = weight
    head = font["head"]
    # OS/2 bit 5 bold, bit 6 regular. head macStyle bit 0 matches bold.
    if weight >= 700:
        os2.fsSelection = (os2.fsSelection | 0x20) & ~0x40
        head.macStyle = head.macStyle | 0x01
    else:
        os2.fsSelection = (os2.fsSelection | 0x40) & ~0x20
        head.macStyle = head.macStyle & ~0x01

    if "CFF " in font:
        font["CFF "].cff.fontNames[0] = ps


def scale_tittles(font: TTFont) -> None:
    glyf = font["glyf"]
    mark = glyf[TITTLE_COMPONENT]
    x_min, y_min, x_max, y_max = mark.xMin, mark.yMin, mark.xMax, mark.yMax
    cx = (x_min + x_max) / 2
    cy = (y_min + y_max) / 2
    scale = TITTLE_SCALE

    for name in TITTLE_GLYPHS:
        glyph = glyf[name]
        if not glyph.isComposite():
            raise SystemExit(f"{name} is not a composite; recipe needs an update")
        for comp in glyph.components:
            if comp.glyphName != TITTLE_COMPONENT:
                continue
            comp.transform = [[scale, 0], [0, scale]]
            comp.x = comp.x + cx * (1 - scale)
            comp.y = comp.y + cy * (1 - scale) - TITTLE_DROP


def shift_sidebearings(font: TTFont, amount: int) -> None:
    """Positive amount adds space on both sides. Negative pulls them in."""
    if amount == 0:
        return
    hmtx = font["hmtx"]
    for name, (advance, lsb) in list(hmtx.metrics.items()):
        if amount < 0 and advance < abs(amount) * 4:
            continue
        hmtx.metrics[name] = (advance + amount * 2, lsb + amount)


def feature_swaps(font: TTFont, feature_tag: str) -> dict[str, str]:
    gsub = font["GSUB"].table
    swaps: dict[str, str] = {}
    for rec in gsub.FeatureList.FeatureRecord:
        if rec.FeatureTag != feature_tag:
            continue
        for index in rec.Feature.LookupListIndex:
            lookup = gsub.LookupList.Lookup[index]
            for subtable in lookup.SubTable:
                mapping = getattr(subtable, "mapping", None)
                if not mapping:
                    continue
                for src, dest in mapping.items():
                    if "." in src:
                        continue
                    swaps[src] = dest
    return swaps


def bake_swaps(font: TTFont, swaps: dict[str, str]) -> None:
    glyf = font["glyf"]
    hmtx = font["hmtx"].metrics
    for src, dest in swaps.items():
        if src not in glyf or dest not in glyf:
            continue
        glyf[src] = deepcopy(glyf[dest])
        if dest in hmtx:
            hmtx[src] = hmtx[dest]


def apply_letter_recipe(font: TTFont) -> None:
    swaps: dict[str, str] = {}
    if SINGLE_STORY_A:
        swaps.update(feature_swaps(font, "cv11"))
    if OPEN_DIGITS:
        swaps.update(feature_swaps(font, "ss01"))
        swaps.update(feature_swaps(font, "cv01"))
    if COMPACT_F:
        swaps.update(feature_swaps(font, "cv12"))
    if COMPACT_T:
        swaps.update(feature_swaps(font, "cv13"))
    bake_swaps(font, swaps)


def subset(font: TTFont) -> None:
    options = Options()
    options.layout_features = ["kern", "liga", "calt"]
    options.desubroutinize = True
    options.hinting = False
    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)


def build_face(source: Path, family: str, opsz: float, weight: int, style: str, tight: bool) -> TTFont:
    font = TTFont(source)
    instantiateVariableFont(font, {"opsz": opsz, "wght": weight}, inplace=True, updateFontNames=False)
    apply_letter_recipe(font)
    scale_tittles(font)
    if tight:
        shift_sidebearings(font, -TIGHT_SIDEBEARING)
    else:
        shift_sidebearings(font, TEXT_SIDEBEARING)
    rename(font, family, style, weight)
    subset(font)
    return font


def main() -> None:
    if not VENDOR.exists():
        raise SystemExit(f"Missing Inter source: {VENDOR}")

    OUT.mkdir(parents=True, exist_ok=True)
    for weight, style in WEIGHTS.items():
        faces = [
            (FAMILY, TEXT_OPSZ, False, f"FjorrPro-{style}.woff2"),
            (TIGHT_FAMILY, TIGHT_OPSZ, True, f"FjorrProTight-{style}.woff2"),
        ]
        for family, opsz, tight, filename in faces:
            font = build_face(VENDOR, family, opsz, weight, style, tight)
            dest = OUT / filename
            font.flavor = "woff2"
            font.save(dest)
            print(f"{dest.name}  {dest.stat().st_size // 1024}KB")


if __name__ == "__main__":
    main()
