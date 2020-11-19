export default (state = { votes: [], random: false, tops: [], rankings: [], bans: [] }, action) => {
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
        case 'SET_GAME_RANKINGS':
            return {
                ...state,
                rankings: action.rankings
            };
        case 'SET_GAME_BANS':
            return {
                ...state,
                bans: action.bans
            };
        default:
            return state;
    }
};