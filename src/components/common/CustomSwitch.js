import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default function CustomSwitch({
  selectionMode,
  option1,
  option2,
  onSelectSwitch,
}) {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updateSwitchData = value => {
    setSelectionMode(value);
    onSelectSwitch(value);
  };

  return (
    <View
      style={{
        height: 40,
        width: '70%',
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        borderColor: '#AD40AF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
       
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(1)}
        style={{
        justifyContent: 'center',
        alignItems: 'center',
          height:30,
          width:120,
          backgroundColor: getSelectionMode == 1 ? '#FFFFFF' : '#D9D9D9',
          borderRadius: 10,
          
        }}>
        <Text
          style={{
            color: getSelectionMode == 1 ? '#000000' : '#808080',
            fontSize: 13,
            fontFamily: 'Roboto-Medium',
          }}>
          {option1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(2)}
        style={{
            height:30,
            width:120,
          backgroundColor: getSelectionMode == 2 ? '#FFFFFF' : '#D9D9D9',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: getSelectionMode == 2 ? '#000000' : '#808080',
            fontSize: 13,
            padding:5,
            fontFamily: 'Roboto-Medium',
          }}>
          {option2}
        </Text>
      </TouchableOpacity>
    </View>
  );
}