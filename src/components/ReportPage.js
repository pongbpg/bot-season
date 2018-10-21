import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
moment.locale('th');
export class ReportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment()
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(date) {
        this.setState({
            startDate: date
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.cutoff != this.state.cutoff) {
            this.setState({ cutoff: nextProps.cutoff });
        }
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">รายงาน</h1>

                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column is-half">
                        <div className="level">
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">เลือกวันที่</label>
                                    <DatePicker
                                        className="input has-text-centered"
                                        dateFormat="DD/MM/YYYY"
                                        placeholderText="เลือกวันที่"
                                        selected={this.state.startDate}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column">
                        <table className="table is-bordered is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <th className="has-text-centered">ลำดับ</th>
                                    <th className="has-text-centered">รายงาน</th>
                                    <th className="has-text-centered">พิมพ์</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="has-text-centered">1</td>
                                    <td className="has-text-centered">รายชื่อแพ็คของ</td>
                                    <td className="has-text-centered">
                                        <a className="button is-info is-centered"
                                            href={`http://yaumjai.com:3000/api/report/print?date=${moment(this.state.startDate).format('YYYYMMDD')}`}
                                            target="_blank">
                                            PDF
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </section>
        )
    }
}
const mapStateToProps = (state, props) => ({

});
const mapDispatchToProps = (dispatch, props) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(ReportPage);