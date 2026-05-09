// src/components/PageLoader.jsx

function PageLoader({ label = "Loading" }) {

  return (

    <div
      className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background text-foreground"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >

      <div
        className="size-10 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
        aria-hidden
      />

      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <span className="sr-only">
        {label}
      </span>

    </div>

  )
}

export default PageLoader
