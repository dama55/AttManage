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
import { escape } from 'querystring';

const CalendarComponent = ({
  events,
  setEvents,
  isEditable,
  editableMonth,
  setEditableMonth,
  initialView = 'dayGridMonth', //日付ビューを初期値に
  initialDate = new Date().toISOString(),
  initShiftData,
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

  /* 新しいオブジェクト生成時にの処理 */
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

  // /* 現状のカレンダーの状態が編集可能なのかどうかを判定 */
  // const editableCheck = () => {
  //   if (!isEditable) {
  //     console.log("isEditable: ", isEditable);
  //     return false
  //   }

  //   const currentMonth = getCurrentMonth();

  //   if (currentMonth.month == null || currentMonth.year == null) {
  //     //取得した月がnullの場合は編集できない
  //     console.log("currentMonthがnullになっている")
  //     return false;
  //   }

  //   if (currentMonth.month !== editableMonth.month || currentMonth.year !== editableMonth.year) {
  //     return false;
  //   }

  //   return true;
  // }


  // イベントのサイズ変更を処理
  const handleEventResize = (resizeInfo) => {
    if (!isEditable) {
      return;
    }
    const { event } = resizeInfo;
    //特定のイベントをリサイズ
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
      // イベントタイプが同じであることが必須の条件
      console.log("New event: ", newEvent);
      console.log("Compared event: ", event);
      if (newEvent.extendedProps.event_type === event.extendedProps.event_type) {
        return newEvent.start < event.end && newEvent.end > event.start;
      } else {
        return false;
      }
    });
  };

  /* 表示上で，選択状態にするかどうかの判定 */
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


    //仮のデータを作成
    const newEvent = initShiftData(Info, session);
    // 重複がない場合のみ選択を許可
    return !isTimeConflict(newEvent, events);
  };

  // 日付クリックを特定の月以外では無効にする
  //サイドピークなどで利用する予定
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

  // isEditableの値が更新される場合とページマウント時に，現在見ている月を更新
  useEffect(() => {
    if (!isEditable) { // isEditableがfalseのときのみ実行
      const currentMonth = getCurrentMonth();
      if (currentMonth) { // currentMonthがnullでない場合のみ設定
        // setEditableMonth(currentMonth);
      }
    }
  }, [isEditable]);


  // 編集モードで表示可能期間を表示
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

  /* シフト要求人数req_numを増加させる */
  const handleAdd = (info) => {
    const updatedEvents = events.map((ev) => {
      if (ev.id === Number(info.event.id) &&
        info.event.classNames.includes('reqShift') &&
        ev.extendedProps.req_num < 5) {
        return {
          ...ev,
          req_num: ev.extendedProps.req_num + 1,
          extendedProps: {
            ...ev.extendedProps,
            req_num: ev.extendedProps.req_num + 1  // カスタムデータを追加
          }
        }
      } else {
        return { ...ev };
      }
    });
    setEvents(updatedEvents);
  }

  /* シフト要求人数req_numを減少させる */
  const handleRemove = (info) => {
    const updatedEvents = events.map((ev) => {
      if (ev.id === Number(info.event.id) &&
        info.event.classNames.includes('reqShift') &&
        ev.extendedProps.req_num > 1) {
        return {
          ...ev,
          req_num: ev.extendedProps.req_num - 1,
          extendedProps: {
            ...ev.extendedProps,
            req_num: ev.extendedProps.req_num - 1  // カスタムデータを追加
          }
        };
      } else {
        return { ...ev };
      }
    });
    setEvents(updatedEvents);
  }

  // イベントの内容を描画する関数
  const renderEventContent = (arg) => {
    const startTime = arg.event.start ? arg.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const endTime = arg.event.end ? arg.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const isReqShift = arg.event.classNames.includes('reqShift'); // reqShift クラスの確認
    const isAssiShift = arg.event.classNames.includes('assiShift'); // reqShift クラスの確認
    const isAssiShiftNoUer = arg.event.classNames.includes('assiShiftNoUser'); // reqShift クラスの確認
    const isEventEditable = arg.event.extendedProps.eventEditable; // イベントの editable プロパティを確認

    console.log("arg.event: ", arg.event);
    console.log("arg.event.extendedProps.eventEditable: ", arg.event.extendedProps.eventEditable);


    return (
      <div className={styles.event_block}>
        <div className={styles.event_head}>
          <div>{startTime} - {endTime}</div>
          {isReqShift && (
            <div className={styles.event_count}>必要人数: {arg.event.extendedProps.req_num}</div>
          )}
          {isAssiShift && (
            <div className={styles.event_count}>必要人数: {arg.event.extendedProps.userIds.length}/{arg.event.extendedProps.req_num}</div>
          )}
        </div>
        {isAssiShiftNoUer && (
          <div className={styles.event_count}>従業員が不足しています！</div>
        )}
        {arg.event.extendedProps.event_type === "3" && (
          <div className={styles.nameContainer}>
            {arg.event.extendedProps.userIds.map((id) => (
              <span key={id} className={styles.userName}>
                {arg.event.extendedProps.userNames[id]}
              </span>
            ))}
          </div>
        )}
        {isEventEditable && isEditable && ( // editable が true の場合のみボタンを表示
          <div className={styles.buttonContainer}>
            <div className={styles.button} onClick={() => handleDelete(arg)}>
              <FaTrash />
            </div>
            {isReqShift && (
              <>
                <div className={styles.button} onClick={() => handleAdd(arg)} title="増加">
                  <FaPlus />
                </div>
                <div className={styles.button} onClick={() => handleRemove(arg)} title="減少">
                  <FaMinus />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };


  // イベントの編集（ドラッグやリサイズ）を許可するかどうかをチェックする関数
  const checkEventAllow = (dropInfo, draggedEvent) => {
    console.log("checkEventAllow called");
    console.log("dropInfo:", dropInfo);
    console.log("draggedEvent:", draggedEvent);
    console.log("draggedEvent.extendedProps:", draggedEvent.extendedProps);
    console.log("draggedEvent.start:", draggedEvent.start);

    // ドロップ先情報からイベントを取得
    const event = draggedEvent;

    return true;

    //そもそも編集モードじゃないか，イベントが編集可能ではない
    if (!isEditable || !event.extendedProps.eventEditable) {
      return false;
    }

  };


  return (
    <>
      <div className={styles.calendarBackground}>


        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={calendarRef}
          initialView={initialView}
          initialDate={initialDate}
          locale="ja"
          events={events}//イベント
          selectable={isEditable} //選択可能フラグ
          editable={isEditable} //編集可能フラグ
          selectMirror={isEditable}//ドラッグなどのリアルタイムレンダリング有効化
          select={handleSelect}//セレクト状態のデータ段階でのハンドラ
          selectAllow={selectAllowHandler}//セレクト状態の表示段階でのハンドラ
          eventResizableFromStart={true}//イベント開始時間もリサイズ可能にする
          eventResize={handleEventResize}//イベントリサイズハンドラ
          eventDrop={handleEventDrop} //イベントドロップハンドラ
          eventOverlap={false} //全体カレンダー表示でイベントの重なり表示を無効化
          slotEventOverlap={false} //時間表示のあるビューでイベントの重なり表示を無効化
          dateClick={handleDateClick} //クリック時ハンドラ
          datesSet={handleDatesSet} //日付変更時ハンドラ
          validRange={computeValidRange()} //表示可能範囲を指定
          eventContent={renderEventContent} // イベントの内容を描画
          eventAllow={checkEventAllow} //ドラッグアンドドロップ，リサイズを許可するか判定する関数
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
            if (arg.view.type === 'dayGridMonth') {
              return <div className='day_target month-view'>{arg.date.getDate()}</div>;
            }
            return null;
          }}
          dayHeaderContent={formatDayHeader}
        />

      </div>

    </>
  );
};

export default CalendarComponent;