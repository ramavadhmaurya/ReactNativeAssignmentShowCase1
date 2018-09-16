import React from 'react'
import { 
  StyleSheet,
  Text,
  View,
  ScrollView,
  BackHandler 
} from 'react-native'
import { Icon, } from 'react-native-elements'

export default class DrawerContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    }

    this.androidEventHandler = this.androidEventHandler.bind(this)
    this.androidBackButtonAddEventListener = this.androidBackButtonAddEventListener.bind(this)
  }

 // Android back button handler start
  androidBackButtonAddEventListener() {
    BackHandler.addEventListener('hardwareBackPress', this.androidEventHandler)
  }
  androidEventHandler() {
    if (this.props.navigation.state.routeName === 'DrawerClose') { 
      BackHandler.exitApp()
      return true
    }
  }
  // Android back button handler end
  
  componentWillMount() {
    this.androidBackButtonAddEventListener()
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.androidEventHandler);
  }


  addDrawerItem(text, icon, action) {
    return (<View><View style={styles.drawerItem}>
      <View style={styles.drawerItemIconContainer}>
        <Icon name={icon} color="white" type='font-awesome' size={20} />
      </View>
      <Text
        onPress={action}
        style={styles.drawerItemText}>
        {text}
      </Text>
    </View>
    <View style={styles.separatorStyle}></View></View>)
  }

  render() {
    const { navigation } = this.props
    return (
      <ScrollView style={styles.container}>
        {this.addDrawerItem("Home", "home", ()=> navigation.navigate('Home'))}
        {this.addDrawerItem("User", "user", ()=> navigation.navigate('User'))}
        {this.addDrawerItem("Developer Options", "code", ()=> navigation.navigate('DeveloperOptions'))}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  drawerItem: {
    flexDirection: "row"
  },

  drawerItemIconContainer: {
    marginLeft:15,
    paddingTop: 18,
  },

  drawerItemText: {
    flex:1,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    marginLeft: 15,
    paddingTop: 20,
    paddingBottom: 10
  },
  separatorStyle: {
    height: 0.5,
    backgroundColor: "white",
    marginLeft: 50
  }
})
