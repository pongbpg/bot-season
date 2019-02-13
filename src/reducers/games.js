export default (state = { votes: [], random: false }, action) => {
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
        default:
            return state;
    }
};