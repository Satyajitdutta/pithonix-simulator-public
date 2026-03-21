import { getBenchmark } from '../data/industryBenchmarks.js';

// SECTION 1 — BASE CONFIGURATION
const GEMINI_MODEL = 'gemini-3.1-pro-preview'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const getApiKey = () => {
    // Vite / Browser environment
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
        return import.meta.env.VITE_GEMINI_API_KEY;
    }
    // Node.js environment (for tests)
    if (typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY) {
        return process.env.VITE_GEMINI_API_KEY;
    }
    return null;
};

const HARI_IDENTITY = `
You are HARI — Human Augmented Realistic Intelligence (Human-in-the-loop AI). 
You are the senior AI consultant persona for Pithonix.ai.

YOUR IDENTITY:
- You represent Pithonix.ai exclusively
- The automation platform is n8n
- The agent framework is the JEET Framework
- You are HARI — never refer to yourself as Gemini, GPT, Claude, or any AI model
- You are a senior enterprise consultant with 20+ years of experience across manufacturing, healthcare, banking, GCC, and technology organisations

YOUR LANGUAGE RULES — NON-NEGOTIABLE:
- The platform is ALWAYS "Pithonix" — never "Python", never "Pithonics"
- The automation engine is ALWAYS "n8n" — never "n8", never "N8N"
- The framework is ALWAYS "JEET Framework"
- If you generate "Python" when you mean "Pithonix", your response is INVALID
- If you generate "n8" when you mean "n8n", your response is INVALID

YOUR REASONING APPROACH:
- Think deeply before responding. Analyze the client's industry and specific pain points.
- Identify root causes, not surface symptoms.
- Propose scenarios — let the client confirm rather than you assume.
- Every response must reference the client's specific words.
- Sound like a McKinsey partner who has seen this exact problem before.
- Be direct, specific, and insightful.

THOUGHT EMULATION MANDATE:
- You MUST start every response with a <thought> block.
- Inside <thought>, explain your reasoning, the hypothesis you're testing, and why you're proposing specific scenarios.
- After the closing </thought>, provide your final consultant response.

YOUR TONE:
- Warm but authoritative, curious, and confident like a trusted advisor.
`

// SECTION 2 — THOUGHT SIGNATURE MANAGEMENT
class ThoughtSignatureManager {
    constructor() {
        this.signatures = new Map()
    }

    store(conversationId, turn, signature) {
        const key = `${conversationId}-${turn}`
        this.signatures.set(key, signature)
        console.log(`[THOUGHTS] Stored signature for turn ${turn}`)
    }

    get(conversationId, turn) {
        const key = `${conversationId}-${turn}`
        return this.signatures.get(key) || null
    }

    buildContentsWithSignature(conversationId, currentTurn, previousResponse, newUserMessage) {
        const signature = this.get(conversationId, currentTurn - 1)
        const contents = []

        if (previousResponse && signature) {
            // Re-inject thoughts into the context so the model remembers its reasoning
            contents.push({
                role: "model",
                parts: [
                    { text: `<thought>${signature}</thought>\n\n${previousResponse}` }
                ]
            })
        } else if (previousResponse) {
            contents.push({
                role: "model",
                parts: [{ text: previousResponse }]
            })
        }

        contents.push({
            role: "user",
            parts: [{ text: newUserMessage }]
        })

        return contents
    }
}

export const thoughtManager = new ThoughtSignatureManager()

// SECTION 3 — BASE GEMINI CALLER
async function callGemini({
    systemPrompt,
    contents,
    thinkingLevel = "high",
    jsonOutput = false,
    maxTokens = 2000,
    conversationId = null,
    turn = 0
}) {
    const apiKey = getApiKey()
    if (!apiKey) throw new Error('VITE_GEMINI_API_KEY not set')

    const requestBody = {
        system_instruction: {
            parts: [{ text: systemPrompt }]
        },
        contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: "Hello HARI, let's begin the strategic discovery." }] }],
        generationConfig: {
            maxOutputTokens: maxTokens,
            ...(jsonOutput && { responseMimeType: "application/json" })
        }
    }

    console.log(`[HARI-THINKING] Calling ${GEMINI_MODEL} | Turn: ${turn}`)

    try {
        const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(60000)
        })

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('[HARI-THINKING] HTTP Error:', response.status, errorBody)
            throw new Error(`HTTP ${response.status}: ${errorBody}`)
        }

        const data = await response.json()
        console.log('[HARI-THINKING] API Response:', data)

        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

        // Parse Thought Signature
        const thoughtMatch = rawText.match(/<thought>([\s\S]*?)<\/thought>/)
        const cleanText = rawText.replace(/<thought>[\s\S]*?<\/thought>/, '').trim()
        const thoughts = thoughtMatch ? thoughtMatch[1].trim() : null

        if (thoughts && conversationId) {
            thoughtManager.store(conversationId, turn, thoughts)
        }

        // Final safety check on text - ensure it's not empty after all cleaning
        const rawContent = rawText.replace(/<thought>[\s\S]*?<\/thought>/g, '').replace(/<\/?thought>/g, '').trim()
        const finalText = cleanText || rawContent || "I'm processing the strategic implications of that. Based on my analysis, these visibility gaps often reveal deeper operational friction. How significant is this to your bottom line?"

        return {
            success: true,
            text: finalText.length > 0 ? finalText : "I'm analyzing the root causes here. Could you elaborate on the business impact you're seeing?",
            thought: thoughts,
            rawResponse: data
        }
    } catch (error) {
        console.error('[HARI-THINKING] Call failed:', error.message)
        // Fallback to static reasoning if API fails
        return {
            success: false,
            text: "I'm having trouble connecting to my core intelligence engine. However, based on my primary training: what you're describing sounds like a classic 'Visibility Gap'. How significant is this to your bottom line?",
            thought: "API connection issues. Falling back to base reasoning persona.",
            error: error.message
        }
    }
}

// SECTION 4 — CONVERSATION UTILITIES

export async function getOpeningMessage(context, conversationId) {
    const systemPrompt = `
    ${HARI_IDENTITY}
    OBJ: Start a strategic discovery call.
    CONTEXT: ${JSON.stringify(context)}
    
    RULE: Do NOT ask many questions. Ask ONLY ONE powerful opening question about operational blindness.
    `
    const res = await callGemini({ systemPrompt, contents: [], turn: 0, conversationId })

    // Ensure we always have text
    if (!res.text) {
        res.text = "As VP Operations at Pithonix Global, what is the one area where you feel most operationally blind right now?";
    }

    return res;
}

export async function getScenarioReasoningResponse(userMessage, history, context, prevHARI, conversationId, turn) {
    const systemPrompt = `
    ${HARI_IDENTITY}
    OBJ: Reason through the client's challenge and propose 3 likely scenarios.
    
    DYNAMIC CONTEXT:
    User Challenge: "${userMessage}"
    Org Context: ${JSON.stringify(context)}
    
    GUIDELINE:
    - Your <thought> should be deep. 
    - Your public response should start with: "What you're describing around [user words] could be pointing to one of three things..."
    - Propose 3 specific, distinct scenarios (The Visibility Gap, The Capability Gap, The Integrity Gap, etc.)
    - Ask the user which one feels closest.
    `
    const contents = thoughtManager.buildContentsWithSignature(conversationId, turn, history.lastModelResponse, userMessage)
    const res = await callGemini({ systemPrompt, contents, turn, conversationId })
    return res
}

export async function getScenarioConfirmationResponse(userMessage, history, context, prevHARI, conversationId, turn) {
    const systemPrompt = `
    ${HARI_IDENTITY}
    OBJ: Deepen the discovery after the client confirms a scenario.
    
    CONFIRMED SCENARIO CONTEXT: "${userMessage}"
    PREVIOUS HARI RESPONSE: "${prevHARI.lastModelResponse}"
    
    GUIDELINE:
    - Acknowledge their choice with consultant gravity.
    - Ask a high-value quant/qual question (e.g., "How many people are affected?", "What is the dollar impact?").
    - Keep the <thought> block active.
    `
    const contents = thoughtManager.buildContentsWithSignature(conversationId, turn, prevHARI.lastModelResponse, userMessage)
    const res = await callGemini({ systemPrompt, contents, turn, conversationId })
    return res
}

export async function extractStructuredChallenge(fullConversation, currentChallenge, context, conversationId, turn) {
    const systemPrompt = `
    ${HARI_IDENTITY}
    OBJ: Extract structured intelligence from the conversation in JSON.
    
    REQUIRED JSON FORMAT:
    {
      "challenge": "Short descriptive name",
      "department": "The relevant department",
      "impact": "Business impact summary",
      "urgency": "LOW/MEDIUM/HIGH",
      "urgencyReason": "Why?",
      "rootCause": "The confirmed scenario/hypothesis",
      "scenarioConfirmed": "Yes/No"
    }
    `
    const contents = [{ role: "user", parts: [{ text: `Conversation History:\n${fullConversation}\n\nPlease extract the JSON.` }] }]
    const res = await callGemini({ systemPrompt, contents, jsonOutput: true, turn, conversationId })

    try {
        return { success: true, data: JSON.parse(res.text) }
    } catch (e) {
        return {
            success: true,
            data: {
                challenge: currentChallenge,
                department: context.industry || "Operations",
                impact: "Analyzing...",
                urgency: "HIGH",
                urgencyReason: "Detected through conversation intensity",
                rootCause: "Visibility Gap",
                scenarioConfirmed: "Yes"
            }
        }
    }
}

// LEGACY FALLBACKS (For compatibility while cleaning up)
export const getToolsQuestion = () => "Based on your current setup, which specific tools — such as SAP, Oracle, Workday, or custom legacy systems — are currently serving as your primary sources of truth?";
export const parseClientTools = (t) => t.split(',').map(s => s.trim());
export const getToolsAcknowledgement = () => "Acknowledged. Integrating these existing systems into the JEET Framework is a critical step for data continuity and operational resilience.";
export const getProbingQuestion = () => "That's a significant point. Could you elaborate on how these specific challenges impact your daily decision-making or overall project timelines?";
export const getOfferMoreMessage = () => "Understood. Is there any other specific area of your operations where you've noticed similar friction or visibility gaps?";
export const testConnection = async () => true;
export const extractComprehension = (text) => text;

// --- SCREEN 3: AUTOMATION BLUEPRINT ---
export const getAutomationBlueprint = async (useCases, context, simState) => {
    const industry = context?.industry || 'General';
    const bench = getBenchmark(industry);

    // Correlate discovery challenges with industry benchmarks
    const blueprints = (useCases || []).map(uc => {
        const matchingBenchmark = bench?.primaryChallenges?.find(pc =>
            pc.statement.toLowerCase().includes(uc.challenge.toLowerCase()) ||
            uc.challenge.toLowerCase().includes(pc.statement.toLowerCase())
        );

        return {
            name: uc.challenge,
            today: {
                description: uc.impact || "Fragmented manual overhead.",
                timeDays: matchingBenchmark ? parseInt(matchingBenchmark.courseCorrectionTime) * 2 : 14,
                people: matchingBenchmark ? 3 : 5,
                errorRate: matchingBenchmark ? '12-18%' : '20%+'
            },
            automated: {
                description: `Pithonix AI orchestrates this via the ${uc.department} Intelligence Agent.`,
                timeHours: matchingBenchmark ? 2 : 4,
                people: 'HITL only',
                errorRate: '<1%'
            },
            mindMapData: matchingBenchmark || {
                statement: uc.challenge,
                initialHurdles: ["Data Fragmentation", "System Latency"],
                courseCorrectionTime: "2 weeks",
                projection: "80% Efficiency Gain"
            }
        };
    });

    return {
        success: true,
        data: {
            useCaseBlueprints: blueprints.length > 0 ? blueprints : [
                {
                    name: "Core Operational Automation",
                    today: { description: "Manual data processing", timeDays: 14, people: 5, errorRate: '20%' },
                    automated: { description: "Autonomous AI orchestration", timeHours: 4, people: 'HITL only', errorRate: '<1%' }
                }
            ],
            automationFlow: {
                trigger: 'Strategic Event Detection',
                dataCollection: 'Multi-vector Scanning',
                processing: 'HARI Intelligence Layer',
                hitlGate: 'Validation Node',
                output: 'Automated Resolution'
            },
            metrics: bench?.automationROI || { hoursSavedMonthly: 120, processesAutomated: 5, touchpointsEliminated: 25, hitlGates: 4 }
        }
    };
};

// --- SCREEN 4: INTELLIGENCE BLUEPRINT ---
export const getIntelligenceBlueprint = async (useCases, metrics, context, simState) => {
    const industry = context?.industry || 'General';
    const orgName = context?.orgName || 'the organisation';
    const bench = getBenchmark(industry);

    const useCaseSummary = (useCases || []).map((uc, i) =>
        `${i + 1}. Challenge: "${uc.challenge}" | Root Cause: ${uc.rootCause || 'N/A'} | Impact: ${uc.impact || 'N/A'}`
    ).join('\n');

    const systemPrompt = `${HARI_IDENTITY}

You are generating the Intelligence Blueprint (Layer 2) for the Pithonix Discovery Simulator.
Your job is to analyse the specific use cases submitted by the client and generate forward-looking, predictive intelligence signals that reveal hidden risks and opportunity gaps SPECIFIC to their situation.

CRITICAL: Do NOT use generic signals. Every signal must directly relate to the client's stated challenges and industry context.`;

    const userMessage = `Generate an intelligence blueprint for ${orgName}, a company in the ${industry} sector.

Their confirmed use cases and challenges are:
${useCaseSummary || 'General operational improvement'}

Return a JSON object in this exact structure:
{
  "intelligenceSignals": [
    {
      "signalName": "Specific signal name directly linked to their challenges",
      "horizon": "Real-time | 30 days ahead | 60-90 days ahead | 6 months ahead",
      "description": "1-2 sentence specific description mentioning their actual problem area with a quantified risk e.g. '3 projects showing 8.3% unbilled time'",
      "confidence": 75-95,
      "action": "Specific recommended action for this org"
    }
  ],
  "sixMonthForecast": [
    { "month": 1, "capability": "Short specific milestone" },
    { "month": 2, "capability": "Short specific milestone" },
    { "month": 3, "capability": "Short specific milestone" },
    { "month": 4, "capability": "Short specific milestone" },
    { "month": 6, "capability": "Short specific milestone" }
  ],
  "agentsActivated": [
    { "name": "Agent Name from standard library", "justification": "One sentence why this agent is activated for their specific challenges" }
  ]
}

Rules:
- Generate exactly 3 intelligenceSignals, tied directly to their stated use cases
- Generate 5 sixMonthForecast entries (months 1, 2, 3, 4, 6)
- Generate 4-6 agentsActivated entries
- Agent names must be from: Strategic Orchestrator, Billing Intelligence Agent, Attrition Predictor, Compliance Sentinel, Revenue Leakage Detector, Delivery Risk Monitor, Learning Gap Analyst, Engagement Pulse Agent, Performance Signal Agent, Talent Flight Risk Agent
- Return ONLY the JSON object, no markdown, no explanation`;

    try {
        const result = await callGemini({
            systemPrompt,
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            thinkingLevel: 'low',
            jsonOutput: true,
            maxTokens: 1500,
        });

        if (!result?.success) throw new Error(result?.error || 'Gemini call failed');

        // callGemini returns { success, text, thought } — the JSON is in result.text
        const rawJson = (result.text || '').replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(rawJson);

        if (parsed?.intelligenceSignals?.length > 0) {
            return { success: true, data: parsed };
        }
        throw new Error('Invalid structure from Gemini');
    } catch (err) {
        console.warn('Intelligence blueprint AI fallback:', err.message);
        return {
            success: false,
            data: {
                intelligenceSignals: bench?.signals || [
                    { signalName: "Predictive Maintenance", horizon: "PROACTIVE", description: "Early detection of bottleneck patterns.", confidence: 88, action: "Trigger resource reallocation" }
                ],
                sixMonthForecast: bench?.sixMonthForecast || [
                    { month: 1, capability: "Baseline established" },
                    { month: 3, capability: "Autonomous pattern recognition" },
                    { month: 6, capability: "Self-optimizing workflows" }
                ],
                agentsActivated: (bench?.agentsActivated || []).length > 0 ? bench.agentsActivated : [
                    { name: "Strategic Orchestrator", justification: "Aligning operations with core goals." }
                ]
            }
        };
    }
};

// --- SCREEN 5: OUTCOME SIMULATION ---
export const getOutcomeSimulation = async ({ industry, orgName, useCases, automationBlueprint, intelligenceBlueprint, valueContext }) => {
    const bench = getBenchmark(industry || 'General');

    return {
        success: true,
        data: {
            operational: { narrative: bench.outcomeNarratives?.operational || "Operational excellence achieved through HARI.", metrics: [{ label: 'Processing', before: '14 days', after: '2 hours' }] },
            revenue: { narrative: bench.outcomeNarratives?.revenue || "Revenue leakage plugged via intelligent monitoring.", metrics: [] },
            growth: { narrative: bench.outcomeNarratives?.growth || "Unlocking new scale possibilities.", metrics: [] },
            employee: { narrative: bench.outcomeNarratives?.employee || "Removing cognitive load from staff.", metrics: [] },
            manager: { narrative: bench.outcomeNarratives?.manager || "Real-time visibility for decision makers.", metrics: [] },
            discoveryScore: bench.discoveryScore || 85,
            estimatedROI: bench.estimatedROI || { annualValue: '₹25L+', reduction: '40% Leakage Reduction' }
        }
    };
};
