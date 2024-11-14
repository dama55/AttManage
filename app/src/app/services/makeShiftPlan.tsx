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
    shifts: reqShiftData[];
}

// ユーザー候補を取得するヘルパー関数
function getAvailableUsersForShift(
    userShiftMap: { [key: string]: userShiftData[] },
    shift: reqShiftData,
    shiftSum: { [key: string]: number }
): string | null {
    const candidates = Object.keys(userShiftMap).filter((userId) => {
        const userShifts = userShiftMap[userId];
        const isAvailable = !userShifts.some(
            (userShift) => new Date(userShift.start).toDateString() === new Date(shift.start).toDateString()
        );
        return isAvailable;
    });

    if (candidates.length === 0) return null;

    return candidates.reduce((minUser, userId) =>
        shiftSum[userId] < shiftSum[minUser] ? userId : minUser
    );
}

// シフトをユーザーに割り当てるヘルパー関数
function assignShiftToUser(
    userId: string,
    shift: reqShiftData,
    shiftSum: { [key: string]: number },
    groupedReqShifts: reqShiftData[][],
    tempShift: reqShiftData[]
) {
    tempShift.push(shift);
    shiftSum[userId] += 1; // シフト時間の集計
    shift.req_num -= 1; // req_numを一つ減らす
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

            const userId = getAvailableUsersForShift(userShiftMap, shift, shiftSum);
            if (userId) {
                let tempShift: reqShiftData[] = [];
                assignShiftToUser(userId, shift, shiftSum, groupedReqShifts, tempShift);
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

                    assignShiftToUser(userId, nextShift, shiftSum, groupedReqShifts, tempShift);
                    prevShift = nextShift;
                    tempIndex++;

                    // 最大シフト時間を超えた場合、終了
                    if (tempShift.length >= maxShiftDuration) break;
                }

                resultShift.push({ userId, shifts: tempShift });
                index = tempIndex; // インデックスを進める
            } else {
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
    const userShiftMap: { [key: string]: userShiftData[] } = {};
    userShifts.forEach((shift) => {
        if (!userShiftMap[shift.userId]) {
            userShiftMap[shift.userId] = [];
        }
        userShiftMap[shift.userId].push(shift);
    });

    const groupedReqShifts: reqShiftData[][] = [];
    let currentGroup: reqShiftData[] = [];

    reqShifts.forEach((shift, index) => {
        if (index === 0) {
            currentGroup.push(shift);
        } else {
            const prevShift = reqShifts[index - 1];
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

    if (currentGroup.length > 0) {
        groupedReqShifts.push(currentGroup);
    }

    const employeeKeys = Object.keys(userShiftMap);
    const shiftSum: { [key: string]: number } = {};
    employeeKeys.forEach((userId) => {
        shiftSum[userId] = 0;
    });

    const maxShiftDuration = 4; // 最大シフト数の設定（例として4）
    const { resultShift, noShift } = processShiftGroup(
        groupedReqShifts,
        userShiftMap,
        shiftSum,
        maxShiftDuration
    );

    return resultShift;
}