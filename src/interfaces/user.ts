// Define the UserModel interface
import { SportType } from '@/interfaces/activity';

export enum Role {
  Coach = 'coach',
  User = 'user',
  Company = 'company',
}

export interface UserSocialMedias {
  user_youtube?: string;
  user_instagram?: string;
  user_facebook?: string;
  user_tiktok?: string;
  user_strava?: string;
}

export interface UserMetrics {
  activities_created?: number;
  activities_participated?: number;
  activities_participating?: number;
}

export interface UserMetadata {
  role: Role;
  sports?: SportType[];
  birth_date: string; // Expected format: 'YYYY/MM/DD'
  user_social_medias?: UserSocialMedias;
  user_metrics?: UserMetrics;
  profile_description?: string;
}

export interface User {
  id: string;
  user_metadata: UserMetadata;
  email_address?: string | null;
  phone_number?: string | null;
  image_url?: string | null;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  last_active_at?: number | null;
  created_at: number;
}

// Define the FilterUser interface
export interface FilterUser {
  role?: string;
  sport_type?: SportType;
  id?: string;
  username?: string;
}

export interface UpdateUser {
  first_name?: string;
  last_name?: string;
  username?: string;
  user_metadata?: Partial<UserMetadata>;
}
