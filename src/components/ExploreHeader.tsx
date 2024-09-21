import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import { SportType } from '@/interfaces/activity';
import { sportTypeIconMappings } from '@/constants/sportTypeIconMappings';

interface Category {
  sportType: SportType | string;
}

export const categories: Category[] = [
  {
    sportType: 'trending-up',
  },
  {
    sportType: SportType.Soccer,
  },
  {
    sportType: SportType.Basketball,
  },
  {
    sportType: SportType.Tennis,
  },
  {
    sportType: SportType.Gym,
  },
  {
    sportType: SportType.Yoga,
  },
  {
    sportType: SportType.Triathlon,
  },
  {
    sportType: SportType.Run,
  },
  {
    sportType: SportType.MartialArts,
  },
  {
    sportType: SportType.Motorsports,
  },
  {
    sportType: SportType.Volleyball,
  },
  {
    sportType: SportType.Handball,
  },
  {
    sportType: SportType.Hockey,
  },
  {
    sportType: SportType.Ski,
  },
  {
    sportType: SportType.SkiWater,
  },
  {
    sportType: SportType.Baseball,
  },
  {
    sportType: SportType.Skateboard,
  },
  {
    sportType: SportType.Esports,
  },
  {
    sportType: SportType.Swim,
  },
  {
    sportType: SportType.Other,
  },
];

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((fx, fy, width, height, px, py) => {
      scrollRef.current?.scrollTo({ x: px - 16, y: 0, animated: true });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 29 }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={'/(modals)/search'} asChild>
            <TouchableOpacity>
              <View style={styles.searchBtn}>
                <Ionicons name="search" size={24} />
                <View>
                  <Text style={{ fontFamily: 'mon-sb' }}>
                    {translate('explorer_screen.explorer_header.search')}
                  </Text>
                  <Text style={{ color: Colors.grey, fontFamily: 'mon' }}>
                    {translate('explorer_screen.explorer_header.any_sport')} ·{' '}
                    {translate('explorer_screen.explorer_header.any_location')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            gap: 20,
            paddingHorizontal: spacing.md,
          }}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => selectCategory(index)}
            >
              <MaterialCommunityIcons
                name={
                  sportTypeIconMappings[item.sportType]
                    ? sportTypeIconMappings[item.sportType]
                    : item.sportType
                }
                size={24}
                color={activeIndex === index ? '#000' : Colors.grey}
              />
              <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                {translate(`activity_sports.${item.sportType}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 130,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },

  searchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: spacing.sm,
    alignItems: 'center',
    width: 280,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  filterBtn: {
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#A2A0A2',
    borderRadius: spacing.lg,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: Colors.grey,
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: '#000',
  },
  categoriesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxs,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#000',
    borderBottomWidth: spacing.xxxs,
    paddingBottom: spacing.xxs,
  },
});

export default ExploreHeader;
