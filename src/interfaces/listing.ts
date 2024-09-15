export interface Listing {
  id: string;
  name: string;
  description: string;
  activity_type: string;
  sport_type: string;
  price: Price;
  location: Location;
  participants: Participants;
  reviews: Reviews;
  pictures: string[]; // Array of URLs
  host: Host;
  datetimes: DateTimes;
}

interface Price {
  value: number;
  unit: string;
}

interface Location {
  country: string;
  area: string;
  city: string;
  smart_location: string;
  geometry: Geometry;
}

interface Geometry {
  type: string;
  coordinates: Coordinates;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Participants {
  current: number;
  max: number | null;
}

interface Reviews {
  number_of_reviews: number;
  review_scores_rating: number;
}

interface Host {
  host_picture_url: string;
  host_name: string;
  host_since: string;
}

interface DateTimes {
  datetime_created: string;
  datetime_deleted: string | null;
  datetime_start: string;
  datetime_finish: string;
}
