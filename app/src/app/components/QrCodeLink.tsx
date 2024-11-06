'use client';
import { UserContextProvider, useUserContext } from "@/contexts/UserContext";
import { SessionContextProvider } from "@/contexts/SessionContext";

export function QrCodeLink({...props}: any) {
    const {role} = useUserContext();

    if (!role) {
        return <p>こんにちは！まずはログインしましょう！</p>;
    }


    if (role === 'Owner' || role === 'Machine') {
        return <a href="/qr">QRコードページ</a>;
    }

    return null;
}

export default function QrCodeLinkWrapper({...props}: any){
    return (
        <SessionContextProvider>
        <UserContextProvider>
          <QrCodeLink {...props} />
        </UserContextProvider>
      </SessionContextProvider>
    )
}