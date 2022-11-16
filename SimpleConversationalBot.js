const config = require('./config.json');
const botId = Object.keys(config.credentials);
const botName = botId.map(id => config.credentials[id].botName);
var sdk = require("./lib/sdk");
//const esDIDs = ['8776', '8772'] 

module.exports = {
    botId: botId,
    botName: botName,

    on_user_message: function (requestId, data, callback) {
    

        if (data.context.session.BotUserSession.setLanguageOverrideFlag === true || data.channel.botEvent === 'ON_CONNECT_EVENT') {
            data.metaInfo = { setBotLanguage: 'en' };
        }


        //------------------SAT VOICE START------------------------------------------------------------------ 
        if (data.context.session.BotUserSession.channels[0].type == 'smartassist' && (data.context.session.UserSession.DialedNumber == '+12512766105' || data.context.session.UserSession.DialedNumber == '8771')) {
            data.metaInfo = { setBotLanguage: 'es' };
            data.context.session.BotUserSession.setLanguageOverrideFlag === false;
        }

        else if (data.context.session.BotUserSession.channels[0].type == 'smartassist' && data.context.session.UserSession.DialedNumber == '+12057363676') {
            data.metaInfo = {setBotLanguage: 'en'};
            data.context.session.BotUserSession.setLanguageOverrideFlag === false;
        }
        //------------------SAT VOICE END------------------------------------------------------------------ 

        //------------------WEB START------------------------------------------------------------------ 
        else if (data.context.session.BotUserSession.channels[0].type == 'rtm' && data.context.session.BotUserSession.setLanguageOverrideFlag === true) {


            if (data.message !== undefined) {
    
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
                    data.context.session.BotUserSession.selectedLanguage = lang[data.message.toLowerCase()]
        
                }
            }
        }
        //------------------WEB END------------------------------------------------------------------ 

        //------------------Agent Mode Exit START------------------------------------------------------------------
        if (data && data.agent_transfer && (data.message === "####" || data.message === "abandonar" || data.message === "quit" || data.message === "stop chat")) {
            data.message = "Ok, exiting the agent mode.";
            sdk.clearAgentSession(data);
            return sdk.sendUserMessage(data);

        }

        if(data.agent_transfer){
            return sdk.sendBotMessage(data, callback)
        }
        //------------------Agent Mode Exit END------------------------------------------------------------------
        return sdk.sendBotMessage(data, callback);

    },
    on_bot_message: function (requestId, data, callback) {
        console.log(new Date(), "ON_BOT_MESSAGE : ", data.message);
        console.log("Language override Flag value on BOT EVENT::", data.context.session.BotUserSession.setLanguageOverrideFlag)
        console.log("caller number on BOT EVENT:", data.context.session.UserSession.Caller)
        console.log("dialed number on BOT EVENT:", data.context.session.UserSession.DialedNumber)
        
        return sdk.sendUserMessage(data, callback);
    },
    on_agent_transfer: function (requestId, data, callback) {
        return callback(null, data);
    },
    on_event: function (requestId, data, callback) {
        return callback(null, data);
    },
    on_alert: function (requestId, data, callback) {
        return sdk.sendAlertMessage(data, callback);
    }

};


