import firestore, { auth } from '../../firebase/firebase';
export const startGetTeams = () => {
    return (dispatch) => {
        return firestore.collection('teams').get()
            .then(snapShot => {
                let teams = [];
                snapShot.forEach(team => {
                    teams.push({ id: team.id, ...team.data() })
                })
                return dispatch(setTeams(teams))
            })
    }
}
export const startUpdateTeam = (team) => {
    return (dispatch) => {
        return firestore.collection('teams').doc(team.id).update({ ...team })
            .then(() => {
                return dispatch(setTeam(team))
            })
    }
}
export const startPushTeam = (team) => {
    return (dispatch) => {
        return firestore.collection('teams').doc(team.id).set({ ...team })
            .then(() => {
                // console.log(team)
                return dispatch(pushTeam(team))
            })
    }
}
export const startDeleteTeam = (team) => {
    return (dispatch) => {
        return firestore.collection('teams').doc(team.id).delete()
            .then(() => {
                return dispatch(deleteTeam(team))
            })
    }
}
export const setTeams = (teams) => ({
    type: 'SET_MANAGE_TEAMS',
    teams
});

export const setTeam = (team) => ({
    type: 'SET_MANAGE_TEAM',
    team
});

export const pushTeam = (team) => ({
    type: 'PUSH_MANAGE_TEAM',
    team
});

export const deleteTeam = (team) => ({
    type: 'REMOVE_MANAGE_TEAM',
    team
});