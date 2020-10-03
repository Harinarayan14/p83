import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator'
import ItemRequestScreen from '../screens/ItemRequestScreen';


export const AppTabNavigator = createBottomTabNavigator({
  Home : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/home.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Home",
    }
  },
  ItemRequest: {
    screen: ItemRequestScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/request-item.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Exchange Item",
    }
  }
});
