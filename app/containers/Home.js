import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    View,
    StyleSheet
} from 'react-native';

export default class Home extends Component {
    constructor(props) {
        super(props)
        
    }

    render() {
        return (
            <ScrollView style={styles.mainContainerStyle}>
                <View style={{alignItems:'center'}}>
                    <Text>This is Home</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainerStyle:{
        flex:1,
        backgroundColor:"#F9F9F9",
    },
})