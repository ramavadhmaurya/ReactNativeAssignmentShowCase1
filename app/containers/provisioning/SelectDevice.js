import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules, TouchableOpacity, Dimensions
} from 'react-native';
import React, { Component } from 'react';
import { HeaderBackButton } from 'react-navigation'
import TimerMixin from 'react-timer-mixin';
import LinearGradient from 'react-native-linear-gradient';
import translator from '../../utils/translations'
import ConfigurationTab from '../../containers/ConfigurationTab'
import Constants from '../../utils/constants'
import SplashScreen from 'react-native-splash-screen';
import {isPlatFormAndroid, showOvalImage, getOvalImage, windowHeight} from '../../utils/utils'

export default class SelectDevice extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerLeft: <HeaderBackButton tintColor="gray" onPress={() => navigation.goBack(null)} />
    })

    constructor(props) {
        super(props)
        this.state = {
            simplifiSelected: true,
            irSelected: false,
            screenWidth: Dimensions.get('window').width

        }
        this.proceedToRegistration = this.proceedToRegistration.bind(this)
        this.androidEventHandler = this.androidEventHandler.bind(this)
        this.simplifiSelected = this.simplifiSelected.bind(this)
    }

    componentDidMount() {
        SplashScreen.hide()
        //this.androidBackButtonAddEventListener()
    }
    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress')
    // }
    componentWillMount() {
        this.androidBackButtonAddEventListener()
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.androidEventHandler);
    }

    simplifiSelected(value) {
        this.setState({
            isSimplifiSelected: value,
        })
    }

    getSelectViewBGStyle() {
        var style = {
            width: this.state.screenWidth,
            height: this.state.screenWidth * 0.6
        }
        return style
    }

    getSelectViewContainerStyle() {
        var dynamicHeight = this.state.screenWidth * 0.6
        return {
            height: (dynamicHeight) - 40,
            width: ((dynamicHeight - 40) * 1.65) + 10,
            position: "absolute",
            flexDirection: "row",
            justifyContent: "space-between"
        }
    }
    getSimplifiContainerStyle() {
        var dynamicHeight = this.state.screenWidth * 0.6
        return {
            height: (dynamicHeight) - 40,
            width: ((dynamicHeight - 40) * 0.82),
            backgroundColor: "white",
            borderRadius: 9,
            justifyContent: "center",
            alignItems: "center"
        }

    }
    getIRBlasterContainerStyle() {
        var dynamicHeight = this.state.screenWidth * 0.6
        return {
            height: (dynamicHeight) - 40,
            width: ((dynamicHeight - 40) * 0.82),
            backgroundColor: "white",
            borderRadius: 9,
            justifyContent: "center",
            alignItems: "center"

        }

    }

    getSimplifiBGStyle() {
        var dynamicHeight = this.state.screenWidth * 0.6
        var containerWidth = ((dynamicHeight - 40) * 0.82)
        var bgWidth = containerWidth * 0.7
        var marginLeft = ((containerWidth - bgWidth) / 2) - 5

        var containerHeight = dynamicHeight - 40
        var bgHeight = bgWidth * 1.06
        var marginTop = (containerHeight - bgHeight - 40) / 2
        return {
            width: bgWidth,
            height: bgHeight,
            marginLeft: marginLeft,
            marginTop: marginTop
        }
    }

    selectDeviceView() {
        return (<View style={{ marginTop: 30, justifyContent: "center", alignItems: "center" }} onLayout={(event) =>
            this.setState({
                imageWidth: event.nativeEvent.layout.width,
            })}>
            <Image style={this.getSelectViewBGStyle()} source={require('../../resources/bg_dashboard_mid.png')}>
            </Image>
            <View style={this.getSelectViewContainerStyle()}>

                <View style={this.getSimplifiContainerStyle()}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                simplifiSelected: true,
                                irSelected: false
                            })
                        }}>
                        <View style={{backgroundColor:"transparent"}}>
                            <View style={{ marginBottom: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                                <View style={optionsStyles.radioButtonOuter} >
                                    {renderIf(this.state.simplifiSelected === true,
                                        <LinearGradient start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 1 }} 
                                            colors={[Constants.ThemeColors.buttonGradientStart, 
                                                Constants.ThemeColors.buttonGradientEnd]} 
                                            style={optionsStyles.radioButtonInner}>
                                        </LinearGradient>
                                    )}

                                </View>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image style={{ width: 28, height: 28 }} source={require('../../resources/ico_device_simplifi.png')} />
                                <Text style={{ marginTop: 16, fontSize: 12, fontFamily:Constants.Fonts.themeFontRegular }}>SIMPLI-FI</Text>
                            </View>

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={this.getIRBlasterContainerStyle()}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                simplifiSelected: false,
                                irSelected: true
                            })
                        }}>
                        <View>
                            <View style={{ marginBottom: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                                <View style={optionsStyles.radioButtonOuter} >
                                    {renderIf(this.state.irSelected === true,
                                        <LinearGradient start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 1 }} 
                                            colors={[Constants.ThemeColors.buttonGradientStart, Constants.ThemeColors.buttonGradientEnd]} 
                                            style={optionsStyles.radioButtonInner}>
                                        </LinearGradient>
                                    )}

                                </View>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image style={{ width: 34, height: 34 }} source={require('../../resources/ico_irblaster.png')} />
                                <Text style={{ marginTop: 10, fontSize: 12, fontFamily:Constants.Fonts.themeFontRegular }}>IR BLASTER</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>)
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
                
                <View style={{ height: 30, width: "100%", alignItems: "center" }}>
                    <Text
                        style={styles.header}>{translator.t("selectYourDevice")}
                    </Text>
                </View>
                {this.selectDeviceView()}

                <View style={{marginTop: windowHeight() * 0.1, overflow:"hidden"}}>
                    {getOvalImage()}
                    <TouchableOpacity

                        style={styles.buttonStyle}
                        onPress={() =>
                            this.proceedToRegistration()
                        }
                        underlayColor="#666666">
                        <View style={{backgroundColor:"transparent", width:160, height:76}}>
                            <Image style={{width:160, height:76}} source={require('../../resources/gfx_btn_2.png')} />
                            <Text style={styles.textStyle}>{translator.t("selectDeviceStartButtonText")}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={{ alignSelf:"center", marginTop: 0, color:"#72b6fe", fontFamily:Constants.Fonts.themeFontRegular, fontSize:16, textAlign: "center" }}>Don't have a device?{"\n"}Buy Now!</Text>
            </View>)
    }

    proceedToRegistration() {
        if (this.state.simplifiSelected === true) {
            this.props.navigation.navigate("SimplifiRegistration")
            AsyncStorage.setItem(Constants.DEVICE_TYPE_SELECTED, Constants.DEVICE_TYPE_VALUE.DEVICE_TYPE_GATEWAY);
        }
        else if (this.state.irSelected === true) {
            // move to existing space list screen if spaces exists 
            // this.props.navigation.navigate("spacesFromRegistration")
            this.props.navigation.navigate("IRBlasterRegistrationDetails")
            // this.props.navigation.navigate("startSpaceCreation")
            AsyncStorage.setItem(Constants.DEVICE_TYPE_SELECTED, Constants.DEVICE_TYPE_VALUE.DEVICE_TYPE_IR);
        }
    }
    // Android back button handler start
    androidBackButtonAddEventListener() {
        BackHandler.addEventListener('hardwareBackPress', this.androidEventHandler)
    }

    androidEventHandler() {
        if (this.props.navigation.state.routeName === 'SelectDevice') {
            BackHandler.exitApp()
            return true
        }
    }
    //Android Back button handler end
}

function renderIf(condition, content) {
    if (condition) {
        return content;
    } else {
        return null;
    }
}

const optionsStyles = StyleSheet.create({
    options: {
        flex: 1,
        marginLeft: 20,
        backgroundColor: Constants.ThemeColors.bgColor,

    },
    radioButtonOuter: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: 21,
        height: 21,
        borderColor: Constants.ThemeColors.buttonLightGray,
        borderRadius: 15,
        borderWidth: 2,
        marginTop: 7,

    },

    radioButtonInner: {
        alignItems: 'center',
        backgroundColor: 'gray',
        width: 11,
        height: 11,
        borderRadius: 5,
    },

})

const styles = StyleSheet.create({
    header: {
        paddingLeft: 10,
        paddingTop: 9,
        color: "black",
        height: 30,
        fontSize: 16,
        fontFamily: Constants.Fonts.themeFontLight,
        opacity: 0.6,
        textAlign: "center"
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
    bulletStyle: {
        color: "black",
        fontWeight: "200",
        fontSize: 11,
        marginLeft: 35,
        marginTop: 5
    }
})