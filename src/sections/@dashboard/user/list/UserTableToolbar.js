import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Switch, FormControlLabel } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import BBAutocomplete from 'src/components/BBAutocomplete';
import { STATUS_LIST } from 'src/pages/users/constants';

// ----------------------------------------------------------------------

UserTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterRole: PropTypes.any,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.object),
};

export default function UserTableToolbar({ filterName, filterRole, onFilterName, onFilterRole, optionsRole, deleted, status, onChangeDeleted }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        select
        label="Role"
        value={filterRole}
        onChange={onFilterRole}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsRole.map((option) => (
          <MenuItem
            key={`role-${option?.id}`}
            value={option?.id}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option?.role_name}
          </MenuItem>
        ))}
      </TextField>
      <BBAutocomplete sx={{
        width: 500
      }} onChange={(evnt, selected) => onChangeDeleted && onChangeDeleted(selected?.id)}
        defaultValue={STATUS_LIST?.find((s) => s.id == status) || null} label={"Status"} options={STATUS_LIST || []} error={false} />
      {/* <FormControlLabel
        control={<Switch checked={deleted} onChange={onChangeDeleted} />}
        label="Deleted"
      /> */}
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search user..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
