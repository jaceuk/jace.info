import styles from './Overlay.module.scss';

interface Props {
  children: React.ReactNode;
}

export default function Overlay({ children }: Props) {
  return <div className={styles.overlay}>{children}</div>;
}
