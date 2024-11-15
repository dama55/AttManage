'use client';
import { useState, useEffect } from 'react';
import styles from '@/components/attendance/attendBox.module.css';
import { useAttendance } from '@/hooks/useAttendance';
import { useSessionContext } from '@/contexts/SessionContext';
import ControlButton from '@/components/ControlButton'

const CurrentStates: { [key: string]: string } = {
    Out: "退勤",
    In: "出勤",
    Break: "休憩",
};

const AttendBox = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [clockInTime, setClockInTime] = useState<Date | null>(null);
    const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
    const [remarks, setRemarks] = useState('');
    const { result, error, loading, getAttState, ActAtt } = useAttendance();
    const { session } = useSessionContext();
    const [stateAtt, setStateAtt] = useState('Out');


    // 現在時刻を1秒ごとに更新
    useEffect(() => {
        
        fetchState();
        
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchState = async ()=>{
        console.log("session: ",session);
        if (session){
            const response = await getAttState(session.user.id);
            if (response && response.data) {
                const state = response.data;
                console.log("state: ", state); // 状態文字列を使用
                setStateAtt(state);
            }
        }
    }

    // 打刻ボタンを押したときの処理
    const handleClock = () => {
        if (!clockInTime) {
            setClockInTime(new Date());
        } else {
            setClockOutTime(new Date());
        }
        
    };



    return (
        <div className={styles.container}>
            <div className={styles.title}><h1>{CurrentStates[stateAtt]}中</h1></div>
            <div className={styles.clockInfo}>
                {/* 日付 */}
                <p>日付: {currentTime.toLocaleDateString()}</p>
                
                {/* 現在時刻 */}
                <p>現在時刻: {currentTime.toLocaleTimeString()}</p>

                {/* 打刻開始時間と終了時間 */}
                <p>打刻開始時間: {clockInTime ? clockInTime.toLocaleTimeString() : '---'}</p>
                <p>打刻終了時間: {clockOutTime ? clockOutTime.toLocaleTimeString() : '---'}</p>

                {/* 打刻ボタン */}
                <ControlButton onClick={handleClock}>
                    {stateAtt == "In" ? "出勤打刻":"退勤打刻"}
                </ControlButton>

                {/* 備考欄 */}
                <textarea
                    className={styles.remarks}
                    placeholder="備考を入力してください..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                />
            </div>
        </div>
    );
};

export default AttendBox;