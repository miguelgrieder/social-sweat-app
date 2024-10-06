export interface Activity {
  id: string;
  name: string;
  description: string;
  description_private?: string;
  activity_type: ActivityType;
  sport_type: SportType;
  price: Price;
  location: Location;
  participants: Participants;
  reviews: Reviews;
  pictures: string[]; // Array of URLs
  host: Host;
  datetimes: DateTimes;
}

export enum SportType {
  Gym = 'gym',
  Basketball = 'basketball',
  Soccer = 'soccer',
  Tennis = 'tennis',
  Yoga = 'yoga',
  Triathlon = 'triathlon',
  Run = 'run',
  MartialArts = 'martial_arts',
  Motorsports = 'motorsports',
  Volleyball = 'volleyball',
  Handball = 'handball',
  Hockey = 'hockey',
  Ski = 'ski',
  SkiWater = 'ski_water',
  Baseball = 'baseball',
  Skateboard = 'skateboard',
  Esports = 'esports',
  Swim = 'swim',
  Other = 'other',
}

interface Price {
  value: number;
  unit: string;
}

export enum ActivityType {
  Spot = 'spot',
  Session = 'session',
  Event = 'event',
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
  participants_user_id: string[];
  max: number | null;
}

interface Reviews {
  number_of_reviews: number;
  review_scores_rating: number;
}

interface Host {
  host_user_id: string;
}

interface DateTimes {
  datetime_created: string;
  datetime_deleted: string | null;
  datetime_start: string;
  datetime_finish: string;
}

export type FilterActivityInput = {
  activity_id?: string;
  participant_user_id?: string;
  host_user_id?: string;
  activity_type?: ActivityType;
  price?: number;
  sport_types?: SportType[];
  datetime_start?: string; // ISO 8601 date-time string
  datetime_finish?: string; // ISO 8601 date-time string
};
