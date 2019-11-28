export default (state = { votes: [], random: false, tops: [] }, action) => {
    switch (action.type) {
        case 'SET_GAME_VOTES':
            return {
                ...state,
                votes: action.votes
            };
        case 'SET_GAME_RANDOM':
            return {
                ...state,
                random: action.random
            };
        case 'SET_GAME_TOPS':
            return {
                ...state,
                tops: action.tops
            };
        default:
            return state;
    }
};