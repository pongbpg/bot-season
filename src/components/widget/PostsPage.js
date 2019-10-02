import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import Money from '../../selectors/money';
import moment from 'moment';
moment.locale('th');
export class PostsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            startDate: moment(),
            endDate: moment(),
            accessToken: 'EAAia6dmIkVgBAIZBzWwPhOBJufWpZCwn1himixyFdqUoZBxkP4G8hKf7JRsD0pDxsZBXN5WUZCxZAExf25hBVxL9fSkV2RFsUZABZCcsm63B2EGrsr6VFyCcFt9OvYtdrgjZBBljli3w8tqBzgoojrD3YCHLfOKblUbJjDOpCUU0DWAZDZD',
            pageId: '',
            posts: [],
            error: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
    }
    onIDChange = (e) => {
        this.setState({ pageId: e.target.value.replace(/\s/g, '') })
    }
    onTokenChange = (e) => {
        this.setState({ accessToken: e.target.value })
    }
    handleStartChange = (date) => {
        this.setState({
            startDate: date
        });
    }
    handleEndChange = (date) => {
        this.setState({
            endDate: date
        });
    }
    onCalcClick = (e) => {
        const since = moment(this.state.startDate);
        const util = moment(this.state.endDate);
        const diffDays = util.diff(since, 'days');
        let data = [];
        let start = moment(this.state.startDate);
        for (var i = 0; i <= diffDays; i++) {
            data.push({ date: start.format('YYYY-MM-DD'), detail: [], time1: false, time2: false })
            start.add(1, 'days')
        }

        var cors_api_url = `https://graph.facebook.com/v3.2/${this.state.pageId}/posts?access_token=${this.state.accessToken}&pretty=1&since=${since.startOf('day').unix()}&until=${util.endOf('day').unix()}&limit=100`;
        fetch(cors_api_url)
            .then(function (response) {
                return response.json();
            })
            .then((jsonStr) => {
                const posts = JSON.parse(JSON.stringify(jsonStr));
                if (posts.error) {
                    this.setState({ posts: [], error: posts.error.message })
                } else {
                    posts.data.map(m => {
                        const findIndex = data.findIndex(f => f.date == moment(m.created_time).format('YYYY-MM-DD'));
                        const thisTime = moment(m.created_time).format('HHmm');
                        const thisData = data[findIndex];
                        if (thisTime >= '0600' && thisTime <= '1000' && thisData.time1 == false) {
                            data[findIndex].time1 = '(' + moment(m.created_time).format('HH:mm') + ') ' + m.message;
                        } else if (thisTime >= '1600' && thisTime <= '2000' && thisData.time2 == false) {
                            data[findIndex].time2 = '(' + moment(m.created_time).format('HH:mm') + ') ' + m.message;
                        } else {
                            data[findIndex].detail.push(moment(m.created_time).format('HH:mm'));
                            //     time: thisTime,
                            //     timestamp: moment(m.created_time).unix(),
                            //     content: m.message
                            // })
                        }
                        // return {
                        //     date: moment(m.created_time).format('YYYY-MM-DD'),
                        //     time: moment(m.created_time).format('HHMM'),
                        //     timestamp: moment(m.created_time).unix(),
                        //     content: m.message
                        // }
                    })
                    this.setState({ posts: data, error: '' })
                }
            })
    }

    render() {
        let sumFine = 0;
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">จำนวนโพสต์เพจ <a href="https://developers.facebook.com/tools/explorer/?classic=0" target="_blank">Get Token</a></h2>
                    </div>

                    <div className="column is-full">
                        <div className="level">
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">เลือกวันที่</label>
                                    <DatePicker
                                        className="input has-text-centered"
                                        dateFormat="DD/MM/YYYY"
                                        placeholderText="เลือกวันที่"
                                        selected={this.state.startDate}
                                        onChange={this.handleStartChange}
                                    />
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">ถึงวันที่</label>
                                    <DatePicker
                                        className="input has-text-centered"
                                        dateFormat="DD/MM/YYYY"
                                        placeholderText="เลือกวันที่"
                                        selected={this.state.endDate}
                                        onChange={this.handleEndChange}
                                    />
                                </div>
                            </div>
                            {/* <div className="level-item">
                                <div className="field">
                                    <label className="label">Access Token</label>
                                    <input className="input" type="text" placeholder="Access token"
                                        value={this.state.accessToken}
                                        onChange={this.onTokenChange} />
                                </div>
                            </div> */}
                            <div className="level-item">
                                <div className="field">
                                    <label className="label">Page ID</label>
                                    <input className="input" type="text" placeholder="Page Id"
                                        value={this.state.pageId}
                                        onChange={this.onIDChange} />
                                </div>
                            </div>

                        </div>
                        <div className="level">
                            <div className="level-item">
                                <div className="field">
                                    <label className="label"></label>
                                    <button className="button is-large" onClick={this.onCalcClick}>ค้นหา</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column has-text-centered">
                        <p className="help is-danger">{this.state.error}</p>
                    </div>
                    <div className="container">
                        <table className="table is-bordered is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    {/* <th className="has-text-centered">ลำดับ</th> */}
                                    <th className="has-text-centered">วันที่</th>
                                    <th className="has-text-centered">06.00-10.00</th>
                                    <th className="has-text-centered">16.00-20.00</th>
                                    <th className="has-text-centered">เวลาอื่นๆ</th>
                                    <th className="has-text-centered">หักค่าคอมฯ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.posts.length > 0 &&
                                    this.state.posts.map((post, i) => {
                                        let fine = 25;
                                        if (post.time1) fine -= 12.5;
                                        if (post.time2) fine -= 12.5;
                                        sumFine += fine;
                                        return <tr key={post.date}>
                                            {/* <td className="has-text-centered">{++i}</td> */}
                                            <td className="has-text-centered">{post.date}</td>
                                            <td className="has-text-centered">{post.time1 ? post.time1.substr(0, 30) : <p className="has-text-grey-lighter has-text-weight-bold">No Posted.</p>}</td>
                                            <td className="has-text-centered">{post.time2 ? post.time2.substr(0, 30) : <p className="has-text-grey-lighter has-text-weight-bold">No Posted.</p>}</td>
                                            <td className="has-text-centered">{post.detail.sort((a, b) => a > b ? 1 : -1).join(',')}</td>
                                            <td className={`has-text-right has-text-weight-bold has-text-${fine == 0 ? 'success' : (fine == 12.5 ? 'warning' : 'danger')}`}>{Money(fine)}</td>
                                        </tr>;
                                    })
                                }
                                <tr>
                                    <td colSpan={4} className="has-text-centered has-text-weight-bold">รวม</td>
                                    <td className="has-text-right has-text-weight-bold">{Money(sumFine)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth
});
const mapDispatchToProps = (dispatch, props) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(PostsPage);