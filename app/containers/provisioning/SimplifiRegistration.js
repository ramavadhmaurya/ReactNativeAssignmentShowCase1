import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    Dimensions, TouchableHighlight, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules, TouchableOpacity, Keyboard
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import { HeaderBackButton } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient';
import { Icon, } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import webApi from './../../lib/webApi'
import translator from '../../utils/translations'
import Constants from '../../utils/constants'
import { showRetryAlert } from '../../utils/utils'
import LanguagePicker from './LanguagePicker'
import DeviceSetup from './DeviceSetup'
import { ProgressDialog } from 'react-native-simple-dialogs';
import { connectedToNetwork } from '../../utils/utils'
import { simplifiDeviceContext, isPlatFormAndroid, getOvalImage, windowHeight } from '../../utils/utils';
import { connect } from 'react-redux';
import store from '../../store';
import { saveSimplifiSettingsRoute } from '../../actions/action';

const simplifiRegistrationContext = {

    SIMPLIFI_REGISTRATION: 0,
    HOME: 1
}


class SimplifiRegistration extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerLeft: <HeaderBackButton tintColor="gray" onPress={() => navigation.goBack(null)} />
    })
    constructor(props) {
        super(props)
        this.state = {
            simplifiSelected: true,
            languageViewX: 38,
            languageText: translator.t("selectLanguagePlaceHolder"),
            showLanguagePicker: false,
            languageTextColor: Constants.ThemeColors.placeHolder,
            pinCode: undefined,
            simplifiName: undefined,
            showProgress: false,
            progressTitle: "Loading languages",
            languages: ["English (US)", "English (UK)", "German", "French", "Japanese"]
        }
        this.selectedLanguage = this.selectedLanguage.bind(this)
        this.androidEventHandler = this.androidEventHandler.bind(this)
    }

    // Android back button handler start
    androidBackButtonAddEventListener() {
        BackHandler.addEventListener('hardwareBackPress', this.androidEventHandler)
    }
    androidEventHandler() {
        if (this.props.navigation.state.routeName === 'SimplifiRegistration') {
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
        
        this.props.saveSimplifiSettingsRoute(this.props.navigation.state.key)

        if (connectedToNetwork() === true) {
            this.fetchLanguages()
        }
        else {
            showRetryAlert('', Constants.NO_INTERNET_MESSAGE, '', () => {
                this.fetchLanguages()
            })
        }
    }

    fetchLanguages() {
        this.setState({
            showProgress: true
        })
        webApi.getLanguages((success, object) => {
            this.setState({
                showProgress: false
            })
            if (success === true) {
                this.state.languages = object.data
            }
            else {
                showRetryAlert('', object.message, '', () => {
                    this.fetchLanguages()
                })
            }
        })
    }

    toggleShowHideLanguagePicker() {

        this.setState({
            showLanguagePicker: !this.state.showLanguagePicker,
        })
    }

    validateForm() {
        if (this.state.simplifiName === undefined
            || this.state.simplifiName === "") {
            alert("Please enter a valid Simplifi name")
            return false;
        }
        if (/^\s/.test(this.state.simplifiName) === true || /\s$/.test(this.state.simplifiName) === true) {
            alert("Please enter a valid Simplifi name");
            return;
        }
        if (this.state.pinCode === undefined
            || this.state.pinCode === "") {
            alert("Please enter a valid pincode")
            return false;
        }
        if (/^\s/.test(this.state.pinCode) === true || /\s$/.test(this.state.pinCode) === true) {
            alert("Please enter a valid pincode");
            return;
        }

        if (this.state.languageText === translator.t("selectLanguagePlaceHolder")) {
            alert("Please select a language")
            return false
        }

        return true
    }

    onContinuePress() {
        if (this.validateForm()) {
            Keyboard.dismiss()
            var info = {
                language: this.state.languageText,
                pinCode: this.state.pinCode,
                simplifiName: this.state.simplifiName
            }
            AsyncStorage.setItem(Constants.SIMPLIFI_INFO, JSON.stringify(info));
            this.props.navigation.navigate("DeviceSetup")
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
                <View>
                    <View style={{ flexDirection: 'column', marginLeft: 38, marginRight: 43, marginTop: 70 }}
                    >
                        <View style={{ height: 53 }}>
                            <View>
                            <Text style={{ fontFamily: Constants.Fonts.themeFontRegular, fontSize: 12, }}>NAME YOUR SIMPLI-FI</Text>
                            <TextInput style={{height:45}} maxLength={20} autoCorrect={false}
                                underlineColorAndroid="transparent" onChangeText={(text) =>
                                    this.state.simplifiName = text
                                } />
                            </View>
                            <View style={{marginTop:-5, backgroundColor:"#e4e4e4", height:1.3}}></View>
                        </View>


                        <View style={{ marginTop: 16, height: 53 }}>
                            <Text style={{ marginBottom: 10, fontFamily: Constants.Fonts.themeFontRegular, fontSize: 12, }}>SELECT LANGUAGE</Text>

                            <View style={this.getLanguageButtonContainerStyle()}>

                                <TouchableHighlight underlayColor="#f9f9f9" onLayout={(event) =>
                                    this.state.languageViewWidth = event.nativeEvent.layout.width
                                }
                                    onPress={() =>
                                        {
                                            Keyboard.dismiss()
                                            this.toggleShowHideLanguagePicker()
                                        }

                                    }>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                                        <Text style={this.getLanguageTextStyle()}>{this.state.languageText}</Text>
                                        <View style={{ paddingRight: 1, paddingTop:3 }}>
                                            <Image style={{ width: 18.3, height: 18.3 }} source={require('../../resources/chevron_down.png')} />
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <View style={{marginTop:4, backgroundColor:"#e4e4e4", height:1.3}}></View>
                        
                            </View>

                        </View>

                        <View style={{ marginTop: 16, height: 53 }}>
                            <View>
                            <Text style={{ fontFamily: Constants.Fonts.themeFontRegular, fontSize: 12, }}>PINCODE</Text>

                            <TextInput style={{height:45}} maxLength={8} autoCorrect={false}
                                underlineColorAndroid="transparent" keyboardType='numeric' onChangeText={(text) =>
                                    this.state.pinCode = text
                                } />
                            </View>
                            <View style={{marginTop:-5, backgroundColor:"#e4e4e4", height:1.3}}></View>
                        
                        </View>

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
                            <Image style={{width:160, height:76}} source={require('../../resources/gfx_btn_2.png')} />
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
                    <Text style={{ color: "#72b6fe", fontFamily: Constants.Fonts.themeFontRegular, fontSize: 16, textAlign: "center"}}>{translator.t("cancelSetupButton")}</Text>
                </TouchableOpacity>
                {renderIf(this.state.showLanguagePicker,
                    <View style={this.getLanguageContainerStyle()}>
                        <LanguagePicker languages={this.state.languages} selectedLanguage={this.selectedLanguage} />
                    </View>
                )}
                <ProgressDialog
                    visible={this.state.showProgress}
                    title={this.state.progressTitle}
                    message="Please wait..."
                />
            </View>)

    }
    getLanguageContainerStyle() {
        return {
            borderColor: "#c8c8c8",
            backgroundColor: "white",
            position: "absolute",
            height: 135,
            top: isPlatFormAndroid() === true ? 193 : 190,
            width: this.state.languageViewWidth,
            marginLeft: this.state.languageViewX,
            elevation: 7,
            shadowColor: "gray",
            shadowOpacity: 0.5,
            shadowRadius: 4,
            shadowOffset: {
                height: 1,
                width: 0
            }
        }
    }
    getLanguageButtonContainerStyle() {
        return {
            height: 28,
            shadowColor: "gray",
            elevation:this.state.showLanguagePicker === true ? 1 : 0,
            borderRadius:this.state.showLanguagePicker === true ? 1 : 0,
            shadowOpacity: this.state.showLanguagePicker === true ? 0.5 : 0,
            shadowRadius: 4,
            shadowOffset: {
                height: 1,
                width: 0
            }
        }
    }

    getLanguageTextStyle() {
        return {paddingLeft:this.state.showLanguagePicker === true ? 5 : 0, paddingTop:3, elevation: 1, color: this.state.languageTextColor }
    }

    selectedLanguage(text) {
        this.setState({
            languageText: text,
            showLanguagePicker: false,
            languageTextColor: "black",
        })
    }

    cancelSetup() {

        simplifiDeviceContext((simplifiDeviceCount) => {
            if (simplifiDeviceCount === simplifiRegistrationContext.SIMPLIFI_REGISTRATION) {
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

export default connect(mapStateToProps, { saveSimplifiSettingsRoute })(SimplifiRegistration);