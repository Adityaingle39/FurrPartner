import React, { useState, useEffect } from 'react';
import { SafeAreaView, Image, ActivityIndicator, StyleSheet, Text, Pressable, FlatList, ScrollView, View,Linking } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import IconCustom from './IconCustom';
import moment from 'moment';

import Toaster from '../../components/common/Toaster';
import { colors } from '../../utils/styles/gobalstyle';
import Apis from '../../utils/apis';
import { useAuthState } from '../../services/auth';
import { useWorspaceState } from '../../services/workspace';

const ServiceEvent = ({ task, callback }) => {
    const api = new Apis();

    const { userData } = useAuthState();
    const { defaultWorkspace } = useWorspaceState();

    const [isLoading, setIsLoading] = useState(false);
    const [eventLabelStyle, setEventLabelStyle] = useState({
        bgColor: task.status == 'Active' ? colors.lightGreen : (task.status == 'Complete' ? colors.lightBlue : colors.lightRed),
        dotColor: task.status == 'Active' ? colors.green : (task.status == 'Complete' ? colors.blue : colors.red),
        txtColor: '#000000'
    });

    const updateStatus = (appointmentId, status) => {
        setIsLoading(true);
        api.updateWorkspaceAppointment(userData.id, defaultWorkspace.id, appointmentId, status)
            .then(res => {
                setIsLoading(false);
                if (status == "Active") {
                    Toaster({ message: "Bingo! Your appointment scheduled." });
                } else if (status == "Cancelled") {
                    Toaster({ message: "Oops! Client might be disappointed." });
                }
                if (typeof callback == 'function') { callback({ task: task, status: status }) };
            }).catch(err => {
                setIsLoading(false);
                console.log(err)
                if (typeof callback == 'function') { callback(false) };
            });
    }
    const theme = useTheme();
    function goToYosemite() {
        const latitude = task.latitude;
        const longitude = task.longitude;
      
        if (latitude && longitude) {
          const url = `https://maps.apple.com/?q=${latitude},${longitude}&z=14&t=m`;
          Linking.openURL(url);
        } else {
          console.log('Missing latitude and longitude values for the Task.');
        }
      }
    return (
        <View style={[styles.todaystask, { paddingVertical: 5 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                    <Text style={{ fontWeight: 600, color: theme.colors.onSurface, fontSize: 15 }}>{task.subType}</Text>
                    <Text style={{ fontWeight: 500, color: theme.colors.onSurface }}>{moment.utc(task.appointmentTime, 'DD-MMM-YYYY HH:mm:ss Z').local().format("ddd - MMM Do, YYYY hh:mm A")}</Text>
                </View>
                <View>
                    <IconButton icon='check-circle-outline' size={40} onPress={() => updateStatus(task.id, 'Active')} iconColor={colors.green} />
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconCustom type="image" source={task.petImageUrl} size={54}></IconCustom>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 15, color: theme.colors.onSurface, fontWeight: 600 }}>{task.petName}</Text>
                        <Text style={{ fontSize: 13, fontWeight: 500 }}>{task.breed}</Text>
                    </View>
                </View>

                <View>
                    <IconButton icon='close-circle-outline' size={40} onPress={() => updateStatus(task.id, 'Partner_Rejected')} iconColor={colors.red} />
                </View>
            </View>
            {task.address && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 600, color: theme.colors.onSurface, fontSize: 15 }}>{task.address}</Text>
                    </View>
                    <View style={{ flex: 1 }}>

                        <Pressable onPress={goToYosemite} >
                            <Image
                                source={require('../../assets/ServiceMap.png')}
                                resizeMode="contain"
                                style={{ width: '100%', height: 80 }}
                            />
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    todaystask: {
        borderWidth: 1,
        padding: 20,
        borderColor: '#DADADA',
        borderRadius: 10,
        marginTop: 15
    },
});

export default ServiceEvent;