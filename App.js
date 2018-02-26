import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Image, Alert, StatusBar, Picker, PickerIOS } from 'react-native';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { data: '', currency: '', amout: null, rates: [] };
    }

    componentDidMount() {
        const url = 'http://api.fixer.io/latest';

        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ rates: Object.keys(responseJson.rates) });
            })
            .catch((error) => {
                Alert.alert(error);
            });
    }

    getRates = () => {

        const url = 'http://api.fixer.io/latest?base=' + this.state.currency + '&symbols=' + 'EUR';

        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {

                let data = [];
                let rates = responseJson.rates;

                for (let rate in rates) {
                    let temp = {};
                    temp['currency'] = rate;
                    temp['value'] = rates[rate];

                    data.push(temp);
                }

                this.setState({ data: data });
                console.log(data);

            })
            .catch((error) => {
                Alert.alert(error);
            });
    }

    listSeparator = () => {

        return (

            <View
                style={{
                    height: 1,
                    width: "80%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "10%"
                }}
            />
        );
    };

    render() {
        const pickerItems = this.state.rates.map((item, index) => <Picker.Item key={index} label={item} value={item} />);
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                <FlatList
                    style={{ marginLeft: "5%", height: 100 }}
                    keyExtractor={item => item.index}
                    renderItem={({ item }) =>

                        <Text style={{ fontSize: 18, marginTop: 200 }}> {(parseFloat(item.value) * parseFloat(this.state.amount)).toFixed(2)} {item.currency}</Text>

                    } data={this.state.data}
                    ItemSeparatorComponent={this.listSeparator} />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                    <TextInput style={{ fontSize: 18 }} placeholder='amount'
                        onChangeText={(amount) => this.setState({ amount })} />

                    <Picker style={{ width: 140, height: 200 }} selectedValue={this.state.currency}
                        onValueChange={(value) => this.setState({ currency: value })}>
                        {pickerItems}
                    </Picker>

                    <Button style={{ fontSize: 18, marginTop: 300 }} title="Convert" onPress={this.getRates} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

    },

});