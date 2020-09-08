export default (state = { sayhis: [], pivotTb: [] }, action) => {
    switch (action.type) {
        case 'SET_ADMINS_SAYHIS':
            return {
                ...state,
                sayhis: action.sayhis
            }
        case 'SET_ADMINS_PIVOT_TB':
            return {
                ...state,
                pivotTb: action.pivotTb
            }
        default:
            return state;
    }
};