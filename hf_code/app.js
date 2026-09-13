/* =========================================================================
   app.js — stage flow and rendering for the AI subscription comparison.
   All state lives in JavaScript variables for the current session only.
   Nothing is stored or transmitted.
   ========================================================================= */

const state = {
  stage: 1,
  choices: { 1: null, 2: null, 3: null },
  open: {},
  glossary: false,
  how: false,
  why: false,
  view: 'overall'
};

const stageEl = document.getElementById('stage');
const progressEl = document.getElementById('progress');

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
}[c]));

const round2 = n => (Math.round(n * 100) / 100).toFixed(2);
const planName = key => (key ? PLANS[key].name : '—');

function scoreRows(view = state.view) {
  return ORDER.map(k => {
    const p = PLANS[k];
    return {
      key: k,
      name: p.name,
      price: p.priceLabel,
      score: p.scores[view],
      scores: p.scores,
      structure: p.structure,
      capability: p.capability
    };
  });
}

/* ---------- shared fragments ---------- */
function choiceBlock(stage, question, nextLabel, withBack) {
  const sel = state.choices[stage];
  const opts = ORDER.map(k => {
    const p = PLANS[k];
    return `<button type="button" class="choice" role="radio" aria-checked="${sel === k}"
      data-choose="${k}" data-stage="${stage}">
      <span class="n">${esc(p.name)}</span>
      <span class="p">${esc(p.priceLabel)}</span>
    </button>`;
  }).join('');

  return `<section class="card pad">
    <h3>${esc(question)}</h3>
    <div class="choices" role="radiogroup" aria-label="Stage ${stage} choice">${opts}</div>
    <div class="actions">
      ${withBack ? '<button type="button" class="btn" data-nav="back">Back</button>' : ''}
      <button type="button" class="btn primary" data-nav="next" ${sel ? '' : 'disabled'}>${esc(nextLabel)}</button>
      ${sel ? '' : '<span class="hint">Select one plan to continue.</span>'}
    </div>
  </section>`;
}

function progress() {
  const steps = [
    ['Stage 1 of 3', 'Provider Information'],
    ['Stage 2 of 3', 'Detailed Explanation'],
    ['Stage 3 of 3', 'Benchmark Comparison']
  ];

  progressEl.innerHTML = steps.map((s, i) => {
    const n = i + 1;
    const cls = state.stage === n ? 'step current' : (state.stage > n ? 'step done' : 'step');
    return `<div class="${cls}"${state.stage === n ? ' aria-current="step"' : ''}>
      <span class="meta">${s[0]}</span><span class="label">${s[1]}</span>
    </div>`;
  }).join('');
}

/* ---------- Stage 1 ---------- */
function renderStage1() {
  const cards = ORDER.map(k => {
    const p = PLANS[k];
    return `<article class="card">
      <div class="plan-head">
        <h3>${esc(p.name)}</h3>
        <div class="price">${esc(p.priceLabel)}</div>
      </div>
      <ul class="feature-list">${STAGE1[k].map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      <div class="source">
        <div>${esc(p.source)}</div>
        <div>Accessed ${ACCESSED}</div>
      </div>
    </article>`;
  }).join('');

  return `<div class="stage">
    <div class="stage-intro">
      <h2>Stage 1 — What Providers Show You</h2>
      <p>Imagine that you are choosing a personal AI subscription. Review the information supplied by each provider and choose the plan that appears to offer the best value.</p>
      <p class="sub">Each card below repeats the provider's own wording. Terminology is not standardized, features are not explained, and usage limits are not converted.</p>
    </div>
    <div class="grid">${cards}</div>
    ${choiceBlock(1, 'Based only on the information provided by each company, which plan offers the best value for you?', 'Continue to Detailed Information', false)}
  </div>`;
}

/* ---------- Stage 2 ---------- */
function renderStage2() {
  const cards = ORDER.map(k => {
    const p = PLANS[k];

    const secs = STAGE2[k].map((sec, i) => {
      const id = k + ':' + i;
      const open = !!state.open[id];

      const body = sec.blocks.map(b => `<div class="blk">
        ${b.label ? `<div class="blk-label">${esc(b.label)}</div>` : ''}
        ${b.text ? `<p>${esc(b.text)}</p>` : ''}
        ${b.items ? `<ul>${b.items.map(it => `<li>${esc(it)}</li>`).join('')}</ul>` : ''}
      </div>`).join('');

      return `<div class="acc" open-state="${open}">
        <button type="button" class="acc-head" aria-expanded="${open}" aria-controls="b-${id}" data-acc="${id}">
          <span class="t">${esc(sec.title)}</span>
          <span class="s" aria-hidden="true">${open ? '–' : '+'}</span>
        </button>
        <div class="acc-body" id="b-${id}"${open ? '' : ' hidden'}>${body}</div>
      </div>`;
    }).join('');

    return `<article class="card s2">
      <div class="plan-head">
        <h3>${esc(p.name)}</h3>
        <div class="price">${esc(p.priceLabel)}</div>
      </div>
      <div>${secs}</div>
    </article>`;
  }).join('');

  const glossary = state.glossary ? `<div class="glossary">
    <h3>Plain-language glossary</h3>
    <dl>${GLOSSARY.map(g => `<div><dt>${esc(g.term)}</dt><dd>${esc(g.def)}</dd></div>`).join('')}</dl>
  </div>` : '';

  return `<div class="stage">
    <div class="stage-intro">
      <h2>Stage 2 — What Do These Features Actually Mean?</h2>
      <p>The same plans are shown below, but each provider's claims are now explained in more concrete terms. No standardized benchmark-quality comparison has been introduced yet.</p>
    </div>

    <div class="toolbar">
      <button type="button" class="btn small" data-bulk="expand">Expand all</button>
      <button type="button" class="btn small" data-bulk="collapse">Collapse all</button>
      <button type="button" class="btn small" data-toggle="glossary">${state.glossary ? 'Hide glossary' : 'Show glossary'}</button>
    </div>

    ${glossary}
    <div class="grid tight">${cards}</div>
    ${choiceBlock(2, 'Now that the provider information has been explained in more detail, which plan offers the best value for you?', 'Continue to Benchmark Comparison', true)}
  </div>`;
}

/* ---------- Stage 3 ---------- */
function renderStage3() {
  const viewButtons = Object.entries(VIEW_LABELS).map(([key, label]) =>
    `<button type="button"
      class="metric-tab${state.view === key ? ' active' : ''}"
      aria-pressed="${state.view === key}"
      data-view="${key}">${esc(label)}</button>`
  ).join('');

  const selectedRows = scoreRows().slice().sort((a, b) => b.score - a.score);

  const cards = selectedRows.map((r, i) => `
    <article class="card score-card">
      <div class="score-rank">#${i + 1} in ${esc(VIEW_LABELS[state.view])}</div>
      <h4>${esc(r.name)}</h4>
      <div class="score-big">${round2(r.score)}</div>
      <div class="score-label">Benchmark-normalized quality score / 100</div>
      <div class="price">${esc(r.price)}</div>
    </article>
  `).join('');

  const table = `<div class="table-scroll"><table class="score-table">
    <thead>
      <tr>
        <th scope="col">Plan</th>
        <th scope="col">Monthly price</th>
        <th scope="col">Overall</th>
        <th scope="col">Reasoning</th>
        <th scope="col">Coding</th>
        <th scope="col">Agentic</th>
      </tr>
    </thead>
    <tbody>${ORDER.map(k => {
      const p = PLANS[k];
      return `<tr>
        <th scope="row">${esc(p.name)}</th>
        <td class="num">${esc(p.priceLabel)}</td>
        <td class="num">${round2(p.scores.overall)}</td>
        <td class="num">${round2(p.scores.reasoning)}</td>
        <td class="num">${round2(p.scores.coding)}</td>
        <td class="num">${round2(p.scores.agentic)}</td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;

  const how = `<div class="acc" open-state="${state.how}">
    <button type="button" class="acc-head" aria-expanded="${state.how}" aria-controls="how-body" data-toggle="how">
      <span class="t">How the current benchmark scores are computed</span>
      <span class="s" aria-hidden="true">${state.how ? '–' : '+'}</span>
    </button>
    <div class="acc-body" id="how-body"${state.how ? '' : ' hidden'}>
      <div class="formula">
        <div>B[p,j] = average over benchmarks k in workload j of S[p,k] / max_q S[q,k]</div>
        <div>Displayed score = 100 × B[p,j]</div>
        <div>Overall = (Reasoning + Coding + Agentic) / 3</div>
      </div>
      <p class="body-copy">Each raw benchmark is normalized against the best-performing compared provider and then averaged within a workload category. The current interface reports the resulting 0–100 benchmark-quality component.</p>
      <ul class="factors">
        <li><strong>Reasoning:</strong> ${BENCHMARK_GROUPS.reasoning.map(esc).join(', ')}</li>
        <li><strong>Coding:</strong> ${BENCHMARK_GROUPS.coding.map(esc).join(', ')}</li>
        <li><strong>Agentic:</strong> ${BENCHMARK_GROUPS.agentic.map(esc).join(', ')}</li>
      </ul>
      <p class="body-copy"><strong>Important:</strong> these scores are not final subscription-level SUUs. The full research framework is SUU[p,j] = C[p,j] × B[p,j], where usage capacity C[p,j] still requires a separate empirical quota-depletion experiment.</p>
    </div>
  </div>`;

  return `<div class="stage">
    <div class="stage-intro">
      <h2>Stage 3 — A Standardized Benchmark-Quality Comparison</h2>
      <p>The same plans are now supplemented with a common 0–100 benchmark-quality representation separated by workload.</p>
      <p class="sub">Frozen computational snapshot: ${BENCHMARK_SNAPSHOT}. These are benchmark-normalized quality scores (100 × B), not final SUU measurements.</p>
    </div>

    <section class="card pad">
      <h3>Four views of benchmark quality</h3>
      <p class="body-copy">Switch between Overall, Reasoning, Coding, and Agentic views. The scores come from the same computational pipeline used in the PS1 Colab notebook.</p>

      <div class="metric-tabs" role="group" aria-label="Benchmark score view">
        ${viewButtons}
      </div>

      <div class="metric-note">
        <strong>${esc(VIEW_LABELS[state.view])}</strong> —
        ${esc(VIEW_DESCRIPTIONS[state.view])}
      </div>

      <div class="grid score-grid">${cards}</div>
      ${how}
    </section>

    <section class="card pad">
      <div>
        <h3>All four benchmark views</h3>
        <p class="eyebrow" style="margin-top:4px;text-transform:none;letter-spacing:.04em">
          Benchmark-normalized quality scores (0–100)
        </p>
      </div>
      ${table}
      <p class="callout"><strong>Not final SUU:</strong> provider-specific usage capacity has not yet been empirically measured. Final SUU and SUU-per-dollar will be introduced only after C[p,j] is measured.</p>
    </section>

    ${choiceBlock(
      3,
      'After seeing the workload-specific benchmark-quality comparison, which plan offers the best value for you?',
      'See My Results',
      true
    )}
  </div>`;
}

/* ---------- Results ---------- */
function rankingBlock(view) {
  const ranked = scoreRows(view).slice().sort((a, b) => b.score - a.score);
  return `<article class="card mini-rank">
    <div class="eyebrow">${esc(VIEW_LABELS[view])}</div>
    <ol class="rank">
      ${ranked.map(r => `<li><span class="nm">${esc(r.name)}</span> <span class="v">— ${round2(r.score)}</span></li>`).join('')}
    </ol>
  </article>`;
}

function renderResults() {
  const c = state.choices;

  const outs = [
    ['Output 1', 'Provider information — your Stage 1 choice', planName(c[1])],
    ['Output 2', 'Detailed information — your Stage 2 choice', planName(c[2])],
    ['Output 3', 'Benchmark-quality comparison — your Stage 3 choice', planName(c[3])]
  ].map(o => `<article class="card out">
    <div class="tag">${o[0]}</div>
    <div class="lbl">${esc(o[1])}</div>
    <div class="plan">${esc(o[2])}</div>
  </article>`).join('');

  const chain = [1, 2, 3].map(i =>
    `<span style="display:inline-flex;align-items:center;gap:14px">
      ${i === 1 ? '' : '<span class="arrow" aria-hidden="true">→</span>'}
      <span>${esc(planName(c[i]))}</span>
    </span>`
  ).join('');

  const same = c[1] && c[1] === c[2] && c[2] === c[3];
  const note = same
    ? 'Your preferred plan remained the same across all three information formats.'
    : 'Your preferred plan changed after the information format changed.';

  const why = `<div class="acc" open-state="${state.why}">
    <button type="button" class="acc-head" aria-expanded="${state.why}" aria-controls="why-body" data-toggle="why" style="padding:14px 16px;font-size:15px">
      <span class="t" style="font-size:15px">Why three stages?</span>
      <span class="s" aria-hidden="true">${state.why ? '–' : '+'}</span>
    </button>
    <div class="acc-body" id="why-body"${state.why ? '' : ' hidden'} style="font-size:14.5px;line-height:1.65;color:var(--ink2)">
      <p><strong>Stage 1</strong> tests decisions under current provider-specific presentation.</p>
      <p><strong>Stage 2</strong> tests whether simply explaining the existing information in more detail changes consumer choice.</p>
      <p><strong>Stage 3</strong> tests whether adding a common workload-specific benchmark representation changes comparison beyond the effect of additional information alone.</p>
      <p style="padding-top:10px;border-top:1px dashed var(--line)">This prototype demonstrates the information design. It does not yet establish a causal behavioral effect or a final capacity-adjusted SUU.</p>
    </div>
  </div>`;

  return `<div class="stage">
    <h2 style="font-size:clamp(24px,3vw,32px)">Your Comparison Results</h2>

    <div class="grid">${outs}</div>

    <section class="card pad">
      <div class="chain">${chain}</div>
      <p style="font-size:15px;line-height:1.6;color:var(--ink2)">${note}</p>
    </section>

    <section class="card pad">
      <h3>Benchmark-quality rankings by view</h3>
      <p class="body-copy">These rankings summarize the frozen 0–100 benchmark-quality scores only. They are not purchasing recommendations and are not final SUU rankings.</p>
      <div class="grid four-ranks">
        ${rankingBlock('overall')}
        ${rankingBlock('reasoning')}
        ${rankingBlock('coding')}
        ${rankingBlock('agentic')}
      </div>
    </section>

    <div class="note-block">
      <div class="eyebrow" style="margin-bottom:8px">Planned behavioral test</div>
      <p>The research hypothesis is that workload-specific standardized information may reduce comparison complexity, while a competing possibility is that numeric scores create anchoring. A controlled user study is required to distinguish these explanations.</p>
    </div>

    ${why}

    <div class="actions">
      <button type="button" class="btn" data-nav="back">Back</button>
      <button type="button" class="btn" data-nav="restart">Start over</button>
    </div>
  </div>`;
}

/* ---------- render + events ---------- */
function render() {
  progress();
  const views = { 1: renderStage1, 2: renderStage2, 3: renderStage3, 4: renderResults };
  stageEl.innerHTML = views[state.stage]();
}

function go(n) {
  state.stage = Math.min(4, Math.max(1, n));
  render();
  window.scrollTo(0, 0);
}

stageEl.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.dataset.choose) {
    state.choices[Number(btn.dataset.stage)] = btn.dataset.choose;
    render();
    return;
  }

  if (btn.dataset.view) {
    state.view = btn.dataset.view;
    render();
    return;
  }

  if (btn.dataset.nav === 'next') {
    go(state.stage + 1);
    return;
  }

  if (btn.dataset.nav === 'back') {
    go(state.stage - 1);
    return;
  }

  if (btn.dataset.nav === 'restart') {
    state.choices = { 1: null, 2: null, 3: null };
    state.open = {};
    state.view = 'overall';
    state.glossary = false;
    state.how = false;
    state.why = false;
    go(1);
    return;
  }

  if (btn.dataset.acc) {
    const id = btn.dataset.acc;
    state.open[id] = !state.open[id];
    render();
    return;
  }

  if (btn.dataset.bulk) {
    const on = btn.dataset.bulk === 'expand';
    state.open = {};
    ORDER.forEach(k => STAGE2[k].forEach((_, i) => {
      state.open[k + ':' + i] = on;
    }));
    render();
    return;
  }

  if (btn.dataset.toggle) {
    const key = btn.dataset.toggle;
    state[key] = !state[key];
    render();
  }
});

render();
