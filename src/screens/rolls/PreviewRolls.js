import { View, Text, Dimensions, Image, StyleSheet, FlatList, PanResponder } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Video from 'react-native-video';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import Carousel from 'react-native-reanimated-carousel';
import { IconButton, MD3Colors } from 'react-native-paper';
import Apis from '../../utils/apis';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';
import DetailsCards from '../../components/skeleton/details';
import IconCustom from '../../components/common/IconCustom';

import { useRollsState } from '../../services/rolls';
import { useAuthState } from '../../services/auth';
import { getIconTextName } from '../../utils/helpers';
import {SafeAreaView} from 'react-native-safe-area-context';

const PreviewRolls = ({ navigation, route }) => {
  const posterImage = Image.resolveAssetSource(require('../../assets/wait.gif')).uri;
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const flatListRef = useRef(null);
  const videoRef = useRef(null);

  const { userData } = useAuthState();
  const { rolls, setRolls } = useRollsState();

  const [isLoading, setIsLoading] = useState(true);
  const [previewRoll, setPreviewRoll] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  // const [currentVideoId, setCurrentVideoId] = useState(null);

  const bufferConfig = {
    minBufferMs: 15000,
    maxBufferMs: 50000,
    bufferForPlaybackMs: 2500,
    bufferForPlaybackAfterRebufferMs: 5000
  };

  const RenderVideo = ({ item, index }) => (
    <View key={item.id} style={{flex: 1, height: height, borderWidth: 0, justifyContent: 'center', backgroundColor: '#000000'}}>
      {currentVideoIndex == item.id ? 
        <Video
          ref={videoRef}
          id={item.id}
          poster={posterImage}
          posterResizeMode={'center'}
          source={{ uri: item.url }}
          // initialScrollIndex={currentVideoIndex}
          bufferConfig={bufferConfig}
          muted={currentVideoIndex !== item.id}
          paused={currentVideoIndex !== item.id}
          onFullscreenPlayerWillPresent={() => videoRef.current.seek(0)}
          repeat={true}
          selectedVideoTrack={{
            type: "resolution",
            value: width
          }}
          resizeMode="cover"
          style={{ flex: 1 }}
        />
      : <Image source={{uri: posterImage}} width={width} />}
      
      <View style={styles.videoInfo}>
        <View style={styles.likeView}>
          {/* <Text style={styles.count}>{currentVideoIndex} -</Text> */}
          <Text style={styles.count}>{item.likeCount}</Text>
          <IconButton icon="heart-outline" size={30} iconColor='white'></IconButton>
        </View>
        <View style={styles.shareView}>
          <Text style={styles.count}>{item.sharedCount}</Text>
          <IconButton icon="share" size={30} iconColor='white'></IconButton>
        </View>

        <View style={styles.totalView}>
          <Text style={styles.count}>{item.viewCount}</Text>
          <IconButton icon="eye" size={30} iconColor='white'></IconButton>
        </View>
      </View>

      <View
        style={styles.creatorView}>
        {userData && "imageUrl" in userData && userData.imageUrl !== null ?
          <IconCustom type="image" source={userData.imageUrl} size={45} square={false}></IconCustom> :
          <IconCustom type="text" source={getIconTextName(userData.collaboratorName)} size={45} square={false}></IconCustom>
        }
        <Text style={styles.previewNameText}>{userData.collaboratorName}</Text>
      </View>
    </View>
  );

  const init = () => {
    setPreviewRoll(rolls.find(i => i.id === route.params.id));
    setIsLoading(false);
    setCurrentVideoIndex(route.params.id);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentVideoIndex(viewableItems[0].item.id);  // Start the video
  }).current;

  // const onViewableItemsChanged = useCallback(({ viewableItems }) => {
  //   // Iterate through the viewable items
  //   viewableItems.forEach(({ item, isViewable }) => {
  //     // Check if the item is currently in view
  //     if (isViewable) {
  //       // Start playing the video
  //       item.videoRef?.current?.play();
  //     } else {
  //       // Stop the video if it's not in view
  //       item.videoRef?.current?.pause();
  //     }
  //   });
  // }, []);

  useEffect(() => {
    init();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
      <Header navigation={navigation} type='back' options={{title: 'Roll Preview'}} />
      {/* <FlatList
        ref={flatListRef}
        horizontal={false}
        pagingEnabled
        data={rolls}
        numColumns={1}
        initialNumToRender={2}
        removeClippedSubviews={true}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={item => item.id.toString()}
        getItemLayout={(data, index) => ({length: height, offset: height * index, index})}
        renderItem={renderVideo}
      /> */}
      {previewRoll == null ? <DetailsCards /> : <RenderVideo item={previewRoll} index={0} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  count: {fontSize: 18, color: '#FFFFFF'},
  likeView: {marginBottom: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'},
  shareView: {marginBottom: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'},
  totalView: {marginBottom: 35, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  videoInfo: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    color: '#FFFFFF',
    borderRadius: 20,
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontSize: 18,
    justifyContent: 'space-between',
  },
  previewNameText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: 800,
    color: '#FFFFFF'
  },
  creatorView: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    color: '#FFFFFF',
    padding: 10,
    fontSize: 18,
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
export default PreviewRolls;
