export interface Listing {
  id: string;
  name: string;
  description: string;
  activity_type: string;
  sport_type: string;
  price: {
    value: number;
    unit: string;
  };
  location: {
    country: string;
    area: string;
    city: string;
    smart_location: string;
    geometry: {
      type: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
  };
  participants: {
    current: number;
    max: number | null;
  };
  reviews: {
    number_of_reviews: number;
    review_scores_rating: number;
  };
  pictures: string[]; // Array of URLs
  host: {
    host_picture_url: string;
    host_name: string;
    host_since: string;
  };
  datetimes: {
    datetime_created: string;
    datetime_deleted: string | null;
    datetime_start: string;
    datetime_finish: string;
  };
}
