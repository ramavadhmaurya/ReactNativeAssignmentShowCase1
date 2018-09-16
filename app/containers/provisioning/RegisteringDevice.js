
import {
    ScrollView, Text, TextInput, View, Button, StyleSheet,
    Animated, Image, Easing,
    TouchableHighlight, TouchableOpacity, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import webApi from '../../lib/webApi'
import * as firebase from "firebase";
import Firebase from '../../lib/firebase';
import DeviceRegistered from '../../containers/provisioning/DeviceRegistered'
import { getCloudServerIP } from '../../utils/constants';
import {simplifiDeviceContext, connectedToNetwork, showRetryAlert } from '../../utils/utils';
import DeviceRegistrationFailure from '../../containers/provisioning/DeviceRegistrationFailure'
import translator from '../../utils/translations'

import Constants from '../../utils/constants'
import SelectDevice from '../../containers/provisioning/SelectDevice'
import { saveDeviceInfo } from '../../actions/action';
import { connect } from 'react-redux';

const simplifiRegistrationContext = {
    
      SIMPLIFI_REGISTRATION: 0,
      HOME: 1
    }

class RegisteringDevice extends Component {

    startDeviceRegistrationOnCloud() {

        var userid, serial_Id, macAddress, serialNumber

        AsyncStorage.getItem(Constants.SIMPLIFI_INFO).then((simplifiInfoString) => {
            var simplifiInfo = JSON.parse(simplifiInfoString)
            //AsyncStorage.getItem(Constants.DEVICE_INFO).then((result) => {
                //device_info = JSON.parse(result);
                //device_info = this.props.deviceInfo;
                device_info = JSON.parse(this.props.deviceInfo);
                console.log("device info on registration is : " + device_info)
                console.log("device info deviceSerialNumber on registration is : " + device_info.deviceSerialNumber)
                this.setState({
                    serial_Id: device_info.deviceSerialNumber === undefined ? device_info.serialId : device_info.deviceSerialNumber
                })
                macad = device_info.macAddress,
                    serialIdddd = device_info.deviceSerialNumber === undefined ? device_info.serialId : device_info.deviceSerialNumber,
                    clientSecret = device_info.clientSecret,
                    productId = device_info.productId,

                    AsyncStorage.getItem(Constants.USER_INFO).then((result) => {
                        user_info = JSON.parse(result);
                        userid = user_info.data.firebaseUid;
                        data = {
                            model: "Gateway_001",
                            deviceType: "GATEWAY",
                            description: "My Gateway",
                            serialId: serialIdddd,
                            mac: macad,
                            clientSecret: clientSecret,
                            productId: productId,
                            language: simplifiInfo.language,
                            pinCode: simplifiInfo.pinCode,
                            deviceName: simplifiInfo.simplifiName
                        }
                        request = JSON.stringify(data)
                        console.log("Device registration Request: " + request)
                        console.log("Request details " + "Serial id : " + serialIdddd + "mac : " + macad)
                        statusCode = ''
                        firebase.auth().currentUser.getIdToken(true).then((idToken) => {
                            console.log("TOKEN: " + idToken)
                            response = webApi.post(getCloudServerIP(), 'simplifi/users/' + userid + '/device', request, idToken);
                            response.then(resp => {
                                    let json = resp.json();
                                    statusCode = resp.status
                                    if (resp.ok) {
                                        return json;
                                    }
                                    return json.then(err => {
                                        throw err
                                    });
                                })
                                .then(responseData => {
                                    console.log("Device registered successfully : " + JSON.stringify(responseData));
                                    console.log("Device id : " + responseData.data.deviceId);
                                    deviceID = responseData.data.deviceId
                                    this.props.saveDeviceInfo(JSON.stringify(responseData.data));
                                    AsyncStorage.setItem(Constants.DEVICE_ID, deviceID.toString());
                                    //AsyncStorage.setItem(Constants.APP_STATE_KEY, Constants.APP_STATE_VALUES.DEVICE_REGISTRATION);
                                    this.props.navigation.navigate("DeviceRegistered")
                                    return responseData;
                                }).catch((error) => {

                                    console.log("STATUS CODE:" + statusCode)
                                    console.log('Error ' + JSON.stringify(error));
                                    //console.log('Error message is : ' + JSON.stringify(error.message));


                                    if (error.message !== undefined) {
                                        if (this.state.retryCount < 3) {
                                            TimerMixin.setTimeout(() => {

                                                this.setState({
                                                    retryCount: this.state.retryCount + 1
                                                })
                                                console.log("registerOnCloud count " + this.state.retryCount)
                                                this.startDeviceRegistrationOnCloud()
                                            }, 1000 * 5)

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
                                
                                console.log('Error ' + JSON.stringify(error));
                                console.log("STATUS CODE:"  + statusCode)
                                if (error.message !== undefined) {
                                    this.setState({
                                        showErrorView:true,
                                        errorMessage:error.message
                                    })
                                }
                                else {
                                    this.setState({
                                        showErrorView:true,
                                        errorMessage:error
                                    })
                                }
                            });
                    })
            //})
        })
    }

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
        this.rotateValueHolder = new Animated.Value(0);
        this.state = {
            showErrorView:false,
            errorMessage:"",
            retryCount: 0
        }

        this.tryAgain = this.tryAgain.bind(this)
        this.cancelSetup = this.cancelSetup.bind(this)
        this.androidEventHandler = this.androidEventHandler.bind(this)
        this.androidBackButtonAddEventListener = this.androidBackButtonAddEventListener.bind(this)
        this.startDeviceRegistrationOnCloud = this.startDeviceRegistrationOnCloud.bind(this)
    }

    // Android back button handler start
    androidBackButtonAddEventListener() {
        BackHandler.addEventListener('hardwareBackPress', this.androidEventHandler)
    }
    
    androidEventHandler() {
        if (this.props.navigation.state.routeName === 'RegisteringDevice') {
            BackHandler.exitApp()
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
        this.startImageRotateFunction();

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                TimerMixin.setTimeout(()=> {
                    if (connectedToNetwork() === false) {
                        this.setState({
                            showErrorView:true,
                            errorMessage:Constants.NO_INTERNET_MESSAGE
                        })
                        return
                    }
                    this.startDeviceRegistrationOnCloud()
                //}, 1000 * 75)
            }, 1000 * 35)
            }
            else {
            }
        });
        
    }
    tryAgain() {
        if (connectedToNetwork() === false) {
            this.setState({
                showErrorView:true,
                errorMessage:Constants.NO_INTERNET_MESSAGE
            })
            return
        }

        this.setState({
            showErrorView:false,
            errorMessage:""
        })
        this.startDeviceRegistrationOnCloud()
    }

    getMainView() {
        const rotateData = this.rotateValueHolder.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        return (<View><View style={{ height: 90 }}>
            <Text style={{ height: 30, color:"black", alignSelf: "center",  fontSize: 16, fontFamily:Constants.Fonts.themeFontRegular, opacity:0.44, marginTop: 10 }}>{translator.t("preparingSimplifi")}</Text>
            <Text style={{ height: 60, textAlign:"center", color:"black", alignSelf: "center", fontSize: 12, fontFamily:Constants.Fonts.themeFontRegular, color: "black", marginTop: 10 }}>{translator.t("registeringSimplifiWithCloud")}</Text>
        </View>
            <View style={{marginTop:70, height: 70, backgroundColor: Constants.ThemeColors.appBGColor, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                <Animated.Image
                    style={{
                        width: 70,
                        height: 70,
                        transform: [{ rotate: rotateData }]
                    }}
                    source={require('../../resources/gfx_loading.png')} />
            </View>

        </View>)


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
            else {
                this.props.navigation.goBack(this.props.goBackRoute)
            }
        })
    }

    getDeviceRegistrationFailureView() {

        return (<DeviceRegistrationFailure cancelSetup={this.cancelSetup} errorMessage={this.state.errorMessage} tryAgain={this.tryAgain}/>)

    }

    render() {
        
        return (
            <View style={{ flex: 1 ,backgroundColor:Constants.ThemeColors.appBGColor }}>
            
                {renderIf(this.state.showErrorView === true, this.getDeviceRegistrationFailureView())}
                {renderIf(this.state.showErrorView === false, this.getMainView())}
                
            </View>)

    }

    onContinuePress() {
        this.props.navigation.navigate("WifiSetup")
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
})

function mapStateToProps(state) {
    const deviceInfo = state.device.deviceInfo;
    
    const settingsRoute = state.screen.simplifiSettingsRoute;
    console.log("device info : " + deviceInfo)
    console.log("mapStateToProps called : ")

    return {
        deviceInfo: deviceInfo,
        goBackRoute: settingsRoute
    };
}

export default connect(mapStateToProps, { saveDeviceInfo })(RegisteringDevice);