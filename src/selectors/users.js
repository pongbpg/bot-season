export default (users, text, sortBy) => {
    // console.log(users);
    return users.filter((user) => {
        // const createdAtMoment = moment(expense.createdAt);
        // const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day') : true;
        // const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true;
        const idcardMatch = user.idcard.toLowerCase().includes(text.toLowerCase());
        const nameMatch = user.name.toLowerCase().includes(text.toLowerCase());
        // console.log(idcardMatch, nameMatch);
        return idcardMatch || nameMatch;
    }).sort((a, b) => {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (sortBy === 'name') {
            return nameA > nameB ? 1 : -1;
        } else if (sortBy === 'role') {
            return a.role > b.role ? 1 : -1;
        } else if (sortBy === 'username') {
            return a.idcard > b.idcard ? 1 : -1;
        } else if (sortBy === 'division') {
            return a.division > b.division ? 1 : -1;
        }
    })
    // .sort((a, b) => {
    //     if (sortBy === 'date') {
    //         return a.createdAt < b.createdAt ? 1 : -1;
    //     } else if (sortBy === 'amount') {
    //         return a.amount < b.amount ? 1 : -1;
    //     }
    // });
};
