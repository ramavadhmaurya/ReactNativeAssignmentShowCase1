/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

/*import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});*/

// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  * @flow
//  */

/*import { 
  View,
  TouchableHighlight,
  Image,
  Animated,
  Easing
} from 'react-native';
import React, { Component } from 'react';
import { Provider } from "react-redux";
import Constants from './app/utils/constants'
import Home from './app/containers/Home'
import DeveloperOptions from './app/containers/DeveloperOptions'
import User from './app/containers/User';
import { StackNavigator, DrawerNavigator } from 'react-navigation'
import { isPlatFormAndroid } from './app/utils/utils';
import DrawerContainer from './app/containers/drawer/DrawerContainer'
import translator from './app/utils/translations'
import store from "./app/store";

const noTransitionConfig = () => ({
    transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0
    }
});

// drawer stack
const DrawerStack = DrawerNavigator({
  Home: {screen: Home , navigationOptions: { title: Constants.appNavbarTitle, headerLeft: null } },
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
   DrawerStack: { screen: DrawerStack }
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
}*/

// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  * @flow
//  */

import { View, NativeEventEmitter, NativeModules, AsyncStorage, TouchableHighlight, Image } from 'react-native';
import { Icon, Header, Button } from 'react-native-elements';
import React, { Component } from 'react';
import { Provider } from "react-redux";
import Home from './app/containers/Home'
import DeveloperOptions from './app/containers/DeveloperOptions'
import Constants from './app/utils/constants'
import { isPlatFormAndroid } from './app/utils/utils';
import translator from './app/utils/translations'


import { Text, Animated, Easing } from 'react-native'
import { StackNavigator, DrawerNavigator, TabNavigator } from 'react-navigation'
import DrawerContainer from './app/containers/drawer/DrawerContainer'
import {TabBarBottom} from 'react-navigation'
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





