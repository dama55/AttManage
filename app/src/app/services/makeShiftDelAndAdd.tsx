
interface timeData {
    'id': Number,
    'userId': string,
    'start': Date,
    'end': Date,
}

export function makeShiftDelAndAdd( preData: timeData[], newData: timeData[]){
    // 新しく作られたデータを30分区切りに変換
    const splitNewData = splitInto30MinIntervals(newData);

    const {delData, addData} = findDelAndAdd(preData, splitNewData);
    
    return {delData, addData};
}


/**
 * 新しく入力されたシフトを30分区切りに変換する関数
 * @param dataArray 
 * @returns 
 */
function splitInto30MinIntervals(dataArray: timeData[]) {
    const splitData: timeData[] = [];
  
    dataArray.forEach((data) => {
      const { id, userId, start, end } = data;
      let startTime = new Date(start);
      const endTime = new Date(end);
  
      // 開始時間から終了時間までを30分刻みで分割
      while (startTime < endTime) {
        const intervalEnd = new Date(startTime);
        intervalEnd.setMinutes(startTime.getMinutes() + 30);
  
        // 30分ごとに揃えたデータを追加
        splitData.push({
          id: Math.floor(Math.random() * 9000000) + 1000000, //再び仮のIDを割り振る
          userId,
          start: new Date(startTime),
          end: new Date(intervalEnd),
        });
  
        // 次の30分区切りへ
        startTime = new Date(intervalEnd);
      }
    });
  
    return splitData;
  }

/**
 * 新しいシフトと古いシフトを見比べて，追加された要素，削除された要素を確認する
 */
function findDelAndAdd(preData: timeData[], newData: timeData[]) {
    const addData: timeData[] = [];
    const delData: timeData[] = [];
    
    // 新旧のシフトデータを比較するため、Mapを使用
    const preDataMap = new Map<string, timeData>();
    preData.forEach(item => {
        const key = `${item.start.getTime()}-${item.end.getTime()}-${item.userId}`;
        preDataMap.set(key, item);
    });

    newData.forEach(item => {
        const key = `${item.start.getTime()}-${item.end.getTime()}-${item.userId}`;
        
        // 新しいデータに存在するが、古いデータにない場合は追加されたデータ
        if (!preDataMap.has(key)) {
            addData.push(item);
        } else {
            // 古いデータに存在する場合は削除対象から除外
            preDataMap.delete(key);
        }
    });

    // preDataMapに残っているものは削除対象
    delData.push(...preDataMap.values());

    return { addData, delData };
}
