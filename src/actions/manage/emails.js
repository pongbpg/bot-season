import firestore from '../../firebase/firebase';
export const startGetEmails = () => {
    return (dispatch) => {
        return firestore.collection('emails').get()
            .then(snapShot => {
                let emails = [];
                snapShot.forEach(email => {
                    emails.push({ uid: email.id, ...email.data() })
                })
                return dispatch(setEmails(emails))
            })
    }
}
export const startUpdateEmail = (email) => {
    return (dispatch) => {
        return firestore.collection('emails').doc(email.uid).update({ ...email })
            .then(() => {
                return dispatch(setEmail(email))
            })
    }
}
export const setEmails = (emails) => ({
    type: 'SET_MANAGE_EMAILS',
    emails
});

export const setEmail = (email) => ({
    type: 'SET_MANAGE_EMAIL',
    email
});