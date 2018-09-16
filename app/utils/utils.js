import React from 'react';
import {Image, Platform, NetInfo, Alert, AsyncStorage, Dimensions} from 'react-native'
import TimerMixin from 'react-timer-mixin';
import translations from '../utils/translations'
import Constants from './constants'

var isNetworkConnected = false;


export function windowHeight() {
    let size = Dimensions.get('window').height;
    return size;
}
export function windowWidth() {
    let size = Dimensions.get('window').width;
    return size;
}

export function isPlatFormAndroid() {
    return Platform.OS === "android"
}

export function isPlatFormIOS() {
    return Platform.OS === "ios"
}

function observeNetworkConnectivity() {

    console.log("Network observer initialized...") 
    NetInfo.isConnected.fetch().then(isConnected => {        
        isNetworkConnected = isConnected      
        console.log("Network Connected: " + isNetworkConnected) 
    });
        
    NetInfo.isConnected.addEventListener('connectionChange', (connectionInfo) => {

        console.log("Network connection changed") 
        NetInfo.isConnected.fetch().then(isConnected => {        
            isNetworkConnected = isConnected    
            console.log("Network Connected: " + isNetworkConnected)     
        });
    })
}

observeNetworkConnectivity()

export function connectedToNetwork() {
    return isNetworkConnected
}

export function showRetryAlert(title, message, retryButtonTitle, retryCallback) {

    TimerMixin.setTimeout(() => {
        Alert.alert(
            title,
            message,
            [
              {text: (retryButtonTitle === undefined || retryButtonTitle === '')? translations.t("tryAgain") : retryButtonTitle, onPress: retryCallback},
            ],
            { cancelable: true }
          )
    }, 500);
}

export function showRetryCloseAlert(title, message, retryButtonTitle, retryCallback , closeCallback) {

    TimerMixin.setTimeout(() => {
        Alert.alert(
            title,
            message,
            [
              {text: (retryButtonTitle === undefined || retryButtonTitle === '')? translations.t("tryAgain") : retryButtonTitle, onPress: retryCallback},
              {text: "Close", onPress: closeCallback},
            ],
            { cancelable: false }
          )
    }, 500);
}

export function showConfirmationAlert(title, message, okButtonTitle, cancelButtonTitle, okCallBack) {
        TimerMixin.setTimeout(() => {
            Alert.alert(
                title,
                message,
                [
                  {text: (okButtonTitle === undefined || okButtonTitle === '')? translations.t("okButtonTitle") : okButtonTitle, onPress: okCallBack},
                  {text: (cancelButtonTitle === undefined || cancelButtonTitle === '')? translations.t("cancelButtonTitle") : cancelButtonTitle},
                ],
                { cancelable: true }
              )
        }, 200);
    }
export function showTwoOptionsAlert(title, message, option1Title, option2Title, option1Callback, option2Callback) {
        TimerMixin.setTimeout(() => {
            Alert.alert(
                title,
                message,
                [
                  {text: option1Title, onPress: option1Callback},
                  {text: option2Title, onPress: option2Callback},
                  {text: "Cancel"},
                ],
                { cancelable: true }
              )
        }, 200);
}


export function screenAspectRatio() {

    return Dimensions.get("window").height / Dimensions.get("window").width
}

