//var botId = ["st-980bad94-cb6d-57c2-8a78-a767d037fb02","st-c8c35fee-9e41-5f9e-a3a1-952dd11cc9d8"];
//const botName = ["SYH_DEV","SYH_Spanish"];
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
    botId: botId,
    botName: botName,

    on_user_message: function (requestId, data, callback) {

        if (data.message === "Hi" || data.message === "hello") {
            data.message = "Hello Aadil from Botkit";

            //Sends back 'Hello' to user.
            //return sdk.sendBotMessage(data, callback);
            return sdk.sendUserMessage(data, callback);
            // } else if (!data.agent_transfer) {
            //Forward the message to bot
            //     return sdk.sendBotMessage(data, callback);
            // } 
        }
    

        if (data.context.session.BotUserSession.setLanguageOverrideFlag === true || data.channel.botEvent === 'ON_CONNECT_EVENT') {
            data.metaInfo = { setBotLanguage: 'en' };
        }
        // if(data.channel.botEvent === 'ON_CONNECT_EVENT' && data.context.session.BotUserSession.setLanguageOverrideFlag === true)
        //SYH_Spanish -> 12055258902, //VCC_QA_Spanish -> 12513060520, DID for Spanish = 8858 SYH_English -> +12057363676
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
        
                }
            }
        }
        //------------------WEB END------------------------------------------------------------------ 

        //------------------Agent Mode Exit END------------------------------------------------------------------
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
        console.log("dailed number on BOT EVENT:", data.context.session.UserSession.DialedNumber)
        
        if (data.message === 'hello') {
            data.message = 'The Bot says hello!';
        }
        //Sends back the message to user

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


