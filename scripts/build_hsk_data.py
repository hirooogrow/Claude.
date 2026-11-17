"""Build the app's word data: words from the PDFs + Japanese meanings from scripts/ja/*.tsv.

Usage:
  python3 scripts/parse_hsk_pdf.py <txt> <work>   # extract the PDFs first (see that script)
  python3 scripts/build_hsk_data.py <work> src/data/hsk

scripts/ja/<deck>.tsv holds one line per word: `<no>\t<Japanese meaning>`.
The English meanings from the PDFs are not written to the app data.
"""
import json, sys

DECKS = ("hsk3", "hsk4", "hsk5")

POS_JA = {
    "n.": "名詞", "v.": "動詞", "adj.": "形容詞", "adv.": "副詞", "m.w.": "量詞",
    "conj.": "接続詞", "prep.": "介詞", "pron.": "代詞", "num.": "数詞",
    "interj.": "感嘆詞", "part.": "助詞", "suff.": "接尾辞", "pref.": "接頭辞",
    "onom.": "擬声語",
}

def pos_ja(pos: str) -> str:
    parts = [p.strip() for p in pos.split("/") if p.strip()]
    unknown = [p for p in parts if p not in POS_JA]
    if unknown:
        raise SystemExit(f"unknown part of speech: {unknown}")
    return "・".join(POS_JA[p] for p in parts)

def load_tsv(path):
    out = {}
    with open(path, encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            line = line.rstrip("\n")
            if not line:
                continue
            no, sep, ja = line.partition("\t")
            if not sep or not no.isdigit() or not ja.strip():
                raise SystemExit(f"{path}:{i}: malformed line: {line!r}")
            if int(no) in out:
                raise SystemExit(f"{path}:{i}: duplicate number {no}")
            out[int(no)] = ja.strip()
    return out

if __name__ == "__main__":
    work, out_dir = sys.argv[1], sys.argv[2]
    for deck in DECKS:
        words = json.load(open(f"{work}/{deck}.en.json", encoding="utf-8"))
        ja = load_tsv(f"scripts/ja/{deck}.tsv")
        nos = {w["no"] for w in words}
        if nos != set(ja):
            raise SystemExit(f"{deck}: missing={sorted(nos - set(ja))[:10]} extra={sorted(set(ja) - nos)[:10]}")
        rows = []
        for w in words:
            row = {"no": w["no"], "hanzi": w["hanzi"], "pinyin": w["pinyin"], "meaning": ja[w["no"]]}
            if w["pos"]:
                row["pos"] = pos_ja(w["pos"])
            rows.append(row)
        with open(f"{out_dir}/{deck}.json", "w", encoding="utf-8") as f:
            f.write("[\n" + ",\n".join(json.dumps(r, ensure_ascii=False, separators=(",", ":")) for r in rows) + "\n]\n")
        print(f"{deck}: {len(rows)} words")
