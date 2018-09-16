import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules
} from 'react-native';
import { HeaderBackButton } from 'react-navigation'
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import translator from './../../utils/translations'
import Constants from '../../utils/constants'
import { NavigationActions } from 'react-navigation';

export default class PasswordUpdated extends Component {

    constructor(props) {
        super(props)

        this.onContinueButtonPress = this.onContinueButtonPress.bind(this)
    }
    componentDidMount() {

    }

    onContinueButtonPress() {
        const { navigate } = this.props.navigation;
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'DeviceDetails' }),
            ]
        })
        this.props.navigation.dispatch(resetAction)
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
                <Text
                    style={styles.header}>Wifi Password Reset</Text>
                <View style={{ backgroundColor: "#F2F2F2", height: 200, alignItems: "center" }}>

                    <Image
                        style={{ marginTop: 20, width: 60, height: 60 }}
                        source={require('../../resources/checkMark2.jpg')} />

                    <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>{translator.t("passwordUpdatedMessage")}</Text>
                </View>

                <TouchableHighlight
                    style={styles.buttonStyle}
                    onPress={() =>
                        this.onContinueButtonPress()
                    }
                    underlayColor="#666666">
                    <Text style={styles.textStyle}>{translator.t("continueButtonText")}</Text>
                </TouchableHighlight>

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
    buttonStyle:{
        marginTop:20,
        backgroundColor:"#666666",
        alignSelf:"center",
        borderRadius:2,
        height:30,
        width:200,
        alignItems:"center"
    },
    textStyle: {
        alignContent:"center",
        paddingTop:6,
        fontWeight:"500",
        fontSize:13,
        color:"white"
    }
})