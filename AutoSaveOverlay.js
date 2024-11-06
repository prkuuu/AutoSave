import styles from './AutoSaveOverlay.module.css';

const AutoSaveOverlay = ({ delay = 300, onSubmit, setLastSaved, setIsSaving }) => {
    return (
        <>
            <div className={styles.styles}></div>
            <div className={styles.spanner}></div>
        </>
    );
};

export default AutoSaveOverlay;
