import { NextResponse } from 'next/server';

// 引数として受け取ると想定される関数型の定義
type AsyncFunction = (...args: any[]) => Promise<any>;

// try catch構文をここでまとめる．
export function withErrorHandling(fn: AsyncFunction) {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      } else {
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
      }
    }
  };
}
