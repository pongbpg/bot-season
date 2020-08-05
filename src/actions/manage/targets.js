import firestore from '../../firebase/firebase';
export const startGetTargets = () => {
    return (dispatch) => {
        return firestore.collection('targets').get()
            .then(snapShot => {
                let targets = [];
                snapShot.forEach(target => {
                    targets.push({ id: target.id, ...target.data() })
                })
                // console.log(targets)
                return dispatch(setTargets(targets))
            })
    }
}
export const startAddTarget = (year, month, target) => {
    return (dispatch) => {
        return firestore.collection('targets').doc(year.toString()).get()
            .then(doc => {
                const data = {
                    id: year,
                    months: doc.data().months.map(m => {
                        if (m.month == month) {
                            return {
                                ...m,
                                pages: m.pages.concat(target)
                            }
                        } else {
                            return m
                        }
                    })
                }
                firestore.collection('targets').doc(year.toString()).update({ ...data })
                    .then(() => {
                        return dispatch(setTarget(data))
                    })
            })
    }
}
export const startUpdateTarget = (year, month, target) => {
    return (dispatch) => {
        return firestore.collection('targets').doc(year.toString()).get()
            .then(doc => {
                const data = {
                    id: year,
                    months: doc.data().months.map(m => {
                        if (m.month == month) {
                            return {
                                ...m,
                                pages: m.pages.map(p => {
                                    if (p.page == target.page) {
                                        return {
                                            ...p,
                                            ...target
                                        }
                                    } else {
                                        return p
                                    }
                                })
                            }
                        } else {
                            return m
                        }
                    })
                }
                firestore.collection('targets').doc(year.toString()).update({ ...data })
                    .then(() => {
                        return dispatch(setTarget(data))
                    })
            })
    }
}
export const startRemoveTarget = (year, month, target) => {
    return (dispatch) => {
        return firestore.collection('targets').doc(year.toString()).get()
            .then(doc => {
                const data = {
                    id: year,
                    months: doc.data().months.map(m => {
                        if (m.month == month) {
                            return {
                                ...m,
                                pages: m.pages.filter(f=>f.page!=target.page)
                            }
                        } else {
                            return m
                        }
                    })
                }
                firestore.collection('targets').doc(year.toString()).update({ ...data })
                    .then(() => {
                        return dispatch(setTarget(data))
                    })
            })
    }
}
export const setTargets = (targets) => ({
    type: 'SET_MANAGE_TARGETS',
    targets
});
export const setTarget = (target) => ({
    type: 'SET_MANAGE_TARGET',
    target
});
