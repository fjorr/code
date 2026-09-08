"""Fjorr Pro design recipe.

Built from Inter (OFL). Prompt changes here, then run:

    python3 fonts/fjorr-pro/build.py

Do not rename this family back to Inter. Inter is a reserved name.
"""

FAMILY = "Fjorr Pro"
TIGHT_FAMILY = "Fjorr Pro Tight"

# Scale the dots on i and j only. 1.0 is Inter. Smaller sits closer to the stem.
TITTLE_SCALE = 0.62

# Extra drop, in font units, after the scale. Positive moves the dot down.
TITTLE_DROP = 36

# Text face: add this many units to both sidebearings. Wider, calmer than Inter.
TEXT_SIDEBEARING = 48

# Headline cut: pull both sidebearings in by this many units.
TIGHT_SIDEBEARING = 22

# Bake Inter's geometric alternates into the default letters.
# Single-story a, open digits, compact f and t. Leave g as Inter's double-story g.
SINGLE_STORY_A = True
OPEN_DIGITS = True
COMPACT_F = True
COMPACT_T = True

# Text face uses Inter's text optical size. Tight uses a slightly larger
# optical size so headlines are a bit sharper, then the sidebearing squeeze.
TEXT_OPSZ = 16
TIGHT_OPSZ = 24

WEIGHTS = {
    500: "Medium",
    600: "SemiBold",
    700: "Bold",
    800: "ExtraBold",
}
