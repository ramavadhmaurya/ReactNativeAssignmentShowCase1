
import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, TouchableOpacity, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules, NetInfo, Dimensions
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import { HeaderBackButton } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient';
import { Icon, } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import translator from '../../utils/translations'
import ConfigurationTab from '../../containers/ConfigurationTab'
import Constants from '../../utils/constants'
import GatewayApi from '../../lib/gatewayTcp'
import { simplifiDeviceContext, isPlatFormAndroid, getOvalImage, windowHeight } from '../../utils/utils';
import { connect } from 'react-redux';
import store from '../../store';
import { saveSimplifiSettingsRoute } from '../../actions/action';

const simplifiRegistrationContext = {
    
        SIMPLIFI_REGISTRATION: 0,
        HOME: 1,
        SIMPLIFI_PROVISIONING_RESET_PASSWORD:2
    }

class WifiSetup extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerLeft: <HeaderBackButton tintColor="gray" onPress={() => navigation.goBack(null)} />
    })

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
        if (this.props.navigation.state.routeName === 'WifiSetup') {
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

        simplifiDeviceContext((simplifiDeviceCount) => {
            if(simplifiDeviceCount === simplifiRegistrationContext.SIMPLIFI_PROVISIONING_RESET_PASSWORD) {
                this.props.saveSimplifiSettingsRoute(this.props.navigation.state.key)
            }
        })

        this.testConnectionToSimplifiDevice()
        this.observeNetworkConnectivity()
    }

    testConnectionToSimplifiDevice() {
    
        GatewayApi.testConnection((data, flag) => {
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
            this.testConnectionToSimplifiDevice()
        });
            
        NetInfo.isConnected.addEventListener('connectionChange', (connectionInfo) => {
            this.testConnectionToSimplifiDevice()
        })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
                <View style={{marginTop:windowHeight() < 550 ? 0 : 40}}>
                    <Text style={{ opacity:0.6, textAlign:"center", marginLeft: 30, marginRight:30, fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12.7, color: "black", marginTop: 10 }}>{translator.t("simplifiWifiSettingText1")}</Text>
                    <Text style={{ textAlign:"center", marginLeft: 30, marginRight:30, paddingLeft: 20, fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12.7, color: "black", marginTop: 20 }}>{translator.t("simplifiWifiSettingText2")}</Text>
                </View>
                <View style={{marginTop:70,
                width:"100%",
                              justifyContent:"center", 
                              alignItems:"center"}}>
                              <Image style={{height:100, 
                              width:105}} source={require('../../resources/gfx_simplifi_wifi.png')} />
                      
                </View>
                <View style={{marginTop: windowHeight() < 550 ? 50 : windowHeight() * 0.16, overflow:"hidden"}}>
                    {getOvalImage()}
                    <TouchableOpacity

                        style={styles.buttonStyle}
                        onPress={() =>
                            this.onNextPress()
                        }
                        underlayColor="#666666">
                        <View style={{backgroundColor:"transparent", width:160, height:76}}>
                            <Image style={{width:160, height:76}} source={require('../../resources/gfx_btn_2.png')} />
                            <Text style={styles.textStyle}>{translator.t("connectSimplifiNextButton")}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        this.cancelSetup()
                    }
                    style={{alignSelf: "center"}}
                    underlayColor="#666666">
                    <Text style={{ color:"#72b6fe", fontFamily:Constants.Fonts.themeFontRegular, fontSize:16, textAlign: "center" }}>{translator.t("cancelSetupButton")}</Text>
                </TouchableOpacity>
                
            </View>)

    }

    onNextPress() {

        if(this.state.alreadyConnectedToDevice === false) {
            if(isPlatFormAndroid()) {
                this.props.navigation.navigate("addGateway")
            }
            else {
                this.props.navigation.navigate("ConnectYouriPhone")
            }
        }
        else {
            console.log("Navigating from Wifi setup screen to PhoneConnected")
            this.props.navigation.navigate("PhoneConnected")
        }
    }


    cancelSetup() {

        simplifiDeviceContext((simplifiDeviceCount) => {
            if(simplifiDeviceCount === simplifiRegistrationContext.SIMPLIFI_REGISTRATION) {
                const { navigate } = this.props.navigation;
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'SelectDevice' }),
                    ]
                })
                this.props.navigation.dispatch(resetAction)
            }
            else if(simplifiDeviceCount === simplifiRegistrationContext.SIMPLIFI_PROVISIONING_RESET_PASSWORD) {

                this.props.navigation.goBack(null)
            }
            else {
                this.props.navigation.goBack(this.props.goBackRoute)
            }
        })
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
        position:"absolute",
        fontFamily:Constants.Fonts.themeFontBold,
        fontSize: 14.7,
        color: "white",
        textAlign:"center",
        width:"100%",
        height:20,
        top:10
    },
    buttonStyle: {
        alignSelf: "center",
        alignItems: "center",
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
    const settingsRoute = state.screen.simplifiSettingsRoute;
   
    return {
        goBackRoute:settingsRoute
    };
}

export default connect(mapStateToProps, { saveSimplifiSettingsRoute })(WifiSetup);