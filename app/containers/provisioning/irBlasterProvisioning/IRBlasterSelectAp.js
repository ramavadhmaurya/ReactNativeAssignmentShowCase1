import React from 'react'
import {Modal, Image, ActivityIndicator, RefreshControl, Button, TextInput, TouchableHighlight, TouchableOpacity, Dimensions, SectionList, ListView, Platform, StyleSheet, Text, View, ScrollView, BackHandler, Alert, FlatList, AsyncStorage } from 'react-native'
import { List, ListItem, Icon, CheckBox } from 'react-native-elements'
import IRBlasterApi from '../../../lib/irBlasterTcp'
import prompt from 'react-native-prompt-android';
import Constants, {iRRegistrationContext} from '../../../utils/constants';
import TimerMixin from 'react-timer-mixin';
import { NavigationActions } from 'react-navigation'
import SplashScreen from 'react-native-splash-screen';
import  renderIf  from '../../../containers/renderIf'
import translator from '../../../utils/translations'
import { ProgressDialog } from 'react-native-simple-dialogs';
import RegisteringDevice from '../../provisioning/RegisteringDevice'
import { HeaderBackButton } from 'react-navigation'
import { isPlatFormAndroid, getOvalImage, windowHeight } from '../../../utils/utils';
import { logInfo, logDebug } from '../../../utils/logger'
import { saveDeviceInfo } from '../../../actions/action';
import { connect } from 'react-redux';

var wifi = require('react-native-android-wifi')

let timeout = 60


class IRBlasterSelectAp extends React.Component {

    constructor(props) {
        super(props);
        this.state =
            {
                data: [],
                progressTitle: 'Fetching wifi list',
                progressMessage: "Please wait...",
                selectedWifiItem: undefined,
                password: undefined,
                rescanButtonTitle: translator.t("rescanButtonText"),
                cancelButtonTitle: translator.t("cancelSetupButton"),
                hidePassword: true,
                password:"",
                isFetchingWifiList:true,
                provisionedSuccessfully:false,
                movedToNextScreen:false,
                provisionedResponse:undefined,
                timeoutOccurred:false,
                remainingSeconds:timeout,
                savedIntervalId:undefined,
                rescanWifiListTime: 1,
                emptyPassword: false
            };

        this.authenticateWifi = this.authenticateWifi.bind(this)
        this.handleProvisioningResponse = this.handleProvisioningResponse.bind(this)
        this.androidEventHandler = this.androidEventHandler.bind(this)
        this.androidWifiConnectionRequest = this.androidWifiConnectionRequest.bind(this)
        this.checkProvisionedSuccessfully = this.checkProvisionedSuccessfully.bind(this)
        this.itemTapped = this.itemTapped.bind(this)
    }

    render() {
        return (
            <View style={styles.container}>
                
                <View style={{ paddingLeft: 15, height: windowHeight() > 550 ? 350 : 300  }}>
                    {this.wifiListView()}
                    {renderIf((this.state.selectedWifiItem !== undefined && this.state.selectedWifiItem["deviceType"] === "WPA2-PSK" && this.state.showPasswordView === true), this.enterPasswordView())}
                </View>
                <View style={{marginTop: windowHeight() < 550 ? 10 : 50, overflow:"hidden"}}>
                        {getOvalImage()}
                    <TouchableOpacity style={styles.buttonStyle}
                        underlayColor="#666666"
                        disabled={this.state.isFetchingWifiList}
                        onPress={() =>
                            this.onRescanButtonTap()
                        }>
                        <View style={{ backgroundColor: "transparent", width: 160, height: 76 }}>
                                <Image style={{ width: 160, height: 76 }} source={require('../../../resources/gfx_btn_2.png')} />
                                <Text style={styles.textStyle}>{this.state.rescanButtonTitle}</Text>
                            </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                onPress={() =>
                    this.onCancelButtonTap()

                }
                style={{ alignSelf: "center"}}
                        
                underlayColor="white">
                <Text style={{ color: "#72b6fe", fontFamily: Constants.Fonts.themeFontRegular, fontSize: 16, textAlign: "center", marginTop: 10 }}>{translator.t("cancelSetupButton")}</Text>
            </TouchableOpacity>
                <ProgressDialog
                    visible={this.state.showProgress}
                    title={this.state.progressTitle}
                    message={this.state.progressMessage}
                />
            </View>
        )
    }

    componentWillMount() {
        this.androidBackButtonAddEventListener()
    }
    componentWillUnmount() {
        if(this.state.savedIntervalId !== undefined) {
            TimerMixin.clearInterval(this.state.savedIntervalId)
            
        }
        BackHandler.removeEventListener('hardwareBackPress', this.androidEventHandler);
      }

    // componentWillUnmount() {
    //     if (Platform.OS === "android") {
    //         NavigationActions.back(this.props.navigation.dispatch('addGateway'))
    //     }
    // }

    componentDidMount() {
        SplashScreen.hide()
        this.setState(
            {
                data: [],
                showProgress: true,
                alertTitle: 'Fetching wifi list',
                alertMessage: 'Please, wait...',
                isFetchingWifiList:true,
                timeoutOccurred:false
            })
        TimerMixin.setTimeout(() => {
            this.wifiListRequest()
        }, 500)

    }

    startTimeoutTimer() {
        let intervalId = TimerMixin.setInterval(()=> {
            if (this.state.remainingSeconds !== 0) {
                this.setState({
                    remainingSeconds: this.state.remainingSeconds - 1,
                    savedIntervalId: intervalId
                })
            }
            else {
                this.setState({
                    showProgress: false,
                    isFetchingWifiList:false,
                    timeoutOccurred:true,
                })

                TimerMixin.setTimeout(() => {
                    alert("Error in fetching list")
                }, 500)
                this.state.remainingSeconds = timeout
                TimerMixin.clearInterval(intervalId)
            }
        }, 1000)
    }

    pingForConnectivity() {
        this.setState({
            showProgress:true,
            progressTitle:"Checking internet connectivity"
            
        })
        fetch("https://www.google.co.in")
            .then((response) => {
            if (response.status === 200) {
                this.setState({
                    showProgress:false,  
                })
                this.props.navigation.navigate("IRBlasterRegisteringDevice", params = {
                        irBlasterData: this.state.provisionedResponse
                })
                
            } else {
                this.setState({
                    showProgress:false,  
                })
                TimerMixin.setTimeout(() => {
                    Alert.alert(
                        'No internet connection',
                        "Please connect to the internet and try again",
                        [
                          {text: 'Try Again', onPress: () => {
                            this.pingForConnectivity()
                            }
                          },
                        ],
                        { cancelable: false }
                      )
                }, 500);
            }
            })
            .catch((error) => {
                this.setState({
                    showProgress:false,  
                })
                console.log(error)
                TimerMixin.setTimeout(() => {
                    Alert.alert(
                        'No internet connection',
                        "Please connect to the internet and try again",
                        [
                          {text: 'Try Again', onPress: () => {
                            this.pingForConnectivity()
                            }
                          },
                        ],
                        { cancelable: false }
                      )
                }, 500);
    
            })
        
    }

    checkProvisionedSuccessfully() {

        let intervalID = TimerMixin.setInterval(()=> {
            if (this.state.movedToNextScreen === false && this.state.provisionedSuccessfully === true) {
                TimerMixin.clearInterval(intervalID)
                //AsyncStorage.setItem(Constants.IR_BLASTER_DEVICE_INFO, this.state.provisionedResponse);
                //AsyncStorage.setItem(Constants.APP_STATE_KEY, Constants.APP_STATE_VALUES.IR_PROVISIONED_VALUE); // this is commented for IR Blaster testing.
                
                if(isPlatFormAndroid() === true) {
                    this.setState({
                        movedToNextScreen:true
                    })
                     this.androidWifiConnectionRequest() // this is commented for IR Blaster testing.
                }
                else {
                    this.setState({
                        movedToNextScreen:true,
                        showProgress:false
                    })
                    TimerMixin.setTimeout(() => {
                        Alert.alert(
                            'Device Connected Successfully',
                            "Device connected to network \"" + this.state.selectedWifiItem.uuid + "\" successfully. Please connect your Phone to the selected network from settings.",
                            [
                              {text: 'Proceed', onPress: () => {
                                    if (Constants.iRRegistrationContext === iRRegistrationContext.IR_RESET_PASSWORD) {
                                        this.props.navigation.goBack(this.props.goBackRoute)
                                    }
                                    else {
                                        this.pingForConnectivity()
                                    }
                                }
                              },
                            ],
                            { cancelable: false }
                          )
                    }, 500);
                }
            }
        }, 1000)
    }
    
    wifiListRequest() {
        
        this.startTimeoutTimer()
        console.log("Wifi list request sent.")
        IRBlasterApi.fetchIRBlasterList((data, success) => {
            console.log("Wifi list responce received . : " + JSON.stringify(data))
            if(this.state.savedIntervalId !== undefined) {
                this.state.remainingSeconds = timeout
                TimerMixin.clearInterval(this.state.savedIntervalId)
            }
            if(this.state.timeoutOccurred === true) {
                return;
            }
            if (success === true) {
            console.log("Success received : "+success)
                var dataArray = data["message"]["networkList"]
                dataArray = (dataArray === undefined) ? [] : dataArray
                var scanTime = data["message"]["scanTime"]
                scanTime = (scanTime === undefined) ? [] : scanTime
                console.log('scanTime is : ' +scanTime)

                filtered_data = dataArray.filter((single_ap) => {
                    if (single_ap['uuid'].indexOf("SimplifiBlaster") > -1) {
                        return false;
                    } else {
                        return true;
                    }
                })

                this.setState({
                    data: filtered_data,
                    showProgress: false,
                    isFetchingWifiList:false,
                    rescanWifiListTime: scanTime,
                })
                console.log('rescanWifiListTime is : ' +this.state.rescanWifiListTime)
            }
            else {
                this.setState({
                    showProgress: false,
                    isFetchingWifiList:false
                })

                TimerMixin.setTimeout(() => {
                    alert("Error in fetching list")
                }, 500)
            }
            
        })
    }
// Android back button handler start
    androidBackButtonAddEventListener() {
        BackHandler.addEventListener('hardwareBackPress', this.androidEventHandler)
    }

    androidEventHandler() {
        if (this.props.navigation.state.routeName === 'IRBlasterSelectAp') {
            this.props.navigation.goBack(null)
            return true
        }
    }

    androidWifiConnectionRequest() {
    
         // Hnadle case if user perovide wrong password 
            console.log("Trying to connect Wifi" + this.state.selectedWifiItem.uuid+ " password "+this.state.password)

            wifi.findAndConnect(this.state.selectedWifiItem.uuid, this.state.password, (found) => {
              if (found) {
                console.log("Found and connected to Wifi" + this.state.selectedWifiItem.uuid)
                
                TimerMixin.setTimeout(()=> {
                    this.setState({
                        showProgress:false
                    })
                    if (Constants.iRRegistrationContext === iRRegistrationContext.IR_RESET_PASSWORD) {
                        this.props.navigation.goBack(this.props.goBackRoute)
                    }
                    else {
                        this.props.navigation.navigate("IRBlasterRegisteringDevice", params = {
                            irBlasterData: this.state.provisionedResponse
                        })
                    }

                }, 5000 )
              } else {
                console.log("Retrying to connect Wifi" + this.state.selectedWifiItem.uuid)
                
                TimerMixin.setTimeout(() => {
                    Alert.alert(
                        '',
                        "Could not connect to " + this.state.selectedWifiItem.uuid,
                        [
                          {text: 'Retry', onPress: () => {
                            this.androidWifiConnectionRequest()
                            }
                          },
                        ],
                        { cancelable: false }
                      )
                }, 500);
              }
            });
        
    }

    handleProvisioningResponse(data, success) {
        
        if (success === true) {
            var statusCode = data["message"]["statusCode"]
            var irBlasterResponseData = JSON.stringify(data)
            
            statusCode = (statusCode === undefined) ? [] : statusCode
            console.log("Provisioning Response is : " + JSON.stringify(data))
            console.log("FINAL STATUS CODE is : " + statusCode)  
            logInfo("Provisioning Response is : " + JSON.stringify(data))
            if (statusCode === 0) { 
                this.setState({
                    provisionedSuccessfully:true,
                    provisionedResponse:irBlasterResponseData,
                   // showProgress: false
                })
                this.props.saveDeviceInfo(this.state.provisionedResponse);
               
                console.log("INSIDE IF - FINAL STATUS CODE : " + statusCode)
                
            }
            else {
                this.setState({
                    showProgress:false,
                    selectedWifiItem: undefined,
                    rescanButtonTitle: translator.t("rescanButtonText"),
                    cancelButtonTitle: translator.t("cancelSetupButton")
                })
                console.log("INSIDE ELSE - FINAL STATUS CODE: " + statusCode)
                TimerMixin.setTimeout(() => {
                    alert("Error occurred while provisioning")
                }, 500)

            }
        }
        else {
            this.setState({
                showProgress:false,
                selectedWifiItem: undefined,
                rescanButtonTitle: translator.t("rescanButtonText"),
                cancelButtonTitle: translator.t("cancelSetupButton")
            })
            console.log("OUTER ELSE - FINAL STATUS CODE: " + success)
            TimerMixin.setTimeout(() => {
                alert("Error occurred while provisioning")
            }, 500)
        }
        console.log("End of block")
    }


    authenticateWifi(item, password) {

        this.checkProvisionedSuccessfully()
        IRBlasterApi.provisionWifi(item.uuid, password, item.deviceType, (data, success) => {
            this.handleProvisioningResponse(data, success)
        })
    }

    performAuthentication(item, password){

        this.setState({
            showProgress: true,
            progressTitle:"Connecting your IR Blaster to the Wi-Fi network"
        })
        TimerMixin.setTimeout(() => {
            this.authenticateWifi(item, password)
        }, 200)
    }

    onPopupCancelButtonTap() {
        this.setState({
            showPasswordView:false,
            selectedWifiItem:undefined
        })
    }

    onPopupContinueButtonTap() {
        if (this.state.password === undefined
            || this.state.password === "") {
            this.setState({
                emptyPassword: true,
            })
            return false;
        }
        this.connectToWifi()
    }

    itemTapped(item) {
        console.log("item tapped : " +item)
       this.setState({
            selectedWifiItem: item,
            showPasswordView:true
        })
        console.log("item tapped : " +this.state.selectedWifiItem)
        if (item["deviceType"] === undefined || item["deviceType"] !== "WPA2-PSK") {
            this.performAuthentication(item, "NONE")
        }
    }

    onRefresh() {

        this.setState(
            {
                data: [],
                showProgress: true,
                alertTitle: 'Fetching wifi list',
                alertMessage: 'Please, wait...',
                isFetchingWifiList:true,
                timeoutOccurred:false
            })
        
        this.wifiListRequest()
    }

    wifiListView() {
        return (
            <SectionList
                renderSectionHeader={({ section }) => <Text style={styles.header}>{section.key}</Text>}
                keyExtractor={item => item.uuid}
                sections={[ // hetrogeneous rendering between sections
                    {
                        data: this.state.data, key: 'Select your wifi network', renderItem: ({ item, i }) => (
                            <View style={{ height: 60 }}>
                                <TouchableHighlight underlayColor="white" onPress={() =>
                                    this.itemTapped(item)
                                }>
                                  <View style={{ flexDirection: "row", justifyContent: "space-between", height: 50, paddingBottom: 5 }}>
                                  <Text style={{ fontFamily: Constants.Fonts.themeFontRegular, fontSize: 12.7, color: "black", paddingTop: 15, paddingLeft: 10 }}>{item.uuid}</Text>
                                  <View style={{
                                            height:18,
                                            paddingTop: 15,
                                            flexDirection: 'row',
                                            alignContent: "flex-end"
                                        }}>
                                            {renderIf(item["deviceType"] === "WPA2-PSK",
                                                <View style={{ height: 17, width: 16, marginRight: 24 }}>
                                                    <Image style={{ height: 17, width: 16 }} source={require('../../../resources/ico_lock_copy_2.png')} />
                                                </View>
                                            )}
                                            <View style={{ height: 18, width: 18, marginRight: 15 }}>
                                                <Image style={{ marginTop: 3, height: 12.3, width: 18.3 }} source={require('../../../resources/ico_wifi_copy.png')} />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        )
                    },
                ]}
                extraData={this.state}
            />
        )
    }

    enterPasswordView() {
        return (
            <View style={{ marginTop: 20, top: 20 }}>
                <Modal
                    visible={true}
                    animationType={"none"}
                    transparent={true}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.5)' }}>
                        <View style={{
                            height: 230, marginLeft: 30, marginRight: 30, marginTop: 90, borderRadius: 7, paddingTop: 20,
                            backgroundColor: 'white'
                        }}>
                            <Text style={{ paddingTop: 10, marginLeft: 27,marginBottom:20, color: "black", fontSize: 17.7, opacity: 0.64, fontFamily: Constants.Fonts.themeFontRegular }}>{this.state.selectedWifiItem !== undefined ? this.state.selectedWifiItem.uuid : ""}</Text>
                            <Text style={{ marginBottom:10, paddingTop: 10, marginLeft: 63, color: "black", fontSize: 12, fontFamily: Constants.Fonts.themeFontRegular }}>PASSWORD</Text>
                            <View style={{ flexDirection: "row" }}>
                                <View>
                                    <Image style={{ marginLeft:26, height:20, width:19}} source={require("../../../resources/ico_lock_copy_2.png")} />
                                </View>
                                <View style={{ flexDirection: "row", justifyContent:"space-between"}}>
                                <TextInput autoCorrect={false} style={{paddingTop: isPlatFormAndroid() === true ? 2 : 0, height:isPlatFormAndroid() === true ? 35 : 30, marginLeft:16, marginRight:5, width:Dimensions.get("window").width - 170 }} secureTextEntry={this.state.hidePassword}
                                underlineColorAndroid="transparent" onChangeText={(text) =>
                                    this.state.password = text
                                }/>
                                    <View style={{height:23, width:23}}>
                                        <Icon name={this.state.hidePassword === true ? 'eye-slash' : "eye"} type='font-awesome' color={Constants.ThemeColors.buttonLightGray} size={23}
                                            onPress={() => this.setState({
                                                hidePassword: !this.state.hidePassword,
                                            })}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginLeft: 27, marginRight: 22, marginTop: 5, height: 1, backgroundColor: "#6970fe" }}>
                            </View>
                            {renderIf(this.state.emptyPassword === true,

                                <Text style={{ marginTop:10, color: "red", fontFamily: Constants.Fonts.themeFontRegular, fontSize: 12, textAlign: "center", }}>Please enter a valid password</Text>   
                            )}
                            <View style={{marginTop:35, flexDirection:"row", justifyContent:"flex-end"}}>
                            <TouchableOpacity
                            style={{marginRight:40}}
                            onPress={() =>
                                this.onPopupCancelButtonTap()

                            }
                            underlayColor="white">
                                <Text style={{ color: "#72b6fe", fontFamily: Constants.Fonts.themeFontRegular, fontSize: 12, textAlign: "center", marginTop: 10 }}>{translator.t("enterPasswordCancelButton")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            style={{marginRight:10}}
                            onPress={() =>
                                this.onPopupContinueButtonTap()

                            }
                            underlayColor="white">
                                <Text style={{ color: "#72b6fe", fontFamily: Constants.Fonts.themeFontRegular, fontSize: 12, textAlign: "center", marginTop: 10 }}>{translator.t("enterPasswordContinueButton")}</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                        
                    </View>
                </Modal>
            </View>)
    }

    connectToWifi() {
        this.setState({
            showPasswordView:false,
            emptyPassword: false
        })
        if(this.state.password !== "") {

            this.performAuthentication(this.state.selectedWifiItem, this.state.password)
        }
        else {
            //alert("Please enter a valid password")
        }
    }
    //Works as cancel setup button initially, it wifi network is selected, works as choose a 
    //different network button
    onCancelButtonTap() {
        if (this.state.cancelButtonTitle === translator.t("cancelSetupButton")) {
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
        else {
            this.setState({
                selectedWifiItem: undefined,
                rescanButtonTitle: translator.t("rescanButtonText"),
                cancelButtonTitle: translator.t("cancelSetupButton")
            })
        }

    }

    //Works as rescan button initially, if the wifi network if selected, works as connect button
    onRescanButtonTap() {
        if (this.state.rescanButtonTitle === translator.t("rescanButtonText")) {
            this.onRefresh()
        }
        else {
            this.connectToWifi()
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    header: {
        backgroundColor:Constants.ThemeColors.appBGColor,
        marginLeft:8,
        marginTop: 9,
        color: "black",
        height: 30,
        fontSize: 16,
        fontFamily:Constants.Fonts.themeFontRegular,
        opacity:0.44
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
    const deviceInfo = state.device.deviceInfo;
    const settingsRoute = state.screen.irSettingsRoute;
    
    console.log("device info : " + deviceInfo)
    console.log("mapStateToProps in IRBlaster_SelectAp called : ")

    return {
        deviceInfo: deviceInfo,
        goBackRoute: settingsRoute
    };
}

export default connect(mapStateToProps, { saveDeviceInfo })(IRBlasterSelectAp);