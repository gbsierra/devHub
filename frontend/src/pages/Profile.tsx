import { useCurrentUser } from '../hooks/currentUser';
import { useRepos } from '../hooks/currentUser';
import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Footer from '../components/Footer';
import { ListingList } from '../components/ListingCard';

export default function Profile() {
  // Get userId from URL params
  const { userId } = useParams<{ userId: string }>();
  // Get current user data
  const { currentUser, userError, userLoading } = useCurrentUser();
  // Determine username to fetch profile
  const username = userId || currentUser?.name;

  // Fetch repositories for the current user
  const { repos, reposError, reposLoading } = useRepos();


  // State for profile being viewed
  const [profileUser, setProfileUser] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // State for selected repository and listing details
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);
  const [selectedRepoName, setSelectedRepoName] = useState<string>('');
  const [listingTitle, setListingTitle] = useState<string>('');
  const [listingBio, setListingBio] = useState<string>('');

  // Fetch profile for userId (or current user if no userId)
  useEffect(() => {
    setProfileLoading(true);
    setProfileError(null);

    const fetchProfile = async () => {
      try {
        if (!username) throw new Error('No username found');
        const res = await fetch(`http://localhost:3001/api/users/${username}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setProfileUser(data);
      } catch (err: any) {
        setProfileError(err.message);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  // Loading?
  if (userLoading || profileLoading) {
    return <div className="text-center py-6">Loading profile...</div>;
  }
  // Error?
  if ((!userId && userError) || profileError || !profileUser || typeof profileUser !== 'object') {
    console.error('Profile error:', userError, profileError, profileUser);
    return (
      <>
        <div className="text-center py-[500px] mb-[100px] text-[red]">
          Something went wrong loading this profile. Please reload the page.
        </div>
        <Footer />
      </>
    );
  }

  // declare profileUser properties with defaults
  const {
    name = 'N/A',
    avatarUrl,
    githubId = 'N/A',
    email,
    location = 'N/A',
    bio = 'N/A',
    portfolioUrl,
    experience = 'N/A',
    availability = 'N/A',
    roles,
    languages,
    id,
  } = profileUser;

  // Is this the current user's profile?
  const isCurrentUser = currentUser?.name === name;

  return (
    <div className="min-h-screen py-[10px]">
      <div className="mx-auto max-w-[1220px]">

        {/* Top Row */}
        <div className="flex justify-between items-start gap-[20px] mb-[42px] mt-[44px]">
          {/* Header */}
          <header className="flex items-center ml-[15px] gap-[10px]">
            <h1>Welcome, {name}</h1>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={`${name}'s avatar`}
                className="w-[70px] h-[70px] rounded-full shadow-md"
              />
            )}
          </header>

          {/* Profile Overview */}
          <section className="mt-[16px] bg-[var(--darkGrey)] shadow-[0_10px_10px_rgba(0,0,0,0.1)] p-[10px] rounded-[10px] w-[27.2%]">
            <div className="space-y-[15px] ml-[10px]">
              <h2 className="text-xl font-semibold">Overview:</h2>
              <div className="flex gap-[1rem] -mt-[25px] mb-[12px]">
                <ProfileItem label="Display Name" value={name} />
                <ProfileItem label="User ID" value={githubId} />
                <ProfileItem label="Email" value={email || 'N/A'} />
              </div>
              <div className="flex gap-[6px]">
                {isCurrentUser && (
                  <Link to="/profile/edit">
                    <button>Edit Profile</button>
                  </Link>
                )}
                <a
                  href={`https://github.com/${name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-4 py-2 bg-gray-100 border rounded hover:bg-gray-200">View GitHub</button>
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Account Information */}
        <section className="-mt-[15px] ml-auto w-[26%] bg-[var(--darkGrey)] shadow-[0_10px_10px_rgba(0,0,0,0.1)] p-[20px] rounded-[10px]">
          <h2 className="text-[20px] -mt-[5px] -mb-[8px]">Account Information:</h2>
          <div className="grid grid-cols-1">
            <ProfileItem label="Location" value={location} />
            <ProfileItem label="Bio" value={bio} />
            <ProfileItem
              label="Portfolio"
              value={
                portfolioUrl ? (
                  <a
                    href={portfolioUrl}
                    className="text-[rgb(37,99,235)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {portfolioUrl}
                  </a>
                ) : 'N/A'
              }
            />
            <ProfileItem label="Experience Level" value={experience || 'Newcomer'}/>
            <ProfileItem label="Job Availability" value={availability || 'No Availability'} />
            <ProfileItem label="Preferred Roles" value={roles || 'No Preference'} />
            <ProfileItem
              label="Programming Languages"
              value={
                Array.isArray(languages)
                  ? languages.length > 0
                    ? languages.join(', ')
                    : 'None selected'
                  : (() => {
                      try {
                        const parsed = JSON.parse(languages || '[]');
                        return parsed.length > 0 ? parsed.join(', ') : 'None selected';
                      } catch {
                        return 'None selected';
                      }
                    })()
              }
            />
          </div>
        </section>

        {/* Post a Repository - Only for current user */}
        {isCurrentUser && (
          <section className="-mt-[570px] w-[65%] bg-[var(--darkGrey)] shadow-[0_10px_10px_rgba(0,0,0,0.1)] p-[20px] rounded-[10px]">
            <h2>Post a repository</h2>
            {reposLoading ? (<p>Loading repositories...</p>) : reposError ? (<p>Error fetching repos: {reposError.message}</p>) : repos.length > 0 ? 
              (<form
                onSubmit={(e) => {
                  e.preventDefault();

                  const listingData = {
                    listingTitle,
                    listingBio,
                    repoId: selectedRepoId,
                    repoName: selectedRepoName,
                    githubId,
                    isPublic: 1
                  };

                  fetch('http://localhost:3001/listings/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(listingData)
                  })
                    .then((res) => {
                      if (res.ok) {
                        alert('Listing posted successfully!');
                        setListingTitle('');
                        setListingBio('');
                        setSelectedRepoId(null);
                      } else {
                        alert('Something went wrong.');
                      }
                    });
                }}
              >
                {/* Repo Selector */}
                <Select
                  options={repos.map(repo => ({ value: repo.id, label: repo.name }))}
                  isSearchable
                  placeholder="Search and select a repository"
                  value={
                    repos
                      .filter(repo => repo.id === selectedRepoId)
                      .map(repo => ({ value: repo.id, label: repo.name }))[0] || null
                  }
                  onChange={selectedOption => {
                    const selectedId = selectedOption?.value;
                    const selectedName = selectedOption?.label;
                    setSelectedRepoId(selectedId || null);
                    setSelectedRepoName(selectedName || 'No repository selected');
                  }}
                  styles={{
                    control: base => ({
                      ...base,
                      backgroundColor: 'var(--darkGrey)',
                      borderColor: 'gray',
                      color: 'white',
                    }),
                    menu: base => ({
                      ...base,
                      backgroundColor: 'var(--darkGrey)',
                    }),
                    singleValue: base => ({
                      ...base,
                      color: 'white',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? 'gray' : 'var(--darkGrey)',
                      color: 'white',
                    }),
                  }}
                />

                {/* Title Input */}
                <input
                  type="text"
                  id="listingTitle"
                  name="listingTitle"
                  placeholder="Listing Title"
                  value={listingTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setListingTitle(e.target.value)}
                  className="w-[80%] mt-[10px] p-[4px] border rounded-[3px] text-white"
                  required
                />

                {/* Bio Input */}
                <textarea
                  id="listingBio"
                  name="listingBio"
                  placeholder="Short bio or description"
                  value={listingBio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setListingBio(e.target.value)}
                  className="w-[98.5%] mt-[5px] p-[5px] bg-[var(--darkGrey)] border rounded-[3px]"
                  rows={4}
                  required
                />

                {/* Submit Button */}
                <button type="submit" className="mt-[4px] hover:bg-[blue]" onClick={ () => {window.location.reload();} } >
                  Post Listing
                </button>
              </form>
            ) : (<p>No repositories found.</p>)}
          </section>
        )}

        {/* My Listings */}
        <section className="min-h-[900px] mt-[30px] w-[65%] bg-[var(--darkGrey)] shadow-[0_10px_10px_rgba(0,0,0,0.1)] p-[20px] rounded-[10px]">
          <h2>{isCurrentUser ? 'My Listings' : `${name}'s Listings`}</h2>
          <ListingList mode='user' userName={name} userId={id}/>
        </section>

        {/* Coming Soon */}
        <section className="-mt-[605px] ml-auto w-[26%] bg-[var(--darkGrey)] shadow-[0_10px_10px_rgba(0,0,0,0.1)] p-[20px] rounded-[10px]">
          <h2 className="text-[22px] mb-[10px]">Coming Soon!</h2>
          <p className="text-[lightgrey] mb-[10px]">
            This space is being prepared for something exciting. We're building features that will elevate your experience!
          </p>
          <ProfileItem label="ETA" value="Fall 2025" />
          <p className="text-[grey] italic">
            Check back soon or stay tuned for updates—we promise it’ll be worth the wait.
          </p>
        </section>
      </div>
      <footer className="mt-[320px]"><Footer /></footer>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="-mb-[15px] text-[16px] font-bold text-[rgb(99,102,241)]">{label}:</p>
      <p className="-mb-[5px]">{value}</p>
    </div>
  );
}