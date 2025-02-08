import { createSlice } from '@reduxjs/toolkit';
// utils
// import axios from '../../utils/axios';
import axios from 'axios';
import httpSer from 'src/utils/httpSer';
//
import { dispatch, useSelector } from '../store';

// ----------------------------------------------------------------------


const initialState = {
    isLoading: false,
    error: null,
    grading: [],
    comments: "",
    mistakes: [],
    studentInfo: {},
    currentObj: {},
    startDate: new Date(),
};

const slice = createSlice({
    name: 'grading',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },
        resetGrade(state, action) {
            let p = action.payload;
            state.currentObj = p;
            let ms = [];
            if (p?.mistakes) {
                try {
                    let parsed = p?.mistakes || [];
                    ms = parsed || [];
                } catch { }
            }
            if (!ms?.length)
                ms = Array.from({ length: 7 }, (val, ind) => ({ day: ind + 1, mistakes: '' }));
            state.mistakes = ms
            state.comments = p?.comments || ''
            state.startDate = p.start_date ? new Date(p.start_date) : new Date()
        },
        // HAS ERROR
        updateGrading(state, action) {
            state.isLoading = false;
            state.grading = action.payload;
        },
        updateMistakes(state, action) {
            let m = JSON.parse(JSON.stringify(state.mistakes));

            state.mistakes = m.map((i) => {
                if (i?.day == action.payload?.day?.day) {
                    return { ...i, mistakes: action?.payload.newVal }
                }
                return i;
            })
        },
        getCurrentState(state) {
            return state;
        },
        setStudentInfo(state, action) {
            state.studentInfo = action?.payload
        },
        setComment(state, action) {
            state.comments = action?.payload
        },
        setStartDate(state, action) {
            state.startDate = action?.payload
        }
    },
});

// Reducer
export default slice.reducer;

const http = async (path) => {
    return httpSer.get(`${path}`)
}

// ----------------------------------------------------------------------
export const handleDateChange = (date) => {
    dispatch(slice.actions.setStartDate(date))
}
export const loadGrading = () => {
    dispatch(slice.actions.resetGrade({}))
}
export const handleMistakesChange = (newVal, day) => {
    dispatch(slice.actions.updateMistakes({ newVal, day }));
}

export const setStudentDetails = (data) => {
    dispatch(slice.actions.setStudentInfo(data));
}

export async function getGradingFromDB(data, suggestion) {
    try {
        const response = await httpSer.get(`grading`, {
            params: { ...data }
        });
        // console.log(suggestion)
        dispatch(slice.actions.resetGrade(response?.data?.data ||
        {
            comments: `${suggestion?.topic || ''} - ${suggestion?.comment || ''}`,
            start_date: suggestion?.session?.from_time
        }));
    } catch (error) {
        dispatch(slice.actions.hasError(error));
    }
}
export async function manualUpdateGrading(data) {
    try {

        dispatch(slice.actions.resetGrade(data));
    } catch (error) {
    }
}

export const handleCommentChange = (val) => {
    dispatch(slice.actions.setComment(val));
}