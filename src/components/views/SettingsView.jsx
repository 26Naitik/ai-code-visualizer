import { Settings, Moon, Sun, Languages } from "lucide-react"

export default function SettingsView({ theme, setTheme, explanationLang, setExplanationLang }) {
  return (
    <div className="h-full w-full overflow-y-auto p-6 lg:p-10">
      <div className="mb-8 flex items-center gap-3">
        <Settings className="size-8 text-orange-500" />
        <h1 className="text-2xl font-bold lg:text-3xl">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Theme Setting Removed (Forced Dark Mode) */}

        {/* Language Setting */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:border-primary/20 dark:shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Languages className="size-5 text-blue-500" />
              Explanation Language
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Choose the language used by the AI code visualizer.</p>
          </div>
          <div className="flex gap-2 bg-muted/50 p-1 rounded-xl border border-border">
            <button
              onClick={() => setExplanationLang("english")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${explanationLang === "english" ? "bg-background shadow-sm text-foreground border border-border" : "text-muted-foreground hover:text-foreground"}`}
            >
              English
            </button>
            <button
              onClick={() => setExplanationLang("hinglish")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${explanationLang === "hinglish" ? "bg-background shadow-sm text-foreground border border-border" : "text-muted-foreground hover:text-foreground"}`}
            >
              Hinglish 🇮🇳
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
