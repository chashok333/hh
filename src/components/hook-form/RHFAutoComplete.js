import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, Autocomplete, Chip } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
    children: PropTypes.node,
    name: PropTypes.string,
};

export default function RHFAutocomplete({ name, options, label, children, selectedValue, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            onChange={([, data]) => data}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    getOptionLabel={(option) => option?.label || option?.name || ''}
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={options}
                    isOptionEqualToValue={(option, value) => {
                        return option?.id == value?.id
                    }}

                    renderInput={(params) => {
                        return <TextField helperText={error?.message} error={!!error} label={label} {...params} />
                    }}
                />
            )}
        />
    );
}
