
import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, TouchableOpacity, Dimensions, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules, NetInfo
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
import {simplifiDeviceContext, isPlatFormAndroid, getOvalImage, windowHeight } from '../../../utils/utils'
import IRBlasterApi from '../../../lib/irBlasterTcp'
import { saveIRSettingsRoute } from '../../../actions/action';
import { connect } from 'react-redux';


class IRBlasterWifiSetup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            alreadyConnectedToDevice:false
        }
        this.androidEventHandler = this.androidEventHandler.bind(this)
    }

    // Android back button handler start
    androidBackButtonAddEventListener() {
        BackHandler.addEventListener('hardwareBackPress', this.androidEventHandler)
    }
      androidEventHandler() {
        if (this.props.navigation.state.routeName === 'IRBlasterWifiSetup') {
            this.props.navigation.goBack(null)
          return true
        }
      }
      //Android Back button handler end

    componentWillMount() {
        this.androidBackButtonAddEventListener()
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.androidEventHandler);
    }


    componentDidMount() {

        if (Constants.iRRegistrationContext == iRRegistrationContext.IR_RESET_PASSWORD) {
            this.props.saveIRSettingsRoute(this.props.navigation.state.key)
        }
        this.testConnectionToIRBlasterDevice()
        this.observeNetworkConnectivity()
    }

    testConnectionToIRBlasterDevice() {
         IRBlasterApi.testConnection((data, flag) => {
            if (flag === true) {
                this.setState({
                    alreadyConnectedToDevice:true
                })
            }
            else {
                this.setState({
                    alreadyConnectedToDevice:false
                })
            }
        }) 
    }

    observeNetworkConnectivity() {
        NetInfo.isConnected.fetch().then(isConnected => {
            this.testConnectionToIRBlasterDevice()
        });
            
        NetInfo.isConnected.addEventListener('connectionChange', (connectionInfo) => {
            this.testConnectionToIRBlasterDevice()
        })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
                
                <View style={{marginTop:windowHeight()>550? 40 : 0}}>
                    <Text style={{ opacity:0.6, textAlign:"center", marginLeft: 30, marginRight:30, fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12.7, color: "black", marginTop: 10 }}>{translator.t("wifiSetupTitle")}</Text>
                    <Text style={{ textAlign:"center", marginLeft: 30, marginRight:30, paddingLeft: 20, fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12.7, color: "black", marginTop: 20 }}>{translator.t("irBlasterWifiSetupDescription")}</Text>
                </View>
                <View style={{marginTop:windowHeight() > 550 ? 70 : 50,
                width:"100%",
                              justifyContent:"center", 
                              alignItems:"center"}}>
                              <Image style={{height:100, 
                              width:105}} source={require('../../../resources/gfx_ir_wifi.png')} />
                      
                </View>
                <View style={{marginTop: windowHeight() < 550 ? 50 : windowHeight() * 0.16, overflow:"hidden"}}>
                    {getOvalImage()}
                    <TouchableOpacity

                        style={styles.buttonStyle}
                        onPress={() =>
                            this.onContinuePress()
                        }
                        underlayColor="#666666">
                        <View style={{backgroundColor:"transparent", width:160, height:76}}>
                            <Image style={{width:160, height:76}} source={require('../../../resources/gfx_btn_2.png')} />
                            <Text style={styles.textStyle}>{translator.t("connectSimplifiNextButton")}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        this.cancelSetup()
                    }
                    style={{ alignSelf: "center" }}
                    underlayColor="#666666">
                    <Text style={{ color:"#72b6fe", fontFamily:Constants.Fonts.themeFontRegular, fontSize:16, textAlign: "center", marginTop: 10 }}>{translator.t("cancelSetupButton")}</Text>
                </TouchableOpacity>
                
            </View>)

    }

    onContinuePress() {

        if(this.state.alreadyConnectedToDevice === false) {
            if(isPlatFormAndroid()) {
                this.props.navigation.navigate("IRBlasterAddGateway")
            }
            else {
                this.props.navigation.navigate("IRBlasterConnectYouriPhone")
            }
        }
        else {
            console.log("Navigating from Wifi setup screen to IRBlasterPhoneConnected")
            this.props.navigation.navigate("IRBlasterPhoneConnected")
        }
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
        else if (Constants.iRRegistrationContext === iRRegistrationContext.IR_RESET_PASSWORD){
            
            this.props.navigation.goBack(null)
        }
        else {
            this.props.navigation.goBack(this.props.goBackRoute)
        }
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
       
        alignSelf: "center",
        alignItems: "center"
    },
    textStyle: {
        position:"absolute",
        fontFamily:Constants.Fonts.themeFontBold,
        fontSize: 14.7,
        color: "white",
        textAlign:"center",
        width:"100%",
        height:20,
        top:isPlatFormAndroid() === false ? 22 : 20
    },
})


function mapStateToProps(state) {
    const settingsRoute = state.screen.irSettingsRoute;
    
    console.log("mapStateToProps in IRBlaster_SelectAp called : ")

    return {
        goBackRoute: settingsRoute
    };
}

export default connect(mapStateToProps, {saveIRSettingsRoute})(IRBlasterWifiSetup);