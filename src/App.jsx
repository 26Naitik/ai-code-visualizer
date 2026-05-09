// src/App.jsx

import {
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
} from "react"

import { explainCode } from "./ai"

import toast, { Toaster } from "react-hot-toast"

import { motion, AnimatePresence } from "framer-motion"

import PageLoader from "@/components/PageLoader"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Sparkles,
  Code2,
  BrainCircuit,
  BarChart3,
  LayoutDashboard,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  BookmarkPlus,
  Trash2,
} from "lucide-react"

const Landing =
  lazy(() => import("./Landing.jsx"))

const Flowchart =
  lazy(() => import("./Flowchart.jsx"))

const MonacoEditor =
  lazy(() => import("@monaco-editor/react"))

const SNIPPETS_STORAGE_KEY =
  "savedSnippets"

function EditorLoading() {

  return (

    <div
      className="flex h-full min-h-[240px] flex-1 flex-col items-center justify-center gap-3 bg-muted/20"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >

      <div
        className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />

      <span className="text-xs text-muted-foreground">
        Loading editor…
      </span>

      <span className="sr-only">
        Loading code editor
      </span>

    </div>

  )
}

function FlowchartLoading() {

  return (

    <div
      className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-muted/30"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >

      <span className="text-sm text-muted-foreground">
        Loading diagram…
      </span>

    </div>

  )
}

function loadSnippetsFromStorage() {

  try {

    const raw =
      localStorage.getItem(
        SNIPPETS_STORAGE_KEY
      )

    if (!raw) return []

    const data =
      JSON.parse(raw)

    if (!Array.isArray(data)) return []

    return data.filter(
      (x) =>
        x &&
        typeof x.id === "string" &&
        typeof x.name === "string" &&
        typeof x.code === "string"
    )
  } catch {

    return []
  }
}

function readTheme() {

  if (typeof document === "undefined") {

    return "dark"
  }

  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light"
}

const DEFAULT_EDITOR_CODE =
`function hello() {
  console.log("Hello World")
}

hello()
`

function readSavedCodeFromStorage() {

  try {

    const saved =
      localStorage.getItem("savedCode")

    if (saved !== null) return saved
  } catch {

    /* unavailable */
  }

  return DEFAULT_EDITOR_CODE
}

function App() {

  const [appLaunched, setAppLaunched] =
    useState(false)

  const [language, setLanguage] =
    useState("javascript")

  const [code, setCode] = useState(
    readSavedCodeFromStorage
  )

  const skipInitialSaveRef = useRef(true)

  useEffect(() => {

    if (skipInitialSaveRef.current) {

      skipInitialSaveRef.current = false

      return
    }

    localStorage.setItem("savedCode", code)
  }, [code])

  const [mobileNavOpen, setMobileNavOpen] =
    useState(false)

  useEffect(() => {

    const mq =
      window.matchMedia("(min-width: 1024px)")

    function onChange() {

      if (mq.matches) {

        setMobileNavOpen(false)
      }
    }

    mq.addEventListener("change", onChange)

    return () =>
      mq.removeEventListener("change", onChange)
  }, [])

  const [theme, setTheme] =
    useState(readTheme)

  useEffect(() => {

    const root =
      document.documentElement

    if (theme === "dark") {

      root.classList.add("dark")
    } else {

      root.classList.remove("dark")
    }

    try {

      localStorage.setItem("theme", theme)
    } catch {

      /* private mode or quota */
    }
  }, [theme])

  const [snippets, setSnippets] =
    useState(loadSnippetsFromStorage)

  const [snippetNameDraft, setSnippetNameDraft] =
    useState("")

  useEffect(() => {

    try {

      localStorage.setItem(
        SNIPPETS_STORAGE_KEY,
        JSON.stringify(snippets)
      )
    } catch {

      /* private mode or quota */
    }
  }, [snippets])

  function saveCurrentSnippet() {

    const name =
      snippetNameDraft.trim()

    if (!name) {

      toast.error(
        "Enter a name for this snippet"
      )

      return
    }

    setSnippets((prev) => [
      {
        id: crypto.randomUUID(),
        name: name.slice(0, 96),
        code,
        savedAt: Date.now(),
      },
      ...prev,
    ])

    setSnippetNameDraft("")

    toast.success("Snippet saved")
  }

  function deleteSnippet(id, evt) {

    evt?.stopPropagation?.()

    setSnippets((prev) =>
      prev.filter((s) => s.id !== id)
    )

    toast.success("Snippet removed")
  }

  function loadSnippet(snippet) {

    setCode(snippet.code)

    setMobileNavOpen(false)

    toast.success(
      `Loaded "${snippet.name}"`
    )
  }

  const [explanation, setExplanation] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [flowchart, setFlowchart] =
    useState(`
flowchart TD
A[Start] --> B[Hello World]
B --> C[End]
`)

  async function handleExplain() {

    try {

      setLoading(true)

      const result =
        await explainCode(code)

      setExplanation(result)

      eval(code)

      if (
        code.includes("if")
      ) {

        setFlowchart(`
flowchart TD
A[Start]
--> B{Condition}
B -->|True| C[If Block]
B -->|False| D[Else Block]
C --> E[End]
D --> E
`)
      }

      else if (
        code.includes("for")
      ) {

        setFlowchart(`
flowchart TD
A[Start]
--> B[Initialize Loop]
B --> C{Condition}
C -->|True| D[Loop Body]
D --> B
C -->|False| E[End]
`)
      }

      else {

        setFlowchart(`
flowchart TD
A[Start]
--> B[Execute Function]
B --> C[Print Output]
C --> D[End]
`)
      }

      toast.success(
        "Code analyzed successfully 🚀"
      )

    } catch (error) {

      toast.error(
        "Execution Failed ❌ " +
          (error instanceof Error
            ? error.message
            : String(error))
      )

    } finally {

      setLoading(false)
    }
  }

  const handleExplainRef =
    useRef(handleExplain)

  const saveCurrentSnippetRef =
    useRef(saveCurrentSnippet)

  useEffect(() => {

    handleExplainRef.current =
      handleExplain

    saveCurrentSnippetRef.current =
      saveCurrentSnippet
  })

  useEffect(() => {

    if (!appLaunched) return

    function onKeyDown(e) {

      if (
        !e.ctrlKey ||
        e.altKey ||
        e.shiftKey
      ) {

        return
      }

      const key =
        e.key

      if (key === "Enter") {

        e.preventDefault()
        e.stopPropagation()

        if (loading) {

          toast(
            "Analysis already in progress",
            {
              icon: "⏳",
            }
          )

          return
        }

        toast.success(
          "Ctrl+Enter — Analyze code"
        )

        void handleExplainRef.current()

        return
      }

      if (
        key === "s" ||
        key === "S"
      ) {

        e.preventDefault()
        e.stopPropagation()

        toast.success(
          "Ctrl+S — Save snippet"
        )

        saveCurrentSnippetRef.current()

        return
      }
    }

    window.addEventListener(
      "keydown",
      onKeyDown,
      true
    )

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown,
        true
      )
  }, [loading, appLaunched])

  return (

    <>

      <Toaster position="top-right" />

      {!appLaunched ? (

        <Suspense
          fallback={
            <PageLoader label="Loading page" />
          }
        >

          <Landing
            onLaunch={() =>
              setAppLaunched(true)
            }
          />

        </Suspense>

      ) : (

    <div className="flex min-h-dvh h-dvh bg-background text-foreground transition-colors duration-300 ease-out lg:h-screen">

      {/* Mobile sidebar backdrop */}
      {mobileNavOpen ? (

        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-colors duration-300 dark:bg-black/60 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />

      ) : null}

      {/* Sidebar — icon rail + saved snippets; overlay on small screens */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-full min-h-0 w-[min(20rem,calc(100vw-0.5rem))] shrink-0 flex-row border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl transition-[transform,box-shadow] duration-200 ease-out lg:relative lg:z-auto lg:w-64 lg:shadow-none ${
          mobileNavOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* Icon rail */}
        <div className="flex w-[3.75rem] shrink-0 flex-col items-center gap-3 border-r border-sidebar-border py-3 sm:w-16 sm:gap-4 sm:py-4">

          <button
            type="button"
            className="flex rounded-xl p-2 text-muted-foreground transition-colors duration-300 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            aria-label="Close sidebar"
            onClick={() => setMobileNavOpen(false)}
          >

            <X className="size-5" />

          </button>

          <motion.div
            whileHover={{ scale: 1.1 }}
            className="rounded-2xl bg-blue-500/15 p-2 dark:bg-blue-500/20 sm:p-2.5"
            onClick={() => setMobileNavOpen(false)}
          >

            <Code2 className="size-5 text-blue-600 dark:text-blue-400" />

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer rounded-2xl p-2 transition-colors duration-300 hover:bg-sidebar-accent sm:p-2.5"
            onClick={() => setMobileNavOpen(false)}
          >

            <LayoutDashboard className="size-5" />

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer rounded-2xl p-2 transition-colors duration-300 hover:bg-sidebar-accent sm:p-2.5"
            onClick={() => setMobileNavOpen(false)}
          >

            <BrainCircuit className="size-5" />

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer rounded-2xl p-2 transition-colors duration-300 hover:bg-sidebar-accent sm:p-2.5"
            onClick={() => setMobileNavOpen(false)}
          >

            <BarChart3 className="size-5" />

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer rounded-2xl p-2 transition-colors duration-300 hover:bg-sidebar-accent sm:p-2.5"
            onClick={() => setMobileNavOpen(false)}
          >

            <Settings className="size-5" />

          </motion.div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="mt-auto flex size-9 items-center justify-center rounded-xl border border-sidebar-border bg-sidebar-accent/60 text-sidebar-foreground shadow-sm backdrop-blur-sm transition-colors duration-300 hover:bg-sidebar-accent sm:size-10"
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            onClick={() => {

              setTheme((t) =>
                t === "dark" ? "light" : "dark"
              )
              setMobileNavOpen(false)
            }}
          >

            <AnimatePresence mode="wait" initial={false}>

              {theme === "dark" ? (

                <motion.span
                  key="sun"
                  className="flex"
                  initial={{
                    opacity: 0,
                    rotate: -56,
                    scale: 0.65,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: 56,
                    scale: 0.65,
                  }}
                  transition={{
                    duration: 0.22,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >

                  <Sun className="size-[1.15rem] text-amber-400" />

                </motion.span>

              ) : (

                <motion.span
                  key="moon"
                  className="flex"
                  initial={{
                    opacity: 0,
                    rotate: 56,
                    scale: 0.65,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: -56,
                    scale: 0.65,
                  }}
                  transition={{
                    duration: 0.22,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >

                  <Moon className="size-[1.15rem] text-slate-600 dark:text-slate-300" />

                </motion.span>

              )}

            </AnimatePresence>

          </motion.button>

        </div>

        {/* Saved Snippets */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 bg-sidebar/95 p-2 sm:gap-2.5 sm:p-3">

          <div className="shrink-0 space-y-2">

            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Saved Snippets
            </p>

            <div className="flex gap-1.5">

              <input
                type="text"
                value={snippetNameDraft}
                onChange={(e) =>
                  setSnippetNameDraft(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (e.key === "Enter") {

                    saveCurrentSnippet()
                  }
                }}
                placeholder="Name…"
                className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background/90 px-2.5 text-xs text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label="Snippet name"
              />

              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-9 w-9 shrink-0 rounded-lg border border-border"
                onClick={saveCurrentSnippet}
                aria-label="Save current code as snippet"
              >

                <BookmarkPlus className="size-4" />

              </Button>

            </div>

          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

            {snippets.length === 0 ? (

              <p className="px-1 py-6 text-center text-[11px] leading-relaxed text-muted-foreground">
                No snippets yet. Enter a name and tap save to store your
                editor code.
              </p>

            ) : (

              <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-y-contain pr-0.5 [scrollbar-gutter:stable]">

                {snippets.map((snippet) => (

                  <li key={snippet.id}>

                    <div className="group flex w-full items-stretch gap-0.5 rounded-lg border border-transparent transition-colors hover:border-border hover:bg-sidebar-accent/80">

                      <button
                        type="button"
                        className="min-w-0 flex-1 truncate rounded-l-lg px-2 py-2 text-left text-xs font-medium text-sidebar-foreground transition-colors hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        onClick={() =>
                          loadSnippet(snippet)
                        }
                      >

                        {snippet.name}

                      </button>

                      <button
                        type="button"
                        className="flex size-8 shrink-0 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label={`Delete ${snippet.name}`}
                        onClick={(e) =>
                          deleteSnippet(
                            snippet.id,
                            e
                          )
                        }
                      >

                        <Trash2 className="size-3.5" />

                      </button>

                    </div>

                  </li>

                ))}

              </ul>

            )}

          </div>

        </div>

      </div>

      {/* Main App */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">

        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[200] -translate-y-[220%] rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-0 shadow-lg transition-all focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring motion-reduce:transition-none"
        >

          Skip to main content

        </a>

        {/* Navbar */}
        <div className="flex min-h-14 flex-shrink-0 flex-col gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl transition-colors duration-300 sm:min-h-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:h-16 lg:py-0">

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">

            <button
              type="button"
              className="flex shrink-0 rounded-xl p-2 text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-accent-foreground lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(true)}
            >

              <Menu className="size-6" />

            </button>

            <div className="min-w-0">

              <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
                AI Code Visualizer
              </h1>

              <p className="text-[11px] leading-snug text-muted-foreground sm:text-xs">
                Visualize, execute and understand code
              </p>

            </div>

          </div>

          <Select
            value={language}
            onValueChange={setLanguage}
          >

            <SelectTrigger
              aria-label="Programming language for the editor"
              className="w-full border-border bg-card transition-colors duration-300 sm:w-[180px] sm:max-w-[180px]"
            >

              <SelectValue />

            </SelectTrigger>

            <SelectContent>

              <SelectItem value="javascript">
                JavaScript
              </SelectItem>

              <SelectItem value="cpp">
                C++
              </SelectItem>

              <SelectItem value="java">
                Java
              </SelectItem>

              <SelectItem value="python">
                Python
              </SelectItem>

            </SelectContent>

          </Select>

        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden lg:flex-row lg:overflow-hidden">

          {/* Editor */}
          <div
            className="flex h-[min(42vh,22rem)] min-h-[240px] w-full shrink-0 flex-col border-b border-border transition-colors duration-300 sm:h-[min(45vh,26rem)] sm:min-h-[280px] lg:h-full lg:min-h-0 lg:w-1/2 lg:flex-1 lg:border-b-0 lg:border-r"
            aria-label="Code editor panel"
          >

            <Suspense fallback={<EditorLoading />}>

              <MonacoEditor
                height="100%"
                language={language}
                value={code}
                loading={<EditorLoading />}
                onChange={(value) =>
                  setCode(value ?? "")
                }
                theme={
                  theme === "dark"
                    ? "vs-dark"
                    : "light"
                }
              />

            </Suspense>

          </div>

          {/* Right Panel */}
          <main
            id="main-content"
            tabIndex={-1}
            className="w-full flex-1 overflow-y-auto p-4 outline-none sm:p-5 lg:w-1/2 lg:p-6"
          >

            {/* Hero */}
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              className="mb-4 rounded-2xl border border-border bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 transition-colors duration-300 dark:from-blue-500/20 dark:to-purple-500/20 sm:mb-6 sm:rounded-3xl sm:p-5 lg:p-6"
            >

              <h2 className="mb-2 text-xl font-bold leading-tight sm:mb-3 sm:text-2xl lg:text-3xl">
                🚀 Understand Your Code Visually
              </h2>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">

                AI-powered code explanation,
                flowcharts, execution timeline,
                variable tracking and complexity analysis.

              </p>

            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="explanation">

              <TabsList className="h-auto max-sm:grid max-sm:w-full max-sm:grid-cols-2 max-sm:gap-1 border border-border bg-muted/80 p-1 transition-colors duration-300 dark:bg-muted/50">

                <TabsTrigger
                  value="explanation"
                  className="min-h-10 flex-1 gap-1.5 px-2 text-xs sm:min-h-9 sm:flex-none sm:px-3 sm:text-sm"
                >

                  <BrainCircuit className="size-4 shrink-0" />

                  <span className="truncate">
                    Explanation
                  </span>

                </TabsTrigger>

                <TabsTrigger
                  value="flowchart"
                  className="min-h-10 flex-1 gap-1.5 px-2 text-xs sm:min-h-9 sm:flex-none sm:px-3 sm:text-sm"
                >

                  <Sparkles className="size-4 shrink-0" />

                  <span className="truncate">
                    Flowchart
                  </span>

                </TabsTrigger>

              </TabsList>

              {/* Explanation */}
              <TabsContent value="explanation">

                <div
                  className="mt-3 min-h-[200px] whitespace-pre-wrap rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed transition-colors duration-300 dark:bg-white/5 sm:mt-4 sm:min-h-[250px] sm:rounded-2xl sm:p-5 sm:text-base"
                  role="status"
                  aria-live="polite"
                  aria-busy={loading}
                >

                  {
                    loading
                      ? "⏳ AI is thinking..."
                      : explanation ||
                        "🚀 AI explanation will appear here."
                  }

                </div>

              </TabsContent>

              {/* Flowchart */}
              <TabsContent value="flowchart">

                <div className="mt-3 min-h-[200px] rounded-xl border border-border bg-muted/40 p-4 transition-colors duration-300 dark:bg-white/5 sm:mt-4 sm:min-h-[250px] sm:rounded-2xl sm:p-5">

                  <Suspense fallback={<FlowchartLoading />}>

                    <Flowchart
                      chart={flowchart}
                      theme={theme}
                    />

                  </Suspense>

                </div>

              </TabsContent>

            </Tabs>

            {/* Analyze Button */}
            <Button
              onClick={handleExplain}
              disabled={loading}
              aria-busy={loading}
              aria-label={
                loading
                  ? "Analyzing code, please wait"
                  : "Analyze code with AI"
              }
              className="mt-4 h-11 w-full rounded-xl text-base sm:mt-6 sm:h-12 sm:text-lg"
            >

              {loading ? "Analyzing…" : "Analyze Code 🚀"}

            </Button>

          </main>

        </div>

      </div>

    </div>

      )}

    </>
  )
}

export default App