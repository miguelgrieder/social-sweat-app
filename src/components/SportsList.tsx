import { translate } from '@/app/services/translate';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/spacing';
import { sportTypeIconMappings } from '@/constants/sportTypeIconMappings';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { categories } from '@/constants/sportCategories';

interface SportsListProps {
  showInput?: boolean;
  title?: string;
  onSelectedTagsChange: (selectedTags: string[]) => void;
  maxSelectedSports?: number; // Added optional prop
}

const SportsList = ({
  showInput,
  title,
  onSelectedTagsChange,
  maxSelectedSports = 5,
}: SportsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    onSelectedTagsChange?.(selectedTags);
  }, [selectedTags, onSelectedTagsChange]);

  const filteredCategories = categories
    .slice(1)
    .filter(
      (category) =>
        category.sportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        translate(`activity_sports.${category.sportType.toLowerCase()}`)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

  const toggleTag = (sportType: string) => {
    if (selectedTags.includes(sportType)) {
      setSelectedTags(selectedTags.filter((t) => t !== sportType));
    } else {
      if (selectedTags.length < maxSelectedSports) {
        setSelectedTags([...selectedTags, sportType]);
      } else {
        Alert.alert(translate('alerts.error'), translate('alerts.max_selection_reached'));
      }
    }
  };

  const isMaxSelected = selectedTags.length >= maxSelectedSports;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showInput && (
        <TextInput
          style={styles.searchInput}
          placeholder={translate('sports_list.find_a_sport')}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      )}
      <View style={styles.scrollContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tagContainer}
          nestedScrollEnabled={true}
        >
          {filteredCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleTag(category.sportType)}
              style={[
                styles.tag,
                selectedTags.includes(category.sportType) && styles.tagSelected,
                !selectedTags.includes(category.sportType) && isMaxSelected && styles.tagDisabled,
              ]}
              disabled={!selectedTags.includes(category.sportType) && isMaxSelected}
            >
              <MaterialCommunityIcons
                name={
                  sportTypeIconMappings[category.sportType]
                    ? sportTypeIconMappings[category.sportType]
                    : category.sportType
                }
                size={24}
                color={
                  selectedTags.includes(category.sportType) ? Colors.primary_light : Colors.primary
                }
              />
              <Text
                style={[
                  styles.tagText,
                  selectedTags.includes(category.sportType) && styles.tagTextSelected,
                ]}
              >
                {translate(`activity_sports.${category.sportType.toLowerCase()}`)}
              </Text>
              <MaterialCommunityIcons
                name={selectedTags.includes(category.sportType) ? 'close' : 'plus'}
                size={19}
                color={
                  selectedTags.includes(category.sportType) ? Colors.primary_light : Colors.primary
                }
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },

  title: {
    fontSize: 18,
    color: '#6C6C6C',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  searchInput: {
    height: 40,
    elevation: 2,
    width: '70%',
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
    padding: spacing.sm,
    borderColor: '#c2c2c2',
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
  },

  scrollContainer: {
    height: 300,
    borderColor: Colors.grey,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 4,
  },

  tagContainer: {
    flexWrap: 'wrap',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  tag: {
    borderWidth: 1,
    borderRadius: 20,
    gap: spacing.xxs,
    margin: spacing.xxs,
    paddingVertical: 10,
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary_light,
  },

  tagSelected: {
    backgroundColor: Colors.primary,
  },

  tagDisabled: {
    opacity: 0.5, // Visually indicate disabled state
  },

  tagText: {
    color: Colors.primary,
  },

  tagTextSelected: {
    color: '#fff',
  },
});

export default SportsList;
