"""Parse `pdftotext -layout` output of the HSK vocab PDFs into JSON word lists.

Usage:
  pdftotext -layout <HSK4級単語リスト.pdf>   <txt>/hsk4.txt   # Japanese meanings (HSK 2.0, 600 words)
  pdftotext -layout <hsk-3-vocab-list.pdf>   <txt>/hsk3.txt   # English meanings (HSK 3.0, words 501-1000)
  pdftotext -layout <hsk-5-vocab-list.pdf>   <txt>/hsk5.txt   # English meanings (HSK 3.0, words 2001-3600)
  python3 scripts/parse_hsk_pdf.py <txt> src/data/hsk
"""
import json, re, sys, unicodedata

PINYIN_OK = re.compile(r"^[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙ'’〜 ·\-]+$")
HAN = re.compile(r"[㐀-鿿]")

def fix_radicals(s):
    """Word-exported PDFs sometimes use Kangxi radical code points (e.g. ⼤ U+2F24) for normal hanzi."""
    return "".join(unicodedata.normalize("NFKC", c) if 0x2E80 <= ord(c) <= 0x2FDF else c for c in s)

def clean(s):
    return re.sub(r"\s+", " ", s).strip()

def parse_ja(path):
    """HSK4 list (Japanese): No  中国語  ピンイン  日本語"""
    words = []
    seen = set()
    for line in open(path, encoding="utf-8"):
        m = re.match(r"^\s*(\d{1,4})\s+(\S+)\s+(.+?)\s{2,}(\S.*)$", fix_radicals(line.rstrip("\n")))
        if not m or not HAN.search(m.group(2)):
            continue
        no, hanzi, pinyin, meaning = m.groups()
        if int(no) in seen:  # a row repeated across a page break
            continue
        seen.add(int(no))
        words.append({"no": int(no), "hanzi": hanzi, "pinyin": clean(pinyin), "meaning": clean(meaning)})
    return words

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

if __name__ == "__main__":
    src, out = sys.argv[1], sys.argv[2]
    hsk4 = parse_ja(f"{src}/hsk4.txt"); validate(hsk4, 1, 600, "hsk4")
    hsk3 = parse_en(f"{src}/hsk3.txt"); validate(hsk3, 501, 1000, "hsk3")
    hsk5 = parse_en(f"{src}/hsk5.txt"); validate(hsk5, 2001, 3600, "hsk5")
    for name, ws in (("hsk3", hsk3), ("hsk4", hsk4), ("hsk5", hsk5)):
        with open(f"{out}/{name}.json", "w", encoding="utf-8") as f:
            f.write("[\n" + ",\n".join(json.dumps(w, ensure_ascii=False, separators=(",", ":")) for w in ws) + "\n]\n")
