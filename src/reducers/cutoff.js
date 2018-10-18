export default (state = {}, action) => {
    switch (action.type) {
        case 'SET_CUTOFF':
            return action.cutoff;
        default:
            return state;
    }
};