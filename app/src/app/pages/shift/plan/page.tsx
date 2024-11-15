'use client';
import React, { useState, useEffect } from 'react';
import { useRootLayout, RootLayoutProvider } from '@/contexts/RootLayoutContext';
import CalendarComponent from '@/components/shift/calender';
import CustomButton from '@/components/CustomButton';
import styles from '@/pages/shift/ava/edit/edit.module.css';
import plan_styles from '@/pages/shift/plan/plan.module.css';
import { useShiftReq, ShiftReqData } from '@/hooks/useShiftReq';
import { FaEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { useSessionContext } from '@/contexts/SessionContext';
import { withAuth } from '@/hooks/auth/withAuth';
import { GiFullMetalBucketHandle } from 'react-icons/gi';
import { Session } from '@supabase/supabase-js';
import { DateSelectArg } from '@fullcalendar/core';
import ControlButton from '@/components/ControlButton';
import { useShiftPlan } from '@/hooks/useShiftPlan';
import { AddEditableToEvents, MakeEventfromAvaShift, MakeEventfromAssiShift, mergeContinuousEvents } from '@/utils/client/eventUtils';
import { TypeEvent } from '@/types/shiftTypes';
import { SplitAndConvertEventsToShift } from '@/utils/client/eventUtils';

function PlanShiftPage() {
    const { sidePeakContent, setSidePeakContent, setPopUpContent, setSidePeakFlag } = useRootLayout();
    const [pre_events, setPreEvents] = useState<TypeEvent[]>([]);
    const [events, setEvents] = useState<TypeEvent[]>([]);
    const [eventsView, setEventsView] = useState<TypeEvent[]>([]);
    const [isEditable, setIsEditable] = useState(false);
    const { result, error, loading, getShiftReq, editShiftReq } = useShiftReq();
    const { getShiftPlan, calcShiftPlan, editShiftPlan } = useShiftPlan();
    const [editableMonth, setEditableMonth] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    const { session } = useSessionContext();
    const [recalcState, setRecalc] = useState(false);
    



    /* 編集ボタンのハンドラー */
    const editHandler = () => {
        setIsEditable(true);
    };


    /* 完了ボタンのハンドラ */
    const finHandler = () => {
        setIsEditable(false);
    };

    /* 修正適用ボタンのハンドラ */
    const applyHandler = () => {
        const { month, year } = editableMonth;
        const deleteStart = new Date(year, month - 1, 1); // 月の初日
        const deleteEnd = new Date(year, month, 0); // 月の最終日
        // イベント形式をシフト形式に戻す
        const { avaShifts: prev_avaShifts, } = SplitAndConvertEventsToShift(pre_events);
        const { avaShifts } = SplitAndConvertEventsToShift(events);
        // 内容が更新されているならそれをデータベースに反映
        editShiftPlan(deleteStart.toISOString(), deleteEnd.toISOString(), prev_avaShifts, avaShifts);
    };

    const baseProps = {
        events: eventsView, //表示用のイベント
        setEvents: setEventsView, //表示ように特別に用意したイベント
        isEditable: isEditable,
        editableMonth: editableMonth,
        setEditableMonth: setEditableMonth,
        initShiftData: (info: DateSelectArg, session: Session | null | undefined) => {
            //シフトデータの初期値
            return {
                id: Math.floor(Math.random() * 9000000) + 1000000, //一時IDを付加する 
                userId: "",
                req_num: 1,
                start: info.start,
                end: info.end,
                allDay: false,
                color: '#66CDAA', // ミントティール
                className: 'reqShift commonShift',
                extendedProps: {
                    req_num: 1  // カスタムデータを追加
                }
            }
        },
    }

    const sideProps = {
        ...baseProps,
        initialView: 'timeGridDay',
        headerToolbar: {
            left: 'prev,today,next',
            center: 'title',
            right: '',
        },
    }



    //サイドピークでのコンポーネントを表示する関数
    const handleDateClickActions = (clickedDate: string) => {
        if (isEditable) {//一旦editableでは何もしないようにする
            return;
        }
        console.log("SidePeak was set!!!");
        console.log("sideProps on SidePeak:", sideProps);
        setSidePeakFlag(
            true
        );
        setSidePeakContent(
            <CalendarComponent {...sideProps} />
        );

    };

    const props = {
        ...baseProps,
        handleDateClickActions: handleDateClickActions,
        headerToolbar: {
            left: 'prev,today,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
        },
    }

    // editableMonth表示される月の値 or 編集か閲覧の切り替えが更新されると，データベースからデータを再取得する．
    const fetchRecalcData = async () => {
        let getStart, getEnd;
        
        const { month, year } = editableMonth;
        getStart = new Date(year, month - 1, 1); // 月の初日
        getEnd = new Date(year, month, 0);       // 月の最終日

        if (!isEditable) {
            // 前後一週間のデータを取得するために日付を調整
            getStart.setDate(getStart.getDate() - 7); // 一週間前
            getEnd.setDate(getEnd.getDate() + 7); // 一週間後
        }

        if (session && session.user) {
            console.log("getStart: ", getStart);
            console.log("getEnd: ", getEnd);

            // シフト計画の再計算
            const response = await calcShiftPlan(getStart, getEnd);
            console.log("response: ", response);

            if (response) {
                console.log("response.result: ", response.result);
                const { avaShifts, assiShifts } = response.result;
                
                //各ユーザーごとのシフト
                let avaEvents = MakeEventfromAvaShift(avaShifts);
                //各時間ごとに複数のユーザー情報を持つシフト
                let assiEvents = MakeEventfromAssiShift(assiShifts);

                //各シフトに色とクラス名を指定
                avaEvents = AddEditableToEvents(avaEvents, false);
                assiEvents = AddEditableToEvents(assiEvents, false);

                const mergedAssiEvents = mergeContinuousEvents(assiEvents);

                setEventsView(mergedAssiEvents);
                // 各ユーザーごとのシフト割り当ては別に保持する
                // 再計算時には以前のデータprevEventsは消さない
                setEvents(avaEvents);
                setRecalc(true);
            }
        }
    };

    // editableMonth表示される月の値 or 編集か閲覧の切り替えが更新されると，データベースからデータを再取得する．
    const fetchData = async () => {
        let getStart, getEnd;
        
        const { month, year } = editableMonth;
        getStart = new Date(year, month - 1, 1); // 月の初日
        getEnd = new Date(year, month, 0);       // 月の最終日

        if (!isEditable) {
            // 前後一週間のデータを取得するために日付を調整
            getStart.setDate(getStart.getDate() - 7); // 一週間前
            getEnd.setDate(getEnd.getDate() + 7); // 一週間後
        }

        if (session && session.user) {
            console.log("getStart: ", getStart);
            console.log("getEnd: ", getEnd);

            // データの取り出し
            const response = await getShiftPlan(getStart, getEnd);
            console.log("response: ", response);

            if (response) {
                console.log("response.result: ", response.result);
                const { avaShifts, assiShifts } = response.result;
                
                //各ユーザーごとのシフト
                let avaEvents = MakeEventfromAvaShift(avaShifts);
                //各時間ごとに複数のユーザー情報を持つシフト
                let assiEvents = MakeEventfromAssiShift(assiShifts);

                //各シフトに色とクラス名を指定
                avaEvents = AddEditableToEvents(avaEvents, false);
                assiEvents = AddEditableToEvents(assiEvents, false);

                const mergedAssiEvents = mergeContinuousEvents(assiEvents);

                setEventsView(mergedAssiEvents);
                // 各ユーザーごとのシフト割り当ては別に保持する
                setPreEvents(avaEvents);
                setEvents(avaEvents);
                setRecalc(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [editableMonth, isEditable]);

    const handleClick = async () => {
        await fetchRecalcData();
    };

    return (
        <div className={plan_styles.main}>
            <div><h1>{editableMonth ? `${editableMonth.year}年${editableMonth.month}月の` : ''}シフトを割り当て</h1></div>
            <ControlButton onClick={handleClick}>シフトを再割り当て</ControlButton>
            {recalcState && (<div>
                <ControlButton onClick={applyHandler}>適用</ControlButton>
                <ControlButton onClick={fetchData}>取り消し</ControlButton>

            </div>)}
            {/* {isEditable ? (<div className={styles.edit_title}><h1>編集モード<FaEdit className={styles.title_icon} /></h1></div>) : (<div className={styles.edit_title}><h1>閲覧モード<GrView className={styles.title_icon} /></h1></div>)} */}
            {/* {!isEditable ? <CustomButton onClick={editHandler}><span className={styles.button_text}>編集</span></CustomButton> : null} */}
            {/* {isEditable ?
                <>
                    <CustomButton onClick={finHandler}><span className={styles.button_text}>完了</span></CustomButton>
                    <CustomButton onClick={applyHandler}><span className={styles.button_text}>適用</span></CustomButton>
                </>
                :
                null
            } */}
            <CalendarComponent {...props} />

        </div>
    );
}

export default withAuth(PlanShiftPage);