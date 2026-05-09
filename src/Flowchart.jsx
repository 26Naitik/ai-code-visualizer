// src/Flowchart.jsx

import { useEffect, useRef, useState } from "react"

import mermaid from "mermaid"

function Flowchart({ chart, theme = "dark" }) {

  const ref = useRef(null)

  const [rendering, setRendering] =
    useState(true)

  useEffect(() => {

    mermaid.initialize({
      startOnLoad: false,
      theme: theme === "dark" ? "dark" : "default",
      securityLevel: "loose",
    })
  }, [theme])

  useEffect(() => {

    let cancelled = false

    async function renderChart() {

      if (!ref.current) return

      setRendering(true)

      try {

        ref.current.innerHTML = ""

        const id =
          "mermaid-" + Date.now()

        const { svg } =
          await mermaid.render(
            id,
            chart
          )

        if (!cancelled && ref.current) {

          ref.current.innerHTML = svg
        }

      } catch (err) {

        console.error(
          "Mermaid Error:",
          err
        )
      } finally {

        if (!cancelled) {

          setRendering(false)
        }
      }
    }

    renderChart()

    return () => {

      cancelled = true
    }
  }, [chart, theme])

  return (

    <div
      className="overflow-auto rounded-2xl border border-border bg-muted/50 p-4 transition-colors duration-300 dark:bg-card/60"
      role="region"
      aria-label="Flowchart diagram"
      aria-busy={rendering}
      aria-live="polite"
    >

      {rendering ? (

        <p className="py-8 text-center text-sm text-muted-foreground">
          Rendering diagram…
        </p>

      ) : null}

      <div
        ref={ref}
        className={rendering ? "sr-only" : ""}
        aria-hidden={rendering}
      />

    </div>

  )
}

export default Flowchart
