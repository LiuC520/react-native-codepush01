import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CodePush from "react-native-code-push";

// @CodePush({ checkFrequency: CodePush.CheckFrequency.MANUAL })
let codePushOptions = { checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME };

export default class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  /** Update is downloaded silently, and applied on restart (recommended) */
  sync() {
    CodePush.sync();
  }

  /** Update pops a confirmation dialog, and then immediately reboots the app */
  syncImmediate() {
    CodePush.sync(
      { installMode: CodePush.InstallMode.IMMEDIATE,//启动模式三种：ON_NEXT_RESUME、ON_NEXT_RESTART、IMMEDIATE
        updateDialog: {
          appendReleaseDescription:true,//是否显示更新description，默认为false
          descriptionPrefix:"更新内容：",//更新说明的前缀。 默认是” Description:
          mandatoryContinueButtonLabel:"立即更新",//强制更新的按钮文字，默认为continue
          mandatoryUpdateMessage:"",//- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
          optionalIgnoreButtonLabel: '稍后',//非强制更新时，取消按钮文字,默认是ignore
          optionalInstallButtonLabel: '后台更新',//非强制更新时，确认文字. Defaults to “Install”
          optionalUpdateMessage: '有新版本了，是否更新？',//非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
          title: '更新提示'//要显示的更新通知的标题. Defaults to “Update available”.
        },
      },
    );
  }

  componentWillMount(){
    CodePush.disallowRestart();//页面加载的禁止重启，在加载完了可以允许重启
  }

  componentDidMount(){
    CodePush.allowRestart();//在加载完了可以允许重启
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          第11次更新测试:更改下标题颜色
        </Text>
        <TouchableOpacity onPress={this.sync.bind(this)}>
          <Text style={styles.syncButton}>点击后台更新</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.syncImmediate.bind(this)}>
          <Text style={styles.syncButton}>点击立即更新</Text>
        </TouchableOpacity>
        {progressView}
        <Image style={styles.image} resizeMode={Image.resizeMode.contain} source={require("./images/laptop_phone_howitworks.png")}/>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    paddingTop: 50
  },
  image: {
    margin: 30,
    width: Dimensions.get("window").width - 100,
    height: 365 * (Dimensions.get("window").width - 100) / 651,
  },
  messages: {
    marginTop: 30,
    textAlign: "center",
  },
  restartToggleButton: {
    color: "blue",
    fontSize: 17
  },
  syncButton: {
    color: "green",
    fontSize: 17
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 20,
    color:'red'
  },
});

App = CodePush(codePushOptions)(App);
