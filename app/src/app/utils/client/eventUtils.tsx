import { arraysEqual } from "../stringUtils";

import {
    TypeAvaEvent,
    TypeAvaShift,
    TypeReqShift,
    TypeReqEvent,
    TypeAssiShift,
    TypeAssiEvent,
    TypeEvent
} from "@/types/shiftTypes"

/* 各イベントデータに editable 属性を追加 */
// export const AddEditableToEvents = (events: TypeEvent[], eventEditable: boolean) => {
//     return events.map(event => ({
//         ...event,
//         extendedProps: {
//             ...event.extendedProps,
//             eventEditable // カスタムプロパティとして extendedProps に追加
//         }
//     }));
// };

export const AddEditableToEvents = <T extends TypeEvent>(events: T[], eventEditable: boolean): T[] => {
    return events.map(event => ({
        ...event,
        extendedProps: {
            ...event.extendedProps,
            eventEditable, // プロパティを追加
        },
    }));
};

/* 4種類のイベントが含まれた配列を全て変換する */
export const SplitAndConvertEventsToShift = (events: TypeEvent[]): {
    avaShifts: TypeAvaShift[],
    reqShifts: TypeReqShift[],
    assiShifts: TypeAssiShift[],
} => {
    const avaEvents = events.filter((event): event is TypeAvaEvent => event.className.includes("avaShift"));
    const reqEvents = events.filter((event): event is TypeReqEvent => event.className.includes("reqShift"));
    const assiEvents = events.filter((event): event is TypeAssiEvent => event.className.includes("assiShift"));

    const avaShifts = MakeAvaShiftfromEvent(avaEvents);
    const reqShifts = MakeReqShiftfromEvent(reqEvents);
    const assiShifts = MakeAssiShiftfromEvent(assiEvents);

    return {
        avaShifts,
        reqShifts,
        assiShifts,
    };
};

/* AvaシフトをAvaイベントデータに変換 */
export const MakeEventfromAvaShift = (
    ShiftData: TypeAvaShift[]
): TypeAvaEvent[] => {
    return ShiftData.map((shift) => {
        return {
            id: shift.id, //シフトID
            start: new Date(shift.start), //シフト開始
            end: new Date(shift.end), //シフト終了
            className: "avaShift commonShift", //クラス名
            color: '#6495ED', //スカイブルー
            extendedProps: {
                event_type: '0', //シフト希望
                userId: shift.userId, //ユーザーID
            }
        }

    });
};

/* AvaイベントデータをAvaシフトに変換 */
export const MakeAvaShiftfromEvent = (
    ShiftEvent: TypeAvaEvent[]
): TypeAvaShift[] => {
    return ShiftEvent.map((event) => {
        return {
            id: event.id,
            userId: event.extendedProps.userId,
            start: event.start.toISOString(),
            end: event.end.toISOString(),
        };
    });
};

/* ReqシフトをReqイベントデータに変換 */
export const MakeEventfromReqShift = (
    ShiftData: TypeReqShift[]
): TypeReqEvent[] => {
    return ShiftData.map((shift) => {
        return {
            id: shift.id, //シフトID
            start: new Date(shift.start), //シフト開始
            end: new Date(shift.end), //シフト終了
            className: "reqShift commonShift", //クラス名
            color: '#66CDAA',// ミントティール
            extendedProps: {
                event_type: '1', //シフト希望
                req_num: shift.req_num, //要求シフト数
            }
        }

    });
};

/* ReqイベントをReqシフトデータに変換 */
export const MakeReqShiftfromEvent = (
    ShiftEvent: TypeReqEvent[]
): TypeReqShift[] => {
    return ShiftEvent.map((event) => {
        return {
            id: event.id,
            req_num: event.extendedProps.req_num,
            start: event.start.toISOString(),
            end: event.end.toISOString(),
        };
    });
};

/* NoシフトをNoイベントデータに変換 */
// export const MakeEventfromNoShift = (
//     ShiftData: TypeNoShift[]
// ): TypeNoEvent[] => {
//     return ShiftData.map((shift) => {
//         return {
//             id: shift.id, //シフトID
//             start: new Date(shift.start), //シフト開始
//             end: new Date(shift.end), //シフト終了
//             className: "noShift commonShift", //クラス名
//             color: '#FF6347',
//             extendedProps: {
//                 event_type: '2', //シフトに入れる人がいない
//                 remain_num: shift.remain_num,
//             }
//         }

//     });
// };

/* NoイベントをNoシフトデータに変換 */
// export const MakeNoShiftfromEvent = (
//     ShiftEvent: TypeNoEvent[]
// ): TypeNoShift[] => {
//     return ShiftEvent.map((event) => {
//         return {
//             id: event.id,
//             remain_num: event.extendedProps.remain_num,
//             start: event.start.toISOString(),
//             end: event.end.toISOString(),
//         };
//     });
// };

/* AssiシフトをAssiイベントデータに変換 */
export const MakeEventfromAssiShift = (
    ShiftData: TypeAssiShift[]
): TypeAssiEvent[] => {
    return ShiftData.map((shift) => {
        const hasUsers = shift.userIds && shift.userIds.length > 0;

        return {
            id: shift.id, // シフトID
            start: new Date(shift.start), // シフト開始
            end: new Date(shift.end), // シフト終了
            className: `assiShift commonShift ${hasUsers ? 'assiShiftWithUser' : 'assiShiftNoUser'}`, // クラス名
            color: hasUsers ? '#FF8C00' : '#FF6347', // ダークオレンジかトマトレッド
            extendedProps: {
                event_type: '3', // ユーザー全体でのシフト
                userIds: shift.userIds,
                userNames: shift.userNames,
                req_num: shift.req_num,
            }
        };
    });
};

/* AssiイベントをAssiシフトデータに変換 */
export const MakeAssiShiftfromEvent = (
    ShiftEvent: TypeAssiEvent[]
): TypeAssiShift[] => {
    return ShiftEvent.map((event) => {
        return {
            id: event.id,
            userIds: event.extendedProps.userIds,
            userNames: event.extendedProps.userNames,
            req_num: event.extendedProps.req_num,
            start: event.start.toISOString(),
            end: event.end.toISOString(),
        };
    });
};

// req_numが存在する場合の型ガード関数
function isReqShiftEvent(event: TypeEvent): event is TypeEvent & { extendedProps: { req_num: number } } {
    return event.extendedProps.event_type === "1" && 'req_num' in event.extendedProps;
}

/* event_type=='3'の時の型ガード */
function isAssiShiftEvent(event: TypeEvent): event is TypeEvent & { extendedProps: {
     req_num: number,
     userIds: string[] 
    }} {
    return event.extendedProps.event_type === "3" && 'req_num' in event.extendedProps;
}

/* 連続したシフト時間を一つのイベントとして定義する関数 */
export const mergeContinuousEvents = (events: TypeEvent[]): TypeEvent[] => {
    // ソートしておくと、連続したイベントの確認がしやすくなります
    events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const mergedEvents: TypeEvent[] = [];
    let currentMergedEvent: TypeEvent | null = null;

    events.forEach((event) => {
        if (!currentMergedEvent) {
            // 初回のイベントを設定
            currentMergedEvent = { ...event };
        } else {
            const currentEndTime = new Date(currentMergedEvent.end).getTime();
            const nextStartTime = new Date(event.start).getTime();

            // イベントが連続しているかどうか確認
            const isContinuous = currentEndTime === nextStartTime;
            // 同条件かどうか確認
            const hasSameProperties =
                currentMergedEvent.className === event.className &&
                currentMergedEvent.extendedProps.event_type === event.extendedProps.event_type &&
                JSON.stringify(currentMergedEvent.extendedProps) === JSON.stringify(event.extendedProps);




            // event_type == "1"の場合，req_numが存在する場合のみ追加条件をチェック
            const isSameReqNum =
                isReqShiftEvent(currentMergedEvent) &&
                isReqShiftEvent(event) &&
                currentMergedEvent.extendedProps.req_num === event.extendedProps.req_num;

            // event_type == "3"の場合，追加条件チェック
            const isSameAssiNum =
                isAssiShiftEvent(currentMergedEvent) &&
                isAssiShiftEvent(event) &&
                currentMergedEvent.extendedProps.req_num === event.extendedProps.req_num &&
                arraysEqual(currentMergedEvent.extendedProps.userIds, event.extendedProps.userIds);


            // req_numが存在しない場合はisSameReqNumの条件を無視する
            const shouldMerge = isContinuous && hasSameProperties &&
                (isReqShiftEvent(currentMergedEvent) ? isSameReqNum : true) &&
                (isAssiShiftEvent(currentMergedEvent) ? isSameAssiNum : true);

            // console.log("isSameAssiNum: ", isSameAssiNum);
            // console.log("isAssiShiftEvent(currentMergedEvent): ", isAssiShiftEvent(currentMergedEvent));
            // console.log("currentMergedEvent.extendedProps.req_num === event.extendedProps.req_num: ",isAssiShiftEvent(currentMergedEvent) &&
            // isAssiShiftEvent(event) &&
            // currentMergedEvent.extendedProps.req_num === event.extendedProps.req_num);
            // console.log("currentMergedEvent.extendedProps.userIds == event.extendedProps.userIds: ",isAssiShiftEvent(currentMergedEvent) &&
            // isAssiShiftEvent(event) &&
            // currentMergedEvent.extendedProps.userIds == event.extendedProps.userIds);


            if (shouldMerge) {
                // 連続している場合、終了時間を更新
                currentMergedEvent.end = event.end;
            } else {
                // 連続していない場合、現在のマージ済みイベントを追加し、新しいイベントを開始
                mergedEvents.push(currentMergedEvent);
                currentMergedEvent = { ...event };
            }
        }
    });

    // 最後のマージ済みイベントを追加
    if (currentMergedEvent) {
        mergedEvents.push(currentMergedEvent);
    }

    // 新しいIDを設定
    return mergedEvents.map((event, index) => ({
        ...event,
        id: Math.floor(Math.random() * 9000000) + 1000000 // 新しいID
    }));
};
