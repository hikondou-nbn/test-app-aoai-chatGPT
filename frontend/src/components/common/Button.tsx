import { CommandBarButton, DefaultButton, IButtonProps } from "@fluentui/react";

import styles from './Button.module.css';

interface ButtonProps extends IButtonProps {
  onClick: () => void;
  text: string | undefined;
}

export const ShareButton: React.FC<ButtonProps> = ({ onClick, text }) => {

  return (
    <CommandBarButton
      className={styles.shareButtonRoot}
      iconProps={{ iconName: 'Share' }}
      onClick={onClick}
      text={text}
    />
  )
}

export const HistoryButton: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <DefaultButton
      className={styles.historyButtonRoot}
      text={text}
      iconProps={{ iconName: 'History' }}
      onClick={onClick}
    />
  )
}

//20240226 add_start ChatVersionButton
export const ChatVersionButton: React.FC<ButtonProps> = ({onClick, text}) => {
  return (
    <DefaultButton
      className={styles.chatVersionButtonRoot}
      text={text}
      iconProps={{ iconName: 'ChatGPT'}}
      onClick={onClick}
    />
  )
}
//20240226 add_end ChatVersionButton