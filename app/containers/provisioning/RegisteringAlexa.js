
import {
    ScrollView, Text, TextInput, View, Button, StyleSheet,
    Animated, Image, Easing,
    TouchableHighlight, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import { HeaderBackButton } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient';
import { Icon, } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import translator from '../../utils/translations'
import Constants from '../../utils/constants'

export default class RegisteringAlexa extends Component {

    startImageRotateFunction() {
        this.rotateValueHolder.setValue(0)
        Animated.timing(
            this.rotateValueHolder,
            {
                toValue: 1,
                duration: 500,
                easing: Easing.linear
            }
        ).start(() => this.startImageRotateFunction())
    }

    constructor(props) {
        super(props)
        this.rotateValueHolder = new Animated.Value(0);
        this.state = {

        }
    }

    componentDidMount() {
        this.startImageRotateFunction();
    }

    render() {
        const rotateData = this.rotateValueHolder.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor}}>
            <View><View style={{ height: 90 }}>
            <Text style={{ height: 30, color:"black", alignSelf: "center",  fontSize: 16, fontFamily:Constants.Fonts.themeFontRegular, opacity:0.44, marginTop: 10 }}>{translator.t("alexaRegistration")}</Text>
            <Text style={{ marginLeft:50, marginRight:50, height: 40, textAlign:"center", color:"black", alignSelf: "center", fontSize: 12, fontFamily:Constants.Fonts.themeFontRegular, color: "black", marginTop: 10 }}>{translator.t("enablingVoiceService") }</Text>
            <Text style={{ marginLeft:50, marginRight:50, height: 20, textAlign:"center", color:"black", alignSelf: "center", fontSize: 12, fontFamily:Constants.Fonts.themeFontRegular, color: "black", marginTop: 10 }}>{translator.t("fewMinutes") }</Text>
        
        </View>
            <View style={{marginTop:100, height: 70, backgroundColor: Constants.ThemeColors.appBGColor, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                <Animated.Image
                    style={{
                        width: 70,
                        height: 70,
                        transform: [{ rotate: rotateData }]
                    }}
                    source={require('../../resources/gfx_loading.png')} />
            </View>
            </View>
            </View>)

    }

    onContinuePress() {
        this.props.navigation.navigate("WifiSetup")
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
        marginTop: 20,
        backgroundColor: "#666666",
        alignSelf: "center",
        borderRadius: 2,
        height: 30,
        width: 160,
        alignItems: "center"
    },
    textStyle: {
        alignContent: "center",
        paddingTop: 6,
        fontWeight: "500",
        fontSize: 13,
        color: "white"
    },
})