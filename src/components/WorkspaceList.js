import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Image, ActivityIndicator, StyleSheet, Text, FlatList, ScrollView, View, Alert } from 'react-native';
import Icons from 'react-native-vector-icons/Feather';
import {RadioButton, Divider, SegmentedButtons, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
    navigatorLink,
    navigatorText,
    heading,
    btn,
    btnSimple,
    subHeading,
    alignItemsCenter,
    container,
    bgColors,
    colors,
    bgRed,
    justifyContentCenter,
    flexDirectionRow,
    textInputContainer,
    textInputLabel,
    inputText,
    spacingProperty
} from '../utils/styles/gobalstyle';
import Loader from '../components/common/Loader';
import Toaster from '../components/common/Toaster';
import IconCustom from '../components/common/IconCustom';
import {useAuthState} from '../services/auth';
import {useWorspaceState} from '../services/workspace';
import Apis from '../utils/apis';
import { getIconTextName } from '../utils/helpers';

const Item = (title) => {
    const [value, setValue] = React.useState('');

    return (
        <View
            style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            alignItems: 'center',
            }}>
            <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/drProfile.png')} />
                <View style={{ paddingLeft: 15 }}>
                    <Text style={styles.profileName}>{title.designationName}</Text>
                    <Text style={styles.profileDes}>{title.workplaceName}</Text>
                </View>
            </View>
            <View>
                <RadioButton.Item value={title.id} />
            </View>
        </View>
    );
};

const WorkspaceList = ({navigation, actionSheetRef}) => {
    const api = new Apis();
    const theme = useTheme();
    const {userData} = useAuthState();
    const {defaultWorkspace, workspacesData, setWorkspaces} = useWorspaceState();
  
    const [selectedWorkspace, setWorkspace] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [value, setValue] = useState('');

    const clickAction = (option) => {
        switch(option) {
            case 'add': {
                actionSheetRef.current?.hide();
                navigation.navigate('InformationDetails');
            } break;
            case 'default': {
                let isAlreadyDefault = workspacesData.find(i => i.id == selectedWorkspace);
                if (isAlreadyDefault.default == true) {
                    Toaster({message: 'Already a default workspace!'});
                } else {
                    setAsDefaultWorkSpace(selectedWorkspace);
                }
            } break;
            case 'remove': {
                let isDeletable = workspacesData.find(i => i.id == selectedWorkspace);
                if (isDeletable.default == true) {
                    Toaster({message: 'Cannot remove default workspace!'});
                } else {
                    Alert.alert('Are you sure?', `You would like to remove this ${isDeletable.workplaceName} workspace`, [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {text: 'OK', onPress: () => {
                            deleteWorkspace(selectedWorkspace);
                        }},
                    ]);
                }
            } break;
        }
    }

    const setAsDefaultWorkSpace = async(workspaceId) => {
        setIsLoading(true);
        api.setDefaultWorkspace(userData.id, workspaceId)
        .then(res => {
            getMyWorkspaces(() => {
                setIsLoading(false);
                Toaster({message: 'Default workspace updated!'});
                // actionSheetRef.current?.hide();
            });
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
        });
    };

    const deleteWorkspace = async(workspaceId) => {
        setIsLoading(true);
        api.deleteWorkspace(userData.id, workspaceId)
        .then(res => {
            getMyWorkspaces(() => {
                setIsLoading(false);
                Toaster({message: 'Workspace removed!'});
                // actionSheetRef.current?.hide();
            });
        }).catch(err => {
            setIsLoading(false);
            console.log(err);
        });
    }

    const getMyWorkspaces = async(callback) => {
        let workData = await api.getAllWorkspaces(userData.id);
        setWorkspaces(workData);
        callback(true);
    };

    useEffect(() => {
        if (workspacesData.length > 0) {
            setWorkspace(defaultWorkspace.id);
            setWorkspaces(workspacesData);
            setIsLoading(false);
        } else {
            getMyWorkspaces(() => {setIsLoading(false);});
        }
    }, [])

    return (
        <SafeAreaView>
            {isLoading == true ? <View style={{marginTop: 30, marginBottom: 40, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator style={{marginTop: 20}} size="large" color="#B8EF5D" /><Text style={styles.heading}>Processing...</Text></View> :
            (<View style={styles.listContainer}>
                <View style={[container]}>
                    <Text style={[styles.heading, {color: theme.colors.onBackground}]}>My Workspaces</Text>
                    <Divider style={{marginBottom: 20}} />
                    
                    <FlatList
                        data={workspacesData}
                        renderItem={({item}) =>
                            <RadioButton.Group
                                onValueChange={value => setWorkspace(value)} value={selectedWorkspace}
                                uncheckColor={'red'}>
                                <TouchableOpacity onPress={() => setWorkspace(item.id)}>
                                    <View style={{ flexDirection: 'row', marginBottom: 15, backgroundColor: theme.colors.surfaceVariant }}>
                                        {userData && "imageUrl" in userData && userData.imageUrl !== null ?
                                            <IconCustom type="image" source={userData.imageUrl} size={45} square={true}></IconCustom> :
                                            <IconCustom type="text" source={getIconTextName(userData.collaboratorName)} size={45} square={true}></IconCustom>
                                        }
                                        <View style={{ paddingLeft: 15, flexGrow: 1 }}>
                                            <Text style={[styles.profileName, {color: theme.colors.onSurfaceVariant}]}>{item.workplaceName}</Text>
                                            <Text style={[styles.profileDes, {color: theme.colors.outline}]}>{item.designationName}</Text>
                                        </View>
                                        <RadioButton.Item status={selectedWorkspace === item.id ? 'checked' : 'unchecked'} color={colors.blue} label={''} value={item.id} />
                                    </View>
                                </TouchableOpacity>
                            </RadioButton.Group>
                        }
                        keyExtractor={item => item.id}>
                    </FlatList>
                    <Divider style={{marginBottom: 20}} />
                    <SegmentedButtons
                        value={value}
                        onValueChange={clickAction}
                        buttons={[
                            {
                                icon: 'plus-circle-outline',
                                value: 'add',
                                label: 'Add New',
                                checkedColor: colors.black,
                                uncheckedColor: colors.green
                            },
                            {
                                icon: 'star-circle',
                                value: 'default',
                                label: 'Set Default',
                                checkedColor: colors.black,
                                uncheckedColor: colors.yellow,
                                disabled: selectedWorkspace == ''
                            },
                            {
                                icon:'delete',
                                value: 'remove',
                                label: 'Delete',
                                checkedColor: colors.red,
                                uncheckedColor: colors.red,
                                disabled: selectedWorkspace == ''
                            },
                        ]}
                    />
                </View>
            </View>)}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    listContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginHorizontal: 20,
        marginBottom: 40,
        alignItems: 'center',
        overflow: 'scroll'
    },
    containerBottom: {
        marginBottom: 20
    },
    heading: {
        fontSize: 20,
        fontWeight: 600,
        // color: '#263238',
        textAlign: 'center',
        marginBottom: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    profileName: {
        fontSize: 15,
        fontWeight: 600,
        // color: '#000000',
    },
    profileDes: {
        fontWeight: 500,
        // color: '#898A8D',
    },
});
export default WorkspaceList;