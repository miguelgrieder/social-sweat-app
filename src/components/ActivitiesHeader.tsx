import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import { sportTypeIconMappings } from '@/constants/sportTypeIconMappings';
import { categories, Category } from '@/constants/sportCategories'; // Ensure you have this type

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ActivitiesHeader: React.FC<Props> = ({ onCategoryChanged }) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((fx, fy, width, height, px, py) => {
      scrollRef.current?.scrollTo({ x: px - 16, y: 0, animated: true });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const selectedSportType = categories[index].sportType;
    onCategoryChanged(selectedSportType);
  };

  return (
    <View style={styles.container}>
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
        {categories.map((item: Category, index: number) => (
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    position: 'absolute',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  actionRow: {
    flex: 1,
    paddingBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  searchBtn: {
    flex: 1,
    marginRight: spacing.md,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    elevation: 5,
    shadowRadius: 8,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    borderColor: '#c2c2c2',
    backgroundColor: Colors.background,
    borderWidth: StyleSheet.hairlineWidth,
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

export default ActivitiesHeader;
