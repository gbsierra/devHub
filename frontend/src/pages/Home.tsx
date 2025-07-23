import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import Silk from '../components/Silk';
import Footer from '../components/Footer';
import { useListings } from '../hooks/listings';
import { Logo } from '../assets/logo';


export default function Home() {

  // fetch recently active developers
  const { listings } = useListings('recent');

  // reference for scroll target
  const scrollTargetRef = useRef<HTMLDivElement | null>(null);
  // Function to handle scroll to the target section
  const handleScroll = () => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      {/* Background Animation */}
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, pointerEvents: 'none', overflow: 'hidden',}}>
        <Silk speed={5} scale={1} color="#9369e2d4" noiseIntensity={2.3} rotation={1} />
      </div>


      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center">
        <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Logo size="xl" /> <span className="-ml-[10px] mt-[8px]">, the Developer Social Media.</span>
        </h1>

        <p className="-mt-[20px] text-[18.5px] text-[lightgrey]"> Track your projects, collaborate effortlessly, and stay inspired—tailored for modern devs. </p>

        <div className="flex justify-center gap-[10px]">
          <Link to="/auth">
            <button className="px-[20px] py-[13px] transition duration-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-107">
              Get Started
            </button>
          </Link>
          <button className="px-[20px] py-[13px] transition duration-800 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-107" onClick={handleScroll} >
            Discover Projects
          </button>
        </div>

      </section>

      {/* Recently Active Developers */}
      <section ref={scrollTargetRef} className="py-[80px]">
        <h2 className="text-center"> Recently Active Developers </h2>
        <div>
          {listings.length === 0 ? (
            <p className="text-center">No recent developer listings found. </p> ) : 
          (
            listings.map((profile, index) => (
              <motion.div key={profile.name} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }} viewport={{ once: true, amount: 0.3 }} className="text-center">
                <h3>{profile.name}</h3>
                <Link to={`/profile/${profile.name}`}> <button>View Profile</button> </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <Footer/>
    </main>
  );
}