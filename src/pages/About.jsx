import "./InfoPages.css";
import foundersGroup from "../assets/foundersgrouppic.jpeg";
import drABR from "../assets/drABR.jpeg";
import MHM from "../assets/MHM.jpeg";
import drVV from "../assets/drVV.jpeg";

const founders = [
  {
    image: drABR,
    name: "Dr. ABR",
    heading: "Dedicated Care For Women, Mothers, And Families",
    reverse: false,
    content: [
      "An experienced obstetrician and gynecologist, and a proud mother of two, she brings together years of medical expertise with the empathy and understanding that come from personal experience. Her approach to care is rooted in compassion, trust, and a genuine desire to support women through some of the most important moments of their lives.",
      "A compassionate, energetic, and dedicated healthcare professional, she is deeply committed to improving women’s health and well-being. She believes that every woman deserves personalized attention, respectful care, and the confidence to make informed decisions about her health and future.",
      "Passionate about supporting mothers through every stage of their journey, she provides guidance and reassurance from pregnancy to childbirth and postpartum recovery. Her focus is not only on physical health, but also on creating a positive, comfortable, and emotionally supportive experience for every mother and family she cares for.",
      "Driven by purpose, ambition, and a deep commitment to care, she strives to make a meaningful difference in the lives of women every day. With a patient-first approach and a strong dedication to excellence, she continues to inspire confidence, comfort, and trust in everyone who walks through her doors."
    ]
  },
  {
    image: MHM,
    name: "MHM",
    heading: "Empowering Mothers Through Knowledge, Care, And Compassion",
    reverse: true,
    content: [
      "A passionate professor, devoted mother, and driven entrepreneur who believes in inspiring and empowering women through knowledge, care, and compassion.",
      "Inspired by her own motherhood journey, she is dedicated to creating a meaningful and lasting impact in the lives of mothers and families. Her experiences have shaped her understanding, empathy, and commitment toward women’s well-being.",
      "Deeply focused on nurturing, guiding, and supporting every mother through her unique journey, she strives to create a safe, positive, and encouraging environment where women feel heard, valued, and cared for.",
      "Committed to uplifting and empowering women through her work, she combines passion, purpose, and dedication to make a difference in every life she touches, helping women grow with confidence, strength, and support."
    ]
  },
  {
    image: drVV,
    name: "Dr. VV",
    heading: "Compassionate Healthcare With Energy, Creativity, And Purpose",
    reverse: false,
    content: [
      "A dedicated medical professional on the inspiring journey toward becoming a doctor, driven by a strong desire to make a meaningful difference in the lives of women and families.",
      "A young, passionate, and purpose-driven individual who believes in combining knowledge, compassion, and determination to create a positive impact in healthcare and beyond.",
      "Inspired by the belief that empowered mothers build strong families and stronger communities, she is committed to supporting women with care, encouragement, and understanding at every stage of life.",
      "Beyond her professional aspirations, she is a vibrant and creative personality who enjoys dancing, singing, styling, and fashion, bringing energy, confidence, and positivity into everything she does."
    ]
  }
];

const About = () => {
  return (
    <div className="info-page">
      {/* SECTION 1: HERO / MEET THE FOUNDERS */}
      <section className="founders-group-section">
        <div className="founders-group-container">
          <div className="founders-group-text fade-up">
            <span className="story-label">OUR STORY</span>
            <h1 className="story-heading">Meet The Founders</h1>
            <p className="story-paragraph" style={{ maxWidth: "750px" }}>
              Behind Womb and Beyond is a passionate team of women united by care, compassion, and purpose. With backgrounds in healthcare, education, motherhood, and entrepreneurship, our founders came together with one shared vision — to support mothers and families through every stage of their journey with comfort, confidence, and trusted care.
            </p>
          </div>
          <div className="founders-group-image-wrap fade-up" style={{ animationDelay: "150ms" }}>
            <img src={foundersGroup} alt="Meet the Founders" className="founders-group-image" />
          </div>
        </div>
      </section>

      {/* SECTION 2: FOUNDER PROFILE SECTIONS */}
      {founders.map((founder, index) => (
        <section key={index} className="our-story-section" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <div className={`story-container ${founder.reverse ? 'reverse' : ''}`}>
            <div className="story-image-wrap fade-up">
              <img src={founder.image} alt={founder.name} className="story-image" />
            </div>
            <div className="story-content fade-up">
              <span className="story-label">FOUNDER</span>
              <h1 className="story-heading">{founder.heading}</h1>
              {founder.content.map((paragraph, i) => (
                <p key={i} className="story-paragraph">{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default About;
