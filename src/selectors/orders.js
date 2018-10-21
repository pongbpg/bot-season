export default (orders, search) => {
    return orders.filter((order) => {
        const nameMatch = order.name.toLowerCase().includes(search.toLowerCase());
        const idMatch = order.id.toLowerCase().includes(search.toLowerCase());
        const pageMatch = order.page.toLowerCase().includes(search.toLowerCase());
        const adminMatch = order.admin.toLowerCase().includes(search.toLowerCase());
        return nameMatch || idMatch || pageMatch || adminMatch;
    }).sort((a, b) => {
        return a.id > b.id ? 1 : -1;
    })
};
