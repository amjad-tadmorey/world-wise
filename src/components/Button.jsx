import styles from './Button.module.css'

export default function Button({ children, onClick, type }) {
  return (
    <div className={`${styles.btn} ${styles[type]}`} onClick={onClick}>{children}</div>
  )
}
