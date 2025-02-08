import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, Autocomplete, Chip } from '@mui/material';

// ----------------------------------------------------------------------

RHFMultiSelect.propTypes = {
    children: PropTypes.node,
    name: PropTypes.string,
};

export default function RHFMultiSelect({ name, options, label, placeholder, children, defaultOptions, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            onChange={([, data]) => data}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    multiple
                    label
                    options={options}
                    getOptionLabel={(option) => option.label}
                    defaultValue={defaultOptions || []}
                    filterSelectedOptions
                    // getOptionDisabled={(option) => {
                    //     return option?.disabled ? true : false
                    // }}
                    onChange={(event, newValue) => {
                        field?.onChange(newValue)
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            placeholder={label}
                            error={!!error} helperText={error?.message}
                        />
                    )}
                />
            )}
        />
    );
}
