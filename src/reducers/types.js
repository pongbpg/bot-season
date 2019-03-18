export default (state = [], action) => {
    switch (action.type) {
        case 'SET_TYPES':
            return action.types;
        default:
            return state;
    }
};