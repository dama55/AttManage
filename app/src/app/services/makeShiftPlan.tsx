import { getAllUsers } from "@/modules/userModules";
import { TypeUsersShift, TypeAvaShift, TypeReqShift, TypeAssiShift } from "@/types/shiftTypes";

interface userShiftData {
    id: number;
    userId: string;
    start: string;
    end: string;
}

interface reqShiftData {
    id: number;
    req_num: number;
    start: string;
    end: string;
}

interface AssignedShift {
    userId: string;
    shifts: userShiftData[];
}

interface noShiftData {
    id: number;
    remain_num: number;
    start: string;
    end: string;
}

// ユーザー候補を取得するヘルパー関数
function getAvailableUsersForShift(
    userShiftMap: { [key: string]: userShiftData[] },
    shift: reqShiftData,
    shiftSum: { [key: string]: number }
): string | null {
    //勤務可能なユーザーのキーが入る
    const candidates = Object.keys(userShiftMap).filter((userId) => {
        const userShifts = userShiftMap[userId];

        console.log("shift.start: ", shift.start);
        console.log("userShifts: ", userShifts);
        const isAvailable = userShifts.some(
            //完全な時間を比較
            //必ず同じ区間でシフトが区切られていることを前提とする
            (userShift) => new Date(userShift.start).getTime() === new Date(shift.start).getTime()
        );
        console.log("isAvailable: ", isAvailable);
        return isAvailable;
    });

    if (candidates.length === 0) return null;

    // 現状の勤務予定シフト数が最も少ないユーザーを返す．
    return candidates.reduce((minUser, userId) =>
        shiftSum[userId] < shiftSum[minUser] ? userId : minUser
    );
}

// シフトをユーザーに割り当てるヘルパー関数
function assignShiftToUser(
    userId: string,
    shift: reqShiftData,
    shiftSum: { [key: string]: number },
    userShiftMap: { [key: string]: userShiftData[] },
    tempShift: userShiftData[]
) {
    // userShiftMap からユーザーのシフトデータを取り出して追加
    const userShifts = userShiftMap[userId];
    const assignedShift = userShifts.find((userShift) => userShift.start === shift.start && userShift.end === shift.end);

    console.log("assignedShift: ", assignedShift);
    console.log("userId: ", userId);

    if (assignedShift) {

        tempShift.push(assignedShift); // userShiftData の情報を登録
        shiftSum[userId] += 1; // シフト時間の集計
        shift.req_num -= 1; // req_numを一つ減らす
    }
}


// groupedReqShiftsの各グループを処理するメイン関数
function processShiftGroup(
    groupedReqShifts: reqShiftData[][],
    userShiftMap: { [key: string]: userShiftData[] },
    shiftSum: { [key: string]: number },
    maxShiftDuration: number
) {
    const resultShift: AssignedShift[] = [];
    const noShifts: reqShiftData[] = [];

    console.log("groupedReqShifts: ", groupedReqShifts);
    console.log("userShiftMap: ", userShiftMap);
    console.log("shiftSum: ", shiftSum);
    console.log("maxShiftDuration: ", maxShiftDuration);

    while (true) {

        const randomGroupIndex = Math.floor(Math.random() * groupedReqShifts.length);
        const shiftGroup = groupedReqShifts[randomGroupIndex];

        let index = 0;
        while (index < shiftGroup.length) {
            const shift = shiftGroup[index];
            if (shift.req_num === 0) {
                index++;
                continue;
            }
            // シフトに入れるuserを計算
            const userId = getAvailableUsersForShift(userShiftMap, shift, shiftSum);
            if (userId) {
                let tempShift: userShiftData[] = [];
                assignShiftToUser(userId, shift, shiftSum, userShiftMap, tempShift);
                let prevShift = shift;
                let tempIndex = index + 1;
                
                console.log("I'm herere !!!!");
                console.log("tempShift: ",tempShift);
                // シフトの連続性を確認しながらtemp_shiftを構築
                while (tempIndex < shiftGroup.length) {
                    const nextShift = shiftGroup[tempIndex];
                    const prevEnd = new Date(prevShift.end);
                    const nextStart = new Date(nextShift.start);
                    
                    if (nextStart.getTime() !== prevEnd.getTime() || nextShift.req_num === 0) {
                        break;
                    }
                    
                    assignShiftToUser(userId, nextShift, shiftSum, userShiftMap, tempShift);
                    prevShift = nextShift;
                    tempIndex++;
                    
                    // 最大シフト時間を超えた場合、終了
                    if (tempShift.length >= maxShiftDuration) break;
                }
                
                resultShift.push({ userId, shifts: tempShift });
                index = tempIndex; // インデックスを進める
            } else {
                //誰も入れないなら，そのシフトを記録して飛ばす．
                noShifts.push(shift);
                shift.req_num -= 1; // 該当するシフトのreq_numを減らす
                index++;
            }
        }

        // すべてのグループのシフトのreq_numが0かどうかを確認
        const allAssigned = groupedReqShifts.every(group =>
            group.every(shift => shift.req_num === 0)
        );
        if (allAssigned) break;
    }

    // 結果をstart時間でソート
    resultShift.forEach((entry) => {
        entry.shifts.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    });

    return {
        resultShift,
        noShifts,
    };
}

export function makeShiftPlan(
    reqShifts: reqShiftData[],
    userShifts: userShiftData[],
    userNamesObj: { [key: string]: string }) {
    const reqShiftsCopy: reqShiftData[] = JSON.parse(JSON.stringify(reqShifts));
    const userShiftsCopy: userShiftData[] = JSON.parse(JSON.stringify(userShifts));
    const userShiftMap: { [key: string]: userShiftData[] } = {};
    // ユーザーごとにシフトを分割
    userShiftsCopy.forEach((shift) => {
        if (!userShiftMap[shift.userId]) {
            userShiftMap[shift.userId] = [];
        }
        userShiftMap[shift.userId].push(shift);
    });

    
    
    // シフト要求を連続したシフトのグループに分割
    const groupedReqShifts: reqShiftData[][] = [];
    let currentGroup: reqShiftData[] = [];
    
    reqShiftsCopy.forEach((shift, index) => {
        if (index === 0) {
            currentGroup.push(shift);
        } else {
            const prevShift = reqShiftsCopy[index - 1];
            const prevEnd = new Date(prevShift.end);
            const currentStart = new Date(shift.start);
            
            if (prevEnd.getTime() === currentStart.getTime()) {
                currentGroup.push(shift);
            } else {
                groupedReqShifts.push(currentGroup);
                currentGroup = [shift];
            }
        }
    });
    // 最後のグループを追加
    if (currentGroup.length > 0) {
        groupedReqShifts.push(currentGroup);
    }
    // 従業員のキーを取り出し
    const employeeKeys = Object.keys(userShiftMap);
    // 要求シフトの総数をカウントするための配列
    const shiftSum: { [key: string]: number } = {};
    employeeKeys.forEach((userId) => {
        shiftSum[userId] = 0;
    });
    // シフトの計算
    const maxShiftDuration = 8; // 最大連続シフト数の設定（例として4）
    const { resultShift, noShifts } = processShiftGroup(
        groupedReqShifts,
        userShiftMap,
        shiftSum,
        maxShiftDuration
    );
    
    //  `TypeUsersShift`を要素に持つ配列の作成
    const typeUsersShifts: TypeUsersShift[] = [];
    
    // 各時間帯ごとに勤務するユーザーを持つ配列に変換．
    resultShift.forEach((entry) => {
        // シフトを時間順にソートしておく
        entry.shifts.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        
        entry.shifts.forEach((shift) => {
            // 同じ時間帯に既存のシフトがあれば追加、なければ新規作成
            let existingShift = typeUsersShifts.find(
                (s) => s.start === shift.start && s.end === shift.end
            );
            
            if (existingShift) {
                // 既存のシフトにユーザーを追加
                existingShift.userIds.push(entry.userId);
                existingShift.userNames[entry.userId] = userNamesObj[entry.userId];
            } else {
                // 新しい時間帯を追加
                typeUsersShifts.push({
                    id: shift.id,
                    userIds: [entry.userId],
                    userNames: { [entry.userId]: userNamesObj[entry.userId] },
                    start: shift.start,
                    end: shift.end,
                });
            }
        });
    });
    

    // noShiftデータを集計して重複を除く
    // const aggregatedNoShift: noShiftData[] = [];
    // noShifts.forEach((shift) => {
    //     const existing = aggregatedNoShift.find(
    //         (item) => item.start === shift.start && item.end === shift.end
    //     );

    //     if (existing) {
    //         existing.remain_num += 1; // 既存の時間帯がある場合、remain_numをインクリメント
    //     } else {
    //         aggregatedNoShift.push({
    //             id: shift.id,
    //             remain_num: 1, // 初めて追加する場合は1から始める
    //             start: shift.start,
    //             end: shift.end,
    //         });
    //     }
    // });

    // 全てのシフトをまとめ、時間順にソートして返す
    const sortedShifts = resultShift
        .flatMap((entry) => entry.shifts)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    // 割り当て後のシフトと要求シフトから，表示用のassiShiftsを取り出す
    const { assiShifts } = makeAssignedShiftForView(sortedShifts, reqShifts, userNamesObj);

    return {
        avaShifts: sortedShifts, //各ユーザーごとのシフト
        assiShifts,
    };
}

/* 割り当てされたユーザーのシフトと，要求シフトの関係から表示用のデータを計算

作成アルゴリズムは次の通り，

1. 計算のしやすさのために，avaShiftsとreqShiftsを開始時間に関して昇順に並べる．
2. 各reqShiftsの要素に対して，assiShifts内の同じ時間帯に該当する全てのユーザーのシフトを取り出す．
3. 新しいTypeAssiShiftのインスタンスを作成し，そこにプロパティを設定するが，この際に要求シフト数req_num, ユーザーID，ユーザーIDに対応するユーザー名も2で取り出したユーザーやreqShiftsの要素に従って決定する．
4. 新しいインスタンスをassiShiftsにpushして2に戻り，新しいreqShiftsについて繰り返す．
*/
export function makeAssignedShiftForView(
    avaShifts: TypeAvaShift[],
    reqShifts: TypeReqShift[],
    userNames: {[key: string ]: string},
) {
    // 開始時間で昇順にソート
    const sortedAvaShifts = [...avaShifts].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const sortedReqShifts = [...reqShifts].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const assiShifts: TypeAssiShift[] = [];

    // 各要求シフトについて、該当するユーザーシフトを割り当て
    sortedReqShifts.forEach(reqShift => {
        // reqShift と同じ時間帯に該当する avaShifts を抽出
        const matchingAvaShifts = sortedAvaShifts.filter(
            avaShift => avaShift.start === reqShift.start && avaShift.end === reqShift.end
        );

        // 新しい TypeAssiShift インスタンスを作成
        const newAssiShift: TypeAssiShift = {
            id: reqShift.id, // 各reqShiftのidを使う
            userIds: matchingAvaShifts.map(shift => shift.userId), // 該当ユーザーのIDを取得
            userNames: matchingAvaShifts.reduce((acc, shift) => {
                acc[shift.userId] = userNames[shift.userId]; // ユーザー名を後で埋める
                return acc;
            }, {} as { [key: string]: string }),
            req_num: reqShift.req_num, // 要求シフト数を設定
            start: reqShift.start, // 開始時間
            end: reqShift.end // 終了時間
        };

        // assiShiftsに追加
        assiShifts.push(newAssiShift);
    });

    return { assiShifts };
}
