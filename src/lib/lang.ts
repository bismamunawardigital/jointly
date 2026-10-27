"use client";

import { useEffect, useState } from "react";

export type Lang = "en" | "ar";

export function useLang(): Lang {
  const [lang, setL] = useState<Lang>("en");
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "ar" || q === "en") localStorage.setItem("jointly-lang", q);
    const read = () => setL(localStorage.getItem("jointly-lang") === "ar" ? "ar" : "en");
    read();
    window.addEventListener("jointly:lang", read);
    return () => window.removeEventListener("jointly:lang", read);
  }, []);
  return lang;
}

export function setLang(l: Lang) {
  localStorage.setItem("jointly-lang", l);
  window.dispatchEvent(new Event("jointly:lang"));
}
