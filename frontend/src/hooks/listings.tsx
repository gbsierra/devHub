import { useEffect, useState } from 'react';
import type { Listing } from '../components/ListingCard';
import { useCurrentUser } from './currentUser';

type Mode = 'recent' | 'public' | 'user';

// Custom hook to fetch listings based on mode and optional user parameters
// Handles loading state and deletion of listings
export const useListings = (
  mode: Mode = 'public',
  userName?: string,
  userId?: number
) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    let endpoint = '';
    if (mode === 'recent') {
      endpoint = 'http://localhost:3001/listings/recent';                                           // recent developer names
    } else if (mode === 'public') {
      endpoint = 'http://localhost:3001/listings/public';                                           // all public listings
    } else if (mode === 'user' && userName && currentUser?.name) {
      endpoint = `http://localhost:3001/listings/user/${userName}?currentUser=${currentUser.name}`; // user-specific listing with current user context
    } else if (mode === 'user' && userName) {
      endpoint = `http://localhost:3001/listings/user/${userName}`;                                 // user-specific listing without current user context
    }

    if (!endpoint) return;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (mode === 'user' && userName) {
          setListings(data.filter((listing: Listing) => listing.name === userName));
        } else {
          setListings(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching listings:', error);
        setLoading(false);
      });
  }, [mode, userName]);

  // Delete listing
  const deleteListing = async (listingId: number) => {
    try {
      const res = await fetch(`http://localhost:3001/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, userName }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete listing');
      }

      setListings((prev) =>
        prev.filter((listing) => listing.id !== listingId)
      );
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return { listings, loading, deleteListing };
};