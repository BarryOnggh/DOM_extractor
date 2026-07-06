/**
 * ==========================================================================
 * MOCK BACKEND — Extension UI Shell
 * ==========================================================================
 * This file stands in for the real backend endpoint (DOM scan + LLM -> structured next step).
 *
 * ASSUMED CONTRACT:
 *
 *   Request  { goal: string, history: Array<{step_index:number}> }
 *
 *   Response {
 *     task_name:    string,               // human-readable task label
 *     step_index:   number,               // 1-based
 *     total_steps:  number | null,        // null if unknown until done
 *     target: {
 *       data_ai_id: string,               // matches the injected DOM attribute
 *       label:      string                // human-readable name of the element
 *     },
 *     action_type:  "click" | "input" | "select" | "read",
 *     instruction:  string,               // short imperative shown as step title
 *     explanation:  string,               // supporting detail / reassurance
 *     done:         boolean               // true on the final step
 *   }
 *
 * If nothing in the goal matches a known flow, the mock returns
 * `null` so the UI can show a graceful "I couldn't find that yet" message.
 * ==========================================================================
 */

const MOCK_FLOWS = {
  "housing-grant": {
    task_name: "Applying for Housing Grant",
    keywords: ["housing", "grant", "hdb"],
    steps: [
      {
        target: { data_ai_id: "start-application-btn", label: "Start Application button" },
        action_type: "click",
        instruction: "Click the \u201cStart Application\u201d button",
        explanation: "I've highlighted it on the screen for you."
      },
      {
        target: { data_ai_id: "personal-details-form", label: "Personal details form" },
        action_type: "input",
        instruction: "Fill in your personal details",
        explanation: "Your name, NRIC, and address as they appear on your ID."
      },
      {
        target: { data_ai_id: "submit-application-btn", label: "Submit Application button" },
        action_type: "click",
        instruction: "Review your details and click Submit",
        explanation: "Double check everything looks right, then send it in."
      }
    ]
  },
  "cpf-balance": {
    task_name: "Checking CPF Balance",
    keywords: ["cpf", "balance", "singpass"],
    steps: [
      {
        target: { data_ai_id: "singpass-login-btn", label: "Login with Singpass button" },
        action_type: "click",
        instruction: "Click \u201cLog in with Singpass\u201d",
        explanation: "This takes you to the secure Singpass sign-in page."
      },
      {
        target: { data_ai_id: "singpass-credentials-form", label: "Singpass credentials form" },
        action_type: "input",
        instruction: "Enter your Singpass ID and password",
        explanation: "The same details you use for other government sites."
      },
      {
        target: { data_ai_id: "view-cpf-balance-link", label: "View CPF Balance link" },
        action_type: "click",
        instruction: "Click \u201cView CPF Balance\u201d",
        explanation: "Your balance will appear right below this link."
      }
    ]
  }
};

function matchFlow(goalText) {
  const text = goalText.toLowerCase();
  for (const [flowId, flow] of Object.entries(MOCK_FLOWS)) {
    if (flow.keywords.some((k) => text.includes(k))) return flowId;
  }
  return null;
}

/**
 * Mimics the real network call. Same name/shape as the real call will use,
 * so wiring up the backend later is a one-function swap.
 *
 * @param {string} goal - the user's stated goal (only used to pick a flow
 *   on the very first call; the real backend will use it plus DOM context
 *   on every call).
 * @param {{flowId: string|null, stepIndex: number}} state - conversation
 *   state the UI shell keeps: which flow we're in, and how many steps have
 *   already been sent (0-based index of the NEXT step to send).
 */
function fetchNextStep(goal, state) {
  const stepIndex = state.stepIndex;
  const flowId = state.flowId || matchFlow(goal);

  return new Promise((resolve) => {
    setTimeout(() => {
      const flow = MOCK_FLOWS[flowId];
      if (!flow || stepIndex >= flow.steps.length) {
        resolve(null);
        return;
      }
      const step = flow.steps[stepIndex];
      resolve({
        flowId,
        task_name: flow.task_name,
        step_index: stepIndex + 1,
        total_steps: flow.steps.length,
        target: step.target,
        action_type: step.action_type,
        instruction: step.instruction,
        explanation: step.explanation,
        done: stepIndex === flow.steps.length - 1
      });
    }, 400); // simulated network latency
  });
}
