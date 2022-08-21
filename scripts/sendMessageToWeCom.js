#!/usr/bin/env node

/**
 * send messages to WeCom
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

console.log('MESSAGE_PATH', process.env.MESSAGE_PATH);

// message-config-*.json
const configFileName = process.env.MESSAGE_PATH ? `${process.env.MESSAGE_PATH}` : 'message-config.json'
const messageConfigPath = path.join(process.cwd(), configFileName);
const messageConfigObject = JSON.parse(fs.readFileSync(messageConfigPath).toString());

// package.json
const packageJsonName = process.env.PACKAGE_JSON_PATH ? `${process.env.PACKAGE_JSON_PATH}` : 'package.json'
const packageJsonPath = path.join(process.cwd(), packageJsonName);
console.log('PACKAGE_JSON_FULL_PATH', packageJsonPath)
const packageJsonObject = JSON.parse(fs.readFileSync(packageJsonPath).toString());

// TODO: MESSAGE_JSON
process.env.MESSAGE_JSON ? Object.assign(messageConfigObject, JSON.parse(process.env.MESSAGE_JSON)) : messageConfigObject;

// https://jp.cybozu.help/general/zh/admin/list_systemadmin/list_localization/timezone.html
// default: Asia/Shanghai
const covertToTimezone = messageConfigObject.expectConvertToTimezone || 'Asia/Shanghai'

const larkMessageJSON = (messageConfigObject.message && messageConfigObject.webHook) ? messageConfigObject.message : `{
    "msgtype": "markdown",
    "markdown": {
        "content": "**🚀 ${messageConfigObject.title}**\n
         ><font color='comment'> ${messageConfigObject.projectNameLabel || 'Project Name'}</font>:  ${messageConfigObject.projectName || ''}
         ><font color='comment'> ${messageConfigObject.branchLabel || 'Branch'}</font>:  ${messageConfigObject.branch || ''}
         ><font color='comment'> ${messageConfigObject.versionLabel || 'Version'}</font>:  ${messageConfigObject.version || packageJsonObject.version || ''}
         ><font color='comment'> ${messageConfigObject.accessUrlLabel || 'URL'}</font>:  [${messageConfigObject.accessUrl || ''}](${messageConfigObject.accessUrl || ''})
         ><font color='comment'> ${messageConfigObject.timeLabel || 'Time'}</font>:  ${dayjs.tz(new Date(), covertToTimezone).format('YYYY-MM-DD HH:mm:ss')}
         >${messageConfigObject.isNotifyAll ? '@all' : ''}
         ${messageConfigObject.deployToolsText || messageConfigObject.remark ? '\n' : ''}
         ><font color='comment'>${messageConfigObject.deployToolsText || ''}</font>
         ><font color='comment'>${messageConfigObject.remark || ''}</font>"
    }
}`

axios.post(messageConfigObject.webHook, larkMessageJSON).catch((e) => {
    console.warn('send WeCom error', e.response?.data || e)
});