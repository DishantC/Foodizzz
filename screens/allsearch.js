import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/Search';
import axios from 'axios';
import {Rating} from 'react-native-rating-element';
import NetInfo from '@react-native-community/netinfo';
import {baseUrl} from '../baseUrl';
import ImageLoad from 'react-native-image-placeholder';

const SearchScreen = (props) => {
  const [data, setData] = useState([]);
  const [value, setvalue] = useState();
  const [netInfo, setNetInfo] = useState('');
  useEffect(() => {
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

  const onPressRecipe = (item) => {
    props.navigation.navigate('RecipeScreen', {item});
  };
  const handleSearch = (text) => {
    console.log('text', text);
    axios
      .all([
        axios.get(`${baseUrl}/recipes/searchtitle/${text}`),
        axios.get(`${baseUrl}/recipes/searchkeyword/${text}`),
      ])
      .then((responseArr) => {
        var array1 = responseArr[0]?.data?.data;
        var array2 = responseArr[1]?.data?.data;
        if (array1.length >= array2.length) {
          const res = array1.filter((x) => !array2.includes(x));
          console.log('res', res);
          setData(res);
        } else {
          const res = array2.filter((x) => !array1.includes(x));
          console.log('res', res);
          setData(res);
        }
      });
  };

  const renderRecipes = ({item}) => {
    return (
      <TouchableOpacity
        underlayColor="rgba(73,182,77,0.9)"
        onPress={() => onPressRecipe(item._id)}>
        <View style={{flexDirection: 'row'}}>
          <ImageLoad
            style={styles.recipeImage}
            source={{
              uri: item?.documents[0]?.image,
            }}
            loadingStyle={{size: 'large', color: 'blue'}}
            isShowActivity={true}
          />
          <View style={{flexDirection: 'column', width: '64%'}}>
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>{item.title}</Text>
            <View style={{flexDirection: 'row'}}>
              <Rating
                rated={item?.avaragerating}
                totalCount={5}
                ratingColor="#f1c644"
                ratingBackgroundColor="#d4d4d4"
                size={18}
                readonly // by default is false
                icon="ios-star"
                direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
              />
            </View>
            <Text style={{fontSize: 13, width: '75%'}} numberOfLines={4}>
              {item.directions}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar backgroundColor="orange" />
      <View style={{flex: 1}}>
        <FlatList
          vertical
          ListHeaderComponent={
            <View style={styles.headercontainer}>
              <Ionicons
                name="search"
                color={'#333'}
                size={18}
                style={{marginVertical: 15, marginHorizontal: 10}}
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                value={value}
                onChangeText={(queryText) => handleSearch(queryText)}
                placeholder="Search"
                style={{width: '100%'}}
                placeholderTextColor="#333"
              />
            </View>
          }
          showsVerticalScrollIndicator={false}
          numColumns={1}
          data={data}
          renderItem={renderRecipes}
          keyExtractor={(item) => `${item.recipeId}`}
        />
      </View>
    </>
  );
};

export default SearchScreen;
