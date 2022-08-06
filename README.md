# 🔔 version-rocket 🚀

English | [简体中文](./README.zh-CN.md)

Notify users when a new version of your site is available and prompt them to refresh the page.
When you finish deploying your app, send a deployment message to Lark Group Chat

## About

**version-rocket** checks the version in the user's current browser against the version file in the remote server.

If a new version is available, a new version update prompt will be displayed to and the user will be given an operation button to refresh the page. Alternatively, **version-rocket** can notify you by receiving a callback function to support custom user interface.

We use the **Web Worker API** based on javascript to do the polling loop, will not affect the browser rendering process.

## Features

- Support all modern browsers
- Available version real-time monitoring, support any version format, such as: 1.1.0, 1.1.1.0, 1.1.0-beta, etc.
- Support personalized version popup text and theme, also support custom UI
- Sync deployment message to Lark group chat after successful deploy
- Card text and templates for deployment messages support customization, and support the dynamically generated fields.
- Support TypeScript
- [Npm package support](https://www.npmjs.com/package/version-rocket)

## Screenshots

- The **first picture** prompts user to refresh the page.
- The **second picture** personalize the popup text and theme, great for when you need to customize the text and theme.
- The **third picture** shows that after the successful deployment of the project, the deployment message will be sent to the group chat to inform the team members.
- The **fourth picture** custom message card text, can be set whether @all, and support dynamic generation of field incoming (such as version generated after ci/cd, support dynamic incoming)

<p align="center">
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/available-version-tips.gif?raw=true" width="410"/>
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/custom-themes.jpg?raw=true" width="410" />
</p>

<p align="center">
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/deploy-success-message.jpg?raw=true" width="410"/>
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/custom-message-text.jpg?raw=true" width="410" />
</p>

## Usage

### Install

[![version-rocket](https://nodei.co/npm/version-rocket.png)](https://www.npmjs.com/package/version-rocket)

### Get Started

Install the latest version, use ```checkVersion``` function, this function compatible with ```pollingCompareVersion```, and support customize popup text and theme (Recommended)
<br/>

#### Use the default theme

```javascript

// 1. Step one: import checkVersion(), and use
import { checkVersion } from 'version-rocket'
// By default, it is recommended to use the version field in package.json, and if there is a custom version, ignore this line
import { version } from '../package.json'

checkVersion({
  localPackageVersion: version,
  originVersionFileUrl: `${location.origin}/version.json`,
})
 
```

```javascript

/**
 * 2. Step two:
 * generate-version-file shortcut command to create the version.json file.
 * 
 * VERSION (optional): By default, the version.json file is generated using the version in package.json, if you need to customize the version, you can pass in the environment variable VERSION to define
 * 
 * The parameter is the directory where you want to create version.json. If you don't pass the parameter, it will be created in the dist directory by default.
*/ 

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "generate:version": "VERSION=1.1.0-beta generate-version-file dist public"
    ...
  },
  ...
}

```

<details>
<summary>⚠️ Notice:</summary>
If your project is connected to CDN, it is strongly recommended that you set the `version.json` file is set to always no caching (configure in nginx or turn off the function of CDN ignoring the parameter cache)

``` shell
// nginx example

server {
  ...
  location / {
    ...
    if ($request_filename ~* .*\/version\.(json)$) {
      add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate";
    }
    ...
  }
  ...
}
```
</details>
</br>

*Complete the above two steps, the version monitoring function can be used normally 🎉🎉*

#### Personalize popup text and theme

```javascript

import { checkVersion } from 'version-rocket'
import { version } from '../package.json'

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

```

#### Personalize popup image

``` javascript

import { checkVersion } from 'version-rocket'
import { version } from '../package.json'

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

#### If you are using **version 1.0.9** and later, call the pollingCompareVersion method

*It is recommended to upgrade to the latest version and experience the function of customizing popup text and theme*

```javascript

// 1. Step one: import pollingCompareVersion, and use
import { pollingCompareVersion } from 'version-rocket'
import { version } from '../package.json'

pollingCompareVersion(version, `${location.origin}/version.json`, 30000, (data) => {
    console.log(data)
})

// 2. Step two: see above: "Use the default theme"

```

[*See "Attributes/Parameters" table for more personalized settings📄*](#AttributesParameters)

---

#### Support push notification of successful deployment to Lark group chat

```javascript 

/**
 * 1. Step one:
 * You need to create a send-lark-config.json file first, it store the field for setting the text for the message card. 
 * 
 * Then, you can just execute the send-lark-message shortcut command. By default, the send-lark-config.json file in the current path is selected.
 * 
 * MESSAGE_PATH (optional): If you want to customize the file path and file name, you can set the MESSAGE_PATH parameter to pass it in.
 * 
 * PACKAGE_JSON_PATH (optional): If you want to customize the path to the package.json file, you can do so by passing in the PACKAGE_JSON_PATH environment variable. We will get the package.json file from the root path by default.
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

```

``` javascript

// Step two: send-lark-config.json example
{
    // card title
    "title": "TEST FE Deployed Successfully",
    // project name label
    "projectNameLabel": "Project name label",
    // deploy project name
    "projectName": "TEST",
    // project branch label
    "branchLabel": "Branch label",
    // deploy branch name
    "branch": "Staging",
    // version label
    "versionLabel": "Version label",
    // version
    "version": "1.1.1.0",
    // project access url label
    "accessUrlLabel": "Access URL label",
    // project access url
    "accessUrl": "https://test.com",
    // remind group chat members label
    "isNotifyAllLabel": "Is notify all label",
    // remind group chat members: true/false
    "isNotifyAll": true,
    // lark robot webhook url
    "larkWebHook": "https://open.larksuite.com/open-apis/bot/v2/hook/xxxxxxxxxxxx",
    // deploy type description
    "deployToolsText": "Deploy tools text",
    // deploy type
    "deployTools": "Jenkins",
    // the deploy time zone that you want to display, default "Asia/Shanghai"
    "expectConvertToTimezone": "America/New_York"
    // more information want to show
    "remark": "Trigger by bob, fix xxx bug"
}

```

#### Supports incoming dynamically generated card copy
*When the card text is dynamically generated based on the condition, you can pass in MESSAGE_JSON field to define, Note: the value of MESSAGE_JSON needs to be escaped*

```javascript

  /**
   * MESSAGE_JSON (optional): If the card text will be generated according to the conditions, you can pass in MESSAGE_JSON field to customize (this parameter is very useful for applications that dynamically generate card text, such as version, title, etc.)
  */

  {
    "name": "test",
    "description": "test",
    "private": true,
    "version": "0.0.1",
    "scripts": {
      ...
      "send-lark-message:test": "MESSAGE_JSON='{\"title\":\"This is a dynamically generated title\",\"version\":\"1.1.0-beta\",\"accessUrl\":\"http://test.example.com\",\"isNotifyAll\":true}' send-lark-message"
      ...
    },
    ...
  }

```

```javascript

// Or, after exporting the variable, reference it in package.json

// ci file
sh "npm run build"
sh "export messageJSON='{\"title\": \"This is a title\"}'"

// package.json
{
    "name": "test",
    "description": "test",
    "private": true,
    "version": "0.0.1",
    "scripts": {
      ...
      "send-lark-message:test": "MESSAGE_JSON=${messageJSON} send-lark-message"
      ...
    },
    ...
  }

```

#### Personalize the deployment message template

```javascript

// send-lark-config.json example
{
    // message card template content
    "message": {
        "msg_type": "text",
        "content": {
            "text": "New message reminder"
        }
    },
    // webhook link for the Lark bot
    "larkWebHook": "https://open.larksuite.com/open-apis/bot/v2/hook/xxxxxxxxxxxx"
}
 
```

---

## Attributes/Parameters

#### ```checkVersion``` function parameter table

| Params | Type | Description | Default | Required |
| --- | --- | --- | --- | --- |
| config | object | Version monitoring configuration item |  | Yes |
| config.originVersionFileUrl | string |  The path to the version.json file on the remote server | | Yes |
| config.localPackageVersion | string | The version of the current application usually takes the version field of package.json for comparison with the version.json file of the remote server |  | Yes |
| config.pollingTime | number | Time interval for polling monitoring, in ms | 5000 | No |
| config.onVersionUpdate | function(data) | Callback function for custom version hint UI (if you want to customize the popup UI, you can get the return value through the callback function to control the appearance of the popup) |  | No |
| options | object | Configuration items for popup text and themes (not customize the popup UI, but use it if you need to modify the text and themes) | | No |
| options.title | string | Popup title | Update | No |
| options.description | string | Popup description | V xxx is available | No |
| options.buttonText | string | Popup button text | Refresh | No |
| options.imageUrl | string | Popup image |  | No |
| options.rocketColor | string | The popup picture's theme color of the rocket, after setting Options.imageUrl is invalid | | No |
| options.primaryColor | string | The theme color of the popup, it will affect the hint image background color and button background color, after setting imageUrl is invalid | | No |
| options.buttonStyle | string | The CSS configuration of pop-up buttons can override the default button style | | No |

#### ```pollingCompareVersion``` function parameter table

| Params | Type | Description | Default | Required |
| --- | --- | --- | --- | --- |
| localPackageVersion | string | The version of the current application usually takes the version field of package.json for comparison with the version.json file of the remote server |  | Yes |
| originVersionFileUrl | string | The path to the version.json file on the remote server | | Yes |
| pollingTime | number | Time interval for polling monitoring, in ms | | Yes |
| onVersionUpdate | function(data) | Callback function for custom version hint UI (if you want to customize the popup UI, you can get the return value through the callback function to control the appearance of the popup) ) | | No |


## Link
- [Timezone List](https://jp.cybozu.help/general/zh/admin/list_systemadmin/list_localization/timezone.html)
- [JSON Escape](https://codebeautify.org/json-encode-online)

## License

version-rocket is open source software with [Apache License 2.0](./LICENSE.md)





