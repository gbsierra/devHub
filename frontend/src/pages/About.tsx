import Footer from "../components/Footer";

function About() {
  return (
    <section>
      <div className="p-[30px] mt-[50px] bg-[var(--darkGrey)] shadow-[0_10px_10px_rgba(0,0,0,0.9)] rounded-[6px] w-[60%] mx-auto">
        <h2>Our Mission</h2>
        <p>
          DevHub exists to empower developers by simplifying how they find, explore, and collaborate on open-source GitHub projects. Whether you're new to contributing or deep in the ecosystem, we help you connect with work that matters.
        </p>

        <div>
          <div>
            <h3>Discovery</h3>
            <p>
              We curate projects across industries and skill levels so you spend less time scrolling and more time building.
            </p>
          </div>
          <div>
            <h3>Contribution</h3>
            <p>
              From beginner-friendly issues to advanced modules, we surface opportunities that match your interests and expertise.
            </p>
          </div>
          <div>
            <h3>Community</h3>
            <p>
              DevHub is built for collaboration. We foster a space where developers share insights, grow together, and make meaningful impact.
            </p>
          </div>
        </div>

        <div className="mb-[540px]">
          <h3>Contact Us</h3>
          <p>
            We'd love to hear from you — whether it's feedback, partnership ideas, or just to say hello. Reach out to us at <a href="mailto:support@devhub.io">support@devhub.io</a> or drop us a message via our GitHub Discussions page.
          </p>
        </div>
      </div>
      <footer className="mt-auto"><Footer /></footer>
    </section>
  );
}

export default About;