
import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, Dimensions, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules, TouchableOpacity
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
import {isPlatFormAndroid, getOvalImage, windowHeight} from '../../utils/utils'

export default class AlexaRegistrationFailure extends Component {

    failureMessage() {
        if (this.props.failureReason === 0){
            return translator.t("amazonLoginFailure")
        }
        else {
            return translator.t("voiceActivationFailed")
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
            <View style={{ flex: 1, justifyContent:'center', backgroundColor: Constants.ThemeColors.appBGColor }}>
                <View style={{ height: 40 }}>
                    <Text style={{height: 30, opacity:0.44, alignSelf: "center", fontSize:16, fontFamily:Constants.Fonts.themeFontRegular, color: "black", marginTop: 10 }}>{translator.t("alexaRegistration")}</Text>
                </View>
                <Image
                style={{ marginTop: windowHeight() > 560 ? 30 : 10, width: windowHeight() > 550 ? 149 : 120, height:windowHeight() > 550 ? 149 : 120, alignSelf:"center" }}
                source={require('../../resources/gfx_alert.png')} />
                <Text style={{ height: 20, alignSelf: "center", fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12, color: "black", marginTop:20}}>{translator.t("oops")}</Text>
                <Text style={{ height: 20, paddingLeft:30, paddingRight:30, textAlign:"center", alignSelf:"center", fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12, color: "black"}}>{this.failureMessage()}</Text>
                <Text style={{ height: 55, paddingLeft:50, paddingRight:50, textAlign:"center", alignSelf:"center", fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12, color: "black", marginTop: 10 }}>{translator.t("simplifiConnectedToInternet")}</Text>
                <View style={{marginTop: windowHeight() < 560 ? 5 : 20, overflow:"hidden"}}>
                    {getOvalImage()}
                    <TouchableOpacity
                    
                        style={styles.buttonStyle}
                        onPress={() =>
                            this.onTryAgainPress()
                        }
                        underlayColor="#666666">
                        <View style={{backgroundColor:"transparent", width:160, height:76}}>
                            <Image style={{width:160, height:76}} source={require('../../resources/gfx_btn_2.png')} />
                            <Text style={styles.textStyle}>{translator.t("tryAgainButtonText")}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        this.cancelSetup()
                    }
                    style={{    alignSelf: "center"}}
                    underlayColor="#666666">
                    <Text style={{ color:"#72b6fe", fontFamily:Constants.Fonts.themeFontRegular, fontSize:16, textAlign: "center", marginTop: 10 }}>{translator.t("cancelSetupButton")}</Text>
                </TouchableOpacity>
            </View>   
            </View>)

    }

    // render() {
    //     return (
    //         <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
    //             <View style={{ height: 40 }}>
    //                 <Text style={{height: 30, paddingLeft: 20, alignSelf: "flex-start", fontWeight: "200", fontSize: 17, color: "#333333", marginTop: 10 }}>{translator.t("alexaRegistration")}</Text>
    //             </View>
    //             <Image
    //             style={{ marginTop: 20, width: 149, height: 149, alignSelf:"center" }}
    //             source={require('../../resources/gfx_alert.png')} />
    //             <Text style={{ height: 30, alignSelf: "center", fontWeight: "200", fontSize: 17, color: "#666666", marginTop: 10 }}>{translator.t("oops")}</Text>
    //             <Text style={{ height: 30, paddingLeft:30, paddingRight:30, textAlign:"center", alignSelf:"center", fontWeight: "400", fontSize: 14, color: "#666666", marginTop: 10 }}>{this.failureMessage()}</Text>
    //             {renderIf(this.props.failureReason == 1,
    //             <Text style={{ height: 40, paddingLeft:65, paddingRight:65, textAlign:"center", alignSelf:"center", fontWeight: "400", fontSize: 14, color: "#666666", marginTop: 10 }}>{translator.t("simplifiConnectedToInternet")}</Text>
    //             )}
    //             <TouchableHighlight
    //                 onPress={() =>
    //                     this.onTryAgainPress()
    //                 }
    //                 style={styles.buttonStyle}
    //                 underlayColor="#666666">
    //                 <Text style={styles.textStyle}>{translator.t("tryAgainButtonText")}</Text>
    //             </TouchableHighlight>
    //             <TouchableHighlight
    //                 onPress={() =>
    //                     this.cancelSetup()
    //                 }
    //                 style={{ marginTop: 10, alignSelf: "center" }}
    //                 underlayColor="#666666">
    //                 <Text>{translator.t("cancelSetupButton")}</Text>
    //             </TouchableHighlight>
    //         </View>)

    // }

    onTryAgainPress() {
        this.props.tryAgain()
    }

    cancelSetup() {
        this.props.cancelSetup()
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
        fontSize: 13.5,
        color: "white",
        textAlign:"center",
        width:"100%",
        height:20,
        top:isPlatFormAndroid() === false ? 22 : 20
    },
})