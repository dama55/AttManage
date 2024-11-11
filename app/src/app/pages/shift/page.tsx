'use client';
import CalendarComponent from "@/components/shift/calender";
import { useState } from "react";

export default function SignUpPage(){
    const [events, setEvents] = useState([]);
    const [isEditable, setIsEditable] = useState(false);
    return (
        <div>
            <h1>シフト管理</h1>
            <CalendarComponent events={events} setEvents={setEvents} isEditable={isEditable} />
            <p>このページは作成中です...</p>
        </div>
    );
}