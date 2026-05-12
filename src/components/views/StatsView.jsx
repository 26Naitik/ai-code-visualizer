import { detectConstructs, estimateComplexity } from "../../utils/codeAnalyzer"
import { BarChart3, Clock, Database, Braces, Binary, Activity } from "lucide-react"

export default function StatsView({ code }) {
  if (!code || !code.trim()) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
        <Activity className="mb-4 size-12 text-muted-foreground opacity-50" />
        <h2 className="mb-2 text-xl font-bold">No Code to Analyze</h2>
        <p className="text-muted-foreground">
          Go back to the Editor and write some code to see insights.
        </p>
      </div>
    )
  }

  const constructs = detectConstructs(code)
  const complexity = estimateComplexity(constructs)

  const metrics = [
    { label: "Lines of Code", value: code.split("\n").filter(l => l.trim()).length, icon: Braces, color: "text-blue-500" },
    { label: "Loops Found", value: constructs.loopCount, icon: Activity, color: "text-amber-500" },
    { label: "Max Nesting Depth", value: constructs.nestingDepth, icon: Binary, color: "text-purple-500" },
  ]

  return (
    <div className="h-full w-full overflow-y-auto p-6 lg:p-10">
      <div className="mb-8 flex items-center gap-3">
        <BarChart3 className="size-8 text-green-500" />
        <h1 className="text-2xl font-bold lg:text-3xl">Code Insights</h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((m, i) => (
          <div key={i} className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-primary/10 dark:shadow-black/20 dark:hover:shadow-primary/20">
            <m.icon className={`mb-3 size-8 ${m.color} opacity-80`} />
            <span className="text-3xl font-bold">{m.value}</span>
            <span className="mt-1 text-sm text-muted-foreground uppercase tracking-wider font-semibold">{m.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:border-primary/20 dark:shadow-black/20">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
            <Clock className="size-5 text-orange-500" />
            <h2 className="text-lg font-semibold">Time Complexity</h2>
          </div>
          <p className="font-mono text-xl font-bold text-orange-400 mb-2">{complexity.time.split("—")[0]}</p>
          <p className="text-muted-foreground">{complexity.time.split("—")[1]}</p>
          {complexity.note && <p className="mt-4 text-sm text-amber-500/80 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">{complexity.note}</p>}
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:border-primary/20 dark:shadow-black/20">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
            <Database className="size-5 text-indigo-500" />
            <h2 className="text-lg font-semibold">Space Complexity</h2>
          </div>
          <p className="font-mono text-xl font-bold text-indigo-400 mb-2">{complexity.space.split("—")[0]}</p>
          <p className="text-muted-foreground">{complexity.space.split("—")[1]}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:border-primary/20 dark:shadow-black/20">
        <h2 className="mb-4 text-lg font-semibold border-b border-border pb-4">Detected Features</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <FeatureItem label="Functions" active={constructs.hasFunction} />
          <FeatureItem label="Conditionals" active={constructs.hasCondition} />
          <FeatureItem label="Arrays/Lists" active={constructs.hasArray} />
          <FeatureItem label="Recursion" active={constructs.hasRecursion} />
          <FeatureItem label="Sorting" active={constructs.hasSorting} />
          <FeatureItem label="Searching" active={constructs.hasSearching} />
          <FeatureItem label="Math Ops" active={constructs.hasMath} />
          <FeatureItem label="Classes" active={constructs.hasClass} />
        </ul>
      </div>
    </div>
  )
}

function FeatureItem({ label, active }) {
  return (
    <li className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium ${active ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400" : "border-border bg-muted/30 text-muted-foreground opacity-50"}`}>
      {active ? "✅" : "❌"} {label}
    </li>
  )
}
