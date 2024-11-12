'use client';
import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import styles from '@/components/shift/calender.module.css'
import '@/components/shift/calender.css';

const CalendarComponent = ({events, setEvents, isEditable}) => {
  // const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const [editableMonth, setEditableMonth] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  // 現在の表示月と年を取得
  const getCurrentMonth = () => {
    if (calendarRef.current && calendarRef.current.getApi) { // calendarRef.current が存在し、getApi()が利用可能か確認
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      return { month: currentDate.getMonth() + 1, year: currentDate.getFullYear() };
    }
    return null; // calendarRef.current が null の場合、null を返す
  };


  const handleSelect = (info) => {
    const viewType = info.view.type;

    if (viewType == 'dayGridMonth') {

    } else {
      const newEvent = {
        id: Math.floor(Math.random() * 9000000) + 1000000, //一時IDを付加する 
        start: info.start,
        end: info.end,
        allDay: false,
      };

      // 既存のイベントと重複していないか確認
      if (isTimeConflict(newEvent, events)) {
        info.view.calendar.unselect();
        return;
      }

      setEvents((currentEvents) => [...currentEvents, newEvent]);
      info.view.calendar.unselect();
    }
  };

  /* 現状のカレンダーの状態が編集可能なのかどうかを判定 */
  const editableCheck = () => {
    if (!isEditable){
      console.log(is)
      return false
    }

    const currentMonth = getCurrentMonth();

    if (currentMonth.month == null || currentMonth.year == null){
      //取得した月がnullの場合は編集できない
      console.log("currentMonthがnullになっている")
      return false;
    }

    console.log("editableMonth: ", editableMonth);
    console.log("currentMonth: ", currentMonth);
    if (currentMonth.month !== editableMonth.month || currentMonth.year !== editableMonth.year) {
      return false;
    }

    return true;
  }


  // イベントのサイズ変更を処理
  const handleEventResize = (resizeInfo) => {
    if (!isEditable){
      return;
    }
    const { event } = resizeInfo;
    const updatedEvents = events.map((ev) =>
      ev.id === event.id ? { ...ev, start: event.start, end: event.end } : ev
    );
    setEvents(updatedEvents);
  };



  // 日付ヘッダーをビューごとにカスタマイズ
  const formatDayHeader = (info) => {
    const isToday = info.date.toDateString() === new Date().toDateString();
    const date = info.date.getDate(); // 日付部分
    const day = info.date.toLocaleDateString('ja-JP', { weekday: 'short' }); // 曜日（例: 土）


    // dayGridMonth ビューでは曜日のみを表示
    if (info.view.type === 'dayGridMonth') {
      return <div className={styles.calender_subtle_font}>{day}</div>;
    }

    // timeGridDay ビュー or timeGridWeek ビュー
    return (
      <div style={{ textAlign: 'center' }}>
        <div className={styles.calender_subtle_font}>{day}</div>
        <div className={`${styles.calender_day_box} ${styles.calender_main_num_font} ${isToday ? 'day-header-today' : ''}`}>{date}</div>
      </div>
    );

    return null;
  };

  /* 重複を確認する関数 */
  const isTimeConflict = (newEvent, existingEvents) => {
    return existingEvents.some((event) => {
      return (
        (newEvent.start < event.end && newEvent.end > event.start) || // 新しいイベントが既存のイベントに重なる
        (newEvent.end > event.start && newEvent.start < event.end)
      );
    });
  };


  const selectAllowHandler = (Info) => {
    if (!editableCheck()){
      return false;
    }
    const newEvent = {
      start: Info.start,
      end: Info.end,
    };
    // 重複がない場合のみ選択を許可
    return !isTimeConflict(newEvent, events);
  };

  // 日付クリックを特定の月以外では無効にする
  const handleDateClick = (info) => {
    if (!editableCheck()) {
      alert("この月は編集できません。");
      return;
    }
  };

  // 月が変更されたときに呼ばれる関数
  const handleDatesSet = () => {
    const currentMonth = getCurrentMonth();
    console.log("currentMonth: ", currentMonth);
    if (currentMonth){
      setEditableMonth(currentMonth); // 表示される月を更新
    }
  };

  // useEffectでカレンダーがレンダリングされた後に初期化
  useEffect(() => {
    const currentMonth = getCurrentMonth();
    if (currentMonth) {// currentMonthがnullの時にはセットしない
      setEditableMonth(currentMonth);
    }
  }, []);

  return (
    <>
      <div className={styles.calendarBackground}>


        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={calendarRef}
          initialView="dayGridMonth"
          locale="ja"
          events={events}
          selectable={isEditable}
          editable={isEditable} // ドラッグ＆ドロップを有効化
          selectMirror={true}
          select={handleSelect} // 範囲選択イベントハンドラ
          selectAllow={selectAllowHandler} //セレクトそのものが許可されるかどうか
          eventResizableFromStart={true} // イベントの開始時間もリサイズ可能に
          eventResize={handleEventResize} // イベントのリサイズハンドラ
          eventOverlap={false}
          slotEventOverlap={false}
          dateClick={handleDateClick} //クリックした月が編集可能かを判定
          datesSet={handleDatesSet} //クリックした月を記録
          eventContent={(arg) => (
            <div className={styles.event_block}>
              <div>{arg.timeText}</div> {/* 開始時間と終了時間 */}
            </div>
          )}
          buttonText={{
            today: '今日',
            month: '月',
            week: '週',
            day: '日',
            list: '予定リスト'
          }}
          headerToolbar={{
            left: 'prev,today,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          dayCellContent={(arg) => {
            if (arg.view.type === 'dayGridMonth') {
              return <div className='day_target month-view'>{arg.date.getDate()}</div>;
            }
            return null;
          }}
          allDayText="担当者"
          // timeGridWeek ビューでのみカスタム曜日ヘッダーを適用
          dayHeaderContent={formatDayHeader}
        />

      </div>

    </>
  );
};

export default CalendarComponent;