import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { BRAND_NAME, FREE_SHIPPING_THRESHOLD } from '../constants';
import './Home.css';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=2000",
    tag: "New Arrival ✦ 2025",
    title: "Your Journey to Becoming Starts Here",
    subtitle: "Embrace the process with our handcrafted planners and journals."
  },
  {
    image: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=2000",
    tag: "Mindful Living",
    title: "Self Care Isn't Selfish. It's Sacred.",
    subtitle: "Carve out time for yourself with intention and beauty."
  },
  {
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000",
    tag: "Workspace Essentials",
    title: "Calm Corners, Bold Ambitions.",
  }
];

const products = [
  { id: 1, name: "Balance Baby Balance 2025 Planner", price: 1299, originalPrice: 1799, discount: null, isNew: false, image1: "https://picsum.photos/seed/planner1a/600/800", image2: "https://picsum.photos/seed/planner1b/600/800" },
  { id: 2, name: "Feel Your Feelings Guided Journal", price: 849, originalPrice: 1299, discount: 34, isNew: false, image1: "https://picsum.photos/seed/journal1a/600/800", image2: "https://picsum.photos/seed/journal1b/600/800" },
  { id: 3, name: "Calm Corners of India Coloring Book", price: 399, originalPrice: 699, discount: 42, isNew: false, image1: "https://picsum.photos/seed/color1a/600/800", image2: "https://picsum.photos/seed/color1b/600/800" },
  { id: 4, name: "The Ultimate Unwinding Kit", price: 1999, originalPrice: null, discount: null, isNew: true, image1: "https://picsum.photos/seed/kit1a/600/800", image2: "https://picsum.photos/seed/kit1b/600/800" },
  { id: 5, name: "The Becoming Hamper", price: 2499, originalPrice: null, discount: null, isNew: false, image1: "https://picsum.photos/seed/hamper1a/600/800", image2: "https://picsum.photos/seed/hamper1b/600/800" },
  { id: 6, name: "Affirmation Cards Deck", price: 599, originalPrice: null, discount: null, isNew: false, image1: "https://picsum.photos/seed/cards1a/600/800", image2: "https://picsum.photos/seed/cards1b/600/800" }
];

const testimonials = [
  { quote: "This planner changed how I approach my mornings.", name: "Priya S., Bangalore" },
  { quote: "The coloring book is pure therapy. Gifted it to 5 friends.", name: "Ananya R., Mumbai" },
  { quote: "The unwinding kit was the reset I needed.", name: "Meera K., Delhi" }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="home-page">
      {/* Hero Slider */}
      <section className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
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

        <button className="slider-arrow left" onClick={prevSlide}><ChevronLeft size={32} /></button>
        <button className="slider-arrow right" onClick={nextSlide}><ChevronRight size={32} /></button>

        <div className="slider-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* Marquee Strip */}
      <div className="gold-marquee">
        <div className="marquee-content-strip">
          <span>Made in India ✦ Handmade Design ✦ Fueling Your Hustle ✦ Self Care First ✦ Balance is Everything ✦</span>
          <span>Made in India ✦ Handmade Design ✦ Fueling Your Hustle ✦ Self Care First ✦ Balance is Everything ✦</span>
        </div>
      </div>

      {/* About Section */}
      <section className="section bg-cream">
        <div className="container">
          <div className="about-grid">
            <div className="about-images fade-up">
              <img src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800" alt="Journaling" className="img-main" />

            </div>
            <div className="about-text fade-up">
              <span className="eyebrow">Welcome to our</span>
              <h2 className="section-title">
                World of BECOMING
                <svg className="squiggly" viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10 Q 25 20, 50 10 T 100 10 T 150 10 T 200 10" fill="transparent" stroke="var(--accent)" strokeWidth="3" />
                </svg>
              </h2>
              <p className="body-text">
                In a world that constantly rushes, we invite you to pause. We believe that true ambition is rooted in self-care. Our collections are thoughtfully designed to bring balance to your everyday life while honoring rich Indian wellness traditions.
              </p>
              <div className="stat-pills">
                <span className="stat-pill">🌿 Made in India</span>
                <span className="stat-pill">✦ Handmade</span>
                <span className="stat-pill">💛 10,000+ Customers</span>
              </div>
              <a href="/about" className="text-link text-accent">Discover Our Story &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-surface">
        <div className="container">
          <div className="section-header fade-up">
            <h2>Featured Products</h2>
            <a href="/shop" className="text-link text-accent">View All &rarr;</a>
          </div>

          <div className="product-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                className="fade-up"
                name={product.name}
                brandTag={BRAND_NAME}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                isNew={product.isNew}
                imagePrimary={product.image1}
                imageSecondary={product.image2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Self-Care Banner */}
      <section className="self-care-banner">
        <div className="banner-overlay">
          <div className="container text-center fade-up">
            <h2 className="banner-title">Your Ultimate Self Care — In a Box</h2>
            <button className="btn-primary">Shop Self-Care Kits &rarr;</button>
          </div>
        </div>
      </section>

      {/* Join the Journey */}
      <section className="section bg-cream">
        <div className="container">
          <div className="about-grid reverse">
            <div className="about-text fade-up">
              <span className="eyebrow">Community</span>
              <h2 className="section-title">Join Us on This Journey</h2>
              <p className="body-text">
                Your goals matter, and so does your peace of mind. Build a ritual that supports your ambition and grounds your spirit with our carefully crafted tools.
              </p>
              <button className="btn-primary" style={{ marginTop: '1.5rem' }}>Shop Planners &rarr;</button>
            </div>
            <div className="about-images fade-up">
              <img src="https://images.unsplash.com/photo-1522881451255-f59ad836fdf8?auto=format&fit=crop&q=80&w=800" alt="Community" className="img-main" />
              <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=500" alt="Details" className="img-offset-left" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-charcoal-section">
        <div className="container">
          <h2 className="text-center text-white fade-up" style={{ marginBottom: '3rem', fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>
            What Our Community Says
          </h2>
          <div className="testimonials-grid">
            {testimonials.map((test, i) => (
              <div key={i} className="testimonial-card fade-up">
                <div className="stars">
                  <Star size={16} fill="var(--gold)" color="var(--gold)" />
                  <Star size={16} fill="var(--gold)" color="var(--gold)" />
                  <Star size={16} fill="var(--gold)" color="var(--gold)" />
                  <Star size={16} fill="var(--gold)" color="var(--gold)" />
                  <Star size={16} fill="var(--gold)" color="var(--gold)" />
                </div>
                <p className="quote">"{test.quote}"</p>
                <p className="author">— {test.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">🚚 Pan India Delivery</div>
            <div className="trust-item">💬 Online Support</div>
            <div className="trust-item">🎁 Free Shipping Above ₹{FREE_SHIPPING_THRESHOLD}</div>
            <div className="trust-item">🌿 Made in India</div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container text-center fade-up">
          <h2 className="newsletter-title">Join the Becoming Community</h2>
          <form className="newsletter-form-inline">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn-dark">Subscribe &rarr;</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
