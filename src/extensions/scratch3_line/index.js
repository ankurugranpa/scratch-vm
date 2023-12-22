const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const axios = require('axios');
const api_url = require('../../util/original-util/env');

var test_message = null

class Scratch3Line {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'line',
            name: 'Line',
            blocks: [
                {
                    opcode: 'send_line_message',
                    blockType: BlockType.COMMAND,
                    text: 'SEND_LINE[MESSGAGE][USERID]',
                    arguments: {
                        MESSGAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'これはテストメッセージ'
                        },
                        USERID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'USERID'
                        }
                    }
                },
                {
                    opcode: 'get_message',
                    blockType: BlockType.BOOLEAN,
                    text: 'GetMessage[USERID]',
                    arguments: {
                        USERID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'メッセージを受け取りたいユーザーのidを入力してください'
                        },
                        MESSAGE:{
                            type: ArgumentType.STRING,
                        }
                    }
                },
                {
                    opcode: 'message_index',
                    blockType: BlockType.REPORTER,
                    text: 'Message',
                },
            ],
            menus: {
            }
        };
    }

    send_line_message(args){
        const message = {
            message: Cast.toString(args.MESSGAGE),
            user_id: Cast.toString(args.USERID)
        };
        axios.post(api_url.BASE_API_URL + '/send_line', message)
            .then(response => {
                log.log(response);
            });
    }

    // Get Api response

    async get_json(api_url){
        const json = await axios.get(api_url);
        // var test = JSON.stringify(json.data)
        // log.log(typeof test)
        // log.log(test.setup)
        return json.data;
    }




    message_index(){
        return test_message
    }

    async get_message(args) {
        const message = await this.get_message_post(Cast.toString(args.USERID))
        // log.log(message.message)
        if (message.length === 0) {
            return 0
        }
        else {
            for (let i = 0; i < message.length; i++){
                test_message = message[i].message
            }
            return 1
        }
    }
    async get_message_post(user_id) {
    try {
        const data = {
            user_id: user_id
        };
        // const response = await axios.post('https://4a82-133-106-35-39.ngrok-free.app/line-db/get', data, {
        const response = await axios.post(api_url.DB_API_URL + '/line-db/get', data, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return response.data
    } catch (error) {
        console.error("Error in get_message_post:", error);
        // エラーのハンドリングを追加する（例: デフォルトのエラーメッセージを返すなど）
        throw error;
        }
    }



}
module.exports = Scratch3Line;
