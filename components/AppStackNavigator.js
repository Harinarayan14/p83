import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import ItemExchangeScreen from '../screens/ItemExchangeScreen';
import ExchangerDetailsScreen  from '../screens/ExchangerDetailsScreen';




export const AppStackNavigator = createStackNavigator({
  ItemExchangeScreen : {
    screen : ItemExchangeScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  ExchangerDetails : {
    screen : ExchangerDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'ItemExchangeScreen'
  }
);
