import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { Roles } from 'src/pages/users/constants';
import httpSer from 'src/utils/httpSer';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  events: [],
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null,
  teachers: [],
  sessions: [],
  mockSessions: []
};

const slice = createSlice({
  name: 'tsessions',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload || [];
      state.sessions = action.payload || [];
    },
    getMockSessionsSuccess(state, action) {
      state.isLoading = false;
      state.mockSessions = action.payload || [];
    },
    // GET EVENTS
    getTeacherSuccess(state, action) {
      state.isLoading = false;
      state.teachers = action.payload || [];
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      const event = action.payload;
      const updateEvent = state.events.map((_event) => {
        if (_event.id === event.id) {
          return event;
        }
        return _event;
      });

      state.isLoading = false;
      state.events = updateEvent;
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const { eventId } = action.payload;
      const deleteEvent = state.events.filter((event) => event.id !== eventId);
      state.events = deleteEvent;
    },

    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isOpenModal = true;
      state.selectedEventId = eventId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isOpenModal = true;
      state.selectedRange = { start, end };
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent } = slice.actions;

// ----------------------------------------------------------------------

export function getEvents() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/calendar/events');
      dispatch(slice.actions.getEventsSuccess(response.data.events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getMockSessions(tid) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await httpSer.get('mock-schedule/by-teacher/' + tid)
      dispatch(slice.actions.getMockSessionsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function clearSessions() {
  dispatch(slice.actions.getEventsSuccess([]))
}
export function getSessions(tid, selectedDate) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await httpSer.get('sessions/' + tid, {
        params: {
          date: selectedDate
        }
      })
      dispatch(slice.actions.getEventsSuccess(response?.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getTeachers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await httpSer.get(`users/get-teachers`, {
        params: {
          role_id: Roles.Teacher
        }
      });
      dispatch(slice.actions.getTeacherSuccess(response.data?.map((o) => ({ ...o, value: o.id, label: o.fullname }))));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/events/new', newEvent);
      dispatch(slice.actions.createEventSuccess(response.data.event));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateEvent(eventId, updateEvent) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/events/update', {
        eventId,
        updateEvent,
      });
      dispatch(slice.actions.updateEventSuccess(response.data.event));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/calendar/events/delete', { eventId });
      dispatch(slice.actions.deleteEventSuccess({ eventId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function selectRange(start, end) {
  return async () => {
    dispatch(
      slice.actions.selectRange({
        start: start.getTime(),
        end: end.getTime(),
      })
    );
  };
}
