import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, Dimensions, TouchableOpacity, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import translator from './../../utils/translations'
import Constants from '../../utils/constants'
import ConfigurationTab from '../../containers/ConfigurationTab'
import AmazonLogin from '../../containers/AmazonLogin'
import {isPlatFormAndroid, windowHeight, getOvalImage} from '../../utils/utils'
import renderIf from '../renderIf'

export default class DeviceRegistered extends Component {

    constructor(props) {
        super(props);

        this.androidEventHandler = this.androidEventHandler.bind(this)
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

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
                
                

                <View style={{ alignItems: "center" }}>
                    <Text style={{  alignSelf: "center", fontSize: 16, marginTop: 20, color: "black" }}>{translator.t("simplifiRegisteredToCloud")}</Text>

                    <Image
                        style={{ marginTop: 47, width: 149, height: 149 }}
                        source={require('../../resources/gfx_simplificloud_registerd.png')} />

                </View>
                <Text style={{marginLeft:50, marginRight:50, textAlign: "center", fontSize:12, opacity:0.6, fontFamily:Constants.Fonts.themeFontRegular, marginTop: 40, color: "black" }}>{translator.t("enableVoiceAssistant")}</Text>
                <View style={{marginTop: windowHeight() < 550 ? 30 : 50, overflow:"hidden"}}>
                    {getOvalImage()}
                <TouchableOpacity

                    style={styles.buttonStyle}
                    onPress={() =>
                        this.props.navigation.navigate("AmazonLogin")
                    }
                    underlayColor="#666666">
                    <View style={{backgroundColor:"transparent", width:160, height:76}}>
                        <Image style={{width:160, height:76}} source={require('../../resources/gfx_btn_2.png')} />
                        <Text style={styles.textStyle}>{translator.t("connectSimplifiNextButton")}</Text>
                    </View>
                </TouchableOpacity>
                </View>
            </View>)

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