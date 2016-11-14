import React, { Component } from "react";
import { AppRegistry } from "react-native";
import App from './app';

export default class codepush01 extends Component {
  render(){
    return(
      <App />
    );
  }
}

AppRegistry.registerComponent("codepush01", () => codepush01);
