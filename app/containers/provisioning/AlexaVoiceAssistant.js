
import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, TouchableOpacity, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules, Dimensions
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import translator from '../../utils/translations'
import ConfigurationTab from '../../containers/ConfigurationTab'
import Constants from '../../utils/constants'
import {isPlatFormAndroid, windowHeight, getOvalImage} from '../../utils/utils'



export default class AlexaVoiceAssistant extends Component {

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor}}>
            
                <View style={{ height: 110 }}>
                    <Text style={{ height:30, paddingLeft: 20, alignSelf: "center", fontSize: 16, color: "black", marginTop: 20, fontFamily:Constants.Fonts.themeFontRegular, opacity:0.44 }}>{translator.t("alexaVoiceAssistant")}</Text>
                    <Text style={{ marginLeft:62, textAlign:"center", marginRight:62, height:60,alignSelf: "center", fontFamily:Constants.Fonts.themeFontRegular, fontSize: 12, color: "black", marginTop: 20 }}>{translator.t("alexaVoiceAssistantDescription")}</Text>
                </View>
                <View style={{justifyContent:"center", marginTop:windowHeight() > 550 ? 35 : 20,}}>
                    <Image style={{alignSelf:"center", width:236, height:214}} source={require('../../resources/logo_amzon_login.png')} />
                </View>
                <View style={{marginTop: windowHeight() < 550 ? 5 : 50, overflow:"hidden"}}>
                    {getOvalImage()}
                    <TouchableOpacity

                        style={styles.buttonStyle}
                        onPress={() =>
                            this.onAmazonLoginPress()
                        }
                        underlayColor="#666666">
                        <View style={{backgroundColor:"transparent", width:160, height:76}}>
                            <Image style={{width:160, height:76}} source={require('../../resources/gfx_btn_2.png')} />
                            <Text style={styles.textStyle}>{translator.t("amazonLoginButton")}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>)

    }

    onAmazonLoginPress() {
        this.props.onAmazonLogin()
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