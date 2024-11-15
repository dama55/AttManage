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
            <ControlButton onClick={()=>{}}>シフト管理ページ</ControlButton>
        </div>
    )
}