import OpenAI from 'openai'
import type { ProblemAnalysis } from '@/types'

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

// ─── Analyze Problem ──────────────────────────────────────────────────────────

export async function analyzeProblem(problem: string): Promise<ProblemAnalysis> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a product strategist and UX expert. When given a user's problem description, analyze it and respond with a JSON object in this exact shape:
{
  "painPoint": "<one concise sentence identifying the core pain point>",
  "solution": "<2-3 sentences describing a specific, actionable digital product solution>",
  "userFlow": ["<step 1>", "<step 2>", "<step 3>", "<step 4>", "<step 5>"]
}

Rules:
- painPoint: max 15 words, laser-focused on the root frustration
- solution: describe a specific app/tool, not a vague concept
- userFlow: exactly 4-6 steps, action-oriented verbs, each step max 8 words
- Be specific and concrete, not generic
- Respond ONLY with the JSON object, no extra text`,
      },
      {
        role: 'user',
        content: problem,
      },
    ],
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) throw new Error('No response from AI. Please try again.')

  let parsed: { painPoint: string; solution: string; userFlow: string[] }
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('AI returned malformed data. Please try again.')
  }

  if (!parsed.painPoint || !parsed.solution || !Array.isArray(parsed.userFlow)) {
    throw new Error('AI response was incomplete. Please try again.')
  }

  return {
    rawProblem: problem,
    painPoint: parsed.painPoint,
    solution: parsed.solution,
    userFlow: parsed.userFlow,
  }
}

// ─── Generate Prototype ───────────────────────────────────────────────────────

export async function generatePrototype(analysis: ProblemAnalysis): Promise<string> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a world-class product designer and frontend engineer. Generate a polished, pixel-perfect interactive app prototype as a single vanilla JS function called "runApp(container)".

═══ HARD TECHNICAL RULES (violations crash the app) ═══
1. Output ONLY the raw JS function body — zero markdown, zero backtick fences, zero prose
2. Function name must be exactly: runApp  — takes one arg: the container DOM element
3. Zero import/export/require — pure vanilla JS
4. All styling via inline style strings — no class names, no external CSS
5. Attach events with getElementById().addEventListener() AFTER setting innerHTML
6. Use a single state object + re-render pattern

═══ DESIGN QUALITY RULES (non-negotiable) ═══
A. VISUAL DESIGN — must look like a real, shipped product:
   - Use a coherent color palette: pick one primary color (#hex) + neutrals (#f8fafc, #1e293b, #64748b, #e2e8f0)
   - Typography hierarchy: 28px bold headings, 16px body, 13px captions — all font-family:'Inter',system-ui,sans-serif
   - Cards: background:#fff, border-radius:16px, padding:24px, box-shadow:0 1px 3px rgba(0,0,0,0.08),0 8px 24px rgba(0,0,0,0.05)
   - Buttons: border-radius:12px, padding:14px 28px, font-weight:600, cursor:pointer, no border (for primary), transition-ready
   - Inputs: border:1.5px solid #e2e8f0, border-radius:10px, padding:12px 16px, font-size:15px, outline:none
   - Full-width layout: max-width:480px, margin:0 auto, background:#f8fafc, min-height:100vh, padding:0 0 40px 0
   - Use emoji icons where relevant (💧🅿️💰📅✅) — they add polish without external assets

B. LOGICAL INTERACTION FLOW — screens must tell a coherent user story:
   - Screen 1: Onboarding/Home — clear value prop + primary CTA button
   - Screen 2: Core action — the main thing the app does (form, list, map, timer, etc.)
   - Screen 3: Result/Confirmation — meaningful outcome, completion state, or detail view
   - Screen 4 (optional): Settings or history
   - Every button must advance the story logically — no dead ends, no orphan screens
   - Forms must capture input and display it back on the result screen (use state.formData)
   - Show loading states where realistic (setTimeout 1200ms then re-render to next screen)

C. REALISTIC CONTENT — no Lorem Ipsum, no "Click here":
   - Use domain-specific copy, real-looking names, plausible numbers and dates
   - CTAs must be specific: "Set My Reminder", "Find Parking Now", "Split the Bill" — not "Submit" or "Next"
   - Empty states should have encouragement text and a clear action

═══ REFERENCE IMPLEMENTATION (adapt the pattern, not the content) ═══
function runApp(container) {
  var PRIMARY = '#6366f1';
  var state = { screen: 'home', name: '', goal: 0, log: [] };

  function btn(id, label, bg, color, fullWidth) {
    return '<button id="' + id + '" style="background:' + bg + ';color:' + color + ';border:none;border-radius:12px;padding:14px ' + (fullWidth ? '0' : '28px') + ';font-size:15px;font-weight:600;cursor:pointer;' + (fullWidth ? 'width:100%;' : '') + 'font-family:Inter,system-ui,sans-serif">' + label + '</button>';
  }

  function card(content) {
    return '<div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.08),0 8px 24px rgba(0,0,0,0.05);margin-bottom:16px">' + content + '</div>';
  }

  function wrap(content) {
    return '<div style="font-family:Inter,system-ui,sans-serif;background:#f8fafc;min-height:100vh;padding:0 20px 40px;max-width:480px;margin:0 auto">' + content + '</div>';
  }

  function render() {
    if (state.screen === 'home') {
      container.innerHTML = wrap(
        '<div style="padding-top:48px;text-align:center;margin-bottom:32px">' +
          '<div style="font-size:48px;margin-bottom:12px">💧</div>' +
          '<h1 style="font-size:28px;font-weight:700;color:#1e293b;margin:0 0 8px">HydroTrack</h1>' +
          '<p style="color:#64748b;font-size:16px;margin:0">Never forget to drink water again</p>' +
        '</div>' +
        card('<label style="display:block;font-size:13px;font-weight:600;color:#64748b;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">Your Name</label>' +
          '<input id="inp-name" placeholder="e.g. Alex" style="border:1.5px solid #e2e8f0;border-radius:10px;padding:12px 16px;font-size:15px;width:100%;margin-bottom:16px;box-sizing:border-box;outline:none" value="' + (state.name||'') + '" />' +
          btn('btn-start', '🚀 Start Tracking', PRIMARY, '#fff', true)
        )
      );
      document.getElementById('inp-name').addEventListener('input', function(e) { state.name = e.target.value; });
      document.getElementById('btn-start').addEventListener('click', function() { state.screen = 'tracker'; render(); });
    } else if (state.screen === 'tracker') {
      var pct = Math.min(100, Math.round((state.log.length * 250 / 2000) * 100));
      container.innerHTML = wrap(
        '<div style="display:flex;align-items:center;padding:20px 0 8px">' +
          '<button id="btn-back" style="background:none;border:none;font-size:22px;cursor:pointer;padding:4px 8px 4px 0">←</button>' +
          '<span style="font-size:17px;font-weight:600;color:#1e293b">Hi, ' + (state.name||'there') + '! 👋</span>' +
        '</div>' +
        card('<p style="font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px">Daily Progress</p>' +
          '<div style="background:#e2e8f0;border-radius:99px;height:10px;overflow:hidden;margin-bottom:8px"><div style="background:' + PRIMARY + ';height:100%;width:' + pct + '%;border-radius:99px;transition:width .4s"></div></div>' +
          '<p style="color:#1e293b;font-size:22px;font-weight:700;margin:0">' + (state.log.length*250) + ' <span style="font-size:14px;font-weight:400;color:#64748b">/ 2000 ml</span></p>'
        ) +
        btn('btn-log', '+ Log 250ml', PRIMARY, '#fff', true) +
        '<div style="height:16px"></div>' +
        (state.log.length > 0 ? card('<p style="font-size:13px;font-weight:600;color:#64748b;margin:0 0 12px;text-transform:uppercase;letter-spacing:.05em">Recent</p>' +
          state.log.slice(-3).reverse().map(function(t){ return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9"><span style="color:#1e293b">💧 250ml</span><span style="color:#64748b;font-size:13px">' + t + '</span></div>'; }).join('')
        ) : '')
      );
      document.getElementById('btn-back').addEventListener('click', function() { state.screen = 'home'; render(); });
      document.getElementById('btn-log').addEventListener('click', function() {
        var now = new Date(); state.log.push(now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0'));
        if (state.log.length * 250 >= 2000) { state.screen = 'done'; render(); return; }
        render();
      });
    } else {
      container.innerHTML = wrap(
        '<div style="text-align:center;padding-top:80px">' +
          '<div style="font-size:64px;margin-bottom:16px">🏆</div>' +
          '<h2 style="font-size:26px;font-weight:700;color:#1e293b;margin:0 0 8px">Goal reached!</h2>' +
          '<p style="color:#64748b;margin:0 0 32px">You drank 2,000ml today. Great work, ' + (state.name||'friend') + '!</p>' +
          btn('btn-reset', 'Start a New Day', PRIMARY, '#fff', false) +
        '</div>'
      );
      document.getElementById('btn-reset').addEventListener('click', function() { state.log = []; state.screen = 'tracker'; render(); });
    }
  }
  render();
}

═══ NOW GENERATE FOR THE ACTUAL PROBLEM BELOW ═══
Follow the exact same structural pattern. Adapt all content, colors, emoji, screen names, and interactions to perfectly match the proposed solution. Make it feel like a real product someone would actually use.`,
      },
      {
        role: 'user',
        content: `Problem: ${analysis.rawProblem}

Pain Point: ${analysis.painPoint}

Proposed Solution: ${analysis.solution}

User Flow:
${analysis.userFlow.map((step, i) => `${i + 1}. ${step}`).join('\n')}

Generate a complete interactive prototype for this product. Follow all design quality rules. Make it feel like a real, polished app.`,
      },
    ],
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) throw new Error('No prototype generated. Please try again.')

  // Strip markdown code fences if the AI included them despite instructions
  return raw
    .replace(/^```(?:jsx?|tsx?|javascript|typescript)?\n?/i, '')
    .replace(/\n?```$/i, '')
    .trim()
}
