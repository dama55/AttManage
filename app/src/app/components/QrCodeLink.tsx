'use client';

export default function QrCodeLink(props: any) {
    
    if (!props.role) {
        return <p>こんにちは！まずはログインしましょう！</p>;
    }

    const role = props.role;

    if (role === 'Owner' || role === 'Machine') {
        return <a href="/qr">QRコードページ</a>;
    }

    return null;
}