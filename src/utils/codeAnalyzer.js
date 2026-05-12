// src/utils/codeAnalyzer.js
// ─────────────────────────────────────────────────────────────
// Pure utility module — no React / UI dependencies.
// Swap the internals for real compiler API calls later without
// touching any component code.
// ─────────────────────────────────────────────────────────────

// ── Language metadata ────────────────────────────────────────

export const SUPPORTED_LANGUAGES = ["javascript", "python", "java", "cpp"]

export const LANGUAGE_LABELS = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
}

// ── Default starter snippets ─────────────────────────────────

export const DEFAULT_SNIPPETS = {
  javascript: `// JavaScript Example
function greet(name) {
  console.log("Hello, " + name + "!")
}

const numbers = [1, 2, 3, 4, 5]
let sum = 0

for (let i = 0; i < numbers.length; i++) {
  sum += numbers[i]
}

console.log("Sum:", sum)
greet("World")
`,

  python: `# Python Example
def greet(name):
    print(f"Hello, {name}!")

numbers = [1, 2, 3, 4, 5]
total = sum(numbers)

print("Sum:", total)

for n in numbers:
    if n % 2 == 0:
        print(n, "is even")
    else:
        print(n, "is odd")

greet("World")
`,

  java: `// Java Example
public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;

        for (int i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }

        System.out.println("Sum: " + sum);

        for (int n : numbers) {
            if (n % 2 == 0) {
                System.out.println(n + " is even");
            } else {
                System.out.println(n + " is odd");
            }
        }
    }
}
`,

  cpp: `// C++ Example
#include <iostream>
#include <vector>
using namespace std;

void greet(string name) {
    cout << "Hello, " << name << "!" << endl;
}

int main() {
    vector<int> numbers = {1, 2, 3, 4, 5};
    int sum = 0;

    for (int i = 0; i < numbers.size(); i++) {
        sum += numbers[i];
    }

    cout << "Sum: " << sum << endl;

    for (int n : numbers) {
        if (n % 2 == 0) {
            cout << n << " is even" << endl;
        } else {
            cout << n << " is odd" << endl;
        }
    }

    greet("World");
    return 0;
}
`,
}

// ── Construct detection ──────────────────────────────────────

/**
 * Detects high-level constructs present in `code`.
 * Language-agnostic — works on all four supported languages.
 *
 * @param {string} code
 * @returns {object}
 */
export function detectConstructs(code) {
  if (typeof code !== "string" || !code.trim()) {
    return {
      hasLoop: false, hasCondition: false, hasFunction: false,
      hasArray: false, hasVariable: false, hasReturn: false,
      hasClass: false, hasRecursion: false, hasSorting: false,
      hasSearching: false, hasMath: false, hasStringOps: false,
      loopCount: 0, nestingDepth: 0,
    }
  }

  const hasLoop = /\bfor\b|\bwhile\b|\bdo\b/.test(code)
  const loopCount = (code.match(/\bfor\b|\bwhile\b/g) ?? []).length

  const hasCondition = /\bif\b|\belse\b|\bswitch\b|\bcase\b/.test(code)

  const hasFunction =
    /\bfunction\b|\bdef\b|\bvoid\b|\bint\s+\w+\s*\(|\bfloat\s+\w+\s*\(|\bdouble\s+\w+\s*\(|\bstring\s+\w+\s*\(|\bauto\s+\w+\s*\(|=>/.test(code)

  const hasArray = /\[|\bArray\b|\bvector\b|\blist\b|\btuple\b|\bdict\b|\bmap\b/.test(code)

  const hasVariable =
    /\blet\b|\bvar\b|\bconst\b|\bint\b|\bfloat\b|\bdouble\b|\bstring\b|\bauto\b|\bbool\b/.test(code)

  const hasReturn = /\breturn\b/.test(code)
  const hasClass  = /\bclass\b/.test(code)

  // Recursion: named function calling itself
  const fnNameMatch = code.match(/(?:function\s+|def\s+)(\w+)/)
  const hasRecursion = fnNameMatch
    ? new RegExp(`\\b${fnNameMatch[1]}\\s*\\(`).test(
        code.replace(new RegExp(`(?:function\\s+|def\\s+)${fnNameMatch[1]}`), "")
      )
    : false

  // Sorting algorithms
  const hasSorting =
    /\bsort\b|bubble.?sort|merge.?sort|quick.?sort|insertion.?sort|selection.?sort|heap.?sort|\bsorted\b/i.test(code)

  // Searching algorithms
  const hasSearching =
    /binary.?search|\bsearch\b|\bfind\b|\bindexOf\b|\bcontains\b|\bincludes\b|linear.?search/i.test(code)

  // Math operations
  const hasMath =
    /Math\.|\bpow\b|\bsqrt\b|\babs\b|\bfloor\b|\bceil\b|\bround\b|\bmod\b|\bmin\b|\bmax\b|\bsum\b|\bfactorial\b|\bfib/i.test(code)

  // String operations
  const hasStringOps =
    /\.length|\bsplit\b|\bjoin\b|\bsubstr|\bslice\b|\breplace\b|\btrim\b|\btoUpper|\btoLower|\bstrlen|\bstrcmp|\bstrcat/i.test(code)

  // Rough nesting depth via indentation
  const indentLevels = code.split("\n")
    .map((l) => (l.match(/^(\s+)/) ?? ["", ""])[1].length)
  const nestingDepth = Math.round(Math.max(...indentLevels) / 2)

  return {
    hasLoop, loopCount, hasCondition, hasFunction, hasArray,
    hasVariable, hasReturn, hasClass, hasRecursion,
    hasSorting, hasSearching, hasMath, hasStringOps, nestingDepth,
  }
}

// ── Output-statement extraction ──────────────────────────────

const OUTPUT_PATTERNS = {
  javascript: /console\.log\s*\(([^)]*)\)/g,
  python:     /print\s*\(([^)]*)\)/g,
  java:       /System\.out\.print(?:ln)?\s*\(([^)]*)\)/g,
  cpp:        /cout\s*<<\s*([^;]+)/g,
}

/**
 * Extracts the raw argument strings from output statements.
 *
 * @param {string} code
 * @param {string} language
 * @returns {string[]}
 */
export function extractOutputStatements(code, language) {
  if (typeof code !== "string" || !code.trim()) return []

  const pattern = OUTPUT_PATTERNS[language] ?? OUTPUT_PATTERNS.javascript
  const results = []
  let match

  // Reset lastIndex before iterating
  pattern.lastIndex = 0

  while ((match = pattern.exec(code)) !== null) {
    results.push(match[1].trim())
  }

  // Reset again so repeated calls work correctly
  pattern.lastIndex = 0

  return results
}

// ── Value resolution helpers ─────────────────────────────────

/**
 * Attempt to resolve a simple literal or expression to a display string.
 * Handles: string literals, numbers, simple arithmetic, template literals.
 * Returns null when expression is too complex.
 *
 * @param {string} expr
 * @returns {string|null}
 */
function resolveExpression(expr) {
  const trimmed = expr.trim()
  if (!trimmed) return null

  // Plain string literal
  const strMatch = trimmed.match(/^["'`](.*)["'`]$/)
  if (strMatch) return strMatch[1]

  // Number
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return trimmed

  // Boolean
  if (trimmed === "true" || trimmed === "false") return trimmed

  // Simple arithmetic with only numbers and operators
  if (/^[\d\s+\-*/().]+$/.test(trimmed)) {
    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${trimmed})`)()
      return String(result)
    } catch {
      return null
    }
  }

  return null
}

/**
 * Format a raw output argument from a given language into a human-readable line.
 *
 * @param {string} raw  — the captured argument string
 * @param {string} language
 * @returns {string}
 */
function formatOutputLine(raw, language) {
  if (!raw || !raw.trim()) return ""

  if (language === "cpp") {
    return raw
      .replace(/\bendl\b/g, "")
      .replace(/std::endl/g, "")
      .split("<<")
      .map((p) => _resolveToken(p.trim()))
      .filter(Boolean).join("")
  }

  if (language === "java") {
    return raw.split(/\s*\+\s*/)
      .map((p) => _resolveToken(p.trim()))
      .join("")
  }

  if (language === "python") {
    const fMatch = raw.match(/^f["'`]([\s\S]*)["'`]$/)
    if (fMatch) return fMatch[1]
    return raw.split(/\s*,\s*/)
      .map((p) => _resolveToken(p.trim()))
      .join(" ")
  }

  // JavaScript — template literal
  if (raw.startsWith("`")) return raw.replace(/^`|`$/g, "")

  // JavaScript — + concat or comma-separated
  const parts = raw.includes("+")
    ? raw.split(/\s*\+\s*/)
    : raw.split(/\s*,\s*/)
  return parts.map((p) => _resolveToken(p.trim())).join("")
}

function _resolveToken(token) {
  if (!token) return ""
  const t = token.trim()
  // String literal (single, double, or backtick)
  const strMatch = t.match(/^["'`]([\s\S]*)["'`]$/)
  if (strMatch) return strMatch[1]
  // Number literal
  if (/^-?\d+(\.\d+)?$/.test(t)) return t
  // Boolean / null keywords
  if (["true","false","null","undefined","None"].includes(t)) return t
  // Pure arithmetic → evaluate safely
  if (/^[\d\s+\-*/().]+$/.test(t)) {
    try { return String(Function('"use strict";return(' + t + ')')()) } catch { /**/ }
  }
  // Bare identifier → show as <varName> placeholder
  if (/^\w+$/.test(t)) return "<" + t + ">"
  // Anything else
  return t.replace(/["']/g, "")
}


// ── Output simulation ────────────────────────────────────────


// ── Output simulation ────────────────────────────────────────

/**
 * Generate a realistic terminal-style simulated output string.
 *
 * @param {string} code
 * @param {string} language
 * @returns {string}
 */
export function simulateOutput(code, language) {
  if (typeof code !== "string" || !code.trim()) {
    return "(no code to run)"
  }

  const lang = SUPPORTED_LANGUAGES.includes(language) ? language : "javascript"
  const statements = extractOutputStatements(code, lang)
  const constructs = detectConstructs(code)

  if (statements.length === 0) {
    if (constructs.hasFunction) {
      return `// Program ran successfully.\n// No output statements detected.\n// Functions defined but not called with output.`
    }
    return `// Program ran successfully.\n// No output statements detected.`
  }

  const lines = []

  for (const raw of statements) {
    const line = formatOutputLine(raw, lang)
    if (line) lines.push(line)
  }

  // If there's a loop and we only found one print statement, simulate a few iterations
  if (constructs.hasLoop && lines.length === 1 && !lines[0].includes("{")) {
    const base = lines[0]
    // Check if the output looks numeric or iteration-based
    if (/\d/.test(base) || /sum|count|i\s*=|index/i.test(base)) {
      // Already handled — don't duplicate
    } else {
      const extra = [base + " (iteration 1)", base + " (iteration 2)", base + " (iteration 3)"]
      return extra.join("\n")
    }
  }

  return lines.join("\n") || "// No output produced."
}

// ── Flowchart generation ─────────────────────────────────────

/**
 * Build a Mermaid flowchart string based on detected constructs.
 *
 * @param {string} code
 * @param {string} language
 * @returns {string}
 */
export function generateFlowchart(code, language) {
  if (typeof code !== "string" || !code.trim()) {
    return "flowchart TD\n  A([Start]) --> B([End])"
  }

  const c = detectConstructs(code)
  const hasOutput = extractOutputStatements(code, language).length > 0

  // ── Node ID factory ──────────────────────────────────────
  let _id = 0
  const nid = () => `N${++_id}`

  // ── Node/edge accumulators ───────────────────────────────
  const defs  = []   // node definitions  e.g. N1[label]
  const links = []   // edges             e.g. N1 --> N2

  function node(shape, label) {
    const id = nid()
    switch (shape) {
      case "stadium":  defs.push(`  ${id}([${label}])`);  break
      case "diamond":  defs.push(`  ${id}{${label}}`);    break
      case "rect":
      default:         defs.push(`  ${id}[${label}]`);    break
    }
    return id
  }

  function edge(from, to, label) {
    links.push(label
      ? `  ${from} -->|${label}| ${to}`
      : `  ${from} --> ${to}`)
  }

  // ── Build diagram ────────────────────────────────────────
  const START = node("stadium", "🚀 Start")
  let prev = START

  // 1. Class / module entry
  if (c.hasClass) {
    const n = node("rect", "📦 Class Definition")
    edge(prev, n); prev = n
  }

  // 2. Function declaration(s)
  if (c.hasFunction && !c.hasRecursion) {
    const fnName = _extractFunctionName(code) ?? "Function"
    const n = node("rect", `🔧 Define: ${fnName}`)
    edge(prev, n); prev = n
  }

  // 3. Variable / array initialisation
  if (c.hasVariable || c.hasArray) {
    const label = c.hasArray
      ? "📋 Init Variables and Collection"
      : "📋 Init Variables"
    const n = node("rect", label)
    edge(prev, n); prev = n
  }

  // 4. Sorting block
  if (c.hasSorting) {
    const alg  = _detectSortAlgorithm(code)
    const sort = node("rect", `🔢 Sort: ${alg}`)
    edge(prev, sort); prev = sort
  }

  // 5. Searching block
  if (c.hasSearching) {
    const alg    = _detectSearchAlgorithm(code)
    const check  = node("diamond", `🔍 Search: ${alg}`)
    const found  = node("rect",    "✅ Element Found")
    const notfnd = node("rect",    "❌ Not Found")
    const merge  = node("rect",    " ")
    edge(prev, check)
    edge(check, found,  "yes")
    edge(check, notfnd, "no")
    edge(found,  merge)
    edge(notfnd, merge)
    prev = merge
  }

  // 6. Recursion pattern (takes priority over plain loop)
  if (c.hasRecursion) {
    const fnName = _extractFunctionName(code) ?? "fn"
    const base   = node("diamond", "🔍 Base Case reached?")
    const ret    = node("rect",    "↩️ Return Result")
    const rec    = node("rect",    `🔁 ${fnName} calls itself`)
    const merge  = node("rect",    "After recursion")
    edge(prev,  base)
    edge(base,  ret,   "yes")
    edge(base,  rec,   "no")
    edge(rec,   base)          // back-edge shows recursion
    edge(ret,   merge)
    prev = merge
  }
  // 7. Nested loops
  else if (c.hasLoop && c.loopCount > 1) {
    const outerType = _detectLoopType(code, 0)
    const innerType = _detectLoopType(code, 1)

    const outerCond = node("diamond", `🔄 Outer ${outerType} Condition`)
    const innerInit = node("rect",    "📋 Inner Loop Init")
    const innerCond = node("diamond", `🔄 Inner ${innerType} Condition`)
    const body      = node("rect",    "⚙️ Loop Body")
    const afterInner= node("rect",    " ")
    const afterOuter= node("rect",    " ")

    edge(prev,       outerCond)
    edge(outerCond,  innerInit,  "true")
    edge(outerCond,  afterOuter, "false")
    edge(innerInit,  innerCond)
    edge(innerCond,  body,       "true")
    edge(innerCond,  afterInner, "false")
    edge(body,       innerCond)        // inner back-edge

    if (c.hasCondition) {
      const ifCond = node("diamond", "❓ if Condition")
      const trueBr = node("rect",    "✅ if Block")
      const falseBr= node("rect",    "❌ else Block")
      const mrgBr  = node("rect",    " ")
      edge(afterInner, ifCond)
      edge(ifCond, trueBr,  "true")
      edge(ifCond, falseBr, "false")
      edge(trueBr,  mrgBr)
      edge(falseBr, mrgBr)
      edge(mrgBr, outerCond)           // outer back-edge
    } else {
      edge(afterInner, outerCond)      // outer back-edge
    }
    prev = afterOuter
  }
  // 8. Single for loop
  else if (c.hasLoop && _hasForLoop(code)) {
    const init  = node("rect",    "📋 Loop Init i = 0")
    const cond  = node("diamond", "🔄 for: i less-than n")
    const body  = node("rect",    "⚙️ Loop Body")
    const incr  = node("rect",    "➕ Increment i++")
    const after = node("rect",    "✅ After Loop")

    edge(prev,  init)
    edge(init,  cond)
    edge(cond,  body,  "true")
    edge(cond,  after, "false")
    edge(body,  incr)
    edge(incr,  cond)               // back-edge

    if (c.hasCondition) {
      const ifCond  = node("diamond", "❓ if Condition")
      const trueBr  = node("rect",    "✅ if Block")
      const falseBr = node("rect",    "❌ else Block")
      const mrgBr   = node("rect",    " ")
      // insert between body and incr
      const idxFor = links.findLastIndex(l => l.includes(`${body} -->`))
      if (idxFor !== -1) links.splice(idxFor, 1)
      edge(body,    ifCond)
      edge(ifCond,  trueBr,  "true")
      edge(ifCond,  falseBr, "false")
      edge(trueBr,  mrgBr)
      edge(falseBr, mrgBr)
      edge(mrgBr,   incr)
    }
    prev = after
  }
  // 9. While loop
  else if (c.hasLoop && _hasWhileLoop(code)) {
    const cond  = node("diamond", "🔄 while Condition")
    const body  = node("rect",    "⚙️ Loop Body")
    const after = node("rect",    " ")

    edge(prev, cond)
    edge(cond, body,  "true")
    edge(cond, after, "false")
    edge(body, cond)                // back-edge

    if (c.hasCondition) {
      const ifCond  = node("diamond", "❓ if Condition")
      const trueBr  = node("rect",    "✅ if Block")
      const falseBr = node("rect",    "❌ else Block")
      const mrgBr   = node("rect",    " ")
      const idx = links.findLastIndex(l => l.includes(`${body} -->`))
      if (idx !== -1) links.splice(idx, 1)
      edge(body,    ifCond)
      edge(ifCond,  trueBr,  "true")
      edge(ifCond,  falseBr, "false")
      edge(trueBr,  mrgBr)
      edge(falseBr, mrgBr)
      edge(mrgBr,   cond)
    }
    prev = after
  }
  // 10. Condition only (no loop)
  else if (c.hasCondition) {
    const hasElseIf = _hasElseIf(code)
    const cond    = node("diamond", "❓ Condition Check")
    const trueBr  = node("rect",    "✅ if Block")
    const mrgBr   = node("rect",    " ")

    edge(prev, cond)
    edge(cond, trueBr, "true")

    if (hasElseIf) {
      const eicond  = node("diamond", "❓ else if Check")
      const eibr    = node("rect",    "🔀 else if Block")
      const falseBr = node("rect",    "❌ else Block")
      edge(cond,   eicond,  "false")
      edge(eicond, eibr,    "true")
      edge(eicond, falseBr, "false")
      edge(eibr,   mrgBr)
      edge(falseBr, mrgBr)
    } else {
      const falseBr = node("rect", "❌ else Block")
      edge(cond,    falseBr, "false")
      edge(falseBr, mrgBr)
    }

    edge(trueBr, mrgBr)
    prev = mrgBr
  }

  // 11. Math / string processing node
  if (c.hasMath && !c.hasSorting) {
    const n = node("rect", "🧮 Math Computation")
    edge(prev, n); prev = n
  }

  // 12. Return value
  if (c.hasReturn && c.hasFunction && !c.hasRecursion) {
    const n = node("rect", "↩️ Return Result")
    edge(prev, n); prev = n
  }

  // 13. Output
  if (hasOutput) {
    const printFn = { javascript: "console.log", python: "print", java: "System.out.println", cpp: "cout" }[language] ?? "print"
    const n = node("rect", `🖨️ Output via ${printFn}`)
    edge(prev, n); prev = n
  }

  const END = node("stadium", "🏁 End")
  edge(prev, END)

  return ["flowchart TD", ...defs, ...links].join("\n")
}

// ── Flowchart private helpers ────────────────────────────────

function _extractFunctionName(code) {
  const m = code.match(/(?:function\s+|def\s+|void\s+|int\s+)(\w+)\s*\(/)
  return m ? m[1] : null
}

function _detectSortAlgorithm(code) {
  if (/bubble.?sort/i.test(code))     return "Bubble Sort"
  if (/merge.?sort/i.test(code))      return "Merge Sort"
  if (/quick.?sort/i.test(code))      return "Quick Sort"
  if (/insertion.?sort/i.test(code))  return "Insertion Sort"
  if (/selection.?sort/i.test(code))  return "Selection Sort"
  if (/heap.?sort/i.test(code))       return "Heap Sort"
  if (/\bsorted\b/i.test(code))       return "Built-in Sort"
  return "Sort"
}

function _detectSearchAlgorithm(code) {
  if (/binary.?search/i.test(code))   return "Binary Search"
  if (/linear.?search/i.test(code))   return "Linear Search"
  if (/\bfind\b|\bindexOf\b/i.test(code)) return "Find/IndexOf"
  return "Search"
}

function _detectLoopType(code, occurrence = 0) {
  const forMatches  = [...code.matchAll(/\bfor\b/g)]
  const whileMatches= [...code.matchAll(/\bwhile\b/g)]

  // Build an ordered list of loop types by position
  const all = [
    ...forMatches.map(m => ({ pos: m.index, type: "for" })),
    ...whileMatches.map(m => ({ pos: m.index, type: "while" })),
  ].sort((a, b) => a.pos - b.pos)

  return all[occurrence]?.type ?? "for"
}

function _hasForLoop(code)   { return /\bfor\b/.test(code) }
function _hasWhileLoop(code) { return /\bwhile\b/.test(code) }
function _hasElseIf(code)    { return /\belse\s+if\b|\belif\b/.test(code) }



// ── Explanation generation ───────────────────────────────────

/**
 * Generate a structured, code-aware textual explanation.
 *
 * @param {string} code
 * @param {string} language
 * @returns {string}
 */
export function generateExplanation(code, language, explanationLang = "english") {
  const isHinglish = explanationLang === "hinglish"

  if (typeof code !== "string" || !code.trim()) {
    return isHinglish 
      ? "Koi code nahi diya gaya hai. Kripya editor mein kuch code likhein."
      : "No code provided. Please write some code in the editor."
  }

  const lang = LANGUAGE_LABELS[language] ?? "Unknown"
  const constructs = detectConstructs(code)
  const outputStatements = extractOutputStatements(code, language)
  const allLines = code.split("\n")
  const meaningful = allLines.filter(
    (l) => l.trim() && !/^\s*(\/\/|#|\/\*|\*)/.test(l)
  )

  const sections = []

  // ── Header
  sections.push(isHinglish ? `✅ Code ki Explanation — ${lang}` : `✅ Code Explanation — ${lang}`)
  sections.push("")

  // ── Beginner-friendly summary
  const traits = []
  if (constructs.hasClass)     traits.push(isHinglish ? "ek class" : "a class")
  if (constructs.hasFunction)  traits.push(isHinglish ? "function(s)" : "function(s)")
  if (constructs.hasSorting)   traits.push(isHinglish ? "ek sorting algorithm" : "a sorting algorithm")
  if (constructs.hasSearching) traits.push(isHinglish ? "ek searching algorithm" : "a searching algorithm")
  if (constructs.hasRecursion) traits.push(isHinglish ? "recursion" : "recursion")
  if (constructs.hasLoop)      traits.push(isHinglish ? `loop(s) (${constructs.loopCount} mile)` : `loop(s) (${constructs.loopCount} found)`)
  if (constructs.hasCondition) traits.push(isHinglish ? "conditional logic" : "conditional logic")
  if (constructs.hasArray)     traits.push(isHinglish ? "array/collection(s)" : "array/collection(s)")
  if (constructs.hasMath)      traits.push(isHinglish ? "math operations" : "math operations")
  if (constructs.hasStringOps) traits.push(isHinglish ? "string manipulation" : "string manipulation")

  const summary = traits.length > 0
    ? (isHinglish 
        ? `Yeh ${lang} program ${traits.join(", ")} ka istemal karta hai.`
        : `This ${lang} program uses ${traits.join(", ")}.`)
    : (isHinglish 
        ? `Is ${lang} program mein ${meaningful.length} executable line(s) hain bina kisi special logic ke.`
        : `This ${lang} program has ${meaningful.length} executable line(s) with no special constructs detected.`)

  sections.push(isHinglish 
    ? `📋 Yeh Code Kya Karta Hai (Beginner Friendly):\n${summary}`
    : `📋 What This Code Does (Beginner Friendly):\n${summary}`)
  sections.push("")

  // ── Detected constructs
  sections.push(isHinglish ? "🔍 Detected Constructs:" : "🔍 Detected Constructs:")
  sections.push(`  • Functions      : ${constructs.hasFunction  ? "✅ Yes" : "❌ No"}`)
  sections.push(`  • Loops          : ${constructs.hasLoop      ? `✅ Yes (${constructs.loopCount})` : "❌ No"}`)
  sections.push(`  • Conditions     : ${constructs.hasCondition ? "✅ Yes" : "❌ No"}`)
  sections.push(`  • Arrays         : ${constructs.hasArray     ? "✅ Yes" : "❌ No"}`)
  sections.push(`  • Variables      : ${constructs.hasVariable  ? "✅ Yes" : "❌ No"}`)
  sections.push(`  • Recursion      : ${constructs.hasRecursion ? "✅ Yes" : "❌ No"}`)
  sections.push(`  • Sorting        : ${constructs.hasSorting   ? "✅ Yes" : "❌ No"}`)
  sections.push(`  • Searching      : ${constructs.hasSearching ? "✅ Yes" : "❌ No"}`)
  sections.push(`  • Math Ops       : ${constructs.hasMath      ? "✅ Yes" : "❌ No"}`)
  sections.push(`  • String Ops     : ${constructs.hasStringOps ? "✅ Yes" : "❌ No"}`)
  sections.push(`  • Classes        : ${constructs.hasClass     ? "✅ Yes" : "❌ No"}`)
  sections.push(`  • Nesting Depth  : ~${constructs.nestingDepth} level(s)`)
  sections.push("")

  // ── Step-by-step logic
  sections.push(isHinglish ? "📌 Step-by-Step Logic (Kaise Kaam Karta Hai):" : "📌 Step-by-Step Logic:")
  buildSteps(constructs, language, isHinglish).forEach((step, i) =>
    sections.push(`  ${i + 1}. ${step}`)
  )
  sections.push("")

  // ── Line-by-line breakdown (first 10 meaningful lines)
  sections.push(isHinglish ? "🔬 Line-by-Line Breakdown (Har Line Ka Matlab):" : "🔬 Line-by-Line Breakdown:")
  meaningful.slice(0, 10).forEach((line, i) => {
    const trimmed = line.trim()
    sections.push(`  ${String(i + 1).padStart(2, " ")}│ ${trimmed.slice(0, 55)}${trimmed.length > 55 ? "…" : ""}`)
    sections.push(`    └─ ${annotate(trimmed, isHinglish)}`)
  })
  if (meaningful.length > 10) sections.push(isHinglish ? `  ... (aur ${meaningful.length - 10} lines)` : `  ... (${meaningful.length - 10} more lines)`)
  sections.push("")

  // ── Output statements
  const printFn = { javascript: "console.log", python: "print", java: "System.out.println", cpp: "cout" }[language] ?? "print"
  if (outputStatements.length > 0) {
    sections.push(`🖨️ Output Statements (${printFn}):`)
    outputStatements.slice(0, 6).forEach((s, i) => sections.push(`  ${i + 1}. ${printFn}(${s})`))
    if (outputStatements.length > 6) sections.push(`  ... and ${outputStatements.length - 6} more`)
  } else {
    sections.push("🖨️ Output Statements: None detected")
  }
  sections.push("")

  // ── Pattern-specific insights
  const insights = getPatternInsights(constructs, language)
  if (insights.length > 0) {
    sections.push("💡 Pattern Insights:")
    insights.forEach((ins) => sections.push(`  ${ins}`))
    sections.push("")
  }

  // ── Complexity analysis
  const { time, space, note } = estimateComplexity(constructs)
  sections.push("📊 Complexity Analysis:")
  sections.push(`  Time  : ${time}`)
  sections.push(`  Space : ${space}`)
  if (note) sections.push(`  Note  : ${note}`)
  sections.push("")

  // ── Optimization hints
  const hints = buildOptimizationHints(constructs, language)
  if (hints.length > 0) {
    sections.push("⚡ Optimization Hints:")
    hints.forEach((h) => sections.push(`  • ${h}`))
    sections.push("")
  }

  // ── Language best practices
  const tips = LANGUAGE_TIPS[language] ?? []
  if (tips.length > 0) {
    sections.push(`🛠️ ${lang} Best Practices:`)
    tips.slice(0, 3).forEach((t) => sections.push(`  • ${t}`))
    sections.push("")
  }

  sections.push("🔌 Ready for real AI: swap ai.js internals with any compiler/LLM API.")
  return sections.join("\n")
}

// ── Private helpers ──────────────────────────────────────────

function buildSteps(constructs, language, isHinglish) {
  const steps = []
  if (constructs.hasClass)     steps.push(isHinglish ? "Ek class/module define ki gayi hai related logic group karne ke liye." : "A class/module is defined to group related logic.")
  if (constructs.hasFunction)  steps.push(isHinglish ? "Reusable logic ke liye functions declare kiye gaye hain." : "One or more functions are declared to encapsulate reusable logic.")
  if (constructs.hasVariable || constructs.hasArray)
    steps.push(constructs.hasArray
      ? (isHinglish ? "Data store karne ke liye arrays/lists initialize kiye gaye hain." : "Variables and collections (arrays/lists) are initialized to hold data.")
      : (isHinglish ? "Variables declare kiye gaye hain shuruaati values ke sath." : "Variables are declared and initialized with starting values."))
  if (constructs.hasSorting)   steps.push(isHinglish ? "Data ko sort kiya gaya hai (kisi order mein lagaya gaya hai)." : "The data is sorted — elements are reordered by a comparison rule.")
  if (constructs.hasSearching) steps.push(isHinglish ? "Array/list mein kisi element ko dhoondhne ke liye search chal raha hai." : "A search is performed to locate a target element within the data.")
  if (constructs.hasLoop && constructs.hasCondition)
    steps.push(isHinglish ? "Ek loop data ke upar chal raha hai aur condition check kar raha hai." : "A loop iterates over the data; conditions decide different actions per element.")
  else if (constructs.hasLoop)
    steps.push(isHinglish ? "Ek loop block of code ko baar-baar repeat kar raha hai." : "A loop repeats a block of code for each element or a set number of times.")
  else if (constructs.hasCondition)
    steps.push(isHinglish ? "If/else condition ke basis par code decide kar raha hai kya execute karna hai." : "Conditional logic (if/else) controls which code path runs based on a test.")
  if (constructs.hasRecursion) {
    steps.push(isHinglish ? "Ek function khud ko wapas call kar raha hai (recursion) chote problems solve karne ke liye." : "A function calls itself (recursion) — each call solves a smaller sub-problem.")
    steps.push(isHinglish ? "Recursion tab rukta hai jab base case mil jata hai." : "The recursion terminates when a base case is reached.")
  }
  if (constructs.hasMath)      steps.push(isHinglish ? "Numeric values par maths calculations ho rahi hain." : "Mathematical computations are performed on numeric values.")
  if (constructs.hasStringOps) steps.push(isHinglish ? "Text ya strings ko modify aur process kiya ja raha hai." : "String manipulation operations process or transform text data.")
  if (constructs.hasReturn)    steps.push(isHinglish ? "Functions apne result wapas return kar rahe hain." : "Results are returned from functions back to the caller.")
  const printFn = { javascript: "console.log", python: "print", java: "System.out.println", cpp: "cout" }[language] ?? "output"
  steps.push(isHinglish ? `Final results screen par ${printFn} se print hote hain.` : `Final results are displayed using ${printFn}.`)
  return steps
}

function annotate(t, isHinglish) {
  if (/\bfunction\b|\bdef\b/.test(t))                      return isHinglish ? "Function definition — ek reusable code block declare karta hai" : "Function definition — declares a reusable block of logic"
  if (/\bclass\b/.test(t))                                  return isHinglish ? "Class declaration — data aur methods ko group karta hai" : "Class declaration — groups related data and methods"
  if (/\bfor\b|\bwhile\b/.test(t))                          return isHinglish ? "Loop — code repeat karta hai jab tak condition true hai" : "Loop — repeats code while a condition holds"
  if (/\bif\b|\belif\b|\belse if\b/.test(t))               return isHinglish ? "Condition — check karta hai ki kya step lena hai" : "Condition — branches execution based on a test"
  if (/\belse\b/.test(t))                                   return isHinglish ? "Else — agar condition false ho jaye toh yeh chalega" : "Else — fallback branch when condition is false"
  if (/\bswitch\b|\bcase\b/.test(t))                        return isHinglish ? "Switch/case — multiple choices handle karta hai" : "Switch/case — multi-branch selection"
  if (/\breturn\b/.test(t))                                 return isHinglish ? "Return — function se value wapas bhejta hai" : "Return — sends a value back to the caller"
  if (/console\.log|print\s*\(|cout|System\.out/.test(t))  return isHinglish ? "Output — console par value print karta hai" : "Output — prints a value to the console"
  if (/\bimport\b|\binclude\b|#include|require/.test(t))   return isHinglish ? "Import — bahar ka module ya library laata hai" : "Import — loads an external module or library"
  if (/\blet\b|\bvar\b|\bconst\b|\bint\b|\bfloat\b|\bdouble\b|\bauto\b/.test(t)) return isHinglish ? "Variable — data save karne ke liye variable banata hai" : "Variable declaration — allocates named storage"
  if (/\bsort\b|\bsorted\b/i.test(t))                      return isHinglish ? "Sort — array ya list ko order mein karta hai" : "Sorting call — reorders the collection"
  if (/\bsearch\b|\bfind\b|\bindexOf\b|\bincludes\b/i.test(t)) return isHinglish ? "Search — element ko dhoondhta hai" : "Search call — looks for an element"
  if (/[+\-*/]=|[+]{2}|[-]{2}/.test(t))                   return isHinglish ? "Compound assignment — variable ko update karta hai" : "Compound assignment — modifies a variable in-place"
  if (/[=]/.test(t) && !/[=]{2}/.test(t))                  return isHinglish ? "Assignment — variable mein value store karta hai" : "Assignment — stores a value into a variable"
  if (/[()]{1}/.test(t))                                   return isHinglish ? "Function call — function ko chalata hai" : "Function call — invokes a function"
  return isHinglish ? "Statement — code ka ek step" : "Statement — executes an action"
}

export function estimateComplexity(constructs) {
  if (constructs.hasRecursion)
    return { time: "O(2ⁿ) worst case — exponential (recursive, no memoization)", space: "O(n) — call stack grows with depth", note: "Add memoization to reduce to O(n)." }
  if (constructs.hasSorting)
    return { time: "O(n log n) average — sorting detected", space: constructs.hasArray ? "O(n) — extra space (merge sort variants)" : "O(1) — in-place sort", note: "Merge sort is stable; quicksort is faster in practice." }
  if (constructs.hasSearching && !constructs.hasLoop)
    return { time: "O(log n) — binary search pattern detected", space: "O(1)", note: "" }
  if (constructs.loopCount > 1)
    return { time: `O(n²) — ${constructs.loopCount} loops (likely nested)`, space: constructs.hasArray ? "O(n)" : "O(1)", note: "Replace inner loop with a hash map for O(n)." }
  if (constructs.hasLoop)
    return { time: "O(n) — single linear loop", space: constructs.hasArray ? "O(n) — array grows with input" : "O(1)", note: "" }
  return { time: "O(1) — constant time, no loops", space: "O(1) — fixed memory", note: "" }
}

function buildOptimizationHints(constructs, language) {
  const hints = []
  if (constructs.loopCount > 1)
    hints.push("Replace the inner loop with a hash map/set to reduce O(n²) → O(n).")
  if (constructs.hasRecursion) {
    hints.push("Add memoization (cache results) to avoid redundant recursive calls.")
    hints.push("For deep recursion, use an iterative stack to prevent stack overflow.")
  }
  if (constructs.hasSorting) {
    const h = { javascript: "Use Array.prototype.sort(comparator) — built-in O(n log n).", python: "Use sorted() or list.sort() — Python's Timsort is highly optimized.", java: "Arrays.sort() / Collections.sort() use dual-pivot quicksort.", cpp: "std::sort() in <algorithm> uses introsort — very fast in practice." }[language]
    if (h) hints.push(h)
  }
  if (constructs.hasSearching && constructs.hasLoop)
    hints.push("If the data is sorted, switch to binary search O(log n) instead of O(n) linear.")
  if (constructs.hasArray && constructs.hasLoop) {
    const h = { javascript: "Use Array.map/filter/reduce instead of manual loops.", python: "List comprehensions are faster than explicit for-loops.", java: "Use Java Streams (stream().filter().map()) for functional processing.", cpp: "Use STL algorithms (std::transform, std::accumulate) over manual loops." }[language]
    if (h) hints.push(h)
  }
  if (constructs.hasStringOps && constructs.hasLoop) {
    const h = { javascript: "Build strings with array + .join('') instead of += in loops.", python: "Use ''.join(list) instead of string += in loops.", java: "Use StringBuilder.append() instead of String + in loops.", cpp: "Reserve capacity with reserve() before appending in a loop." }[language]
    if (h) hints.push(h)
  }
  return hints
}


// ── Language-specific tips ───────────────────────────────────

const LANGUAGE_TIPS = {
  javascript: [
    "Use const for values that don't change, let for mutable ones.",
    "Prefer === over == to avoid type coercion bugs.",
    "Arrow functions (=>) are shorthand for anonymous functions.",
    "Use Array.map(), .filter(), .reduce() instead of manual for-loops.",
    "Destructuring (const [a, b] = arr) makes array access cleaner.",
    "Optional chaining (?.) prevents null reference errors.",
  ],
  python: [
    "Python uses indentation (4 spaces) instead of braces.",
    "Use list comprehensions: [x*2 for x in lst] instead of a loop.",
    "f-strings (f\"Hello {name}\") are the modern way to format strings.",
    "Use enumerate() when you need both index and value in a loop.",
    "sorted() returns a new list; list.sort() sorts in-place.",
    "Use 'in' operator for membership tests instead of manual loops.",
  ],
  java: [
    "Java is statically typed — always declare variable types.",
    "Use enhanced for-each (for (int n : arr)) for cleaner iteration.",
    "Every program needs public static void main(String[] args).",
    "Use StringBuilder for string concatenation inside loops.",
    "Arrays.sort() sorts primitives; Collections.sort() sorts Lists.",
    "Use ArrayList<> instead of arrays when size is dynamic.",
  ],
  cpp: [
    "Include <iostream> for cout/cin and <vector> for dynamic arrays.",
    "Use '\\n' instead of endl — it's faster (no flush).",
    "Prefer range-based for (for (auto x : vec)) in modern C++.",
    "Use const references (const Type&) to avoid unnecessary copies.",
    "std::sort() in <algorithm> is O(n log n) and highly optimized.",
    "Use auto to let the compiler deduce types automatically.",
  ],
}

// ── Pattern-specific insight blocks ─────────────────────────

/**
 * Returns a plain-language 'beginner explanation' for detected patterns.
 * @param {object} constructs
 * @param {string} language
 * @returns {string[]}
 */
export function getPatternInsights(constructs, language) {
  const insights = []

  if (constructs.hasSorting) {
    insights.push("🔢 Sorting Detected: The code arranges elements in a specific order.")
    insights.push("   Sorting algorithms compare and swap elements until the sequence is ordered.")
    insights.push("   Common complexities: Bubble/Insertion Sort O(n²) · Merge/Quick Sort O(n log n).")
  }

  if (constructs.hasSearching) {
    insights.push("🔍 Searching Detected: The code looks for an element in a collection.")
    insights.push("   Linear search: checks every element → O(n).")
    insights.push("   Binary search: halves the range each step (requires sorted data) → O(log n).")
  }

  if (constructs.hasRecursion) {
    insights.push("🔁 Recursion Detected: A function calls itself to solve sub-problems.")
    insights.push("   Every recursive function needs a base case to stop infinite calls.")
    insights.push("   Watch for stack overflow with very deep recursion; consider memoization.")
  }

  if (constructs.hasMath) {
    insights.push("➕ Math Operations Detected: The code performs numeric computations.")
    insights.push("   For large numbers use BigInt (JS) / long (Java) / long long (C++).")
  }

  if (constructs.hasStringOps) {
    insights.push("🔤 String Operations Detected: The code manipulates text data.")
    const hint = {
      javascript: "Strings are immutable in JS — operations create new strings.",
      python:     "Python strings are immutable; use join() for efficient concatenation.",
      java:       "Use StringBuilder for repeated string modifications in loops.",
      cpp:        "std::string supports +, find(), substr() — include <string>.",
    }[language] ?? ""
    if (hint) insights.push(`   ${hint}`)
  }

  if (constructs.hasLoop && constructs.loopCount > 1) {
    insights.push(`🔄 Nested Loops (${constructs.loopCount} loops): Each added loop multiplies time complexity.`)
    insights.push("   Consider if the inner loop can be replaced by a hash map for O(n) lookup.")
  }

  if (constructs.hasCondition && constructs.hasLoop) {
    insights.push("⚡ Loop + Condition: Branching inside a loop is common for filtering and validation.")
  }

  return insights
}
