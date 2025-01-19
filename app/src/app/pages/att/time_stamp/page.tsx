'use client'
import { useState, useEffect } from 'react';
import AttendBox from '@/components/attendance/attendBox';
import { withAuth } from '@/hooks/auth/withAuth';

function ClockPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [clockInTime, setClockInTime] = useState<Date | null>(null);
    const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleClock = () => {
        if (!clockInTime) {
            setClockInTime(new Date());
        } else {
            setClockOutTime(new Date());
        }
    };

    return (
        <div>
            <AttendBox />
        </div>
    );
}

export default withAuth(ClockPage);