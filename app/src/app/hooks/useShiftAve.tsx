// hooks/useShiftAve.ts
'use client';
import { supabase } from '@/lib/supabaseClient';
import { useAsyncWithErrorHandling } from '@/hooks/useAsyncWithErrorHandling'
import { UUID } from 'crypto';
import { responseCookiesToRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

interface ShiftResponse {
    message: string;
    error?: string;
}

interface ShiftData {
    id: number,
    userId: string,
    start: string,
    end: string,
}


export function useShiftAve() {
    const { result, error, loading, executeAsyncFunction } = useAsyncWithErrorHandling<string>();

    // サインアップ関数
    const getShiftAve = (userId: string, getStart: string, getEnd: string) =>
        executeAsyncFunction(async () => {
            const response = await fetch('/api/shift_ave/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, getStart, getEnd }),
            });

            const responseJson: ShiftResponse = await response.json();

            if (!response.ok) {
                throw new Error(responseJson.error || 'getShiftAve failed');
            }
            return responseJson.message;
        });

    const editShiftAve = (deleteStart: string, deleteEnd: string, preData: ShiftData[], newData: ShiftData[]) =>
        executeAsyncFunction(async () => {
            const response = await fetch('/api/shift_ave/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({deleteStart, deleteEnd, preData, newData})
            });

            const responseJson: ShiftResponse = await response.json();

            if (!response.ok){
                throw new Error(responseJson.error || 'editShiftAve failed');
            }
            return responseJson.message;
        });



    return { result, error, loading, getShiftAve, editShiftAve };
}
