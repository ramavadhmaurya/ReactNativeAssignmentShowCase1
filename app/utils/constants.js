import React from 'react';
import {
        AsyncStorage
    } from 'react-native';
  
export const enumSetUp = {
        ENUM1 : 0, 
        ENUM1: 1, 
        ENUM1: 2
}

const Constants = {

        NO_INTERNET_MESSAGE:"Internet connection appears to be offline. Please connect to the internet and try again.",
}

export function getAudioByPlayListId(playListId) {
        return "http://" + Constants.IP.MEDIA_SERVER + ":" + Constants.PORT.MEDIA_LIST_SERVER_PORT +"/media/getPlaylistById/"+playListId
        
}

export default Constants
