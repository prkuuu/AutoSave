import { useEffect, useCallback, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { debounce, omit, isEqual } from 'lodash';

// const AutoSave = ({ delay = 300, onSubmit, setLastSaved, setIsSaving }) => {
//     const { values, errors, initialValues } = useFormikContext();
//     const isSameValueAsInitialValue = async (v) => isEqual(v, initialValues);
//     const onFormSubmit = useCallback(async () => {
//         setIsSaving(true);
//         const v = omit(values, Object.keys(errors));
//         if (onSubmit && !(await isSameValueAsInitialValue(v))) {
//             await onSubmit(v);
//             setLastSaved(new Date());
//         }
//         setIsSaving(false);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [values, initialValues]);

//     // add delay of 300ms by default, or whatever delay prop is
//     useEffect(() => {
//         const timer = setTimeout(() => onFormSubmit(), delay);
//         return () => clearTimeout(timer);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [values, onFormSubmit, delay]);

//     return null;
// };

const AutoSave = ({ delay = 300, onSubmit, setLastSaved, setIsSaving }) => {
    const { values, errors, initialValues } = useFormikContext();

    const isSameValueAsInitialValue = async (v) => isEqual(v, initialValues);

    const debouncedSave = useMemo(
        () =>
            debounce(async (currentValues) => {
                setIsSaving(true); // Start saving
                const v = omit(currentValues, Object.keys(errors));
                if (onSubmit && !(await isSameValueAsInitialValue(v))) {
                    await onSubmit(v);
                    setLastSaved(new Date());
                }
                setIsSaving(false); // Finished saving
            }, delay),
        [values, initialValues, onSubmit, setIsSaving, setLastSaved, delay]
    );

    useEffect(() => {
        debouncedSave(values);
        return () => {
            debouncedSave.cancel();
        };
    }, [values, debouncedSave]);

    return null;
};

export default AutoSave;
