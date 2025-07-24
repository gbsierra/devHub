import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-[15px] py-[10px]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm mb-[1px]">&copy; {new Date().getFullYear()} DevHub. All rights reserved.</p>
        <div className="flex space-x-[10px] mt-[5px]">
          <Link to="/privacy-policy" target="_blank" className="hover:scale-103 transition duration-350">Privacy Policy</Link>
          <Link to="/terms-of-service" target="_blank" className="hover:scale-103 transition duration-350">Terms of Service</Link>
          <Link to="/contact" target="_blank" className="hover:scale-103 transition duration-350">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;