import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef, Component } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Print from 'expo-print';
import { WebView } from 'react-native-webview';

import NetInfo from '@react-native-community/netinfo';

var webview;

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

export default function App() {

    var state = {
        conexión: false
      };

      NetInfo.fetch().then(state => {
        /*   console.log('Connection type', state.type);
          console.log('Is connected?', state.isConnected); */
    
          /* if(state.isConnected==false){
            
            //navigation.navigate('Home')
            //this.props.navigation.navigate('Home')
          
          }else{
            this.props.navigation.navigate('offline')
          } */
      
        });
    
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
  
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => {
        setExpoPushToken(token)
        registrarTokenPushNotifications(token)
      });
  
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

      
      return (
        
        <WebView
  
        ref={ref => (webview = ref)}
        source={{
          uri: 'http://10.10.10.211:80/'
        }}
        onError={error => errorPage(error)}
        bounces={false}
        /* onLoadStart={() => entro()} */
        onShouldStartLoadWithRequest={() => true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode='always'
        startInLoadingState={true}
        /* onMessage={mssage => handleMessage(mssage, this.props.navigation)} */
        /* renderError={error => errorPage(this.props)} */
  
  
        style={{ flex:1,marginTop: 0 }} />
      );
    
  }

  function onError(error){
    console.log("hubo un error")
  }

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    };
  
    await fetch('http://10.10.10.211:80/api/message', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  
    /* await fetch('http://10.10.10.211:80/agr.js', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      }
    }); */
  
    /* await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }); */
  }
  
  async function registrarTokenPushNotifications(expoPushToken) {
    var tok = { token: expoPushToken }
  
    await fetch('http://10.10.10.211:80/api/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tok),
    });
  
  
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
    let token2;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted' || Platform.OS === 'android') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      //token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log(token);
  
      /* alert(token) */
      var tok = { token: token }
  
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }
  
  async function imprimir() {
    const print = await Print.printAsync({
      html: `
        <image style="width: 100px;heigth:100px" src="data:image/jpeg;base64,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"></image>
          <html>
           <h2>Prueba</h2>
           <table style="width:100%">
    <tr>
      <th>Firstname</th>
      <th>Lastname</th>
      <th>Age</th>
    </tr>
    <tr>
      <td>Jill</td>
      <td>Smith</td>
      <td>50</td>
    </tr>
    <tr>
      <td>Eve</td>
      <td>Jackson</td>
      <td>94</td>
    </tr>
  </table>
          </html>
        `,
    });
  
  }
  
  
  /* <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
           <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
          title="Envia notificación"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        />
        <Button
          title="Registrar token notificación"
          onPress={async () => {
            await registrarTokenPushNotifications(expoPushToken);
          }}
        />
  
        <Button
          title="Imprimir"
          onPress={async () => {
            await imprimir();
          }}
        />
  
      </View> */
  