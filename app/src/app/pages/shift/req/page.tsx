'use client';
import React, { useState, useEffect } from 'react';
import { useRootLayout, RootLayoutProvider } from '@/contexts/RootLayoutContext';
import CalendarComponent from '@/components/shift/calender';
import CustomButton from '@/components/CustomButton';
import styles from '@/pages/shift/ave/edit/edit.module.css'
import { useShiftAve } from '@/hooks/useShiftAve';
import { FaEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { useSessionContext } from '@/contexts/SessionContext';
import { withAuth } from '@/hooks/auth/withAuth';
import { GiFullMetalBucketHandle } from 'react-icons/gi';
import { ShiftData } from '@/hooks/useShiftAve';

function ReqShiftPage() {
    const { sidePeakContent, setSidePeakContent, setPopUpContent, setSidePeakFlag } = useRootLayout();
    const [pre_events, setPreEvents] = useState<ShiftData[]>([]);
    const [events, setEvents] = useState<ShiftData[]>([]);
    const [isEditable, setIsEditable] = useState(false);
    const { result, error, loading, getShiftAve, editShiftAve } = useShiftAve();
    const [editableMonth, setEditableMonth] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    const { session } = useSessionContext();



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
        editShiftAve(deleteStart.toISOString(), deleteEnd.toISOString(), pre_events, events);
    };

    const baseProps = {
        events: events,
        setEvents: setEvents,
        isEditable: isEditable,
        editableMonth: editableMonth,
        setEditableMonth: setEditableMonth,
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
    useEffect(() => {
        let getStart: Date;
        let getEnd: Date;

        if (isEditable) {
            const { month, year } = editableMonth;
            getStart = new Date(year, month - 1, 1); // 月の初日
            getEnd = new Date(year, month, 0);       // 月の最終日
        } else {
            const { month, year } = editableMonth;
            // 前後一週間のデータを取得するために日付を調整
            getStart = new Date(year, month - 1, 1);
            getStart.setDate(getStart.getDate() - 7); // 一週間前

            getEnd = new Date(year, month, 0);
            getEnd.setDate(getEnd.getDate() + 7); // 一週間後
        }

        const fetchData = async () => {
            if (session && session.user) {
                console.log("session.user.id: ", session.user.id);
                console.log("getStart: ", getStart);
                console.log("getEnd: ", getEnd);

                // 非同期処理を実行して結果を取得
                const response = await getShiftAve(session.user.id, getStart, getEnd);
                console.log("response: ", response);
                if (response !== null) {
                    console.log("response.result: ", response.data);
                    setEvents(response.data);
                    setPreEvents(response.data);
                }
            }
        };
        fetchData();
    }, [editableMonth, isEditable]);



    return (
        <>
            <div>シフト要望</div>
            {isEditable ? (<div className={styles.edit_title}><h1>編集モード<FaEdit className={styles.title_icon} /></h1></div>) : (<div className={styles.edit_title}><h1>閲覧モード<GrView className={styles.title_icon} /></h1></div>)}
            {!isEditable ? <CustomButton onClick={editHandler}><span className={styles.button_text}>編集</span></CustomButton> : null}
            {isEditable ?
                <>
                    <CustomButton onClick={finHandler}><span className={styles.button_text}>完了</span></CustomButton>
                    <CustomButton onClick={applyHandler}><span className={styles.button_text}>適用</span></CustomButton>
                </>
                :
                null
            }
            <CalendarComponent {...props} />

        </>
    );
}

export default withAuth(ReqShiftPage);
// export default AveShiftPage;