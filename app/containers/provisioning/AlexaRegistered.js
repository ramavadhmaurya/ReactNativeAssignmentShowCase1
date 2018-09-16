import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, TouchableOpacity,  AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules, Dimensions
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import translator from './../../utils/translations'
import Constants from '../../utils/constants'
import {isPlatFormAndroid, getOvalImage, windowHeight} from '../../utils/utils'
import renderIf from '../renderIf'

export default class AlexaRegistered extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
                
                <View style={{ alignItems: "center" }}>
                    <Text style={{  alignSelf: "center", fontSize: 16, marginTop: 20, color: "black" }}>{translator.t("alexaRegistration")}</Text>

                    <Image
                        style={{ marginTop: 47, width: 149, height: 149 }}
                        source={require('../../resources/gfx_successful.png')} />

                </View>
                <Text style={{marginLeft:50, marginRight:50, textAlign: "center", fontSize:12, fontFamily:Constants.Fonts.themeFontRegular, marginTop: 40, color: "black" }}>{translator.t("alexaRegistrationSuccessMessage")}</Text>
                <View style={{marginTop: windowHeight() < 550 ? 30 : 50, overflow:"hidden"}}>
                    {getOvalImage()}
                    <TouchableOpacity

                        style={styles.buttonStyle}
                        onPress={() =>
                            this.props.goToHome()
                        }
                        underlayColor="#666666">
                        <View style={{backgroundColor:"transparent", width:160, height:76}}>
                            <Image style={{width:160, height:76}} source={require('../../resources/gfx_btn_2.png')} />
                            <Text style={styles.textStyle}>{translator.t("goToHomeButtonTitle")}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>)

    }
}

const styles = StyleSheet.create({

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