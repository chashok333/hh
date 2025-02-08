import moment from "moment";

export const filterBranches = (branches, user) => {
    return branches?.filter((branch) => {
        return user?.branches?.find((ub) => ub.branch_id == branch.id)
    });
}

export const errorTrans = (error) => {
    return error?.response?.data?.errors?.map((e) => e.message)?.join(", ") || error?.response?.data?.error || 'Error Occurred'
}

export const getBranchNameById = (bid, branches) => {
    return branches?.find((b) => bid == b?.id)?.code || ''
}

export const userNameWithBranch = (user, branchesList) => {
    let bName = ''
    if (user?.branches?.length) {
        bName = user?.branches?.map((sb) => getBranchNameById(sb.branch_id, branchesList))?.join(", ")
    }
    return bName + ' - ' + user.fullname + ' ' + (user.last_name || '')
}

export const filterWithBaseBranch = (user, baseBranch) => {
    if (!baseBranch?.id) {
        return true;
    }
    if (user?.branches?.find((tb) => tb?.branch_id == baseBranch?.id))
        return true;

    return false;
}

export const userLabel = (user) => {
    if (!user) return ''
    let preName = '';
    let a = user?.branches?.map((branch) => branch?.branch?.code)?.join(",") || ''
    if (a)
        return `${a} - ${user?.fullname} ${user?.last_name || ''}`;
    return user?.fullname + ' ' + user?.last_name;

}

export const minutesToHours = (minutes) => {
    return minutes + ' hr(s)'
    return `${parseInt(minutes / 60)} hr(s) ${minutes - (parseInt(minutes / 60) * 60)} minutes`; //${hrs + (minutes - (hrs * 60)) / 60}
}

export const phoneFormat = (num) => {
    if (isNaN(num) || !num) return num;
    try {
        let arr = num?.toString()?.split("");
        arr.splice(3, 0, '-')
        arr.splice(7, 0, '-')
        console.log(arr.join(""), num)
        return arr.join("")
    } catch (err) {
        console.log(err)
    }
    return num;
}
export const dateFormate = (date) => {
    if (!date) return date;
    return moment(date).format("MM/DD/YYYY")
}
export const groupDatesByWeek = (dates) => {
        let groupedWeeks = {};

        dates.forEach(date => {
            let weekNum = moment(date, "YYYY-MM-DD").week();

            if (!groupedWeeks[weekNum]) {
                groupedWeeks[weekNum] = [];
            }

            groupedWeeks[weekNum].push(date);
        });

        return groupedWeeks;
    }