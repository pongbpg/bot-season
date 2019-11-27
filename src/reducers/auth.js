export default (state = { role: '', pages: [] }, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                uid: action.uid,
                email: action.email
            };
        case 'LOGOUT':
            return {};
        case 'SET_AUTH':
            return {
                // ...action
                uid: action.uid,
                email: action.email,
                role: action.role,
                pages: action.pages,
                line: action.admin,
                imgUrl: action.imgUrl
            }
        default:
            return state;
    }
};