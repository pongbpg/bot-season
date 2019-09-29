export default (state = [], action) => {
    switch (action.type) {
        case 'SET_LIST_CODS':
            return action.cods;
        case 'ADD_COD':
            return [...state, action.cod];
        case 'UPDATE_COD':
            return state.map(cod => {
                if (cod.id !== action.cod.id) return cod
                return { ...cod, ...action.cod }
            })
        case 'CLEAR_COD':
            return [];
        default:
            return state;
    }
};