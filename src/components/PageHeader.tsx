type PageHeaderProps = {
  title: string;
  /** 中国語の見出し（例: 聊天） */
  zh: string;
  /** ピンイン */
  pinyin: string;
  right?: React.ReactNode;
};

export function PageHeader({ title, zh, pinyin, right }: PageHeaderProps) {
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-line/70 bg-white/85 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-extrabold leading-tight text-ink">
            {title}
          </h1>
          <p className="truncate text-[11px] leading-tight text-muted">
            <span lang="zh-CN" className="font-semibold text-brand-600">
              {zh}
            </span>
            <span className="ml-1.5">{pinyin}</span>
          </p>
        </div>
        {right}
      </div>
    </header>
  );
}
