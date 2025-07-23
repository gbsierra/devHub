import Footer from "../components/Footer";

function Contact() {
  return (
    <section>
      <div className="p-[30px] mt-[50px] bg-[var(--darkGrey)] shadow-[0_10px_10px_rgba(0,0,0,0.9)] rounded-[6px] w-[60%] mx-auto">
        <h2>Get in Touch</h2>
        <p>
          Whether you’ve got a question, need support, or want to collaborate, we’d love to hear from you. Use the details below or drop us a line via our GitHub page.
        </p>

        <div className="mt-[40px]">
          <div className="mb-[20px]">
            <h3>Email</h3>
            <p>
              Reach us directly at{" "}
              <a href="mailto:contact@devhub.io" className="text-[var(--lightBlue)] hover:underline">
                contact@devhub.io
              </a>
            </p>
          </div>

          <div className="mb-[20px]">
            <h3>GitHub Discussions</h3>
            <p>
              Post questions, share ideas, or browse our community threads on{" "}
              <a
                href="https://github.com/devhub/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--lightBlue)] hover:underline"
              >
                GitHub Discussions
              </a>.
            </p>
          </div>

          <div className="mb-[20px]">
            <h3>Social</h3>
            <p>
              Follow us on{" "}
              <a
                href="https://twitter.com/devhub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--lightBlue)] hover:underline"
              >
                Twitter
              </a>{" "}
              and{" "}
              <a
                href="https://linkedin.com/company/devhub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--lightBlue)] hover:underline"
              >
                LinkedIn
              </a>{" "}
              for updates, events, and announcements.
            </p>
          </div>
        </div>
      </div>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </section>
  );
}

export default Contact;