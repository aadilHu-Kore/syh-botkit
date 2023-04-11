const config = require('./config.json');
const botId = Object.keys(config.credentials);
const botName = botId.map(id => config.credentials[id].botName);
var sdk = require("./lib/sdk");
//const esDIDs = ['8776', '8772'] 


var request = require('request');

const getUserInput = function(input) {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': 'https://bots.kore.ai/api/v1.1/rest/streams/st-402a0a01-e737-56ab-8e5e-8d0367ee14bb/findIntent?fetchConfiguredTasks=false',
            'headers': {
                'Content-Type': 'application/json',
                'auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNZSF9RQSIsImFwcElkIjoiY3MtNTMzNDc2YTQtYTZkOS01NmFiLWFjZDAtOGY3MzhiZWM5ZjEwIn0.ICFQ3g_0zwQpX3ww4Tv3ry49uKn7KSQvaMkBCdoImFQ'
            },
            body: {
                "input": input,
                "streamName": "SYH_QA",
            },
            json: true
        };
        request(options, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

module.exports = {
    botId: botId,
    botName: botName,

    on_user_message: function(requestId, data, callback) {
        console.log("on_user_message ", requestId, data.message);
        try {
            if (data.context.session.BotUserSession.setLanguageOverrideFlag === true || data.channel.botEvent === 'ON_CONNECT_EVENT') {
                data.metaInfo = {
                    setBotLanguage: 'en'
                };
            }


            //------------------SAT VOICE START------------------------------------------------------------------ 
            if (data.context.session.BotUserSession.channels[0].type == 'smartassist' &&
                (data.context.session.UserSession.DialedNumber == '+16506401401' ||
                    data.context.session.UserSession.DialedNumber == '+18609796347' ||
                    data.context.session.UserSession.DialedNumber == '8773')) {
                data.metaInfo = {
                    setBotLanguage: 'en'
                };
                data.context.session.BotUserSession.selectedLanguage = 'en';
                data.context.session.BotUserSession.setLanguageOverrideFlag = false;
                return sdk.sendBotMessage(data);
            } else if (data.context.session.BotUserSession.channels[0].type == 'smartassist' &&
                (data.context.session.UserSession.DialedNumber == '+15627848711' ||
                    data.context.session.UserSession.DialedNumber == '+12283358646' ||
                    data.context.session.UserSession.DialedNumber == '8771')) {
                data.metaInfo = {
                    setBotLanguage: 'es'
                };
                data.context.session.BotUserSession.selectedLanguage = 'es';
                data.context.session.BotUserSession.setLanguageOverrideFlag = false;
                return sdk.sendBotMessage(data);
            }
            //------------------SAT VOICE END------------------------------------------------------------------
            //-------------------SMS-----------------------
            else if (data.context.session.BotUserSession.channels[0].type == 'smartassist' && data.context.session.BotUserSession.channels[0].preferredChannelForResponse === 'sms' ) {

                var userInput = 'SATWelcomeDialog';
                var context = data.context;

                if (context.session && context.session.UserSession && context.session.UserSession.inputOnSMS &&
                    context.session.UserSession.inputOnSMS.lastMessage && context.session.UserSession.inputOnSMS.lastMessage.messagePayload &&
                    context.session.UserSession.inputOnSMS.lastMessage.messagePayload.Body) {
                    userInput = context.session.UserSession.inputOnSMS.lastMessage.messagePayload.Body;
                } else if (context.session.BotUserSession.channels[0].body && !context.session.UserSession.inputOnSMS) {
                    userInput = context.session.BotUserSession.channels[0].body;
                }
                console.log("UserInput---------------", userInput);
				if (data.message === 'refreshCS' || data.message === 'InitialPrompt') {
					 //let _data = data;
					delete data.metaInfo.nlMeta;
					data.metaInfo.nlMeta = {};
					/*data.metaInfo = {
						nlMeta: {
							intent: userInput,
							isRefresh: true
							}						
					}*/
					data.message = userInput;
                } else {
					data.message = data.message;
				}
                data.context.session.BotUserSession.selectedLanguage = 'en';
                data.context.session.BotUserSession.setLanguageOverrideFlag = false;
				console.log("Inside SMS Channel", data);
                return sdk.sendBotMessage(data);
                
				
            }
            //------------------WEB START------------------------------------------------------------------ 
            else if (data.context.session.BotUserSession.channels[0].type == 'rtm' && data.context.session.BotUserSession.setLanguageOverrideFlag === true) {


                if (data.message !== undefined) {

                    if (data.message.toLowerCase().includes("english") || data.message.toLowerCase().includes("spanish") || data.message.toLowerCase().includes("inglés") || data.message.toLowerCase().includes("español")) {
                        var lang = {
                            "english": "en",
                            "spanish": "es",
                            "english.": "en",
                            "spanish.": "es",
                            "inglés": "en",
                            "español": "es"
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
                return sdk.sendBotMessage(data);
            }
            //------------------WEB END---------

            //------------------Agent Mode Exit START-----------
            if (data && data.agent_transfer && (data.message === "####" || data.message === "abandonar" || data.message === "quit" || data.message === "stop chat")) {
                data.message = "Ok, exiting the agent mode.";
                sdk.clearAgentSession(data);
                return sdk.sendUserMessage(data);

            }

            if (data.agent_transfer) {
                return sdk.sendBotMessage(data, callback)
            }
			return sdk.sendBotMessage(data);
            //------------------Agent Mode Exit END----
        } catch (err) {
            console.log("catch error====> ", err);
            return sdk.sendBotMessage(data);
        }

    },
    on_bot_message: function(requestId, data, callback) {
        try {
            console.log(new Date(), "ON_BOT_MESSAGE : ", data.message);
            console.log("Language override Flag value on BOT EVENT::", data.context.session.BotUserSession.setLanguageOverrideFlag)
            console.log("caller number on BOT EVENT:", data.context.session.UserSession.Caller)
            console.log("dialed number on BOT EVENT:", data.context.session.UserSession.DialedNumber)
        } catch (err) {
            console.log("error from on bot message===> ", err);
        }
        return sdk.sendUserMessage(data, callback).catch(err => {
            console.log("catch error  =====> ", err);
        })
    },
    on_agent_transfer: function(requestId, data, callback) {
        return callback(null, data);
    },
    on_event: function(requestId, data, callback) {
		console.log("EVENT", data);
        return callback(null, data);
    },
    on_alert: function(requestId, data, callback) {
        return sdk.sendAlertMessage(data, callback);
    }

};