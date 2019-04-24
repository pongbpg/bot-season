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
                console.log(team)
                return dispatch(pushTeam(team))
            })
    }
}
export const startResetPassword = (team) => {
    return (dispatch) => {
        return auth.sendPasswordResetTeam(team).then(function () {
            return team
        }).catch(function (error) {
            // An error happened.
        });
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