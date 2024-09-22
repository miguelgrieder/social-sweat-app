import React, { useEffect, useState } from 'react';
import { Text, View, Image, FlatList, StyleSheet, ViewStyle } from 'react-native';
import { Screen } from 'src/components/Screen';
import { translate } from '@/app/services/translate';
import { fetchUsers } from '@/api/fetchUsers';
import { User } from '@/interfaces/user';
import { capitalize } from '@/utils/utils';

const Coaches = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const filterBody = {
        unsafe_metadata_role: 'coach',
      };

      const fetchedUsers = await fetchUsers(filterBody);
      setUsers(fetchedUsers);
    };

    getUsers();
  }, []);

  const renderItem = ({ item }: { item: User }) => {
    const fullName =
      `${item.first_name || ''} ${item.last_name || ''}`.trim() ||
      capitalize(translate('common.unknown'));
    const createdAtDate = new Date(item.created_at);
    const formattedDate = `${createdAtDate.getMonth() + 1}/${createdAtDate.getDate()}/${createdAtDate.getFullYear()}`;

    const imageSource = item.image_url
      ? { uri: item.image_url }
      : require('assets/images/user_default_image.jpg');
    return (
      <View style={styles.itemContainer}>
        <Image source={imageSource} style={styles.userImage} />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userSince}>
            {capitalize(translate('coaches_screen.since'))} {formattedDate}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} safeAreaEdges={['top']}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
};

export default Coaches;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc', // Placeholder background color
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSince: {
    fontSize: 14,
    color: '#666',
  },
});
