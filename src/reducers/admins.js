export default (state = { sayhis: [], sellProducts: [] }, action) => {
    switch (action.type) {
        case 'SET_ADMINS_SAYHIS':
            return {
                ...state,
                sayhis: action.sayhis
            }
        case 'SET_ADMINS_SELL_PRODUCTS':
            return {
                ...state,
                sellProducts: action.sellProducts
            }
        default:
            return state;
    }
};