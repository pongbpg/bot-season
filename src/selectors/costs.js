export default (costs, pages, date) => {
    // console.log('select costs',costs)
    // console.log('select pages',pages)
    if (costs.length != pages.length) {
        for (let p = 0; p < pages.length; p++) {
            // console.log(pages[p])
            const index = costs.findIndex(f => f.page == pages[p].id)

            // console.log('data',data)
            if (index == -1) {
                costs.push({
                    page: pages[p].id,
                    admin: pages[p].admin,
                    team: pages[p].team,
                    fb: 0,
                    line: 0,
                    other: 0,
                    date,
                    year: date.substr(0, 4),
                    month: date.substr(4, 2),
                    day: date.substr(6, 2)
                })
            } else {
                costs[index]['team'] = pages[p].team
            }
        }
    }
    return costs.sort((a, b) => a.team + a.page > b.team + b.page ? 1 : -1)
};