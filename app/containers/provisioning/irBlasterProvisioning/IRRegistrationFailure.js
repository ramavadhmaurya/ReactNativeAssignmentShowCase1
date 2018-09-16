
import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, TouchableOpacity, AsyncStorage, Dimensions, Color, BackHandler, NativeEventEmitter, NativeModules
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import { HeaderBackButton } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient';
import { Icon, } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import translator from '../../../utils/translations'
import Constants from '../../../utils/constants'
import {isPlatFormAndroid, getOvalImage, windowHeight} from '../../../utils/utils'


export default class IRRegistrationFailure extends Component {

    failureMessage() {
        return "IR Blaster Registration Failure"
    }

    cancelSetup() {
        this.props.cancelSetup()
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
            <View style={{ flex: 1, justifyContent:'center', backgroundColor: Constants.ThemeColors.appBGColor }}>
                <View style={{ height: 40 }}>
                    <Text style={{height: 30, opacity:0.44, alignSelf: "center", fontSize:16, fontFamily:Constants.Fonts.themeFontRegular, color: "black", marginTop: 10 }}>{translator.t("irBlasterRegistration")}</Text>
                </View>
                <Image
                style={{  marginTop: windowHeight() > 560 ? 30 : 10, width: windowHeight() > 550 ? 149 : 120, height: windowHeight() > 550 ? 149 : 120, alignSelf:"center" }}
                source={require('../../../resources/gfx_alert.png')} />
                <Text style={{ height: 20, alignSelf: "center", fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12, color: "black", marginTop:20}}>{translator.t("oops")}</Text>
                <Text style={{ height: 20, paddingLeft:30, paddingRight:30, textAlign:"center", alignSelf:"center", fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12, color: "black"}}>{this.failureMessage()}</Text>
                <Text style={{ height: 55, paddingLeft:50, paddingRight:50, textAlign:"center", alignSelf:"center", fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12, color: "black", marginTop: 10 }}>{this.props.errorMessage}</Text>
                <View style={{marginTop: windowHeight() < 560 ? 5 : 20, overflow:"hidden"}}>
                    {getOvalImage()}
                    <TouchableOpacity
                    
                        style={styles.buttonStyle}
                        onPress={() =>
                            this.onTryAgainPress()
                        }
                        underlayColor="#666666">
                        <View style={{backgroundColor:"transparent", width:160, height:76}}>
                            <Image style={{width:160, height:76}} source={require('../../../resources/gfx_btn_2.png')} />
                            <Text style={styles.textStyle}>{translator.t("tryAgainButtonText")}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        this.cancelSetup()
                    }
                    style={{ alignSelf: "center"}}
                    underlayColor="#666666">
                    <Text style={{ color:"#72b6fe", fontFamily:Constants.Fonts.themeFontRegular, fontSize:16, textAlign: "center", marginTop: 10 }}>{translator.t("cancelSetupButton")}</Text>
                </TouchableOpacity>
            </View>
            </View>)

    }

    onTryAgainPress() {
        this.props.tryAgain()
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