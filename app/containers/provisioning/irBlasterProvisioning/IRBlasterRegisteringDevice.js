import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, Animated, Easing, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules
} from 'react-native';
import React, { Component } from 'react';
import { HeaderBackButton } from 'react-navigation'
import TimerMixin from 'react-timer-mixin';
import LinearGradient from 'react-native-linear-gradient';
import translator from '../../../utils/translations'
import ConfigurationTab from '../../../containers/ConfigurationTab'
import Constants, {iRRegistrationContext} from '../../../utils/constants'
import SplashScreen from 'react-native-splash-screen';
import { NavigationActions } from 'react-navigation';
import * as firebase from "firebase";
import { connectedToNetwork, showRetryAlert } from '../../../utils/utils'
import webApi from '../../../lib/webApi'
import { getCloudServerIP } from '../../../utils/constants';
import IRRegistrationFailure from '../../../containers/provisioning/irBlasterProvisioning/IRRegistrationFailure'
import { logInfo, logDebug } from '../../../utils/logger'
import { isPlatFormAndroid } from '../../../utils/utils';
import { saveDeviceInfo } from '../../../actions/action';
import { connect } from 'react-redux';

class IRBlasterRegisteringDevice extends Component {

    startImageRotateFunction() {

        this.rotateValueHolder.setValue(0)

        Animated.timing(
            this.rotateValueHolder,
            {
                toValue: 1,
                duration: 500,
                easing: Easing.linear
            }
        ).start(() => this.startImageRotateFunction())

    }

    constructor(props) {
        super(props)
        this.state = {
            showErrorView: false,
            retryCount: 0
        }
        this.rotateValueHolder = new Animated.Value(0);
        // alert("IR Blaster Registrering device")
        /*   TimerMixin.setTimeout(()=> {
              this.props.navigation.navigate('IRBlasterRegistered')
          }, 5000) */
        this.registerIRBlasterOnCloud = this.registerIRBlasterOnCloud.bind(this)
        this.tryAgain = this.tryAgain.bind(this)
        this.cancelSetup = this.cancelSetup.bind(this)
    }

    registerIRBlasterOnCloud() {
        // alert("start Registering IR blaster ");
        console.log("start Registering IR blaster on Cloud")
        logInfo("start Registering IR blaster on Cloud")
        // comment it after reding device value from prefrences
        // var selecteditem = JSON.parse(this.props.navigation.state.params.irBlasterData)


        AsyncStorage.getItem(Constants.IRBLASTER_INFO).then((simplifiInfoString) => {
            console.log("Ir Blaster Info " + JSON.stringify(simplifiInfoString));
            logInfo("Ir Blaster Info " + JSON.stringify(simplifiInfoString))

            //AsyncStorage.getItem(Constants.IR_BLASTER_DEVICE_INFO).then((result) => {

                //var selecteditem = JSON.parse(result);
                //console.log("IR Blaster Data " + result)

                var selecteditem = JSON.parse(this.props.deviceInfo);
                console.log("device info on IR registration is : " + selecteditem)
                console.log("device info deviceSerialNumber on registration is : " + selecteditem.message.deviceSerialNumber)

                simplifiInfoString = JSON.parse(simplifiInfoString)

                var appliance = {
                    "name": simplifiInfoString.name,
                    "manufacturer": "Panasonic",
                    "model": "Pnasonic_IR", //this.state.model,
                    "description": "IR Blaster",
                    "serialId": selecteditem.message.deviceSerialNumber,
                    "activated": true
                }

                console.log("Appliance add request : " + JSON.stringify(appliance))
                logInfo("Ir Blaster Info " + JSON.stringify(simplifiInfoString))

                firebase.auth().currentUser.getIdToken(true).then((idToken) => {

                    response =
                        webApi.post(getCloudServerIP(),
                            'simplifi/users/' +
                            firebase.auth().currentUser.uid +
                            "/spaces/" + simplifiInfoString.spaceID + "/irblaster", JSON.stringify(appliance),
                            idToken)

                    response.then(response => {
                            let json = response.json();
                            if (response.ok) {
                                return json;
                            }
                            return json.then(err => {
                                throw err
                            });
                        })
                        .then(responseData => {
                            console.log("IR Blaster add to cloud Response: " + JSON.stringify(responseData))
                            logInfo("IR Blaster add to cloud Response: " + JSON.stringify(responseData))

                            irBlasterId = responseData.data.irBlasterId
                            AsyncStorage.setItem(Constants.DEVICE_ID, irBlasterId.toString());
                            //AsyncStorage.setItem(Constants.APP_STATE_KEY, Constants.APP_STATE_VALUES.IR_REGISTERED);
                            this.props.navigation.navigate("IRBlasterRegistered")
                            return responseData;
                        }).catch((error) => {
                            console.log('Error ' + JSON.stringify(error));
                            logInfo('Error ' + JSON.stringify(error))
                            if (error.message !== undefined) {
                                if (this.state.retryCount < 3) {
                                    TimerMixin.setTimeout(() => {

                                        this.setState({
                                            retryCount: this.state.retryCount + 1
                                        })
                                        console.log("registerIRBlasterOnCloud count " + this.state.retryCount)
                                        this.registerIRBlasterOnCloud()
                                    }, 1000 * 10)

                                } else {
                                    this.setState({
                                        showErrorView: true,
                                        errorMessage: error.message
                                    })
                                }
                            } else {
                                this.setState({
                                    showErrorView: true,
                                    errorMessage: error
                                })
                            }
                        });
                }).catch((error) => {
                    this.setState({
                        showErrorView: true,
                        errorMessage: error.message
                    });
                });
            //})
        }) //
    }

    componentDidMount() {
       // selecteditem = this.props.navigation.state.params.irBlasterData
        this.startImageRotateFunction();

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {


                TimerMixin.setTimeout(() => {
                    if (connectedToNetwork() == false) {
                        this.setState({
                            showErrorView: true,
                            errorMessage: Constants.NO_INTERNET_MESSAGE
                        })

                        //return
                    }

                    this.registerIRBlasterOnCloud()
                }, 1000 * 35)
            }
            else {
            }
        });
    }

    tryAgain() {
        console.log("try again called : ")
        if (connectedToNetwork() === false) {
            this.setState({
                showErrorView: true,
                errorMessage: Constants.NO_INTERNET_MESSAGE
            })
            return
        }

        this.setState({
            showErrorView: false,
            errorMessage: ""
        })
        this.registerIRBlasterOnCloud()
        // we need to handle scenarion with cloud, if user give wrong password and IR is not able to registerd with cloud.
        //this.props.navigation.navigate("IRBlasterWifiSetup")
        

    }

    getMainView() {
        const rotateData = this.rotateValueHolder.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        return (<View><View style={{ height: 90 }}>
            <Text style={{ height: 30, color:"black", alignSelf: "center",  fontSize: 16, fontFamily:Constants.Fonts.themeFontRegular, opacity:0.44, marginTop: 10 }}>{translator.t("preparingIRBlaster")}</Text>
            <Text style={{ height: 60, textAlign:"center", color:"black", alignSelf: "center", fontSize: 12, fontFamily:Constants.Fonts.themeFontRegular, color: "black", marginTop: 10 }}>{translator.t("registeringIRBlasterWithCloud")}</Text>
        </View>
            <View style={{marginTop:70, height: 70, backgroundColor: Constants.ThemeColors.appBGColor, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                <Animated.Image
                    style={{
                        width: 70,
                        height: 70,
                        transform: [{ rotate: rotateData }]
                    }}
                    source={require('../../../resources/gfx_loading.png')} />
            </View>

        </View>)

    }

    getDeviceRegistrationFailureView() {

        return (<IRRegistrationFailure cancelSetup={this.cancelSetup} errorMessage={this.state.errorMessage} tryAgain={this.tryAgain} />)

    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
                {renderIf(this.state.showErrorView === true, this.getDeviceRegistrationFailureView())}
                {renderIf(this.state.showErrorView === false, this.getMainView())}

            </View>)
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
        marginTop: 20,
        backgroundColor: "#666666",
        alignSelf: "center",
        borderRadius: 2,
        height: 30,
        width: 160,
        alignItems: "center"
    },
    textStyle: {
        alignContent: "center",
        paddingTop: 6,
        fontWeight: "500",
        fontSize: 13,
        color: "white"
    },
    bulletStyle: {
        color: "black",
        fontWeight: "200",
        fontSize: 11,
        marginLeft: 35,
        marginTop: 5
    }
})

function mapStateToProps(state) {
    const settingsRoute = state.screen.irSettingsRoute;
    const deviceInfo = state.device.deviceInfo;
    console.log("device info : " + deviceInfo)
    console.log("mapStateToProps on IRBlaster RegisteringDevice called : ")

    return {
        deviceInfo: deviceInfo,
        goBackRoute: settingsRoute
    };
}

export default connect(mapStateToProps, { saveDeviceInfo })(IRBlasterRegisteringDevice);