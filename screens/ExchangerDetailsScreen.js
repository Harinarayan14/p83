import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';

import db from '../config.js';

export default class ExchangerDetailsScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userId  : firebase.auth().currentUser.email,
      userName: "",
      exchangerId : this.props.navigation.getParam('details')["user_id"],
      exchangeId  : this.props.navigation.getParam('details')["exchange_id"],
      itemName: this.props.navigation.getParam('details')["item_name"],
      description  : this.props.navigation.getParam('details')["description"],
      exchangerName    : '',
      exchangerContact : '',
      exchangerAddress : '',
      exchangerDocId : ''
    }
  }



  getExchangerDetails(){
    db.collection('users').where('email_id','==',this.state.exchangerId).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        this.setState({
          exchangerName    : doc.data().first_name,
          exchangerContact : doc.data().contact,
          exchangerAddress : doc.data().address,
        })
      })
    });

    db.collection('exchanged_items').where('exchange_id','==',this.state.exchangeId).get()
    .then(snapshot=>{
      snapshot.forEach(doc => {
        this.setState({exchangeDocId:doc.id})
     })
  })}


  getUserDetails=(userId)=>{
    db.collection("users").where('email_id','==', userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({
          userName  :doc.data().first_name + " " + doc.data().last_name
        })
      })
    })
  }

  updateItemStatus=()=>{
    db.collection('all_exchanges').add({
      "item_name"           : this.state.itemName,
      "exchange_id"          : this.state.exchangeId,
      "exchanged_by"        : this.state.exchangerName,
      "exchanger_id"            : this.state.userId,
      "exchange_status"      :  "Exchanger Interested"
    })
  }


  addNotification=()=>{
    var message = this.state.userName + " has shown interest in exchanging the item"
    db.collection("all_notifications").add({
      "targeted_user_id"    : this.state.exchangerId,
      "exchanger_id"            : this.state.userId,
      "exchange_id"          : this.state.exchangeId,
      "item_name"           : this.state.itemName,
      "date"                : firebase.firestore.FieldValue.serverTimestamp(),
      "notification_status" : "unread",
      "message"             : message
    })
  }



  componentDidMount(){
    this.getExchangerDetails()
    this.getUserDetails(this.state.userId)
  }


    render(){
      return(
        <View style={styles.container}>
          <View style={{flex:0.1}}>
            <Header
              leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
              centerComponent={{ text:"Exchange Items", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
              backgroundColor = "#eaf8fe"
            />
          </View>
          <View style={{flex:0.3}}>
            <Card
                title={"Item Information"}
                titleStyle= {{fontSize : 20}}
              >
              <Card >
                <Text style={{fontWeight:'bold'}}>Name : {this.state.itemName}</Text>
              </Card>
              <Card>
                <Text style={{fontWeight:'bold'}}>Description : {this.state.description}</Text>
              </Card>
            </Card>
          </View>
          <View style={{flex:0.3}}>
            <Card
              title={"Exchanger Information"}
              titleStyle= {{fontSize : 20}}
              >
              <Card>
                <Text style={{fontWeight:'bold'}}>Name: {this.state.exchangerName}</Text>
              </Card>
              <Card>
                <Text style={{fontWeight:'bold'}}>Contact: {this.state.exchangerContact}</Text>
              </Card>
              <Card>
                <Text style={{fontWeight:'bold'}}>Address: {this.state.exchangerAddress}</Text>
              </Card>
            </Card>
          </View>
          <View style={styles.buttonContainer}>
            {
              this.state.exchangerId !== this.state.userId
              ?(
                <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{
                      this.updateItemStatus()
                      this.addNotification()
                      this.props.navigation.navigate('MyExchanges')
                    }}>
                  <Text>I want to Exchange</Text>
                </TouchableOpacity>
              )
              : null
            }
          </View>
        </View>
      )
    }

}


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})
