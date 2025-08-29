import React, { useState, useEffect } from 'react';
import { Image, ActivityIndicator, StyleSheet, Text, Pressable, FlatList, ScrollView, View} from 'react-native';
import IconCustom from './IconCustom';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
    colors,
} from '../../utils/styles/gobalstyle';
import { useTheme } from 'react-native-paper';

const ServiceTask = ({ navigation, task }) => {
    const theme= useTheme();
    const [eventLabelStyle, setEventLabelStyle] = useState({
        bgColor: task.status == 'Active' ? colors.lightGreen : (task.status == 'Complete' ? theme.colors.primary : colors.secondary),
        dotColor: task.status == 'Active' ? colors.green : (task.status == 'Complete' ? colors.blue : colors.red),
        txtColor: task.status == 'Complete' ? '#FFFFFF' : '#000000'
    });

    const taskStatus = (status) => {
        switch(status) {
            case 'Created': return 'Missed'; break;
            default: return status;
        }
    }

    return (
        <Pressable style={[styles.todaystask,{borderColor:theme.colors.onSurfaceVariant}]} onPress={() => navigation.navigate('ListDetails', {id: task.id})}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                    <Text style={{ fontWeight: 600, color:theme.colors.onSurface, fontSize: 15 }}>{task.type}</Text>
                    <Text style={{ fontWeight: 500, color:theme.colors.onSurface }}>{moment.utc(task.appointmentTime, 'DD-MMM-YYYY HH:mm:ss Z').local().format("ddd - MMM Do, YYYY hh:mm A")}</Text>
                </View>
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: eventLabelStyle.bgColor,
                    marginVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 5
                }}>
                    <Text style={{ color: eventLabelStyle.dotColor }}>{'\u2B24'}</Text>
                    <Text style={{ padding: 4, color: eventLabelStyle.txtColor }}>{taskStatus(task.status)}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <IconCustom type="image" source={task.petImageUrl} size={54}></IconCustom>
                {/* <Image source={{uri: task.petImageUrl}} /> */}
                <View style={{ marginLeft: 10, flexGrow: 1 }}>
                    <Text style={{ fontSize: 15, color:theme.colors.onSurface, fontWeight: 600 }}>{task.petName}</Text>
                    <Text style={{ fontSize: 13,color:theme.colors.onSurface, fontWeight: 500 }}>{task.breed}</Text>
                </View>
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    // profileName: {
    //   fontSize: 15,
    //   fontWeight: 600,
    //   color: '#000000',
    // },
    // profileDes: {
    //   fontWeight: 500,
    //   color: '#898A8D',
    // },
    // searchInputView: {
    //   flexDirection: 'row',
    //   height: 45,
    //   backgroundColor: '#F3F3F3',
    //   borderRadius: 10,
    //   paddingHorizontal: 10,
    //   marginVertical: 25,
    //   height: 45,
    // },
    // sectionTitle: {
    //   fontSize: 18,
    //   fontWeight: 'bold',
    //   color: '#000000',
    // },
    todaystask: {
      borderWidth: 1,
      padding: 20,
      
      borderRadius: 10,
      marginTop: 15
    },
});

export default ServiceTask;