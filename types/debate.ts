// ── Phase Definitions ──────────────────────────────────────────────────────────
export type DebatePhase =
  | 'idle'
  | 'judge_question'       // Judge is formulating a question
  | 'advocate_response'    // Advocates are responding to the judge's question
  | 'evaluation'           // Judge is evaluating responses
  | 'user_input'           // Debate paused, waiting for user clarification
  | 'verdict'              // Judge is delivering final verdict
  | 'complete';            // Debate finished

// ── Round Data Structures ──────────────────────────────────────────────────────

/** A single advocate's response within one round */
export interface AdvocateRoundResponse {
  agentIndex: number;
  option: string;
  response: string;
}

/** A user clarification captured during the debate */
export interface UserClarification {
  afterRound: number;        // which round triggered this clarification
  question: string;          // what the judge asked the user
  answer: string;            // what the user replied
}

/** One complete round of the debate: judge question + all advocate responses */
export interface DebateRound {
  roundNumber: number;
  judgeQuestion: string;
  responses: AdvocateRoundResponse[];
  userClarification?: UserClarification;  // if judge asked user after this round
}

// ── Expert Perspective ──────────────────────────────────────────────────────────

/** An expert perspective assigned to an advocate */
export interface ExpertPerspective {
  option: string;            // the option this expert advocates for
  expert: string;            // expert title/specialization description
}

// ── Advocate State (for frontend rendering) ────────────────────────────────────
export interface Advocate {
  index: number;
  option: string;
  rounds: string[];
  status: 'idle' | 'thinking' | 'done';
}

// ── Debate Container ───────────────────────────────────────────────────────────
export interface Debate {
  id: string;
  options: string[];
  context: string;
  phase: DebatePhase;
  advocates: Advocate[];
  rounds: DebateRound[];
  currentRound: number;
  maxRounds: number;
  verdict: string;
  createdAt: number;
}

// ── Saved Debate (for history/localStorage) ─────────────────────────────────────

export interface SavedDebate {
  id: string;
  options: string[];
  context: string;
  experts?: ExpertPerspective[];
  verdict: string;
  rounds: DebateRound[];
  maxRounds: number;
  language: string;
  model: string;
  createdAt: number;
  prompt?: string;           // original single-prompt input (if used)
}

// ── SSE Events ─────────────────────────────────────────────────────────────────
export type DebateEventType =
  | 'phase_start'
  | 'round_start'
  | 'judge_question_chunk'
  | 'judge_question_done'
  | 'agent_chunk'
  | 'agent_done'
  | 'evaluation_chunk'
  | 'evaluation_done'
  | 'user_input_request'     // Judge asks user for clarification
  | 'user_input_received'    // User has submitted their response
  | 'verdict_chunk'
  | 'verdict_done'
  | 'done'
  | 'error';

export interface DebateEvent {
  type: DebateEventType;
  agentIndex?: number;
  phase?: DebatePhase;
  round?: number;
  maxRounds?: number;
  chunk?: string;
  decision?: 'continue' | 'verdict';
  error?: string;
  question?: string;         // Judge's clarification question text
  userInput?: string;        // User's clarification response text
}
