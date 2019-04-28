export default (state = [], action) => {
    switch (action.type) {
        case 'SET_LIST_PAGES':
            return action.pages;
        case 'SET_PAGE':
            return state.map(page => {
                if (page.id !== action.page.id) return page
                return { ...page, ...action.page }
            })
        case 'PUSH_PAGE':
            return [...state, action.page]
        case 'REMOVE_PAGE':
            return state.filter(page => page.id != action.page.id)
        default:
            return state;
    }
};