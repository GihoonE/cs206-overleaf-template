/* =========================================================================
   data.js — content and configuration for the AI subscription comparison
   prototype.
   ========================================================================= */

/* ---- Plan information --------------------------------------------------
   Stage 1 and Stage 2 preserve provider-facing plan information.
   Stage 3 uses benchmark-normalized quality scores from the frozen
   2026-09-13 computational snapshot used in the PS1 proposal.

   IMPORTANT:
   These 0–100 values are 100 * B_{p,j}, the benchmark-quality component.
   They are NOT final SUU values. Final SUU additionally requires empirical
   usage capacity C_{p,j}, which has not yet been measured.
   ----------------------------------------------------------------------- */
const PLANS = {
  chatgpt: {
    key: 'chatgpt',
    name: 'ChatGPT Plus',
    price: 20,
    priceLabel: '$20/month',
    structure: 'Feature- and model-dependent limits',
    capability: 'Advanced general, coding, research, image, and agent capabilities',
    source: 'OpenAI ChatGPT Pricing',
    scores: { overall: 95.55, reasoning: 97.70, coding: 94.44, agentic: 94.52 }
  },
  claude: {
    key: 'claude',
    name: 'Claude Pro',
    price: 20,
    priceLabel: '$20/month',
    structure: '5-hour and weekly usage constraints',
    capability: 'Strong reasoning, coding, research, and agentic workflows',
    source: 'Claude Pricing',
    scores: { overall: 95.06, reasoning: 95.52, coding: 94.07, agentic: 95.59 }
  },
  gemini: {
    key: 'gemini',
    name: 'Google AI Pro',
    price: 19.99,
    priceLabel: '$19.99/month',
    structure: 'Compute-based usage plus feature-specific credits/limits',
    capability: 'Strong multimodal, research, productivity, and Google ecosystem integration',
    source: 'Google One / Google AI Plans',
    scores: { overall: 72.48, reasoning: 74.08, coding: 62.19, agentic: 81.18 }
  },
  grok: {
    key: 'grok',
    name: 'SuperGrok',
    price: 30,
    priceLabel: '$30/month',
    structure: 'Shared usage pool / higher rate limits',
    capability: 'Reasoning, media generation, connectors, and agentic functionality',
    source: 'xAI Pricing',
    scores: { overall: 75.28, reasoning: 68.95, coding: 62.24, agentic: 94.66 }
  }
};

/* Fixed provider order, identical across all three stages. */
const ORDER = ['chatgpt', 'claude', 'gemini', 'grok'];

const ACCESSED = 'September 5, 2026';
const BENCHMARK_SNAPSHOT = 'September 13, 2026';

const VIEW_LABELS = {
  overall: 'Overall',
  reasoning: 'Reasoning',
  coding: 'Coding',
  agentic: 'Agentic'
};

const VIEW_DESCRIPTIONS = {
  overall: 'Equal-weight average of the Reasoning, Coding, and Agentic benchmark-quality scores.',
  reasoning: 'HLE, GDP.pdf, CritPt, Omniscience, and LCR.',
  coding: 'Terminal-Bench and SciCode.',
  agentic: 'AA-Briefcase, GDPval-AA, and AutomationBench.'
};

const BENCHMARK_GROUPS = {
  reasoning: ['HLE', 'GDP.pdf', 'CritPt', 'Omniscience', 'LCR'],
  coding: ['Terminal-Bench', 'SciCode'],
  agentic: ['AA-Briefcase', 'GDPval-AA', 'AutomationBench']
};

/* ---- Stage 1: provider wording, unmodified ------------------------------ */
const STAGE1 = {
  chatgpt: ['Advanced models', 'Advanced image creation with Thinking', 'Expanded memory across chats', 'Work agent for multi-step tasks', 'Codex agent for coding', 'Expanded deep research', 'Projects and custom GPTs', 'Limits apply'],
  claude: ['More usage', 'Claude Code', 'Claude Cowork', 'Claude Design', 'Claude Science', 'Unlimited projects', 'Research', 'More Claude models', 'Claude for Microsoft 365'],
  gemini: ['5 TB cloud storage', 'Gemini with 4× higher usage limits', 'Pro model access', 'Deep Research', 'Google Flow', 'Gemini in Gmail, Docs, Vids, and more', 'Gemini Notebook', 'YouTube Premium Lite', 'Google Home Premium Standard', 'More Google benefits'],
  grok: ['Grok 4.6', 'Grok Bot', 'Connectors', 'Higher rate limits across all features', 'Expert', 'SOC 2 compliance', 'Image and video generation']
};

/* ---- Stage 2: plain-language explanations ------------------------------- */
const T = (label, text) => ({ label: label, text: text });
const L = (label, items) => ({ label: label, items: items });

const STAGE2 = {
  chatgpt: [
    { title: 'Advanced models', blocks: [
      T('What it means', 'ChatGPT Plus provides access to more capable models intended for harder reasoning and knowledge-work tasks rather than only basic conversational use.'),
      L('Examples of tasks', ['difficult coding', 'mathematics', 'research', 'planning', 'multi-step reasoning', 'analysis of larger documents']),
      T('Usage or limitation', 'More capable models may consume available usage differently from lighter models.'),
      T('How it may help you', 'Users can select stronger models when a task requires more reasoning or accuracy.'),
      T('Important', 'Access to a more advanced model does not necessarily mean the user receives an unlimited number of requests.')
    ]},
    { title: 'Advanced image creation with Thinking', blocks: [
      T('What it means', 'ChatGPT can create new images and modify existing images from natural-language instructions. “With Thinking” means the system can perform additional reasoning before producing the requested image.'),
      L('Examples', ['illustrations', 'diagrams', 'mockups', 'text rendering', 'background replacement', 'object removal or addition', 'visual concept generation']),
      T('How it may help you', 'Users may create or edit visuals without separately learning professional image-editing software.'),
      T('Usage or limitation', 'Exact fixed number of Plus image generations is not publicly guaranteed and limits may vary. Exact fixed usage amount not publicly specified.')
    ]},
    { title: 'Expanded memory across chats', blocks: [
      T('What it means', 'ChatGPT can use relevant information from previous interactions instead of treating every conversation as completely isolated.'),
      L('Examples', ['remember the context of an ongoing project', 'reuse previously discussed preferences', 'continue previous work without explaining everything again']),
      T('How it may help you', 'Users may spend less time repeatedly providing background information.'),
      T('Important', 'There is no simple publicly stated numerical “memory size” that consumers can directly compare with another provider.')
    ]},
    { title: 'Work agent for multi-step tasks', blocks: [
      T('What it means', 'Instead of answering only one prompt, an AI agent can carry out several connected steps toward a larger goal.'),
      L('Examples', ['research a topic', 'inspect files', 'organize information', 'navigate supported tools', 'create a finished work product', 'perform a multi-step workflow']),
      T('How it may help you', 'The user can describe an outcome rather than manually prompting every small step.'),
      T('Usage or limitation', 'Complex agentic work may consume more usage than a simple chat response. Exact fixed number of Work tasks included per month is not represented as one simple consumer-facing quantity. Exact fixed usage amount not publicly specified.')
    ]},
    { title: 'Codex agent for coding', blocks: [
      T('What it means', 'Codex is designed specifically for software-development work.'),
      L('Examples', ['inspect a codebase', 'implement changes', 'debug errors', 'explain code', 'modify multiple files', 'carry out longer coding tasks']),
      T('How it may help you', 'The user can delegate larger programming tasks rather than requesting isolated code snippets.'),
      T('Usage or limitation', 'Large or complex coding tasks may consume more available usage than small tasks. A single universal “number of coding tasks per month” is not publicly specified. Exact fixed usage amount not publicly specified.')
    ]},
    { title: 'Expanded deep research', blocks: [
      T('What it means', 'Deep Research is intended for questions that require gathering and synthesizing information from multiple sources rather than producing one immediate answer.'),
      L('Examples', ['literature review', 'product comparison', 'market research', 'multi-source investigation']),
      T('Output', 'Usually a longer structured response with references or citations.'),
      T('How it may help you', 'Useful when the answer requires more evidence and research than ordinary chat.'),
      T('Usage or limitation', 'A research task is substantially different from one simple chat message, so “one request” does not represent a consistent amount of AI work.')
    ]},
    { title: 'Projects and custom GPTs', blocks: [
      T('What it means', 'Projects keep related chats, files, and instructions together around one ongoing topic. Custom GPTs allow users to configure specialized versions of ChatGPT for repeated use cases.'),
      T('How it may help you', 'Useful for long-running work, repeated workflows, or specialized tasks.'),
      T('Important', 'The practical value depends heavily on how the user works, so these features cannot easily be represented by a raw message count.')
    ]}
  ],
  claude: [
    { title: 'More usage', blocks: [
      T('What it means', 'Claude Pro provides more usage than the free tier.'),
      L('Concrete structure', ['Pro provides substantially higher usage than Free.', 'Usage is governed partly through a rolling approximately 5-hour session window.', 'A weekly usage limitation can also apply.', 'Usage consumption depends on the model, conversation length, attached files, reasoning effort, and feature being used.']),
      T('Important', '“More usage” does not mean every user receives one fixed number of messages. A long document-analysis request may consume much more of the allowance than a short question. Exact fixed usage amount not publicly specified.'),
      T('How it may help you', 'Subscribers can use Claude more frequently and for heavier tasks than Free users.')
    ]},
    { title: 'Claude Code', blocks: [
      T('What it means', 'Claude Code is an AI coding agent designed to work with software projects.'),
      L('Examples', ['inspect a repository', 'understand existing code', 'change files', 'debug', 'implement features', 'assist from the terminal or development environment']),
      T('How it may help you', 'It can operate at the project level instead of only answering isolated programming questions.'),
      T('Usage or limitation', 'Claude Code usage can draw from the user’s Claude subscription allowance, so heavy coding use can reduce the amount available for other Claude activity.')
    ]},
    { title: 'Claude Cowork', blocks: [
      T('What it means', 'Claude Cowork is intended for multi-step non-coding knowledge work.'),
      L('Examples', ['research', 'organize files', 'generate documents', 'work with spreadsheets', 'use connected tools', 'complete longer workflows']),
      T('How it may help you', 'Users can delegate a goal instead of manually performing every individual step.'),
      T('Usage or limitation', 'Agentic tasks can consume substantially more computational work than one normal chat reply.')
    ]},
    { title: 'Claude Design', blocks: [
      T('What it means', 'A tool for creating visual or interactive work through conversational instructions.'),
      L('Examples', ['prototypes', 'presentations', 'designs', 'interactive experiences', 'microsites']),
      T('How it may help you', 'Users can create visual output without manually designing every element.'),
      T('Important', 'This represents a different type of workload from ordinary text chat.')
    ]},
    { title: 'Claude Science', blocks: [
      T('What it means', 'A specialized environment for scientific or analytical work.'),
      L('Examples', ['analyze scientific information', 'run analysis code', 'work with research files', 'assist with reproducible workflows', 'work with scientific data']),
      T('How it may help you', 'It is more similar to an AI-assisted research workspace than a normal chatbot.'),
      T('Important', 'Scientific analysis may consume significantly more resources than simple chat.')
    ]},
    { title: 'Unlimited projects', blocks: [
      T('What it means', 'Users can organize conversations and documents into many separate projects. Claude Pro also supports a large context window, allowing substantial amounts of information to be considered in one conversation.'),
      T('How it may help you', 'Useful for long-running projects and document-heavy workflows.'),
      T('Important', 'A larger context window indicates how much information can potentially be processed at once; it is not the same thing as monthly usage allowance.')
    ]},
    { title: 'Research', blocks: [
      T('What it means', 'Claude can perform multi-step research involving multiple searches and synthesis.'),
      T('How it may help you', 'Useful for questions where one search or one immediate response is insufficient.'),
      T('Output', 'Longer research-oriented responses with supporting sources.'),
      T('Usage or limitation', 'Research tasks may consume more of the user’s allowance than simple chat.')
    ]},
    { title: 'More Claude models', blocks: [
      T('What it means', 'Paid users may have access to multiple Claude model families with different trade-offs.'),
      L('Examples', ['stronger but more expensive reasoning', 'balanced general-purpose models', 'faster/lighter models']),
      T('How it may help you', 'Users can choose a model that better matches their task.'),
      T('Important', 'The same subscription allowance may be consumed at different rates depending on which model is selected.')
    ]},
    { title: 'Claude for Microsoft 365', blocks: [
      T('What it means', 'Claude can assist with work inside Microsoft productivity applications.'),
      L('Examples', ['Word document editing', 'Excel analysis', 'PowerPoint content', 'email-related productivity where supported']),
      T('How it may help you', 'Users may work with AI inside software they already use instead of constantly copying information between tools.')
    ]}
  ],
  gemini: [
    { title: '5 TB cloud storage', blocks: [
      T('What it means', 'The subscription includes 5 TB of storage across eligible Google services such as Drive, Gmail, and Photos.'),
      T('How it may help you', 'Users receive substantial non-AI storage value in addition to AI access.'),
      T('Important', 'This makes direct price comparison difficult because part of the subscription price pays for non-AI services.')
    ]},
    { title: 'Gemini with 4× higher usage limits', blocks: [
      T('What it means', 'Google describes AI Pro as providing approximately four times the Gemini usage allowance compared with users without a paid Google AI plan.'),
      L('Usage may depend on', ['model', 'task complexity', 'conversation length', 'feature', 'computational demand']),
      T('Usage or limitation', 'The usage system is not simply a fixed number of prompts. Usage can refresh within shorter time windows while also being affected by broader limits. Exact fixed usage amount not publicly specified.'),
      T('How it may help you', 'Subscribers can perform more or heavier Gemini tasks than users without the plan.'),
      T('Important', '“4× higher usage” still does not directly tell a consumer how many coding tasks, research jobs, or long conversations the subscription supports.')
    ]},
    { title: 'Pro model access', blocks: [
      T('What it means', 'Users receive access to Google’s stronger Gemini models intended for more difficult reasoning, coding, analysis, and multimodal tasks.'),
      T('How it may help you', 'Useful for harder tasks that may exceed the capabilities of lighter models.'),
      T('Context', 'Google AI Pro supports a very large context window in Gemini Apps, allowing large documents or long information sequences to be processed.'),
      T('Important', 'Context-window size is different from monthly usage capacity.')
    ]},
    { title: 'Deep Research', blocks: [
      T('What it means', 'Gemini can search and analyze many sources and synthesize them into a larger research report.'),
      L('Examples', ['research reports', 'comparisons', 'background investigations', 'multi-source synthesis']),
      T('How it may help you', 'Useful for research tasks requiring more evidence than a normal chat response.'),
      T('Usage or limitation', 'Deep Research can require substantially more computation than a simple prompt.')
    ]},
    { title: 'Google Flow', blocks: [
      T('What it means', 'Flow is Google’s AI creative environment for generating or editing visual and video content.'),
      L('Examples', ['AI-generated video', 'visual sequences', 'creative media generation']),
      T('Usage system', 'Flow uses credits. Google AI Pro includes a monthly Flow-credit allowance, and different generation modes can require different numbers of credits.'),
      T('How it may help you', 'Users can understand some creative usage through explicit credits.'),
      L('Important — a Flow credit cannot directly be compared with', ['one Gemini prompt', 'one Claude message', 'one Grok generation', 'one ChatGPT agent task']),
      T(null, 'This is exactly the type of cross-service comparison problem studied by this prototype.')
    ]},
    { title: 'Gemini in Gmail, Docs, Vids, and more', blocks: [
      T('What it means', 'Gemini is integrated into Google’s productivity applications.'),
      L('Examples', ['draft or revise email', 'write or summarize documents', 'assist with spreadsheets', 'help create video content']),
      T('How it may help you', 'Users can use AI directly inside existing workflows.'),
      T('Important', 'The value of this integration is difficult to express as a raw number of AI messages.')
    ]},
    { title: 'Gemini Notebook / NotebookLM', blocks: [
      T('What it means', 'A source-grounded AI workspace designed for studying and synthesizing a collection of documents or sources.'),
      L('Examples', ['ask questions about uploaded sources', 'generate summaries', 'study material', 'reports', 'audio or other generated learning materials']),
      T('How it may help you', 'Useful for research and education based on a specific source collection.'),
      T('Usage or limitation', 'Notebook-style workloads may use a different usage system from ordinary Gemini chat.')
    ]},
    { title: 'YouTube Premium Lite', blocks: [
      T('What it means', 'The subscription can include an additional YouTube-related benefit where available.'),
      T('Why it matters', 'This is non-AI value included in the same monthly price. Comparing the subscription purely by AI usage is therefore not straightforward.')
    ]},
    { title: 'Google Home Premium Standard', blocks: [
      T('What it means', 'The plan may include additional Google Home-related services where supported.'),
      T('Why it matters', 'Again, part of the subscription bundle provides non-AI value.')
    ]},
    { title: 'More Google benefits', blocks: [
      L('Examples', ['family-sharing benefits where eligible', 'ecosystem benefits', 'additional Google services depending on region']),
      T('Important', 'Google AI Pro is a bundle containing both AI and non-AI products. This makes direct dollar-for-dollar comparison with an AI-only subscription difficult.')
    ]}
  ],
  grok: [
    { title: 'Grok 4.6', blocks: [
      T('What it means', 'A frontier Grok model intended for difficult reasoning, coding, multimodal analysis, and agentic tasks.'),
      L('Examples', ['coding', 'reasoning', 'analysis', 'research', 'image understanding', 'multi-step work']),
      T('How it may help you', 'Users can use a more capable model for complex work.'),
      T('Important', 'Access to a more powerful model does not indicate how much total monthly work the subscription supports.')
    ]},
    { title: 'Grok Bot', blocks: [
      T('What it means', 'An agent-oriented feature intended to perform multi-step work rather than only returning one text answer.'),
      L('Examples', ['research', 'interact with tools', 'perform longer workflows', 'carry out recurring or multi-step tasks']),
      T('How it may help you', 'The user can delegate a broader objective.'),
      T('Important', 'Official availability and exact usage details may differ across xAI documentation. Availability and limits may vary; exact standardized capacity is not publicly specified.')
    ]},
    { title: 'Connectors', blocks: [
      T('What it means', 'Grok can connect to external services or data sources where supported.'),
      L('Examples', ['email', 'calendar', 'other connected information sources']),
      T('How it may help you', 'The user may allow Grok to work with information already stored in other tools.'),
      T('Important', 'Connector access describes capability, not quantity of usable AI service.')
    ]},
    { title: 'Higher rate limits across all features', blocks: [
      T('What it means', 'Paid users receive higher limits than lower tiers. Usage can be shared across multiple Grok features rather than being represented as one simple number of messages.'),
      L('Workloads that may draw from usage', ['chat', 'image generation', 'video generation', 'voice', 'agentic functionality', 'development-related tools']),
      T('Usage or limitation', 'The standard SuperGrok pricing description does not provide one simple universally comparable numerical monthly allowance. Exact fixed usage amount not publicly specified.'),
      T('Why it matters', '“Higher rate limits” tells consumers that they receive more access, but not exactly how much usable AI work $30 purchases.')
    ]},
    { title: 'Expert', blocks: [
      T('What it means', 'The pricing page lists “Expert” as a benefit.'),
      T('Important', 'Exact consumer-facing quantitative definition not clearly specified.')
    ]},
    { title: 'SOC 2 compliance', blocks: [
      T('What it means', 'This relates to security and organizational controls.'),
      T('Why a consumer or organization may care', 'It can matter for trust, security practices, and organizational adoption.'),
      L('Important — SOC 2 compliance does not mean the user receives', ['better reasoning', 'more messages', 'more tokens', 'faster responses']),
      T(null, 'It is therefore shown as a qualitative service characteristic, not usage quantity.')
    ]},
    { title: 'Image and video generation', blocks: [
      T('What it means', 'Grok can create visual content, including AI-generated images and videos.'),
      L('Examples', ['image generation', 'image editing', 'short generated videos']),
      T('How it may help you', 'One subscription can support multiple media types.'),
      T('Usage or limitation', 'Visual generation can consume the shared usage allowance differently from ordinary text chat. One image or video request cannot simply be treated as equal to one text request.')
    ]}
  ]
};

/* ---- Plain-language glossary ------------------------------------------- */
const GLOSSARY = [
  { term: 'Context window', def: 'How much text the AI can hold in view at once during a single conversation. It is about how much it can read at a time, not how much you may use per month.' },
  { term: 'Agent', def: 'An AI that carries out several connected steps toward a goal on its own, instead of replying once to one question.' },
  { term: 'Multimodal', def: 'Able to work with more than just text, such as images, audio, or video.' },
  { term: 'Rate limit', def: 'A cap on how much you may use in a given period, for example per hour or per day.' },
  { term: 'Rolling limit', def: 'A limit measured over a moving time window. If it is a 5-hour rolling window, what you used 5 hours ago stops counting against you.' },
  { term: 'Usage pool', def: 'One shared allowance that several different features draw from, so heavy use of one feature leaves less for the others.' }
];

