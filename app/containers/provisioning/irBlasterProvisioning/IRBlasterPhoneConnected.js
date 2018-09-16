import {
    ScrollView, Text, TextInput, View, Button, StyleSheet, Image,
    TouchableHighlight, TouchableOpacity, Dimensions, AsyncStorage, Color, BackHandler, NativeEventEmitter, NativeModules, ActivityIndicator, Modal
} from 'react-native';
import { HeaderBackButton } from 'react-navigation'
import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import translator from './../../../utils/translations'
import Constants from '../../../utils/constants'
import ConfigurationTab from '../../../containers/ConfigurationTab'
import IRBlasterApi from './../../../lib/irBlasterTcp';
import {isPlatFormAndroid, getOvalImage, windowHeight} from '../../../utils/utils'
import renderIf from '../../renderIf'


export default class IRBlasterPhoneConnected extends Component {

    constructor(props) {
        super(props)
        this.state =
        {
          modalVisible: false,
          alertTitle: '',
          alertMessage: '',
          getDevicestatus: false,
        };
    }
    componentDidMount() {
        this.getDeviceTypeRequest()
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.ThemeColors.appBGColor }}>
            
                <View>
                    <View style={{alignItems: "center" }}>
                        <Text style={{ textAlign: "center", marginTop: 36, fontFamily:Constants.Fonts.themeFontLight, fontSize:16, marginLeft:50, marginRight:50 }}>{translator.t("irBlasterPhoneConnectedMessage")}</Text>
                        <Image
                            style={{ marginTop: 40, width: 140, height: 140 }}
                            source={require('../../../resources/gfx_ir_connected.png')} />
                    </View>
                    <Text style={{marginLeft:50, marginRight:50, textAlign: "center", marginTop: 20, color: "gray" }}>{translator.t("irBlasterPhoneConnectedDetailMessage")}</Text>
                    <View style={{marginTop: windowHeight() < 550 ? 30 : 90, overflow:"hidden"}}>
                        {getOvalImage()}
                    <TouchableOpacity

                    style={styles.buttonStyle}
                    onPress={()=> {
                        this.props.navigation.navigate("IRBlasterSelectAp")
                        // if (this.state.getDevicestatus === true) {
                        //     this.props.navigation.navigate("IRBlasterSelectAp")
                        // } else {
                        //     TimerMixin.setTimeout(() => {
                        //         alert("Your have not connected any IR Blaster, go back and reconnect with your IR Blaster")
                        //     }, 500)
                        // }
                    }}>
                    <View style={{backgroundColor:"transparent", width:160, height:76}}>
                        <Image style={{width:160, height:76}} source={require('../../../resources/gfx_btn_2.png')} />
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

    // Get Device API invoked

    getDeviceTypeRequest() {
        this.setState(
            {
              modalVisible: true,
              alertTitle: 'Getting Device Type',
              alertMessage: 'Please wait',
            }
        )
        console.log("Get Device Type request sent.")
        IRBlasterApi.getDeviceType((data, success) => {

            console.log("DEVICE TYPE RESPONSE: " + JSON.stringify(data))
            if (success === true) {
                var device = data["message"]["device"]
                
                device = (device === undefined) ? [] : device
                console.log("Get Device Type Response:" + JSON.stringify(data))
                console.log("FINAL GET DEVICE TYPE: " + device)  
                if (device === 'IRBlaster') { 
                    console.log("INSIDE IF - FINAL GET DEVICE TYPE: " + device)
                    this.setState(
                        {
                          modalVisible: false,
                          getDevicestatus: true,
                        }
                      )  
                    
                }
                else {
                    console.log("INSIDE ELSE - FINAL GET DEVICE TYPE: " + device)
                    this.setState(
                        {
                          modalVisible: false,
                        }
                      ) 
                    TimerMixin.setTimeout(() => {
                        alert("Your have not connected any IR Blaster, go back and reconnect with your IR Blaster")
                    }, 500)
    
                }
            }
            else {
                console.log("OUTER ELSE - FINAL GET DEVICE TYPE: " + success)
                this.setState(
                    {
                      modalVisible: false,
                    }
                  ) 
                TimerMixin.setTimeout(() => {
                    alert("Error occurred while getting IR Device type")
                }, 500)
            }
            console.log("End of block")
            
        })
    }

    closeModal() {
        this.setState({ modalVisible: false });
      }
    
      progressDialogView() {
        return <View>
          <Modal
            visible={this.state.modalVisible}
            animationType={'fade'}
            onRequestClose={() => this.closeModal()}
            transparent={true}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }} >
              <View style={{
                backgroundColor: '#fff',
                height: 210,
                width: 300,
              }}>
                <Text style={{ paddingTop: 20, paddingLeft: 20, fontWeight: 'bold', fontSize: 20 }}>{this.state.alertTitle}</Text>
    
                <View style={{ flex: 1, }}>
                  <View style={{ paddingTop: 30 }}>
    
                    <ActivityIndicator size="large" color={Constants.ThemeColors.buttonLightGray} />
    
                  </View>
                  <View style={{ flex: 1, paddingTop: 40, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16 }}>{this.state.alertMessage}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
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