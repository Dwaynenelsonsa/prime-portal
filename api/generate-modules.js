import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { scopePoints } = req.body || {};

    if (!scopePoints || !String(scopePoints).trim()) {
      return res.status(400).json({ error: "Missing scope points" });
    }

    const prompt = `
You are helping build a simple engineering support project.

Read the client issues and suggest only the most relevant workstreams and modules.

Client issues:
${scopePoints}

Rules:
- Return an array of workstream groups
- Use max 3 workstreams
- Name them exactly: "Workstream 1", "Workstream 2", "Workstream 3"
- Use plain everyday English
- Write so anyone can understand it
- Do not use jargon, consultant words, or management language
- Do not guess problems that are not clearly written
- If there is only one issue, stay focused on that one issue
- If there are multiple issues, only cover those issues
- Prefer fewer modules over too many
- Keep workstream labels short and easy to understand
- Keep module names short, clear, and practical
- Do not use words like baseline, governance, triage, cadence, framework, ownership mapping, or capacity model
- Every title must make sense to a normal person
- When in doubt, reduce scope instead of expanding it

Return JSON only in this exact format:
[
  {
    "workstream": "Workstream 1",
    "label": "Simple short label",
    "modules": ["Short clear module name", "Short clear module name"]
  }
]
`;

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: prompt
    });

    const raw = (response.output_text || "").trim();

    let groups = [];
    try {
      groups = JSON.parse(raw);
    } catch (e) {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        groups = JSON.parse(match[0]);
      }
    }

    if (!Array.isArray(groups)) {
      return res.status(500).json({ error: "AI did not return valid JSON" });
    }

    return res.status(200).json(groups);
  } catch (error) {
    console.error("generate-modules error:", error);
    return res.status(500).json({ error: "Server error generating modules" });
  }
}