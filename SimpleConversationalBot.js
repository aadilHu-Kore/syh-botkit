const config = require('./config.json');
const botId = Object.keys(config.credentials);
const botName = botId.map(id => config.credentials[id].botName);
var sdk = require("./lib/sdk");

module.exports = {
    botId: botId,
    botName: botName,

    on_user_message: function (requestId, data, callback) {

        if (data.context.session.BotUserSession.setLanguageOverrideFlag === true || data.channel.botEvent === 'ON_CONNECT_EVENT') {
            data.metaInfo = { setBotLanguage: 'en' };
        }
        //------------------SAT VOICE START------------------------------------------------------------------ 
        if (data.context.session.BotUserSession.channels[0].type == 'smartassist' && data.context.session.UserSession.DialedNumber == '+12512766105') {
            data.metaInfo = { setBotLanguage: 'es' };
            data.context.session.BotUserSession.setLanguageOverrideFlag === false;
        }

        else if (data.context.session.BotUserSession.channels[0].type == 'smartassist' && data.context.session.UserSession.DialedNumber == '+12057363676') {
            data.metaInfo = { setBotLanguage: 'en' };
            data.context.session.BotUserSession.setLanguageOverrideFlag === false;
        }
        //------------------SAT VOICE END------------------------------------------------------------------ 

        //------------------WEB START------------------------------------------------------------------ 
        else if (data.context.session.BotUserSession.channels[0].type == 'rtm' && data.context.session.BotUserSession.setLanguageOverrideFlag === true) {
            if (data.message !== undefined) {
                console.log("user input::", data.message)
                if (data.message.toLowerCase().includes("english") || data.message.toLowerCase().includes("spanish")) {
                    var lang = {
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

        //------------------Agent Mode Exit END------------------------------------------------------------------
        if (data && data.agent_transfer && (data.message === "####" || data.message === "abandonar" || data.message === "quit" || data.message === "stop chat")) {
            data.message = "Ok, exiting the agent mode.";
            sdk.sendUserMessage(data, callback);
            sdk.clearAgentSession(data);
        }
        //------------------Agent Mode Exit END------------------------------------------------------------------
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
    on_agent_transfer: function (requestId, data, callback) {
        console.log("on_event -->  Event : ", data.event);
        return callback(null, data);
    },
    on_event: function (requestId, data, callback) {
        console.log("on_event -->  Event : ", data.event);
        return callback(null, data);
    },
    on_alert: function (requestId, data, callback) {
        console.log("on_alert -->  : ", data, data.message);
        return sdk.sendAlertMessage(data, callback);
    }

};


