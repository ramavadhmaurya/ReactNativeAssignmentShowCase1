import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, Dimensions, TouchableOpacity, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules
} from 'react-native';
import { HeaderBackButton } from 'react-navigation'
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import translator from './../../utils/translations'
import Constants from '../../utils/constants'
import ConfigurationTab from '../../containers/ConfigurationTab'
import {isPlatFormAndroid, simplifiDeviceContext, windowHeight, getOvalImage } from '../../utils/utils';
import renderIf from '../renderIf'

const simplifiRegistrationContext = {

    SIMPLIFI_REGISTRATION: 0,
    HOME: 1,
    SIMPLIFI_PROVISIONING_RESET_PASSWORD: 2
}


export default class PhoneConnected extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerLeft: <HeaderBackButton tintColor="gray" onPress={() =>
             navigation.goBack(null)} />
    })
    constructor(props) {
        super(props)

        this.state = {
            //simplifiProvisioningResetPassword : false,
            registrationContext : undefined,
    
        }

        this.renderIfProvisioningContext = this.renderIfProvisioningContext.bind(this)
        this.renderIfProvisioningContextView = this.renderIfProvisioningContextView.bind(this)
        this.renderIfProvisioningContext()
    }
    componentDidMount() {

    }

    renderIfProvisioningContextView(condition, content) {
        if (condition) {
            return content;
        } else {
            return <View style={{ backgroundColor: "#F9F9F9" }}>
                <Text
                    style={styles.header}>Wifi Password Reset</Text>
            </View>
        }
    }
    

    renderIfProvisioningContext() {

        simplifiDeviceContext((simplifiDeviceContext) => {

            this.setState({
                registrationContext : simplifiDeviceContext
            })
        })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
                
                <View>
                    <View style={{alignItems: "center" }}>
                        <Text style={{ textAlign: "center", marginTop: 36, fontFamily:Constants.Fonts.themeFontLight, fontSize:16, marginLeft:50, marginRight:50 }}>{translator.t("phoneConnectedMessage")}</Text>
                        <Image
                            style={{ marginTop: 40, width: 140, height: 140 }}
                            source={require('../../resources/gfx_simplifi_connected.png')} />
                    </View>
                    <Text style={{marginLeft:50, marginRight:50, textAlign: "center", marginTop: 20, color: "gray" }}>{translator.t("phoneConnectedDetailMessage")}</Text>
                    <View style={{marginTop: windowHeight() < 550 ? 30 : 90, overflow:"hidden"}}>
                        {getOvalImage()}
                        <TouchableOpacity

                        style={styles.buttonStyle}
                        onPress={() =>
                            this.props.navigation.navigate("selectAp")
                        }
                        underlayColor="#666666">
                        <View style={{backgroundColor:"transparent", width:160, height:76}}>
                            <Image style={{width:160, height:76}} source={require('../../resources/gfx_btn_2.png')} />
                            <Text style={styles.textStyle}>{translator.t("simplifiRegistrationContinueButton")}</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>)

    }

    componentWillUnmount(){
        if(this.props.navigation.state.params !== undefined
           && this.props.navigation.state.params.componentWillAppear !== undefined) {
            this.props.navigation.state.params.componentWillAppear()
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