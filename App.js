import { View, TouchableHighlight, Image, Animated, Easing } from 'react-native';
import { Icon, Header, Button } from 'react-native-elements';
import React, { Component } from 'react';
import { Provider } from "react-redux";
import Home from './app/containers/Home'
import DeveloperOptions from './app/containers/DeveloperOptions'
import Constants from './app/utils/constants'
import { isPlatFormAndroid } from './app/utils/utils';
import translator from './app/utils/translations'

import { StackNavigator, DrawerNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import DrawerContainer from './app/containers/drawer/DrawerContainer'
import User from './app/containers/User';
import store from "./app/store";

let rightButtonTapCount = 0;
var selectedTab = "Home"

export function setSelectedTab(tab) {
  selectedTab = tab
}
const noTransitionConfig = () => ({
    transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0
    }
});

const Tabs = TabNavigator ({
  Home: {screen: Home},
  User: {screen: User},
  DeveloperOptions: {screen: DeveloperOptions},
  
},{
  initialRouteName: selectedTab,
  tabBarPosition:"bottom",
  tabBarComponent: TabBarBottom,
  tabBarOptions: {
    showLabel: false
  },
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Home') {
        if(focused) {
          iconName = require("./app/resources/ico_bottom_home_selected.png")
        }
        else {
          iconName = require("./app/resources/ico_bottom_home.png")
        }

      } else if (routeName === 'User') {
        if(focused) {
          iconName = require("./app/resources/ico_bottom_media_selected.png")
        }
        else {
          iconName = require("./app/resources/ico_bottom_media.png")
        }
      } else if (routeName === 'DeveloperOptions') {
        if(focused) {
          iconName = require("./app/resources/ico_bottom_routine_selected.png")
        }
        else {
          iconName = require("./app/resources/ico_bottom_routine.png")
        }
      }
       
      // You can return any component that you like here! We usually use an
      // icon component from react-native-vector-icons
      return <View style={{height:25, width:25}}><Image resizeMethod="resize" style={{maxHeight:25, maxWidth:25}}  source={iconName}/></View>;
    },
  }),
})


// drawer stack
const DrawerStack = DrawerNavigator({
  Home: {screen: Tabs},
  DeveloperOptions: { screen: DeveloperOptions, navigationOptions: { title: Constants.appNavbarTitle, headerLeft: null } },
  User: { screen: User, navigationOptions: { title: Constants.appNavbarTitle } },
}, {
        gesturesEnabled: false,
        drawerOpenRoute: "DrawerOpen",
        drawerCloseRoute: "DrawerClose",
        drawerToggleRoute: "DrawerToggle",
        drawerBackgroundColor: "gray",
        contentComponent: DrawerContainer,
        drawerWidth: 210
    });

function getIconStyle() {

  if (isPlatFormAndroid() === true) {
    return {height:21, width:21, marginLeft: 23, marginTop: 0 }
  }
  else {
    return { height:21, width:21, marginLeft: 23 }
  }
}
const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack },

 }, {
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      headerStyle: {elevation:0, borderColor:"transparent", borderBottomColor:"transparent", backgroundColor: 'white' },
      headerTitleStyle: {fontWeight: "600", fontSize: 13 },
      headerTintColor: "black",
      title: translator.t("homeScreenTitle"),
      gesturesEnabled: false,
      headerLeft: <View style={getIconStyle()}><TouchableHighlight 
      underlayColor="white"
      onPress={() => {
        if (navigation.state.index === 0) {
          navigation.navigate('DrawerOpen')
        } else {
          navigation.navigate('DrawerClose')
        }
      }}><Image style={ {
          height: 21,
          width: 21,
        }} source={require("./app/resources/ico_menu_gray.png")}></Image></TouchableHighlight></View>
    })
  })


// Manifest of possible screens
const PrimaryNav = StackNavigator({
    drawerStack: { screen: DrawerNavigation }
}, {
        // Default config for all screens
        headerMode: 'none',
        title: 'Main',
        initialRouteName: 'drawerStack',
        transitionConfig: noTransitionConfig
    });


export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PrimaryNav />
            </Provider>
        );
    }
}





