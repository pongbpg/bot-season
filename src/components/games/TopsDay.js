import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { startGetTopsDay } from '../../actions/games/topdays';
import { startGetEmails } from '../../actions/manage/emails';
import moment from 'moment';
moment.locale('th');
export class TopsDayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            tops: props.tops || [],
            emails: props.emails || [],
            date: moment()
        }
        this.onDateChange = this.onDateChange.bind(this);
        this.props.startGetEmails();
        this.props.startGetTopsDay(moment().format('YYYYMMDD'));
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth })
        }
        if (nextProps.tops != this.state.tops) {
            this.setState({ tops: nextProps.tops })
        }
        if (nextProps.emails != this.state.emails) {
            this.setState({ emails: nextProps.emails })
        }
    }
    onDateChange = (date) => {
        this.props.startGetTopsDay(moment(date).format('YYYYMMDD'))
        this.setState({
            date
        });
    }

    render() {
        return (
            <section className="hero">
                <div className="hero-head">
                    <div className="level">
                        <div className="level-left">
                            <div className="level-item">
                                <h2 className="title">Tops Day :</h2>
                            </div>
                            <div className="level-item">
                                <DatePicker
                                    className="input has-text-centered"
                                    dateFormat="DD/MM/YYYY"
                                    placeholderText="เลือกวันที่"
                                    selected={this.state.date}
                                    onChange={this.onDateChange}
                                    filterDate={(date) => {
                                        return moment() > date;
                                    }}
                                />
                            </div>
                        </div>
                        <div className="level-right">

                        </div>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="level">
                        {this.state.tops.map((top, i) => {
                            const admin = this.state.emails.filter(f => f.adminId == top.adminId)[0];
                            if (admin) {
                                return (
                                    <div className="level-item" key={top.adminId}>
                                        <div className="card">
                                            <div className="card-image">
                                                <figure className="image is-4by3">
                                                    <img src={admin.imgUrl} />
                                                </figure>
                                            </div>
                                            <div className="card-content">
                                                <div className="media">
                                                    <div className="media-content">
                                                        <p className="title is-4">
                                                            {i+1}.{admin.admin}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    tops: state.games.tops,
    auth: state.auth,
    emails: state.manage.emails
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetTopsDay: (date) => dispatch(startGetTopsDay(date)),
    startGetEmails: () => dispatch(startGetEmails())
});
export default connect(mapStateToProps, mapDispatchToProps)(TopsDayPage);