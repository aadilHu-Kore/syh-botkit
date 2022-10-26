//var botId = ["st-52ed66cb-f5a6-55b8-995f-dcba43b09729","st-c818eea6-185c-510e-bb1d-c8f26b836435"];
//const botName = ["HCPayer_Dev","HCPayer_Demo"];
const config = require('./config.json');
const botId = Object.keys(config.credentials);
const botName = botId.map(id => config.credentials[id].botName);
var sdk = require("./lib/sdk");

/*
 * This is the most basic example of BotKit.
 *
 * It showcases how the BotKit can intercept the message being sent to the bot or the user.
 *
 * We can either update the message, or chose to call one of 'sendBotMessage' or 'sendUserMessage'
 */
module.exports = {
    botId   : botId,
    botName : botName,

    on_user_message: function (requestId, data, callback) {
        //console.log('data=> =========================================>>>> ', JSON.stringify(data));
        // console.log('User Request ID==>', requestId);
        // console.log('ON_USER_MESSAGE => Channel type = ' + data.channel.type);
        // console.log('ON_USER_MESSAGE = ',data.context.session.BotUserSession.lastMessage)
        // //console.log('ON_USER_MESSAGE = ',data.context.session.BotUserSession.lastMessage)
        //console.log('ON_USER_MESSAGE = ',data.context.session.BotUserSession.lastMessage.messagePayload.text)
        console.log(new Date(), "ON_USER_MESSAGE : ", data.message);
        console.log("Language override Flag value on USER EVENT::", data.context.session.BotUserSession.setLanguageOverrideFlag)
        //console.log("intent name::",data.context.intent);
        if (data.message === "Hi" || data.message === "hello") {
            data.message = "Hello Aadil from Botkit";
            console.log("inside first")
            //Sends back 'Hello' to user.
            //return sdk.sendBotMessage(data, callback);
            return sdk.sendUserMessage(data, callback);
            // } else if (!data.agent_transfer) {
            //     //Forward the message to bot
            //     return sdk.sendBotMessage(data, callback);
            // } 
        } //else if (data.message !== undefined && data.context.session.BotUserSession.setLanguageOverrideFlag === true && data.context.session.UserSession.Caller === "1234567890") {
        // if (data.message === "1" || data.message === "2" || data.message === "1." || data.message === "2." || data.message.toLowerCase().includes("english") || data.message.toLowerCase().includes("spanish")) {
        //     console.log("inside second block")
        //     console.log("Language override Flag::",data.context.session.BotUserSession.setLanguageOverrideFlag)
        //     console.log("user input for language override::",data.message);
        //     var lang = {
        //         "1": "en",
        //         "2": "es",
        //         "1.": "en",
        //         "2.": "es",
        //         "english": "en",
        //         "spanish": "es",
        //         "english.": "en",
        //         "spanish.": "es",

        //     }
        //     // data.metaInfo = {
        //     //     setBotLanguage: lang[data.message.toLowerCase()],
        //     //     intentInfo: {
        //     //         intent: "SATWelcomeDialog"
        //     //     }
        //     // };

        //     data.metaInfo = {
        //         setBotLanguage: lang[data.message.toLowerCase()],
        //         'nlMeta': {
        //               'intent': 'SATWelcomeDialog', 
        //               'isRefresh': true
        //         }
        //   };
        //     console.log("test::",data.metaInfo)
        //     //https://techdocs.audiocodes.com/voice-ai-connect/#VAIG_Combined/parameters.htm?TocPath=_____7
        //     return sdk.sendBotMessage(data, callback);
        // }
        console.log("event >>>>>>>>>>>> ", data.channel.botEvent);
        console.log("channelType >>>>>>>>> ", data.context.session.BotUserSession.channels[0].type);  //smartassist and rtm
        //console.log("lastMessage::",data.context.session.BotUserSession.lastMessage.channel);
        //console.log("context:" ,data.context)
        console.log("caller number on USER EVENT:", data.context.session.UserSession.Caller)
        console.log("dialed number on USER EVENT:", data.context.session.UserSession.DialedNumber)
        console.log("START...");
        console.log("ON CONNECT EVENT::", data.channel.botEvent)
        if (data.context.session.BotUserSession.setLanguageOverrideFlag === true || data.channel.botEvent === 'ON_CONNECT_EVENT') {
            data.metaInfo = { setBotLanguage: 'en' };
        }
        // if(data.channel.botEvent === 'ON_CONNECT_EVENT' && data.context.session.BotUserSession.setLanguageOverrideFlag === true)
        //SYH_Spanish -> 12055258902, //VCC_QA_Spanish -> 12513060520
        //------------------SAT VOICE START------------------------------------------------------------------ 
        if (data.context.session.BotUserSession.channels[0].type == 'smartassist' && data.context.session.UserSession.DialedNumber == '+12055258902') {
            console.log("aadil testing lang == es on smartassist...");
            console.log("INSIDE of SAT VOICE es")
            data.metaInfo = { setBotLanguage: 'es' };
            data.context.session.BotUserSession.setLanguageOverrideFlag === false;
        }
        //------------------SAT VOICE END------------------------------------------------------------------ 
        
        //------------------WEB START------------------------------------------------------------------ 
        else if (data.context.session.BotUserSession.channels[0].type == 'rtm' && data.context.session.BotUserSession.setLanguageOverrideFlag === true) {
            console.log("testing lang == es on web ");
            console.log("current bot lang::", data.metaInfo)
            if (data.message !== undefined) {
                console.log("user input::", data.message)
                if (data.message === "1" || data.message === "2" || data.message === "1." || data.message === "2." || data.message.toLowerCase().includes("english") || data.message.toLowerCase().includes("spanish")) {
                    console.log("INSIDE of WEB es")
                    console.log("user input for language override WEB::", data.message);
                    var lang = {
                        "1": "en",
                        "2": "es",
                        "1.": "en",
                        "2.": "es",
                        "english": "en",
                        "spanish": "es",
                        "english.": "en",
                        "spanish.": "es", 
                    }
                    data.metaInfo = {
                        setBotLanguage: lang[data.message.toLowerCase()],
                        'nlMeta': {
                            'intent': 'SATWelcomeDialog',
                            'isRefresh': true
                        }
                    };
                    console.log("test::", data.metaInfo)
                }
            }
        }
        //------------------WEB END------------------------------------------------------------------ 
        return sdk.sendBotMessage(data, callback);
        
    },
    on_bot_message: function (requestId, data, callback) {
        console.log(new Date(), "ON_BOT_MESSAGE : ", data.message);
        console.log("Language override Flag value on BOT EVENT::", data.context.session.BotUserSession.setLanguageOverrideFlag)
        console.log("caller number on BOT EVENT:", data.context.session.UserSession.Caller)
        console.log("dailed number on BOT EVENT:", data.context.session.UserSession.DialedNumber)
        // console.log('Bot Request ID==>', requestId);
        // console.log('ON_BOT_MESSAGE => ', data.message);
        console.log("intent triggered::", data.context.intent);
        if (data.message === 'hello') {
            data.message = 'The Bot says hello!';
        }
        //Sends back the message to user

        return sdk.sendUserMessage(data, callback);
    },
    on_agent_transfer : function(requestId, data, callback){
        return callback(null, data);
    },
    on_event : function (requestId, data, callback) {
        console.log("on_event -->  Event : ", data.event);
        return callback(null, data);
    },
    on_alert : function (requestId, data, callback) {
        console.log("on_alert -->  : ", data, data.message);
        return sdk.sendAlertMessage(data, callback);
    }

};


