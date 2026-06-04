import { BRAND_EMAIL, BRAND_NAME } from "../constants";
import "./InfoPages.css";

const sections = [
  {
    title: "Using our website",
    body: `By using ${BRAND_NAME}, you agree to provide accurate information, keep your account secure, and use the website only for lawful shopping, account, and support purposes.`,
  },
  {
    title: "Product information",
    body: "We work to keep product names, images, pricing, stock, and descriptions accurate. Minor variations may occur, and availability can change before an order is confirmed.",
  },
  {
    title: "Medical product notice",
    body: "Products listed on this website are intended for general healthcare, preparedness, and care support use. Information on the website is not medical advice and should not replace guidance from a qualified healthcare professional.",
  },
  {
    title: "Orders and payment",
    body: "Orders are accepted after successful checkout and confirmation. We may cancel or contact you about an order if payment fails, stock is unavailable, delivery information is incomplete, or misuse is suspected.",
  },
  {
    title: "Shipping and returns",
    body: "Delivery timelines depend on destination, courier availability, and order processing. Return or replacement eligibility may vary by product type, condition, hygiene requirements, and applicable law.",
  },
  {
    title: "Account responsibility",
    body: "You are responsible for activity under your account. Please keep your password secure and notify us if you believe your account or order information has been accessed without permission.",
  },
];

const Terms = () => {
  return (
    <div className="info-page legal-page">
      <section className="legal-hero terms-hero">
        <div className="container legal-hero-inner fade-up">
          <span className="breadcrumb">Home &rsaquo; Terms of Service</span>
          <h1>Terms of Service</h1>
          <p>
            These terms describe the basic rules for using {BRAND_NAME},
            purchasing products, and managing your account.
          </p>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container legal-layout">
          <aside className="legal-summary fade-up">
            <span className="eyebrow">Last updated</span>
            <p>May 17, 2026</p>
            <span className="eyebrow">Support</span>
            <a href={`mailto:${BRAND_EMAIL}`}>{BRAND_EMAIL}</a>
          </aside>

          <div className="legal-content fade-up">
            {sections.map((section) => (
              <article className="legal-section" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </article>
            ))}

            <article className="legal-section">
              <h2>Changes to these terms</h2>
              <p>
                We may update these Terms of Service from time to time. By
                continuing to use the website after updates are posted, you
                agree to the revised terms.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
