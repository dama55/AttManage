'use client';
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import styles from '@/components/shift/calender.module.css'
import { useEffect } from 'react';
import '@/components/shift/calender.css';

const CalendarComponent = () => {
  const handleDateClick = (info) => {
    alert(`Clicked date: ${info.dateStr}`);
  };

  const events = [
    { title: 'Event 1', date: '2024-11-10' },
    { title: 'Event 2', date: '2024-11-15' },
  ];

  const getCSSVariable = (name) => {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
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
      <div  style={{ textAlign: 'center'}}>
        <div className={styles.calender_subtle_font}>{day}</div>
        <div className={`${styles.calender_day_box} ${styles.calender_main_num_font} ${isToday ? 'day-header-today': ''}`}>{date}</div>
      </div>
    );

    return null;
  };





  return (
    <div className={styles.calendarBackground}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        events={events}
        dateClick={handleDateClick}
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
  );
};

export default CalendarComponent;