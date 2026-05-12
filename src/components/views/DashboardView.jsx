import { Trash2, FolderOpen, Code2 } from "lucide-react"

export default function DashboardView({ snippets, loadSnippet, deleteSnippet }) {
  if (!snippets || snippets.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
        <FolderOpen className="mb-4 size-12 text-muted-foreground opacity-50" />
        <h2 className="mb-2 text-xl font-bold">No Snippets Yet</h2>
        <p className="text-muted-foreground">
          Go back to the Editor, write some code, and click the Save icon in the sidebar to create snippets.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto p-6 lg:p-10">
      <h1 className="mb-6 text-2xl font-bold lg:text-3xl">Your Snippets Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {snippets.map((snippet) => (
          <div
            key={snippet.id}
            className="group relative flex h-64 flex-col rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/60 hover:shadow-primary/10 dark:shadow-black/20 dark:hover:shadow-primary/20"
          >
            <div className="flex items-start justify-between">
              <h3 className="line-clamp-1 flex-1 font-semibold" title={snippet.name}>
                {snippet.name}
              </h3>
              <button
                onClick={(e) => deleteSnippet(snippet.id, e)}
                className="ml-2 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                title="Delete Snippet"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(snippet.savedAt).toLocaleDateString()}
            </p>

            <div className="my-4 min-h-0 flex-1 rounded-xl border border-border/30 bg-black/5 dark:bg-black/20 p-3 text-xs opacity-90">
              <pre className="line-clamp-6 whitespace-pre-wrap break-all font-mono text-muted-foreground dark:text-emerald-100/70">
                {snippet.code}
              </pre>
            </div>

            <button
              onClick={() => loadSnippet(snippet)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <Code2 className="size-4" />
              Open in Editor
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
