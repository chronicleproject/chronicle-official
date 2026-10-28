import Image from "next/image";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import SignupForm from "./SignupForm";

const principles = [
  {
    number: "01",
    title: "Launch pages capture a moment.",
    description:
      "Chronicle follows what came before and what changes after a release.",
  },
  {
    number: "02",
    title: "Feeds put the latest update first.",
    description:
      "Chronicle keeps updates grouped with the project they belong to.",
  },
  {
    number: "03",
    title: "Docs preserve useful reference.",
    description:
      "Chronicle brings progress, decisions, and discussion into a readable timeline.",
  },
];

const productScreens = [
  {
    number: "01",
    area: "YOUR COMMUNITY / FEED",
    title: "A home for the work.",
    description:
      "See projects, progress, and the people behind them come together in one feed.",
    image: "/chronicle-dashboard.png",
    width: 1921,
    height: 991,
    alt: "Chronicle home feed with followed projects, progress updates, milestones, and discovery shortcuts",
  },
  {
    number: "02",
    area: "DISCOVERY / PROJECTS",
    title: "Find what’s taking shape.",
    description:
      "Explore projects across domains and follow the ones you want to understand over time.",
    image: "/chronicle-discover.png",
    width: 1901,
    height: 991,
    alt: "Discover page with project search, filters, and a Chronicle project card",
  },
  {
    number: "03",
    area: "PROJECT / CHRONICLE",
    title: "Every project has a story.",
    description:
      "Give each project a dedicated home for its purpose, resources, and history.",
    image: "/chronicle-project-details.png",
    width: 1901,
    height: 991,
    alt: "Chronicle project details page with project overview, links, and the beginning of its history timeline",
  },
  {
    number: "04",
    area: "PROJECT HISTORY / NEW ENTRY",
    title: "Keep a lasting record.",
    description:
      "Capture meaningful decisions and progress as entries in a project’s timeline.",
    image: "/chronicle-project-new-history-entry.png",
    width: 1901,
    height: 991,
    alt: "Form for adding a dated progress entry to a project history",
  },
  {
    number: "05",
    area: "COMMUNITY / DISCUSSIONS",
    title: "Talk in context.",
    description:
      "Keep conversations close to the project updates and milestones they’re about.",
    image: "/chronicle-project-history-entry.png",
    width: 1901,
    height: 991,
    alt: "Discussion view for a Chronicle project history entry, with the entry details and comment area",
  },
];

function ChronicleMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      C
    </span>
  );
}

export default function Home() {
  return (
    <main id="top">
      <header className="journal-header shell">
        <div className="issue-meta">
          <BookOpen aria-hidden="true" />{" "}
          <span>FIELD NOTES&nbsp; / &nbsp;001</span>
        </div>
        <a className="wordmark" href="#top" aria-label="Chronicle home">
          CHRONICLE
        </a>
        <div className="header-end">
          <span className="edition-date">A HOME FOR BUILDERS</span>
          <a className="header-link" href="#why-chronicle">
            WHY CHRONICLE <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="cover-story shell" aria-labelledby="cover-title">
        <div className="cover-title-block">
          <h1 id="cover-title">
            <span>Good work</span>
            <span>deserves a</span>
            <em>Chronicle.</em>
          </h1>
          <p className="handwritten">
            A record for what
            <br />
            you&apos;re building.
          </p>
        </div>
        <div className="cover-intro">
          <div className="intro-rule" />
          <p>
            Chronicle is a home for projects in progress: a place to show what
            you’re building, keep its story as it changes, and help others
            follow along.
          </p>
          <div id="updates">
            <SignupForm apiUrl={process.env.NEXT_PUBLIC_SIGNUP_API_URL ?? ""} />
          </div>
        </div>
      </section>

      <section
        className="story-section shell"
        id="why-chronicle"
        aria-labelledby="story-title"
      >
        <div className="story-heading">
          <div className="story-title">
            <span className="section-label">
              WHY CHRONICLE&nbsp; / &nbsp;THE LONG VIEW
            </span>
            <h2 id="story-title">
              Good work takes time.
              <br />
              Its story should show that.
            </h2>
          </div>
          <div className="story-copy">
            <p className="story-lead">
              Chronicle is a platform for builders who want their project to be
              understood as it grows—not only announced when it launches.
            </p>
            <p>
              Each project gets a home for its purpose and people, a timeline
              for progress and decisions, and conversation that stays close to
              the work. The result is a record that helps newcomers see what
              changed, what was learned, and what comes next.
            </p>
          </div>
        </div>
        <div
          className="story-steps"
          aria-label="How Chronicle brings a project story together"
        >
          <article className="story-step">
            <span className="story-step-number">01&nbsp; / &nbsp;CONTEXT</span>
            <h3>Start with the project.</h3>
            <p>
              Give the work a clear home with its purpose, people, and resources
              in view.
            </p>
          </article>
          <article className="story-step">
            <span className="story-step-number">02&nbsp; / &nbsp;PROGRESS</span>
            <h3>Let the story build.</h3>
            <p>
              Record updates and decisions over time, so each milestone has a
              place in the larger journey.
            </p>
          </article>
          <article className="story-step">
            <span className="story-step-number">
              03&nbsp; / &nbsp;COMMUNITY
            </span>
            <h3>Keep people close.</h3>
            <p>
              Follow projects and discuss the work where its context is easy to
              find.
            </p>
          </article>
        </div>
      </section>

      <section
        className="preview-section shell"
        aria-labelledby="preview-title"
      >
        <div className="preview-heading">
          <div>
            <span className="section-label">
              A FIRST LOOK&nbsp; / &nbsp;05 SCREENS
            </span>
            <h2 id="preview-title">
              Follow a project from overview to update.
            </h2>
          </div>
          <div className="preview-aside">
            <p>
              See how project pages, history entries, and discussions fit
              together.
            </p>
            <span className="gallery-hint">
              SCROLL TO EXPLORE <ArrowRight aria-hidden="true" />
            </span>
          </div>
        </div>
        <div
          className="screen-gallery"
          role="region"
          aria-label="Chronicle product screens"
          tabIndex={0}
        >
          <div className="screen-gallery-track">
            {productScreens.map((screen) => (
              <figure className="screen-slide" key={screen.number}>
                <div className="screen-frame">
                  <Image
                    src={screen.image}
                    alt={screen.alt}
                    width={screen.width}
                    height={screen.height}
                    loading="eager"
                    sizes="(max-width: 900px) 88vw, 930px"
                  />
                </div>
                <figcaption>
                  <div className="screen-caption-top">
                    <span className="screen-number">{screen.number} / 05</span>
                    <span className="screen-area">{screen.area}</span>
                  </div>
                  <h3>{screen.title}</h3>
                  <p>{screen.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="principles shell" aria-labelledby="principles-title">
        <div className="principles-intro">
          <span className="section-label">WHAT MAKES IT DIFFERENT</span>
          <h2 id="principles-title">The story between milestones.</h2>
          <p>
            Different tools serve different moments. Chronicle connects project
            context, progress, and conversation into a story that grows over
            time.
          </p>
        </div>
        <div className="principle-list">
          {principles.map((principle) => (
            <article className="principle" key={principle.number}>
              <span className="principle-number">{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="journal-footer shell">
        <a className="brand" href="#top" aria-label="Chronicle home">
          <ChronicleMark />
          <span>chronicle</span>
        </a>
        <span className="footer-note">For what endures.</span>
        <span className="footer-copyright">© 2026 CHRONICLE</span>
        <a className="back-to-top" href="#top">
          BACK TO THE BEGINNING <ArrowUpRight aria-hidden="true" />
        </a>
      </footer>
    </main>
  );
}
