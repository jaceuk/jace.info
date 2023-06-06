import styles from './Alert.module.scss';
import { CheckCircle } from 'iconoir-react';
import { WarningCircle } from 'iconoir-react';

interface Props {
  children: React.ReactNode;
  type: string;
}

export default function Alert({ children, type }: Props) {
  return (
    <div className={`${styles.container} ${styles[type]}`} role={type === 'error' ? 'alert' : undefined}>
      <div className={styles.iconContainer}>
        {type === 'success' && <CheckCircle />}
        {type === 'error' && <WarningCircle />}
      </div>
      <p className={styles.textContainer}>{children}</p>
    </div>
  );
}
