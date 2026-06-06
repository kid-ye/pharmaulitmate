import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "../constants";
import { subscribeNewsletter } from "../api/client";
import postpartumKitMain from "../assets/postpartum-kit-main.jpg"; // Correct extension (e.g., .jpg or .png)
import "./Home.css";

const slides = [
  {
    image: new URL("../assets/postpartum-kit-box.jpg", import.meta.url).href,
    tag: "New Arrival",
    title: "Medical Kits for Everyday Care",
    subtitle:
      "Organized first aid, diagnostic, and home care essentials for fast, confident response.",
  },
  // ,
  // {
  //   image: "/images/hero-diagnostics.svg",
  //   tag: "Diagnostics",
  //   title: "Reliable Components, Ready to Use",
  //   subtitle:
  //     "Shop practical thermometers, oximeters, stethoscopes, PPE, and clinical supply packs.",
  // },
  // {
  //   image: "/images/hero-emergency-care.svg",
  //   tag: "Emergency Preparedness",
  //   title: "Care Kits Built for Urgent Moments",
  //   subtitle:
  //     "Compact emergency kits for homes, clinics, workplaces, and travel.",
  // },
];

const testimonials = [
  {
    quote:
      "The first aid kit is neatly packed and easy to use during rushed moments.",
    name: "Priya S., Bangalore",
  },
  {
    quote:
      "Our clinic restocked wound care components from here and the quality felt consistent.",
    name: "Ananya R., Mumbai",
  },
  {
    quote:
      "The emergency hamper made our office medical shelf feel properly prepared.",
    name: "Meera K., Delhi",
  },
];

const Home = ({ onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await subscribeNewsletter(newsletterEmail);
      setNewsletterMsg("Subscribed!");
      setNewsletterEmail("");
    } catch (err) {
      setNewsletterMsg(err.message);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="home-page">
      <section className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="container slide-content">
              <div className="slide-text">
                <span className="pill-tag text-uppercase">{slide.tag}</span>
                <h1 className="hero-h1">{slide.title}</h1>
                <p className="hero-sub">{slide.subtitle}</p>
                <div className="hero-btns">
                  <button className="btn-primary">Shop Now &rarr;</button>
                  <button className="btn-outline-white">Our Story</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="slider-arrow left" onClick={prevSlide}>
          <ChevronLeft size={32} />
        </button>
        <button className="slider-arrow right" onClick={nextSlide}>
          <ChevronRight size={32} />
        </button>

        <div className="slider-dots">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              className={`dot ${i === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      <div className="gold-marquee">
        <div className="marquee-content-strip">
          <span>
            Medical Kits - Diagnostic Components - PPE Packs - Wound Care - Fast
            Delivery -
          </span>
          <span>
            Medical Kits - Diagnostic Components - PPE Packs - Wound Care - Fast
            Delivery -
          </span>
        </div>
      </div>

      <section className="section bg-cream">
        <div className="container">
          <div className="about-grid">
            <div className="about-images fade-up">
              <img
                src={postpartumKitMain}
                alt="Medical components arranged in a kit"
                className="img-main"
              />
            </div>
            <div className="about-text fade-up">
              <span className="eyebrow">Welcome to our</span>
              <h2 className="section-title">
                Medical Supply Store
                <svg
                  className="squiggly"
                  viewBox="0 0 200 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 10 Q 25 20, 50 10 T 100 10 T 150 10 T 200 10"
                    fill="transparent"
                    stroke="var(--accent)"
                    strokeWidth="3"
                  />
                </svg>
              </h2>
              <p className="body-text">
                We curate practical medical kits and components for homes,
                clinics, workplaces, and travel. Every product is selected to
                keep essential supplies visible, organized, and ready when care
                cannot wait.
              </p>
              <div className="stat-pills">
                <span className="stat-pill">Made in India</span>
                <span className="stat-pill">Clinic Ready</span>
                <span className="stat-pill">10,000+ Customers</span>
              </div>
              <a href="/about" className="text-link text-accent">
                Discover Our Story &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="self-care-banner">
        <div className="banner-overlay">
          <div className="container text-center fade-up">
            <h2 className="banner-title">Complete Medical Care - In a Box</h2>
            <button className="btn-primary">Shop Medical Kits &rarr;</button>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container">
          <div className="about-grid reverse">
            <div className="about-text fade-up">
              <span className="eyebrow">Prepared Care</span>
              <h2 className="section-title">Prepared Care Starts Here</h2>
              <p className="body-text">
                Build a supply shelf that is simple to check, quick to restock,
                and ready for everyday care needs. Choose from kits, components,
                and safety packs built for practical use.
              </p>
              <button className="btn-primary" style={{ marginTop: "1.5rem" }}>
                Shop Medical Kits &rarr;
              </button>
            </div>
            <div className="about-images fade-up">
              <img
                src={
                  new URL("../assets/postpartum-kit-main.jpg", import.meta.url)
                    .href
                }
                alt="Medical supply kits prepared for delivery"
                className="img-main"
              />
              {/* <img
                src="/images/product-home-care-kit.svg"
                alt="Home care medical kit"
                className="img-offset-left"
              /> */}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-charcoal-section">
        <div className="container">
          <h2
            className="text-center text-white fade-up"
            style={{
              marginBottom: "3rem",
              fontSize: "2.5rem",
              fontFamily: "var(--font-heading)",
            }}
          >
            What Our Community Says
          </h2>
          <div className="testimonials-grid">
            {testimonials.map((test) => (
              <div key={test.name} className="testimonial-card fade-up">
                <div className="stars">
                  <Star size={16} fill="var(--gold)" color="var(--gold)" />
                  <Star size={16} fill="var(--gold)" color="var(--gold)" />
                  <Star size={16} fill="var(--gold)" color="var(--gold)" />
                  <Star size={16} fill="var(--gold)" color="var(--gold)" />
                  <Star size={16} fill="var(--gold)" color="var(--gold)" />
                </div>
                <p className="quote">"{test.quote}"</p>
                <p className="author">- {test.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">Pan India Delivery</div>
            <div className="trust-item">Online Support</div>
            <div className="trust-item">
              Free Shipping Above Rs.{FREE_SHIPPING_THRESHOLD}
            </div>
            <div className="trust-item">Made in India</div>
          </div>
        </div>
      </div>

      <section className="newsletter-section">
        <div className="container text-center fade-up">
          <h2 className="newsletter-title">Get Medical Supply Updates</h2>
          <form className="newsletter-form-inline" onSubmit={handleNewsletter}>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button type="submit" className="btn-dark">
              Subscribe &rarr;
            </button>
          </form>
          {newsletterMsg && (
            <p
              style={{
                marginTop: "0.75rem",
                color: "var(--accent)",
                fontSize: "14px",
              }}
            >
              {newsletterMsg}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
