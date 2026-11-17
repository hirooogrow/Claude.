"""Extract the HSK 3.0 vocab-list PDFs (Chinese Language Institute layout) into JSON.

The English meanings are only used as the basis for the Japanese translations in
scripts/ja/*.tsv; the app data is built by scripts/build_hsk_data.py.

Usage:
  pdftotext -layout hsk-3-vocab-list-hsk-v3.pdf <txt>/hsk3.txt   # words 501-1000
  pdftotext -layout hsk-4-vocab-list-hsk-v3.pdf <txt>/hsk4.txt   # words 1001-2000
  pdftotext -layout hsk-5-vocab-list-hsk-v3.pdf <txt>/hsk5.txt   # words 2001-3600
  python3 scripts/parse_hsk_pdf.py <txt> <out>    # writes <out>/hsk{3,4,5}.en.json
"""
import json, re, sys, unicodedata

PINYIN_OK = re.compile(r"^[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙ'’〜 ·/\-ǹńňḿ]+$")
HAN = re.compile(r"[㐀-鿿]")

def clean(s):
    return re.sub(r"\s+", " ", s).strip()

def parse_en(path):
    """HSK 3.0 lists (English): No  Chinese  Pinyin  English  [POS]; English may wrap onto following lines."""
    words, cur, pos_col = [], None, None
    for raw in open(path, encoding="utf-8"):
        line = raw.rstrip("\n")
        if re.match(r"^\s*No\.\s+Chinese", line):
            pos_col = line.index("Part of speech")
            continue
        m = re.match(r"^(\s*)(\d{1,4})(\s+)(\S+)(\s+)(.+?)\s{2,}(\S.*)$", line)
        if m and HAN.search(m.group(4)):
            no, hanzi, pinyin, rest = m.group(2), m.group(4), m.group(6), m.group(7)
            start = m.start(7)
            english, pos = rest, ""
            # split off the part-of-speech column (starts at/after pos_col)
            mm = re.match(r"^(.*?)\s{2,}(\S+)$", rest)
            if mm and start + mm.start(2) >= pos_col - 2:
                english, pos = mm.group(1), mm.group(2)
            elif start >= pos_col - 2:
                english, pos = "", rest
            cur = {"no": int(no), "hanzi": hanzi, "pinyin": clean(pinyin), "meaning": clean(english), "pos": pos.strip()}
            words.append(cur)
            continue
        stripped = line.strip()
        if cur and stripped and pos_col and not stripped.startswith(("Published by", "No.")):
            indent = len(line) - len(line.lstrip())
            if indent >= 20 and indent < pos_col - 2:
                cur["meaning"] = clean(cur["meaning"] + " " + stripped)
            elif indent >= pos_col - 2:
                cur["pos"] = clean(cur["pos"] + stripped)
        if not stripped:
            pass
        if stripped.startswith(("Ready to use", "Published by")):
            cur = None if stripped.startswith("Ready") else cur
    return words

def validate(words, first, last, name):
    nos = [w["no"] for w in words]
    expected = list(range(first, last + 1))
    problems = []
    if nos != expected:
        missing = sorted(set(expected) - set(nos)); extra = sorted(set(nos) - set(expected))
        dup = sorted({n for n in nos if nos.count(n) > 1})
        problems.append(f"numbering: missing={missing[:20]} extra={extra[:20]} dup={dup[:20]}")
    for w in words:
        if not PINYIN_OK.match(unicodedata.normalize("NFC", w["pinyin"])):
            problems.append(f"pinyin? {w}")
        if not w["meaning"]:
            problems.append(f"no meaning: {w}")
        if not all(HAN.match(c) or c in "（）()…〜" for c in w["hanzi"]):
            problems.append(f"hanzi? {w}")
    print(f"{name}: {len(words)} words, {len(problems)} problems", file=sys.stderr)
    for p in problems[:40]:
        print("  ", p, file=sys.stderr)
    return not problems

DECKS = {"hsk3": (501, 1000), "hsk4": (1001, 2000), "hsk5": (2001, 3600)}

if __name__ == "__main__":
    src, out = sys.argv[1], sys.argv[2]
    ok = True
    for name, (first, last) in DECKS.items():
        ws = parse_en(f"{src}/{name}.txt")
        ok &= validate(ws, first, last, name)
        with open(f"{out}/{name}.en.json", "w", encoding="utf-8") as f:
            json.dump(ws, f, ensure_ascii=False, indent=0)
    sys.exit(0 if ok else 1)
