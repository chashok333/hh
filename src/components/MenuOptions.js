import { useState } from 'react';
// @mui
import { MenuItem, Stack, IconButton } from '@mui/material';
// import MenuPopover from './MenuPopover';
import Iconify from './Iconify';
import MenuPopover from './menu-popover/MenuPopover';

export default function MenuOptions({
    options,
    onClickOption,
    iconOptions
}) {


    const [openPopover, setOpenPopover] = useState(null);

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    return (
        <>
            <IconButton onClick={handleOpenPopover} {...iconOptions} >
                <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
            </IconButton>

            <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 180 }}>
                <Stack spacing={0.75}>
                    {options?.map((option) => (
                        <MenuItem
                            key={option.value}

                            onClick={() => {
                                onClickOption && onClickOption(option)
                                handleClosePopover()
                            }}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Stack>
            </MenuPopover>
        </>
    );
}

