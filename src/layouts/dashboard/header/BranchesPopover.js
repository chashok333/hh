import { useState } from 'react';
// @mui
import { Badge, Chip, MenuItem, Stack } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import Image from '../../../components/Image';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import useBbgUsers from 'src/hooks/bbgUsers';
import Iconify from 'src/components/Iconify';
import { filterBranches } from 'src/common/commonMethods';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

export default function BranchesPopover() {
    const { allLangs, currentLang, onChangeLang } = useLocales();
    const { branches, handleBranchUpdate, baseBranch } = useBbgUsers()
    const { user } = useAuth();

    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleChangeLang = (newLang) => {
        onChangeLang(newLang);
        handleClose();
    };

    return (
        <>
            <Chip label={baseBranch?.name || 'No Branch'} component="h1"
                color={baseBranch?.name ? "primary" : 'error'}
                clickable
                onClick={handleOpen}
                onDelete={baseBranch?.id ? () => { handleBranchUpdate(null) } : null}
            />
            {/* <IconButtonAnimate
                onClick={handleOpen}
                sx={{
                    width: 40,
                    height: 40,
                    ...(open && { bgcolor: 'action.selected' }),
                }}
            >
                <Iconify icon="fluent:branch-compare-16-filled" />
            </IconButtonAnimate> */}

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    mt: 1.5,
                    ml: 0.75,
                    width: 180,
                    '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
                }}
            >
                <Stack spacing={0.75}>
                    {filterBranches(branches, user)?.map((option) => (
                        <MenuItem
                            key={option.name}
                            selected={option.id === baseBranch?.id}
                            onClick={() => {
                                handleBranchUpdate(option);
                                setOpen(null)
                            }}
                        >
                            {/* <Image disabledEffect alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} /> */}

                            {option.name}
                        </MenuItem>
                    ))}
                </Stack>
            </MenuPopover>
        </>
    );
}
