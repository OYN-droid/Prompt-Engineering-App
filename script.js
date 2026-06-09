const form = document.querySelector("#generatorForm");
const outputTitle = document.querySelector("#outputTitle");
const contentOutput = document.querySelector("#contentOutput");
const promptOutput = document.querySelector("#promptOutput");
const qualityNotes = document.querySelector("#qualityNotes");
const copyBtn = document.querySelector("#copyBtn");
const regenerateBtn = document.querySelector("#regenerateBtn");
const toast = document.querySelector("#toast");
const themeToggle = document.querySelector("#themeToggle");

const titleMap = {
  blog: "Blog Post",
  email: "Marketing Email",
  code: "Code Snippet",
  social: "Social Post",
  brief: "Strategy Brief",
  campaign: "Campaign Planning",
  copywriting: "Copywriting",
  asset: "Asset Production",
  reporting: "Performance Reporting",
};

const toneMap = {
  clear: "plainspoken, direct, and easy to scan",
  persuasive: "benefit-led, confident, and conversion-aware",
  technical: "precise, implementation-minded, and specific",
  friendly: "warm, practical, and conversational",
  executive: "concise, strategic, and decision-oriented",
};

const lengthMap = {
  concise: { bullets: 3, paragraphs: 2, codeLines: 16 },
  standard: { bullets: 4, paragraphs: 3, codeLines: 28 },
  detailed: { bullets: 5, paragraphs: 4, codeLines: 42 },
};

const savedTheme = localStorage.getItem("contentGeneratorTheme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  themeToggle.querySelector(".theme-toggle__icon").textContent = theme === "dark" ? "☀" : "☾";
  themeToggle.querySelector(".theme-toggle__text").textContent = theme === "dark" ? "Light" : "Dark";
}

applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

function getFormData() {
  return {
    topic: document.querySelector("#topic").value.trim(),
    outputType: document.querySelector("#outputType").value,
    tone: document.querySelector("#tone").value,
    audience: document.querySelector("#audience").value.trim() || "general readers",
    length: document.querySelector("#length").value,
    keywords: document.querySelector("#keywords").value.trim(),
    includeStructure: document.querySelector("#includeStructure").checked,
    includeExamples: document.querySelector("#includeExamples").checked,
    includeCta: document.querySelector("#includeCta").checked,
  };
}

function smartTitle(topic) {
  const clean = topic
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 9)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return clean || "Generated Content";
}

function keywordList(keywords) {
  return keywords
    ? keywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function makePrompt(data) {
  const constraints = keywordList(data.keywords);
  const controls = [
    data.includeStructure ? "Use a clear structure with labeled sections." : "Keep the format natural.",
    data.includeExamples ? "Include concrete examples, details, or implementation cues." : "Avoid extra examples unless essential.",
    data.includeCta ? "End with a useful next step." : "Do not force a call to action.",
  ];

  return [
    `Role: You are an expert content strategist and prompt engineer.`,
    `Task: Generate a ${titleMap[data.outputType].toLowerCase()} from a simple user idea.`,
    `User idea: ${data.topic}`,
    `Audience: ${data.audience}`,
    `Tone: ${toneMap[data.tone]}`,
    `Length: ${data.length}`,
    constraints.length ? `Must include: ${constraints.join(", ")}` : "Must include: only details implied by the user idea.",
    `Controls: ${controls.join(" ")}`,
    `Output requirements: Make the result structured, specific, and ready to adapt.`,
  ].join("\n");
}

function makeNotes(data) {
  const notes = [
    "The simple input was expanded into role, task, audience, tone, constraints, and output requirements.",
    data.includeStructure
      ? "Structure is enforced so the output is easier to edit and reuse."
      : "Structure is relaxed for a more natural draft.",
    data.keywords
      ? "Keyword constraints were preserved instead of being sprinkled randomly."
      : "No keyword constraints were supplied, so the draft avoids invented product details.",
    data.includeCta
      ? "The ending includes a next step to make the content actionable."
      : "The ending avoids a forced call to action.",
  ];

  return notes;
}

function makeBlog(data) {
  const title = smartTitle(data.topic);
  const details = lengthMap[data.length];
  const keywords = keywordList(data.keywords);

  return [
    `# ${title}`,
    "",
    `## Hook`,
    `${data.audience} do not need more raw information. They need a clear path from idea to action. ${data.topic} can work when the message is framed around a concrete problem, a credible promise, and a simple next step.`,
    "",
    `## Core Angle`,
    `Position this around the practical shift it creates: less guesswork, faster decisions, and output that feels intentionally shaped rather than loosely assembled.`,
    "",
    `## Key Points`,
    ...Array.from({ length: details.bullets }, (_, index) => {
      const points = [
        "Start with the audience's real constraint, not the product or topic itself.",
        "Name the transformation in everyday language so the value is obvious.",
        "Use a repeatable structure: context, problem, approach, example, outcome.",
        "Add one concrete detail that makes the content feel grounded.",
        "Close with a specific action the reader can take immediately.",
      ];
      return `- ${points[index]}`;
    }),
    "",
    data.includeExamples
      ? `## Example Framing\nFor example, instead of saying "${data.topic}," frame it as: "Here is how ${data.audience} can turn a rough idea into something useful before momentum disappears."`
      : "",
    keywords.length ? `\n## Included Constraints\n${keywords.map((item) => `- ${item}`).join("\n")}` : "",
    data.includeCta
      ? `\n## Next Step\nChoose one audience segment, rewrite the hook for that group, and test whether the first sentence makes the value clear without extra explanation.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function makeEmail(data) {
  const title = smartTitle(data.topic);
  const keywords = keywordList(data.keywords);

  return [
    `Subject: A faster way to act on ${title.toLowerCase()}`,
    `Preview: Turn the rough idea into a useful next draft without starting from a blank page.`,
    "",
    `Hi there,`,
    "",
    `${data.topic} matters most when it helps ${data.audience} move from intention to execution.`,
    "",
    `The stronger version of the message is simple: define the audience, clarify the outcome, and give the reader one obvious reason to keep going.`,
    "",
    data.includeStructure
      ? `What this creates:\n- A sharper opening\n- A more useful structure\n- Clearer examples\n- A next step that feels earned`
      : `The result is a message that feels clearer, more focused, and easier to act on.`,
    "",
    data.includeExamples
      ? `Example use case: a busy reader can scan the idea, understand why it matters, and decide what to do next in under a minute.`
      : "",
    keywords.length ? `Must-haves: ${keywords.join(", ")}.` : "",
    data.includeCta ? `\nWant to make this useful today? Start with the audience and rewrite the first sentence around their most urgent problem.` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function makeCode(data) {
  const details = lengthMap[data.length];
  const keywords = keywordList(data.keywords);
  const comment = data.topic.replace(/\s+/g, " ").slice(0, 100);

  return [
    `// ${comment}`,
    `const promptConfig = {`,
    `  audience: "${data.audience}",`,
    `  tone: "${data.tone}",`,
    `  length: "${data.length}",`,
    `  constraints: ${JSON.stringify(keywords)},`,
    `  controls: {`,
    `    structure: ${data.includeStructure},`,
    `    examples: ${data.includeExamples},`,
    `    callToAction: ${data.includeCta}`,
    `  }`,
    `};`,
    "",
    `function generateStructuredPrompt(input, config) {`,
    `  const sections = [`,
    `    "Role: Expert content strategist.",`,
    `    \`Task: Turn this simple idea into structured output: \${input}\`,`,
    `    \`Audience: \${config.audience}\`,`,
    `    \`Tone: \${config.tone}\`,`,
    `    \`Length: \${config.length}\``,
    `  ];`,
    "",
    `  if (config.controls.structure) sections.push("Use labeled sections.");`,
    `  if (config.controls.examples) sections.push("Include concrete examples.");`,
    `  if (config.controls.callToAction) sections.push("End with a next step.");`,
    `  if (config.constraints.length) {`,
    `    sections.push(\`Must include: \${config.constraints.join(", ")}\`);`,
    `  }`,
    "",
    `  return sections.join("\\n");`,
    `}`,
    "",
    `const engineeredPrompt = generateStructuredPrompt(${JSON.stringify(data.topic)}, promptConfig);`,
    `console.log(engineeredPrompt);`,
  ]
    .slice(0, details.codeLines)
    .join("\n");
}

function makeSocial(data) {
  const title = smartTitle(data.topic);
  const keywords = keywordList(data.keywords);

  return [
    `${title}`,
    "",
    `${data.topic}`,
    "",
    `The useful version is not just more content. It is a better-shaped prompt:`,
    "",
    `1. Define the audience: ${data.audience}`,
    `2. Name the desired outcome`,
    `3. Add constraints before generating`,
    data.includeExamples ? `4. Ask for examples that prove the idea works` : `4. Keep the draft tight and specific`,
    data.includeCta ? `5. End with one practical next step` : `5. Stop before the post becomes overbuilt`,
    "",
    keywords.length ? `Include: ${keywords.join(", ")}` : "",
    data.includeCta ? `\nTry it: rewrite your next rough idea as role + task + audience + constraints.` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function makeBrief(data) {
  const keywords = keywordList(data.keywords);

  return [
    `## Objective`,
    `Develop structured content from the input: ${data.topic}`,
    "",
    `## Audience`,
    `${data.audience}`,
    "",
    `## Recommended Positioning`,
    `Lead with the practical outcome. The message should be ${toneMap[data.tone]} and should make the value obvious within the first few lines.`,
    "",
    `## Content Strategy`,
    `- Translate the input into a clear problem statement.`,
    `- Identify the user's desired outcome.`,
    `- Use constraints to prevent generic output.`,
    data.includeExamples ? `- Add examples that make the message concrete.` : `- Keep examples minimal and focused.`,
    data.includeCta ? `- Close with one next action.` : `- Close cleanly without extra persuasion.`,
    "",
    keywords.length ? `## Required Inclusions\n${keywords.map((item) => `- ${item}`).join("\n")}\n` : "",
    `## Success Criteria`,
    `The final content should be scannable, audience-specific, and ready for a human editor to refine rather than rebuild.`,
  ]
    .filter(Boolean)
    .join("\n");
}

function makeCampaign(data) {
  const details = lengthMap[data.length];
  const keywords = keywordList(data.keywords);

  return [
    `## Campaign Goal`,
    `Turn "${data.topic}" into a coordinated campaign for ${data.audience}.`,
    "",
    `## Strategic Angle`,
    `Lead with the outcome the audience cares about, then support it with proof, useful examples, and a clear path to action. The campaign voice should be ${toneMap[data.tone]}.`,
    "",
    `## Audience Insight`,
    `${data.audience} are most likely to respond when the campaign connects the idea to a specific pain point, immediate benefit, and credible reason to act now.`,
    "",
    `## Core Message`,
    `A practical way to move from interest to action: ${data.topic}`,
    "",
    `## Channel Plan`,
    ...Array.from({ length: details.bullets }, (_, index) => {
      const channels = [
        "Email: announce the main promise and drive readers to the primary offer.",
        "Landing page: explain the problem, benefits, proof points, and conversion path.",
        "Social: break the idea into short posts with one insight per post.",
        "Sales enablement: create a short talk track, objection responses, and follow-up copy.",
        "Retargeting: remind warm audiences of the strongest proof point and next step.",
      ];
      return `- ${channels[index]}`;
    }),
    "",
    data.includeExamples
      ? `## Campaign Examples\n- Hook: "Stop turning good ideas into scattered drafts."\n- Proof point: "Use a structured prompt to create content that is easier to edit, approve, and ship."\n- Offer frame: "Build the first usable version in minutes, then refine with intent."`
      : "",
    keywords.length ? `\n## Required Inputs\n${keywords.map((item) => `- ${item}`).join("\n")}` : "",
    data.includeCta
      ? `\n## Launch Next Step\nCreate the landing page headline, one email, and three social posts from this campaign angle before expanding the channel plan.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function makeCopywriting(data) {
  const title = smartTitle(data.topic);
  const keywords = keywordList(data.keywords);

  return [
    `## Message Platform`,
    `Audience: ${data.audience}`,
    `Tone: ${toneMap[data.tone]}`,
    `Idea: ${data.topic}`,
    "",
    `## Headline Options`,
    `1. ${title}: Turn the Rough Idea Into the Right Message`,
    `2. Build Clearer Content From a Simple Starting Point`,
    `3. From Prompt to Polished Draft, Without the Blank Page`,
    "",
    `## Short Copy`,
    `Give ${data.audience} a faster way to shape an idea into something specific, useful, and ready to refine.`,
    "",
    `## Body Copy`,
    `The strongest message is not louder. It is clearer. Start with the audience, define the outcome, add constraints, and let the content follow a structure that makes editing easier.`,
    "",
    data.includeExamples
      ? `## Copy Variations\n- Benefit-led: Create sharper content from rough ideas.\n- Problem-led: Stop losing momentum between the idea and the draft.\n- Outcome-led: Ship content that already has structure, tone, and direction.`
      : "",
    keywords.length ? `\n## Required Language\n${keywords.map((item) => `- ${item}`).join("\n")}` : "",
    data.includeCta
      ? `\n## CTA Options\n- Generate your first structured draft\n- Turn an idea into content\n- Build the next version now`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function makeAssetProduction(data) {
  const details = lengthMap[data.length];
  const keywords = keywordList(data.keywords);

  return [
    `## Production Brief`,
    `Create campaign-ready assets for: ${data.topic}`,
    "",
    `## Audience`,
    `${data.audience}`,
    "",
    `## Asset List`,
    ...Array.from({ length: details.bullets }, (_, index) => {
      const assets = [
        "Landing page hero: headline, subhead, CTA, and supporting proof point.",
        "Email asset: subject line, preview text, body copy, and primary CTA.",
        "Social asset set: three short posts, each focused on a different angle.",
        "Visual brief: describe the image concept, layout priority, and required text.",
        "Sales one-sheet: problem, solution, benefits, proof, and next step.",
      ];
      return `- ${assets[index]}`;
    }),
    "",
    `## Creative Direction`,
    `Use a ${toneMap[data.tone]} voice. Keep the assets modular so individual pieces can be reused across email, web, and social channels.`,
    "",
    data.includeExamples
      ? `## Example Asset Spec\nAsset: Social carousel\nFrame 1: Name the problem\nFrame 2: Show the better process\nFrame 3: Give the audience a useful action\nFrame 4: Close with the next step`
      : "",
    keywords.length ? `\n## Required Elements\n${keywords.map((item) => `- ${item}`).join("\n")}` : "",
    data.includeCta
      ? `\n## Production Next Step\nProduce the highest-leverage asset first, then adapt it into supporting formats to keep the message consistent.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function makeReporting(data) {
  const keywords = keywordList(data.keywords);

  return [
    `## Reporting Objective`,
    `Evaluate performance for: ${data.topic}`,
    "",
    `## Audience`,
    `${data.audience}`,
    "",
    `## Executive Summary Template`,
    `The campaign should be reviewed against reach, engagement, conversion quality, and the clarity of the next action. The reporting voice should be ${toneMap[data.tone]}.`,
    "",
    `## KPI Dashboard`,
    `- Awareness: impressions, reach, traffic sources, branded search movement.`,
    `- Engagement: click-through rate, scroll depth, replies, saves, and content interaction.`,
    `- Conversion: form fills, demo requests, purchases, signups, or qualified leads.`,
    `- Efficiency: cost per result, conversion rate, channel contribution, and drop-off points.`,
    "",
    data.includeExamples
      ? `## Insight Examples\n- If clicks are high and conversions are low, inspect message-match between the ad or email and the destination page.\n- If engagement is low, test a sharper hook or a more specific audience problem.\n- If one channel outperforms others, adapt its winning message into the weaker channels.`
      : "",
    keywords.length ? `\n## Required Reporting Dimensions\n${keywords.map((item) => `- ${item}`).join("\n")}` : "",
    data.includeCta
      ? `\n## Recommended Next Step\nPick the single biggest performance gap, define one hypothesis, and run the smallest test that can prove or disprove it.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function generate(data) {
  const generators = {
    blog: makeBlog,
    email: makeEmail,
    code: makeCode,
    social: makeSocial,
    brief: makeBrief,
    campaign: makeCampaign,
    copywriting: makeCopywriting,
    asset: makeAssetProduction,
    reporting: makeReporting,
  };

  outputTitle.textContent = titleMap[data.outputType];
  contentOutput.textContent = generators[data.outputType](data);
  promptOutput.textContent = makePrompt(data);

  qualityNotes.innerHTML = "";
  makeNotes(data).forEach((note) => {
    const item = document.createElement("li");
    item.textContent = note;
    qualityNotes.appendChild(item);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1400);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = getFormData();
  if (!data.topic) {
    showToast("Add a simple input first");
    return;
  }
  generate(data);
});

regenerateBtn.addEventListener("click", () => {
  const data = getFormData();
  if (!data.topic) {
    document.querySelector("#topic").focus();
    showToast("Add a simple input first");
    return;
  }
  generate(data);
});

copyBtn.addEventListener("click", async () => {
  const text = contentOutput.textContent.trim();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied output");
  } catch {
    showToast("Copy unavailable");
  }
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("contentGeneratorTheme", nextTheme);
  applyTheme(nextTheme);
});

document.querySelector("#topic").value =
  "Create a launch announcement for a prompt engineering toolkit that helps teams turn rough ideas into polished content.";
generate(getFormData());
