import { addToAtt, addToRest, editLatestAttEnd, editLatestRestEnd, getLatestAtt, getLatestRest } from "@/modules/attendanceModules";
import { getInitialState } from "@dnd-kit/core/dist/store";
import { getDefaultAutoSelectFamilyAttemptTimeout } from "net";



/* ユーザーの現在の出勤状態を返す：非同期

"In": 出勤,
"Out": 退勤,
"Break": 休憩，

*/
export const getAttState = async (
    userId: string
) => {
    let state;
    const att = await getLatestAtt(userId);
    console.log("att: ", att);
    if (att === null || att.end != null) {
        return "Out";
    }

    const attId = att.id; //idの取り出し
    const rest = await getLatestRest(userId, attId);
    if (rest == null || rest.end != null) {
        return "In";
    }

    return "Break";
}

/* 
act:
"In": 出勤
"Out": 退勤
"Break": 休憩
"Resume": 再開
*/
export const ActAtt = async (
    userId: string, // ユーザー
    act: string, // 行動 
    time: string, // 行動実行時間帯
) => {
    const state = await getAttState(userId);
    let message;

    switch (state) {
        case 'In': {
            if (act === 'Break') {
                await ActBreak(userId, time);
                message = '休憩を開始しました';
            } else if (act === 'Out') {
                await ActOut(userId, time);
                message = '退勤しました';
            }
            break;
        }
        case 'Out': {
            if (act === 'In') {
                await ActIn(userId, time);
                message = '出勤しました';
            }
            break;
        }
        case 'Break': {
            if (act === 'Resume') {
                await ActResume(userId, time);
                message = '休憩を終了しました';
            }
            break;
        }
        default: {
            throw new Error("状態と行動が合いません, state: " + state);
        }
    }

    // 成功メッセージとユーザーの新しい状態を返す
    return message;
}


export const ActBreak = async(
    userId: string,
    time: string,
)=> {
    const att = await getLatestAtt(userId);

    if (!att){
        throw new Error("最新打刻データがありません");
    }

    await addToRest(userId, att.id, time);
}

export const ActIn = async(
    userId: string,
    time: string
)=> {
    await addToAtt(userId, time);
}

export const ActResume = async(
    userId: string,
    time: string
)=> {
    await editLatestRestEnd(userId, time);
}

export const ActOut = async(
    userId: string,
    time: string,
)=> {
    await editLatestAttEnd(userId, time);
}