import { createSlice, current } from '@reduxjs/toolkit';
// utils
// import axios from '../../utils/axios';
import axios from 'axios';
import { userNameWithBranch } from 'src/common/commonMethods';
import { Roles } from 'src/pages/users/constants';
import httpSer from 'src/utils/httpSer';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------


const initialState = {
    isInProgress: false,
    isLoading: false,
    isLoadingStudents: false,
    usersList:[],
    defaultsLoading: {},
    error: null,
    roles: [],
    branches: [],
    subjects: [],
    weeks: [],
    levels: [],
    students: [],
    topics: [],
    baseBranch: null
};

const slice = createSlice({
    name: 'bbg',
    initialState,
    reducers: {
        // START LOADING
        setProgress(state, action) {
            state.isInProgress = action.payload
        },
        startLoading(state, action) {
            state.isLoading = true;
            state.defaultsLoading[action?.payload?.type] = true
        },
        startLoadingStudents(state) {
            state.isLoadingStudents = true;
        },

        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        getUsersList(state, action) {
            state.isLoading = false;
            state.usersList = action.payload;
        },
        getRoles(state, action) {
            state.isLoading = false;
            state.roles = action.payload;
        },
        getSubjects(state, action) {
            state.isLoading = false;
            state.subjects = action.payload;
            state.defaultsLoading.subjects = false
        },
        getTopics(state, action) {
            state.isLoading = false;
            state.topics = action.payload;
            state.defaultsLoading.topics = false
        },
        getLevels(state, action) {
            state.isLoading = false;
            state.levels = action.payload;
            state.defaultsLoading.levels = false
        },
        getWeeks(state, action) {
            state.isLoading = false;
            state.weeks = action.payload;
            state.defaultsLoading.weeks = false
        },
        getBranches(state, action) {
            state.isLoading = false;
            state.branches = action.payload;
            state.defaultsLoading.branches = false
        },
        getBaseBranch(state, action) {
            state.baseBranch = action.payload;
        },
        getStudents(state, action) {
            state.isLoadingStudents = false;
            let branchesList = current(state?.branches);
            let list = action.payload?.map((student) => ({ ...student, label: userNameWithBranch(student, branchesList) }))
            state.students = list;
        },
    },
});

// Reducer
export default slice.reducer;

const http = async (path, params) => {
    return httpSer.get(`${path}`, params)
}

// Actions
// export const { addRecipients, onSendMessage, resetActiveConversation } = slice.actions;

// ----------------------------------------------------------------------
export function setPageProgres(flag) {
    dispatch(slice.actions.setProgress(flag))
}
export function getRolesfromDb() {
    return async () => {
        dispatch(slice.actions.startLoading({ type: "roles" }));
        try {
            const response = await http(`roles/all`);
            dispatch(slice.actions.getRoles(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
export function getUsersfromDb() {
    return async () => {
        dispatch(slice.actions.startLoading({ type: "usersList" }));
        try {
            const response = await http(`users`);
            dispatch(slice.actions.getUsersList(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
export function getLevelsfromDb() {
    return async () => {
        dispatch(slice.actions.startLoading({ type: "levels" }));
        try {
            const response = await http(`levels`);
            dispatch(slice.actions.getLevels(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
export function getSubjectsfromDb() {
    return async () => {
        dispatch(slice.actions.startLoading({ type: "subjects" }));
        try {
            const response = await http(`subjects`);
            dispatch(slice.actions.getSubjects(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getTopicfromDb() {
    return async () => {
        dispatch(slice.actions.startLoading({ type: "topics" }));
        try {
            const response = await http(`subjects/get-topics`);
            dispatch(slice.actions.getTopics(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getWeeksfromDb() {
    return async () => {
        dispatch(slice.actions.startLoading({ type: "weeks" }));
        try {
            const response = await http(`weeks`);
            dispatch(slice.actions.getWeeks(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
export function getBranchesfromDb() {
    return async () => {
        dispatch(slice.actions.startLoading({ type: "branches" }));
        try {
            const response = await http(`branches`);
            dispatch(slice.actions.getBranches(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getStudentsfromDb() {
    return async () => {
        dispatch(slice.actions.startLoadingStudents());
        try {
            const response = await http(`users/filter`, {
                params: {
                    role_id: Roles.Student
                }
            });
            dispatch(slice.actions.getStudents(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function setBaseBranch(branch) {
    dispatch(slice.actions.getBaseBranch(branch));
}