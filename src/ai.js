// src/ai.js
// Thin adapter layer — delegates to codeAnalyzer.
// Swap the internals for a real AI/compiler API without touching any component.

import { generateExplanation } from "./utils/codeAnalyzer"

/**
 * Returns a structured explanation for the given code and language.
 * Simulates async latency so the loading state is visible.
 *
 * @param {string} code
 * @param {string} language  — "javascript" | "python" | "java" | "cpp"
 * @returns {Promise<string>}
 */
export async function explainCode(code, language = "javascript", explanationLang = "english") {
  if (typeof code !== "string") return ""

  // Simulate network/AI latency (replace with real API call later)
  await new Promise((resolve) => setTimeout(resolve, 600))

  return generateExplanation(code, language, explanationLang)
}