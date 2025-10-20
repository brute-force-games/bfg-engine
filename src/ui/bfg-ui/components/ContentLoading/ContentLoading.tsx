import { Card, Stack, Typography, Refresh } from '../..';
import styles from './ContentLoading.module.css';


interface IContentLoadingProps {
  message: string;
}

export const ContentLoading = ({ message }: IContentLoadingProps) => {
  return (
    <div className={styles.loadingContainer}>
      <Card className={styles.loadingCard}>
        <Stack 
          direction="column" 
          spacing={3} 
          alignItems="center" 
          justifyContent="center"
        >
          <div className={styles.spinnerContainer}>
            <Refresh width={48} height={48} />
          </div>
          <Typography 
            variant="h5" 
            align="center"
            color="primary"
          >
            {message}
          </Typography>
          <div className={styles.dotsContainer}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        </Stack>
      </Card>
    </div>
  );
};