'use strict';
// ファイルシステムを扱うモジュールを呼び出す
const fs = require('fs');
// ファイルを一行ずつ読み込むためのモジュールを呼び出す
const readline = require('readline');
// csvファイルからファイル読み込みを行うStreamを生成
const rs = fs.createReadStream('./popu-pref.csv');
// 生成したStreamをreadlineオブジェクトのinputとして設定
const rl = readline.createInterface({ 'input':rs, 'output': {} });
// 集計されたデータを格納する連想配列
const prefectureDataMap = new Map(); // key:都道府県 value:集計データのオブジェクト
rl.on('line', (lineString) => {
    // 文字列をカンマで分割してcolumnsという配列にしている
    const columns = lineString.split(',');
    // 文字列を数字に変換する
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        // valueの値がfalsyの場合に入れる初期値
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);

        //console.log(year);
        //console.log(prefecture);
        //console.log(popu);
    }
    //console.log(lineString);
});
rl.on('close', () => {
    // for-of構文
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key,value]) => {
        return key + ':' + value.popu10 + '=>' + value.popu15 + '変化率:' + value.change;
    });
    console.log(rankingStrings);
});
