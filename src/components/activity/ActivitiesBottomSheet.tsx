import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import { Activity } from '@/interfaces/activity';
import BottomSheet from '@gorhom/bottom-sheet';
import ActivitiesBottomSheetList from '@/components/activity/ActivitiesBottomSheetList';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';

interface Props {
  activities: Activity[];
  category: string;
}

const ActivitiesBottomSheet = ({ activities, category }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [refresh, setRefresh] = useState<number>(0);

  const snapPoints = useMemo(() => ['10%', '100%'], []);

  const onShowMap = () => {
    bottomSheetRef.current?.collapse();
    setRefresh(refresh + 1);
  };

  return (
    <BottomSheet
      index={1}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: Colors.grey }}
      style={styles.sheetContainer}
    >
      <View style={styles.contentContainer}>
        {activities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{translate('activity_screen.no_activities')}</Text>
          </View>
        ) : (
          <ActivitiesBottomSheetList
            activities={activities}
            category={category}
            refresh={refresh}
          />
        )}
        <View style={styles.absoluteView}>
          <TouchableOpacity style={styles.btn} onPress={onShowMap}>
            <Text style={{ fontFamily: 'mon-sb', color: '#fff' }}>
              {translate('explorer_screen.explorer_listing_bottom_sheet.map')}
            </Text>
            <Ionicons name="map" size={20} style={{ marginLeft: spacing.xs }} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: spacing.md,
    color: Colors.grey,
    textAlign: 'center',
  },
  absoluteView: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.dark,
    padding: spacing.md,
    height: 50,
    borderRadius: 30,
    flexDirection: 'row',
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
});

export default ActivitiesBottomSheet;
