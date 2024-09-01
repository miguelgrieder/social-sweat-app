import { View, Text, FlatList, ListRenderItem } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import { Link } from 'expo-router';

interface Props {
  listings: any[];
  category: string;
}

const Listings = ({ listings: items, category }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    console.log('RELOADING LISTINGS: ', items.length);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  const renderRow: ListRenderItem<any> = ({ item }) => (
    <Link href={`/listing/${item.id}`}>Go there</Link>
  );
  return (
    <View style={defaultStyles.container}>
      <FlatList renderItem={renderRow} ref={listRef} data={loading ? [] : items}></FlatList>
    </View>
  );
};

export default Listings;
