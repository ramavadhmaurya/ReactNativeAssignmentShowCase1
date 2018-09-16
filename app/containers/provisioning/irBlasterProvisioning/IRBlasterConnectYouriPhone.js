
import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, TouchableOpacity, Dimensions, AsyncStorage, Color, BackHandler, AppState, NativeEventEmitter, NativeModules, Linking
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import { HeaderBackButton } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient';
import { Icon, } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import translator from '../../../utils/translations'
import ConfigurationTab from '../../../containers/ConfigurationTab'
import Constants, {iRRegistrationContext} from '../../../utils/constants'
import IRBlasterApi from '../../../lib/irBlasterTcp'
import { connect } from 'react-redux';

class IRBlasterConnectYouriPhone extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerLeft: <HeaderBackButton tintColor="gray" onPress={() => navigation.goBack(null)} />
    })

    constructor(props) {
        super(props)
        this.state = {
            appState:AppState.currentState, 
            imageWidth:0
        }

        this.handleAppStateChange = this.handleAppStateChange.bind(this)
        this.componentWillAppear = this.componentWillAppear.bind(this)
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>

                <View>
                    <View>
                        <Text style={{ opacity:0.6, textAlign:"center", marginLeft: 30, marginRight:30, fontFamily:Constants.Fonts.themeFontRegular, fontSize: 16, color: "black", marginTop: 10 }}>{translator.t("irBlasterConnectYouriPhone")}</Text>
                    </View>
                    <View style={{marginTop:43, height: 64.3, width: 63, alignSelf:"center" }} onLayout={(event) =>
                        this.setState({
                            imageWidth: event.nativeEvent.layout.width
                        })
                    }>
                        <Image style={{ height: 64.3, width: 63, alignSelf:"center" }}
                            source={require('../../../resources/gfx_wifihelp.png')} />
                    </View>
                    <View style={{marginTop:48, 
                    height:152, 
                    backgroundColor:"#e9f4ff", 
                    borderColor:"#417db9",
                    borderWidth:0.7,
                    borderRadius:9.3,
                    marginLeft:19,
                    marginRight:19 }}>
                        <Text style={{opacity:0.6, 
                            textAlign:"center", 
                            marginLeft: 30, 
                            marginRight:30, 
                            fontFamily:Constants.the, 
                            fontSize: 15, 
                            color: "black", 
                            marginTop: 10}}>{translator.t("goToSettingsIRText")}</Text>
                        <Text style={{ 
                            textAlign:"center",
                            marginLeft: 30, 
                            marginRight:30, 
                            fontFamily:Constants.Fonts.themeFontRegular, 
                            fontSize: 16, 
                            color: "#1f5b98", 
                            marginTop: 20}}>{translator.t("chooseANetwork")}</Text>
                        
                        <View style={{flexDirection:"row", justifyContent:"space-between", width:"100%"}}>
                        <Text style={{ 
                            textAlign:"center",
                            marginLeft: 30,
                            fontFamily:Constants.Fonts.themeFontRegular, 
                            fontSize: 12.7, 
                            color: "black",
                            textAlign:"left", 
                            marginTop: 28}}>IR Blaster_XXX</Text>
                            <Image style={{ height: 12, width: 18, marginTop:28, marginRight:30}}
                            source={require('../../../resources/ico_wifi.png')} />
                            
                        </View>
                    </View>
                    <TouchableOpacity

                    style={styles.buttonStyle}
                    onPress={() =>
                        this.onGoToSettingsButtonPress()
                    }
                    underlayColor="#666666">
                    <View style={{backgroundColor:"transparent", width:160, height:76}}>
                        <Image style={{width:160, height:76}} source={require('../../../resources/gfx_btn_2.png')} />
                        <Text style={styles.textStyle}>{translator.t("goToSettingsButton")}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() =>
                        this.cancelSetup()
                    }
                    style={{ marginTop: 10, alignSelf: "center" }}
                    underlayColor="#666666">
                    <Text style={{ color:"#72b6fe", fontFamily:Constants.Fonts.themeFontRegular, fontSize:16, textAlign: "center", marginTop: 10 }}>{translator.t("cancelSetupButton")}</Text>
                </TouchableOpacity>
                </View>
            </View>)

    }

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
      }
    
      componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
      }

    onGoToSettingsButtonPress() {

        this.redirectToiOSWifiSettings()
        //this.props.navigation.navigate("PhoneConnected")
    }

    redirectToiOSWifiSettings() {

        var url = "app-settings:"// "Prefs:root=WIFI";//"prefs:root=WIFI"
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
              console.log('Can\'t handle url: ' + url);
            } else {
              return Linking.openURL(url);
            }
          }).catch(err => console.error('An error occurred: ', err));
    }

    cancelSetup() {
        if (Constants.iRRegistrationContext === iRRegistrationContext.IR_REGISTRATION) {
            const { navigate } = this.props.navigation;
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'SelectDevice' }),
                ]
            })
            this.props.navigation.dispatch(resetAction)
        }
        else {
            this.props.navigation.goBack(this.props.goBackRoute)
        }
    }

    componentWillAppear() {
        AppState.addEventListener('change', this.handleAppStateChange);
        console.log("componentWillAppear called")
    }

    
    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
             IRBlasterApi.testConnection((data, flag) => {
                console.log("Test Connect result: " + flag)
                if (flag === true) {
                    console.log("Navigating from Wifi setup screen to IRBlasterPhoneConnected")       
                    AppState.removeEventListener('change', this.handleAppStateChange);
                    this.props.navigation.navigate("IRBlasterPhoneConnected", params = {componentWillAppear:this.componentWillAppear})
                }
            })  
        
        }
        this.setState({appState: nextAppState});
    }
    
}

function renderIf(condition, content) {
    if (condition) {
        return content;
    } else {
        return null;
    }
}

const styles = StyleSheet.create({
    header: {
        paddingLeft: 10,
        paddingTop: 9,
        backgroundColor: "white",
        color: Constants.ThemeColors.buttonDarkGray,
        height: 30,
        fontSize: 16,
        fontWeight: "500"
    },
    
    buttonStyle: {
        marginTop: 30,
        alignSelf: "center",
        alignItems: "center"
    },
    textStyle: {
        letterSpacing:0.0,
        position:"absolute",
        fontFamily:Constants.Fonts.themeFontBold,
        fontSize: 13.5,
        color: "white",
        textAlign:"center",
        width:"100%",
        height:20,
        top:22
    },
})

function mapStateToProps(state) {
    const settingsRoute = state.screen.irSettingsRoute;
   
    return {
        goBackRoute:settingsRoute
    };
}

export default connect(mapStateToProps)(IRBlasterConnectYouriPhone);