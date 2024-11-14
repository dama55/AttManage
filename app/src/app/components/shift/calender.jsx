'use client';
import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import styles from '@/components/shift/calender.module.css'
import '@/components/shift/calender.css';
import { useSessionContext } from '@/contexts/SessionContext';

import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CalendarComponent = ({
  events,
  setEvents,
  isEditable,
  editableMonth,
  setEditableMonth,
  initialView = 'dayGridMonth', //日付ビューを初期値に
  initialDate = new Date().toISOString(),
  initShiftData = (info, session) => {
    return {
      id: Math.floor(Math.random() * 9000000) + 1000000, //一時IDを付加する 
      userId: session.user.id,
      start: info.start,
      end: info.end,
      allDay: false,
      color: '#6495ED', // スカイブルー
      className: 'avaShift',
    };
  },
  handleDateClickActions = (clickedDate) => { },
  headerToolbar = {
    left: 'prev,today,next',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
}) => {
  // const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const { session } = useSessionContext();

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
      const newEvent = initShiftData(info, session);

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
    if (!isEditable) {
      console.log("isEditable: ", isEditable);
      return false
    }

    const currentMonth = getCurrentMonth();

    if (currentMonth.month == null || currentMonth.year == null) {
      //取得した月がnullの場合は編集できない
      console.log("currentMonthがnullになっている")
      return false;
    }

    if (currentMonth.month !== editableMonth.month || currentMonth.year !== editableMonth.year) {
      return false;
    }

    return true;
  }


  // イベントのサイズ変更を処理
  const handleEventResize = (resizeInfo) => {
    if (!isEditable) {
      return;
    }
    const { event } = resizeInfo;

    const updatedEvents = events.map((ev) => {
      if (ev.id === Number(event.id)) {
        return { ...ev, start: new Date(event.start), end: new Date(event.end) };
      } else {
        return { ...ev };
      }
    });
    setEvents(updatedEvents);
    // setEvents(updatedEvents);
    // resizeInfo.view.calendar.unselect();
  };

  /* イベントドロップ時の挙動を決定 */
  const handleEventDrop = (dropInfo) => {
    if (!isEditable) {
      return;
    }
    //ドロップしたイベントを取り出し
    const { event } = dropInfo;
    const updatedEvents = events.map((ev) => {
      //編集したイベントのデータを更新
      if (ev.id === Number(event.id)) {
        return { ...ev, start: new Date(event.start), end: new Date(event.end) };
      } else {
        return { ...ev };
      }
    });

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
    //編集状態じゃないなら選択できない
    if (!isEditable) {
      return false;
    }

    const selectedStartMonth = Info.start.getMonth() + 1; // 選択された開始日付の月（1月 = 1、2月 = 2 ...）
    const selectedStartYear = Info.start.getFullYear(); // 選択された開始日付の年
    const selectedEndMonth = Info.end.getMonth() + 1; // 選択された開始日付の月（1月 = 1、2月 = 2 ...）
    const selectedEndYear = Info.end.getFullYear(); // 選択された開始日付の年

    //選択範囲のどこかが別の月にかぶっているならセレクトできない
    if ((selectedStartMonth !== editableMonth.month || selectedStartYear !== editableMonth.year) ||
      (selectedEndMonth !== editableMonth.month || selectedEndYear !== editableMonth.year)) {
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
    console.log("handleDateClick was called !!!");
    console.log("info.dateStr: ", info.dateStr);
    handleDateClickActions(info.dateStr);
  };

  // 月が変更されたときに呼ばれる関数
  const handleDatesSet = () => {
    if (!isEditable) {
      const currentMonth = getCurrentMonth();

      // 現在の editableMonth と異なる場合のみ更新
      if (
        currentMonth &&
        (!editableMonth || currentMonth.month !== editableMonth.month || currentMonth.year !== editableMonth.year)
      ) {
        setEditableMonth(currentMonth);
      }
    }
  };

  // isEditableの値が更新される場合とページマウント時に，
  useEffect(() => {
    if (!isEditable) { // isEditableがfalseのときのみ実行
      const currentMonth = getCurrentMonth();
      if (currentMonth) { // currentMonthがnullでない場合のみ設定
        // setEditableMonth(currentMonth);
      }
    }
  }, [isEditable]);


  // 表示可能期間を表示
  const computeValidRange = () => {
    if (isEditable && editableMonth) {
      const { year, month } = editableMonth;
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // 月の最終日
      return {
        start: startDate,
        end: endDate,
      };
    }
    return {};// 編集状態じゃないときは制限しない
  };

  /* イベントの削除 */
  const handleDelete = (info) => {
    const deleted_events = events.filter(event => event.id !== info.event.id);
    setEvents(events.filter(event => event.id !== Number(info.event.id)));
  };

  const handleAdd = (info) => {
    const updatedEvents = events.map((ev) => {
      if (ev.id === Number(info.event.id) &&
        info.event.classNames.includes('reqShift') &&
        ev.req_num < 5) {
        return {
          ...ev,
          req_num: ev.req_num + 1,
          extendedProps: {
            ...ev.extendedProps,
            req_num: ev.req_num + 1  // カスタムデータを追加
          }
        }
      } else {
        return { ...ev };
      }
    });
    setEvents(updatedEvents);
  }

  const handleRemove = (info) => {
    const updatedEvents = events.map((ev) => {
      if (ev.id === Number(info.event.id) &&
        info.event.classNames.includes('reqShift') &&
        ev.req_num > 1) {
        return {
          ...ev,
          req_num: ev.req_num - 1,
          extendedProps: {
            ...ev.extendedProps,
            req_num: ev.req_num - 1  // カスタムデータを追加
          }
        };
      } else {
        return { ...ev };
      }
    });
    setEvents(updatedEvents);
  }


  return (
    <>
      <div className={styles.calendarBackground}>


        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={calendarRef}
          initialView={initialView}
          initialDate={initialDate}
          locale="ja"
          events={events}
          selectable={isEditable}
          editable={isEditable} // ドラッグ＆ドロップを有効化
          selectMirror={true}
          select={handleSelect} // 範囲選択イベントハンドラ
          selectAllow={selectAllowHandler} //セレクトそのものが許可されるかどうか
          eventResizableFromStart={true} // イベントの開始時間もリサイズ可能に
          eventResize={handleEventResize} // イベントのリサイズハンドラ
          eventDrop={handleEventDrop}
          eventOverlap={false}
          slotEventOverlap={false}
          dateClick={handleDateClick} //クリックした月が編集可能かを判定
          datesSet={handleDatesSet} //クリックした月を記録
          validRange={computeValidRange()} //表示可能領域を設定
          eventContent={(arg) => {
            // 月間ビューでは、時間を表示する
            // if (arg.view.type === 'dayGridMonth') {
            const startTime = arg.event.start ? arg.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            const endTime = arg.event.end ? arg.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            if (arg.event.classNames.includes('reqShift')) {  // クラス名で判定
              return (
                <div className={styles.event_block}>
                  <div className={styles.event_head}>
                    <div>{startTime} - {endTime}</div> {/* 時間範囲の表示 */}
                    {/* <div>要求シフト</div> */}
                    <div className={styles.event_count}>/{arg.event.extendedProps.req_num}</div> {/* extendedPropsから取得 */}
                  </div>
                  {/* インタラクション用のボタン */}
                  {isEditable && (
                    <div className={styles.buttonContainer}>
                      <div className={styles.button} onClick={() => handleDelete(arg)}>
                        <FaTrash />
                      </div>
                      <div className={styles.button} onClick={() => handleAdd(arg)} title="増加">
                        <FaPlus />
                      </div>
                      <div className={styles.button} onClick={() => handleRemove(arg)} title="減少">
                        <FaMinus />
                      </div>
                    </div>
                  )}
                </div>

              );
            } else {
              return (
                <div className={styles.event_block}>
                  <div>{startTime} - {endTime}</div> {/* 時間範囲の表示 */}
                  {isEditable && (
                    <div className={styles.buttonContainer}>
                      <div className={styles.button} onClick={() => handleDelete(arg)}>
                        <FaTrash />
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            // }
            // 他のビューではデフォルト表示
            // return (
            //   <div className={styles.event_block}>
            //     <div>{arg.timeText}</div>
            //   </div>
            // );
          }}
          buttonText={{
            today: '今日',
            month: '月',
            week: '週',
            day: '日',
            list: '予定リスト'
          }}
          headerToolbar={headerToolbar}
          allDayText="担当者"
          dayCellContent={(arg) => {
            //今日の日付を赤い丸で表示
            if (arg.view.type === 'dayGridMonth') {
              return <div className='day_target month-view'>{arg.date.getDate()}</div>;
            }
            return null;
          }}
          // timeGridWeek ビューでのみカスタム曜日ヘッダーを適用
          dayHeaderContent={formatDayHeader}
        />

      </div>

    </>
  );
};

export default CalendarComponent;