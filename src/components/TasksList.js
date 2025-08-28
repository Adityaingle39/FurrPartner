import React, { useState, useEffect } from 'react';
import { SafeAreaView, Image, ActivityIndicator, StyleSheet, Text, Pressable, FlatList, ScrollView, View } from 'react-native';
import Icons from 'react-native-vector-icons/Feather';
import {RadioButton, Button, SegmentedButtons, List} from 'react-native-paper';

import {
    // navigatorLink,
    // navigatorText,
    // heading,
    // btn,
    // btnSimple,
    // subHeading,
    // alignItemsCenter,
    // container,
    // bgColors,
    colors,
    // bgRed,
    // justifyContentCenter,
    // flexDirectionRow,
    // textInputContainer,
    // textInputLabel,
    // inputText,
    // spacingProperty
} from '../utils/styles/gobalstyle';

const TasksList = ({ navigation }) => {
    const [tasksTypeList, setTasksTypeList] = useState('1');
    const handlePress = (id) => { setTasksTypeList(id) };

    return (
        <List.AccordionGroup expandedId={tasksTypeList} onAccordionPress={handlePress}>
            <List.Accordion expanded={tasksTypeList === '1'} titleStyle={styles.sectionTitle} title="Today's Tasks" id="1">
                <Pressable style={styles.todaystask} onPress={() => navigation.navigate('OnlineConsultation')}>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontWeight: 600, color: '#000000', fontSize: 15 }}>Online Consultation</Text>
                            <Text style={{ fontWeight: 500, color: '#898A8D' }}>Feb 8, 2023 12:30 PM</Text>
                        </View>
                        <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.lightGreen,
                            marginVertical: 10,
                            paddingHorizontal: 10,
                            borderRadius: 5
                        }}>
                            <Text style={{ color: colors.green }}>{'\u2B24'}</Text>
                            <Text style={{ padding: 4, color: '#000000' }}>Active</Text>
                        </View>
                    </View>
                    <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../assets/petProfile.png')} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 15, color: '#000000', fontWeight: 600 }}>Bella</Text>
                            <Text style={{ fontSize: 13, fontWeight: 500 }}>Golden Retriever</Text>
                        </View>
                    </View>
                </Pressable>
            </List.Accordion>
            <List.Accordion expanded={tasksTypeList === '2'} titleStyle={styles.sectionTitle} title="Upcoming Tasks" id="2">
                <Pressable style={styles.todaystask} onPress={() => navigation.navigate('OnlineConsultation')}>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontWeight: 600, color: '#000000', fontSize: 15 }}>Online Consultation</Text>
                            <Text style={{ fontWeight: 500, color: '#898A8D' }}>Feb 8, 2023 12:30 PM</Text>
                        </View>
                        <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.lightRed,
                            marginVertical: 10,
                            paddingHorizontal: 10,
                            borderRadius: 5
                        }}>
                            <Text style={{ color: colors.red }}>{'\u2B24'}</Text>
                            <Text style={{ padding: 4, color: '#000000' }}>Cancelled</Text>
                        </View>
                    </View>
                    <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../assets/petProfile.png')} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 15, color: '#000000', fontWeight: 600 }}>Bella</Text>
                            <Text style={{ fontSize: 13, fontWeight: 500 }}>Golden Retriever</Text>
                        </View>
                    </View>
                </Pressable>
            </List.Accordion>
        </List.AccordionGroup>
    );
}

const styles = StyleSheet.create({
    profileName: {
      fontSize: 15,
      fontWeight: 600,
      color: '#000000',
    },
    profileDes: {
      fontWeight: 500,
      color: '#898A8D',
    },
    searchInputView: {
      flexDirection: 'row',
      height: 45,
      backgroundColor: '#F3F3F3',
      borderRadius: 10,
      paddingHorizontal: 10,
      marginVertical: 25,
      height: 45,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000000',
    },
    todaystask: {
      borderWidth: 1,
      padding: 20,
      borderColor: '#DADADA',
      borderRadius: 10,
      marginTop: 15
    },
});

export default TasksList;