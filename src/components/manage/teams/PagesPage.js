import React from 'react';
import { connect } from 'react-redux';
import { startGetAdmins } from '../../../actions/manage/admins';
import { startPushPage, startUpdatePage, startDeletePage } from '../../../actions/manage/pages';
export class PagesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            teams: props.teams,
            coms: props.coms,
            newPage: { id: '' },
            // teamEdit: { id: '', name: '' },
            admins: props.admins,
            pages: props.pages,
            page: { id: '' }
        }
        this.props.startGetAdmins();
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
        this.setState({ newPage: { ...this.state.newPage, team: e.target.value } })
    }
    onNewAdminChange = (e) => {
        this.setState({ newPage: { ...this.state.newPage, admin: e.target.value } })
    }
    onNewComChange = (e) => {
        this.setState({ newPage: { ...this.state.newPage, comId: e.target.value } })
    }
    onNewContryChange = (e) => {
        this.setState({ newPage: { ...this.state.newPage, country: e.target.value } })
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
                if (confirm('คุณแน่ใจที่จะเพิ่มเพจนี้'))
                    this.props.startPushPage(this.state.newPage)
                this.setState({ newPage: { id: '' } })
            }
        } else {
            console.log('กรุณาเลือกข้อมูลให้ครบ')
        }
    }
    onTeamChange = (e) => {
        this.setState({ page: { ...this.state.page, team: e.target.value } })
    }
    onAdminChange = (e) => {
        this.setState({ page: { ...this.state.page, admin: e.target.value } })
    }
    onComChange = (e) => {
        this.setState({ page: { ...this.state.page, ...this.state.coms.find(com => com.comId == e.target.value) } })
    }
    onContryChange = (e) => {
        this.setState({ page: { ...this.state.page, country: e.target.value } })
    }
    onEditClick = (e) => {
        this.setState({ page: this.state.pages.find(f => f.id == e.target.value) })
        console.log(this.state.page)
    }
    onCancelClick = (e) => {
        this.setState({ page: { id: '' } })
    }
    onUpdateClick = (e) => {
        if (this.checkObj(this.state.page)) {
            if (confirm('คุณแน่ใจที่จะแก้ไขข้อมูลเพจนี้'))
                this.props.startUpdatePage(this.state.page)
            this.setState({ page: { id: '' } })
        } else {
            console.log(this.state.page)
            console.log('กรุณาเลือกข้อมูลให้ครบ')
        }
    }
    onDeleteClick = (e) => {
        if (confirm('คุณแน่ใจที่ต้องการจะลบเพจนี้?')) {
            this.props.startDeletePage(this.state.page)
            this.setState({ page: { id: '' } })
        }

    }
    checkObj = (obj) => {
        let ok = true;
        if (Object.keys(obj).length >= 5) {
            for (var p in obj) {
                if (obj[p] == "")
                    ok = false;
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
                                    <select selected={this.state.newPage.admin} onChange={this.onNewAdminChange}>
                                        <option value="">เลือกแอดมิน</option>
                                        {this.state.admins.length > 0 && (
                                            this.state.admins.filter(f => f.active === true).map(admin => {
                                                return (<option key={admin.userId} value={admin.name}>{admin.name}</option>)
                                            })
                                        )}
                                    </select>
                                </div>
                                <div className="control select">
                                    <select selected={this.state.newPage.comId} onChange={this.onNewComChange}>
                                        <option value="">เลือกค่าคอม</option>
                                        {this.state.coms.length > 0 && (
                                            this.state.coms.map(com => {
                                                return (<option key={com.comId} value={com.comId}>{com.salary}</option>)
                                            })
                                        )}
                                    </select>
                                </div>
                                <div className="control select">
                                    <select selected={this.state.newPage.country} onChange={this.onNewContryChange}>
                                        <option value="">เลือกประเทศ</option>
                                        <option value="TH">ไทย</option>
                                        <option value="KH">กัมพูชา</option>
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
                                <th className="has-text-centered" width="10%">ลำดับ</th>
                                <th className="has-text-left" width="20%">Team</th>
                                <th className="has-text-left" width="20%">Page</th>
                                <th className="has-text-left" width="20%">Admin</th>
                                <th className="has-text-left">Com</th>
                                <th className="has-text-left" >Country</th>
                                <th className="has-text-centered" width="50%">จัดการ</th>
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
                                                <td>{page.comId}</td>
                                                <td>{page.country}</td>
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
                                                        <select value={this.state.page.admin} onChange={this.onAdminChange}>
                                                            <option value="">เลือกแอดมิน</option>
                                                            {this.state.admins.length > 0 && (
                                                                this.state.admins.filter(f => f.active === true).map(admin => {
                                                                    return (<option key={admin.userId} value={admin.name}>{admin.name}</option>)
                                                                })
                                                            )}
                                                        </select>
                                                    </div></td>

                                                    <td>
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
                                                    </td>
                                                    <td>
                                                        <div className="control select">
                                                            <select value={this.state.page.country} onChange={this.onContryChange}>
                                                                <option value="">เลือกประเทศ</option>
                                                                <option value="TH">ไทย</option>
                                                                <option value="KH">กัมพูชา</option>
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
    startDeletePage: (page) => dispatch(startDeletePage(page))
});
export default connect(mapStateToProps, mapDispatchToProps)(PagesPage)