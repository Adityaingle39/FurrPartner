import { Platform, View, Text, Dimensions, Image, StyleSheet, FlatList, Share, VirtualizedList, PanResponder } from 'react-native';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Video from 'react-native-video';
import {SafeAreaView} from 'react-native-safe-area-context';
import { IconButton,FAB,useTheme } from 'react-native-paper';
import { hasNotch, getNotchHeight } from 'react-native-device-info';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import VideoGallery from '../../components/common/VideoGallery';
import ImagePicker from 'react-native-image-crop-picker';
import Empty from '../../components/common/Empty';
import Apis from '../../utils/apis';
import Toaster from '../../components/common/Toaster';
import Loader from '../../components/common/Loader';
import IconCustom from '../../components/common/IconCustom';
import { useRollsState } from '../../services/rolls';
import { useAuthState } from '../../services/auth';
import { getIconTextName, setUserProfile,randomString} from '../../utils/helpers';
import { colors } from '../../utils/styles/gobalstyle';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AwesomeIcons from 'react-native-vector-icons/FontAwesome5'
import { useIsFocused } from '@react-navigation/native';

const posterImage = Image.resolveAssetSource(require('../../assets/wait-white.gif')).uri;
const hadDeviceNotch = hasNotch();
// const notchType = hasNotch() ? getNotchHeight() : 0;

const RenderVideo = React.memo(({ item, currentVideoIndex, currentVideoStatus, width, height}) => {
  const isFocused = useIsFocused();
  const videoRef = useRef(null);
  useEffect(() => {
    if (isFocused && currentVideoIndex === item.id) {
      videoRef.current?.seek(0);
    } else {
      
      videoRef.current?.seek(0); 
    }
  }, [isFocused, currentVideoIndex, item.id]);
  return (
    <View style={{flex: 1}}>
      {currentVideoIndex == item.id ? 
      <Video
        ref={videoRef}
        id={item.id}
        poster={posterImage}
        posterResizeMode={'center'}
        source={{ uri: item.url }}
        // initialScrollIndex={currentVideoIndex}
        // bufferConfig={bufferConfig}
        muted={false}
          paused={!isFocused}
        // onFullscreenPlayerWillPresent={() => videoRef.current.seek(0)}
        repeat={true}
        selectedVideoTrack={{
          type: "resolution",
          value: 128
        }}
        resizeMode="cover"
        style={{height: height}}
      />
      : <Image source={{uri: posterImage}} width={width} /> }
    </View>
  );
});

const Rolls = ({ route,navigation }) => {
  const actionSheetRef = useRef(null);
  const theme=useTheme();
  const api = new Apis();
  const flatListRef = useRef(null);
  const { width, height } = Dimensions.get('window');
  const isFocused = useIsFocused();
  const { userData, setUserData } = useAuthState();
  const { rolls, setRolls } = useRollsState();

  const [isLoading, setIsLoading] = useState(false);
  const [reels, setReels] = useState(rolls);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [renderVideoIndex, setRenderVideoIndex] = useState(0);
  const [videoHeight, setVideoHeight] = useState(height);
  
  const bufferConfig = {
    minBufferMs: 15000,
    maxBufferMs: 50000,
    bufferForPlaybackMs: 2500,
    bufferForPlaybackAfterRebufferMs: 5000
  };
  const fetchDataOnFocus = () => {
    fetchInfo();
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchDataOnFocus);

    return () => unsubscribe();
  }, []);
  const onLayout=(event)=> {
    console.log(event.nativeEvent.layout.height, event.nativeEvent.layout.width);
    // setWidth(width);
    // setHeight(height);
    const newHeight = Platform.OS === 'ios' ? height : height;
    setVideoHeight(newHeight);
    // const reduceHeightiOS = (height / 100) * 7.65
    // const reduceHeightAndroid = 0;
    // setVideoHeight(Platform.OS === 'ios' ? height - reduceHeightiOS : height - reduceHeightAndroid);
  }

 

  const currentVideoStatus = (id) => {
    return currentVideoIndex !== id;
  }

  const init = () => {
    if ((route.params && 'id' in route.params) || (reels && reels.length == 0)) {
      fetchInfo();
    } else {
      setRequestedVideo(reels);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems, index }) => {
    // console.log(viewableItems);
    if (viewableItems.length > 0) {
      setCurrentVideoIndex(viewableItems[0].item.id);  
    }
  }).current;

  const setRequestedVideo = (res) => {
    if (route.params && 'id' in route.params) {
      let tmpReels = [...res];
      const videoIndex = tmpReels.findIndex(i => i.id == route.params.id);
      if (videoIndex > -1) {
        let newReels = tmpReels.slice(videoIndex);
        newReels.concat(tmpReels.slice(0, videoIndex));
        setRolls(newReels);
        setReels(newReels);
        setCurrentVideoIndex(route.params.id);
      }

      console.log("setRequestedVideo", route.params.id, tmpReels);
    } else {
      setCurrentVideoIndex(reels[0].id);
    }
  }

  const openCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
    }).then((video) => {
      if (video) {
        const imageObject = {
          uri: video.path,
          type: video.mime,
          name: `video_${moment().unix()}.mp4`,
        };
        navigation.navigate('CreateRoll', { selectedImage: imageObject });
      }
    }).catch((error) => {
      console.log('ImagePicker Error:', error);
    });
  };
  useEffect(() => {
    if (isFocused) {
      // Set the current video index when the screen is focused
      setCurrentVideoIndex(reels[renderVideoIndex]?.id);
    }
  }, [isFocused, reels, renderVideoIndex]);
  const openGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then((video) => {
      console.log(video);
      const imageObject = {
        uri: video.path,
        type: video.mime,
        name: `video_${moment().unix()}.mp4`, 
      };
      navigation.navigate('CreateRoll', { selectedImage: imageObject });
    }).catch((error) => {
      console.log('ImagePicker Error:', error);
    });
  };
  const fetchInfo = async () => {
    try {
      setIsLoading(true);
      api.getRolls(userData.id)
      .then(res => {
        console.log("Link Count",res)
        setRolls(res);
        setReels(res);
        setRequestedVideo(res);
      })
      .catch(err => {
        throw err;
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (userData.id == null) {
      setUserProfile((data) => {
        setUserData(data);
        fetchInfo();
      });
    } else {
      fetchInfo();
    }
  }, []);

  const RenderItem = ({ item, index, navigation, actionSheetRef}) => (
    <View onLayout={onLayout} key={`${item.id}`} style={{flexGrow: 1, height: height, backgroundColor: '#000000'}}>
      
      <RenderVideo item={item} currentVideoIndex={currentVideoIndex} height={height} width={width} currentVideoStatus={currentVideoStatus(item.id)} />
      <View style={{position:'absolute',bottom:'35%',right:'8%',alignItems:'center'}}>
        <Icon color={colors.white}  size={40} name='heart' />
        <Text style={{textAlign:'center',color:'white'}}>{item.likeCount} Likes</Text>
      </View>
      <View style={{position:'absolute',bottom:'25%',right:'7%',alignItems:'center'}}>
        <AwesomeIcons color={colors.white}  size={40} name='eye' />
        <Text style={{textAlign:'center',color:'white'}}>{item.viewCount} Views</Text>
      </View>
      <View style={{flex: 1, flexDirection: 'row', position: 'absolute', zIndex: 9999, bottom: Platform.OS == 'ios' ? 40 : 20, width: width}}>
        <View style={{flexDirection: 'column-reverse', marginTop: 40, alignSelf: 'auto', alignItems: 'flex-start', flexGrow: 1, maxWidth: width / 1.2}}>
          <View style={{flexDirection: 'column', lexGrow: 1, padding: 20, verticalAlign: 'baseline', alignItems: 'baseline'}}>
          
            <View style={{marginTop: 10, padding: 0, marginLeft: -20, flexGrow: 1}}>
              <Text style={styles.previewDescText}>{item.description}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, height: 'auto', maxHeight: height, flexDirection: 'column', backgroundColor: '#000000' }}>
      {isLoading ? (
        <Loader title="Rolls" visible={isLoading} />
      ) : reels.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',position:'relative' }}>
        <Empty style={{ marginVertical: '5%' }} title="" subtitle="No Rolls Uploaded Yet!" />
      </View>
      ) : (
        <VirtualizedList
          pagingEnabled={true}
          ref={flatListRef}
          data={reels}
          windowSize={5}
          horizontal={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
          renderItem={({ item, index }) => <RenderItem item={item} index={index} actionSheetRef={actionSheetRef} />}
          keyExtractor={(item) => item.id}
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 95 }}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      )}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary, right: 10, bottom: '10%', position: 'absolute' }]}
        color={theme.colors.primaryContainer}
        onPress={() => actionSheetRef.current?.show()}
      />
      <VideoGallery
        actionSheetRef={actionSheetRef}
        id="settings-edit-profile"
        options={{
          gallery: true,
          camera: true,
          galleryCallback: openGallery,
          cameraCallback: openCamera,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  count: {fontSize: 18, color: '#FFFFFF'},
  likeView: {marginBottom: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'},
  saveView: {marginBottom: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  shareView: {marginBottom: 35, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'},
  fab: {
    position: 'absolute',
    margin: 16,
    borderRadius: 50,
    // backgroundColor: colors.primary,
    right: 10,
    bottom: '50%',
  },
  videoInfo: {
    // position: 'absolute',
    // bottom: 60,
    // right: 20,
    color: '#FFFFFF',
    borderRadius: 20,
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontSize: 18,
    justifyContent: 'space-between'
  },
  previewNameText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: 800,
    textTransform: 'capitalize',
    color: '#FFFFFF',
    textShadowColor: '#000000A6',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  previewDescText: {
    marginLeft: 20,
    fontSize: 15,
    // fontWeight: 800,
    textTransform: 'capitalize',
    color: '#FFFFFF',
    textShadowColor: '#000000A6',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  creatorView: {
    verticalAlign: 'bottom',
    flexGrow: 1,
    bottom: 0,
    left: 20,
    color: '#FFFFFF',
    padding: 10,
    fontSize: 18,
    marginBottom: 40,
    justifyContent: 'flex-start',
    alignSelf: 'baseline'
  }
});
export default Rolls;


// import {
//   View,
//   Text,
//   SafeAreaView,
//   Image,
//   Pressable,
//   Dimensions,
//   RefreshControl,
//   VirtualizedList,
//   StyleSheet,
//   TextInput,
// } from 'react-native';
// import React, {useRef, useState, useEffect, useCallback} from 'react';
// import Video from 'react-native-video';
// import Icons from 'react-native-vector-icons/Feather';
// import {RadioButton, Button, SegmentedButtons, useTheme} from 'react-native-paper';
// import ImagePicker from 'react-native-image-crop-picker';

// import Apis from '../../utils/apis';
// import Header from '../../components/common/Header';
// import Loader from '../../components/common/Loader';
// import Empty from '../../components/common/Empty';
// import {randomNumber} from '../../utils/helpers';
// import {useRollsState} from '../../services/rolls';
// import {useAuthState} from '../../services/auth';
// import VideoGallery from '../../components/common/VideoGallery';
// import {
//   btnSimple,
//   colors,
//   container,
//   searchInputView,
// } from '../../utils/styles/gobalstyle';

// const Rolls = ({navigation}) => {
//   const api = new Apis();
//   const numColumns = 2; // Number of columns in the grid
//   const actionSheetRef = useRef(null);
//   const height = Dimensions.get('window').height;
//   const width = Dimensions.get('window').width;
//   const itemWidth = (width - 50) / numColumns;
//   const itemHeight = 300;

//   const bufferConfig = {
//     minBufferMs: 1000,
//     maxBufferMs: 1500,
//     bufferForPlaybackMs: 500,
//     bufferForPlaybackAfterRebufferMs: 700,
//   };
//   const posterImages = [
//     Image.resolveAssetSource(require('../../assets/story1.png')).uri,
//     Image.resolveAssetSource(require('../../assets/story2.png')).uri,
//     Image.resolveAssetSource(require('../../assets/story3.png')).uri,
//   ];

  

//   const {userData} = useAuthState();
//   const {rolls, setRolls} = useRollsState();

//   const [refreshing, setRefreshing] = React.useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [loadedVideos, setLoadedVideos] = useState({});
//   const flatListRef = useRef(null);

//   const handleVideoLoad = videoId => {
//     setLoadedVideos(prevLoadedVideos => ({
//       ...prevLoadedVideos,
//       [videoId]: true,
//     }));
//   };

//   const renderItem = ({item, index}) => {
//     return (
//       <View key={`roll-item-${item.id}-${index}`} style={{marginLeft: index % 2 == 0 ? 0 : 10}}>
//         <Pressable key={index} onPress={() => preview(item.id)} style={{}}>
//           {/* {loadedVideos[item.id] ? (
//             <Video
//               poster={`${posterImages[randomNumber(0, 2)]}`}
//               source={{uri: item.url}}
//               resizeMode="cover"
//               muted={true}
//               bufferConfig={bufferConfig}
//               style={{width: itemWidth, height: itemHeight}}
//             />
//           ) : (
//             <Image
//               source={{uri: posterImages[randomNumber(0, 2)]}}
//               width={itemWidth}
//               height={itemHeight}
//             />
//           )} */}
//           <Video
//             poster={`${posterImages[randomNumber(0, 2)]}`}
//             source={{uri: item.url}}
//             // resizeMode="cover"
//             muted={true}
//             bufferConfig={bufferConfig}
//             style={{width: itemWidth, height: itemHeight}}
//           />
//           <View
//             style={{position: 'absolute', bottom: 20, justifyContent: 'center'}}>
//             <View
//               style={{
//                 marginHorizontal: 5,
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 flexDirection: 'row',
//                 justifyContent: 'space-around',
//               }}>
//               {/* <Text style={styles.countText}>{`Likes: ${item.likeCount}`}</Text>
//     <Text style={styles.countText}>{`Shares: ${item.sharedCount}`}</Text> */}
//               <Icons
//                 name="play"
//                 size={20}
//                 color="#FFFFFF"
//                 style={{marginRight: 5}}></Icons>
//               <Text style={styles.countText}>{`${item.viewCount} Views`}</Text>
//             </View>
//           </View>
//         </Pressable>
//       </View>
//     );
//   };

//   const preview = async id => {
//     navigation.navigate('PreviewRolls', {id: id});
//   };

//   const onViewableItemsChanged = useRef(({viewableItems}) => {
//     const visibleVideoIds = viewableItems.map(item => item.item.id);
//     setLoadedVideos(prevLoadedVideos => {
//       const updatedLoadedVideos = {};
//       visibleVideoIds.forEach(i => {
//         updatedLoadedVideos[i] = true;
//       });
//       return updatedLoadedVideos;
//     });
//   }).current;

//   const openCamera = () => {
//     ImagePicker.openCamera({
//       mediaType: 'video',
//     }).then(video => {
//       if (video) {
//         const imageObject = {
//           uri: video.path,
//           type: video.mime,
//           name: 'video.mp4',
//         };
//         navigation.navigate('CreateRoll', {selectedImage: imageObject});
//       }
//     }).catch(error => {
//       console.log('ImagePicker Error:', error);
//     });
//   };

//   const openGallery = () => {
//     ImagePicker.openPicker({
//       mediaType: 'video',
//     }).then(video => {
//       const imageObject = {
//         uri: video.path,
//         type: video.mime,
//         name: 'video.mp4',
//       };
//       navigation.navigate('CreateRoll', {selectedImage: imageObject});
//     }).catch(error => {
//       console.log('ImagePicker Error:', error);
//     });
//   };

//   const fetchRolls = type => {
//     if (type != 'reload') {
//       setIsLoading(true);
//     }
//     api.getRolls(id)
//     .then(res => {
//       setRolls(res);
//       type == 'reload' ? setRefreshing(false) : setIsLoading(false);
//     }).catch(err => {
//       type == 'reload' ? setRefreshing(false) : setIsLoading(false);
//       console.log('roll message', err.message);
//     });
//   };

//   const getItemCount = (_data) => {
//     return Math.ceil(rolls.length / numColumns);
//   };

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     fetchRolls('reload')
//   }, []);

//   useEffect(() => {
//     fetchRolls('');
//   }, []);
//   const theme=useTheme();
//   return (
//     <SafeAreaView style={{flex: 1}}>
//       {isLoading == true ? <Loader visible={isLoading}></Loader> : null}
//       <Header navigation={navigation}></Header>
//       <View style={{margin: 20, marginTop: 0}}>
//         <Button
//           icon="plus"
//           mode="contained"
//           buttonColor={colors.primary}
//           style={btnSimple}
//           onPress={() => actionSheetRef.current?.show()}>
//             <Text style={{color:colors.white}}> Create New Roll</Text>
         
//         </Button>
//         <VideoGallery
//           actionSheetRef={actionSheetRef}
//           id="settings-edit-profile"
//           options={{
//             gallery: true,
//             camera: true,
//             galleryCallback: openGallery,
//             cameraCallback: openCamera,
//           }}></VideoGallery>
//       </View>
//       <View style={{marginHorizontal: 20, marginTop: 0}}>
//         {/*refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }*/}
//         <View style={[searchInputView,{backgroundColor:"transparent",borderColor:theme.colors.onSurfaceVariant,borderWidth:1}]}>
//           <Icons
//             name="search"
//             size={20}
//             color={theme.colors.onSurface}
//             style={{ marginHorizontal: 5, marginTop: 10 }}
//           />
//           <TextInput style={{flexGrow:1}} placeholderTextColor={theme.colors.onSurface} placeholder="Search Roll..." />
//         </View>

//         <View style={{flexDirection: 'row'}}>
//           <Icons name="chevron-down" size={25} color={theme.colors.onSurface} />
//           <Text style={[styles.listViewText,{color:theme.colors.onSurface}]}>Uploaded Rolls</Text>
//           <Icons />
//         </View>
//         <View style={{height: height - 230}}>
//           {rolls && rolls.length > 0 ? (
//             <VirtualizedList
//               // horizontal={false}
//               ref={flatListRef}
//               refreshControl={
//                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//               }
//               data={rolls}
//               // numColumns={numColumns}
//               initialNumToRender={2}
//               removeClippedSubviews={true}
//               viewabilityConfig={{viewAreaCoveragePercentThreshold: 100}}
//               onViewableItemsChanged={onViewableItemsChanged}
//               // keyExtractor={item => item.id.toString()}
//               // columnWrapperStyle={{justifyContent: 'space-between'}}
//               // // contentContainerStyle={{paddingBottom: 230, backgroundColor: 'yellow'}}
//               // getItemLayout={(data, index) => ({
//               //   length: itemHeight,
//               //   offset: itemHeight * index,
//               //   index,
//               // })}
//               // debug={true}
//               // renderItem={renderItem}
//               // getItem={getItem}
//               // getItemCount={getItemCount}
//               onEndReachedThreshold={0.5} // Adjust the threshold as needed
//               onEndReached={() => {
//                 console.log('Reached End');
//               }}
//               renderItem={({item, index}) => {
//                 return (
//                   <View key={`roll-row-${index}`} style={{flexDirection: 'row', marginTop: index % 2 == 0 ? 0 : 10}}>
//                     {item.map((elem, i) => renderItem({item: elem, index: i}))}
//                   </View>
//                 )
//               }}
//               keyExtractor={(item) => item.id}
//               getItemCount={getItemCount}
//               getItem={(data, index) => {
//                 let items = []
//                 for (let i = 0; i < numColumns; i++) {
//                   const item = data[index * numColumns + i]
//                   item && items.push(item)
//                 }
//                 return items
//               }}
//               numColumns={numColumns}
//               contentContainerStyle={{alignItems: 'flex-start', paddingBottom: (itemHeight / 2) - 90}}
//             />
//           ) : null}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   profileName: {
//     fontSize: 15,
//     fontWeight: 600,
//     color: '#000000',
//   },
//   profileDes: {
//     fontWeight: 500,
//     color: '#898A8D',
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: 500,
//     marginLeft: 15,
//   },
//   listViewText: {
//     fontSize: 18,
//     fontWeight: 700,
//     color: '#000000',
//     marginLeft: 5,
//   },
//   backgroundVideo: {
//     height: 200,
//     width: '30%',
//     borderWidth: 1,
//   },
//   countText: {
//     fontSize: 16,
//     textShadowColor: '#000',
//     textShadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     textShadowRadius: 3.84,

//     elevation: 5,
//     color: '#FFFFFF',
//     marginRight: 5,
//   },
// });

// export default Rolls;




