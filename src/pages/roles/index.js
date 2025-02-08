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
import RoleForm from './RoleForm';
// import RoleForm from './RoleForm';
// ----------------------------------------------------------------------

export default function Roles() {
    const [openAddUser, setOpenAddForm] = useState({ open: false });
    const { roles } = useBbgUsers();
    const handleSuccess = () => {
        handleCloseForm()
    }
    const handleCloseForm = () => {
        setOpenAddForm({
            open: false, item: null
        })
    }

    const handleEditEVent = (params) => {
        console.log(params)
        setOpenAddForm({ open: true, item: params?.row })

    }
    const { themeStretch } = useSettings();
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'role_name', headerName: 'Name', width: 300 },
        { field: 'role_description', headerName: 'Description' },
        {
            field: "action", headerName: "Actions", sortable: false,
            renderCell: (params) => {
                return <Button onClick={() => { handleEditEVent(params) }}>Edit</Button>;
            }
        },]
    return (
        <Page title="Roles: List">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Roles List"
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
                            New Role
                        </Button>
                    }
                />
                <Card>
                    <Scrollbar>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={roles}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                                disableSelectionOnClick
                            />
                        </div>
                    </Scrollbar>
                </Card>
            </Container>
            <DialogAnimate open={openAddUser?.open} onClose={handleCloseForm}>
                <DialogTitle>Add Role</DialogTitle>
                <RoleForm closeModel={handleCloseForm} role={openAddUser?.item} handleSuccess={handleSuccess} />
            </DialogAnimate>
        </Page>
    );
}

