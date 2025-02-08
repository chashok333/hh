import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
// @mui
import {
    Box, Tab, Tabs, Card, Table, Switch, Button, Tooltip, Divider, TableBody, Container,
    IconButton, TableContainer, TablePagination, FormControlLabel, DialogTitle, Grid, Autocomplete, TextField
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
import { useDispatch, useSelector } from 'src/redux/store';
import AddMockSessionForm from './AddTeacherSchedule';
import { getEvents, getTeachers, openModal, closeModal, updateEvent, selectEvent, selectRange, getSessions, getMockSessions } from 'src/redux/slices/tsessions';
import BBAutocomplete from 'src/components/BBAutocomplete';
import Typography from 'src/theme/overrides/Typography';
import httpSer from 'src/utils/httpSer';
import MockSessions from './MockSessions';
import { dayOptions, Roles } from './constants';
import merge from 'lodash/merge';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import { errorTrans, filterBranches, filterWithBaseBranch, userNameWithBranch } from 'src/common/commonMethods';
import { setPageProgres } from 'src/redux/slices/bbg';
// ----------------------------------------------------------------------

export default function Sessions() {
    const [openAddUser, setOpenAddForm] = useState({ open: false });
    const { branches, baseBranch, students } = useBbgUsers();
    const dispatch = useDispatch();
    const [selectedTeacher, setTeacher] = useState(null);
    const { events, isOpenModal, selectedRange, teachers, mockSessions } = useSelector((state) => state.tsessions);
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuth();
    const getInitialValues = (event, range, cs) => {
        const _event = {
            title: cs?.title || '',
            description: cs?.description || '',
            textColor: '#1890FF',
            students: openAddUser?.item?.students?.map((st) => ({ ...st.user })),
            branch_id: branches?.find((o) => cs?.branch_id == o.id),
            week_day: dayOptions?.find((o) => cs?.week_day == o.id),
            start: cs ? new Date(`${moment().format("MM DD YYYY")}  ${cs?.from_time}`) : new Date(),
            end: cs ? new Date(`${moment().format("MM DD YYYY")}  ${cs?.to_time}`) : new Date()
        };

        if (event || range) {
            return merge({}, _event, event);
        }

        return _event;
    };

    useEffect(() => {
        refreshSessions()
    }, [])

    const refreshSessions = async () => {
        setPageProgres(true)
        await dispatch(getMockSessions(''));
        setPageProgres(false)
    }

    const handleSuccess = () => {
        refreshSessions();
        handleCloseForm()
    }
    const hanleSubmitForm = async (data) => {
        try {
            let currentItem = openAddUser?.item;
            await httpSer.post(`mock-schedule/${currentItem?.id || ''}`, {
                from_time: moment(data?.start).format("HH:m:ss"),
                to_time: moment(data?.end).format("HH:m:ss"),
                teacher_id: currentItem?.teacher_id || selectedTeacher?.id || 0,
                week_day: data?.week_day?.value,
                branch_id: data?.branch_id?.id,
                title: data?.title || '',
                description: data?.description || '',
                new_students: data?.students?.filter((ss) => {
                    if (currentItem?.students?.find((cc) => cc?.student_id == ss.id)) {
                        return false
                    }
                    return true;
                }),
                deleted_students: currentItem?.students?.filter((cs) => {
                    if (data?.students?.find((ss) => ss.id == cs.student_id)) {
                        return false
                    }
                    return true
                }) || [],
            }).then(() => {
                enqueueSnackbar('Success');
                handleSuccess && handleSuccess()
            }).catch((err) => {
                enqueueSnackbar(errorTrans(err), { variant: 'error' });
            });
        } catch (ee) {
            enqueueSnackbar(errorTrans(ee), { variant: 'error' });
        }
        return;
    }
    const handleCloseForm = () => {
        setOpenAddForm({
            open: false, item: null
        })
    }
    const handleDelete = (item) => {
        console.log(item)
        httpSer.delete(`mock-schedule/${item?.id || ''}`, {

        }).then(() => {
            enqueueSnackbar('Deleted Successfully');
            handleSuccess && handleSuccess()
        }).catch((err) => {
            enqueueSnackbar(errorTrans(err), { variant: 'error' });
        });
    }
    const handleEditEVent = (params) => {
        setOpenAddForm({ open: true, item: params })
    }
    const { themeStretch } = useSettings();

    const filterBranchesByTeacher = (b) => {
        if (openAddUser?.item) {
            return openAddUser?.item?.teacher?.branches?.find((tb) => tb.branch_id == b.id);
        }
        return selectedTeacher?.branches?.find((tb) => tb.branch_id == b.id)
    }

    return (
        <Page title="Sessions: List">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Sessions List"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'List' },
                    ]}
                    action={
                        <Grid container
                            wrap='nowrap'>

                            <BBAutocomplete fullWidth={false} sx={{ width: 250 }} fullWidth value={selectedTeacher} onChange={(e, a) => {
                                setTeacher(a);

                            }} label={"Teacher"} options={teachers?.filter((tec) => {
                                return filterWithBaseBranch(tec, baseBranch);
                            })?.map((o) => ({ ...o, value: o.id, label: userNameWithBranch(o, branches) || o.label || '' })) || []} size={"small"} />

                            <Button
                                sx={{ ml: 1 }}
                                variant="contained"
                                onClick={() => {
                                    setOpenAddForm({ open: true, item: null })
                                }}
                                startIcon={<Iconify icon={'eva:plus-fill'} />}
                                disabled={selectedTeacher ? false : true}
                                size="small"
                            >
                                New
                            </Button>
                        </Grid>
                    }
                />
                <Card>
                    <MockSessions branch={baseBranch} teacher={selectedTeacher} onClickHandler={handleEditEVent} days={dayOptions} sessions={mockSessions} />
                </Card>

            </Container>
            <DialogAnimate open={openAddUser?.open} onClose={handleCloseForm}>
                <DialogTitle>{openAddUser?.item ? "Update" : "Add"} Session : {selectedTeacher?.fullname}</DialogTitle>
                <AddMockSessionForm
                    isMock={true}
                    hanleSubmitForm={hanleSubmitForm}
                    onSubmitForm={hanleSubmitForm}
                    getInitialValues={getInitialValues}
                    event={{}}
                    currentItem={openAddUser?.item}
                    teacher={selectedTeacher}
                    range={selectedRange}
                    handleSuccess={handleSuccess}
                    onDelete={handleDelete}
                    branches={filterBranches(branches, user)?.filter(filterBranchesByTeacher)}
                    onCancel={handleCloseForm} />
            </DialogAnimate>
        </Page>
    );
}