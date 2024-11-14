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
        const isAvailable = !userShifts.some(
            (userShift) => new Date(userShift.start).toDateString() === new Date(shift.start).toDateString()
        );
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
    const noShift: reqShiftData[] = [];

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
                noShift.push(shift);
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
        noShift,
    };
}

export function makeShiftPlan(reqShifts: reqShiftData[], userShifts: userShiftData[]) {
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
    const maxShiftDuration = 4; // 最大連続シフト数の設定（例として4）
    const { resultShift, noShift } = processShiftGroup(
        groupedReqShifts,
        userShiftMap,
        shiftSum,
        maxShiftDuration
    );

    // 全てのシフトをまとめ、時間順にソートして返す
    const sortedShifts = resultShift
        .flatMap((entry) => entry.shifts)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    // noShiftデータを集計して重複を除く
    const aggregatedNoShift: noShiftData[] = [];
    noShift.forEach((shift) => {
        const existing = aggregatedNoShift.find(
            (item) => item.start === shift.start && item.end === shift.end
        );

        if (existing) {
            existing.remain_num += 1; // 既存の時間帯がある場合、remain_numをインクリメント
        } else {
            aggregatedNoShift.push({
                id: shift.id,
                remain_num: 1, // 初めて追加する場合は1から始める
                start: shift.start,
                end: shift.end,
            });
        }
    });

    return { sortedShifts, noShift };
}