import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { debounce } from 'lodash';
import httpSer from 'src/utils/httpSer';
import { CircularProgress } from '@mui/material';

export default function BBAutocomplete({ label, id, options, inputHandler, error, serverConfig, customLabel, ...other }) {

    const [optionsList, setOptinsList] = React.useState(options);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!serverConfig)
            setOptinsList(options)
    }, [options])

    const handleBlurParentAutoComplete = (searchVal) => {
        if (!searchVal) {
            return []
        }
        setLoading(true)
        httpSer.get(serverConfig?.url, {
            params: {
                ...serverConfig?.params,
                search: searchVal
            }
        }).then(re => re.data).then((dataa) => {
            setLoading(false)
            setOptinsList(dataa || [])
        }).catch(() => {
            setLoading(false)
        })
    }

    const debounceChangeHandler = debounce((newVal) => {
        if (serverConfig)
            handleBlurParentAutoComplete(newVal)
    }, 500);

    return (
        <Autocomplete
            getOptionLabel={(option) => {
                if (customLabel) {
                    return customLabel(option)
                }
                return option?.label || option?.name || option?.fullname || '';// option?.id + (option?.label || option?.name || option?.fullname || '')
            }}
            options={optionsList}
            isOptionEqualToValue={(option, value) => {
                return option?.id == value?.id
            }}
            {...other}
            onInputChange={(event, newInputValue) => {
                if (event?.type == 'change')
                    debounceChangeHandler(newInputValue)
            }}
            renderInput={(params) => {
                return <TextField label={label} {...params}
                    helperText={error?.message} error={!!error}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }} />
            }}
        />
    );
}
