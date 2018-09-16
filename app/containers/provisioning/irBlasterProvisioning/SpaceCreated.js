import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, TouchableOpacity, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules, Dimensions
} from 'react-native';
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import translator from '../../../utils/translations'

import  Constants, {iRRegistrationContext } from '../../../utils/constants'
import { NavigationActions } from 'react-navigation';
import {isPlatFormAndroid, windowHeight, showOvalImage, getOvalImage} from '../../../utils/utils'
import renderIf from '../../renderIf'
import { connect } from 'react-redux';


class SpaceCreated extends Component {

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
                    <Text style={{marginLeft:62, textAlign:"center", marginRight:62,  alignSelf: "center", fontSize: 16, marginTop: 42, color: "black" }}>{translator.t("newSpaceCreated")}</Text>

                    <Image
                        style={{ marginTop: 64, width: 149, height: 149 }}
                        source={require('../../../resources/gfx_addspace_successfully.png')} />

                </View>
                <View style={{marginTop:windowHeight() <= 550 ? 30 : 100,  overflow:"hidden"}}>
                            {getOvalImage()} 
                <TouchableOpacity

                    style={styles.buttonStyle}
                    onPress={() =>
                        //this.props.navigation.navigate("spacesFromRegistration")
                        {
                            this.props.navigation.goBack(this.props.goBackRoute)
                            this.props.centralEventEmitter.emit('SpacesRefresh')
                        }
                    }
                    underlayColor="#666666">
                    <View style={{backgroundColor:"transparent", width:160, height:76}}>
                        <Image style={{width:160, height:76}} source={require('../../../resources/gfx_btn_2.png')} />
                        <Text style={styles.textStyle}>{translator.t("simplifiRegistrationContinueButton")}</Text>
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

function mapStateToProps(state) {
    const spacesRoute = state.screen.spacesRoute;
    const centralEventEmitter = state.eventEmitter.centralEventEmitter;
   
    return {
        goBackRoute: spacesRoute,
        centralEventEmitter: centralEventEmitter,
    };
}

export default connect(mapStateToProps)(SpaceCreated);