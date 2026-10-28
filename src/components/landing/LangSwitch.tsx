"use client";

export function LangSwitch({ href, label, lang, className }: { href: string; label: string; lang: string; className?: string }) {
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    let id = "";
    document.querySelectorAll<HTMLElement>("section[id]").forEach((s) => {
      if (s.getBoundingClientRect().top <= 160) id = s.id;
    });
    window.location.href = href + (id ? `#${id}` : "");
  };
  return (
    <a href={href} lang={lang} onClick={go} className={className}>
      {label}
    </a>
  );
}
