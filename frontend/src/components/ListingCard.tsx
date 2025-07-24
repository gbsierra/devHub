import { useListings } from '../hooks/listings';
import { useCurrentUser } from '../hooks/currentUser';

export interface Listing {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  name: string;
  avatarUrl?: string;
  repoName: string;
  createdAt: string;
  userId: number;
  isPublic: boolean;
}

interface ListingCardProps {
  listing: Listing;
}

function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="rounded-[7px] p-[6px] shadow-[0_10px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_15px_rgba(0,0,0,0.2)] transition-shadow duration-280">
      <div className="flex items-center justify-between">
        <h3 className="text-[20px] text-[white] mb-[2px] ml-[10px]"> {listing.title} </h3>
        <p className="text-[12px] text-[grey] mr-[6px]"> {new Date(listing.createdAt).toLocaleDateString()} </p>
      </div>
      <p className="text-[grey] ml-[10px] -mt-[5px]"> {listing.repoName} </p>
      <p className="text-[grey] ml-[10px]"> {listing.description} </p>
      <div className="flex mt-[60px] mb-[12px] justify-end mr-[10px] items-center h-[10px] gap-3">
        <span> Posted by {listing.name} </span>
        {listing.avatarUrl && (
          <img
            src={listing.avatarUrl}
            alt="User avatar"
            className="ml-[5px] h-[16px] rounded-full"
          />
        )}
      </div>
    </div>
  );
}

interface ListingListProps {
  mode?: 'public' | 'user';
  userName?: string;
  userId?: number;
}

export function ListingList({ mode = 'public', userName, userId }: ListingListProps) {
  const { listings, loading, deleteListing } = useListings(mode, userName, userId);
  const { currentUser } = useCurrentUser();

  if (loading) return <p>Loading listings...</p>;
  if (listings.length === 0) return <p>No listings found.</p>;

  return (
    <div className="grid">
      {listings.map((listing) => (
        <div key={listing.id} className="card-wrapper">
          <a
            href={`https://github.com/${listing.name}/${listing.repoName}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListingCard listing={listing} />
          </a>
          {mode==='user' && listing.name===userName && listing.userId===currentUser?.id && (
            <button
              className="delete-button"
              onClick={() => {
                const confirmed = window.confirm('Are you sure you want to delete this listing?');
                if (confirmed) deleteListing(listing.id);
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}