# Jointly

Joint signatories live in hours.

A portfolio demo by Bisma Munawar. Jointly is an agentic operations workbench that helps a bank's Customer Fulfillment team onboard joint-signatory businesses to digital banking on top of Finacle and SVS, while keeping maker-checker controls.

All data is synthetic. There are no real bank systems, no LLM calls and no passwords anywhere. The agent is scripted. The rules engine and release eligibility are real pure functions in `src/lib/rules.ts`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # rules engine tests
npm run lint && npm run typecheck
npm run build    # static export to out/
```

## Map

- `/` case study
- `/demo/` command center
- `/demo/case/` the Al Noor Trading case: agent run, evidence, plan, simulator, checker review, release, audit log
- `DESIGN.md` design system in the Google design.md format
