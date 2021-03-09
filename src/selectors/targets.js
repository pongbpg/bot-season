export default (targets, year, month) => {
    let lists = [];
    if (targets.find(f => f.id == year)) {
        const data = targets.find(f => f.id == year).months;
        if (data.find(f => f.month == month)) {
            lists = data.find(f => f.month == month).pages;
        }
    }
    return lists.sort((a, b) => a.team + a.page > b.team + b.page ? 1 : -1);
}