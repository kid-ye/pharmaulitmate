import "./InfoPages.css";
import foundersGroup from "../assets/foundersgrouppic.jpeg";
import drABR from "../assets/drABR.jpeg";
import MHM from "../assets/MHM.jpeg";
import drVV from "../assets/drVV.jpeg";

const founders = [
  {
    image: drABR,
    name: "Dr. Aishwarya BR",
    heading: "Dedicated Care For Women, Mothers, And Families",
    reverse: false,
    content: [
      "An experienced obstetrician and gynecologist, and a proud mother of two, she combines medical expertise with the empathy that comes from personal experience. Compassionate, dedicated, and patient-focused, she is committed to providing personalized and respectful care for women at every stage of life.",
      "Passionate about supporting mothers through pregnancy, childbirth, and postpartum recovery, she strives to create a positive, comfortable, and emotionally supportive experience for every family. With a strong commitment to excellence and women’s well-being, she continues to inspire trust, confidence, and comfort in every patient she cares for.",
    ],
  },
  {
    image: MHM,
    name: "Mrs. Monisha HM",
    heading: "Empowering Mothers Through Knowledge, Care, And Compassion",
    reverse: true,
    content: [
      "A passionate professor, devoted mother, and driven entrepreneur who believes in inspiring and empowering women through knowledge, care, and compassion.",
      "Inspired by her own motherhood journey, she is dedicated to creating a meaningful and lasting impact in the lives of mothers and families. Her experiences have shaped her understanding, empathy, and commitment toward women’s well-being.",
      "Deeply focused on nurturing, guiding, and supporting every mother through her unique journey, she strives to create a safe, positive, and encouraging environment where women feel heard, valued, and cared for.",
      "Committed to uplifting and empowering women through her work, she combines passion, purpose, and dedication to make a difference in every life she touches, helping women grow with confidence, strength, and support.",
    ],
  },
  {
    image: drVV,
    name: "Dr. Varsha Manjunath",
    heading: "Compassionate Healthcare With Energy, Creativity, And Purpose",
    reverse: false,
    content: [
      "A dedicated medical professional on the inspiring journey toward becoming a doctor, she is driven by a strong desire to make a meaningful difference in the lives of women and families. Passionate, compassionate, and purpose-driven, she believes in combining knowledge, empathy, and determination to create a positive impact in healthcare and support women with care and understanding at every stage of life.",
      "Beyond her professional aspirations, she is a vibrant and creative individual who enjoys dancing, singing, styling, and fashion. Her energetic personality, confidence, and positivity reflect in everything she does, inspiring those around her while reinforcing her commitment to empowering women and building stronger communities.",
    ],
  },
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
              Behind Womb and Beyond is a passionate team of women united by
              care, compassion, and purpose. With backgrounds in healthcare,
              education, motherhood, and entrepreneurship, our founders came
              together with one shared vision — to support mothers and families
              through every stage of their journey with comfort, confidence, and
              trusted care.
            </p>
          </div>
          <div
            className="founders-group-image-wrap fade-up"
            style={{ animationDelay: "150ms" }}
          >
            <img
              src={foundersGroup}
              alt="Meet the Founders"
              className="founders-group-image"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: FOUNDER PROFILE SECTIONS */}
      {founders.map((founder, index) => (
        <section
          key={index}
          className="our-story-section"
          style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
        >
          <div
            className={`story-container ${founder.reverse ? "reverse" : ""}`}
          >
            <div className="story-image-wrap fade-up">
              <img
                src={founder.image}
                alt={founder.name}
                className="story-image"
              />
              <h3
                className="founder-name-caption"
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  fontSize: "1.8rem",
                  fontWeight: "600",
                }}
              >
                {founder.name}
              </h3>
            </div>
            <div className="story-content fade-up">
              <span className="story-label">FOUNDER</span>
              <h1 className="story-heading">{founder.heading}</h1>
              {founder.content.map((paragraph, i) => (
                <p key={i} className="story-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default About;
