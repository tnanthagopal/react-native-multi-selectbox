import React, { useState, memo, useMemo } from 'react';
import { isEmpty, find } from 'lodash';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Colors from 'react-native-multi-selectbox/src/constants/Colors';
import Icon from 'react-native-multi-selectbox/src/components/Icon';
import Toggle from 'react-native-multi-selectbox/src/components/Toggle';

const hitSlop = { top: 14, bottom: 14, left: 14, right: 14 };

const kOptionsHeight = { width: '100%', maxHeight: 180 };

const kOptionListViewStyle = {
  width: '100%',
  alignItems: 'center',
  paddingVertical: 4,
};
const renderItemStyle = { flexGrow: 1 };
function SelectBox({
  labelStyle,
  containerStyle,
  inputFilterContainerStyle,
  inputFilterStyle,
  optionsLabelStyle,
  optionContainerStyle,
  multiOptionContainerStyle,
  multiOptionsLabelStyle,
  multiListEmptyLabelStyle,
  listEmptyLabelStyle,
  selectedItemStyle,
  listEmptyText = 'No results found',
  ...props
}) {
  const [inputValue, setInputValue] = useState('');

  const [showOptions, setShowOptions] = useState(false);

  function renderLabel(item) {
    const kOptionsLabelStyle = {
      fontSize: 17,
      color: 'rgba(60, 60, 67, 0.6)',
      ...optionsLabelStyle,
    };
    return <Text style={kOptionsLabelStyle}>{item}</Text>;
  }

  function renderItem({ item }) {
    const { isMulti, onChange, onMultiSelect, selectedValues } = props;
    const kOptionContainerStyle = {
      borderColor: '#dadada',
      borderBottomWidth: 1,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      background: '#fff',
      paddingVertical: 12,
      paddingRight: 10,
      justifyContent: 'space-between',
      ...optionContainerStyle,
    };
    return (
      <View style={kOptionContainerStyle}>
        {isMulti ? (
          <>
            <TouchableOpacity
              hitSlop={hitSlop}
              style={renderItemStyle}
              onPress={onPressMultiItem()}>
              {renderLabel(item.item)}
            </TouchableOpacity>
            <Toggle
              iconColor={toggleIconColor}
              checked={selectedValues.some(i => item.id === i.id)}
              onTouch={onPressMultiItem()}
            />
          </>
        ) : (
          <>
            <TouchableOpacity
              hitSlop={hitSlop}
              style={renderItemStyle}
              onPress={onPressItem()}>
              {renderLabel(item.item)}
              <View />
            </TouchableOpacity>
          </>
        )}
      </View>
    );

    function onPressMultiItem() {
      return e => (onMultiSelect ? onMultiSelect(item) : null);
    }

    function onPressItem() {
      return e => {
        setShowOptions(false);
        return onChange ? onChange(item) : null;
      };
    }
  }

  function renderGroupItem({ item }) {
    const { onTapClose, options } = props;
    const label = find(options, o => o.id === item.id);
    const kMultiOptionContainerStyle = {
      flexDirection: 'row',
      borderRadius: 20,
      paddingVertical: 5,
      paddingRight: 5,
      paddingLeft: 10,
      marginRight: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary,
      flexGrow: 1,
      ...multiOptionContainerStyle,
    };
    const kMultiOptionsLabelStyle = {
      fontSize: 10,
      color: '#fff',
      ...multiOptionsLabelStyle,
    };
    return (
      <View style={kMultiOptionContainerStyle}>
        <Text style={kMultiOptionsLabelStyle}>{label.item}</Text>
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          hitSlop={hitSlop}
          onPress={onPressItem()}>
          <Icon name="closeCircle" fill="#fff" width={21} height={21} />
        </TouchableOpacity>
      </View>
    );

    function onPressItem() {
      return e => (onTapClose ? onTapClose(item) : null);
    }
  }
  const {
    selectIcon,
    label,
    inputPlaceholder = 'Select',
    hideInputFilter,
    width = '100%',
    isMulti,
    options,
    value,
    selectedValues,
    arrowIconColor = Colors.primary,
    searchIconColor = Colors.primary,
    toggleIconColor = Colors.primary,
    searchInputProps,
    multiSelectInputFieldProps,
    listOptionProps = {},
  } = props;
  const filteredSuggestions = useMemo(
    () =>
      options.filter(
        suggestion =>
          suggestion.item.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
      ),
    [inputValue, options],
  );

  function multiListEmptyComponent() {
    const kMultiListEmptyLabelStyle = {
      fontSize: 17,
      color: 'rgba(60, 60, 67, 0.3)',
      ...multiListEmptyLabelStyle,
    };
    return (
      <TouchableOpacity
        width="100%"
        style={{ flexGrow: 1, width: '100%' }}
        hitSlop={hitSlop}>
        <Text style={kMultiListEmptyLabelStyle}>{inputPlaceholder}</Text>
      </TouchableOpacity>
    );
  }

  function optionListEmpty() {
    const kListEmptyLabelStyle = {
      fontSize: 17,
      color: 'rgba(60, 60, 67, 0.6)',
      ...listEmptyLabelStyle,
    };
    return (
      <View style={kOptionListViewStyle}>
        <Text style={kListEmptyLabelStyle}>{listEmptyText}</Text>
      </View>
    );
  }
  const kLabelStyle = {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    paddingBottom: 4,
    ...labelStyle,
  };

  const kContainerStyle = {
    flexDirection: 'row',
    width: '100%',
    borderColor: '#ddd',
    borderBottomWidth: 1,
    paddingTop: 6,
    paddingRight: 20,
    paddingBottom: 8,
    ...containerStyle,
  };

  return (
    <>
      <View
        style={{
          width,
        }}>
        <Text style={kLabelStyle}>{label}</Text>
        <View style={kContainerStyle}>
          <View style={{ paddingRight: 20, flexGrow: 1 }}>
            {isMulti ? (
              <TouchableOpacity onPress={onPressShowOptions()}>
                <FlatList
                  data={selectedValues}
                  extraData={{ inputValue, showOptions }}
                  keyExtractor={keyExtractor()}
                  renderItem={renderGroupItem}
                  horizontal={true}
                  ListEmptyComponent={multiListEmptyComponent}
                  {...multiSelectInputFieldProps}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                hitSlop={hitSlop}
                onPress={onPressShowOptions()}>
                <Text style={kSelectedItemStyle()}>
                  {value.item || inputPlaceholder || label}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={onPressShowOptions()} hitSlop={hitSlop}>
            {selectIcon ? (
              selectIcon
            ) : (
              <Icon
                name={showOptions ? 'upArrow' : 'downArrow'}
                fill={arrowIconColor}
              />
            )}
          </TouchableOpacity>
        </View>
        {/* Options wrapper */}
        {showOptions && (
          <FlatList
            data={filteredSuggestions || options}
            extraData={options}
            keyExtractor={keyExtractor()}
            renderItem={renderItem}
            numColumns={1}
            horizontal={false}
            initialNumToRender={5}
            maxToRenderPerBatch={20}
            windowSize={10}
            ListEmptyComponent={optionListEmpty}
            style={[kOptionsHeight, listOptionProps.style]}
            ListHeaderComponent={HeaderComponent()}
            {...listOptionProps}
          />
        )}
      </View>
    </>
  );

  function keyExtractor() {
    return o => `${o.id}-${Math.random()}`;
  }

  function kSelectedItemStyle() {
    return {
      fontSize: 17,
      color: isEmpty(value.item) ? 'rgba(60, 60, 67, 0.3)' : '#000',
      ...selectedItemStyle,
    };
  }

  function HeaderComponent() {
    const kInputFilterContainerStyle = {
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 18,
      justifyContent: 'space-between',
      ...inputFilterContainerStyle,
    };
    const kInputFilterStyle = {
      paddingVertical: 14,
      paddingRight: 8,
      color: '#000',
      fontSize: 12,
      flexGrow: 1,
      ...inputFilterStyle,
    };
    return (
      <>
        {!hideInputFilter && (
          <View style={kInputFilterContainerStyle}>
            <TextInput
              value={inputValue}
              placeholder={inputPlaceholder}
              onChangeText={onChangeText()}
              style={kInputFilterStyle}
              placeholderTextColor="#000"
              {...searchInputProps}
            />
            <Icon name="searchBoxIcon" fill={searchIconColor} />
          </View>
        )}
        <ScrollView keyboardShouldPersistTaps="always" />
      </>
    );

    function onChangeText() {
      return value => setInputValue(value);
    }
  }

  function onPressShowOptions() {
    return () => setShowOptions(!showOptions);
  }
}

export default memo(SelectBox);
