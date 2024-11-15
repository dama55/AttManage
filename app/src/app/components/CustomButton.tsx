import React, { ReactNode } from 'react';
import styles from './CustomButton.module.css';

type CustomButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

const CustomButton = ({ onClick, children }: CustomButtonProps) => {
  return (
    <button className={styles.custom_button} onClick={onClick}>
      {children}
    </button>
  );
};

export default CustomButton;