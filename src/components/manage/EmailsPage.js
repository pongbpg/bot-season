import React from 'react';
import { connect } from 'react-redux';
import { startGetEmails, startUpdateEmail } from '../../actions/manage/emails';
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
    handleInputChange = (e) => {
        const userId = e.target.name;
        const active = e.target.checked;
        this.props.startUpdateEmail({ userId, active })
        // let emails = this.state.emails.slice();
        // const index = emails.findIndex(f => f.id == id)
        // emails[index] = { ...emails[index], active: e.target.checked }
        // this.setState({ emails })
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
                                        <th className="has-text-left" width="30%">Username</th>
                                        <th className="has-text-centered" width="20%">ประเภท</th>
                                        <th className="has-text-centered" width="20%">เพจ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.emails.length > 0 ?
                                        this.state.emails.sort((a, b) => a.role > b.role ? 1 : -1)
                                            .map((email, index) => {
                                                return (<tr key={email.uid}>
                                                    <td className="has-text-centered">{index + 1}</td>
                                                    <td>{email.email}</td>
                                                    <td className="has-text-centered">{email.role}</td>
                                                    <td className="has-text-centered">{email.pages && email.pages.join()}</td>
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