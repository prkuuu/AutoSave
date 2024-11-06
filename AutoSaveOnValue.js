import { useEffect, useState, useCallback, useRef } from 'react';
import { useFormikContext } from 'formik';
import { debounce } from 'lodash';

const AutoSaveOnValue = ({ delay = 3000, onSubmit }) => {
    const { values, initialValues } = useFormikContext();
    // eslint-disable-next-line
    const [saveStatus, setSaveStatus] = useState('Saved');
    const prevValuesRef = useRef(initialValues);

    // Check if values have changed since last save
    const isValuesChanged = useCallback(() => {
        return JSON.stringify(values) !== JSON.stringify(prevValuesRef.current);
    }, [values]);

    // Debounce the save function
    // eslint-disable-next-line
    const debouncedSave = useCallback(
        debounce(async (currentValues) => {
            setSaveStatus('Saving...');
            try {
                await onSubmit(currentValues);
                prevValuesRef.current = currentValues;
                setSaveStatus('Saved');
            } catch (error) {
                console.error('Save failed:', error);
                setSaveStatus('Save failed');
            }
        }, delay),
        [delay, onSubmit]
    );

    // Effect to trigger the debounced save function when values change
    useEffect(() => {
        if (isValuesChanged()) {
            debouncedSave(values);
        }
        // Clean up the debounce timer on component unmount
        return () => {
            debouncedSave.cancel();
        };
    }, [values, isValuesChanged, debouncedSave]); // Ensure dependencies are correct

    return;
    //<p className='auto-save-status'>{saveStatus}</p>;
};

export default AutoSaveOnValue;
