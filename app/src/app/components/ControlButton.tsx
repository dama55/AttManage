import React, { ReactNode } from 'react';
import styles from './ControlButton.module.css';

type ControlButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

const ControlButton = ({ onClick, children }: ControlButtonProps) => {
  return (
    <button className={styles.custom_button} onClick={onClick}>
      {children}
    </button>
  );
};

export default ControlButton;