import React from 'react';
import { connect } from 'react-redux';
import { startGetAdmins } from '../../../actions/manage/admins';
import { startPushPage, startUpdatePage, startDeletePage } from '../../../actions/manage/pages';
import { startListPages } from '../../../actions/pages';
export class PagesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            teams: props.teams,
            coms: props.coms,
            newPage: { id: '', active: true },
            // teamEdit: { id: '', name: '' },
            admins: props.admins,
            pages: props.pages,
            page: { id: '', actId: '' }
        }
        this.props.startGetAdmins();
        this.props.startListPages(props.auth);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.teams != this.state.teams) {
            this.setState({ teams: nextProps.teams });
        }
        if (nextProps.admins != this.state.admins) {
            this.setState({ admins: nextProps.admins });
        }
        if (nextProps.pages != this.state.pages) {
            this.setState({ pages: nextProps.pages });
        }
    }

    onNewTeamChange = (e) => {
        const country = this.state.teams.find(team => team.id == e.target.value).country
        this.setState({ newPage: { ...this.state.newPage, team: e.target.value, country } })
    }
    onNewAdminChange = (e) => {
        const admin = this.state.admins.find(f => f.userId == e.target.value)
        this.setState({ newPage: { ...this.state.newPage, admin: admin.name, adminId: admin.userId } })
    }
    onNewComChange = (e) => {
        this.setState({ newPage: { ...this.state.newPage, comId: e.target.value } })
    }

    onNewIdChange = (e) => {
        this.setState({ newPage: { ...this.state.newPage, id: e.target.value.toUpperCase() } })
    }
    onNewPageClick = (e) => {
        // console.log(this.state.newPage, Object.keys(this.state.newPage).length)

        if (this.checkObj(this.state.newPage)) {
            if (this.state.pages.filter(f => f.id == this.state.newPage.id).length > 0) {
                alert('ไอดีเพจนี้มีการใช้แล้ว')
            } else {
                if (confirm('คุณแน่ใจที่จะเพิ่มเพจนี้')) {
                    this.props.startPushPage(this.state.newPage)
                    this.props.startListPages(this.state.auth);
                }
                this.setState({ newPage: { id: '' } })
            }
        } else {
            console.log('กรุณาเลือกข้อมูลให้ครบ')
        }
    }
    onTeamChange = (e) => {
        const country = this.state.teams.find(team => team.id == e.target.value).country
        this.setState({ page: { ...this.state.page, team: e.target.value, country } })
    }
    onAdminChange = (e) => {
        const admin = this.state.admins.find(f => f.userId == e.target.value)
        // console.log(admin)
        this.setState({ page: { ...this.state.page, admin: admin.name, adminId: admin.userId } })
    }
    onComChange = (e) => {
        this.setState({ page: { ...this.state.page, ...this.state.coms.find(com => com.comId == e.target.value) } })
    }
    onActIdChange = (e) => {
        const actId = e.target.value.replace(/\s/g, '');
        this.setState({ page: { ...this.state.page, actId } })
    }
    onActiveChange = (e) => {
        this.setState({ page: { ...this.state.page, active: e.target.value == 'true' ? true : false } })
    }
    onEditClick = (e) => {
        this.setState({ page: this.state.pages.find(f => f.id == e.target.value) })
        // console.log(this.state.page)
    }
    onCancelClick = (e) => {
        this.setState({ page: { id: '', actId: '' } })
    }
    onUpdateClick = (e) => {
        if (this.checkObj(this.state.page)) {
            if (confirm('คุณแน่ใจที่จะแก้ไขข้อมูลเพจนี้')) {
                this.props.startUpdatePage(this.state.page)
                this.props.startListPages(this.state.auth);
            }

            this.setState({ page: { id: '', actId: '' } })
        } else {
            console.log(this.state.page)
            alert('กรุณาเลือกข้อมูลให้ครบ')
        }
    }
    onDeleteClick = (e) => {
        if (confirm('คุณแน่ใจที่ต้องการจะลบเพจนี้?')) {
            this.props.startDeletePage(this.state.page)
            this.props.startListPages(this.state.auth);
            this.setState({ page: { id: '', actId: '' } })
        }

    }
    checkObj = (obj) => {
        let ok = true;
        if (Object.keys(obj).length >= 5) {
            for (var p in obj) {
                if (obj[p] == "" && obj[p] != false) {
                    ok = false;
                    console.log(obj[p])
                }
            }
        } else {
            ok = false;
        }
        return ok;
    }
    render() {
        return (

            <div className="columns is-centered">
                <div className="column is-full">
                    <div className="container">
                        <h2 className="title">รายชื่อเพจ</h2>
                    </div>
                    <div className="level" style={{ marginTop: 20 }}>
                        <div className="level-item">
                            <div className="field has-addons ">
                                <div className="control select">
                                    <select selected={this.state.newPage.team} onChange={this.onNewTeamChange}>
                                        <option value="">เลือกทีม</option>
                                        {this.state.teams.length > 0 && (
                                            this.state.teams.map(team => {
                                                return (<option key={team.id} value={team.id}>{team.name}</option>)
                                            })
                                        )}
                                    </select>
                                </div>
                                <div className="control is-expanded">
                                    <input className="input" type="text" value={this.state.newPage.id} placeholder="ไอดีเพจ"
                                        onChange={this.onNewIdChange} />
                                </div>
                                <div className="control select">
                                    <select selected={this.state.newPage.adminId} onChange={this.onNewAdminChange}>
                                        <option value="">เลือกแอดมิน</option>
                                        {this.state.admins.length > 0 && (
                                            this.state.admins.filter(f => f.active === true).map(admin => {
                                                return (<option key={admin.userId} value={admin.userId}>{admin.name}</option>)
                                            })
                                        )}
                                    </select>
                                </div>
                                <div className="control">
                                    <a className="button is-info" onClick={this.onNewPageClick}> เพิ่ม</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="table is-fullwidth is-striped is-narrow">
                        <thead>
                            <tr>
                                <th className="has-text-centered" width="5%">ลำดับ</th>
                                <th className="has-text-left">Team</th>
                                <th className="has-text-left">Page</th>
                                <th className="has-text-left">Admin</th>
                                {/* <th className="has-text-left">Com</th> */}
                                <th className="has-text-left" >Act ID</th>
                                <th className="has-text-left" >Status</th>
                                <th className="has-text-centered" width="10%">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.pages.length > 0 ?
                                this.state.pages.filter(f => f.team == this.state.newPage.team)
                                    .map((page, index) => {
                                        return this.state.page.id != page.id ? (
                                            <tr key={page.id}>
                                                <td className='has-text-centered'>{index + 1}</td>
                                                <td>{page.team}</td>
                                                <td>{page.id}</td>
                                                <td>{page.admin}</td>
                                                {/* <td>{page.comId}</td> */}
                                                <td>{page.actId}</td>
                                                <td>{page.active ? 'เปิด' : 'ปิด'}</td>
                                                <td className="has-text-centered">
                                                    <button className="button"
                                                        value={page.id}
                                                        onClick={this.onEditClick}>
                                                        แก้ไข</button>
                                                </td>
                                            </tr>
                                        ) : (
                                                <tr key={page.id}>
                                                    <td className='has-text-centered'>{index + 1}</td>
                                                    <td><div className="control select">
                                                        <select value={this.state.page.team} onChange={this.onTeamChange}>
                                                            <option value="">เลือกทีม</option>
                                                            {this.state.teams.length > 0 && (
                                                                this.state.teams.map(team => {
                                                                    return (<option key={team.id} value={team.id}>{team.name}</option>)
                                                                })
                                                            )}
                                                        </select>
                                                    </div></td>
                                                    <td>{page.id}</td>
                                                    <td><div className="control select">
                                                        <select value={this.state.page.adminId} onChange={this.onAdminChange}>
                                                            <option value="">เลือกแอดมิน</option>
                                                            {this.state.admins.length > 0 && (
                                                                this.state.admins.filter(f => f.active === true).map(admin => {
                                                                    return (<option key={admin.userId} value={admin.userId}>{admin.name}</option>)
                                                                })
                                                            )}
                                                        </select>
                                                    </div></td>

                                                    {/* <td>
                                                        <div className="control select">
                                                            <select value={this.state.page.comId} onChange={this.onComChange}>
                                                                <option value="">เลือกค่าคอม</option>
                                                                {this.state.coms.length > 0 && (
                                                                    this.state.coms.map(com => {
                                                                        return (<option key={com.comId} value={com.comId}>{com.salary}</option>)
                                                                    })
                                                                )}
                                                            </select>
                                                        </div>
                                                    </td> */}
                                                    <td>
                                                        <input type="text" className="input" onChange={this.onActIdChange} value={this.state.page.actId} />

                                                    </td>
                                                    <td>
                                                        <div className="control select">
                                                            <select value={this.state.page.active} onChange={this.onActiveChange}>
                                                                <option value="true">เปิด</option>
                                                                <option value="false">ปิด</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="has-text-centered">
                                                        <button className="button is-primary"
                                                            value={page.id}
                                                            onClick={this.onUpdateClick}>
                                                            บันทึก</button>&nbsp;
                                                            <button className="button is-danger"
                                                            value={page.id}
                                                            onClick={this.onDeleteClick}>
                                                            ลบ</button>&nbsp;
                                                            <button className="button"
                                                            value={page.id}
                                                            onClick={this.onCancelClick}>
                                                            ยกเลิก</button>
                                                    </td>
                                                </tr>
                                            )
                                    })
                                : (<tr><td className="has-text-centered" colSpan={5}>กำลังโหลดข้อมูล...</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    teams: state.manage.teams,
    admins: state.manage.admins,
    pages: state.pages,
    coms: state.manage.coms
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetAdmins: () => dispatch(startGetAdmins()),
    startPushPage: (page) => dispatch(startPushPage(page)),
    startUpdatePage: (page) => dispatch(startUpdatePage(page)),
    startDeletePage: (page) => dispatch(startDeletePage(page)),
    startListPages: (auth) => dispatch(startListPages(auth))
});
export default connect(mapStateToProps, mapDispatchToProps)(PagesPage)