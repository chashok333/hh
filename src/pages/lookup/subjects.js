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
import { getWeeksfromDb } from 'src/redux/slices/bbg';
import { useDispatch } from 'src/redux/store';
// ----------------------------------------------------------------------

export default function Weeks() {
    const { subjects } = useBbgUsers();
    const dispatch = useDispatch();
    const handleSuccess = () => {
        dispatch(getSubjectsfromDb());
        handleCloseForm()
    }

    const { themeStretch } = useSettings();
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'subject_name', headerName: 'Name', width: 150 },
        { field: 'subject_code', headerName: 'Code', width: 150 },
        { field: 'subject_description', headerName: 'description', width: 400 },
        ,]
    return (
        <Page title="Weeks: List">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Subjects List"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'List' },
                    ]}

                />
                <Card>
                    <Scrollbar>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={subjects}
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

        </Page>
    );
}

