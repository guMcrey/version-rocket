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
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJsonObject = JSON.parse(fs.readFileSync(packageJsonPath).toString());

// https://jp.cybozu.help/general/zh/admin/list_systemadmin/list_localization/timezone.html
// default: Asia/Shanghai
const covertToTimezone = messageConfigObject.expectConvertToTimezone || 'Asia/Shanghai'

const larkMessageJSON = {
    "msg_type": "interactive",
    "card": {
        "config": {
            "wide_screen_mode": true
        },
        "header": {
            "template": "turquoise",
            "title": {
                "content": `🚀 ${messageConfigObject.title}`,
                "tag": "plain_text"
            }
        },
        "elements": [
            {
                "fields": [
                    {
                        "is_short": true,
                        "text": {
                            "content": `**📁 Project Name:**\n${messageConfigObject.projectName}`,
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": true,
                        "text": {
                            "content": `**🔱 Branch:**\n${messageConfigObject.branch}`,
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
                            "content": `**🎯 Version:**\n${packageJsonObject.version}`,
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": true,
                        "text": {
                            "content": `**🔗 URL:**\n<a>${messageConfigObject.accessUrl}</a>`,
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
                            "content": `**🕐 Time:**\n${dayjs.tz(new Date(), covertToTimezone).format('YYYY-MM-DD HH:mm:ss')}`,
                            "tag": "lark_md"
                        }
                    },
                    {
                        "is_short": true,
                        "text": {
                            "content": `${messageConfigObject.isNotifyAll ? "**🔔 Notify group members:**\n<at id=all></at>" : ""}`,
                            "tag": "lark_md"
                        }
                    }
                ],
                "tag": "div"
            },
            {
                "tag": "hr"
            },
            {
                "elements": [
                    {
                        "content": `Deploy through ${messageConfigObject.deployTools}`,
                        "tag": "plain_text"
                    }
                ],
                "tag": "note"
            }
        ]
    }
}


axios.post(messageConfigObject.larkWebHook, larkMessageJSON);