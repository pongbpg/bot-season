import React from 'react';
import { connect } from 'react-redux';
import { startGetEmails } from '../../../actions/manage/emails';
export class EmailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            emails: props.emails || []
        }
        this.props.startGetEmails();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.emails != this.state.emails) {
            this.setState({ emails: nextProps.emails });
        }
    }
    onEditClick = (e) => {
        this.props.history.push('/manage/email/' + e.target.value)
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">รายชื่อผู้ใช้งาน</h2>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="columns is-centered">
                        <div className="column is-four-fifths">
                            <table className="table is-fullwidth is-striped is-narrow">
                                <thead>
                                    <tr>
                                        <th className="has-text-centered" width="10%">ลำดับ</th>
                                        <th className="has-text-left" width="30%">อีเมลล์</th>
                                        <th className="has-text-centered" width="20%">ประเภท</th>
                                        <th className="has-text-centered" width="20%">เพจ</th>
                                        <th className="has-text-centered" width="20%">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.emails.length > 0 ?
                                        this.state.emails
                                            .map((email, index) => {
                                                return (<tr key={email.uid}>
                                                    <td className="has-text-centered">{index + 1}</td>
                                                    <td>{email.email}</td>
                                                    <td className="has-text-centered">{email.role}</td>
                                                    <td className="has-text-centered">{email.pages.join()}</td>
                                                    <td className="has-text-centered">
                                                        <button className="button" value={email.uid}
                                                            onClick={this.onEditClick}>แก้ไข</button>
                                                    </td>
                                                </tr>)
                                            }) : (
                                            <tr><td className="has-text-centered" colSpan={5}>กำลังโหลดข้อมูล...</td></tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    emails: state.manage.emails
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetEmails: () => dispatch(startGetEmails()),
    startUpdateEmail: (email) => dispatch(startUpdateEmail(email))
});
export default connect(mapStateToProps, mapDispatchToProps)(EmailsPage);