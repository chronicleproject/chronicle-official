import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import SignupForm from "./SignupForm";

const principles = [
  {
    number: "01",
    title: "Projects, not posts.",
    description: "Give the work a home, with its notes, people, and progress together.",
  },
  {
    number: "02",
    title: "A lasting record.",
    description: "Keep the decisions and discoveries that explain how things take shape.",
  },
  {
    number: "03",
    title: "Made for discovery.",
    description: "Find thoughtful projects and follow the people moving them forward.",
  },
];

const productScreens = [
  {
    number: "01",
    area: "YOUR COMMUNITY / FEED",
    title: "A home for the work.",
    description: "See projects, progress, and the people behind them come together in one feed.",
    image: "/chronicle-dashboard.png",
    width: 1921,
    height: 991,
    alt: "Chronicle home feed with followed projects, progress updates, milestones, and discovery shortcuts",
  },
  {
    number: "02",
    area: "DISCOVERY / PROJECTS",
    title: "Find what’s taking shape.",
    description: "Explore projects across domains and follow the ones you want to understand over time.",
    image: "/chronicle-discover.png",
    width: 1901,
    height: 991,
    alt: "Discover page with project search, filters, and a Chronicle project card",
  },
  {
    number: "03",
    area: "PROJECT / CHRONICLE",
    title: "Every project has a story.",
    description: "Give each project a dedicated home for its purpose, resources, and history.",
    image: "/chronicle-project-details.png",
    width: 1901,
    height: 991,
    alt: "Chronicle project details page with project overview, links, and the beginning of its history timeline",
  },
  {
    number: "04",
    area: "PROJECT HISTORY / NEW ENTRY",
    title: "Keep a lasting record.",
    description: "Capture meaningful decisions and progress as entries in a project’s timeline.",
    image: "/chronicle-project-new-history-entry.png",
    width: 1901,
    height: 991,
    alt: "Form for adding a dated progress entry to a project history",
  },
  {
    number: "05",
    area: "COMMUNITY / DISCUSSIONS",
    title: "Talk in context.",
    description: "Keep conversations close to the project updates and milestones they’re about.",
    image: "/chronicle-project-history-entry.png",
    width: 1901,
    height: 991,
    alt: "Discussion view for a Chronicle project history entry, with the entry details and comment area",
  },
];

function ChronicleMark() {
  return <span className="brand-mark" aria-hidden="true">C</span>;
}

export default function Home() {
  return (
    <main id="top">
      <header className="journal-header shell">
        <div className="issue-meta"><BookOpen aria-hidden="true" /> <span>FIELD NOTES&nbsp; / &nbsp;001</span></div>
        <a className="wordmark" href="#top" aria-label="Chronicle home">CHRONICLE</a>
        <div className="header-end">
          <span className="edition-date">A HOME FOR BUILDERS</span>
          <a className="header-link" href="#updates">LETTERS <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </header>

      <section className="cover-story shell" aria-labelledby="cover-title">
        <div className="cover-title-block">
          <h1 id="cover-title"><span>Good work</span><span>deserves a</span><em>Chronicle.</em></h1>
          <p className="handwritten">A record for what<br />you&apos;re building.</p>
        </div>
        <div className="cover-intro">
          <div className="intro-rule" />
          <p>Projects are more than what they ship. Chronicle is a place to document the work, share the thinking, and follow what comes next.</p>
          <div id="updates"><SignupForm apiUrl={process.env.NEXT_PUBLIC_SIGNUP_API_URL ?? ""} /></div>
        </div>
      </section>

      <section className="preview-section shell" aria-labelledby="preview-title">
        <div className="preview-heading">
          <div>
            <span className="section-label">A FIRST LOOK&nbsp; / &nbsp;05 SCREENS</span>
            <h2 id="preview-title">A place for work to unfold.</h2>
          </div>
          <div className="preview-aside">
            <p>From discovering projects to keeping their story, see Chronicle in use.</p>
            <span className="gallery-hint">SCROLL TO EXPLORE <ArrowRight aria-hidden="true" /></span>
          </div>
        </div>
        <div className="screen-gallery" role="region" aria-label="Chronicle product screens" tabIndex={0}>
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
          <span className="section-label">THE PRINCIPLES</span>
          <h2 id="principles-title">A longer view<br />of the work.</h2>
          <p>Software is built over time. Chronicle makes that journey easier to see, understand, and follow.</p>
        </div>
        <div className="principle-list">
          {principles.map((principle) => (
            <article className="principle" key={principle.number}>
              <span className="principle-number">{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
              <ArrowUpRight className="principle-arrow" aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <footer className="journal-footer shell">
        <a className="brand" href="#top" aria-label="Chronicle home"><ChronicleMark /><span>chronicle</span></a>
        <span className="footer-note">For what endures.</span>
        <span className="footer-copyright">© 2026 CHRONICLE</span>
        <a className="back-to-top" href="#top">BACK TO THE BEGINNING <ArrowUpRight aria-hidden="true" /></a>
      </footer>
    </main>
  );
}
