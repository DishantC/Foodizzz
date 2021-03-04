import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import AddPostScreen from '../screens/AddPostScreen';
import allsearch from '../screens/allsearch';
import RecipeScreen from '../screens/RecipeScreen/RecipeScreen';
import SearchScreen from '../screens/SearchScreen';
import CommentScreen from '../screens/CommentScreen';
import Profile from '../screens/Profile';
import AsyncStorage from '@react-native-community/async-storage';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CategoryStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Browse"
      component={CategoriesScreen}
      options={{
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          marginLeft: 30,
        },
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerLeft: () => null,
        headerRight: () => <View style={{marginRight: 10}}></View>,
      }}
    />
    <Stack.Screen
      name="RecipeScreen"
      component={RecipeScreen}
      options={{
        title: 'Recipe Details',
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          right: 25,
        },
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerRight: () => <View style={{marginRight: 10}}></View>,
        headerBackTitleVisible: false,

        headerBackImage: () => (
          <View style={{}}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="CommentScreen"
      component={CommentScreen}
      options={{
        title: 'Comments',
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          right: 25,
        },
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{}}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          marginLeft: 10,
        },
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerBackImage: () => (
          <View style={{}}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          marginLeft: 30,
        },
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerLeft: () => null,
        headerRight: () => <View style={{marginRight: 10}}></View>,
      }}
    />
  </Stack.Navigator>
);

const FeedStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Feed"
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{
        title: 'Submit Recipe',
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          right: 25,
        },
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{}}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="CommentScreen"
      component={CommentScreen}
      options={{
        title: 'Comments',
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          right: 25,
        },
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{}}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="RecipeScreen"
      component={RecipeScreen}
      options={{
        title: 'Recipe Details',
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          right: 25,
        },
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerRight: () => <View style={{marginRight: 10}}></View>,
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{}}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Search"
      component={allsearch}
      options={{
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          marginLeft: 20,
        },
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerLeft: () => null,
        headerRight: () => <View style={{}}></View>,
      }}
    />
    <Stack.Screen
      name="RecipeScreen"
      component={RecipeScreen}
      options={{
        title: 'Recipe Details',
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          right: 25,
        },
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerRight: () => <View style={{marginRight: 10}}></View>,
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{}}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="CommentScreen"
      component={CommentScreen}
      options={{
        title: 'Comments',
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          right: 25,
        },
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{}}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const AppStack = () => {
  const [userId, setUserId] = useState();
  useEffect(() => {
    const fetchUserData = async () => {
      const UserId = await AsyncStorage.getItem('UserId');
      setUserId(UserId);
    };
    console.log('userId', userId);
    fetchUserData();
  }, []);
  console.log('userId', userId);
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'orange',
      }}>
      {userId === null ? (
        <>
          <Tab.Screen
            name="Home"
            component={FeedStack}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name="home-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Recipe"
            component={CategoryStack}
            options={{
              tabBarLabel: 'Browse',
              tabBarIcon: ({color, size}) => (
                <Ionicons name="pencil-outline" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Search"
            component={SearchStack}
            options={{
              tabBarLabel: 'Search',
              tabBarIcon: ({color, size}) => (
                <Ionicons name="search" color={color} size={size} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Home"
            component={FeedStack}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name="home-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Recipe"
            component={CategoryStack}
            options={{
              tabBarLabel: 'Browse',
              tabBarIcon: ({color, size}) => (
                <Ionicons name="pencil-outline" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Search"
            component={SearchStack}
            options={{
              tabBarLabel: 'Search',
              tabBarIcon: ({color, size}) => (
                <Ionicons name="search" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStack}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({color, size}) => (
                <AntDesign name="user" color={color} size={size} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default AppStack;
