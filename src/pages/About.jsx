import { Award, HeartPulse, PackageCheck, ShieldCheck } from "lucide-react";
import "./InfoPages.css";

const values = [
  {
    icon: ShieldCheck,
    title: "Practical Safety",
    text: "Every kit is arranged around real use cases, so essentials are easy to find when time matters.",
  },
  {
    icon: PackageCheck,
    title: "Organized Supplies",
    text: "Components are grouped clearly for homes, clinics, workplaces, travel bags, and restock shelves.",
  },
  {
    icon: Award,
    title: "Quality Checked",
    text: "We focus on dependable medical components, clean packaging, and consistent product presentation.",
  },
];

const About = () => {
  return (
    <div className="info-page">
      <section className="info-hero about-hero">
        <div className="container info-hero-grid">
          <div className="info-hero-copy fade-up">
            <span className="breadcrumb">Home &rsaquo; About</span>
            <h1>Prepared care, packed with purpose.</h1>
            <p>
              pharmaultimate curates medical kits and healthcare components for
              people who want their care supplies to be visible, organized, and
              ready before they are urgently needed.
            </p>
          </div>
          <div className="info-hero-media fade-up">
            <img
              src="/images/about-medical-components.svg"
              alt="Medical components arranged in a clean kit"
            />
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container split-section">
          <div className="split-copy fade-up">
            <span className="eyebrow">Our Approach</span>
            <h2>
              Medical supplies should be simple to choose and easy to restock.
            </h2>
          </div>
          <div className="split-text fade-up">
            <p>
              We build our catalog around everyday care scenarios: first aid,
              wound care, PPE, diagnostics, emergency response, and clinic
              restocking. The goal is straightforward: less searching, fewer
              missing items, and more confidence when someone needs help.
            </p>
            <p>
              From compact home kits to larger workplace hampers, each product
              is presented with clear categories and dependable components so
              customers can choose quickly.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container">
          <div className="section-header info-section-header fade-up">
            <h2>What Guides Us</h2>
          </div>
          <div className="value-grid">
            {values.map(({ icon: Icon, title, text }) => (
              <div className="value-card fade-up" key={title}>
                <div className="value-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-dark-section">
        <div className="container care-strip fade-up">
          <HeartPulse size={32} />
          <h2>Built for homes, clinics, offices, and travel.</h2>
          <p>
            Whether you are preparing a family cabinet or a workplace medical
            shelf, pharmaultimate helps you keep essential care components close
            at hand.
          </p>
          <a href="/shop" className="btn-primary">
            Shop Medical Kits
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
