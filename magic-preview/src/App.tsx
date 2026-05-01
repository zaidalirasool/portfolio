import { useMemo, useState } from "react";
import { AnimatedGridPattern } from "./components/ui/animated-grid-pattern";
import { MagicCard } from "./components/ui/magic-card";
import { Marquee } from "./components/ui/marquee";
import { ShimmerButton } from "./components/ui/shimmer-button";

const cases = [
  {
    id: "01",
    title: "Step-by-step wizard",
    copy: "Setup guidance breaks a heavy product job into small, confident decisions.",
    kicker: "Owner mindset",
    showcase: "Bring structure to ambiguous product spaces.",
  },
  {
    id: "02",
    title: "Preset smart defaults",
    copy: "Useful defaults reduce blank-state anxiety and keep merchants moving.",
    kicker: "Smart defaults",
    showcase: "Start from a useful recommendation, then let teams refine.",
  },
  {
    id: "03",
    title: "Guided by data",
    copy: "Same-session deactivations dropped when setup gave clearer affordances.",
    kicker: "Evidence",
    showcase: "Behavioral signals identify where simplification matters most.",
  },
];

const metricContent: Record<string, string> = {
  "4.2": "4.2x higher same-session deactivation signal exposed where the wizard needed more clarity.",
  "2.2": "2.2x cross-sell signal showed simpler setup still needed stronger preview confidence.",
  "0.0": "No meaningful movement on subscription widget meant we avoided over-designing the wrong surface.",
};

const workflowContent: Record<string, string> = {
  Claude: "Claude helps turn messy inputs into sharper framing before design energy gets expensive.",
  Stitch: "Stitch compresses early visual exploration into a faster critique loop.",
  Cursor: "Cursor keeps prototypes close to the material reality of code.",
};

const figmaHeroImage = "https://www.figma.com/api/mcp/asset/2f901799-f4b6-4adf-9d00-60a97200604f";
const companyLogos = [
  { name: "Shopify", src: "/site/shopify.jpg" },
  { name: "Amazon", src: "/site/amazon.jpg" },
  { name: "Costco", src: "/site/costco.jpg" },
  { name: "DSAC", src: "/site/dsac.jpg" },
];
const firstLogoRow = companyLogos.slice(0, 2);
const secondLogoRow = companyLogos.slice(2);

function App() {
  const [activeCase, setActiveCase] = useState(0);
  const [activeMetric, setActiveMetric] = useState<"4.2" | "2.2" | "0.0">("4.2");
  const [activeTool, setActiveTool] = useState<"Claude" | "Stitch" | "Cursor">("Claude");
  const [compareValue, setCompareValue] = useState(54);

  const selectedCase = useMemo(() => cases[activeCase], [activeCase]);

  return (
    <main className="page">
      <AnimatedGridPattern />
      <header className="dock-nav">
        <a href="#story">Story</a>
        <a href="#work">Work</a>
        <a href="#metrics">Metrics</a>
        <a href="#ai">AI</a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <h1>
            Zaidali <span>(Zaid)</span>
          </h1>
          <p className="role">
            Product designer with 7+ years of turning ambiguous problems in complex systems into
            simple solutions.
          </p>
        </div>
        <MagicCard className="hero-image-card">
          <img src={figmaHeroImage} alt="Zaid in mountain landscape" />
        </MagicCard>
      </section>

      <section id="story" className="cards">
        <MagicCard className="timeline-card">
          <img src="/site/mumbai.jpg" alt="Mumbai skyline" />
          <span>Born and raised</span>
          <h3>Mumbai, India</h3>
        </MagicCard>
        <MagicCard className="timeline-card">
          <img src="/site/canada.jpg" alt="Zaid in snowy Canada" />
          <span>2018</span>
          <h3>Immigrated to Canada</h3>
        </MagicCard>
        <MagicCard className="timeline-card">
          <img src="/site/mountain.jpg" alt="Mountain ridge" />
          <span>2022</span>
          <h3>Co-founded Rhizhome</h3>
        </MagicCard>
      </section>

      <section className="deck-section">
        <div className="section-head">
          <p className="eyebrow">Outline</p>
          <h2>About me / Highlights</h2>
        </div>
        <MagicCard>
          <ul className="bullet-list">
            <li>About me</li>
            <li>Highlights</li>
          </ul>
        </MagicCard>
      </section>

      <section className="deck-section">
        <div className="section-head">
          <p className="eyebrow">Owner mindset</p>
          <h2>I bring structure to ambiguous problem spaces.</h2>
        </div>
        <MagicCard>
          <ul className="bullet-list">
            <li>Owner mindset</li>
            <li>I bring structure</li>
            <li>Ambiguous problem spaces</li>
            <li>Humility above all</li>
          </ul>
        </MagicCard>
      </section>

      <section className="deck-section">
        <div className="section-head">
          <p className="eyebrow">Credit</p>
          <h2>Issue reward credit configuration</h2>
        </div>
        <MagicCard>
          <div className="config-grid">
            <p><strong>Fixed amount:</strong> 10%</p>
            <p><strong>Gift product:</strong> Maris moisturizer pack</p>
            <p><strong>Order discount:</strong> Percentage 10%</p>
            <p><strong>Purchase type:</strong> Subscription + one-time</p>
            <p><strong>Minimum requirements:</strong> None</p>
            <p><strong>Recurring payments:</strong> First payment only</p>
          </div>
        </MagicCard>
      </section>

      <section id="work" className="work">
        <div className="section-head">
          <p className="eyebrow">Highlights</p>
          <h2>Identifying and resolving complexity.</h2>
        </div>
        <MagicCard className="compare-shell">
          <div className="compare-copy">
            <span>Recharge</span>
            <h3>From dense configuration to guided setup.</h3>
            <p>
              Pull the handle to move from raw settings into a clearer flow with progress and
              defaults.
            </p>
          </div>
          <div className="compare">
            <img src="/site/complexity-canvas.jpg" alt="Before: dense settings canvas" />
            <div className="compare-after" style={{ width: `${compareValue}%` }}>
              <img src="/site/wizard-ui.jpg" alt="After: guided wizard interface" />
            </div>
            <div className="compare-handle" style={{ left: `${compareValue}%` }}>
              <div className="compare-grip">⟺</div>
            </div>
            <div className="compare-label label-after">After</div>
            <div className="compare-label label-before">Before</div>
            <input
              aria-label="Compare complexity and guided wizard"
              type="range"
              min={5}
              max={95}
              value={compareValue}
              onChange={(event) => setCompareValue(Number(event.target.value))}
            />
          </div>
        </MagicCard>
        <div className="case-grid">
          {cases.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`case-tile ${activeCase === index ? "active" : ""}`}
              onClick={() => setActiveCase(index)}
            >
              <span>{item.id}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </button>
          ))}
        </div>
        <MagicCard className="showcase">
          <p className="show-kicker">{selectedCase.kicker}</p>
          <h3>{selectedCase.showcase}</h3>
          <p>Live case switching is now running in React state for the Magic UI conversion.</p>
        </MagicCard>
      </section>

      <section className="deck-section">
        <div className="section-head">
          <p className="eyebrow">Step-by-step wizard</p>
          <h2>Setup guide: launch your upsell in simple steps.</h2>
        </div>
        <MagicCard>
          <ul className="bullet-list">
            <li>1/5 completed</li>
            <li>Review your audience</li>
            <li>Review & configure your upsell swap</li>
            <li>Add a product swap</li>
            <li>Mark as done & continue</li>
          </ul>
        </MagicCard>
      </section>

      <section className="deck-section">
        <div className="section-head">
          <p className="eyebrow">Pre-set smart defaults</p>
          <h2>Cross-sell flow with better defaults and guidance.</h2>
        </div>
        <MagicCard>
          <ul className="bullet-list">
            <li>Best seller products</li>
            <li>Sell as both subscription and one-time</li>
            <li>Display 4 products</li>
            <li>Trigger after portal load</li>
            <li>Recommend 4-6 products</li>
          </ul>
        </MagicCard>
      </section>

      <section id="metrics" className="metrics">
        <div className="section-head">
          <p className="eyebrow">Guided by data</p>
          <h2>Signals that changed the shape of the work.</h2>
        </div>
        <MagicCard className="metric-board">
          <div className="metric-value">{activeMetric}x</div>
          <img className="metric-image" src="/site/spark-system.jpg" alt="Guided-by-data visualization" />
          <div className="metric-actions">
            <button
              className={activeMetric === "4.2" ? "active" : ""}
              type="button"
              onClick={() => setActiveMetric("4.2")}
            >
              Upsell
            </button>
            <button
              className={activeMetric === "2.2" ? "active" : ""}
              type="button"
              onClick={() => setActiveMetric("2.2")}
            >
              Cross-sell
            </button>
            <button
              className={activeMetric === "0.0" ? "active" : ""}
              type="button"
              onClick={() => setActiveMetric("0.0")}
            >
              Subscription widget
            </button>
          </div>
          <p>{metricContent[activeMetric]}</p>
        </MagicCard>
      </section>

      <section id="ai" className="ai">
        <div className="section-head">
          <p className="eyebrow">AI-powered workflow</p>
          <h2>A faster loop for research, prototyping, and implementation.</h2>
        </div>
        <div className="tool-row">
          {(["Claude", "Stitch", "Cursor"] as const).map((tool) => (
            <button
              key={tool}
              type="button"
              className={`tool-tile ${activeTool === tool ? "active" : ""}`}
              onClick={() => setActiveTool(tool)}
            >
              {tool}
            </button>
          ))}
        </div>
        <MagicCard>
          <p>{workflowContent[activeTool]}</p>
        </MagicCard>
      </section>

      <section className="deck-section">
        <div className="section-head">
          <p className="eyebrow">Design system 101</p>
          <h2>Spark 2.0 and tokens made decisions reusable.</h2>
        </div>
        <div className="cards two-up">
          <MagicCard className="timeline-card">
            <img src="/site/spark-system.jpg" alt="Spark design system" />
            <h3>Spark 2.0 foundations</h3>
          </MagicCard>
          <MagicCard className="timeline-card">
            <img src="/site/tokens.jpg" alt="Design token documentation" />
            <h3>Tokenized decisions</h3>
          </MagicCard>
        </div>
      </section>

      <section className="brands">
        <Marquee pauseOnHover className="brand-marquee">
          {firstLogoRow.map((logo) => (
            <figure key={logo.name} className="logo-card">
              <img src={logo.src} alt={logo.name} />
              <figcaption>{logo.name}</figcaption>
            </figure>
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="brand-marquee">
          {secondLogoRow.map((logo) => (
            <figure key={logo.name} className="logo-card">
              <img src={logo.src} alt={logo.name} />
              <figcaption>{logo.name}</figcaption>
            </figure>
          ))}
        </Marquee>
      </section>

      <section className="deck-section">
        <MagicCard className="thank-you">
          <p className="eyebrow">Thank you!</p>
          <h2>Zaidali (Zaid)</h2>
          <p>Sr. product designer</p>
          <ShimmerButton>Back to top</ShimmerButton>
        </MagicCard>
      </section>
    </main>
  );
}

export default App;
