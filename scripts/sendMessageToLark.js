#!/usr/bin/env node

/**
 * send messages to lark web hook
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

// lark-message-config-*.json
const configFileName = process.env.MESSAGE_PATH ? `${process.env.MESSAGE_PATH}` : 'lark-message-config.json'
const messageConfigPath = path.join(process.cwd(), configFileName);
const messageConfigObject = JSON.parse(fs.readFileSync(messageConfigPath).toString());

// package.json
const packageJsonName = process.env.PACKAGE_JSON_PATH ? `${process.env.PACKAGE_JSON_PATH}` : 'package.json'
const packageJsonPath = path.join(process.cwd(), packageJsonName);
console.log('PACKAGE_JSON_FULL_PATH', packageJsonPath)
const packageJsonObject = JSON.parse(fs.readFileSync(packageJsonPath).toString());

// MESSAGE_JSON
process.env.MESSAGE_JSON ? Object.assign(messageConfigObject, JSON.parse(process.env.MESSAGE_JSON)) : messageConfigObject;

// https://jp.cybozu.help/general/zh/admin/list_systemadmin/list_localization/timezone.html
// default: Asia/Shanghai
const covertToTimezone = messageConfigObject.expectConvertToTimezone || 'Asia/Shanghai'

const larkMessageJSON = (messageConfigObject.message && messageConfigObject.larkWebHook) ? messageConfigObject.message : {
    "msg_type": "interactive",
    "card": {
        "config": {
            "wide_screen_mode": true
        },
        "header": {
            "template": messageConfigObject?.headerBgColor || "turquoise",
            "title": {
                "content": `🚀 ${messageConfigObject.title || ''}`,
                "tag": "plain_text"
            }
        },
        "elements": [
            {
                "fields": [
                    {
                        "is_short": true,
                        "text": {
                            "content": `**📁 ${messageConfigObject.projectNameLabel || 'Project Name'}:**\n${messageConfigObject.projectName || ''}`,
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": true,
                        "text": {
                            "content": `**🔱 ${messageConfigObject.branchLabel || 'Branch'}:**\n${messageConfigObject.branch || ''}`,
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": false,
                        "text": {
                            "content": "",
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": true,
                        "text": {
                            "content": `**🎯 ${messageConfigObject.versionLabel || 'Version'}:**\n${messageConfigObject.version || packageJsonObject.version || ''}`,
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": true,
                        "text": {
                            "content": `**🔗 ${messageConfigObject.accessUrlLabel || 'URL'}:**\n<a>${messageConfigObject.accessUrl || ''}</a>`,
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": false,
                        "text": {
                            "content": "",
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": true,
                        "text": {
                            "content": `**🕐 ${messageConfigObject.timeLabel || 'Time'}:**\n${dayjs.tz(new Date(), covertToTimezone).format('YYYY-MM-DD HH:mm:ss')}`,
                            "tag": "lark_md"
                        }
                    },
                ],
                "tag": "div"
            }
        ]
    }
}

if (messageConfigObject.isNotifyAll) {
    const notifyAllObj = {
        "is_short": true,
        "text": {
            "content": `${messageConfigObject.isNotifyAll ? `**🔔 ${messageConfigObject.isNotifyAllLabel || 'Notify group members'}:**\n<at id=all></at>` : ""}`,
            "tag": "lark_md"
        }
    }
    const brObj = {
        "is_short": false,
        "text": {
            "content": "",
            "tag": "lark_md"
        }
    }
    larkMessageJSON.card.elements[0]?.fields.push(notifyAllObj);
    larkMessageJSON.card.elements[0]?.fields.push(brObj);
}

// TODO: dynamically card
if (messageConfigObject.setDeployInfoInMainCard) {
    const deployObj = {
        "is_short": true,
        "text": {
            "content": `**🔨 ${messageConfigObject.setDeployInfoInMainCard && messageConfigObject.deployToolsLabel || 'Deploy Tools'}:**\n${messageConfigObject.deployTools || ''}`,
            "tag": "lark_md"
        }
    }
    larkMessageJSON.card.elements[0]?.fields.push(deployObj);
} else if (messageConfigObject.deployToolsText || messageConfigObject.deployTools || messageConfigObject.remark) {
    const hrObj = {
        "tag": "hr"
    }
    const deployDefaultObj = {
        "elements": [
            {
                "content": `${messageConfigObject.deployToolsText || `${messageConfigObject.deployTools ? `Deploy through ${messageConfigObject.deployTools}` : ''}`} ${(messageConfigObject.deployTools || messageConfigObject.deployToolsText) && messageConfigObject.remark ? '\n' : ''}${messageConfigObject.remark || ''}`,
                "tag": "plain_text"
            }
        ],
        "tag": "note"
    }

    larkMessageJSON.card.elements?.push(hrObj)
    larkMessageJSON.card.elements?.push(deployDefaultObj)
}

if (messageConfigObject.remark) {
    const hrObj = {
        "tag": "hr"
    }
    const remarkObj = {
        "elements": [
            {
                "content": `${messageConfigObject.remark || ''}`,
                "tag": "plain_text"
            }
        ],
        "tag": "note"
    }
    if (messageConfigObject.setDeployInfoInMainCard) {
        larkMessageJSON.card.elements?.push(hrObj)
        larkMessageJSON.card.elements?.push(remarkObj)
    }
}

axios.post(messageConfigObject.larkWebHook, larkMessageJSON).catch((e) => {
    console.warn('send lark error', e.response?.data || e)
});