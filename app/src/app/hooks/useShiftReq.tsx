// hooks/useShiftAve.ts
'use client';
import { supabase } from '@/lib/supabaseClient';
import { useAsyncWithErrorHandling } from '@/hooks/useAsyncWithErrorHandling'
import { UUID } from 'crypto';
import { responseCookiesToRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

interface ShiftResponse {
    data: ShiftReqData[];
    message: string;
    error?: string;
}

export interface ShiftReqData {
    id: number,
    req_num: number,
    start: string,
    end: string,
}


export function useShiftReq() {
    const { result, error, loading, executeAsyncFunction } = useAsyncWithErrorHandling<ShiftResponse>();

    // サインアップ関数
    const getShiftReq = (getStart: Date, getEnd: Date) =>
        executeAsyncFunction(async () => {
            const response = await fetch('/api/shift_req/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ getStart, getEnd }),
            });
            console.log("Response: ", response);
            const responseJson: ShiftResponse = await response.json();

            if (!response.ok) {
                throw new Error(responseJson.error || 'getShiftReq failed');
            }
            console.log("Successfully returend result");
            console.log("responseJson: ", responseJson);
            return responseJson;
        });

    const editShiftReq = (deleteStart: string, deleteEnd: string, preData: ShiftReqData[], newData: ShiftReqData[]) =>
        executeAsyncFunction(async () => {
            const response = await fetch('/api/shift_req/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({deleteStart, deleteEnd, preData, newData})
            });

            const responseJson: ShiftResponse = await response.json();

            if (!response.ok){
                throw new Error(responseJson.error || 'editShiftAve failed');
            }
            return responseJson;
        });



    return { result, error, loading, getShiftReq, editShiftReq };
}
