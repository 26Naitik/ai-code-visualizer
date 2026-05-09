// src/components/ErrorBoundary.jsx

import { Component } from "react"

import { Button } from "@/components/ui/button"

class ErrorBoundary extends Component {

  state = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error) {

    return {
      hasError: true,
      error,
    }
  }

  render() {

    if (this.state.hasError) {

      return (

        <div
          className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground"
          role="alert"
        >

          <h1 className="text-xl font-semibold tracking-tight">
            Something went wrong
          </h1>

          <p className="max-w-md text-sm text-muted-foreground">
            The app hit an unexpected error. You can try reloading the page.
          </p>

          {import.meta.env.DEV &&
          this.state.error ? (

            <pre className="max-h-40 max-w-full overflow-auto rounded-lg border border-border bg-muted/50 p-3 text-left text-xs text-muted-foreground">

              {this.state.error instanceof Error
                ? this.state.error.message
                : String(this.state.error)}

            </pre>

          ) : null}

          <Button
            type="button"
            onClick={() => window.location.reload()}
          >

            Reload page

          </Button>

        </div>

      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
