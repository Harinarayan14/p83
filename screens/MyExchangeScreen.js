import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyExchangeScreen extends Component {
   constructor(){
     super()
     this.state = {
       exchangerId : firebase.auth().currentUser.email,
       exchangerName : "",
       allExchanges : []
     }
     this.exchangeRef= null
   }

   static navigationOptions = { header: null };

   getExchangerDetails=(exchangerId)=>{
     db.collection("users").where("email_id","==", exchangerId).get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         this.setState({
           "exchangerName" : doc.data().first_name + " " + doc.data().last_name
         })
       });
     })
   }

   getAllExchanges =()=>{
     this.exchangeRef = db.collection("all_exchanges").where("exchanger_id" ,'==', this.state.exchangerId)
     .onSnapshot((snapshot)=>{
       var allExchanges = []
       snapshot.docs.map((doc) =>{
         var exchange = doc.data()
         exchange["doc_id"] = doc.id
         allExchanges.push(exchange)
       });
       this.setState({
         allExchanges : allExchanges
       });
     })
   }

   sendItem=(itemDetails)=>{
     if(itemDetails.exchange_status === "Item Sent"){
       var exchangeStatus = "Exchanger Interested"
       db.collection("all_exchanges").doc(itemDetails.doc_id).update({
         "exchange_status" : "Exchanger Interested"
       })
       this.sendNotification(itemDetails,exchangeStatus)
     }
     else{
       var exchangeStatus = "Item Sent"
       db.collection("all_exchanges").doc(itemDetails.doc_id).update({
         "exchange_status" : "Item Sent"
       })
       this.sendNotification(itemDetails,exchangeStatus)
     }
   }

   sendNotification=(itemDetails,exchangeStatus)=>{
     var exchangeId = itemDetails.exchange_id
     var exchangerId = itemDetails.exchanger_id
     db.collection("all_notifications")
     .where("exchange_id","==", exchangeId)
     .where("exchanger_id","==",exchangerId)
     .get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         var message = ""
         if(exchangeStatus === "Item Sent"){
           message = this.state.exchangerName + " sent you item"
         }else{
            message =  this.state.exchangerName  + " has shown interest in donating the item"
         }
         db.collection("all_notifications").doc(doc.id).update({
           "message": message,
           "notification_status" : "unread",
           "date"                : firebase.firestore.FieldValue.serverTimestamp()
         })
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.item_name}
       subtitle={"Exchanged By : " + item.exchanged_by +"\nStatus : " + item.exchange_status}
       leftElement={<Icon name="item" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor : item.exchange_status === "Item Sent" ? "green" : "#ff5722"
              }
            ]}
            onPress = {()=>{
              this.sendItem(item)
            }}
           >
             <Text style={{color:'#ffff'}}>{
               item.exchange_status === "Item Sent" ? "Item Sent" : "Send Item"
             }</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getExchangerDetails(this.state.exchangerId)
     this.getAllExchanges()
   }

   componentWillUnmount(){
     this.exchangeRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Exchanges"/>
         <View style={{flex:1}}>
           {
             this.state.allExchanges.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all item Exchanges</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allExchanges}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})
