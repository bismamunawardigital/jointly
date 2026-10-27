"use client";

import { useEffect, useRef } from "react";
import "./hero-stage.css";
import { AgentMark } from "@/components/ui";

const CHECK = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;
const CLOCK = <svg className="ic-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
const BADGE = <span className="badge"><span className="ic-check">{CHECK}</span>{CLOCK}</span>;
const PERSON = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4" /><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /></svg>;
const TODAY_LOG: [string, string][] = [["Day 1", "Forms received, please set up"], ["Day 2", "Re: which limit is right, 10k or 25k?"], ["Day 3", "Re: Re: returned for correction"], ["Day 4", "Re: Re: Re: approved, print PINs"]];
const AGENT_LOG: [string, string, string?][] = [["09:12", "Read Finacle records for 3 people"], ["09:14", "Read the Memorandum of Association"], ["09:20", "Mandate letter is blurry, asking a person", "warn"], ["09:21", "Checked 3 Emirates IDs"], ["10:38", "Value confirmed, setting up access"], ["10:46", "Read back: 0 differences"]];
const STATUS: Record<string, string> = { manual: "Waiting on people", agent: "Agent working", warn: "Needs a person", ok: "Live" };
const PAUSE = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
const PLAY = '<path d="M7 4v16l13-8z"/>';

export function HeroStage() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const r = root.current;
    if (!r) return;
    const $ = (id: string) => r.querySelector("#jh-" + id) as HTMLElement;
    const docs = ["d0", "d1", "d2", "d3"], wires = ["w0", "w1", "w2", "w3"];
    const S = (id: string, s: string) => { $(id).dataset.s = s; };
    let token = 0, paused = false;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sleep = (ms: number, t: number) => new Promise<void>((res, rej) => {
      let left = ms;
      const tick = () => {
        if (t !== token) return rej("cancel");
        if (paused) { setTimeout(tick, 100); return; }
        left -= 100; if (left <= 0) res(); else setTimeout(tick, 100);
      };
      setTimeout(tick, Math.min(100, ms));
    });
    const clockTo = (text: string) => { $("clock").textContent = text; };
    const tweenClock = (fromM: number, toM: number, ms: number, t: number) => new Promise<void>((res) => {
      const s = performance.now();
      const f = (now: number) => {
        if (t !== token) return res();
        const p = Math.min(1, (now - s) / ms); const m = Math.round(fromM + (toM - fromM) * p);
        clockTo(Math.floor(m / 60) + "h " + String(m % 60).padStart(2, "0") + "m"); if (p < 1) requestAnimationFrame(f); else res();
      };
      requestAnimationFrame(f);
    });
    const status = (k: string) => { const p = $("spill"); p.dataset.s = k; $("stext").textContent = STATUS[k]; };
    const logReset = (title: string) => { $("lt").textContent = title; $("lines").replaceChildren(); };
    const logAdd = ([time, text, cls]: [string, string, string?], tone = "") => {
      const el = document.createElement("div"); el.className = "e " + (cls ?? tone);
      const tm = document.createElement("time"); tm.textContent = time;
      const sp = document.createElement("span"); sp.textContent = text; el.append(tm, sp);
      const box = $("lines"); box.append(el); while (box.children.length > 3) box.firstElementChild?.remove();
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("on")));
    };
    const setTab = (j: boolean) => { $("tToday").setAttribute("aria-pressed", String(!j)); $("tJointly").setAttribute("aria-pressed", String(j)); };
    const resetAll = () => {
      docs.forEach((d) => S(d, "")); ["w0", "w1", "w2", "w3", "wLoop", "wDown", "wOut"].forEach((w) => S(w, ""));
      ["p1", "p2", "approve"].forEach((n) => S(n, "")); S("phone", ""); $("pill").textContent = "Not set up";
      $("status").textContent = ""; $("was").classList.remove("on"); $("bubble").classList.remove("on"); $("phone").classList.remove("home-on");
    };
    const todayLayout = () => {
      $("agent").classList.remove("on"); $("approve").classList.remove("on");
      ["p1", "p2"].forEach((n) => { $(n).style.opacity = "1"; $(n).style.transform = "none"; }); $("wLoop").style.opacity = "1"; $("wDown").style.opacity = "1";
    };
    async function today(t: number) {
      setTab(false); resetAll(); todayLayout(); clockTo("Day 1"); status("manual"); logReset("Email thread");
      S("p1", "manual"); logAdd(TODAY_LOG[0], "manual"); await sleep(700, t);
      for (let i = 0; i < 4; i++) { S(docs[i], "manual"); S(wires[i], "manual"); if (i === 2) { clockTo("Day 2"); logAdd(TODAY_LOG[1], "manual"); } await sleep(750, t); }
      S("p2", "manual"); S("wDown", "manual"); S("wLoop", "manual");
      for (let n = 1; n <= 4; n++) { $("status").textContent = "Sent back and forth, round " + n + " of 4"; if (n === 1) logAdd(TODAY_LOG[2], "manual"); if (n === 4) logAdd(TODAY_LOG[3], "manual"); if (n === 2) clockTo("Day 3"); if (n === 4) clockTo("Day 4"); await sleep(700, t); }
      S("wOut", "manual"); S("phone", "manual"); $("pill").textContent = "Still waiting"; $("status").textContent = "The customer is still waiting"; clockTo("Day 5");
      await sleep(2400, t);
    }
    async function jointly(t: number) {
      setTab(true); resetAll(); status("agent"); logReset("Agent activity");
      $("wLoop").style.opacity = "0"; $("wDown").style.opacity = "0";
      $("p2").style.transform = "translateY(-19.7cqw)"; $("p2").style.opacity = ".7";
      $("status").textContent = "Both jobs move to the AI agent";
      await sleep(700, t);
      $("p1").style.opacity = "0"; $("p2").style.opacity = "0"; $("p1").style.transform = "scale(.9)";
      $("agent").classList.add("on"); clockTo("0h 00m"); $("was").classList.add("on");
      await sleep(1200, t);
      $("approve").classList.add("on"); $("wDown").style.opacity = "1"; $("status").textContent = "";
      await sleep(500, t);
      const mins = [0, 9, 18, 27, 31];
      for (let i = 0; i < 4; i++) {
        if (i === 2) { S(docs[i], "warn"); S(wires[i], "warn"); } else { S(docs[i], "ok"); S(wires[i], "ok"); }
        logAdd(AGENT_LOG[i]);
        await tweenClock(mins[i], mins[i + 1], 420, t); await sleep(120, t);
      }
      S("wDown", "warn"); S("approve", "warn"); $("bubble").classList.add("on"); $("status").textContent = "The agent asks instead of guessing"; status("warn");
      await tweenClock(31, 53, 900, t); await sleep(500, t);
      $("bubble").classList.remove("on"); S("approve", "ok"); S("d2", "ok"); S("w2", "done"); S("wDown", "done");
      ["w0", "w1", "w3"].forEach((w) => S(w, "done")); $("status").textContent = "Approved once"; status("agent"); logAdd(AGENT_LOG[4]);
      await tweenClock(53, 98, 700, t);
      S("wOut", "ok"); logAdd(AGENT_LOG[5]); await tweenClock(98, 114, 500, t);
      S("wOut", "done"); S("phone", "ok"); $("pill").textContent = "Ready"; $("status").textContent = ""; status("ok");
      await sleep(1200, t);
      $("phone").classList.add("home-on");
      await sleep(2800, t);
    }
    const finalState = () => {
      setTab(true); resetAll(); $("p1").style.opacity = "0"; $("p2").style.opacity = "0"; $("wLoop").style.opacity = "0";
      $("agent").classList.add("on"); $("approve").classList.add("on"); docs.forEach((d) => S(d, "ok")); ["w0", "w1", "w2", "w3", "wDown", "wOut"].forEach((w) => S(w, "done"));
      S("approve", "ok"); S("phone", "ok"); $("pill").textContent = "Ready"; clockTo("1h 54m"); $("was").classList.add("on");
      $("phone").classList.add("home-on"); status("ok"); logReset("Agent activity");
    };
    const todayFinal = () => {
      setTab(false); resetAll(); todayLayout(); docs.forEach((d) => S(d, "manual")); wires.forEach((w) => S(w, "manual"));
      ["p1", "p2"].forEach((n) => S(n, "manual")); S("wLoop", "manual"); S("wDown", "manual"); S("wOut", "manual"); S("phone", "manual"); $("pill").textContent = "Still waiting"; clockTo("Day 5");
      status("manual"); logReset("Email thread");
    };
    async function run(startJointly: boolean) {
      const t = ++token;
      try { if (!startJointly) await today(t); while (true) { await jointly(t); await today(t); } } catch {}
    }
    const pp = $("pp"), ppi = $("ppi");
    ppi.innerHTML = PAUSE;
    const onToday = () => { if (reduce) { token++; todayFinal(); return; } run(false); };
    const onJointly = () => { if (reduce) { token++; finalState(); return; } run(true); };
    const onPP = () => {
      paused = !paused; pp.setAttribute("aria-label", paused ? "Play" : "Pause");
      ppi.innerHTML = paused ? PLAY : PAUSE;
      r.querySelectorAll<SVGPathElement>(".w").forEach((w) => { w.style.animationPlayState = paused ? "paused" : "running"; });
    };
    $("tToday").addEventListener("click", onToday); $("tJointly").addEventListener("click", onJointly); pp.addEventListener("click", onPP);
    if (reduce) finalState(); else run(false);
    return () => {
      token++;
      $("tToday").removeEventListener("click", onToday); $("tJointly").removeEventListener("click", onJointly); pp.removeEventListener("click", onPP);
    };
  }, []);

  return (
    <div ref={root} className="jh">
      <div className="bar">
        <button type="button" className="tab" id="jh-tToday" aria-pressed="true">Today</button>
        <button type="button" className="tab" id="jh-tJointly" aria-pressed="false">With Jointly</button>
        <button type="button" className="pp" id="jh-pp" aria-label="Pause"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" id="jh-ppi" /></button>
      </div>
      <div className="scroller">
        <div className="win">
        <div className="titlebar">
          <span className="dots" aria-hidden="true"><i /><i /><i /></span>
          <span><b>Jointly</b> · Creekside General Trading LLC</span>
          <span className="spill" id="jh-spill" data-s="manual" role="status"><span className="sd" /><span id="jh-stext">Waiting on people</span></span>
        </div>
        <div className="stage" role="img" aria-label="Animation: today, two people read old bank systems and scanned documents by hand and pass the case back and forth for 5 days. With Jointly, an AI agent does both jobs, asks a person about one unclear value, and the customer gets online banking in 1 hour 54 minutes.">
          <svg className="wires" viewBox="0 0 1000 560" aria-hidden="true">
            <path className="w" id="jh-w0" d="M262 100 C 330 100, 330 272, 386 272" />
            <path className="w" id="jh-w1" d="M256 236 C 320 236, 330 272, 386 272" />
            <path className="w" id="jh-w2" d="M262 366 C 320 366, 330 272, 386 272" />
            <path className="w" id="jh-w3" d="M242 484 C 330 484, 330 272, 386 272" />
            <path className="w" id="jh-wLoop" d="M612 382 C 668 372, 668 286, 612 276" />
            <path className="w" id="jh-wDown" d="M500 304 L 500 354" />
            <path className="w" id="jh-wOut" d="M592 386 C 690 386, 700 300, 786 300" />
          </svg>
          <div className="abs doc term" id="jh-d0" style={{ left: "4%", top: "8.6%", width: "22%", height: "18.6%" }}>
            <div className="tb"><span className="dot" /><span className="dot" />FINACLE · CIF INQUIRY</div>
            CIF&nbsp;&nbsp;100587<br />NAME KHALIFA S ALFALASI<br />MODE JOINTLY ANY TWO<span className="cur" />
            {BADGE}
          </div>
          <div className="abs doc paper" id="jh-d1" style={{ left: "5.2%", top: "30.7%", width: "20%", height: "22.9%", transform: "rotate(-2deg)" }}>
            <div className="sub">Scanned · page 4 of 18</div>
            <div className="t">Memorandum of Association</div>
            <div className="ln" style={{ width: "92%" }} /><div className="ln" style={{ width: "78%" }} /><div className="ln" style={{ width: "85%" }} /><div className="ln" style={{ width: "60%" }} />
            <div className="stamp">REG.</div>
            {BADGE}
          </div>
          <div className="abs doc paper" id="jh-d2" style={{ left: "4%", top: "56.8%", width: "22%", height: "17.1%", transform: "rotate(1.2deg)" }}>
            <div className="sub">Scanned letter · 2023</div>
            <div className="t">Signing mandate</div>
            <div style={{ marginTop: ".5cqw" }}>Solo limit AED <span className="blur">25,0<i>00</i></span></div>
            <svg viewBox="0 0 200 30" style={{ width: "70%", height: "2.4cqw", marginTop: ".4cqw" }} aria-hidden="true"><path d="M4 20c10-14 16 8 26-3s12-8 18 3M64 22c8-12 14 6 22-4s10-4 14 4M118 21c9-13 13 7 21-2" fill="none" stroke="#3550E8" strokeWidth="2" opacity=".7" /></svg>
            {BADGE}
          </div>
          <div className="abs doc idcard" id="jh-d3" style={{ left: "6.4%", top: "77.1%", width: "17.6%", height: "18.6%" }}>
            <div className="ph" />
            <div className="ln" style={{ background: "#C2CCD6", width: "60%", marginTop: ".4cqw" }} /><div className="ln" style={{ background: "#C2CCD6", width: "45%" }} /><div className="ln" style={{ background: "#C2CCD6", width: "52%" }} />
            <div style={{ clear: "both", marginTop: ".3cqw" }}>Emirates ID</div>
            <div className="spec">SPECIMEN</div>
            {BADGE}
          </div>
          <div className="abs node" id="jh-p1" style={{ left: "39%", top: "43.2%", width: "22%", height: "10.7%" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4" /><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /></svg>Person sets it up
          </div>
          <div className="abs node" id="jh-p2" style={{ left: "39%", top: "62.9%", width: "22%", height: "10.7%" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4" /><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><path d="m16 11 2 2 4-4" /></svg>Person checks it
          </div>
          <div className="abs node" id="jh-agent" style={{ left: "37.6%", top: "42.1%", width: "24.8%", height: "12.9%" }}>
            <span className="ring" />
            <AgentMark />AI agent
          </div>
          <div className="abs bubble" id="jh-bubble" style={{ left: "58%", top: "31%", width: "21%" }}>Can you check one value on this letter?</div>
          <div className="abs node" id="jh-approve" style={{ left: "41%", top: "63.6%", width: "18%", height: "9.3%", fontSize: "1.4cqw" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4" /><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><path d="m16 11 2 2 4-4" /></svg>Person approves
          </div>
          <div className="abs" style={{ left: "32%", top: "78%", width: "36%" }}>
            <div className="status" id="jh-status" />
            <div className="clock" id="jh-clock">Day 1</div>
            <div className="was" id="jh-was">usually 5 days</div>
          </div>
          <div className="abs phone" id="jh-phone" style={{ left: "78.6%", top: "5%", width: "17%", height: "66%" }}>
            <span className="notch" />
            <div className="notif">Jointly Bank · now<b>Your online banking is ready</b></div>
            <div className="co">Creekside General Trading</div>
            <div className="row">Online banking <span className="pill" id="jh-pill">Not set up</span></div>
            <div className="big">{CHECK}</div>
            <div className="home">
              <div className="card"><b>Creekside General Trading LLC</b>Current account</div>
              <div className="btn">Approve a payment</div>
            </div>
            <div className="ppl">
              <div className="icons">
                <span className="pi on">{PERSON}<span className="wid" /></span>
                <span className="pi on">{PERSON}<span className="wid" /></span>
                <span className="pi">{PERSON}<span className="wid">Waiting for ID</span></span>
              </div>
              <span className="lab">Creekside&apos;s signing partners</span>
            </div>
          </div>
          <div className="abs log" style={{ left: "70%", top: "76%", width: "28%" }}>
            <div className="h" id="jh-lt">Email thread</div>
            <div id="jh-lines" />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
