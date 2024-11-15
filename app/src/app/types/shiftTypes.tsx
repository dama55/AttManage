// シフトデータ型

export interface TypeAvaShift {
    id: number;
    userId: string;  // ユーザーID
    start: string;  // シフト開始時間
    end: string;    // シフト終了時間
}

export interface TypeReqShift {
    id: number;
    req_num: number;  // シフト要求人数
    start: string;    // シフト開始時間
    end: string;      // シフト終了時間
}

/* シフトが入っていない項目 */
export interface TypeNoShift {
    id: number;
    remain_num: number;  // 残りシフト枠数
    start: string;       // シフト開始時間
    end: string;         // シフト終了時間
}

/* 複数のユーザーを同じシフトで管理する項目 */
export interface TypeUsersShift {
    id: number;
    userIds: string[];   // ユーザーIDの配列
    userNames: { [key: string]: string };  // ユーザーIDに対応するユーザー名
    start: string;       // シフト開始時間
    end: string;         // シフト終了時間
}

/* 割り当てされたシフト */
export interface TypeAssiShift {
    id: number;
    userIds: string[];   // ユーザーIDの配列
    userNames: { [key: string]: string };  // ユーザーIDに対応するユーザー名
    req_num: number; //要求シフト数
    start: string;       // シフト開始時間
    end: string;         // シフト終了時間
}

// イベントデータ型

/* Avaシフトのイベント */
export interface TypeAvaEvent {
    id: number;
    start: Date;         // イベント開始時間
    end: Date;           // イベント終了時間
    className: string;   // イベントクラス名
    extendedProps: {
        event_type: string;  // イベントの種類
        userId: string;      // ユーザーID
        eventEditable?: boolean;  // 編集可能かどうか（オプショナル）
    };
}

/* Reqシフトのイベント */
export interface TypeReqEvent {
    id: number;
    start: Date;         // イベント開始時間
    end: Date;           // イベント終了時間
    className: string;   // イベントクラス名
    extendedProps: {
        event_type: string;  // イベントの種類
        req_num: number;     // シフト要求人数
        eventEditable?: boolean;  // 編集可能かどうか（オプショナル）
    };
}

/* シフトが入っていないことを示すイベント */
export interface TypeNoEvent {
    id: number;
    start: Date;         // イベント開始時間
    end: Date;           // イベント終了時間
    className: string;   // イベントクラス名
    extendedProps: {
        event_type: string;  // イベントの種類
        remain_num: number;  // 残りシフト枠数
        eventEditable?: boolean;  // 編集可能かどうか（オプショナル）
    };
}

/* 複数のユーザーを同じシフトで管理するイベント型 */
export interface TypeUsersEvent {
    id: number;
    start: Date;         // イベント開始時間
    end: Date;           // イベント終了時間
    className: string;   // イベントクラス名
    extendedProps: {
        event_type: string;   // イベントの種類
        userIds: string[];    // ユーザーIDの配列
        userNames: { [key: string]: string };  // ユーザーIDに対応するユーザー名
        eventEditable?: boolean;  // 編集可能かどうか（オプショナル）
    };
}

/* 複数のユーザーを同じシフトで管理するイベント型 */
export interface TypeAssiEvent {
    id: number;
    start: Date;         // イベント開始時間
    end: Date;           // イベント終了時間
    className: string;   // イベントクラス名
    extendedProps: {
        event_type: string;   // イベントの種類
        userIds: string[];    // ユーザーIDの配列
        userNames: { [key: string]: string };  // ユーザーIDに対応するユーザー名
        req_num: number; //要求シフト数
        eventEditable?: boolean;  // 編集可能かどうか（オプショナル）
    };
}

// 複数のイベント型をまとめた型
export type TypeEvent = TypeAvaEvent | TypeReqEvent | TypeNoEvent | TypeUsersEvent;