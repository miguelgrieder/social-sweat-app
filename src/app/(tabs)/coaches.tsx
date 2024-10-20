import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { translate } from '@/app/services/translate';
import { fetchUsers } from '@/api/fetchUsers';
import { User } from '@/interfaces/user';
import { capitalize } from '@/utils/utils';
import { spacing } from '@/constants/spacing';
import ActivitiesHeader from '@/components/ActivitiesHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import SportTag from '@/components/SportTag';

const Coaches = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const filterBody = {
        role: 'coach',
        sport_type: category === 'trending-up' ? null : category,
      };

      try {
        const fetchedUsers = await fetchUsers(filterBody);
        setUsers(fetchedUsers);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [category]);

  const renderItem = ({ item }: { item: User }) => {
    const fullName =
      `${item.first_name || ''} ${item.last_name || ''}`.trim() ||
      capitalize(translate('common.unknown'));
    const createdAtDate = new Date(item.created_at);
    const formattedDate = `${createdAtDate.getMonth() + 1}/${createdAtDate.getDate()}/${createdAtDate.getFullYear()}`;

    const imageSource = item.image_url
      ? { uri: item.image_url }
      : require('assets/images/user_default_image.jpg');

    const sportsList =
      item.user_metadata.sports?.filter(Boolean).map((sport) => capitalize(sport)) || [];

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => router.push(`/user/${item.id}`)}
      >
        <Image
          source={imageSource}
          style={styles.userImage}
          accessibilityLabel={`${fullName}'s profile image`}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userSince}>
            {capitalize(translate('coaches_screen.since'))} {formattedDate}
          </Text>
          {sportsList.length > 0 && (
            <View style={styles.sportsContainer}>
              {sportsList.map((sport, index) => (
                <SportTag key={index} sport={sport} />
              ))}
            </View>
          )}
          {item.user_metadata.profile_description && (
            <Text style={styles.profileDescription} numberOfLines={2}>
              {item.user_metadata.profile_description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleCategoryChange = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 22 }]}>
      <ActivitiesHeader onCategoryChanged={handleCategoryChange} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{translate('coaches_screen.no_coaches_found')}</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

export default Coaches;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: spacing.sm,
    backgroundColor: '#ccc',
  },
  infoContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  userSince: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  profileDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
  },
  separator: {
    height: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
