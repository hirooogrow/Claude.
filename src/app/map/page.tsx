import type { Metadata } from "next";
import { Lock, MapPin, ScrollText, Soup, Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, ComingSoonBadge, SectionTitle } from "@/components/ui/Card";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";

export const metadata: Metadata = { title: "マップ雑学" };

/** マップ上の都市（x, y は地図枠内の % 座標の目安） */
const CITIES = [
  { name: "北京", pinyin: "Běijīng", x: 66, y: 30, unlocked: true },
  { name: "西安", pinyin: "Xī'ān", x: 50, y: 48, unlocked: false },
  { name: "上海", pinyin: "Shànghǎi", x: 84, y: 50, unlocked: false },
  { name: "成都", pinyin: "Chéngdū", x: 40, y: 60, unlocked: false },
  { name: "杭州", pinyin: "Hángzhōu", x: 70, y: 66, unlocked: false },
  { name: "广州", pinyin: "Guǎngzhōu", x: 62, y: 80, unlocked: false },
];

const COLLECTIONS = [
  { label: "漢詩", count: "0", icon: ScrollText },
  { label: "四字熟語", count: "0/50", icon: Trophy },
  { label: "名物", count: "0", icon: Soup },
];

export default function MapPage() {
  const unlocked = CITIES.filter((c) => c.unlocked).length;

  return (
    <>
      <PageHeader
        title="中国マップ＆雑学"
        zh="地图"
        pinyin="dìtú"
        right={
          <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white">
            {unlocked}/{CITIES.length} 都市
          </span>
        }
      />

      <Stagger className="flex flex-col gap-5 px-4 py-5">
        {/* マッププレースホルダー */}
        <StaggerItem>
          <Card className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-brand-50 to-white">
            <div
              aria-hidden
              className="absolute inset-0 opacity-60 [background-image:radial-gradient(var(--color-brand-200)_1px,transparent_1px)] [background-size:14px_14px]"
            />
            {CITIES.map((city) => (
              <div
                key={city.name}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full shadow-card ${
                    city.unlocked
                      ? "bg-brand-600 text-white"
                      : "bg-white text-muted ring-1 ring-line"
                  }`}
                >
                  {city.unlocked ? <MapPin size={14} /> : <Lock size={12} />}
                </span>
                <span
                  className={`mt-0.5 text-[10px] font-bold ${
                    city.unlocked ? "text-brand-700" : "text-muted"
                  }`}
                >
                  {city.name}
                </span>
              </div>
            ))}
            <div className="absolute bottom-2 right-2">
              <ComingSoonBadge label="マップ準備中" />
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <SectionTitle>コレクション</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {COLLECTIONS.map(({ label, count, icon: Icon }) => (
              <Card key={label} className="flex flex-col items-center gap-1 py-3">
                <Icon size={18} className="text-gold-500" />
                <span className="text-base font-extrabold text-ink">{count}</span>
                <span className="text-[10px] font-semibold text-muted">{label}</span>
              </Card>
            ))}
          </div>
        </StaggerItem>

        <StaggerItem>
          <SectionTitle>都市リスト</SectionTitle>
          <Card className="divide-y divide-line">
            {CITIES.map((city) => (
              <div key={city.name} className="flex items-center gap-3 px-4 py-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
                    city.unlocked ? "bg-brand-600 text-white" : "bg-zinc-100 text-muted"
                  }`}
                >
                  {city.name[0]}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink">{city.name}</p>
                  <p className="text-[11px] text-muted">{city.pinyin}</p>
                </div>
                {city.unlocked ? (
                  <span className="text-[11px] font-bold text-brand-600">解放済み</span>
                ) : (
                  <Lock size={16} className="text-muted/60" />
                )}
              </div>
            ))}
          </Card>
        </StaggerItem>
      </Stagger>
    </>
  );
}
