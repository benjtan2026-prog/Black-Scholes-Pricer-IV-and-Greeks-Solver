import { useState, useEffect } from "react";

const STAGES = [
  {
    id: 1,
    title: "Python & Options Foundations",
    period: "Months 1–2",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.07)",
    projects: [
      {
        num: 1,
        title: "Black-Scholes Pricer + Greeks + IV Solver",
        lang: ["Python"],
        desc: "Price European calls/puts analytically, compute all five Greeks, and back out implied volatility from real market prices using Newton-Raphson (primary) with bisection as fallback. Verify outputs against a live options chain. This is your flagship early project.",
        skills: ["Partial derivatives", "Newton-Raphson", "Real options data", "Normal CDF"],
        books: [
          "Options, Futures, and Other Derivatives — Hull (Ch. 15–19)",
          "The Concepts and Practice of Mathematical Finance — Joshi (Ch. 4–6)"
        ],
        papers: ["Black & Scholes (1973) — The Pricing of Options and Corporate Liabilities"]
      },
      {
        num: 2,
        title: "Market Data Pipeline",
        lang: ["Python"],
        desc: "Not a standalone project — a critical prerequisite. Pull historical OHLCV data via yfinance, compute log returns correctly, handle splits and dividends, and build clean reusable utilities you'll call in every project after this.",
        skills: ["pandas", "yfinance", "Log returns", "Data cleaning"],
        books: ["Python for Data Analysis — Wes McKinney (Ch. 1–10)"],
        papers: []
      },
      {
        num: 3,
        title: "Enhanced Monte Carlo Pricer",
        lang: ["Python"],
        desc: "Extend your existing Monte Carlo beyond antithetic variates. Add control variates (using the Black-Scholes price as the control) and quasi-random Sobol sequences. Plot convergence curves comparing all variance reduction techniques — this shows mathematical rigour.",
        skills: ["Control variates", "Quasi-Monte Carlo", "Sobol sequences", "Convergence analysis"],
        books: ["Monte Carlo Methods in Financial Engineering — Glasserman (Ch. 1–5)"],
        papers: []
      }
    ]
  },
  {
    id: 2,
    title: "Derivatives & Volatility",
    period: "Months 2–4",
    color: "#10B981",
    bg: "rgba(16,185,129,0.07)",
    projects: [
      {
        num: 4,
        title: "Binomial Options Pricing Tree (CRR)",
        lang: ["Python"],
        desc: "Implement the Cox-Ross-Rubinstein binomial model for both European and American options. Show convergence to Black-Scholes as the number of steps increases. Early exercise logic on American puts is the key conceptual challenge — don't skip it.",
        skills: ["Tree methods", "American options", "Early exercise", "Convergence analysis"],
        books: [
          "Options, Futures, and Other Derivatives — Hull (Ch. 13)",
          "The Concepts and Practice of Mathematical Finance — Joshi (Ch. 7)"
        ],
        papers: ["Cox, Ross & Rubinstein (1979) — Option Pricing: A Simplified Approach"]
      },
      {
        num: 5,
        title: "Implied Volatility Surface",
        lang: ["Python"],
        desc: "Pull a real options chain from CBOE or yfinance. Compute IV across all strikes and maturities, then visualise the vol smile, skew, and term structure in 3D. This is what traders look at every day — one of the most practitioner-facing projects an undergrad can build.",
        skills: ["Real options chain", "3D visualisation", "Vol smile/skew/term structure"],
        books: [
          "The Volatility Surface — Gatheral (Ch. 1–4)",
          "Paul Wilmott on Quantitative Finance — Wilmott (Vol. 1, Ch. 1–5)"
        ],
        papers: []
      },
      {
        num: 6,
        title: "Exotic Options via Monte Carlo",
        lang: ["Python"],
        desc: "Price Asian, barrier, and lookback options — none of which have simple closed-form solutions. Requires careful path-dependent simulation design and benchmarking different variance reduction strategies across payoff structures.",
        skills: ["Path dependence", "Barrier monitoring", "Payoff structures", "Simulation design"],
        books: ["Monte Carlo Methods in Financial Engineering — Glasserman (Ch. 5–8)"],
        papers: []
      }
    ]
  },
  {
    id: 3,
    title: "Strategy & Backtesting",
    period: "Months 4–6",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.07)",
    projects: [
      {
        num: 7,
        title: "Event-Driven Backtesting Engine",
        lang: ["Python"],
        desc: "Build a backtesting framework from scratch — not using Backtrader or any library. Implement bar-by-bar event queuing, position sizing, transaction costs, slippage models, and full reporting: Sharpe, Sortino, Calmar, max drawdown. The infrastructure matters more than the strategy.",
        skills: ["Event-driven design", "Slippage/costs", "Lookahead bias prevention", "Performance metrics"],
        books: [
          "Advances in Financial Machine Learning — Lopez de Prado (Ch. 1–5)",
          "Quantitative Trading — Ernest Chan (Ch. 3–4)"
        ],
        papers: []
      },
      {
        num: 8,
        title: "Momentum Strategy — Jegadeesh & Titman Replication",
        lang: ["Python"],
        desc: "Replicate the original momentum paper on real US equity data. Form decile portfolios ranked by prior 12-1 month returns, hold for 3 months, report long-short returns. Compare your results against the paper's reported figures — discrepancies are a debugging exercise, not a failure.",
        skills: ["Cross-sectional ranking", "Portfolio formation", "Paper replication", "Decile portfolios"],
        books: ["Quantitative Equity Portfolio Management — Chincarini & Kim (Ch. 7)"],
        papers: ["Jegadeesh & Titman (1993) — Returns to Buying Winners and Selling Losers"]
      },
      {
        num: 9,
        title: "Pairs Trading / Statistical Arbitrage",
        lang: ["Python"],
        desc: "Select cointegrated equity pairs via the Engle-Granger test, construct the spread, and trade z-score-based entry/exit signals. Implement stop-losses and evaluate across different formation/trading windows to avoid overfitting.",
        skills: ["Cointegration tests", "Spread construction", "Z-score signals", "Engle-Granger"],
        books: ["Algorithmic Trading — Ernest Chan (Ch. 3–5)"],
        papers: ["Engle & Granger (1987) — Co-Integration and Error Correction: Representation, Estimation, and Testing"]
      },
      {
        num: 10,
        title: "GARCH Volatility Forecasting",
        lang: ["Python"],
        desc: "Fit a GARCH(1,1) to real equity return series via MLE. Produce out-of-sample volatility forecasts and compare to realised volatility. Understand volatility clustering and persistence — foundational knowledge for options trading and risk management.",
        skills: ["MLE estimation", "Volatility clustering", "Out-of-sample forecasting", "arch library"],
        books: [
          "Analysis of Financial Time Series — Tsay (Ch. 3)",
          "Time Series Analysis — Hamilton (Ch. 21)"
        ],
        papers: [
          "Engle (1982) — Autoregressive Conditional Heteroskedasticity",
          "Bollerslev (1986) — Generalized Autoregressive Conditional Heteroskedasticity"
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Factor Models & Portfolio Theory",
    period: "Months 5–7",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.07)",
    projects: [
      {
        num: 11,
        title: "Markowitz Portfolio Optimiser + Efficient Frontier",
        lang: ["Python"],
        desc: "Implement mean-variance optimisation, plot the efficient frontier, and locate the maximum Sharpe portfolio. Then deliberately break it with sample covariance on a large universe to motivate Project 12 — demonstrating you understand the model's fragility, not just its mechanics.",
        skills: ["Quadratic optimisation", "scipy.optimize", "Efficient frontier", "Sharpe maximisation"],
        books: ["Active Portfolio Management — Grinold & Kahn (Ch. 2–3)"],
        papers: ["Markowitz (1952) — Portfolio Selection"]
      },
      {
        num: 12,
        title: "Ledoit-Wolf Covariance Shrinkage",
        lang: ["Python"],
        desc: "Implement the Ledoit-Wolf analytical shrinkage estimator. Compare portfolio stability and out-of-sample Sharpe against raw sample covariance across expanding windows. A direct, clean demonstration of estimation error — interviewers love this.",
        skills: ["Shrinkage estimation", "Covariance matrices", "Out-of-sample testing", "Estimation error"],
        books: ["Machine Learning for Asset Managers — Lopez de Prado (Ch. 2)"],
        papers: ["Ledoit & Wolf (2004) — A Well-Conditioned Estimator for Large-Dimensional Covariance Matrices"]
      },
      {
        num: 13,
        title: "Fama-French 3-Factor Model Replication",
        lang: ["Python"],
        desc: "Download factor data from Ken French's data library. Run factor regressions on individual stocks and sorted portfolios. Interpret alpha, beta, SMB, and HML exposures. This is the foundation of all systematic equity investing and shows you understand what alpha actually means.",
        skills: ["Factor regression", "Alpha attribution", "SMB/HML", "Ken French library"],
        books: ["Quantitative Equity Portfolio Management — Chincarini & Kim (Ch. 3–4)"],
        papers: ["Fama & French (1993) — Common Risk Factors in the Returns on Stocks and Bonds"]
      }
    ]
  },
  {
    id: 5,
    title: "C++ Track",
    period: "Months 3–8 (parallel)",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.07)",
    projects: [
      {
        num: 14,
        title: "C++ Core Language",
        lang: ["C++"],
        desc: "Learn C++ properly before using it for finance. Focus on: memory management, pointers and references, OOP (classes, inheritance, virtual functions), templates, and STL containers (vector, map, priority_queue). Bad C++ is worse than no C++ — do not rush this stage.",
        skills: ["Memory model", "OOP & inheritance", "Templates", "STL containers"],
        books: [
          "Programming: Principles and Practice Using C++ — Stroustrup (Ch. 1–15)",
          "A Tour of C++ — Stroustrup"
        ],
        papers: []
      },
      {
        num: 15,
        title: "Black-Scholes + Greeks in C++",
        lang: ["C++"],
        desc: "Reimplement Project 1 in C++. Design a proper class hierarchy (Option base class, derived European/American classes), implement the normal CDF from scratch without shortcuts, and benchmark against your Python version. The speed gap will be immediately obvious.",
        skills: ["Class hierarchy", "Virtual functions", "Numerical precision", "Python benchmarking"],
        books: ["C++ Design Patterns and Derivatives Pricing — Joshi"],
        papers: []
      },
      {
        num: 16,
        title: "Multithreaded Monte Carlo in C++",
        lang: ["C++"],
        desc: "Reimplement your variance-reduced Monte Carlo in C++, parallelised via std::thread or OpenMP across simulation paths. Profile carefully and aim for 50–100x speedup over Python. This is where C++ starts demonstrating real value for quant trading infrastructure.",
        skills: ["std::thread / OpenMP", "Parallelism", "Performance profiling", "RNG in parallel"],
        books: ["C++ Concurrency in Action — Williams (Ch. 1–5)"],
        papers: []
      },
      {
        num: 17,
        title: "Order Book & Matching Engine",
        lang: ["C++"],
        desc: "Implement a limit order book using a price-level map backed by priority queues. Support limit, market, and cancel orders with price-time priority matching. This directly reflects real trading infrastructure and is the single most impressive C++ project you can build for quant trading roles.",
        skills: ["std::map", "Priority queues", "Order matching logic", "Price-time priority"],
        books: ["Trading and Exchanges — Harris (Ch. 1–6)"],
        papers: []
      }
    ]
  },
  {
    id: 6,
    title: "Advanced & Capstone",
    period: "Months 8–12",
    color: "#F97316",
    bg: "rgba(249,115,22,0.07)",
    projects: [
      {
        num: 18,
        title: "PCA-Based Statistical Arbitrage",
        lang: ["Python"],
        desc: "Implement Avellaneda & Lee (2010): use PCA to extract systematic risk factors from equity returns, fit an Ornstein-Uhlenbeck process to each stock's residual, and trade mean-reversion signals with s-score thresholds. One of the most impressive undergrad-level quant projects possible.",
        skills: ["PCA", "Ornstein-Uhlenbeck", "s-score signals", "Residual mean reversion"],
        books: ["Advances in Financial Machine Learning — Lopez de Prado (Ch. 17)"],
        papers: ["Avellaneda & Lee (2010) — Statistical Arbitrage in the US Equities Market"]
      },
      {
        num: 19,
        title: "Market Making Simulation (Avellaneda-Stoikov)",
        lang: ["Python", "C++"],
        desc: "Implement the Avellaneda-Stoikov (2008) model: a market maker posting optimal bid/ask quotes, dynamically adjusting for inventory risk and realised volatility. Simulate PnL, spread, and inventory distributions. Bridges your derivatives knowledge directly with market microstructure.",
        skills: ["Stochastic control", "Inventory risk", "Spread optimisation", "Market microstructure"],
        books: ["Algorithmic and High-Frequency Trading — Cartea, Jaimungal & Penalva (Ch. 6–8)"],
        papers: ["Avellaneda & Stoikov (2008) — High-Frequency Trading in a Limit Order Book"]
      },
      {
        num: 20,
        title: "Quant Research Report (Capstone)",
        lang: ["Python"],
        desc: "Not a new model — a write-up. Produce a proper research report on your strongest project: methodology, data, results, sensitivity analysis, and limitations, written like a miniature quant paper. A clean write-up is what distinguishes a GitHub repo from a real deliverable that you can send to firms.",
        skills: ["Quantitative writing", "Sensitivity analysis", "Methodology section", "LaTeX or Jupyter"],
        books: ["The Elements of Style — Strunk & White (for concise technical writing)"],
        papers: []
      }
    ]
  }
];

const TRACKS = [
  {
    icon: "◈",
    title: "Probability & Interview Prep",
    color: "#F59E0B",
    desc: "Non-negotiable for Optiver, IMC, and Jane Street. Work through Heard on the Street and the Green Book cover-to-cover. Focus on conditional probability, Bayes' theorem, combinatorics, expected value problems, and classic brainteasers. Start Month 1, never stop.",
    books: [
      "Heard on the Street — Timothy Crack",
      "A Practical Guide to Quantitative Finance Interviews — Xinfeng Zhou (Green Book)",
      "Fifty Challenging Problems in Probability — Mosteller",
      "A First Course in Probability — Sheldon Ross (Ch. 1–7)"
    ]
  },
  {
    icon: "◈",
    title: "LeetCode — Algorithms & Data Structures",
    color: "#3B82F6",
    desc: "Start easy problems daily from Month 1. Move to mediums by Month 3. Focus on arrays, hash maps, trees, graphs, and dynamic programming. Aim for 150+ problems solved by the end of Year 1. Consistency matters more than session length.",
    books: [
      "Cracking the Coding Interview — Gayle McDowell",
      "Introduction to Algorithms (CLRS) — Cormen et al. (reference text)"
    ]
  },
  {
    icon: "◈",
    title: "University Coursework",
    color: "#10B981",
    desc: "Take the most quantitative subjects available — econometrics, probability & statistics, financial mathematics. Grades are a real filter at top quant firms: a high GPA in rigorous quant subjects outweighs a perfect GPA in softer finance courses. Transcript is the first thing they see.",
    books: []
  }
];

export default function QuantRoadmap() {
  const [expanded, setExpanded] = useState({});
  const [trackOpen, setTrackOpen] = useState({});

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;600;700;800&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const toggleProj = (sid, pnum) => {
    const k = `${sid}-${pnum}`;
    setExpanded(p => ({ ...p, [k]: !p[k] }));
  };
  const isProjOpen = (sid, pnum) => !!expanded[`${sid}-${pnum}`];

  const styles = {
    root: {
      background: "#080C14",
      minHeight: "100vh",
      color: "#E2E8F0",
      fontFamily: "'Syne', sans-serif",
      padding: "36px 24px 60px",
      maxWidth: "820px",
      margin: "0 auto",
      boxSizing: "border-box"
    },
    mono: { fontFamily: "'JetBrains Mono', monospace" },
    label: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "10px",
      letterSpacing: "3px",
      textTransform: "uppercase",
      color: "#F59E0B",
      marginBottom: "10px"
    },
    sectionDivider: {
      marginTop: "48px",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }
  };

  return (
    <div style={styles.root}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "52px" }}>
        <div style={styles.label}>Quant Trading · 12-Month Roadmap</div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: "800",
          lineHeight: 1.1,
          margin: "0 0 14px",
          color: "#F1F5F9"
        }}>
          From First Year<br />
          <span style={{ color: "#F59E0B" }}>to Top Quant Firm</span>
        </h1>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          color: "#475569",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap"
        }}>
          <span>20 projects</span>
          <span style={{ color: "#1E293B" }}>·</span>
          <span>Python + C++</span>
          <span style={{ color: "#1E293B" }}>·</span>
          <span>Optiver / IMC / Citadel / Jane Street</span>
        </div>
      </div>

      {/* ── Stages ── */}
      {STAGES.map(stage => (
        <div key={stage.id} style={{ marginBottom: "44px" }}>
          {/* Stage header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "14px",
            paddingBottom: "14px",
            borderBottom: `1px solid ${stage.color}30`
          }}>
            <div style={{
              width: "38px", height: "38px",
              borderRadius: "8px",
              background: stage.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: "700", fontSize: "13px",
              color: "#080C14",
              flexShrink: 0
            }}>
              S{stage.id}
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "15px", color: "#F1F5F9" }}>
                {stage.title}
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: stage.color,
                marginTop: "3px",
                letterSpacing: "1px"
              }}>
                {stage.period}
              </div>
            </div>
          </div>

          {/* Projects */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {stage.projects.map(proj => {
              const open = isProjOpen(stage.id, proj.num);
              const resourceCount = proj.books.length + proj.papers.length;
              return (
                <div key={proj.num} style={{
                  background: open ? stage.bg : "#0D1321",
                  border: `1px solid ${open ? stage.color + "50" : "rgba(255,255,255,0.05)"}`,
                  borderRadius: "10px",
                  overflow: "hidden",
                  transition: "border-color 0.2s, background 0.2s"
                }}>
                  {/* Row */}
                  <div
                    onClick={() => toggleProj(stage.id, proj.num)}
                    style={{
                      display: "flex", alignItems: "center",
                      gap: "16px", padding: "13px 16px",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "18px", fontWeight: "700",
                      color: stage.color,
                      minWidth: "30px", lineHeight: 1,
                      opacity: 0.85
                    }}>
                      {String(proj.num).padStart(2, "0")}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", fontSize: "13.5px", color: "#F1F5F9", marginBottom: "5px" }}>
                        {proj.title}
                      </div>
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        {proj.lang.map(l => (
                          <span key={l} style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "10px",
                            padding: "2px 7px", borderRadius: "4px",
                            background: l === "Python" ? "rgba(59,130,246,0.18)" : "rgba(239,68,68,0.18)",
                            color: l === "Python" ? "#93C5FD" : "#FCA5A5",
                          }}>
                            {l}
                          </span>
                        ))}
                        {resourceCount > 0 && (
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "10px",
                            padding: "2px 7px", borderRadius: "4px",
                            background: "rgba(245,158,11,0.12)",
                            color: "#FCD34D"
                          }}>
                            {resourceCount} resource{resourceCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{
                      color: "#334155", fontSize: "14px",
                      transform: open ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                      flexShrink: 0
                    }}>
                      ▾
                    </div>
                  </div>

                  {/* Expanded */}
                  {open && (
                    <div style={{
                      padding: "0 16px 18px 62px",
                      borderTop: `1px solid ${stage.color}20`
                    }}>
                      <p style={{
                        color: "#94A3B8", fontSize: "13px",
                        lineHeight: 1.75, margin: "14px 0 18px"
                      }}>
                        {proj.desc}
                      </p>

                      {/* Skills */}
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "9px", color: "#334155",
                          textTransform: "uppercase", letterSpacing: "2px",
                          marginBottom: "8px"
                        }}>Key Skills</div>
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                          {proj.skills.map(s => (
                            <span key={s} style={{
                              fontSize: "11px", padding: "3px 8px", borderRadius: "4px",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.07)",
                              color: "#64748B"
                            }}>{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Books */}
                      {proj.books.length > 0 && (
                        <div style={{ marginBottom: proj.papers.length > 0 ? "14px" : 0 }}>
                          <div style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "9px", color: "#334155",
                            textTransform: "uppercase", letterSpacing: "2px",
                            marginBottom: "8px"
                          }}>📚 Books</div>
                          {proj.books.map(b => (
                            <div key={b} style={{
                              fontSize: "12px", color: "#CBD5E1",
                              padding: "7px 10px",
                              background: "rgba(255,255,255,0.025)",
                              borderRadius: "6px",
                              borderLeft: `2px solid ${stage.color}60`,
                              marginBottom: "5px", lineHeight: 1.5
                            }}>{b}</div>
                          ))}
                        </div>
                      )}

                      {/* Papers */}
                      {proj.papers.length > 0 && (
                        <div>
                          <div style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "9px", color: "#334155",
                            textTransform: "uppercase", letterSpacing: "2px",
                            marginBottom: "8px"
                          }}>📄 Papers</div>
                          {proj.papers.map(p => (
                            <div key={p} style={{
                              fontSize: "12px", color: "#CBD5E1",
                              padding: "7px 10px",
                              background: "rgba(255,255,255,0.025)",
                              borderRadius: "6px",
                              borderLeft: "2px solid #F59E0B60",
                              marginBottom: "5px", lineHeight: 1.5
                            }}>{p}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── Parallel Tracks ── */}
      <div style={{ marginTop: "52px" }}>
        <div style={styles.label}>Parallel Tracks — Run Throughout All Stages</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: "700", fontSize: "18px",
          color: "#F1F5F9", margin: "0 0 20px"
        }}>
          Non-Negotiable Foundations
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {TRACKS.map((track, i) => {
            const open = !!trackOpen[i];
            return (
              <div key={i} style={{
                background: open ? "rgba(255,255,255,0.03)" : "#0D1321",
                border: `1px solid ${open ? track.color + "40" : "rgba(255,255,255,0.05)"}`,
                borderRadius: "10px",
                overflow: "hidden"
              }}>
                <div
                  onClick={() => setTrackOpen(p => ({ ...p, [i]: !p[i] }))}
                  style={{
                    display: "flex", alignItems: "center",
                    gap: "12px", padding: "13px 16px",
                    cursor: "pointer"
                  }}
                >
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: track.color, flexShrink: 0
                  }} />
                  <div style={{ flex: 1, fontWeight: "600", fontSize: "13.5px", color: "#F1F5F9" }}>
                    {track.title}
                  </div>
                  <div style={{
                    color: "#334155", fontSize: "14px",
                    transform: open ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                    flexShrink: 0
                  }}>▾</div>
                </div>

                {open && (
                  <div style={{
                    padding: "0 16px 18px 36px",
                    borderTop: "1px solid rgba(255,255,255,0.05)"
                  }}>
                    <p style={{
                      color: "#94A3B8", fontSize: "13px",
                      lineHeight: 1.75, margin: "14px 0 16px"
                    }}>
                      {track.desc}
                    </p>
                    {track.books.length > 0 && (
                      <>
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "9px", color: "#334155",
                          textTransform: "uppercase", letterSpacing: "2px",
                          marginBottom: "8px"
                        }}>📚 Books</div>
                        {track.books.map(b => (
                          <div key={b} style={{
                            fontSize: "12px", color: "#CBD5E1",
                            padding: "7px 10px",
                            background: "rgba(255,255,255,0.025)",
                            borderRadius: "6px",
                            borderLeft: `2px solid ${track.color}60`,
                            marginBottom: "5px", lineHeight: 1.5
                          }}>{b}</div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer note ── */}
      <div style={{
        marginTop: "48px",
        padding: "18px 22px",
        background: "rgba(245,158,11,0.05)",
        border: "1px solid rgba(245,158,11,0.18)",
        borderRadius: "10px"
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px", color: "#F59E0B",
          textTransform: "uppercase", letterSpacing: "2px",
          marginBottom: "8px"
        }}>
          Core Principle
        </div>
        <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.75, margin: 0 }}>
          Depth over breadth. A C++ Black-Scholes pricer you can defend line-by-line in an interview beats five Python notebooks you half-understand. GitHub is public — every project you publish is something an Optiver recruiter might pull up and quiz you on during your interview.
        </p>
      </div>
    </div>
  );
}
