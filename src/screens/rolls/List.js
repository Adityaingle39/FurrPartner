import {
    View,
    Text,
    ScrollView,
    Image,
    Pressable,
    StyleSheet,
    TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import Video from 'react-native-video';
import Icons from 'react-native-vector-icons/Feather';
import { RadioButton, Button, SegmentedButtons } from 'react-native-paper';

import Apis from "../../utils/apis";
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';
import Empty from '../../components/common/Empty';
import { useRollsState } from '../../services/rolls';
import { useAuthState } from '../../services/auth';
import { randomNumber } from '../../utils/helpers';

const ListRolls = ({ navigation }) => {
    const posterImages = [Image.resolveAssetSource(require('../../assets/story1.png')).uri, Image.resolveAssetSource(require('../../assets/story2.png')).uri, Image.resolveAssetSource(require('../../assets/story3.png')).uri];
    const bufferConfig = { minBufferMs: 1000, maxBufferMs: 1500, bufferForPlaybackMs: 500, bufferForPlaybackAfterRebufferMs: 700 };

    const api = new Apis();

    const {userData} = useAuthState();
    const {rolls, setRolls} = useRollsState();

    const [isLoading, setIsLoading] = useState(false);

    const fetchInfo = async () => {
        try {
          setIsLoading(true);
          api.getRolls(userData.id)
            .then(res => {
              setIsLoading(false);
              setRolls(res.map((i, index) => {
                i['ready'] = index === 0 ? true : false;
                i['fullscreen'] = false;
                i['source'] = index === 0 ? i.url : 'https://placekitten.com/g/200/300';
                return i;
              }));
            })
            .catch(err => {
                throw err
            });
        } catch (error) {
          console.log(error)
        } finally {
            setIsLoading(false);
        }
      };
      

    const preview = async (id) => {
        navigation.navigate('PreviewRolls', {id: id});
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, }}>
            {/* {isLoading == true ? <Loader visible={isLoading}></Loader> : null} */}
            <View style={{ flexDirection: 'row' }}>
                {rolls.length > 0 ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {rolls.map((roll, index) => (
                            <Pressable style={{ position: 'relative', width: '33.33%' }} key={index} onPress={() => preview(roll.id)}>
                                <View>
                                    <Video
                                        maxBitRate={100000}
                                        // onReadyForDisplay={() => videoReadyForDisplay(roll)}
                                        id={roll.id}
                                        poster={`${posterImages[randomNumber(0, 2)]}`}
                                        source={{ uri: roll.url }}
                                        bufferConfig={bufferConfig}
                                        muted={true}
                                        paused={true}
                                        // repeat={true}
                                        style={{ width: "99%", height: 213 }} />
                                    <View style={{ position: 'absolute', bottom: 20, justifyContent: 'center' }}>
                                        <View style={{ marginHorizontal: 5, display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }}>
                                            {/* <Text style={styles.countText}>{`Likes: ${roll.likeCount}`}</Text>
                <Text style={styles.countText}>{`Shares: ${roll.sharedCount}`}</Text> */}
                                            <Icons name="play" size={20} color="#FFFFFF" style={{ marginRight: 5 }}></Icons>
                                            <Text style={styles.countText}>{`${roll.viewCount} Views`}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                ) : (<Empty title="Ooops!" subtitle="You don't have any rolls yet."></Empty>)}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    countText: {
        fontSize: 16,
        textShadowColor: "#000",
        textShadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        textShadowRadius: 3.84,

        elevation: 5,
        color: '#FFFFFF',
        marginRight: 5
    }
});

export default ListRolls;