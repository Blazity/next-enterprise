"use client"

import { useEffect, useRef, useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChartType = any

export default function Web() {
  const [activeTier, setActiveTierState] = useState<"customer" | "partner">("customer")
  const [activeMode, setActiveModeState] = useState<"marketplace" | "terminal">("marketplace")
  const chartsRef = useRef<Record<string, ChartType>>({})

  useEffect(() => {
    // Initialize Lucide icons
    if (typeof window !== "undefined" && (window as Window & { lucide?: ChartType }).lucide) {
      ;(window as Window & { lucide?: ChartType }).lucide.createIcons()
    }

    // Initialize charts
    initCharts()

    // Start terminal log loop
    const logInterval = setInterval(() => {
      if (activeTier === "partner" && activeMode === "terminal") {
        const partnerLogs = [
          "INBOUND: Webhook /shopify/order_fulfillment",
          "API_SPLIT: Calculated $0.35 margin for User_882",
          "GCP_BUCKET: Streaming payload to pnw-analytics-raw",
          "OR_TOOLS: Optimization solve completed in 42ms",
          "GODADDY_API: Hosting node provisioned successfully",
          "MANAGEMENT: Automated email delivery sent to client",
          "CREDIT: Affiliate bonus applied to account balance",
        ]
        const log = partnerLogs[Math.floor(Math.random() * partnerLogs.length)]
        if (log) addLog(log)
      }
    }, 4000)

    return () => clearInterval(logInterval)
  }, [activeTier, activeMode])

  const addLog = (msg: string) => {
    const terminal = document.getElementById("log-terminal")
    if (terminal) {
      const div = document.createElement("div")
      const timeSpan = document.createElement("span")
      timeSpan.className = "opacity-50"
      timeSpan.textContent = `[${new Date().toLocaleTimeString()}]`
      
      div.appendChild(timeSpan)
      div.appendChild(document.createTextNode(` > ${msg}`))
      terminal.appendChild(div)
      terminal.scrollTop = terminal.scrollHeight
    }
  }

  const initCharts = () => {
    if (typeof window === "undefined" || !(window as Window & { Chart?: ChartType }).Chart) return

    const Chart = (window as Window & { Chart?: ChartType }).Chart
    Chart.defaults.font.family = "'Inter', sans-serif"
    Chart.defaults.color = "#94a3b8"

    // Discovery Chart
    const discoveryCtx = document.getElementById("discoveryChart") as HTMLCanvasElement
    if (discoveryCtx) {
      if (chartsRef.current.discovery) chartsRef.current.discovery.destroy()
      chartsRef.current.discovery = new Chart(discoveryCtx.getContext("2d"), {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Projected Monthly Revenue ($)",
              data: [1200, 3500, 8400, 14200, 22500, 31000],
              borderColor: "#4f46e5",
              backgroundColor: "rgba(79, 70, 229, 0.05)",
              fill: true,
              tension: 0.4,
              borderWidth: 4,
              pointRadius: 0,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { display: false },
            x: { grid: { display: false }, ticks: { font: { weight: "bold" } } },
          },
        },
      })
    }

    // Partner Split Chart
    if (activeTier === "partner") {
      const splitCtx = document.getElementById("splitChart") as HTMLCanvasElement
      if (splitCtx) {
        if (chartsRef.current.split) chartsRef.current.split.destroy()
        chartsRef.current.split = new Chart(splitCtx.getContext("2d"), {
          type: "doughnut",
          data: {
            labels: ["Provider", "Infrastructure", "1C Bonus"],
            datasets: [
              {
                data: [10, 5, 35],
                backgroundColor: ["#cbd5e1", "#94a3b8", "#4f46e5"],
                borderWidth: 0,
                cutout: "75%",
              },
            ],
          },
          options: { maintainAspectRatio: false, plugins: { legend: { display: false } } },
        })
      }

      // Oracle Chart
      const oracleCtx = document.getElementById("oracleChart") as HTMLCanvasElement
      if (oracleCtx) {
        if (chartsRef.current.oracle) chartsRef.current.oracle.destroy()
        chartsRef.current.oracle = new Chart(oracleCtx.getContext("2d"), {
          type: "bar",
          data: {
            labels: ["SKU-1", "SKU-2", "SKU-3", "SKU-4"],
            datasets: [{ data: [85, 92, 74, 98], backgroundColor: "#4f46e5", borderRadius: 8 }],
          },
          options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { max: 100 }, x: { grid: { display: false } } },
          },
        })
      }

      // Router Chart
      const routerCtx = document.getElementById("routerChart") as HTMLCanvasElement
      if (routerCtx) {
        if (chartsRef.current.router) chartsRef.current.router.destroy()
        chartsRef.current.router = new Chart(routerCtx.getContext("2d"), {
          type: "bar",
          data: {
            labels: ["Route-1", "Route-2", "Route-3", "Route-4"],
            datasets: [{ data: [78, 95, 88, 91], backgroundColor: "#4f46e5", borderRadius: 8 }],
          },
          options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { max: 100 }, x: { grid: { display: false } } },
          },
        })
      }
    }
  }

  const setTier = (tier: "customer" | "partner") => {
    setActiveTierState(tier)
    setTimeout(() => {
      if (typeof window !== "undefined" && (window as Window & { lucide?: ChartType }).lucide) {
        ;(window as Window & { lucide?: ChartType }).lucide.createIcons()
      }
      initCharts()
    }, 100)
  }

  const switchMode = (mode: "marketplace" | "terminal") => {
    setActiveModeState(mode)
    setTimeout(() => {
      if (typeof window !== "undefined" && (window as Window & { lucide?: ChartType }).lucide) {
        ;(window as Window & { lucide?: ChartType }).lucide.createIcons()
      }
      initCharts()
    }, 100)
  }

  const provisionService = (name: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const btn = event.currentTarget
    const originalText = btn.innerText
    btn.innerText = "Processing..."
    btn.disabled = true

    setTimeout(() => {
      btn.innerText = "API Success"
      btn.className = btn.className.replace("bg-indigo-600", "bg-emerald-600")

      if (activeTier === "partner") {
        addLog(`MANUAL_TRIGGER: Provisioned ${name}`)
        addLog(`API_SPLIT: Distribution confirmed via 1C-Splitter`)
      }

      setTimeout(() => {
        btn.innerText = originalText
        btn.className = btn.className.replace("bg-emerald-600", "bg-indigo-600")
        btn.disabled = false
      }, 2000)
    }, 1500)
  }

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap");

        :root {
          --slate-50: #f8fafc;
          --slate-100: #f1f5f9;
          --slate-900: #0f172a;
          --indigo-600: #4f46e5;
          --emerald-600: #059669;
        }

        body {
          font-family: "Inter", sans-serif;
          background-color: var(--slate-50);
          color: var(--slate-900);
          transition: all 0.4s ease;
        }

        .font-mono-data {
          font-family: "JetBrains Mono", monospace;
        }

        .card-enterprise {
          background: #ffffff;
          border-radius: 1.25rem;
          border: 1px solid #e2e8f0;
          padding: 2rem;
          box-shadow:
            0 1px 3px 0 rgb(0 0 0 / 0.1),
            0 1px 2px -1px rgb(0 0 0 / 0.1);
        }

        .btn-primary {
          background-color: var(--indigo-600);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.2s;
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);
        }

        .btn-primary:hover {
          background-color: #4338ca;
          transform: translateY(-1px);
        }

        .tier-locked {
          filter: blur(5px);
          pointer-events: none;
          opacity: 0.4;
          user-select: none;
        }

        .worked-terminal {
          background-color: #020617;
          color: #38bdf8;
          font-family: "JetBrains Mono", monospace;
          padding: 1.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          height: 400px;
          overflow-y: auto;
        }

        .chart-container {
          position: relative;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          height: 300px;
        }

        .nav-active {
          color: var(--indigo-600);
          border-bottom: 2px solid var(--indigo-600);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>

      {/* GLOBAL HUD */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic text-xl">
                1C
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-extrabold tracking-tighter">Enterprise Terminal</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Unified API Infrastructure
                </p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => switchMode("marketplace")}
                className={
                  activeMode === "marketplace"
                    ? "text-sm font-bold nav-active py-2"
                    : "text-sm font-bold text-slate-400 hover:text-slate-900 py-2"
                }
              >
                Service Marketplace
              </button>
              <button
                onClick={() => switchMode("terminal")}
                className={
                  activeMode === "terminal"
                    ? "text-sm font-bold nav-active py-2"
                    : "text-sm font-bold text-slate-400 hover:text-slate-900 py-2"
                }
              >
                Partner Command
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setTier("customer")}
                className={
                  activeTier === "customer"
                    ? "px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white shadow-sm"
                    : "px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500"
                }
              >
                Customer View
              </button>
              <button
                onClick={() => setTier("partner")}
                className={
                  activeTier === "partner"
                    ? "px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white shadow-sm"
                    : "px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-500"
                }
              >
                Partner View
              </button>
            </div>

            <div className="h-8 w-px bg-slate-200"></div>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono-data">
                GCP: Synchronized
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-12">
        {/* SECTION: SERVICE MARKETPLACE */}
        <section className={activeMode === "marketplace" ? "space-y-10 animate-fade-in" : "hidden"}>
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Enterprise Starter Bundles</h2>
            <p className="text-lg text-slate-500 mt-2">
              Professional Shopify and GoDaddy white-label instances managed by the 1C Unified API. Launch your
              business instantly with zero account setup friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product: Shopify */}
            <div className="card-enterprise flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                  <i data-lucide="shopping-bag" className="w-6 h-6"></i>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                  Shopify Native
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Digital Retail Engine</h3>
              <p className="text-sm text-slate-500 mt-2 flex-1">
                Pre-built, management-ready Shopify store. Fully optimized for 1C automated fulfillment.
              </p>

              <div className="mt-6 p-4 bg-slate-50 rounded-xl space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Configuration</label>
                  <select className="bg-transparent text-sm font-bold focus:outline-none">
                    <option>Build Only ($0 Setup)</option>
                    <option>Build & Managed (+$29/mo)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">
                  $0<span className="text-xs text-slate-400 font-normal ml-1">/ Start</span>
                </span>
                <button onClick={(e) => provisionService("Shopify Instance", e)} className="btn-primary">
                  Provision
                </button>
              </div>
            </div>

            {/* Product: GoDaddy */}
            <div className="card-enterprise flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <i data-lucide="server" className="w-6 h-6"></i>
                </div>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                  GoDaddy Cloud
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Managed Business Hosting</h3>
              <p className="text-sm text-slate-500 mt-2 flex-1">
                High-performance hosting nodes provisioned via 1C white-label API. Zero hosting account needed.
              </p>

              <div className="mt-6 p-4 bg-slate-50 rounded-xl space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Automation Tier</label>
                  <select className="bg-transparent text-sm font-bold focus:outline-none">
                    <option>Standard ($12.99/mo)</option>
                    <option>Ultra-Managed ($19.99/mo)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">
                  $12.99<span className="text-xs text-slate-400 font-normal ml-1">/ mo</span>
                </span>
                <button onClick={(e) => provisionService("GoDaddy Hosting", e)} className="btn-primary">
                  Provision
                </button>
              </div>
            </div>

            {/* Product: Custom API */}
            <div className="card-enterprise bg-slate-900 text-white border-none flex flex-col relative overflow-hidden">
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-sm">
                  <i data-lucide="terminal" className="w-6 h-6"></i>
                </div>
                <h3 className="text-xl font-bold">Unified API Access</h3>
                <p className="text-sm text-slate-400 mt-2 flex-1">
                  Direct access to the 1C Automation Engine. Pay per API call, scale infinitely.
                </p>

                <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/10">
                  <span className="text-2xl font-black text-white">
                    $0.50<span className="text-xs text-slate-500 font-normal ml-1">/ call</span>
                  </span>
                  <button
                    onClick={(e) => provisionService("Unified API Access", e)}
                    className="bg-white text-slate-900 px-6 py-2.5 rounded-xl text-sm font-black hover:bg-slate-100 transition-all"
                  >
                    Claim Key
                  </button>
                </div>
              </div>
              <i data-lucide="zap" className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12"></i>
            </div>
          </div>

          {/* THE REVENUE CHART */}
          <div className="card-enterprise bg-slate-50 border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-extrabold tracking-tight">Projected Recurring Revenue Potential</h3>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Forecast</span>
              </div>
            </div>
            <div className="chart-container">
              <canvas id="discoveryChart"></canvas>
            </div>
          </div>
        </section>

        {/* SECTION: PARTNER COMMAND */}
        <section className={activeMode === "terminal" ? "space-y-12 animate-fade-in" : "hidden"}>
          <div
            id="partner-lock-ui"
            className={
              activeTier === "customer"
                ? "text-center py-20 card-enterprise border-dashed space-y-6"
                : "hidden text-center py-20 card-enterprise border-dashed space-y-6"
            }
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
              <i data-lucide="shield-alert" className="w-8 h-8"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Partner Transparency Locked</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Advanced API fee-splitting logic, raw GCP OR-Tools logs, and management margin engines are restricted to
              verified Partners.
            </p>
            <button onClick={() => setTier("partner")} className="text-indigo-600 font-bold hover:underline">
              Apply for Partner Access &rarr;
            </button>
          </div>

          <div id="partner-content" className={activeTier === "partner" ? "space-y-10" : "hidden space-y-10"}>
            <div className="flex justify-between items-end">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Partner Intelligence Terminal</h2>
                <p className="text-slate-500 mt-2">
                  The "Brain" of your business. Visualizing the internal split of the 1C Unified API and traditional
                  cloud automation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* API SPLIT TRANSPARENCY */}
              <div className="card-enterprise space-y-8 flex flex-col">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Unified API Split: $0.50 Fee
                  </h3>
                  <i data-lucide="pie-chart" className="w-4 h-4 text-slate-400"></i>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="chart-container h-[200px]">
                    <canvas id="splitChart"></canvas>
                  </div>
                </div>
                <div className="space-y-3 font-mono-data text-[10px]">
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span>Shopify/GoDaddy Layer</span> <span className="text-slate-900 font-bold">$0.10</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span>GCP Cloud Run Compute</span> <span className="text-slate-900 font-bold">$0.05</span>
                  </div>
                  <div className="flex justify-between p-2 bg-emerald-50 rounded text-emerald-700 font-bold">
                    <span>1C Management Bonus</span> <span>$0.35</span>
                  </div>
                </div>
              </div>

              {/* WORKED INFO TERMINAL */}
              <div className="lg:col-span-2 flex flex-col">
                <div className="flex justify-between items-center mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <i data-lucide="activity" className="w-4 h-4 text-indigo-600"></i>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                      Worked Info Feed (GCP Standalone)
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">STATUS: LIVE STREAMING</span>
                </div>
                <div id="log-terminal" className="worked-terminal custom-scrollbar space-y-2">
                  <div className="text-slate-500">[SYSTEM] API CORE V6.0.1 INITIALIZED.</div>
                  <div className="text-slate-500">[SYSTEM] LISTENING ON PORT 8080 (Cloud Run)...</div>
                </div>
              </div>
            </div>

            {/* OPTIMIZATION METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card-enterprise">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
                  Inventory Oracle: Knapsack Solution
                </h3>
                <div className="chart-container">
                  <canvas id="oracleChart"></canvas>
                </div>
              </div>
              <div className="card-enterprise">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
                  Logistic Router: VRP Efficiency
                </h3>
                <div className="chart-container">
                  <canvas id="routerChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-[1600px] mx-auto px-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white text-[10px] font-bold">
              1C
            </div>
            <span className="font-bold text-slate-900 text-sm">1Commerce Enterprise Terminal</span>
          </div>
          <p className="text-xs text-slate-400">
            © 2026 PNW Enterprises Solutions LLC. All services managed through Unified API v6.0.
          </p>
        </div>
      </footer>
    </>
  )
}
