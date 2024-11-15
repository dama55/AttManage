// hooks/useShiftAve.ts
'use client';
import { useAsyncWithErrorHandling } from '@/hooks/useAsyncWithErrorHandling'
import { TypeAssiShift, TypeAvaShift} from '@/types/shiftTypes';

interface ShiftResponse {
    result: ShiftPlanData;
    message: string;
    error?: string;
}

export interface ShiftPlanData {
    avaShifts: TypeAvaShift[],
    assiShifts: TypeAssiShift[],
}


export function useShiftPlan() {
    const { result, error, loading, executeAsyncFunction } = useAsyncWithErrorHandling<ShiftResponse>();

    // シフト再計算関数
    const calcShiftPlan = (getStart: Date, getEnd: Date) =>
        executeAsyncFunction(async () => {
            const response = await fetch('/api/shift_plan/calc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ getStart, getEnd, roles: ["Owner", "Employee"] }),
            });
            console.log("Response: ", response);
            const responseJson: ShiftResponse = await response.json();

            if (!response.ok) {
                throw new Error(responseJson.error || 'useShiftPlan failed');
            }
            console.log("Successfully returend result");
            console.log("responseJson: ", responseJson);
            return responseJson;
        });
    
    // 割り当て済みシフト取り出し関数
    const getShiftPlan = (getStart: Date, getEnd: Date) =>
        executeAsyncFunction(async () => {
            const response = await fetch('/api/shift_plan/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ getStart, getEnd }),
            });
            console.log("Response: ", response);
            const responseJson: ShiftResponse = await response.json();

            if (!response.ok) {
                throw new Error(responseJson.error || 'useShiftPlan failed');
            }
            console.log("Successfully returend result");
            console.log("responseJson: ", responseJson);
            return responseJson;
        });
    
    // 割り当て済みシフト編集関数
    const editShiftPlan = (deleteStart: string, deleteEnd: string, preData: TypeAvaShift[], newData: TypeAvaShift[]) =>
        executeAsyncFunction(async () => {
            const response = await fetch('/api/shift_plan/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({deleteStart, deleteEnd, preData, newData})
            });

            const responseJson: ShiftResponse = await response.json();

            if (!response.ok){
                throw new Error(responseJson.error || 'editShiftPlan failed');
            }
            return responseJson;
        });



    return { result, error, loading, calcShiftPlan, getShiftPlan, editShiftPlan,  };
}
