import React, { Component } from 'react';
import { View, StyleSheet, Platform, ActionSheetIOS, TouchableOpacity, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Colors from '@/constants/Colors';

class CustomPickerSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: props.placeholder?.value || null,
    };
  }

  openSelector = () => {
    const { items, onValueChange } = this.props;
    if (Platform.OS === 'ios') {
      const optionLabels = items.map((opt) => opt.label);
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...optionLabels],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex !== 0) {
            const chosenOption = items[buttonIndex - 1];
            this.setState({ selectedValue: chosenOption.value });
            if (onValueChange) {
              onValueChange(chosenOption.value);
            }
          }
        }
      );
    }
  };

  render() {
    const { items, placeholder, style = {}, onValueChange } = this.props;
    const { selectedValue } = this.state;

    return (
      <View>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity onPress={this.openSelector} style={[styles.inputIOS, style.inputIOS]}>
            <Text style={style.inputIOS}>
              {selectedValue !== null
                ? items.find((item) => item.value === selectedValue)?.label || ''
                : placeholder?.label || 'Select an option...'}
            </Text>
          </TouchableOpacity>
        ) : (
          <RNPickerSelect
            onValueChange={(value) => {
              this.setState({ selectedValue: value });
              if (onValueChange) {
                onValueChange(value);
              }
            }}
            items={items}
            value={selectedValue}
            placeholder={placeholder}
            style={style}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30,
  },
});

export default CustomPickerSelect;
