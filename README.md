# 🔔 version-rocket 🚀

English | [简体中文](./README.zh-CN.md)

Notify users when a new version of your site is available and prompt them to refresh the page.
When you finish deploying your app, send a deployment message to Lark Group Chat

## About

**version-rocket** checks the version in the user's current browser against the version file in the remote server.

If a new version is available, a new version update prompt will be displayed to and the user will be given an operation button to refresh the page. Alternatively, **version-rocket** can notify you by receiving a callback function to support custom user interface.

We use the **Web Worker API** based on javascript to do the polling loop, will not affect the browser rendering process.

## Features

- Compatible with all modern browsers
- The version prompt interface supports customization, and the content of the deployment message card can be customized.
- Available version real-time monitoring
- Synchronize deployment message to Lark group chat after successful deployment.
- [Npm package support](https://www.npmjs.com/package/version-rocket)

## Screenshots

- The **first picture** prompts user to refresh the page.
- The **second picture** shows that after the successful deployment of the project, the deployment message will be sent to the group chat to inform the team members.
- The **third picture** @All with optional settings based on second picture

<img src="https://github.com/guMcrey/version-rocket/blob/main/assets/available-version-tips.gif?raw=true" />
<img src="https://github.com/guMcrey/version-rocket/blob/main/assets/deploy-success-message.jpg?raw=true" />
<img src="https://github.com/guMcrey/version-rocket/blob/main/assets/deploy-success-message-with-all.jpg?raw=true" />

## Usage

### Install
```shell
npm install version-rocket -S
```

### Get Started

```javascript

// 1. Import version-rocket, and invoke pollingCompareVersion method
import { pollingCompareVersion } from 'version-rocket'
import { version } from '../package.json'

/**
 * @param 1: current version
 * @param 2: remote server version.json file path
 * @param 3: time interval of rotation monitoring (in ms), default 5000ms
 * @param 4: custom version tip ui callback(optional)
 */
pollingCompareVersion(version, `${location.origin}/version.json`, 30000, (data) => {
    console.log(data)
})

```

```javascript

/**
 * 2.
 * generate-version-file shortcut command to create the version.json file.
 * The parameter is the directory where you want to create version.json.
 * If you don't pass the parameter, it will be created in the dist directory by default.
*/ 

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "generate:version": "generate-version-file dist public"
    ...
  },
  ...
}

```

#### If you want to push the successful deployment message to the group chat where lark Robot is located, please continue.

```javascript 

/**
 * 3.
 * You need to create a send-lark-config.json file first, it store the field for setting the copy for the message card. 
 * Then, you can just execute the send-lark-message shortcut command. By default, the send-lark-config.json file in the current path is selected.
 * MESSAGE_PATH optional: If you want to customize the file path and file name, you can set the MESSAGE_PATH parameter to pass it in.
 * PACKAGE_JSON_PATH optional: If you want to customize the path to the package.json file, you can do so by passing in the PACKAGE_JSON_PATH environment variable. We will get the package.json file from the root path by default
*/

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "send-lark-message:test": "MESSAGE_PATH=./lark-message-config.json PACKAGE_JSON_PATH=./packages/test/package.json send-lark-message"
    ...
  },
  ...
}


// send-lark-config.json example
{
    // card title
    "title": "TEST FE Deployed Successfully",
    // deploy project name
    "projectName": "TEST",
    // deploy branch name
    "branch": "Staging",
    // project url
    "accessUrl": "https://test.com",
    // remind group chat members: true/false
    "isNotifyAll": true,
    // lark robot webhook url
    "larkWebHook": "https://open.larksuite.com/open-apis/bot/v2/hook/xxxxxxxxxxxx",
    // deploy type
    "deployTools": "Jenkins",
    // the deploy time zone that you want to display, default "Asia/Shanghai"
    "expectConvertToTimezone": "America/New_York"
}

```

## Link
- [Timezone List](https://jp.cybozu.help/general/zh/admin/list_systemadmin/list_localization/timezone.html)





