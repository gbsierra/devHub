import { Link } from "react-router-dom";
import { useCurrentUser } from '../hooks/currentUser';
import { Logo } from '../assets/logo';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { currentUser } = useCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ignore clicks inside the dropdown trigger or panel
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) return;
      // Close only if clicked outside
      setDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-[rgba(0,0,0,0.08)] backdrop-blur-[10px] backdrop-saturate-[240%] fixed top-[8px] left-[50%] translate-x-[-300px] w-[600px] px-[16px] py-[8px] rounded-[12px] shadow-[0_12px_28px_rgba(0,0,0,0.55)] z-[100]">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          {/* Logo/Brand */}
          <div className="w-[50%] flex justify-start transition duration-400 hover:scale-104">
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
            (<div className="flex justify-end relative">
              <div onClick={() => setDropdownOpen(!dropdownOpen)} className="cursor-pointer">
                <img
                  src={currentUser.avatarUrl}
                  alt={`${currentUser.name}'s avatar`}
                  className="w-[33px] h-[33px] rounded-full shadow-md transition duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-106 mt-[5px] mb-[2px]"
                />
              </div>

              {dropdownOpen && (
                <div ref={dropdownRef} className="absolute bg-[rgba(80,80,80,0.76)] fixed px-[4px] py-[5px] shadow-[0_12px_28px_rgba(0,0,0,0.55)] z-[100] top-[45px] w-[170px] rounded-[4px]">

                      <Link to={`/profile/${currentUser.name}`} className="text-[white] block px-[40px] py-[4px]">
                        View Profile
                      </Link>

                      <Link to="/settings" className="text-[white] block px-[40px] py-[4px]">
                        Settings
                      </Link>

                      <Link to="http://localhost:3001/auth/logout" className="transition duration-300 hover:scale-103 block px-[40px] py-[4px]">
                        Sign out
                      </Link>
  
                </div>
              )}
            </div>
)
             : 
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