'use client';
import { useEffect } from 'react';
import { useRootLayout, RootLayoutProvider } from '@/contexts/RootLayoutContext';
import CalendarComponent from '@/components/shift/calender';


export function ExamplePage() {
  const { sidePeakContent, setSidePeakContent, setPopUpContent } = useRootLayout();




  return (
    <CalendarComponent/>
  );
}

export default function ExamplePageWrapper() {
  return (
    <RootLayoutProvider>
      <ExamplePage />
    </RootLayoutProvider>
  );
}