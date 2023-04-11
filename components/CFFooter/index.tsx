import styles from './CFFooter.module.css';

const CFFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.container}>
      <div className={styles.copyright}>
        <span>&copy;</span>
        <span>{year}</span>
        <span>Chainlink Foundation</span>
      </div>

      <div className={styles.terms_privacy}>
        <span>Privacy Policy</span>
        <span>Terms of Use</span>
      </div>
    </footer>
  );
};

export default CFFooter;
