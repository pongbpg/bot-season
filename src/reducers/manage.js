export default (state = { admins: [], emails: [] }, action) => {
    switch (action.type) {
        case 'SET_MANAGE_ADMINS':
            return {
                ...state,
                admins: action.admins
            }
        case 'SET_MANAGE_ADMIN':
            return {
                ...state,
                admins: state.admins.map(admin => {
                    if (admin.userId !== action.admin.userId) return admin
                    return { ...admin, ...action.admin }
                })
            }
        case 'SET_MANAGE_EMAILS':
            return {
                ...state,
                emails: action.emails
            }
        case 'SET_MANAGE_EMAIL':
            return {
                ...state,
                emails: state.emails.map(email => {
                    if (email.uid !== action.email.uid) return email
                    return { ...email, ...action.email }
                })
            }
        case 'PUSH_MANAGE_EMAIL':
            return {
                ...state,
                emails: [...state.emails, action.email]
            }
        default:
            return state;
    }
};