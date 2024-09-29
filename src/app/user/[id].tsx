import ProfilePage from '@/components/ProfilePage';
import { useLocalSearchParams } from 'expo-router';

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  return <ProfilePage profileUserId={id as string} />;
}
