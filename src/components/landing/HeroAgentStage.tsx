"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Caveat, Newsreader } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { AgentMark } from "@/components/ui";
import "./hero-agent-stage.css";

const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-newsreader" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500"], variable: "--font-caveat" });

const primary = "inline-flex h-11 items-center gap-1.5 rounded-lg bg-accent px-5 text-sm font-medium text-onaccent transition-colors hover:bg-accent-hover";

const people = [
  { n: "MOHAMMED ALI ALMANSOORI", id: "784-1979-•••••••-4", exp: "22/09/2028" },
  { n: "KHALIFA SAEED ALFALASI", id: "784-1981-•••••••-1", exp: "14/03/2027" },
  { n: "RASHID HAMAD ALKETBI", id: "784-1984-•••••••-7", exp: "09/11/2029" },
];

function useAgentStage(wrapRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const $ = (id: string) => wrap.querySelector<HTMLElement>(`#${id}`)!;
    const qsa = (s: string) => Array.from(wrap.querySelectorAll<HTMLElement>(s));
    const root = $("cv");
    const st = root.parentElement!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fit = () => st.style.setProperty("--s", String(st.clientWidth / 1000));
    const ro = new ResizeObserver(fit);
    ro.observe(st);
    fit();

    let gen = 0;
    let paused = false;
    let onScreen = true;
    const syncPause = () => {
      $("pause").textContent = paused ? "Play" : "Pause";
      root.classList.toggle("paused", paused || !onScreen);
    };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; syncPause(); }, { threshold: 0.05 });
    io.observe(st);

    const wait = (ms: number, g: number) => new Promise<void>((res, rej) => {
      let t = 0;
      const tick = () => {
        if (g !== gen) return rej("stop");
        if (t >= ms) return res();
        setTimeout(() => { if (!paused && onScreen) t += 40; tick(); }, 40);
      };
      tick();
    });

    const pos = (el: HTMLElement) => {
      let x = 0, y = 0;
      let n: HTMLElement | null = el;
      while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };
    const agent = $("cur-agent"), person = $("cur-person");
    const moveTo = (cur: HTMLElement, el: HTMLElement, dx = 0.6, dy = 0.5) => {
      const p = pos(el);
      cur.style.left = p.x + p.w * dx + "px";
      cur.style.top = p.y + p.h * dy + "px";
      const tag = cur.querySelector<HTMLElement>(".tag")!;
      cur.classList.toggle("flip", p.x + p.w * dx + 17 + tag.offsetWidth > 1000);
    };
    const doing = (text: string) => { $("doing").textContent = text ? " · " + text : ""; };
    const step = (name: string, state?: string) => {
      const s = root.querySelector(`[data-step="${name}"]`)!;
      s.classList.remove("active", "done");
      if (state) s.classList.add(state);
    };
    const focus = (id: string | null) => { qsa(".sys").forEach((s) => s.classList.toggle("active", s.id === id)); };
    let count = 0;
    const countTo = async (to: number, w: (ms: number) => Promise<void>) => {
      while (count < to) { count = Math.min(to, count + 1); $("count").textContent = String(count); await w(40); }
    };
    const clock = (t: string) => { $("clock").textContent = t; };

    const card = (i: number) => {
      const p = people[i];
      $("h-efr").textContent = p.n; $("e-num").textContent = p.id; $("e-exp").textContent = p.exp; $("efr-n").textContent = "3 IDs";
      $("e-exp").classList.remove("warn");
    };
    const setSt = (t: string, cls: string) => { const e = $("efr-st"); e.textContent = t; e.className = "efr-st" + (cls ? " " + cls : ""); };

    const link = (a: HTMLElement, b: HTMLElement) => {
      const A = pos(a), B = pos(b);
      const x1 = A.x + A.w / 2, y1 = A.y + A.h / 2, x2 = B.x + B.w / 2, y2 = B.y + B.h / 2;
      const midX = (x1 + x2) / 2;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`);
      $("links").appendChild(path);
      const L = path.getTotalLength();
      path.style.strokeDasharray = String(L); path.style.strokeDashoffset = String(L);
      path.getBoundingClientRect();
      path.style.transition = "stroke-dashoffset .7s ease-out"; path.style.strokeDashoffset = "0";
    };

    const fly = (fromEl: HTMLElement, toEl: HTMLElement, text: string) => {
      const a = pos(fromEl), b = pos(toEl);
      const chip = document.createElement("div"); chip.className = "badge on"; chip.textContent = text;
      chip.style.left = a.x + "px"; chip.style.top = a.y + "px"; chip.style.transition = "none"; root.appendChild(chip);
      const dx = b.x - a.x, dy = b.y - a.y;
      const anim = chip.animate([
        { transform: "translate(0,0) scale(.9)", opacity: 0 },
        { transform: "translate(0,-8px) scale(1)", opacity: 1, offset: 0.2 },
        { transform: `translate(${dx}px,${dy}px)`, opacity: 1, offset: 0.85 },
        { transform: `translate(${dx}px,${dy}px) scale(.96)`, opacity: 0 },
      ], { duration: 1100, easing: "cubic-bezier(.6,0,.2,1)" });
      anim.onfinish = () => chip.remove();
    };

    const reset = () => {
      root.classList.remove("live", "end");
      qsa(".sys").forEach((x) => x.classList.remove("read", "active"));
      qsa(".step").forEach((s) => s.classList.remove("active", "done"));
      qsa(".hl").forEach((h) => h.classList.remove("on", "warn", "old"));
      qsa(".pr").forEach((p) => p.classList.remove("filled", "warn"));
      $("r-res").textContent = "3 sources agree";
      card(1); setSt("Not checked yet", "");
      $("rule").className = "rule";
      $("setup").className = "setup"; $("track").style.width = "0";
      $("links").innerHTML = ""; $("b-same").classList.remove("on");
      $("phone").classList.remove("on");
      qsa(".badge:not(#b-same)").forEach((b) => b.remove());
      agent.classList.add("off"); person.classList.add("off");
      agent.style.left = "500px"; agent.style.top = "30px";
      person.style.left = "960px"; person.style.top = "560px";
      doing(""); count = 0; $("count").textContent = "0"; clock("09:00");
    };

    const final = () => {
      root.classList.add("live", "end");
      qsa(".sys").forEach((x) => x.classList.add("read"));
      qsa(".step").forEach((s) => s.classList.add("done"));
      qsa(".pr").forEach((p) => p.classList.add("filled"));
      card(1); setSt("All 3 IDs valid", "ok");
      $("h-amt").classList.add("old"); $("rule").className = "rule filled ok"; $("setup").className = "setup on read"; $("track").style.width = "100%";
      $("phone").classList.add("on"); $("count").textContent = "39"; clock("10:54");
    };

    const play = async (w: (ms: number) => Promise<void>) => {
      agent.classList.remove("off"); step("match", "active"); await w(300);
      doing("SVS names are typed by hand, checking them");
      focus("s-svs"); moveTo(agent, $("h-svs")); await w(850); $("h-svs").classList.add("warn"); clock("09:01"); countTo(5, w); await w(800);
      doing("comparing with Finacle"); focus("s-fin"); moveTo(agent, $("h-fin")); await w(850); $("h-fin").classList.add("on"); link($("h-svs"), $("h-fin")); countTo(10, w); await w(600);
      doing("comparing with the Emirates ID"); focus("s-efr"); moveTo(agent, $("h-efr")); await w(850); $("h-efr").classList.add("on"); link($("h-fin"), $("h-efr")); countTo(15, w); await w(600);
      doing("comparing with the signed form"); focus("s-form"); moveTo(agent, $("h-form")); await w(850); $("h-form").classList.add("on"); link($("h-efr"), $("h-form")); countTo(20, w); await w(500);
      const e = pos($("h-efr")); const b = $("b-same"); b.style.left = e.x - 40 + "px"; b.style.top = e.y - 32 + "px"; b.classList.add("on");
      await w(500);
      for (const id of ["p-m", "p-k", "p-r"]) { $(id).classList.add("filled"); await w(260); }
      step("match", "done"); clock("09:02"); $("s-form").classList.add("read"); $("s-fin").classList.add("read"); await w(900);
      $("b-same").classList.remove("on"); $("links").innerHTML = "";
      qsa("#h-svs, #h-form, #h-fin, #h-efr").forEach((h) => h.classList.remove("on", "warn"));

      step("mandate", "active"); doing("reading free-text remarks in SVS"); focus("s-svs");
      moveTo(agent, $("h-rule"), 0.75, 0.2); await w(900); $("h-rule").classList.add("on"); countTo(26, w); await w(900);
      fly($("h-rule"), $("rule"), "Any 2 of 3, up to AED 25,000"); await w(1000);
      $("rule").classList.add("filled"); clock("09:05"); await w(500);
      doing("two officers wrote different limits"); moveTo(agent, $("h-amt"), 0.8, 0.4); await w(900);
      $("h-amt").classList.add("warn"); $("rule").classList.add("ask"); countTo(30, w);
      step("mandate", "done"); $("s-svs").classList.add("read"); await w(1000);

      step("ids", "active"); doing("checking 3 Emirates IDs with EFR"); focus("s-efr");
      setSt("Checking all 3 IDs with EFR…", ""); moveTo(agent, $("e-exp"), 0.9, 0.5); await w(1200);
      setSt("All 3 IDs valid", "ok"); countTo(39, w); await w(600);
      step("ids", "done"); clock("09:09"); $("s-efr").classList.add("read"); await w(900);

      step("person", "active"); doing("waiting for a human checker"); focus(null);
      moveTo(agent, $("rule"), 0.86, -0.02); await w(1000);
      person.classList.remove("off"); moveTo(person, $("confirm"), 0.5, 0.5); await w(1100); clock("10:38");
      $("rule").classList.add("pressed"); await w(220); $("rule").classList.remove("pressed", "ask"); $("rule").classList.add("ok");
      $("h-amt").classList.remove("warn"); $("h-amt").classList.add("old"); $("h-rule").classList.add("on");
      step("person", "done"); await w(900); person.classList.add("off");

      step("setup", "active"); focus(null); agent.classList.add("off");
      $("setup").classList.add("on"); await w(400); $("track").style.width = "100%"; clock("10:46");
      await w(2700);
      $("setup").classList.add("read"); step("setup", "done"); clock("10:54"); await w(600);
      root.classList.add("live"); await w(400);
      root.classList.add("end"); await w(700);
      $("phone").classList.add("on");
    };

    const run = async () => {
      const g = ++gen;
      const w = (ms: number) => wait(ms, g);
      paused = false; syncPause();
      if (reduce) { reset(); final(); return; }
      try { for (;;) { reset(); await w(700); await play(w); await w(5500); } } catch { /* stopped */ }
    };
    const onPause = () => { paused = !paused; syncPause(); };
    $("pause").addEventListener("click", onPause);
    $("replay").addEventListener("click", run);
    if (reduce) { $("pause").hidden = true; $("replay").hidden = true; }
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { if (gen === 0) run(); });

    return () => {
      gen = -1;
      ro.disconnect(); io.disconnect();
      $("pause").removeEventListener("click", onPause);
      $("replay").removeEventListener("click", run);
    };
  }, [wrapRef]);
}

const Sig = ({ d }: { d: string }) => (
  <svg className="scan-img" viewBox="0 0 110 30" preserveAspectRatio="none" aria-hidden="true"><path d={d} /></svg>
);
const Arrow = ({ fill }: { fill: string }) => (
  <svg className="arrow" viewBox="0 0 15 17" aria-hidden="true"><path d="M1 1 L14 8.5 L7.5 9.5 L4.5 16 Z" fill={fill} stroke="#fff" strokeWidth="1.2" /></svg>
);

export function HeroAgentStage() {
  const wrap = useRef<HTMLDivElement>(null);
  useAgentStage(wrap);

  return (
    <section aria-label="Jointly" className="overflow-x-clip pt-28 md:pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            <p className="text-[13px] text-muted">Case study · Agentic AI for bank operations · Bisma Munawar</p>
            <h1 className="mt-3 font-display leading-[1.04] tracking-tight" style={{ fontSize: "clamp(32px, 3.9vw, 54px)", textWrap: "balance" }}>
              Digital banking access for businesses with joint signatories, set up before lunch, not in 5 days turn around.
            </h1>
          </div>
          <div className="grid gap-5">
            <p className="max-w-[44ch] text-base text-sub md:text-[17px]">
              Jointly is an agentic workflow for a bank&apos;s customer fulfilment operations team with agent as a maker and human as the checker.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/demo/case/" className={primary}>
                Open the demo <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-[13px] text-muted">Synthetic case, 5 minutes</span>
            </div>
          </div>
        </div>

        <div ref={wrap} className={`jas mt-10 grid gap-4 pb-16 md:mt-12 ${newsreader.variable} ${caveat.variable} ${GeistSans.variable}`}>
          <div className="stage" role="img" aria-label="The agent matches Khalifa across Finacle, SVS, his Emirates ID and the signed form, reads the signing rule, and a human checker confirms the AED 25,000 limit. Access is approved in 1 hour 54 minutes instead of 5 days.">
            <div className="canvas" id="cv" aria-hidden="true">
              <div className="task">
                <span className="who"><AgentMark className="mark" size={18} />Agent task</span>
                <span className="goal"><span className="todo-t">Setting up digital banking access for Creekside&apos;s 3 joint signatories</span><span className="done-t">Done. Creekside&apos;s digital banking access is approved.</span></span>
                <div className="steps">
                  <span className="step" data-step="match"><i />Match people</span>
                  <span className="step" data-step="mandate"><i />Read mandate</span>
                  <span className="step" data-step="ids"><i />Check IDs</span>
                  <span className="step person" data-step="person"><i />Human checker confirms</span>
                  <span className="step" data-step="setup"><i />Set up access</span>
                </div>
                <div className="meter"><span>Fields compared</span><b id="count">0</b></div>
                <div className="meter"><span>Time</span><b id="clock">09:00</b></div>
              </div>

              <div className="sys fin" id="s-fin">
                <div className="f-strip">Universal Banking Solution</div>
                <div className="f-user"><span>User: <b>OPSMAKER1</b></span><span>Time Zone: GST</span><span>Solution: <span className="f-sel">FINCORE ▾</span></span></div>
                <div className="f-brand"><span className="f-logo"><i />Finacle</span><span className="f-menu"><span>Menu</span><span>Show Memo Pad</span><span>Background Menu</span></span></div>
                <div className="f-band"><b>Universal Banking Solution</b><span>28 October 2026 | OPSMAKER1 | Menu Shortcut<span className="f-in sm" /></span></div>
                <div className="f-title">CIF Retail Inquiry</div>
                <div className="f-form">
                  <label>A/c. Type</label><span className="f-in">N-Normal A/c. <span>▾</span></span>
                  <label>A/c. ID</label><span className="f-in">0191-2290-01 <q /></span>
                  <label>CIF ID</label><span className="f-in">100587 <q /></span>
                  <label>Segment</label><span className="f-in">SME</span>
                  <label>Customer Name</label><span className="f-in"><span className="hl" id="h-fin">KHALIFA S ALFALASI</span></span>
                  <label>Relationship</label><span className="f-in">PARTNER <q /></span>
                  <label>Mode of Oper.</label><span className="f-in">JOINTLY</span>
                  <label>KYC Review</label><span className="f-in">11/2026</span>
                </div>
                <div className="f-btns"><span>Go</span><span>Clear</span></div>
              </div>

              <div className="sys form" id="s-form">
                <div className="bar"><i /><i /><i /><span>Signed application · page 2 of 6</span></div>
                <div className="sheet">
                  <div className="lab">Full name of signatory 2</div>
                  <div className="box"><span className="hand hl" id="h-form">Khalifa Saeed Al Falasi</span></div>
                  <div className="lab">Signature</div>
                  <div className="box sig"><svg width="120" height="26" viewBox="0 0 120 26" aria-hidden="true"><path d="M4 18 C 12 2, 18 4, 16 16 S 26 24, 32 12 C 36 6, 40 18, 46 15 C 52 12, 56 6, 62 14 C 68 22, 76 8, 84 12 C 92 16, 100 18, 116 8" /></svg></div>
                  <div className="lab">Date{"\u00a0 "}<span style={{ fontFamily: "var(--hand)", fontSize: 15, color: "var(--pen)", textTransform: "none", letterSpacing: 0 }}>26/10/2026</span></div>
                </div>
              </div>

              <div className="sys svs" id="s-svs">
                <div className="bar"><i /><i /><i /><span>SVS · Signature Verification</span><em>A/c. 0191-2290-01</em></div>
                <div className="s-main">
                  <div className="s-lab">Signatories · names typed by hand, signatures scanned</div>
                  <div className="s-sigs">
                    <div className="s-tile"><Sig d="M8 20 C 16 4, 24 6, 22 18 S 32 25, 40 13 C 45 6, 50 22, 58 18 C 66 14, 72 22, 100 9" /><b>MOHAMED A. MANSORI</b><small>Power 2 · typed by staff</small></div>
                    <div className="s-tile"><Sig d="M6 18 C 14 3, 22 6, 20 18 C 18 25, 30 22, 36 12 C 40 5, 46 21, 54 17 C 62 13, 66 7, 74 15 C 80 21, 90 16, 102 10" /><b><span className="hl" id="h-svs">KHALEFA S. ALFALASY</span></b><small>Power 2 · typed by staff</small></div>
                    <div className="s-tile"><Sig d="M8 22 C 12 10, 18 4, 24 10 C 30 16, 27 23, 36 18 C 46 13, 50 7, 60 12 C 70 17, 78 21, 102 13" /><b>RASHID H. ALKETBI</b><small>Power 2 · typed by staff</small></div>
                  </div>
                  <div className="s-lab">Operating instructions, free text</div>
                  <div className="rmk"><span className="oi a">AK</span><div><small>Dec 2019 · Operations</small><p>ANY TWO JOINTLY UPTO AED <span className="hl" id="h-amt">50,000/-</span></p></div></div>
                  <div className="rmk"><span className="oi b">RM</span><div><small>Apr 2023 · Branch</small><p><span className="hl" id="h-rule">Any 2 jointly up to 25K, all 3 above. Board res. 03/23</span></p></div></div>
                </div>
              </div>

              <div className="sys efr" id="s-efr">
                <div className="bar"><i /><i /><i /><span>EFR · Emirates ID check</span><em id="efr-n">3 IDs</em></div>
                <div className="eid" id="eid">
                  <div className="eid-top"><div><b>UNITED ARAB EMIRATES</b><small>Identity Card</small></div><div className="ar">دولة الإمارات العربية المتحدة<small>بطاقة هوية</small></div></div>
                  <div className="eid-mid">
                    <svg className="eid-ph" viewBox="0 0 50 62" aria-hidden="true"><circle cx="25" cy="24" r="10" fill="#b9c2cf" /><path d="M6 62 C 8 44, 16 38, 25 38 C 34 38, 42 44, 44 62 Z" fill="#b9c2cf" /></svg>
                    <div className="eid-f">
                      <div><small>ID Number / <span className="ar">رقم الهوية</span></small><b id="e-num">784-1981-•••••••-1</b></div>
                      <div><small>Name / <span className="ar">الاسم</span></small><b className="hl" id="h-efr">KHALIFA SAEED ALFALASI</b></div>
                      <div><small>Expiry Date / <span className="ar">تاريخ الانتهاء</span></small><b className="hl" id="e-exp">14/03/2027</b></div>
                    </div>
                  </div>
                  <span className="eid-wm">SPECIMEN</span>
                </div>
                <div className="efr-st" id="efr-st">Not checked yet</div>
              </div>

              <svg className="links" id="links" viewBox="0 0 1000 560" />
              <span className="badge" id="b-same">Same person, 4 spellings · RCIF 100587</span>

              <div className="out" id="out">
                <h4>What the agent worked out</h4>
                <div>
                  <div className="sec">Partners</div>
                  <div className="ppl">
                    <div className="pr" id="p-m"><span className="av">M</span><span><span className="skel" /><span className="real">Mohammed Al Mansoori<small>RCIF 100562</small></span></span><span className="res">SVS misspelled, matched</span></div>
                    <div className="pr" id="p-k"><span className="av">K</span><span><span className="skel" /><span className="real">Khalifa Al Falasi<small>RCIF 100587</small></span></span><span className="res">4 spellings matched</span></div>
                    <div className="pr" id="p-r"><span className="av">R</span><span><span className="skel" /><span className="real">Rashid Al Ketbi<small>RCIF 100611</small></span></span><span className="res" id="r-res">3 sources agree</span></div>
                  </div>
                </div>
                <div>
                  <div className="sec">Signing rule, from free text</div>
                  <div className="rule" id="rule">
                    <svg className="map" viewBox="0 0 92 56" aria-hidden="true">
                      <path className="arc" d="M16 34 C 26 6, 50 6, 60 34" />
                      <path className="r-dash" d="M60 34 L 80 34" />
                      <circle cx="16" cy="38" r="10" /><text x="16" y="41" textAnchor="middle">M</text>
                      <circle cx="46" cy="38" r="10" /><text x="46" y="41" textAnchor="middle">K</text>
                      <circle cx="78" cy="38" r="10" /><text x="78" y="41" textAnchor="middle">R</text>
                    </svg>
                    <div className="txt">Any 2 of 3 sign together, up to AED <span className="amt">25,000</span>. All 3 sign above that.
                      <small className="askline">Two officers typed different limits in SVS, 50,000 in 2019 and 25,000 in 2023, so a human checker confirms.</small>
                      <small className="okline">A human checker in the operations team confirmed it at 10:38.</small>
                      <span className="confirm" id="confirm">Confirm 25,000</span>
                    </div>
                  </div>
                </div>
                <div className="setup" id="setup">
                  <div className="sec" style={{ margin: 0 }}>Access</div>
                  <div>Setting up all 3 partners in Digital Banking Admin</div>
                  <div className="track"><b id="track" /></div>
                  <div className="rb">Read back every change: 0 differences</div>
                </div>
              </div>

              <div className="cursor off" id="cur-agent"><Arrow fill="var(--emerald-bright)" /><span className="tag"><AgentMark className="mark" size={12} />Agent<span className="doing" id="doing" /></span></div>
              <div className="cursor person off" id="cur-person"><Arrow fill="var(--person)" /><span className="tag"><svg className="mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg>Human checker</span></div>

              <div className="phone" id="phone">
                <div className="ph-tick"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12.5l4 4 8-9" /></svg></div>
                <div className="ph-hello">Hello, Khalifa</div>
                <div className="ph-msg">Your digital banking access has been approved.</div>
                <div className="ph-card">Creekside General Trading LLC<small>Current account</small></div>
                <div className="ph-partners"><span className="av">M</span><span className="av">K</span><span className="av">R</span>All 3 partners</div>
              </div>
              <div className="end-l">
                <span className="end-eyebrow">Creekside General Trading LLC</span>
                <div className="end-big">Digital banking access approved.</div>
                <p>Mohammed, Khalifa and Rashid can bank digitally today.</p>
                <i className="gold" />
              </div>
              <div className="end-r">
                <span className="end-eyebrow">From forms to digital banking access</span>
                <div className="end-big">1h 54m</div>
                <p><s>Usually 5 days.</s> The agent ran 39 checks, and a human checker made 1 decision.</p>
                <i className="gold" />
              </div>
            </div>
          </div>
          <div className="controls"><button type="button" className="ctl" id="pause">Pause</button><button type="button" className="ctl" id="replay">Replay</button></div>
        </div>
      </div>
    </section>
  );
}
