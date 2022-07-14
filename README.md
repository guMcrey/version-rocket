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
- Support personalized version hint pop-up copy and theme, also support custom UI
- Available version real-time monitoring.
- Synchronize deployment message to Lark group chat after successful deployment.
- The card copy of the deployment message supports customization.
- [Npm package support](https://www.npmjs.com/package/version-rocket)

## Screenshots

- The **first picture** prompts user to refresh the page.
- The **second picture** personalize the popup text and theme, great for when you need to customize the text and theme (optional).
- The **third picture** personalize the popup image, recommended for image customization needs (optional).
- The **fourth picture** shows that after the successful deployment of the project, the deployment message will be sent to the group chat to inform the team members.
- The **fifth picture** @All with optional settings based on second picture

<p align="center">
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/available-version-tips.gif?raw=true" width="410"/>
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/custom-themes.jpg?raw=true" width="410" />
</p>

<p align="center">
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/deploy-success-message.jpg?raw=true" width="410"/>
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/deploy-success-message-with-all.jpg?raw=true" width="410" />
</p>

## Usage

### Install

[![version-rocket](https://nodei.co/npm/version-rocket.png)](https://www.npmjs.com/package/version-rocket)

### Get Started

#### Install **V 1.1.0** and above, call the checkVersion method, optimize the pollingCompareVersion method, and support custom popup copy and themes **(recommended)**

```javascript

// 1. Import the checkVersion method and call
import { checkVersion } from 'version-rocket'
import {version} from '../package.json'

checkVersion({
  localPackageVersion: version,
  originVersionFileUrl: `${location.origin}/version.json`,
})
 
```

#### Personalize popup copy and theme

```javascript

import { checkVersion } from 'version-rocket'
import {version} from '../package.json'

// set copy and theme
checkVersion(
  {
    localPackageVersion: version,
    originVersionFileUrl: `${location.origin}/version.json`,
  },
  {
    title: 'Title',
    description: 'Description',
    primaryColor: '#758bfd',
    rocketColor: '#ff8600',
    buttonText: 'Button Text',
  }
)

// Custom popup picture
checkVersion(
  {
    localPackageVersion: version,
    originVersionFileUrl: `${location.origin}/version.json`,
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/26329117',
  }
)

```
*... For more custom settings, see the params form below 👇*

#### **version 1.0.9** and below use **pollingCompareVersion** method, we recommend upgrading to **version 1.1.0** or above to experience the ability to customize the theme and text of the popup.

```javascript

// 1. Import version-rocket, and invoke pollingCompareVersion method
import { pollingCompareVersion } from 'version-rocket'
import { version } from '../package.json'

/**
 * @param 1: current version
 * @param 2: remote server version.json file path
 * @param 3: time interval of rotation monitoring (in ms)
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

## Params

#### **checkVersion** function parameter table

| Params | Type | Description | Default | Required |
| --- | --- | --- | --- | --- |
| config | object | Version monitoring configuration item |  | Yes |
| config.originVersionFileUrl | string |  The path to the version.json file on the remote server | | Yes |
| config.localPackageVersion | string | The version of the current application usually takes the version field of package.json for comparison with the version.json file of the remote server |  | Yes |
| config.pollingTime | number |Time interval for polling monitoring, in ms | 5000 | No |
| config.onVersionUpdate | function(data) | Callback function for custom version hint UI (if you want to customize the popup UI, you can get the return value through the callback function to control the appearance of the popup) |  | No |
| options | object | Configuration items for popup text and themes (not customize the popup UI, but use it if you need to modify the text and themes) | | No |
| options.title | string | Popup title | Update | No |
| options.description | string | Popup description | V xxx is available | No |
| options.buttonText | string | Popup button text | Refresh | No |
| options.imageUrl | string | Popup image |  | No |
| options.rocketColor | string | The popup picture's theme color of the rocket, after setting Options.imageUrl is invalid | | No |
| options.primaryColor | string | The theme color of the popup, it will affect the hint image background color and button background color, after setting imageUrl is invalid | | No |
| options.buttonStyle | string | The CSS configuration of pop-up buttons can override the default button style | | No |

## Link
- [Timezone List](https://jp.cybozu.help/general/zh/admin/list_systemadmin/list_localization/timezone.html)





