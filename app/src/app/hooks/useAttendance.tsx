'use client';
import { supabase } from '@/lib/supabaseClient';
import { useAsyncWithErrorHandling } from '@/hooks/useAsyncWithErrorHandling'
import { UUID } from 'crypto';
import { responseCookiesToRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

interface AttResponse {
    data: string;
    message: string;
    error?: string;
}

export interface ShiftData {
    id: number,
    userId: string,
    start: string,
    end: string,
}


export function useAttendance() {
    const { result, error, loading, executeAsyncFunction } = useAsyncWithErrorHandling<AttResponse>();

    // サインアップ関数
    const getAttState = (userId: string) =>
        executeAsyncFunction(async () => {
            const response = await fetch('/api/att/get_state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const responseJson: AttResponse = await response.json();

            if (!response.ok) {
                throw new Error(responseJson.error || 'getShiftAva failed');
            }
            console.log("Successfully returend result");
            console.log("responseJson: ", responseJson);
            return responseJson;
        });

    const ActAtt = (userId: string, act: string, time: string) =>
        executeAsyncFunction(async () => {
            const response = await fetch('/api/att/act', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({userId, act, time})
            });

            const responseJson: AttResponse = await response.json();

            if (!response.ok){
                throw new Error(responseJson.error || 'editShiftAva failed');
            }
            return responseJson;
        });



    return { result, error, loading, getAttState, ActAtt };
}
