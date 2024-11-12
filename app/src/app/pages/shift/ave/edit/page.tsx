'use client';
import React, { useState, useEffect } from 'react';
import { useRootLayout, RootLayoutProvider } from '@/contexts/RootLayoutContext';
import CalendarComponent from '@/components/shift/calender';
import CustomButton from '@/components/CustomButton';
import styles from '@/pages/shift/ave/edit/edit.module.css'
import { useShiftAve } from '@/hooks/useShiftAve';


export default function ExamplePage() {
  const { sidePeakContent, setSidePeakContent, setPopUpContent } = useRootLayout();
  const [pre_events, setPreEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const { result, error, loading, getShiftAve, editShiftAve } = useShiftAve();

  

  const editHandler = () => {
    setIsEditable(true);
  };

  const finHandler = () => {
    setIsEditable(false);
  };

  const applyHandler = () => {
    editShiftAve()
  };


  return (
    <>
      <h1>{isEditable ? "編集モード" : "閲覧モード"}</h1>
      {!isEditable ? <CustomButton onClick={editHandler}><span className={styles.button_text}>編集</span></CustomButton> : null}
      <CalendarComponent events={events} setEvents={setEvents} isEditable={isEditable} />
      {isEditable ?
        <>
          <CustomButton onClick={finHandler}><span className={styles.button_text}>完了</span></CustomButton>
          <CustomButton onClick={applyHandler}><span className={styles.button_text}>適用</span></CustomButton>
        </>
        :
        null
      }

    </>
  );
}