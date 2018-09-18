import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    FlatList,
    StyleSheet
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            appliances: require("../resources/docs/appliances.json"),
            CompanyNameJson: undefined,
            DescriptionJson: undefined,
            EmailSubscriptionJson: undefined,
            WeatherJson: undefined,
            companyName:'',
            companyDescription:'',
            isEmailSubscription: true,

        }
        this.dynamicJsonHandeling = this.dynamicJsonHandeling.bind(this)
    }

    dynamicJsonHandeling() {
        for(let i=0; i < this.state.appliances.Fields.length; i++) {
            switch (this.state.appliances.Fields[i].ColumnType) {
                case "Text":
                      this.setState({
                        CompanyNameJson: this.state.appliances.Fields[i]
                      })
                      break
                case "Text Area":
                      this.setState({
                        DescriptionJson: this.state.appliances.Fields[i]
                      })
                      break
                case "Radio":
                      this.setState({
                        EmailSubscriptionJson: this.state.appliances.Fields[i]
                      })
                      break
                case "List":
                      this.setState({
                        WeatherJson: this.state.appliances.Fields[i]
                      })
                      break
                
              }
        }
    }

    emailSubscriptionFlag() {
        if(this.state.isEmailSubscription) {
            this.setState({
                isEmailSubscription: !this.state.isEmailSubscription
            })
        } else {
            this.setState({
                isEmailSubscription: !this.state.isEmailSubscription
            })
        }
    }

    weatherList = ({ item }) => (

        <TouchableHighlight
            underlayColor='#c2c2c2'
            onPress={() =>
                alert("List Item pressed")
            }
            backgroundColor='gray'
        >
        <View >
            <View style={{ flex: 1, flexDirection: 'column', height: 60, justifyContent:"center" }}>
                <Text style={{ fontSize: 13.7, color: "#050505", fontWeight: 'bold', color: 'black' }}
                    numberOfLines={1}
                    ellipsizeMode='tail'>{item.Value}
                </Text>
            </View>
            <View style={{ height: 1, backgroundColor: "#acacac" }} />
        </View>
        </TouchableHighlight>
    );

    getGraySeparator() {
        return (<View style={{flex:1, }}>
        <Text style={{fontSize: 20, color: "black", fontWeight: 'bold',}}>:</Text>
        </View>)
    }

    CompanyNameView() {
        return (<View style={{ marginLeft:18, marginRight:18, height:50, alignItems:"center", flexDirection:"row", justifyContent:"space-between"}}>
            <View style={{height:50, flex:4.5, alignItems:"center", flexDirection:"row", }}>
                   <Text style={{ fontSize: 13, color: "black", fontWeight: 'bold',}}>{this.state.CompanyNameJson !== undefined ? this.state.CompanyNameJson.ColumnName : ''}</Text>
            </View>
            {this.getGraySeparator()}

            <TextInput defaultValue={this.state.configuredCloudIP} style={{ height:50, flex:6, borderWidth:0.5, paddingLeft:5, borderRadius:3, borderColor:"#c8c8c8", }} autoCapitalize="none" autoCorrect={false} placeholder={this.state.CompanyNameJson !== undefined ? this.state.CompanyNameJson.Caption : ''}
                        underlineColorAndroid="transparent" onChangeText={(text) => {  
                            // this.setState({
                            //     companyName: text
                            // })
                            this.state.companyName = text
            }} />
        </View>)
    }

    CompanyDescriptionView() {
        return (<View style={{ marginLeft:18, marginRight:18, height:150, alignItems:"center", flexDirection:"row", justifyContent:"space-between"}}>
            <View style={{height:50, flex:4.5, alignItems:"center", flexDirection:"row", }}>
                   <Text style={{ fontSize: 13, color: "black", fontWeight: 'bold',}}>{this.state.DescriptionJson !== undefined ? this.state.DescriptionJson.ColumnName : ''}</Text>
            </View>
            {this.getGraySeparator()}

            <TextInput defaultValue={this.state.configuredCloudIP} style={{ height:130, flex:6, borderWidth:0.5, paddingLeft:5, borderRadius:3, borderColor:"#c8c8c8", }} autoCapitalize="none" autoCorrect={false} placeholder={this.state.DescriptionJson !== undefined ? this.state.DescriptionJson.Caption : ''}
                        underlineColorAndroid="transparent"
                        multiline={true}
                        numberOfLines = {4} onChangeText={(text) => {  
                            // this.setState({
                            //     companyDescription: text
                            // })
                            this.state.companyDescription = text
            }} />
        </View>)
    }

    CompanyEmailSubscriptionView() {
        return (<View style={{ marginLeft:18, marginRight:18, height:50, alignItems:"center", flexDirection:"row", justifyContent:"space-between"}}>
            <View style={{height:50, flex:4.5, alignItems:"center", flexDirection:"row", }}>
                   <Text style={{ fontSize: 13, color: "black", fontWeight: 'bold',}}>{this.state.EmailSubscriptionJson !== undefined ? this.state.EmailSubscriptionJson.ColumnName : ''}</Text>
            </View>
            {this.getGraySeparator()}

            <View style={{flex:6, flexDirection: "row", alignItems: 'center', justifyContent: 'center', height: 50, borderWidth:0.5, borderRadius:3, borderColor:"#c8c8c8", }}>
                    <TouchableHighlight
                        style={{ alignItems: 'flex-start', marginLeft: 65, marginRight: 10, backgroundColor: '#ffffff' }}
                        onPress={() =>
                            this.emailSubscriptionFlag()
                        }
                        underlayColor="#ffffff">
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                            <View style={styles.radioButtonOuter} >
                                {renderIf(this.state.isEmailSubscription === true,
                                    <LinearGradient start={{ x: 0, y: 1 }}
                                        end={{ x: 1, y: 1 }} colors={['#9a57ec', '#4d81ee']} style={styles.radioButtonInner}>
                                    </LinearGradient>
                                )}

                            </View>
                            <Text style={{ marginLeft: 10, }}>{this.state.EmailSubscriptionJson !== undefined ? this.state.EmailSubscriptionJson.ListValues[0].Value : ''}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{ alignItems: 'flex-start', marginLeft: 10, marginRight: 65, backgroundColor: '#ffffff' }}
                        onPress={() =>
                            this.emailSubscriptionFlag()
                        }
                        underlayColor="#ffffff">
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                            <View style={styles.radioButtonOuter} >
                                {renderIf(this.state.isEmailSubscription === false,
                                    <LinearGradient start={{ x: 0, y: 1 }}
                                        end={{ x: 1, y: 1 }} colors={['#9a57ec', '#4d81ee']} style={styles.radioButtonInner}>
                                    </LinearGradient>
                                )}
                            </View>
                            <Text style={{ marginLeft: 10 }}>{this.state.EmailSubscriptionJson !== undefined ? this.state.EmailSubscriptionJson.ListValues[1].Value : ''}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
        </View>)
    }

    CompanyWeatherView() {
        return (<View style={{ marginLeft:18, marginRight:18, height:200, alignItems:"center", flexDirection:"row", justifyContent:"space-between"}}>
            <View style={{height:50, flex:4.5, }}>
                   <Text style={{ fontSize: 13, color: "black", fontWeight: 'bold',}}>{this.state.WeatherJson !== undefined ? this.state.WeatherJson.ColumnName : ''}</Text>
            </View>
            {this.getGraySeparator()}

            <View style={{height:200, flex:6, borderWidth:0.5, paddingLeft:5, borderRadius:3, borderColor:"#c8c8c8", }}>
                <FlatList
                    onLayout={(event) =>
                        this.state.listTop = event.nativeEvent.layout.y
                    }
                    style={{zIndex:0}}
                    data={this.state.WeatherJson !== undefined ? this.state.WeatherJson.ListValues : []}
                    renderItem={this.weatherList}
                    keyExtractor={(item, index) => item.id}>
                </FlatList>
            </View>
        </View>)
    }


    componentDidMount() {
        this.dynamicJsonHandeling()    
    }



    render() {
        return (
            <ScrollView style={styles.mainContainerStyle}>
                {/* <View style={{alignItems:'center'}}>
                    <Text>This is Home</Text>
                </View> */}

                {this.CompanyNameView()}
                {this.CompanyDescriptionView()}
                {this.CompanyEmailSubscriptionView()}
                {this.CompanyWeatherView()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainerStyle:{
        flex:1,
        backgroundColor:"#F9F9F9",
    },
    radioButtonOuter: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: 20,
        height: 20,
        borderColor: 'gray',
        borderRadius: 15,
        borderWidth: 2,

    },

    radioButtonInner: {
        alignItems: 'center',
        width: 9,
        height: 9,
        borderRadius: 5,
    },
})

function renderIf(condition, content) {
    if (condition) {
        return content;
    } else {
        return null;
    }
}