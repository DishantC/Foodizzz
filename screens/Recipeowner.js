import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles/Profile';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import {baseUrl} from '../baseUrl';
import axios from 'axios';
import {
  Card,
  UserInfo,
  UserImg,
  UserName,
  Usertime,
  UserInfoText,
  PostText,
  InteractionWrapper,
  Interaction,
  PostTiime,
  Container,
} from '../styles/FeedStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {Rating} from 'react-native-rating-element';
import Tooltip from 'rn-tooltip';
import Carousel, {Pagination} from 'react-native-snap-carousel';
const {width: viewportWidth} = Dimensions.get('window');
const deviceWidth = Dimensions.get('window').width;
import TimeAgo from 'react-native-timeago';
import VideoPlayer from 'react-native-video-player';
import {windowHeight} from '../utils/Dimentions';
import {ShareDialog} from 'react-native-fbsdk';
import Toast from 'react-native-simple-toast';
import ImageLoad from 'react-native-image-placeholder';

const ProfileScreen = (props) => {
  const [netInfo, setNetInfo] = useState('');
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [city, setcity] = useState();
  const [fileImage, setFileImage] = useState(null);
  const [userFeed, setUserFeed] = useState([]);
  const [taste, setaste] = useState(0.0);
  const [presentation, setpresentation] = useState(0.0);
  const [look, setlook] = useState(0.0);
  const [colour, setcolor] = useState(0.0);
  const [total, setTotal] = useState();
  const [activeSlide, setActiveIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [follow,setfollow]=useState(0);
  const [followbuttondisplay,setfollowbuttondisplay]=useState(true)
  useEffect(() => {
    const fetchData = async () => {
      const item = props?.route?.params?.item;
      await axios
        .get(`${baseUrl}/user/userGetById/${item}`)
        .then((userDetails) => {
          setFileImage(userDetails?.data?.data?.userimage);
          setFirstName(userDetails?.data?.data?.Firstname);
          setEmail(userDetails?.data?.data?.Email);
          setcity(userDetails?.data?.data?.City);
        })
        .catch((e) => {
          console.log('e', e);
        });
        const UserId = await AsyncStorage.getItem('UserId');
        if(UserId===item)
        {
          setfollowbuttondisplay(false)
        }
        else
        {
        await axios.get(`${baseUrl}/follow/cheakfollower/${item}/${UserId}`)
        .then((response)=>
        {
          setfollow(response?.data?.data)
        })
        .catch((e)=>{
          console.log('e', e);
        })
      }
    };
   
    fetchData();
    fetchUserTimeLine();
    getNetInfo();
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(
        `Connection type: ${state.type}
        Is connected?: ${state.isConnected}
        IP Address: ${state.details.ipAddress}`,
      );
    });

    return () => {
      // Unsubscribe to network state updates
      unsubscribe();
    };
  }, []);

  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then((state) => {
      state.isConnected === true
        ? null
        : Alert.alert('Foodizz', 'No Internet Conection');
    });
  };

  const handleEditProfile = async() => {
    if(follow===0)
    {
    const item = props?.route?.params?.item;
    const UserId = await AsyncStorage.getItem('UserId');
    setLoading(true);
    const data = {
      FollowerUserId: item,
      FollowingUserId: UserId,
    };
    await axios.post(`${baseUrl}/follow/insertfollower`,data)
    .then((response)=>
    {
      setfollow(response?.data?.data)
      setLoading(false);
    })
    .catch((e)=>{
      console.log('e', e);
    })
  }
  else
  {
    const item = props?.route?.params?.item;
    const UserId = await AsyncStorage.getItem('UserId');
    setLoading(true);
    await axios.delete(`${baseUrl}/follow/deletefollow/${item}/${UserId}`)
    .then((response)=>
    {
      setfollow(0);
      setLoading(false);
    })
    .catch((e)=>{
      console.log('e', e);
    })
  }
  };

  const fetchUserTimeLine = async () => {
    const item = props?.route?.params?.item;
    setLoading(true);
    await axios
      .get(`${baseUrl}/recipes/GetByUserId/${item}`)
      .then((userFeed) => {
        setUserFeed(userFeed?.data?.data);
        console.log(userFeed)
        setLoading(false);
        setCount(0);
      })
      .catch((e) => {
        console.log('e', e);
      });
  };

  const onShare = async ({item}) => {
    const shareContent = {
      contentType: 'link',
      contentTitle: `${item.title}`,
      contentUrl: `${item.documents[0].image}`,
      imageUrl: `${item.documents[0].image}`,
    };
    ShareDialog.canShow(shareContent).then((canShow) => {
      canShow && ShareDialog.show(shareContent);
    });
  };
  const deleteLike = async (recipeId) => {
    const item = props?.route?.params?.item;
    await axios
      .delete(`${baseUrl}/like/deletelike/${item}/${recipeId.recipeId}`)
      .then(async (res) => {
        await fetchUserTimeLine();
      })
      .catch((e) => {
        console.log('error', e);
      });
  };
  const addLike = async (recipeId) => {
    setCount((prevCount) => prevCount + 1);
    if (count === 0) {
      const UserId = await AsyncStorage.getItem('UserId');
      const item = props?.route?.params?.item;
      if (UserId) {
        const data = {
          UserId: item,
          recipeId: recipeId.recipeId,
        };
        await axios
          .post(`${baseUrl}/like/addlike`, data)
          .then(async (res) => {
            await fetchUserTimeLine();
          })
          .catch((e) => {
            console.log('error', e);
          });
      } else {
        Alert.alert(
          'Login',
          'Plese Login First',
          [
            {
              text: 'Cancel',
              onPress: () => props.navigation.navigate('Feed'),
              style: 'cancel',
            },
            {text: 'Login', onPress: () => props.navigation.navigate('Login')},
          ],
          {cancelable: false},
        );
      }
    } else {
      console.log('ee');
    }
  };

  //render Image

  const renderImage = ({item}) => {
    if (item.type === 'image') {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            width: viewportWidth,
            height: 250,
          }}>
          <ImageLoad
            source={{uri: item.image}}
            style={{
              ...StyleSheet.absoluteFillObject,
              width: '100%',
              height: '100%',
            }}
            loadingStyle={{size: 'large', color: 'blue'}}
            isShowActivity={true}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            width: viewportWidth,
            height: 250,
          }}>
          {item.video === null ? null : (
            <>
              <VideoPlayer
                video={{uri: item.video}}
                videoWidth={deviceWidth * 0.75}
                videoHeight={windowHeight * 0.3}
                autoplay={false}
                resizeMode="cover"
                customStyles={{
                  wrapper: {
                    marginRight: 20,
                  },
                }}
                thumbnail={{
                  uri:
                    'https://cdn.theculturetrip.com/wp-content/uploads/2019/05/ia_0488_indian-cookbooks_jw_header-1024x576.jpg',
                }}
              />
            </>
          )}
        </View>
      );
    }
  };

  const handleTaste = async (val) => {
    const UserId = await AsyncStorage.getItem('UserId');
    if (UserId) {
      setaste(val);
    } else {
      Alert.alert(
        'Login',
        'Plese Login First',
        [
          {
            text: 'Cancel',
            onPress: () => props.navigation.navigate('Feed'),
            style: 'cancel',
          },
          {text: 'Login', onPress: () => props.navigation.navigate('Login')},
        ],
        {cancelable: false},
      );
    }
  };

  const handlePresentation = async (val) => {
    const UserId = await AsyncStorage.getItem('UserId');
    if (UserId) {
      setpresentation(val);
    } else {
      Alert.alert(
        'Login',
        'Plese Login First',
        [
          {
            text: 'Cancel',
            onPress: () => props.navigation.navigate('Feed'),
            style: 'cancel',
          },
          {text: 'Login', onPress: () => props.navigation.navigate('Login')},
        ],
        {cancelable: false},
      );
    }
  };

  const handleLook = async (val) => {
    const UserId = await AsyncStorage.getItem('UserId');
    if (UserId) {
      setlook(val);
    } else {
      Alert.alert(
        'Login',
        'Plese Login First',
        [
          {
            text: 'Cancel',
            onPress: () => props.navigation.navigate('Feed'),
            style: 'cancel',
          },
          {text: 'Login', onPress: () => props.navigation.navigate('Login')},
        ],
        {cancelable: false},
      );
    }
  };

  const handleColor = async (val) => {
    setcolor(val.colour);
    const UserId = await AsyncStorage.getItem('UserId');
    const item = props?.route?.params?.item;
    if (UserId) {
      const data = {
        UserId: item,
        recipeId: val.recipeId,
        presention: presentation,
        taste: taste,
        look: look,
        color: val.colour,
      };
      await axios
        .post(`${baseUrl}/rating/addrating `, data)
        .then((res) => {
          Toast.show('Rating add Successfully', Toast.LONG);
        })
        .catch((e) => {
          console.log('e', e);
        });
    } else {
      Alert.alert(
        'Login',
        'Plese Login First',
        [
          {
            text: 'Cancel',
            onPress: () => props.navigation.navigate('Feed'),
            style: 'cancel',
          },
          {text: 'Login', onPress: () => props.navigation.navigate('Login')},
        ],
        {cancelable: false},
      );
    }
  };

  const handleOpen = async (val) => {
    const recipeId = val.recipeId;
    await axios.get(`${baseUrl}/rating/getratings/${recipeId}`).then((res) => {
      setcolor(res.data.data[0].color);
      setpresentation(res.data.data[0].presention);
      setaste(res.data.data[0].taste);
      setlook(res.data.data[0].look);
      setTotal(res.data.data[0].avarage_rating);
    });
  };

  const onPressRecipe = (item) => {
    props.navigation.navigate('RecipeScreen', {item});
  };
 

  return (
    <>
      <StatusBar backgroundColor="orange" />
      <View style={styles.container}>
        <View style={styles.topcontainer}>
          <View style={styles.maincontainer}>
            <Image
              style={{height: 100, width: 100, borderRadius: 50}}
              source={
                fileImage === null
                  ? {
                      uri:
                        'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png',
                    }
                  : {uri: fileImage}
              }
            />
          </View>
          <View style={styles.middleContainer}>
            <Text style={styles.textcontainer}>{firstName}</Text>
            <Text style={styles.textcontainer11}>{email}</Text>
            <Text style={styles.textcontainer11}>{city}</Text>
          </View>
        </View>
        {followbuttondisplay==true?<TouchableOpacity
        style={styles.editfollowcontainer}
        onPress={handleEditProfile}>
          {follow === 0
          ? <Text style={{alignSelf:'center'}}>Follow</Text>               
          : <Text style={{alignSelf:'center'}}>Following</Text>}
      </TouchableOpacity>:null}
        {loading == true ? (
          <ActivityIndicator
            size="small"
            color="#999"
            style={{marginTop: 15}}
          />
        ) : null}
        <Container>
          <FlatList
            data={userFeed}
            renderItem={({item}) => {
              return (
                <Card>
                  <UserInfo>
                    <UserImg
                      source={{
                        uri:
                          item?.userimage === 'null'
                            ? 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png'
                            : item?.userimage,
                      }}
                    />
                    <UserInfoText>
                      <UserName>{item?.Firstname}</UserName>
                    </UserInfoText>
                    <Usertime>
                      <PostTiime>
                        <TimeAgo time={item.time} />
                      </PostTiime>
                      <View style={{flexDirection: 'row'}}>
                        {item.type[0] === 'Vegan' ? (
                          <Entypo name="dot-single" color="green" size={25} />
                        ) : (
                            <Entypo name="dot-single" color="red" size={25} />
                          ) && item.type[0] === 'Vegetarion' ? (
                          <Entypo name="dot-single" color="green" size={25} />
                        ) : (
                            <Entypo name="dot-single" color="red" size={25} />
                          ) && item.type[0] === 'eggetarion' ? (
                          <Entypo name="dot-single" color="green" size={25} />
                        ) : (
                          <Entypo name="dot-single" color="red" size={25} />
                        )}
                      </View>
                    </Usertime>
                  </UserInfo>

                  <Carousel
                    data={item.documents}
                    renderItem={renderImage}
                    sliderWidth={viewportWidth}
                    itemWidth={viewportWidth}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={1}
                    firstItem={0}
                    loop={false}
                    autoplay={false}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    onSnapToItem={(index) =>
                      setActiveIndex({
                        activeSlide: index,
                      })
                    }
                  />
                  <Pagination
                    dotsLength={item.documents.length}
                    activeDotIndex={activeSlide}
                    containerStyle={{
                      flex: 1,
                      position: 'absolute',
                      alignSelf: 'center',
                      paddingVertical: 8,
                      marginTop: 300,
                    }}
                    dotColor="rgba(255, 255, 255, 0.92)"
                    dotStyle={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      marginHorizontal: 0,
                    }}
                    inactiveDotColor="white"
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                  />

                  <Text numberOfLines={4} style={styles.directionsStyle}>
                    {item.directions}
                  </Text>

                  <PostText>{item.title}</PostText>
                  <InteractionWrapper>
                    <Interaction active="1">
                      <TouchableOpacity
                        onPress={() =>
                          item.islike === 'true'
                            ? deleteLike({
                                recipeId: item._id,
                              })
                            : addLike({
                                recipeId: item._id,
                              })
                        }>
                        <Ionicons
                          name={'heart-outline'}
                          size={25}
                          color={item.islike === 'true' ? 'red' : 'black'}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 14,
                          paddingLeft: 10,
                          marginTop: 5,
                        }}>
                        {item.likes}
                      </Text>
                    </Interaction>
                    <Interaction>
                      <TouchableOpacity
                        onPress={() =>
                          props.navigation.navigate('CommentScreen', {
                            postId: item._id,
                          })
                        }>
                        <Ionicons name="md-chatbubble-outline" size={25} />
                      </TouchableOpacity>
                    </Interaction>
                    <Interaction>
                      <Tooltip
                        width={300}
                        height={150}
                        containerStyle={{marginLeft: 20}}
                        onOpen={() =>
                          handleOpen({
                            recipeId: item._id,
                          })
                        }
                        popover={
                          <>
                            <View style={{flexDirection: 'row', bottom: 10}}>
                              <Rating
                                rated={total}
                                totalCount={5}
                                ratingColor="#f1c644"
                                ratingBackgroundColor="#d4d4d4"
                                size={18}
                                readonly // by default is false
                                icon="ios-star"
                                direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                              />
                              <Text style={styles.totalrating44}>
                                {total?.toFixed(1) === null
                                  ? 0.0
                                  : total?.toFixed(1)}{' '}
                                out of 5
                              </Text>
                            </View>
                            <View style={styles.spacecontainer}>
                              <View style={styles.rowcontainer}>
                                <Text style={styles.middlecontainer}>
                                  Taste
                                </Text>
                                <View style={{flex: 0.4}}>
                                  <Rating
                                    rated={taste}
                                    totalCount={5}
                                    ratingColor="#f1c644"
                                    ratingBackgroundColor="#d4d4d4"
                                    size={15}
                                    onIconTap={(val) => handleTaste(val)}
                                    icon="ios-star"
                                    direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                                  />
                                </View>
                                <Text style={styles.totalrating}>
                                  {taste === null ? 0.0 : taste.toFixed(2)}
                                </Text>
                              </View>
                              <View style={styles.rowcontainer}>
                                <Text style={styles.middlecontainer}>
                                  Presentation
                                </Text>
                                <View style={{flex: 0.4}}>
                                  <Rating
                                    rated={presentation}
                                    totalCount={5}
                                    ratingColor="#f1c644"
                                    ratingBackgroundColor="#d4d4d4"
                                    size={15}
                                    onIconTap={(val) => handlePresentation(val)}
                                    icon="ios-star"
                                    direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                                  />
                                </View>
                                <Text style={styles.totalrating}>
                                  {presentation === null
                                    ? 0.0
                                    : presentation.toFixed(2)}
                                </Text>
                              </View>
                              <View style={styles.rowcontainer}>
                                <Text style={styles.middlecontainer}>Look</Text>
                                <View style={{flex: 0.4}}>
                                  <Rating
                                    rated={look}
                                    totalCount={5}
                                    ratingColor="#f1c644"
                                    ratingBackgroundColor="#d4d4d4"
                                    size={15}
                                    onIconTap={(val) => handleLook(val)}
                                    icon="ios-star"
                                    direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                                  />
                                </View>
                                <Text style={styles.totalrating}>
                                  {look === null ? 0.0 : look.toFixed(2)}
                                </Text>
                              </View>
                              <View style={styles.rowcontainer}>
                                <Text style={styles.middlecontainer}>
                                  Color
                                </Text>
                                <View style={{flex: 0.4}}>
                                  <Rating
                                    rated={colour}
                                    totalCount={5}
                                    ratingColor="#f1c644"
                                    ratingBackgroundColor="#d4d4d4"
                                    size={15}
                                    onIconTap={(val) =>
                                      handleColor({
                                        colour: val,
                                        recipeId: item._id,
                                      })
                                    }
                                    icon="ios-star"
                                    direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                                  />
                                </View>
                                <Text style={styles.totalrating}>
                                  {colour === null ? 0.0 : colour.toFixed(2)}
                                </Text>
                              </View>
                            </View>
                          </>
                        }
                        backgroundColor="white">
                        <Ionicons name="md-star-outline" size={25} />
                      </Tooltip>
                    </Interaction>
                    <Interaction>
                      <AntDesign
                        name="sharealt"
                        size={25}
                        onPress={() =>
                          onShare({
                            item: item,
                          })
                        }
                      />
                    </Interaction>
                    <Interaction>
                      <TouchableOpacity
                        underlayColor="rgba(73,182,77,0.9)"
                        onPress={() => onPressRecipe(item._id)}>
                        <Entypo name="bowl" size={25} />
                      </TouchableOpacity>
                    </Interaction>
                  </InteractionWrapper>
                </Card>
              );
            }}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        </Container>
      </View>
    </>
  );
};

export default ProfileScreen;