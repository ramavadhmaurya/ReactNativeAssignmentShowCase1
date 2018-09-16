import React from 'react'
import { ActivityIndicator, Dimensions, TouchableOpacity,
   Modal, Button, ListView, StyleSheet, Text, TextInput, 
   View, ScrollView, Alert, Platform, FlatList, BackHandler, 
   TouchableHighlight, Image } from 'react-native'
import { List, ListItem, Icon, CheckBox } from 'react-native-elements'
var wifi = require('react-native-android-wifi')
import { ProgressDialog } from 'react-native-simple-dialogs';
import prompt from 'react-native-prompt-android';
import PTRView from 'react-native-pull-to-refresh';
import TimerMixin from 'react-timer-mixin';
import SystemSetting from 'react-native-system-setting'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import Constants from '../../../utils/constants';
import ConfigurationTab from '../../../containers/ConfigurationTab'
import translator from '../../../utils/translations'
import {windowHeight, showOvalImage} from '../../../utils/utils'

let ovalImageHeight =  Dimensions.get("window").width * 1.34;

var dataArray = []
var filtered_data = []
var jSONString = new String()
var count = 0;
export default class IRBlasterAddGateway extends React.Component {
  that = ''
  refreshToPullList(resolve) {
    //that.scannedSimplifiWifiList()
    that.setState(
      {
        data: [],
      })
    // check GPS Location from android
    SystemSetting.isLocationEnabled().then((enable) => {
      if(enable) {
        that.wifiListRequest()
      }
      else {
        //alert("Make sure your GPS location is on from device setting")
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
        .then(data => {
          that.wifiListRequest()
        }).catch(err => {
          
        });
      }
    })
  //that.wifiListRequest()

    setTimeout(() => {
      resolve();
    }, 3000);
  }
  constructor(props) {
    super(props);
    that = this
    this.state =
      {
        data: [],
        wifiArray: [],
        dataArray: [],
        title: '',
        promptTitle: '',
        iconName: null,
        selectedIndex: -1,
        selectedWifiItem: '',
        selectedWifiArray: '',
        onPressView: false,
        modalVisible: false,
        alertTitle: '',
        alertMessage: '',
      };
      this.androidEventHandler = this.androidEventHandler.bind(this)
      this.wifiListRequest = this.wifiListRequest.bind(this)
  }
  //openProgress() {
  // this.setState({ showProgress: true })
  //}
  responseCallBack = function (data, success) {
  }
  authenticateWifi(password) {
    this.setState(
      {

        modalVisible: true,
        alertTitle: 'Connecting',
        alertMessage: 'Connecting your IR Blaster device',
      }
    )
    SSID = selectedWifi.SSID
    this.connectSelectedWifi(SSID, password)

  }

  selectedList(item, wifiArray) {
    selectedWifi = item
    dataArray = wifiArray
    this.authenticateWifi("None")
  }


  itemTapped(item, wifiArray) {

    index = this.state.data.indexOf(item)
    this.setState({
      selectedIndex: index,
      selectedWifiItem: item,
      selectedWifiArray: wifiArray,
      onPressView: true
    })



  }

  connectSelectedWifi(SSID, password) {
    wifi.findAndConnect(SSID, password, (found) => {
      if (found) {

        count = 0;
        this.checkWiFiStatus(SSID);

      } else {
        this.setState(
          {
            modalVisible: false,
            alertTitle: '',
            alertMessage: '',
          }
        )
        alert("Cannot connect to your IR Blaster device. Please make sure your IR Blaster device is in range and running.");
      }
    });
  }

  checkWiFiStatus(SSID) {
    setTimeout(function () {
      count = count + 1;
      //alert(count);
      wifi.connectionStatus((isConnected) => {
        var connectedSSID = '';

        if (isConnected) {
          //alert("connected");
          wifi.getSSID((ssid) => {
            console.log(ssid);
            connectedSSID = ssid;
            //alert(connectedSSID)
            if (SSID === connectedSSID) {
              console.log("is connected");
              that.setState(
                {
                  modalVisible: false,
                  alertTitle: '',
                  alertMessage: '',
                }
              )
              //that.props.navigation.navigate('selectAp');
              that.props.navigation.navigate('IRBlasterPhoneConnected');
            } else {
              that.setState(
                {
                  modalVisible: false,
                  alertTitle: '',
                  alertMessage: '',
                }
              )
              console.log("is not connected");
              alert("Cannot connect to your IR Blaster device. Please make sure your IR Blaster device is in range and running.");

            }
          });

        } else {
          if (count <= 5) {
            this.checkWiFiStatus(SSID);
          } else {
            that.setState(
              {
                modalVisible: false,
                alertTitle: '',
                alertMessage: '',
              }
            )
            console.log("is not connected");
            alert("Cannot connect to your IR Blaster device. Please make sure your IR Blaster device is in range and running.");
          }
        }
      });

    }.bind(this), 2 * 1000);
  }

  scannedSimplifiWifiList() {
    wifi.reScanAndLoadWifiList((wifiStringList) => {

      var wifiArray = JSON.parse(wifiStringList);

      filtered_data = wifiArray.filter((single_ap) => {
        if (single_ap['SSID'].indexOf("SimplifiBlaster") > -1) {
          return true;
        } else {
          return false;
        }
      })
      this.setState(
        {
          data: filtered_data,
          wifiArray: wifiArray,
          modalVisible: false,
          alertTitle: '',
          alertMessage: '',

        }
      )
    },
      (error) => {
        alert(error);
      }
    );
  }

  wifiListRequest() {
    this.setState(
      {
        onPressView:false,
        modalVisible: true,
        alertTitle: 'Fetching IR Blaster devices',
        alertMessage: 'Please Wait..',
      }
    )
    wifi.isEnabled((isEnabled) => {
      if (isEnabled) {
        this.scannedSimplifiWifiList()
      } else {
        wifi.setEnabled(true);
        this.scannedSimplifiWifiList()
      }
    });

  }
// Android back button handler start
  androidBackButtonAddEventListener() {
    BackHandler.addEventListener('hardwareBackPress', this.androidEventHandler)
  }
  androidEventHandler() {
    if (this.props.navigation.state.routeName === 'IRBlasterAddGateway') {
      this.props.navigation.goBack(null)
      return true
    }
  }
 // Android back button handler end

  componentWillMount() {
    this.androidBackButtonAddEventListener()
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.androidEventHandler);
  }

  componentDidMount() {
    //this.wifiListRequest()
    // check GPS Location from android
    SystemSetting.isLocationEnabled().then((enable) => {
      if(enable) {
        //that.wifiListRequest()
        this.wifiListRequest()
      }
      else {
        //alert("Make sure your GPS location is on from device setting")
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
        .then(data => {
          //that.wifiListRequest()
          this.wifiListRequest()
        }).catch(err => {
          
        });
      }
    })

  }

  getWifiListItemStyle(item) {
    return {
      height:60,
      backgroundColor: item === this.state.selectedWifiItem ? "#e4e4e4":Constants.ThemeColors.appBGColor
    }
  }

  flatListViewWithData() {
    return <View style={{height:windowHeight() > 550 ?   350 : 300}}><PTRView onRefresh={this.refreshToPullList} style={{ paddingBottom: 60 }}>
      <FlatList
        data={this.state.data}
        renderItem={({ item, i }) => (
          <View style={ this.getWifiListItemStyle(item)}>
              <TouchableHighlight underlayColor="#F2F2F2" onPress={() =>
                  this.itemTapped(item, this.state.wifiArray)
              }>
                <View style={{flexDirection: "row", justifyContent: "space-between", height: 50, paddingBottom: 5}}>
                <View style={{flexDirection:"row", }}>

                  <Text style={{color: "#666666", paddingTop: 15, paddingLeft:23}}>{item.SSID}</Text>
                  </View>
                  <View style={{
                      paddingTop: 15,
                      flexDirection: 'row',
                      alignContent: "flex-end"
                  }}>
                      <View style={{ paddingRight: 15 }}>
                          <Icon name='wifi' type='font-awesome' color='#7F7F7F' size={18} />
                      </View>
                  </View>
                  </View>
              </TouchableHighlight>
          </View>
        )}
        keyExtractor={item => item.SSID}
        initialNumToRender={10}
        extraData={this.state}
      />
    </PTRView></View>;
  }

  flatListView() {
    if (filtered_data.length > 0) {
      return this.flatListViewWithData()
    } else {
      return <View style={{height:250}}><PTRView onRefresh={this.refreshToPullList}>
        <Text style={styles.textEmptyList}> No IR Blaster device found. Please switch on your IR Blaster device and turn on hotspot.</Text>
      </PTRView></View>;
    }
  }

  onPressView() {
    
    if (this.state.onPressView === false) {
      return <TouchableOpacity
          onPress={() => alert("Please select a IR Blaster device to connect")}
          style={styles.buttonStyle}
          underlayColor="#F2F2F2">
          <View style={{backgroundColor:"transparent", width:160, height:76}}>
            <Image style={{width:160, height:76}} source={require('../../../resources/gfx_btn_2.png')} />
            <Text style={styles.textStyle}>{translator.t("simplifiRegistrationContinueButton")}</Text>
          </View>
        </TouchableOpacity>
    
    }
    else {
      return <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => 
            
            wifi.getSSID((ssid) => {
              if(ssid === this.state.selectedWifiItem.SSID) {
                this.props.navigation.navigate("IRBlasterSelectAp")
              }
              else {
                this.selectedList(this.state.selectedWifiItem, this.state.selectedWifiArray)
              }
            })
          }
            
          underlayColor="#F2F2F2">
          <View style={{backgroundColor:"transparent", width:160, height:76}}>
            <Image style={{width:160, height:76}} source={require('../../../resources/gfx_btn_2.png')} />
            <Text style={styles.textStyle}>{translator.t("simplifiRegistrationContinueButton")}</Text>
          </View>
        </TouchableOpacity>
    }
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

  render() {

    return (
      <View style={styles.container}>     
        {renderIf(showOvalImage(), 
        <Image style={{position:"absolute", height:ovalImageHeight, width:Dimensions.get("window").width}} source={require('../../../resources/bg_oval_png_468.png')}/>)}
        
             
        {this.progressDialogView()}

        <Text style={{marginLeft:23, marginTop:20, marginBottom:20, color: "gray", fontSize: 17 }}>Select your IR Blaster Wi-Fi network</Text>
        
        {this.flatListView()}
        {this.onPressView()}

      </View>
    )
  }
}

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return <View>
      <View style={{ paddingLeft: 10, paddingVertical: 10 }}>
        <Icon name={null} type='font-awesome' color='gray' size={18} />
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.ThemeColors.appBGColor,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textEmptyList: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 18,
    margin: 10,
  },
  submitHide: {
    paddingTop:7,
    height: 35,
    width: 200,
    backgroundColor: "#666666",
    overflow: "hidden",
  },
  submit: {
    paddingTop:7,
    height: 35,
    width: 200,
    backgroundColor: "#666666",
    overflow: "hidden",
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    height:25
  },
  submitContainer: {
    height: 35,
    alignSelf:"center",
    justifyContent:"center"
  },
  header: {
    paddingLeft: 10,
    paddingTop: 9,
    backgroundColor: Constants.ThemeColors.appBGColor,
    color: Constants.ThemeColors.buttonDarkGray,
    height: 40,
    fontSize: 16,
    fontWeight: "500"
  },
  header2: {
    paddingLeft: 10,
    paddingTop: 9,
    backgroundColor: Constants.ThemeColors.appBGColor,
    color: Constants.ThemeColors.buttonLightGray,
    height: 50,
    fontSize: 16,
    fontWeight: "500"
  },
  buttonStyle: {
    top: ovalImageHeight - (showOvalImage() ? 50 : 130),
    alignSelf: "center",
    alignItems: "center",
    position:"absolute"
  },
  textStyle: {
    position:"absolute",
    fontFamily:Constants.Fonts.themeFontBold,
    fontSize: 14.7,
    color: "white",
    textAlign:"center",
    width:"100%",
    height:20,
    top:20
  },
})