import useSWR from 'swr'; // for data fetching

// fetcher function used by SWR to handle API requests (includes credentials),
// takes a URL as an argument and returns the JSON response
const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return res.json();
};

// fetch current user data
export function useCurrentUser() {
  const {
    data: currentUser,
    error: userError,
    isLoading: userLoading
  } = useSWR('http://localhost:3001/api/users/me', fetcher);

  return { currentUser, userError, userLoading };
}

// defining the structure of a repository
type Repo = {
    id: number;
    name: string;
    html_url: string;
    description?: string;
  };

// fetch current user's repositories
export function useRepos() {
  const {
    data: repos = [],
    error: reposError,
    isLoading: reposLoading
  } = useSWR<Repo[]>('http://localhost:3001/api/users/me/repos', fetcher);

  return { repos, reposError, reposLoading };
}