export interface Listing {
  id: string;
  name: string;
  description: string;
  medium_url: string;
  review_scores_rating: string;
  activity_type: string;
  price: string;
  smart_location: string;
  number_of_reviews: string;
  host_picture_url: string;
  host_name: string;
  host_since: string;
  listing_url: string;
  xl_picture_url: string;
  participants: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  sport_type: string;
}
