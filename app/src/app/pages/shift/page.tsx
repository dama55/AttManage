'use client'
import styles from '@/pages/styles.module.css';
import ControlButton from '@/components/ControlButton';
import { useRouter } from 'next/navigation';


export default function HomePage(){
    const handleClick = () => {
        router.push('/pages/shift');
    }
    const router = useRouter();
    return (
        <div className={styles.container}>
            <ControlButton onClick={()=>{router.push('/pages/shift/ava');}}>ユーザーシフト設定ページ</ControlButton>
            <ControlButton onClick={()=>{router.push('/pages/shift/req');}}>オーナーシフト要求決定ページ</ControlButton>
            <ControlButton onClick={()=>{router.push('/pages/shift/plan');}}>シフト自動割り当てページ</ControlButton>
        </div>
    )
}