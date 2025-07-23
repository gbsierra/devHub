import Footer from '../components/Footer';
import { ListingList } from '../components/ListingCard';

export default function Explore() {
  return (
    <>
      <section className="mx-auto items-center w-[80%] mt-[65px] bg-[var(--darkGrey)] min-h-screen shadow-[0_10px_10px_rgba(0,0,0,0.9)] rounded-[6px]">
        <h2 className="ml-[30px] py-[32px] -mb-[10px] mt-[70px] ">
          Explore Listings
        </h2>

        <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[6px]">
          <ListingList />
        </div>
      </section>

      <Footer />
    </>
  );
}