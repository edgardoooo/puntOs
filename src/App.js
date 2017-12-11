import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import firebase from 'firebase';
import Router from './Router';

class App extends Component {
  componentWillMount() {
    const config = {
      apiKey: "AIzaSyDxE1Bw8qQ3aOgJRxTiR88wPGTAyYOsn4Y",
      authDomain: "puntos-capstone2017.firebaseapp.com",
      databaseURL: "https://puntos-capstone2017.firebaseio.com",
      projectId: "puntos-capstone2017",
      storageBucket: "puntos-capstone2017.appspot.com",
      messagingSenderId: "388873118722"
    };
    firebase.initializeApp(config);
  }
  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <Router />
      </Provider>
    );
  }
}

export default App;
