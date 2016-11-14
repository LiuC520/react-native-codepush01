import React, { Component } from "react";
import {
  AppRegistry,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CodePush from "react-native-code-push";


// @CodePush({ checkFrequency: CodePush.CheckFrequency.MANUAL })
//在 项目文件夹下面创建一个文件夹bundles，代码创建：mkdir bundles;
//打包文件的代码 ：react-native bundle --platform android --entry-file index.android.js --bundle-output ./bundles/index.android.bundle --assets-dest ./bundles --dev false
    //其中platform是平台，分android和ios, entry-file是入口文件，ios的为index.ios.js，output为打包文件的路径，如果是苹果是./bundles/index.ios.bundle --assets-dest ./bundles --dev false
//上传文件到codepush：code-push release codepush01 ./bundles 1.0.3 --deploymentName Staging --description "第8次更新" --mandatory false
//code-push release <应用名称> <Bundles所在目录> <对应的应用版本> --deploymentName： 更新环境 --description： 更新描述  --mandatory： 是否强制更新
//更新环境默认为Staging,如果是发布生产的话是Production ，描述为在codepush上的更新描述，强制更新默认是false，为了友好，还是默认不强制更新
let codePushOptions = { checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME };

export default class App extends Component {
  constructor() {
    super();
    this.state = { restartAllowed: true };
  }

  codePushStatusDidChange(syncStatus) {
    switch(syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({ syncMessage: "检查更新." });
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({ syncMessage: "下载安装包." });
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({ syncMessage: "等待用户的操作." });
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ syncMessage: "安装更新." });
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({ syncMessage: "APP已更新", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({ syncMessage: "更新被打断.", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({ syncMessage: "更新已安装需要重启.", progress: false });
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({ syncMessage: "未知错误.", progress: false });
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    this.setState({ progress });
  }

  toggleAllowRestart() {
    this.state.restartAllowed
      ? CodePush.disallowRestart()
      : CodePush.allowRestart();

    this.setState({ restartAllowed: !this.state.restartAllowed });
  }

  getUpdateMetadata() {
    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
      .then((metadata: LocalPackage) => {
        this.setState({ syncMessage: metadata ? JSON.stringify(metadata) : "Running binary version", progress: false });
      }, (error: any) => {
        this.setState({ syncMessage: "Error: " + error, progress: false });
      });
  }

  /** Update is downloaded silently, and applied on restart (recommended) */
  sync() {
    CodePush.sync(
      {},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

  /** Update pops a confirmation dialog, and then immediately reboots the app */
  syncImmediate() {
    CodePush.sync(
      {
        installMode: CodePush.InstallMode.IMMEDIATE,//启动模式三种：ON_NEXT_RESUME、ON_NEXT_RESTART、IMMEDIATE
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
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }

  render() {
    let progressView;

    if (this.state.progress) {
      progressView = (
        <Text style={styles.messages}>已接收 {this.state.progress.receivedBytes} of {this.state.progress.totalBytes} bytes</Text>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          第8次更新测试:添加资源
        </Text>
        <TouchableOpacity onPress={this.sync.bind(this)}>
          <Text style={styles.syncButton}>点击后台更新</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.syncImmediate.bind(this)}>
          <Text style={styles.syncButton}>点击立即更新</Text>
        </TouchableOpacity>
        {progressView}
        <Image style={styles.image} resizeMode={Image.resizeMode.contain} source={require("./images/laptop_phone_howitworks.png")}/>
        <TouchableOpacity onPress={this.toggleAllowRestart.bind(this)}>
          <Text style={styles.restartToggleButton}> { this.state.restartAllowed ? "允许" : "禁止"} 重启</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.getUpdateMetadata.bind(this)}>
          <Text style={styles.syncButton}>点击更新Metadata</Text>
        </TouchableOpacity>
        <Text style={styles.messages}>{this.state.syncMessage || ""}</Text>
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
    margin: 20
  },
});

App = CodePush(codePushOptions)(App);
