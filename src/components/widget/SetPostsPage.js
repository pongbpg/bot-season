import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import Money from '../../selectors/money';
import NumberFormat from 'react-number-format';
import { startLoginWithFacebook } from '../../actions/auth';

import moment from 'moment';
moment.locale('th');
export class SetPostsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            startDate: moment(),
            endDate: moment(),
            accessToken: 'EAAia6dmIkVgBAIZBzWwPhOBJufWpZCwn1himixyFdqUoZBxkP4G8hKf7JRsD0pDxsZBXN5WUZCxZAExf25hBVxL9fSkV2RFsUZABZCcsm63B2EGrsr6VFyCcFt9OvYtdrgjZBBljli3w8tqBzgoojrD3YCHLfOKblUbJjDOpCUU0DWAZDZD',
            accessToken2: '',
            pageId: 'topslimoffice01',
            pageId2: '',
            posts: [],
            error: '',
            searchTxt: '',
            replaceTxt: ''
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
    onID2Change = (e) => {
        this.setState({ pageId2: e.target.value.replace(/\s/g, '') })
    }
    onToken2Change = (e) => {
        this.setState({ accessToken2: e.target.value })
    }
    onSearchChange = (e) => {
        this.setState({ searchTxt: e.target.value })
    }
    onReplaceChange = (e) => {
        this.setState({ replaceTxt: e.target.value })
    }
    onReplaceClick = (e) => {
        let posts = this.state.posts.map(post => {
            return {
                ...post,
                message: post.checked ? post.message.replace(this.state.searchTxt, this.state.replaceTxt) : post.message
            }
        })
        this.setState({ posts })
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
    onDateChange = (postId, date) => {
        let posts = this.state.posts.slice();
        const index = posts.findIndex(f => f.id == postId)
        posts[index]['date'] = date;
        this.setState({ posts })
    }
    onCalcClick = (e) => {
        const since = moment(this.state.startDate);
        const util = moment(this.state.endDate);
        // const diffDays = util.diff(since, 'days');
        var cors_api_url = `https://graph.facebook.com/v3.2/${this.state.pageId}/posts?access_token=${this.state.accessToken}&fields=full_picture,message,picture&pretty=1&since=${since.startOf('day').unix()}&until=${util.endOf('day').unix()}&limit=100`;
        fetch(cors_api_url)
            .then(function (response) {
                return response.json();
            })
            .then((jsonStr) => {
                const posts = JSON.parse(JSON.stringify(jsonStr));
                if (posts.error) {
                    this.setState({ posts: [], error: posts.error.message })
                } else {
                    this.setState({ posts: this.initData(posts), error: '' })
                }
            })
    }
    initData = (posts) => {
        let data = [];
        let addDay = 0;
        var post1 = moment().add(30, 'm');
        let hr = 0;
        let count = 0;
        if (post1.hour() > 8 && post1.hour() < 18) {
            hr = 17;
            count = 0;
        } else {
            hr = 7;
            addDay = 1;
            count = 1;
        }
        posts.data.map((m, i) => {
            data.push({
                ...m,
                checked: true,
                date: moment().add(addDay, 'd').hour(hr).minute(30),
            })
            if ((count % 2) == 0) {
                addDay++;
                hr = 7;
            } else {
                hr = 17;
            }
            count++;
            // hr = hr == 7 ? 17 : 7;
        })
        return data;
    }
    onPostClick = (e) => {
        if (this.state.pageId2 != '' && this.state.accessToken2 != '') {
            let len = this.state.posts.filter(f => f.checked == true).length;
            console.log(len)
            this.state.posts.map(m => {
                console.log(m.message, m.checked)
                if (m.checked == true) {
                    fetch(`https://graph.facebook.com/v4.0/${this.state.pageId2}/photos?access_token=${this.state.accessToken2}`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: m.message,
                            scheduled_publish_time: moment(m.date).unix(),
                            published: false,
                            url: m.full_picture
                        }),
                    }).then(res => res.json())
                        .then(result => {
                            console.log(JSON.stringify(result))

                            len--;
                            if (len == 0)
                                alert('โพสต์เรียบร้อย')
                        })
                }
            })
        }
    }
    onSelectChange = (e) => {
        let posts = this.state.posts.slice();
        const index = posts.findIndex(f => f.id == e.target.name)
        posts[index]['checked'] = e.target.checked;
        this.setState({ posts })
    }
    onMsgChange = (e) => {
        let posts = this.state.posts.slice();
        const index = posts.findIndex(f => f.id == e.target.name)
        posts[index]['message'] = e.target.value;
        this.setState({ posts })
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
                            <div className="level-item">
                                <div className="field">
                                    <label className="label">Source Page</label>
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
                            <div className="level-item">
                                <div className="field">
                                    <label className="label"></label>
                                    <a className="button is-link" onClick={this.props.startLoginWithFacebook}>Login with Facebook</a>
                               
                                </div>
                            </div>
                        </div>
                        <div className="level">
                            <div className="column is-5">
                                <div className="field">
                                    <label className="label">Seach Text</label>
                                    <input className="input" type="text"
                                        value={this.state.searchTxt}
                                        onChange={this.onSearchChange} />
                                </div>
                            </div>
                            <div className="column is-5">
                                <div className="field">
                                    <label className="label">Replace Text</label>
                                    <input className="input" type="text"
                                        value={this.state.replaceTxt}
                                        onChange={this.onReplaceChange} />
                                </div>
                            </div>
                            <div className="column is-2  has-text-centered">
                                <div className="field">
                                    <label className="label">.</label>
                                    <button className="button is-primary" onClick={this.onReplaceClick}>แทนคำ</button>
                                </div>
                            </div>
                        </div>
                        <div className="level">
                            <div className="column is-5">
                                <div className="field">
                                    <label className="label">Access Token</label>
                                    <input className="input" type="text" placeholder="Access token"
                                        value={this.state.accessToken2}
                                        onChange={this.onToken2Change} />
                                </div>
                            </div>
                            <div className="column is-5">
                                <div className="field">
                                    <label className="label">Destination Page</label>
                                    <input className="input" type="text" placeholder="Page Id"
                                        value={this.state.pageId2}
                                        onChange={this.onID2Change} />
                                </div>
                            </div>
                            <div className="column is-2 has-text-centered">
                                {(this.state.pageId2 != '' && this.state.accessToken2 != '') &&
                                    <div className="field">
                                        <label className="label">.</label>
                                        <button className="button is-info" onClick={this.onPostClick}>ตั้งโพสต์</button>
                                    </div>
                                }
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
                                    <th className="has-text-centered">ลำดับ</th>
                                    <th className="has-text-centered">โพสต์</th>
                                    <th className="has-text-centered">รูป</th>
                                    <th className="has-text-centered">วันที่</th>
                                    <th className="has-text-centered">เวลา</th>
                                    <th className="has-text-centered">เลือก</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.posts.length > 0 &&
                                    this.state.posts.map((post, i) => {
                                        const hr = moment(post.date).hour() < 10 ? '0' + moment(post.date).hour().toString() : moment(post.date).hour();
                                        return <tr key={post.id}>
                                            <td className="has-text-centered">{i + 1}</td>
                                            <td className="has-text-centered">
                                                <textarea className="textarea" name={post.id} rows="10" onChange={this.onMsgChange} value={post.message}></textarea>
                                            </td>
                                            <td className="has-text-centered is-centered">
                                                <figure className="image is-32x32">
                                                    <img src={post.picture}></img>
                                                </figure>
                                            </td>
                                            {/* <td className="has-text-centered">{moment(post.date).format('lll')}</td> */}
                                            <td className="has-text-centered">
                                                <DatePicker
                                                    className="input has-text-centered"
                                                    dateFormat="DD/MM/YYYY"
                                                    placeholderText="เลือกวันที่"
                                                    name={post.id}
                                                    minDate={moment().toDate()}
                                                    selected={moment(post.date)}
                                                    onChange={this.onDateChange.bind(this, post.id)}
                                                /></td>
                                            <td className="has-text-centered">
                                                <NumberFormat className="input is-rounded has-text-right"
                                                    value={hr + ':' + moment(post.date).minute()}
                                                    format="##:##"
                                                    placeholder="ชั่วโมง:นาที"
                                                    allowNegative={false}
                                                    onFocus={this.handleSelectAll}
                                                    onValueChange={(values) => {
                                                        const { formattedValue, value, floatValue } = values;
                                                        const hr = formattedValue.split(':')[0];
                                                        const mn = formattedValue.split(':')[1];
                                                        let posts = this.state.posts.slice();
                                                        const index = posts.findIndex(f => f.id == post.id)
                                                        posts[index]['date'] = moment(posts[index]['date']).hour(hr).minute(mn);
                                                        // console.log(values, post.id)
                                                        // formattedValue = $2,223
                                                        // value ie, 2223
                                                        this.setState({ posts })
                                                    }}
                                                />
                                            </td>
                                            <td><input type="checkbox" checked={post.checked} name={post.id} onChange={this.onSelectChange} /></td>
                                        </tr>;
                                    })
                                }
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
    startLoginWithFacebook: () => dispatch(startLoginWithFacebook())
});
export default connect(mapStateToProps, mapDispatchToProps)(SetPostsPage);