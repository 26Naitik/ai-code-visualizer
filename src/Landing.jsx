// src/Landing.jsx

import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

import {
  Sparkles,
  BrainCircuit,
  Workflow,
  Zap,
  ArrowRight,
  Code2,
  Shield,
} from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

const heroContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const features = [
  {
    icon: BrainCircuit,
    title: "AI explanations",
    description:
      "Clear, structured breakdowns of what your code does—powered by modern models.",
  },
  {
    icon: Workflow,
    title: "Live flowcharts",
    description:
      "Mermaid diagrams that update with your logic so branches and loops stay visible.",
  },
  {
    icon: Zap,
    title: "Run & inspect",
    description:
      "Execute snippets safely, capture console output, and iterate without leaving the app.",
  },
  {
    icon: Code2,
    title: "Snippets & sync",
    description:
      "Save named snippets locally, sync editor state, and jump back with one click.",
  },
]

function Landing({ onLaunch }) {

  return (

    <div className="relative min-h-dvh overflow-x-hidden bg-background text-foreground">

      {/* Animated gradient orbs */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >

        <motion.div
          className="absolute -left-1/4 -top-1/4 h-[min(90vw,42rem)] w-[min(90vw,42rem)] rounded-full bg-blue-500/25 blur-[100px] dark:bg-blue-500/20"
          animate={{
            x: [0, 40, 0],
            y: [0, 24, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -right-1/4 top-1/3 h-[min(85vw,38rem)] w-[min(85vw,38rem)] rounded-full bg-violet-500/20 blur-[110px] dark:bg-violet-500/15"
          animate={{
            x: [0, -36, 0],
            y: [0, 40, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <motion.div
          className="absolute bottom-0 left-1/3 h-[min(70vw,28rem)] w-[min(70vw,28rem)] rounded-full bg-cyan-500/15 blur-[90px] dark:bg-cyan-400/10"
          animate={{
            x: [0, 28, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.18),transparent)]" />

      </div>

      <div className="relative z-10">

        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[200] -translate-y-[220%] rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-0 shadow-lg transition-all focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring motion-reduce:transition-none"
        >

          Skip to main content

        </a>

        {/* Nav */}
        <motion.header
          className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >

          <div className="flex items-center gap-2">

            <div className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-background/40 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:shadow-primary/10">

              <Sparkles className="size-4 text-blue-500 dark:text-blue-400" />

            </div>

            <span className="text-sm font-semibold tracking-tight sm:text-base">
              AI Code Visualizer
            </span>

          </div>

          <div className="flex items-center gap-1 rounded-full border border-border/50 bg-background/35 px-1 py-1 backdrop-blur-xl dark:bg-white/[0.04]">

            <Shield className="mx-2 size-3.5 text-muted-foreground" />

            <span className="pr-3 text-[11px] font-medium text-muted-foreground sm:text-xs">
              Local-first workspace
            </span>

          </div>

        </motion.header>

        {/* Hero */}
        <section
          id="main-content"
          tabIndex={-1}
          className="mx-auto max-w-6xl px-4 pb-16 pt-6 outline-none sm:px-6 sm:pb-20 sm:pt-10 lg:px-8"
        >

          <motion.div
            className="mx-auto max-w-3xl text-center"
            variants={heroContainer}
            initial="initial"
            animate="animate"
          >

            <motion.div variants={fadeUp} transition={{ duration: 0.55 }}>

              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-md dark:bg-white/[0.06] sm:text-xs">

                <span className="relative flex size-2">

                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70 opacity-75" />

                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />

                </span>

                New · Visual dev toolkit

              </span>

            </motion.div>

            <motion.h1
              className="mt-6 text-balance text-3xl font-bold tracking-tight sm:text-5xl sm:leading-[1.1] lg:text-6xl"
              variants={fadeUp}
              transition={{ duration: 0.55 }}
            >

              Understand code{" "}

              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-violet-400 dark:to-cyan-400">

                at a glance

              </span>

            </motion.h1>

            <motion.p
              className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg"
              variants={fadeUp}
              transition={{ duration: 0.55 }}
            >

              A focused workspace for explaining, diagramming, and running code—with
              glassmorphic panels, saved snippets, and a dashboard built for daily
              use.

            </motion.p>

            <motion.div
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
              variants={fadeUp}
              transition={{ duration: 0.55 }}
            >

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >

                <Button
                  size="lg"
                  className="h-12 rounded-xl px-8 text-base shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-primary/40 dark:shadow-primary/20 dark:hover:shadow-primary/50"
                  aria-label="Launch app and open the code workspace"
                  onClick={onLaunch}
                >

                  Launch App

                  <ArrowRight className="ml-2 size-4" />

                </Button>

              </motion.div>

              <p className="text-xs text-muted-foreground sm:text-sm">
                No signup · Runs in your browser
              </p>

            </motion.div>

          </motion.div>

          {/* Hero glass panel */}
          <motion.div
            className="mx-auto mt-14 max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.25,
              ease: [0.4, 0, 0.2, 1],
            }}
          >

            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-background/80 via-background/40 to-background/20 p-px shadow-2xl shadow-black/10 backdrop-blur-2xl transition-all duration-500 hover:shadow-primary/10 dark:from-white/[0.1] dark:via-white/[0.05] dark:to-transparent dark:shadow-black/60 hover:dark:shadow-primary/20">

              <div className="rounded-[15px] bg-background/20 p-6 dark:bg-black/20 sm:p-8">

                <div className="flex flex-wrap items-center gap-2 text-left text-xs text-muted-foreground">

                  <Code2 className="size-4 text-blue-500" />

                  <span className="font-mono text-[11px] sm:text-xs">
                    dashboard.tsx
                  </span>

                  <span className="ml-auto rounded-md bg-muted/80 px-2 py-0.5 text-[10px] dark:bg-white/10">
                    preview
                  </span>

                </div>

                <pre className="mt-4 overflow-x-auto rounded-xl border border-border/40 bg-black/5 p-4 text-left text-[11px] leading-relaxed text-foreground/90 dark:bg-black/40 dark:text-emerald-100/90 sm:text-sm">

                  <code>{`// Your AI Code Visualizer workspace
analyze(code);
renderFlowchart(mermaid);
saveSnippet("my-lib", editor.getValue());`}</code>

                </pre>

              </div>

            </div>

          </motion.div>

        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28"
        >

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">

              Everything you need to ship clarity

            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">

              Built for engineers who want fast feedback loops without switching
              tools.

            </p>

          </motion.div>

          <motion.ul
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              animate: {
                transition: { staggerChildren: 0.08 },
              },
            }}
          >

            {features.map((f) => (

              <motion.li
                key={f.title}
                variants={{
                  initial: { opacity: 0, y: 22 },
                  animate: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              >

                <motion.div
                  className="group h-full rounded-2xl border border-border/50 bg-background/45 p-5 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/[0.02] dark:shadow-black/40 hover:dark:shadow-primary/10 hover:dark:border-primary/30"
                  whileHover={{
                    y: -6,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  }}
                >

                  <div className="flex size-10 items-center justify-center rounded-xl border border-border/40 bg-gradient-to-br from-blue-500/15 to-violet-500/10 dark:from-blue-500/20 dark:to-violet-500/10">

                    <f.icon className="size-5 text-blue-600 dark:text-blue-400" />

                  </div>

                  <h3 className="mt-4 font-semibold tracking-tight">
                    {f.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>

                </motion.div>

              </motion.li>

            ))}

          </motion.ul>

        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">

          <motion.div
            className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-cyan-500/10 p-8 text-center backdrop-blur-2xl dark:from-blue-500/15 dark:via-violet-500/10 dark:to-cyan-500/10 sm:p-12"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >

            <motion.div
              className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-blue-400/30 blur-3xl dark:bg-blue-500/20"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-500/15"
              animate={{ opacity: [0.4, 0.75, 0.4] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />

            <div className="relative z-10">

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">

                Ready to open the workspace?

              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">

                Jump into the full dashboard with editor, analysis, and flowcharts.

              </p>

              <motion.div
                className="mt-8"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >

                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 rounded-xl border border-border/60 bg-background/70 px-10 text-base backdrop-blur-md dark:bg-white/10"
                  aria-label="Launch app and open the code workspace"
                  onClick={onLaunch}
                >

                  Launch App

                  <ArrowRight className="ml-2 size-4" />

                </Button>

              </motion.div>

            </div>

          </motion.div>

        </section>

        <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground">

          AI Code Visualizer · Built for clarity

        </footer>

      </div>

    </div>

  )
}

export default Landing
