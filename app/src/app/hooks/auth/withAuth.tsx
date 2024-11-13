/* 認証が必要なページを定義するホック */
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { Session } from '@supabase/supabase-js';

// export function withAuth(Component: React.ComponentType) {
//   return function AuthenticatedComponent(props: any) {
//     const [session, setSession] = useState<Session | null>(null);
//     const router = useRouter();

//     useEffect(() => {
//       // 非同期でセッションを取得
//       const fetchSession = async () => {
//         const { data } = await supabase.auth.getSession();
//         setSession(data?.session);
//         if (!data?.session) {
//           router.push('/login'); // 未サインインの場合にリダイレクト
//         }
//       };

//       fetchSession();

//       // セッション状態の変化を監視
//       const { data: authListener } = supabase.auth.onAuthStateChange(
//         async (_event, session) => {
//           setSession(session);
//           if (!session) {
//             router.push('/login');
//           }
//         }
//       );

//       return () => {
//         authListener.subscription.unsubscribe();
//       };
//     }, []);

//     if (!session) {
//       return <div>Loading...</div>; // ロード中の画面
//     }

//     return <Component {...props} />;
//   };
// }

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@/contexts/SessionContext';

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const { session, handleSignIn } = useSessionContext();
    const [sessionLoading, setSessionLoading] = useState(true); // セッションの取得中かどうかを示すフラグ
    const router = useRouter();

    useEffect(() => {
      // 認証情報の取得が完了した場合にフラグをオフにする
      if (session === undefined) {
        console.log("Session is Undefined!!")
        setSessionLoading(true);
      }else{
        setSessionLoading(false);
      }

      // 認証情報の取得が完了し、かつセッションがない場合のみリダイレクト
      if (!session && !sessionLoading) {
        console.log("Not signed in. Redirecting to login.");
        handleSignIn(); 
      }
    }, [session, sessionLoading]);

    // セッション取得中のローディング画面
    if (sessionLoading) {
      return <div>Loading...</div>;
    }

    // セッションが存在する場合のみ、認証が必要なコンポーネントを表示
    return <Component {...props} />;
  };
}
