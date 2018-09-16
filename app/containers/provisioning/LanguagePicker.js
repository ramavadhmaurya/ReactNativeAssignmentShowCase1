import React from 'react'
import {Button, ListView, StyleSheet, Text, View, FlatList, TouchableHighlight } from 'react-native'
import { List, ListItem, Icon, CheckBox } from 'react-native-elements'

export default class LanguagePicker extends React.Component {

    constructor(props) {
        super(props);
        this.renderSeparator = this.renderSeparator.bind(this)
    }

    renderSeparator() {
        alert("Called")
        return (
          <View
            style={{
              height: 1,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
              
            }}
          />
        );
    };

    render() {
        return (
            <FlatList
            data={this.props.languages}
            //ItemSeparatorComponent={this.renderSeparator}
            
            renderItem={({ item, i }) => (
                <View style={pickerStyle.itemContainer}>
                    <TouchableHighlight style={pickerStyle.itemTouchableStyle} underlayColor="#c8c8c8"
                    onPress={() => this.props.selectedLanguage(item)}
                    >
                    <Text style={pickerStyle.itemTextStyle}>{item}</Text>
                    </TouchableHighlight>
                </View>
            )} 
            keyExtractor={item => item}
            initialNumToRender={10}
            extraData={this.state}
          />
        )
    }
}

const pickerStyle = StyleSheet.create({
    
        itemContainer: {
            minHeight:45, 
            justifyContent:"center"
        },
        itemTouchableStyle: {
            height:45, 
            justifyContent:"center"
        },
        itemTextStyle: {
            minHeight:25, 
            paddingLeft:30, 
            paddingRight:5
        }

    });
    