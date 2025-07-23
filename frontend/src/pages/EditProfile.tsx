import { useState, useEffect } from 'react';
import { useCurrentUser } from '../hooks/currentUser';
import { updateProfile } from '../hooks/updateProfile';
import { mutate } from 'swr';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  // Fetch current user data
  const { currentUser, userError, userLoading } = useCurrentUser();

  // Local state for editable fields
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [roles, setRoles] = useState<string>('');
  const [availability, setAvailability] = useState('');
  const [experience, setExperience] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);

  // Navigation hook
  const navigate = useNavigate();

  // Populate state with current user data
  useEffect(() => {
    if (currentUser) {
      setLocation(currentUser.location || '');
      setBio(currentUser.bio || "Just a GitHub user, stay tuned!");
      setPortfolioUrl(currentUser.portfolioUrl || '');
      setRoles(currentUser.roles || '');
      setAvailability(currentUser.availability || '');
      setExperience(currentUser.experience || '');
      try {
        const parsedLanguages = Array.isArray(currentUser.languages)
          ? currentUser.languages
          : JSON.parse(currentUser.languages || '[]');

        setLanguages(parsedLanguages);
      } catch (err) {
        console.error('Could not parse languages:', err);
        setLanguages([]);
}
    }
  }, [currentUser]);

  // Handle form submission 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = {
      location,
      bio,
      portfolioUrl,
      roles,
      availability,
      experience,
      languages,
    };

    // Call the updateProfile function with the updated data
    try {
      const res = await updateProfile(updatedData);
      mutate('http://localhost:3001/api/users/me'); // Force refetch of current user
      navigate('/profile'); // Redirect to profile page
      console.log('Profile updated:', res);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (userLoading) {
    return <div className="text-center p-[24px]">Loading profile...</div>;
  }

  if (userError || !currentUser) {
    return <div className="text-center p-[24px] text-[red]">Failed to load profile.</div>;
  }

  return (
    <div className="min-h-[100vh] flex justify-center items-center px-[16px]">
      <form onSubmit={handleSubmit} className="bg-[var(--darkGrey)] rounded-[16px] shadow-[10px_5px_5px_rgba(0,0,0,0.2)] p-[32px] space-y-[12px] max-w-[640px] w-full">
        <h2 className="text-[24px] font-bold text-center">Edit Your Profile</h2>

        {/* Uneditable Name Field with Tooltip */}
        <div className="relative group">
          <div className="w-[95%] border px-[16px] py-[8px] rounded-[8px] bg-[white] text-[rgb(107,114,128)] cursor-not-allowed">
            {currentUser.name}
          </div>
          <div className="absolute top-[100%] left-0 mt-[4px] bg-[black] text-[white] text-[12px] px-[8px] py-[4px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity z-[10]">
            You can't change your GitHub profile name here
          </div>
        </div>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-[95%] border px-[16px] py-[8px] rounded-[8px]"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-[95%] border px-[16px] py-[8px] rounded-[8px]"
        />

        {/* Programming Languages */}
        <div>
          <label className="block mb-[8px]">Programming Languages</label>
          <div className="max-h-[160px] overflow-y-auto flex flex-wrap gap-[8px] pr-[4px]">
            {[
              "JavaScript", "TypeScript", "Python", "Java", "C++", "Ruby", "Go", "Rust", "Kotlin",
              "Swift", "C", "HTML/CSS", "C#", "PHP", "Scala", "Dart", "Elixir", "Perl", "R", "Assembly",
              "Haskell", "Bash", "MATLAB"
            ].map((lang) => (
              <button
                type="button"
                key={lang}
                onClick={() =>
                  setLanguages((prev: string[]) =>
                    prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
                  )
                }
                className={`px-[12px] py-[4px] rounded-[999px] border ${
                  languages.includes(lang)
                    ? 'bg-[rgb(199,210,254)] text-[rgb(55,65,81)]'
                    : 'bg-[white] text-[rgb(79,70,229)]'
                } border-[rgb(199,210,254)] hover:bg-[rgb(238,242,255)] transition`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Role Types */}
        <div>
          <label className="block mb-[8px]">Roles</label>
          <select
            value={roles}
            onChange={(e) => setRoles(e.target.value)}
            className="w-full border px-[16px] py-[8px] rounded-[8px]"
          >
            {[
              "No Preference",
              "Software Engineer",
              "Frontend Developer",
              "Backend Developer",
              "Full Stack Engineer",
              "Software Architect",
              "Mobile Developer",
              "Data Engineer",
              "DevOps Engineer",
              "Machine Learning Engineer",
              "QA Engineer"
            ].map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Job Availability */}
        <div>
          <label className="font-semibold block mb-[8px]">Job Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full border px-[16px] py-[8px] rounded-[8px]"
          >
            {["No Preference", "Full-Time", "Part-Time", "Internship", "Co-op", "Freelance", "Contract"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block mb-[8px]">Experience Level</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full border px-[16px] py-[8px] rounded-[8px]"
          >
            {["Junior", "Mid-Level", "Senior", "Lead"].map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Portfolio URL */}
        <input
          type="url"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          placeholder="Portfolio URL"
          className="w-[95%] border px-[16px] py-[8px] rounded-[8px]"
        />

        <button
          type="submit"
          className="w-full py-[12px] bg-[rgb(99,102,241)] rounded-[8px] hover:bg-[rgb(79,70,229)] transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}