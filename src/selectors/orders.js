export default (users, text, sortBy) => {
    // console.log(users);
    return users.filter((user) => {
        const idcardMatch = user.idcard.toLowerCase().includes(text.toLowerCase());
        const nameMatch = user.name.toLowerCase().includes(text.toLowerCase());
        return idcardMatch || nameMatch;
    }).sort((a, b) => {
        return a.id > b.id ? 1 : -1;
    })
};
