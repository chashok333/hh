import { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { useSelector } from 'react-redux';
import {
    getRolesfromDb, getLevelsfromDb, getWeeksfromDb, getUsersfromDb,
    getSubjectsfromDb, getBranchesfromDb, setBaseBranch, getTopicfromDb
} from '../redux/slices/bbg';

import { useDispatch } from '../redux/store';
import { getTeachers } from 'src/redux/slices/tsessions';
// ----------------------------------------------------------------------

const useBbgUsers = () => {

    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();

    const bbgStore = useSelector((state) => state.bbg);
    const sessionStore = useSelector((state) => state.tsessions);
    const { roles, weeks, subjects, levels, branches, baseBranch, students, isLoadingStudents, topics, defaultsLoading, usersList } = bbgStore;
    const { teachers } = sessionStore;


    useEffect(() => {
        initSettingGlobalData()
    }, [dispatch])

    const initSettingGlobalData = async () => {
        if (bbgStore?.roles?.length === 0 && !defaultsLoading?.roles)
            dispatch(getRolesfromDb())

        if (bbgStore?.usersList?.length === 0 && !defaultsLoading?.usersList)
            dispatch(getUsersfromDb())

        // if (bbgStore?.subjects?.length === 0 && !defaultsLoading?.subjects)
        //     dispatch(getSubjectsfromDb())

        // if (bbgStore?.weeks?.length === 0 && !defaultsLoading?.weeks)
        //     dispatch(getWeeksfromDb())

        if (bbgStore?.branches?.length === 0 && !defaultsLoading?.branches)
            dispatch(getBranchesfromDb())


    }

    const handleBranchUpdate = (branch) => {
        setBaseBranch(branch)
    }

    const getRoles = async () => {
    }

    const updateBranches = () => {
        dispatch(getBranchesfromDb())
    }
    const updateTopics = () => {
        dispatch(getTopicfromDb())
    }
    return { roles, weeks, subjects, levels, getRoles, branches, handleBranchUpdate, baseBranch, updateBranches, usersList, students, topics, updateTopics }
};

export default useBbgUsers;
