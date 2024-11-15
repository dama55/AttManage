// hooks/useShiftAva.ts
'use client';
import { supabase } from '@/lib/supabaseClient';
import { useAsyncWithErrorHandling } from '@/hooks/useAsyncWithErrorHandling'
import { UUID } from 'crypto';
import { responseCookiesToRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

interface ShiftResponse {
    data: ShiftData[];
    message: string;
    error?: string;
}

export interface ShiftData {
    id: number,
    userId: string,
    start: string,
    end: string,
}


export function useShiftAva() {
    const { result, error, loading, executeAsyncFunction } = useAsyncWithErrorHandling<ShiftResponse>();

    // サインアップ関数
    const getShiftAva = (userId: string, getStart: Date, getEnd: Date) =>
        executeAsyncFunction(async () => {
            const response = await fetch('/api/shift_ava/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, getStart, getEnd }),
            });

            const responseJson: ShiftResponse = await response.json();

            if (!response.ok) {
                throw new Error(responseJson.error || 'getShiftAva failed');
            }
            console.log("Successfully returend result");
            console.log("responseJson: ", responseJson);
            return responseJson;
        });

    const editShiftAva = (deleteStart: string, deleteEnd: string, preData: ShiftData[], newData: ShiftData[]) =>
        executeAsyncFunction(async () => {
            const response = await fetch('/api/shift_ava/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({deleteStart, deleteEnd, preData, newData})
            });

            const responseJson: ShiftResponse = await response.json();

            if (!response.ok){
                throw new Error(responseJson.error || 'editShiftAva failed');
            }
            return responseJson;
        });



    return { result, error, loading, getShiftAva, editShiftAva };
}
