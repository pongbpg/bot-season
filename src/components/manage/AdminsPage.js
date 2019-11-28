import React from 'react';
import { connect } from 'react-redux';
import { startGetAdmins, startUpdateAdmin } from '../../actions/manage/admins';
export class AdminsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            coms: props.coms,
            admins: props.admins || []
        }
        this.props.startGetAdmins();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.admins != this.state.admins) {
            this.setState({ admins: nextProps.admins });
        }
    }
    onComChange = (e) => {
        const userId = e.target.name;
        const comId = e.target.value;
        this.props.startUpdateAdmin({ userId, comId })
    }
    handleInputChange = (e) => {
        const userId = e.target.name;
        const active = e.target.checked;
        this.props.startUpdateAdmin({ userId, active })
        // let admins = this.state.admins.slice();
        // const index = admins.findIndex(f => f.id == id)
        // admins[index] = { ...admins[index], active: e.target.checked }
        // this.setState({ admins })
    }
    render() {
        return (
            <section className="hero">

                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">รายชื่อแอดมินไลน์</h2>
                    </div>
                    <div className="columns is-centered">
                        <div className="column is-four-fifths">
                            <table className="table is-fullwidth is-striped is-narrow">
                                <thead>
                                    <tr>
                                        <th className="has-text-centered" width="10%">ลำดับ</th>
                                        <th className="has-text-left" width="30%">ชื่อ</th>
                                        <th className="has-text-centered" width="20%">ประเภท</th>
                                        <th className="has-text-centered" width="20%">คอม</th>
                                        <th className="has-text-centered" width="20%">สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.admins.length > 0 ?
                                        this.state.admins
                                            .map((admin, index) => {
                                                // console.log(admin.comId)
                                                return (<tr key={admin.userId}>
                                                    <td className="has-text-centered">{index + 1}</td>
                                                    <td>{admin.name}</td>
                                                    <td className="has-text-centered">{admin.role}</td>
                                                    <td className="has-text-centered">
                                                        <div className="control select">
                                                            <select value={admin.comId}
                                                                name={admin.userId}
                                                                onChange={this.onComChange}>
                                                                <option value="0">0</option>
                                                                {this.state.coms.length > 0 && (
                                                                    this.state.coms.map(com => {
                                                                        return (<option key={com.comId} value={com.comId}>{com.salary}</option>)
                                                                    })
                                                                )}
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="has-text-centered">
                                                        {admin.active ? (
                                                            <label className="checkbox has-text-success">
                                                                <input type="checkbox" checked={admin.active}
                                                                    onChange={this.handleInputChange}
                                                                    name={admin.userId} /> กำลังใช้งาน
                                                        </label>
                                                        ) : (<label className="checkbox has-text-danger">
                                                            <input type="checkbox" checked={admin.active}
                                                                onChange={this.handleInputChange}
                                                                name={admin.userId} /> ไม่ได้ใช้งาน
                                                        </label>
                                                            )}

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
    admins: state.manage.admins.sort((a, b) => a.active + a.role + a.name < b.active + b.role + b.name ? 1 : -1),
    coms: state.manage.coms
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetAdmins: () => dispatch(startGetAdmins()),
    startUpdateAdmin: (admin) => dispatch(startUpdateAdmin(admin))
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminsPage);