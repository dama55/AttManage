'use client';
import React, { useState, useEffect } from 'react';
import { useRootLayout, RootLayoutProvider } from '@/contexts/RootLayoutContext';
import CalendarComponent from '@/components/shift/calender';
import CustomButton from '@/components/CustomButton';
import styles from '@/pages/shift/ava/edit.module.css'
import { useShiftAva } from '@/hooks/useShiftAva';
import { FaEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { useSessionContext } from '@/contexts/SessionContext';
import { withAuth } from '@/hooks/auth/withAuth';
import { GiFullMetalBucketHandle } from 'react-icons/gi';
import { TypeAvaShift, TypeAvaEvent, TypeEvent } from '@/types/shiftTypes';
import { MakeEventfromAvaShift, SplitAndConvertEventsToShift, AddEditableToEvents, MakeEventfromReqShift, mergeContinuousEvents } from '@/utils/client/eventUtils';
import { Session } from '@supabase/supabase-js';
import { DateSelectArg } from '@fullcalendar/core';
import { useShiftReq } from '@/hooks/useShiftReq';

function AvaShiftPage() {
  const { sidePeakContent, setSidePeakContent, setPopUpContent, setSidePeakFlag } = useRootLayout();
  const [pre_events, setPreEvents] = useState<TypeEvent[]>([]);
  const [events, setEvents] = useState<TypeEvent[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const { result, error, loading, getShiftAva, editShiftAva } = useShiftAva();
  const { getShiftReq } = useShiftReq();

  const [editableMonth, setEditableMonth] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const { session } = useSessionContext();




  const editHandler = () => {
    setIsEditable(true);
  };

  const finHandler = () => {
    setIsEditable(false);
  };

  const applyHandler = () => {
    const { month, year } = editableMonth;
    const deleteStart = new Date(year, month - 1, 1); // 月の初日
    const deleteEnd = new Date(year, month, 0); // 月の最終日
    // データを種類ごとに分けて処理
    const { avaShifts: prev_avaShifts, } = SplitAndConvertEventsToShift(pre_events);
    const { avaShifts } = SplitAndConvertEventsToShift(events);
    editShiftAva(deleteStart.toISOString(), deleteEnd.toISOString(), prev_avaShifts, avaShifts);
  };

  const initShiftData = (info: DateSelectArg, session: Session) => {
    return {
      id: Math.floor(Math.random() * 9000000) + 1000000, //一時IDを付加する 
      start: info.start,
      end: info.end,
      allDay: false,
      color: '#6495ED', // スカイブルー
      className: 'avaShift commonShift',
      extendedProps: {
        event_type: '0', //シフト希望
        userId: session.user.id, //ユーザーID
        eventEditable: true, //編集可能
      }
    };
  };

  //カレンダーに渡すプロパティ
  const baseProps = {
    events: events, //イベントデータ
    setEvents: setEvents,
    isEditable: isEditable, //編集可能かどうか
    editableMonth: editableMonth, //編集可能な月
    setEditableMonth: setEditableMonth,
    initShiftData, //追加するイベントの初期値

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
      //編集時のデータ取得範囲
      const { month, year } = editableMonth;
      getStart = new Date(year, month - 1, 1); // 月の初日
      getEnd = new Date(year, month, 0);       // 月の最終日
    } else {
      //閲覧時のデータ取得範囲
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
        const response_ava = await getShiftAva(session.user.id, getStart, getEnd);
        if (response_ava !== null) {

          let updatedEvents_ava: TypeEvent[] = MakeEventfromAvaShift(response_ava.data);

          // 編集可能に設定
          updatedEvents_ava = AddEditableToEvents(updatedEvents_ava, true);

          const mergedEvents = mergeContinuousEvents(updatedEvents_ava);

          setEvents(mergedEvents);
          setPreEvents(updatedEvents_ava);
        }
      }
    };
    fetchData();
  }, [editableMonth, isEditable]);



  return (
    <>
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

export default withAuth(AvaShiftPage);