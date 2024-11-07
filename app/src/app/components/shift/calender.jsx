'use client';
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import styles from '@/components/shift/calender.module.css'
import { useEffect } from 'react';

const CalendarComponent = () => {
  const handleDateClick = (info) => {
    alert(`Clicked date: ${info.dateStr}`);
  };

  const events = [
    { title: 'Event 1', date: '2024-11-10' },
    { title: 'Event 2', date: '2024-11-15' },
  ];

  // 土日セルにクラスを適用する関数
  const applyWeekendStyles = () => {
    const weekendCells = document.querySelectorAll('.fc-day-sat.fc-daygrid-day, .fc-day-sun.fc-daygrid-day');
    weekendCells.forEach((cell) => {
      cell.classList.add(styles.weekendColor);
    });
  };

  useEffect(() => {
    // 曜日ヘッダーセルにcelldayoftheweekクラスを追加
    const dayOfWeekElements = document.querySelectorAll('.fc-col-header-cell');
    dayOfWeekElements.forEach((element) => {
      element.classList.add(styles.celldayoftheweek);
    });
    // カレンダーの上部 要素に noTopBorder クラスを追加
    const scrollGridElement = document.querySelector('.fc-scrollgrid');
    if (scrollGridElement) {
      scrollGridElement.classList.add(styles.noTopBorder);
    }



    // 土日セルに色を設定
    applyWeekendStyles();
  }, []);

  return (
    <div className={styles.calendarBackground}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        events={events}
        dateClick={handleDateClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        dayCellContent={(arg) => (
          <div>
            {arg.date.getDate()}
          </div>
        )}
        dayCellDidMount={(info) => {
          const dayNumberElement = info.el.querySelector('.fc-daygrid-day-top');
          if (dayNumberElement) {
            dayNumberElement.classList.add(styles.dayText); // CSSモジュールのクラスを適用
          }
        }}
        viewDidMount={applyWeekendStyles} // ビュー切り替え後に土日スタイルを再適用
        datesSet={applyWeekendStyles}     // 日付範囲が更新されるたびに土日スタイルを再適用
      />
    </div>
  );
};

export default CalendarComponent;