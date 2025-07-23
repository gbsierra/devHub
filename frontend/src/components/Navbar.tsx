import { Link } from "react-router-dom";
import { useCurrentUser } from '../hooks/currentUser';
import { Logo } from '../assets/logo';

export default function Navbar() {
  const { currentUser } = useCurrentUser();

  return (
    <>
      <nav className="bg-[rgba(0,0,0,0.08)] backdrop-blur-[6px] backdrop-saturate-[180%] fixed top-[8px] left-[50%] translate-x-[-300px] w-[600px] px-[16px] py-[8px] rounded-[12px] shadow-[0_12px_28px_rgba(0,0,0,0.55)] z-[100]">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          {/* Logo/Brand */}
          <div className="flex justify-start">
            <Link to="/">
              <Logo size="md" showText={true} />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center">
            <div className="flex space-x-[16px]" >

              <Link to="/">
                Home
              </Link>

              <Link to="/explore">
                Explore
              </Link>

              <Link to="/about">
                About
              </Link>
            </div>
          </div>

          {currentUser && currentUser.name ? 
            /* Profile Picture */
            (<div className="flex justify-end ">
              <Link to={`/profile/${currentUser.name}`}>
                <img
                  src={currentUser.avatarUrl}
                  alt={`${currentUser.name}'s avatar`}
                  className="w-[33px] h-[33px] rounded-full shadow-md transition duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-106 mt-[5px] mb-[2px]"
                />
              </Link>
            </div>) : 
            (<div className="flex justify-end">
              {/* Login Button */}
              <Link to="/auth">
                <button className="m-[6px] px-[10px] py-[5px] rounded-lg">
                  Login
                </button>
              </Link>
            </div>
          )}

        </div>
      </nav>

      {/* offsetting fixed navbar height */}
      <div className="h-[24px]"></div>
    </>
  );
}