import { BRAND_EMAIL, BRAND_NAME } from "../constants";
import "./InfoPages.css";

const sections = [
  {
    title: "Information we collect",
    body: "We collect the details needed to run the store, including your name, email address, phone number, delivery address, account details, cart activity, order history, payment status, and messages you send to our support team.",
  },
  {
    title: "How we use your information",
    body: "We use your information to create and manage your account, process orders, arrange delivery, provide customer support, improve our product catalog, prevent misuse, and send service updates related to your purchase.",
  },
  {
    title: "Payments and delivery partners",
    body: "Payment and shipping information may be shared with trusted service providers only when required to complete your order, verify payment, create shipping labels, send tracking updates, or resolve delivery issues.",
  },
  {
    title: "Cookies and local storage",
    body: "Our website may use browser storage to keep you signed in, remember cart items, and improve the shopping experience. You can clear this data through your browser settings, though some features may stop working as expected.",
  },
  {
    title: "Data security",
    body: "We use reasonable technical and organizational safeguards to protect account and order information. No online service can be guaranteed completely secure, so please keep your login details private.",
  },
  {
    title: "Your choices",
    body: "You can update account details from your profile page, contact us for support with personal information requests, and opt out of non-essential marketing messages when those options are available.",
  },
];

const Privacy = () => {
  return (
    <div className="info-page legal-page">
      <section className="legal-hero">
        <div className="container legal-hero-inner fade-up">
          <span className="breadcrumb">Home &rsaquo; Privacy Policy</span>
          <h1>Privacy Policy</h1>
          <p>
            This policy explains how {BRAND_NAME} handles personal information
            when you browse, create an account, place an order, or contact us.
          </p>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container legal-layout">
          <aside className="legal-summary fade-up">
            <span className="eyebrow">Last updated</span>
            <p>May 17, 2026</p>
            <span className="eyebrow">Questions</span>
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
              <h2>Policy updates</h2>
              <p>
                We may update this Privacy Policy as our website, operations,
                or legal requirements change. The latest version will always be
                posted on this page.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
