import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef, Component } from 'react';
import { Text, View, Button, Platform, BackHandler } from 'react-native';
import * as Print from 'expo-print';
import { WebView } from 'react-native-webview';

import NetInfo from '@react-native-community/netinfo';

import firebase from 'firebase/app'

import Main from './Main';



BackHandler.addEventListener('hardwareBackPress', function() {
  BackHandler.exitApp();
});


class App extends React.Component {

  constructor(props) {
    super(props);
    conexión: false
  }

  state = {
    isReady: false,
    conexión: false
  };

  

  /* UNSAFE_componentWillMount() {
    console.log('componentWillMount called.');
   
  }

  shouldComponentUpdate() {
    console.log('componentWillUpdate called.');
  }

  componentWillUnmount(){
  
  }

  componentDidMount(){
    console.log("se montó")
  } */

 
  
  render(){
    
    return <Main />;
  }
}

export default App;