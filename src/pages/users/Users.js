import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
// @mui
import {
    Box,
    Tab,
    Tabs,
    Card,
    Table,
    Switch,
    Button,
    Tooltip,
    Divider,
    TableBody,
    Container,
    IconButton,
    TableContainer,
    TablePagination,
    FormControlLabel,
    DialogTitle
} from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';
import useBbgUsers from '../../hooks/bbgUsers';
import { DialogAnimate } from '../../components/animate';
import { PATH_DASHBOARD } from '../../routes/paths';
import UserForm from './UserForm';
import httpSer from 'src/utils/httpSer';
import MockTimeSheet from '../dashboard/MockTimeSheet';
import { useSnackbar } from 'notistack';
import { errorTrans } from 'src/common/commonMethods';
import MenuOptions from "src/components/MenuOptions";
import ResetPassword from 'src/components/ResetPassword';
import { getUsersfromDb } from 'src/redux/slices/bbg';
import { useDispatch } from 'src/redux/store';
// import RoleForm from './RoleForm';
// ----------------------------------------------------------------------

export default function Users() {
    const { enqueueSnackbar } = useSnackbar();
    const [openAddUser, setOpenAddForm] = useState({ open: false });
    const { roles } = useBbgUsers();
    const [info, setInfo] = useState({ open: false })
    const [users, setUsers] = useState([]);
    const [loader, setLoader] = useState(false);
    const [passWordModal, setPassWordModal] = useState({ open: false, data: null });
    const dispatch = useDispatch();

    const handleSuccess = () => {
        handleCloseForm();
        loadUsers();
        dispatch(getUsersfromDb())
    }
    const handleCloseForm = () => {
        setOpenAddForm({
            open: false, item: null
        })
    }
    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = () => {
        setLoader(true)
        httpSer.get('users').then((d) => d.data).then((data) => {
            setUsers(data || [])
            setLoader(false)
        }).catch((err) => {
            setLoader(false)
            enqueueSnackbar(errorTrans(err), { variant: 'error' });
        })
    }

    const handleEditEVent = (params) => {
        setOpenAddForm({ open: true, item: params?.row })
    }
    const { themeStretch } = useSettings();
    const handleCloseResetPswd = () => {
        setPassWordModal({ open: false, data: null })
    }
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'first_name', headerName: 'Name', width: 200, renderCell: (params) => <>{params?.row?.first_name} {params?.row?.last_name}</> },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'status', headerName: 'Status', width: 100, renderCell: (params) => <Switch checked={params?.row?.status == 1} /> },

        {
            field: 'action',
            headerName: 'Actions',
            width: 140,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Box sx={{ position: "relative" }}>
                        <MenuOptions options={[{ value: 'edit', label: `Edit` }, { value: 'slots', label: `Availability` }, { value: 'pswd', label: `Change Password` }]} onClickOption={(selectedOpt) => {
                            if (selectedOpt.value == 'edit')
                                handleEditEVent(params)

                            if (selectedOpt.value == 'slots')
                                setInfo({ open: true, data: params?.row })
                            if (selectedOpt.value == 'pswd')
                                setPassWordModal({ open: true, data: params?.row })

                        }} />
                    </Box>
                );
            },
        },
    ]
    return (
        <Page title="Users: List">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Users List"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            onClick={() => {
                                setOpenAddForm({ open: true, item: null })
                            }}
                            startIcon={<Iconify icon={'eva:plus-fill'} />}
                        >
                            New User
                        </Button>
                    }
                />
                <Card>
                    <Scrollbar>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={users}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}

                                disableSelectionOnClick
                            />
                        </div>
                    </Scrollbar>
                </Card>
            </Container>
            <DialogAnimate open={openAddUser?.open ? true : false} onClose={handleCloseForm}>
                <DialogTitle> {openAddUser?.item ? "Update" : " Create"} User</DialogTitle>
                <UserForm closeModel={handleCloseForm} role={openAddUser?.item} handleSuccess={handleSuccess} />
            </DialogAnimate>

            <DialogAnimate
                maxWidth={'sm'} open={info?.open ? true : false} onClose={() => {
                    setInfo(null)
                }}>
                <DialogTitle>Availablity of User : {info?.data?.first_name}</DialogTitle>
                <Box sx={{
                    padding: 4
                }}>
                    <MockTimeSheet currentUser={info?.data} handleSuccess={() => {
                        setInfo({
                            open: false, data: null
                        })
                        loadUsers();
                    }} />
                </Box>
            </DialogAnimate>

            <DialogAnimate
                fullWidth={true}
                maxWidth={passWordModal?.open ? 'sm' : 'xl'}
                open={passWordModal?.open}
                onClose={handleCloseResetPswd}
            >
                <DialogTitle>Change Password For {passWordModal?.data?.first_name} </DialogTitle>

                <ResetPassword user={passWordModal?.data} handleClose={handleCloseResetPswd} />
            </DialogAnimate>
        </Page>
    );
}

