// hooks/useAsyncWithErrorHandling.ts
import { useState } from 'react';

interface AsyncResult<T> {
    result: T | null;
    error: string | null;
    loading: boolean;
}

export function useAsyncWithErrorHandling<T>() {
    const [state, setState] = useState<AsyncResult<T>>({
        result: null,
        error: null,
        loading: false,
    });

    // 任意の非同期関数を受け取り、エラーハンドリングを含めて実行する
    const executeAsyncFunction = async (asyncFunction: () => Promise<T>) => {
        //エラーハンドラの初期化
        setState({ result: null, error: null, loading: true });
        try {
            //resultはレスポンスをそのままいれる．エラーはなし
            const result = await asyncFunction();
            setState({ result, error: null, loading: false });
        } catch (err) {
            //エラーが発生したら，resultは設定せずerrorのみを設定．
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setState({ result: null, error: errorMessage, loading: false });
            console.error("Error:", errorMessage);
        }
    };

    return { ...state, executeAsyncFunction };
}
