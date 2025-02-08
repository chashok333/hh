import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, DialogTitle } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { DialogAnimate, IconButtonAnimate } from '../../../components/animate';
import ResetPassword from 'src/components/ResetPassword';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/dashboard',
  },
  // {
  //   label: 'Time Sheet',
  //   linkTo: '/dashboard/time-sheet',
  // },
  {
    label: 'Reset Password',
    linkTo: '#',
    type: 'password'
  },
  // {
  //   label: 'Profile',
  //   linkTo: PATH_DASHBOARD.user.profile,
  // },
  // {
  //   label: 'Settings',
  //   linkTo: PATH_DASHBOARD.user.account,
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(null);
  const [userModel, setUserModel] = useState({ open: false })

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleMenuItemClick = (option) => {
    if (option.type == 'password') {
      resetPassword(user);
    }
  }
  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };
  const resetPassword = (params) => {
    setUserModel({
      open: true,
      type: 'password',
      title: 'Change Password For :' + params?.fullname,
      item: params
    })
  }
  const handleCloseResetPswd = () => {
    setUserModel(null)
  }

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <MyAvatar />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.fullname}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={() => {
              handleMenuItemClick(option)
              handleClose()
            }}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
      <DialogAnimate
        fullWidth={true}
        maxWidth={userModel?.open ? 'sm' : 'xl'}
        open={userModel?.open}
        onClose={handleCloseResetPswd}>
        <DialogTitle>Reset Password For - {userModel?.item?.first_name} </DialogTitle>
     
        <ResetPassword user={userModel?.item} handleClose={handleCloseResetPswd} />
      </DialogAnimate>
    </>
  );
}
