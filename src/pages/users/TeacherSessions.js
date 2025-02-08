import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
//
import { useState, useRef, useEffect } from 'react';
// @mui
import { Card, Button, Container, DialogTitle, Select, FormControl, Grid, circularProgressClasses } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { getEvents, getSessions, getTeachers, openModal, closeModal, updateEvent, selectEvent, selectRange, clearSessions } from 'src/redux/slices/tsessions';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// hooks
import useSettings from 'src/hooks/useSettings';
import useResponsive from 'src/hooks/useResponsive';
// components
import Page from 'src/components/Page';
import Iconify from 'src/components/Iconify';
import { DialogAnimate } from 'src/components/animate';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// sections
import { CalendarForm, CalendarStyle, CalendarToolbar } from 'src/sections/@dashboard/calendar';
import BBAutocomplete from 'src/components/BBAutocomplete';
import httpSer from 'src/utils/httpSer';
import merge from 'lodash/merge';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import useBbgUsers from 'src/hooks/bbgUsers';
import { errorTrans, filterBranches, filterWithBaseBranch, userNameWithBranch } from 'src/common/commonMethods';
import useAuth from 'src/hooks/useAuth';
import { Roles } from './constants';
import EditSlot from './EditSlot';
import { setPageProgres } from 'src/redux/slices/bbg';
// ----------------------------------------------------------------------

const selectedEventSelector = (state) => {
    const { events, selectedEventId } = state.tsessions;
    if (selectedEventId) {
        return events.find((_event) => _event.id == selectedEventId);
    }
    return null;
};

export default function TeacherSessions() {
    const { themeStretch } = useSettings();
    const [openAddUser, setOpenAddForm] = useState({ open: false });

    const dispatch = useDispatch();

    const isDesktop = useResponsive('up', 'sm');

    const calendarRef = useRef(null);

    const [date, setDate] = useState(new Date());

    const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');
    const [selectedTeacher, setTeacher] = useState(null)
    const selectedEvent = useSelector(selectedEventSelector);
    const { enqueueSnackbar } = useSnackbar();
    const { branches, students, baseBranch } = useBbgUsers();
    const { user } = useAuth();
    const [teachersDp, setTeachersDP] = useState([])

    const { events, isOpenModal, selectedRange, teachers, sessions } = useSelector((state) => state.tsessions);
    useEffect(() => {
        setTeachersDP(teachers?.filter((tech) => { return filterWithBaseBranch(tech, baseBranch) })?.map((o) => ({ ...o, value: o.id, label: userNameWithBranch(o, branches) })) || [])
    }, [teachers, baseBranch])
    useEffect(() => { console.log(teachersDp) }, [teachersDp])
    const updateSessions = async (aDate) => {
        if (selectedTeacher) {
            const calendarEl = calendarRef.current;
            let activeDate = new Date();
            if (calendarEl) {
                const calendarApi = calendarEl.getApi();

                activeDate = calendarApi.getDate() || new Date();
            }
            if (aDate)
                activeDate = new Date(aDate)
            setPageProgres(true)
            await dispatch(getSessions(selectedTeacher?.id, activeDate));
            setPageProgres(false)
        } else {
            clearSessions && clearSessions()
        }
    }

    useEffect(() => {
        updateSessions();
    }, [selectedTeacher])

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
            calendarApi.changeView(newView);
            setView(newView);
        }
    }, [isDesktop]);

    const handleClickToday = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.today();
            setDate(calendarApi.getDate());
            updateSessions(calendarApi.getDate());
        }
    };

    const handleChangeView = (newView) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.changeView(newView);
            setView(newView);
        }
    };

    const handleClickDatePrev = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.prev();
            setDate(calendarApi.getDate());
            updateSessions(calendarApi.getDate());
        }
    };

    const handleClickDateNext = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.next();
            setDate(calendarApi.getDate());
            updateSessions(calendarApi.getDate());
        }
    };

    const handleSelectRange = (arg) => {
        return;
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.unselect();
        }
        // console.log("aaaaa", arg, calendarRef)
        dispatch(selectRange(arg.start, arg.start));
    };

    const handleSelectEvent = (arg) => {
        // console.log(arg.event.id, arg.event, "aaaaaaa")
        dispatch(selectEvent(arg.event.id));
    };

    const handleResizeEvent = async ({ event }) => {
        try {
            dispatch(
                updateEvent(event.id, {
                    allDay: event.allDay,
                    start: event.start,
                    end: event.end,
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleDropEvent = async ({ event }) => {
        try {
            dispatch(
                updateEvent(event.id, {
                    allDay: event.allDay,
                    start: event.start,
                    end: event.end,
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddEvent = () => {
        dispatch(openModal());
    };

    const handleCloseModal = () => {
        dispatch(closeModal());
    };
    const handleSuccess = () => {
        // dispatch(getSessions(selectedTeacher?.id));
        updateSessions()
        handleCloseModal()
    }
    const getInitialValues = (event, range, ci) => {
        const _event = {
            title: '',
            description: '',
            textColor: '#1890FF',
            allDay: false,
            students: getDefaultOptions() || [],
            branch_id: branches?.find((o) => ci?.branch_id == o.id),
            start: range ? new Date(range.start) : new Date(),
            end: range ? new Date(range.end) : new Date(),
        };
        // console.log(event, "ppp")
        if (event || range) {
            return merge({}, _event, event, { students: getDefaultOptions() || [] });
        }

        return _event;
    };
    const getNewAttendees = (data, ci) => {
        if (ci?.isMockEvent) {
            return data?.students || []
        }
        return data?.students?.filter((ss) => {
            if (ci?.attendees?.find((cc) => cc?.attendee_id == ss.id)) {
                return false
            }
            return true;
        }) || []
    }

    const getDeletedAttendees = (data, currentItem) => {
        if (currentItem?.isMockEvent)
            return []
        return currentItem?.attendees?.filter((cs) => {
            if (cs.attendee_id == selectedTeacher?.id)
                return false;
            if (data?.students?.find((ss) => ss.id == cs.attendee_id)) {
                return false
            }
            return true
        }) || []
    }

    const hanleSubmitForm = (data) => {
        console.log(data, selectedEvent);
        // return;
        try {
            let currentItem = selectedEvent;
            let saveUrl = "sessions";
            if (!currentItem?.isMockEvent)
                saveUrl = saveUrl + `/${currentItem?.id || ''}`;
            httpSer.post(saveUrl, {
                from_time: data?.start,
                to_time: data?.end,
                teacher_id: currentItem?.teacher_id || selectedTeacher?.id || 0,
                title: data?.title || '',
                description: data?.description || '',
                branch_id: data?.branch_id?.id || currentItem?.branch_id,
                new_attendees: getNewAttendees(data, currentItem),
                deleted_attendees: getDeletedAttendees(data, currentItem),
            }).then(() => {
                enqueueSnackbar('Success');
                handleSuccess && handleSuccess()
            }).catch((err) => {
                enqueueSnackbar(errorTrans(err), { variant: 'error' });
            });
        } catch (ee) {
            console.log(ee)
            enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
        return;
    }
    const getDefaultOptions = () => {
        return students?.filter((s) => {
            if (selectedEvent?.isMockEvent) {
                return selectedEvent?.students?.find((cs) => cs?.student_id == s.id)
            }
            return selectedEvent?.attendees?.find((cs) => cs?.attendee_id == s.id)
        })
    }
    const getTitle = () => {
        let branch = branches?.find((b) => b?.id == selectedEvent?.branch_id)
        if (selectedEvent) {
            return `Edit Session : ${selectedEvent?.teacher?.fullname} - ${branch?.name || ''}`;
        }
        return 'Add Event'
    }
    return (
        <Page title="Calendar">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="Slots"
                    links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Calendar' }]}
                    moreLink="" //https://fullcalendar.io/docs/react
                    action={
                        <Grid container>
                            <BBAutocomplete fullWidth={false} sx={{ width: 300 }} fullWidth value={selectedTeacher} onChange={(e, a) => {
                                setTeacher(a);

                            }} label={"Select Teacher"}
                                options={teachersDp || []}
                                size={"small"} />
                        </Grid>
                    }
                />

                <Card>
                    <CalendarStyle>
                        <CalendarToolbar
                            date={date}
                            view={view}
                            onNextDate={handleClickDateNext}
                            onPrevDate={handleClickDatePrev}
                            onToday={handleClickToday}
                            onChangeView={handleChangeView}
                        />
                        <FullCalendar
                            weekends
                            editable
                            droppable
                            selectable
                            events={sessions || []}
                            ref={calendarRef}
                            rerenderDelay={10}
                            initialDate={date}
                            initialView={view}
                            dayMaxEventRows={3}
                            eventDisplay="block"
                            headerToolbar={false}
                            allDayMaintainDuration
                            eventResizableFromStart
                            select={handleSelectRange}
                            eventDrop={handleDropEvent}
                            eventClick={handleSelectEvent}
                            eventResize={handleResizeEvent}
                            height={isDesktop ? 720 : 'auto'}
                            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                        />
                    </CalendarStyle>
                </Card>

                <DialogAnimate fullWidth={true}
                    maxWidth={'xx'} open={isOpenModal} onClose={handleCloseModal}>
                    <DialogTitle>{getTitle()}</DialogTitle>

                    <EditSlot
                        hanleSubmitForm={(data) => {
                            // console.log(data)
                            hanleSubmitForm(data)
                        }}
                        inputFormat="dd/MM/yyyy hh:mm a"
                        // getInitialValues={getInitialValues}
                        defaultOptions={getDefaultOptions() || []}
                        students={students}
                        event={selectedEvent || {}}
                        currentItem={selectedEvent}
                        teacher={selectedTeacher}
                        range={selectedRange}
                        handleSuccess={handleSuccess}
                        branches={filterBranches(branches, user)}
                        onCancel={handleCloseModal} />
                </DialogAnimate>
            </Container>
        </Page>
    );
}
