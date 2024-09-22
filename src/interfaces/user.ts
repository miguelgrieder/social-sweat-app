// Define the UserModel interface
export interface User {
  id: string;
  public_metadata: { [key: string]: any };
  private_metadata?: { [key: string]: any } | null;
  unsafe_metadata: { [key: string]: any };
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
  unsafe_metadata_role: string;
}
