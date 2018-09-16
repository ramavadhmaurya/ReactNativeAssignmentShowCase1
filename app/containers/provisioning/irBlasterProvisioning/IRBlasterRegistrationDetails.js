import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image, Dimensions,
    TouchableHighlight, TouchableOpacity, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import { HeaderBackButton } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient';
import { Icon, } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import webApi from '../../../lib/webApi'
import translator from '../../../utils/translations'
import  Constants, {iRRegistrationContext } from '../../../utils/constants'
import { showRetryAlert } from '../../../utils/utils'

import DeviceSetup from '../DeviceSetup'
import { ProgressDialog } from 'react-native-simple-dialogs';
import { connectedToNetwork } from '../../../utils/utils'
import { isPlatFormAndroid, simplifiDeviceContext, getOvalImage, windowHeight } from '../../../utils/utils';
import * as firebase from "firebase";
import Firebase from '../../../lib/firebase';
import { getCloudServerIP } from '../../../utils/constants';
import { saveIRSettingsRoute } from '../../../actions/action';
import { connect } from 'react-redux';

class IRBlasterRegistrationDetails extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerLeft: <HeaderBackButton tintColor="gray" onPress={() => navigation.goBack(null)} />
    })

    constructor(props) {
        super(props)
        this.state = {
            simplifiSelected: true,
            name: undefined,
            showProgress: false,
        }
        this.androidEventHandler = this.androidEventHandler.bind(this)
        this.getSpaces = this.getSpaces.bind(this)
    }

    // Android back button handler start
    androidBackButtonAddEventListener() {
        BackHandler.addEventListener('hardwareBackPress', this.androidEventHandler)
    }
    androidEventHandler() {
        if (this.props.navigation.state.routeName === 'IRBlasterRegistrationDetails') {
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
        //  alert("Ir Registration")
        this.props.saveIRSettingsRoute(this.props.navigation.state.key)        

    }
    validateForm() {
        if (this.state.name === undefined
            || this.state.name === "") {
            alert("Please enter a valid name")
            return false;
        }


        return true
    }

    onContinuePress() {
        if (this.validateForm()) {
            var info = {
                name: this.state.name
            }
            AsyncStorage.setItem(Constants.IRBLASTER_INFO, JSON.stringify(info));
            // this.props.navigation.navigate("spacesFromRegistration")
            this.getSpaces();
        }
    }

    getSpaces() {
        this.setState({
            showProgress: true,
        })

        AsyncStorage.getItem(Constants.USER_INFO).then((value) => {
            var userInfo = JSON.parse(value);
            var userInfoFirebaseUid = userInfo.data.firebaseUid

            firebase.auth().currentUser.getIdToken(true).then(
                (idToken) => {

                    response =
                        webApi.get(getCloudServerIP(),
                            'simplifi/users/'
                            + userInfoFirebaseUid
                            + "/spaces",
                            idToken)
                    response.then(resp => {
                        let json = resp.json();
                        if (resp.ok) {
                            return json;
                        }
                        return json.then(err => { throw err });
                    }).then(responseData => {
                        console.log("SPACES RESPONSE: + ", responseData)
                        spaces = responseData.data;

                        this.setState({ showProgress: false });

                        if (responseData.data.length <= 0) {
                            const { navigate } = this.props.navigation;
                            // navigate("CreateNewSpaceFromRegistration")

                            //navigate("StartSpaceCreation")
                            // this.props.navigation.goBack(null)
                            navigate("spacesFromRegistration")

                        } else {
                            const { navigate } = this.props.navigation;
                            navigate("spacesFromRegistration")
                            
                        }

                        return responseData;
                    }).catch((error) => {
                        console.log('Error: ' + error.toString());
                        this.setState({
                            showProgress: false
                        });
                        TimerMixin.setTimeout(() => {
                            alert(' ' + error.message);
                        }, 500);
                    }); 
                })
        })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
                
                <View>
                    <Text style={{ color:"black", fontFamily:Constants.Fonts.themeFontRegular, fontSize:16, opacity:0.6, height: 30, paddingLeft: 23, alignSelf: "flex-start", marginTop: 30 }}>{translator.t("irBlasterRegistration")}</Text>
                    <View style={{ flexDirection: 'column', marginLeft: 41, marginRight: 41 }}
                    >
                        <View style={{marginTop:40, height: 53 }}>
                        <Text style={{ fontFamily:Constants.Fonts.themeFontRegular, fontSize:12, opacity:0.5, height: 20,  alignSelf: "flex-start", color: "black" }}>{translator.t("irBlasterNameYour")}</Text>
                    
                            <TextInput style={{ fontFamily:Constants.Fonts.themeFontRegular, fontSize:14.7, height:40,  }} autoCorrect={false}
                            maxLength={15}
                                underlineColorAndroid="transparent" onChangeText={(text) =>
                                    this.state.name = text
                                } />
                        </View>
                        <View style={{ height: 1.3, backgroundColor: "#e4e4e4", marginBottom: 5 }}>

                        </View>
                        <ProgressDialog
                            visible={this.state.showProgress}
                            title={this.state.dialogMessage}
                            message="Please wait..."
                        />
                    </View>
                </View>
                <View style={{marginTop: windowHeight() * 0.1, overflow:"hidden"}}>
                    {getOvalImage()}
                    <TouchableOpacity

                        style={styles.buttonStyle}
                        onPress={() =>
                            this.onContinuePress()
                        }
                        underlayColor="#666666">
                        <View style={{backgroundColor:"transparent", width:160, height:76}}>
                            <Image style={{width:160, height:76}} source={require('../../../resources/gfx_btn_2.png')} />
                            <Text style={styles.textStyle}>{translator.t("simplifiRegistrationContinueButton")}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        this.cancelSetup()
                    }
                    style={{  alignSelf: "center" }}
                    underlayColor="#666666">
                    <Text style={{ color:"#72b6fe", fontFamily:Constants.Fonts.themeFontRegular, fontSize:16, textAlign: "center" }}>{translator.t("cancelSetupButton")}</Text>
                </TouchableOpacity>

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
            this.props.navigation.goBack(null)
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
   
    return {
        goBackRoute:settingsRoute
    };
}

export default connect(mapStateToProps, { saveIRSettingsRoute })(IRBlasterRegistrationDetails);