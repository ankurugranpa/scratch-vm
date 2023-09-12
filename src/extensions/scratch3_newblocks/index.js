const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
// const nets = require('nets');

class Scratch3NewBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'newblocks',
            name: 'TEST Blocks',
            blocks: [
                {
                    opcode: 'writeLog',
                    blockType: BlockType.COMMAND,
                    text: 'log [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "log"
                        }
                    }
                },
                {
                    opcode: 'send_line_notify',
                    blockType: BlockType.COMMAND,
                    text: 'LINE_messege[TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'これはテストメッセージ'
                        }
                    }
                },
                {
                    opcode: 'ajaxRequest',
                    blockType: BlockType.REPORTER,
                    text: 'JOKE',
                },
                {
                    opcode: 'getBrowser',
                    text: 'browser',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'testAsync',
                    text: 'Async/Await tester',
                    blockType: BlockType.COMMAND
                }
            ],
            menus: {
            }
        };
    }

    //👇await出来るようにPromiseの関数を定義
    myFirstPromise(message) {
        console.log('一秒遅延しています...');
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(message);
            }, 1000);
        })
    }

    //👇クラス内にasyncメンバ関数を定義
    async myFirstAsync() {
        const result = await this.myFirstPromise('はじめてのAsync/Awaitへようこそ！');
        return result;
    }

    testAsync () {
        //👇スクラッチブロックからでもasync関数が呼び出せるようになる
        this.myFirstAsync().then(result => {
            console.log(result);
        });
    }
    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    getBrowser () {
        return navigator.userAgent;
    }
    ajaxRequest () {
        // この2行はできた
        // var test = this.getBrowser();
        // return test;
    }
    // api呼び出し処理
    promise_JsonData(url) {
      var xhr = new XMLHttpRequest();
      return new Promise(resolve => {
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              // HTTPステータスが成功（200 OK）の場合
              var jsonData = JSON.parse(xhr.responseText);
              // resolve(jsonData.setup + "\n" + jsonData.punchline);
              resolve(jsonData);
            } else {
              // エラーハンドリング
              console.error("データの取得中にエラーが発生しました。ステータスコード: " + xhr.status);
              resolve("error");
            }
          }
        };
        xhr.open("GET", url, true);
        xhr.send();
      }
    )}
    // apiの呼び出し
    async my_Async(api_url) {
        // const result = await this.promise_JsonData('https://official-joke-api.appspot.com/jokes/random');
        // const result = await this.promise_JsonData('http://127.0.0.1:8000/items/tintin');
        const result = await this.promise_JsonData(api_url);
        return result;
    }

    async ajaxRequest () {
        //👇スクラッチブロックからでもasync関数が呼び出せるようになる
        const result = await this.my_Async('http://127.0.0.1:8000/items/tintin');
        return result.item_id;
    }

    async send_line_notify (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
        const result = await this.my_Async(`http://127.0.0.1:8000/items/${text}`);
        return result.item_id;
    }

}
// ajaxRequestを呼び出してsetupを取得し、それをログに出力します
//    ajaxRequest(function (setup) {
//      if (setup) {
//        console.log("取得したsetup: ", setup);
//      } else {
//        console.error("エラーが発生しました。");
//    }
//    });
//    ajaxRequest (){
//        function fetchJsonData(url, callback) {
//          var xhr = new XMLHttpRequest();
//          xhr.onreadystatechange = function () {
//                if (xhr.readyState === 4) {
//                      if (xhr.status === 200) {
//                            // HTTPステータスが成功（200 OK）の場合
//                            var jsonData = JSON.parse(xhr.responseText);
//                            callback(jsonData); // コールバック関数にJSONデータを渡す
//                      } else {
//                            // エラーハンドリング
//                            console.error("データの取得中にエラーが発生しました。ステータスコード: " + xhr.status);
//                            callback(null); // エラー時にはnullを渡すか、適切なエラーハンドリングを行う
//                      }
//                }
//            };
//              xhr.open("GET", url, true);
//              xhr.send();
//        }
//        var apiURL = "https://official-joke-api.appspot.com/jokes/random";
//        var AAAAA =  fetchJsonData(apiURL, function(jsonData){
//                log.log(jsonData);
//                return jsonData.setup;
//        });
//        // return "AAAAA";
//        return new AAAAA;
//    }
//}
module.exports = Scratch3NewBlocks;
