import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, TouchableOpacity, Dimensions, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import { HeaderBackButton } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient';
import { Icon, } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import translator from '../../../utils/translations'
import ConfigurationTab from '../../../containers/ConfigurationTab'
import Constants, { iRRegistrationContext } from '../../../utils/constants'
import DeviceSetup from './../DeviceSetup'
import { ProgressDialog } from 'react-native-simple-dialogs';
import {isPlatFormAndroid, showOvalImage, windowHeight, getOvalImage} from '../../../utils/utils'
import renderIf from '../../renderIf'
import { connect } from 'react-redux';

class IRBlasterRegistration extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerLeft: <HeaderBackButton tintColor="gray" onPress={() => navigation.goBack(null)} />
    })

    constructor(props) {
        super(props)
        this.state = {
            simplifiSelected: true,
        }
        this.androidEventHandler = this.androidEventHandler.bind(this)
    }

    // Android back button handler start
    androidBackButtonAddEventListener() {
        BackHandler.addEventListener('hardwareBackPress', this.androidEventHandler)
    }
    androidEventHandler() {
        if (this.props.navigation.state.routeName === 'IRBlasterRegistration') {
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

    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
                
                <View style={{marginTop:windowHeight() > 550 ? 40: 0}}>
                    <Text style={{ opacity:0.6, textAlign:"center", marginLeft: 30, marginRight:30, fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12.7, color: "black", marginTop: 10 }}>{translator.t("irBlasterSetupDescriptionText0")}</Text>
                    <Text style={{ textAlign:"center", marginLeft: 30, marginRight:30, paddingLeft: 20, fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12.7, color: "black", marginTop: 20 }}>{translator.t("irBlasterSetupDescriptionText1")}</Text>
                </View>
                <View style={{marginTop:20,
                width:"100%",
                              justifyContent:"center", 
                              alignItems:"center"}}>
                              <Image style={{height:Dimensions.get("window").width < 350 ? 160 : 190, 
                              width:Dimensions.get("window").width < 350 ? 160 : 190}} source={require('../../../resources/img_irblaster.png')} />
                      
                </View>
                <View style={{marginTop: windowHeight() <= 550 ? 5: 10, overflow:"hidden"}}>
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
                <TouchableHighlight
                    
                    style={{ alignSelf: "center" }}
            
                    underlayColor="#666666">
                    <Text style={{ color:"#72b6fe", fontFamily:Constants.Fonts.themeFontRegular, fontSize:16, textAlign: "center" }}>{translator.t("needHelpButtonText")}</Text>
                </TouchableHighlight>
                <TouchableOpacity
                    onPress={() =>
                        this.cancelSetup()
                    }
                    style={{marginTop:10, alignSelf: "center" }}
                    underlayColor="#666666">
                    <Text style={{ color:"#72b6fe", fontFamily:Constants.Fonts.themeFontRegular, fontSize:16, textAlign: "center" }}>{translator.t("cancelSetupButton")}</Text>
                </TouchableOpacity>
            
            </View>)

    }

    onContinuePress() {
        this.props.navigation.navigate("IRBlasterWifiSetup")
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
    const settingsRoute = state.screen.irSettingsRoute;
    
    return {
        goBackRoute: settingsRoute
    };
}

export default connect(mapStateToProps)(IRBlasterRegistration);