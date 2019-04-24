import React from 'react';
import { connect } from 'react-redux';
import { startGetTeams, startUpdateTeam } from '../../../actions/manage/teams';
import { startGetAdmins } from '../../../actions/manage/admins';
export class TeamsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            teams: props.teams,
            team: { id: '', name: '' },
            teamSelect: '',
            admins:props.admins,
            pages:props.pages
        }
        this.props.startGetTeams();
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
    onTeamIdChange = (e) => {
        const id = e.target.value.replace(/\s/g, '');
        this.setState({ team: { ...this.state.team, id } })
    }
    onTeamNameChange = (e) => {
        const name = e.target.value.replace(/\s/g, '');
        this.setState({ team: { ...this.state.team, name } })
    }
    onTeamClick = () => {
        if (this.state.team.id != "" && this.state.team.name != "") {

        } else {
            alert('ไอดีทีม หรือชื่อทีมห้ามว่าง')
        }
        console.log(this.state.team)
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-body">


                    <div className="columns is-centered">
                        <div className="column is-full">
                            <div className="container">
                                <h2 className="title">รายชื่อทีม</h2>
                            </div>
                            <div className="level" style={{ marginTop: 20 }}>
                                <div className="level-item">
                                    <div className="field has-addons ">
                                        <div className="control is-expanded">
                                            <input className="input" type="text" value={this.state.team.id} placeholder="ID"
                                                onChange={this.onTeamIdChange} />
                                        </div>
                                        <div className="control is-expanded">
                                            <input className="input" type="text" value={this.state.team.name} placeholder="ชื่อทีม"
                                                onChange={this.onTeamNameChange} />
                                        </div>
                                        <div className="control">
                                            <a className="button is-info" onClick={this.onTeamClick}>เพิ่ม</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="table is-fullwidth is-striped is-narrow">
                                <thead>
                                    <tr>
                                        <th className="has-text-centered">ลำดับ</th>
                                        <th className="has-text-left">Team</th>
                                        <th className="has-text-left">Name</th>
                                        <th className="has-text-centered">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.teams.length > 0 ?
                                        this.state.teams
                                            .map((team, index) => {
                                                return (<tr key={team.id}>
                                                    <td className='has-text-centered'>{index + 1}</td>
                                                    <td>{team.id}</td>
                                                    <td>{team.name}</td>
                                                    <td className="has-text-centered">
                                                        <button className="button"
                                                            value={team.uid}
                                                            onClick={this.onEditClick}>
                                                            แก้ไข</button>
                                                    </td>
                                                </tr>)
                                            }) : (
                                            <tr><td className="has-text-centered" colSpan={5}>กำลังโหลดข้อมูล...</td></tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns is-centered">
                        <div className="column is-full">
                            <div className="container">
                                <h2 className="title">รายชื่อเพจ</h2>
                            </div>
                            <div className="level" style={{ marginTop: 20 }}>
                                <div className="level-item">
                                    <div className="field has-addons ">
                                        <div className="control select">
                                            <select selected={this.state.teamSelect} onChange={this.onTeamSelectChange}>
                                                {this.state.teams.length > 0 && (
                                                    this.state.teams.map(team => {
                                                        return (<option key={team.id} value={team.id}>{team.name}</option>)
                                                    })
                                                )}
                                            </select>
                                        </div>
                                        <div className="control is-expanded">
                                            <input className="input" type="text" value={this.state.newEmail} placeholder="ไอดีเพจ"
                                                onChange={this.onNewChange} />
                                        </div>
                                        <div className="control select">
                                            <select selected={this.state.adminSelect} onChange={this.onAdminSelectChange}>
                                                {this.state.admins.length > 0 && (
                                                    this.state.admins.filter(f=>f.active===true).map(admin => {
                                                        return (<option key={admin.userId} value={admin.userId}>{admin.name}</option>)
                                                    })
                                                )}
                                            </select>
                                        </div>
                                        <div className="control select">
                                            <select selected={this.state.comId} onChange={this.onTeamSelectChange}>
                                                <option value="1">9,000</option>
                                                <option value="2">12,000</option>
                                            </select>
                                        </div>
                                        <div className="control select">
                                            <select selected={this.state.comId} onChange={this.onTeamSelectChange}>
                                                <option value="TH">ไทย</option>
                                                <option value="KH">กัมพูชา</option>
                                            </select>
                                        </div>
                                        <div className="control">
                                            <a className="button is-info" disabled={this.state.checkEmail} onClick={this.onNewClick}> เพิ่ม</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="table is-fullwidth is-striped is-narrow">
                                <thead>
                                    <tr>
                                        <th className="has-text-centered" width="10%">ลำดับ</th>
                                        <th className="has-text-left" width="20%">Page</th>
                                        <th className="has-text-left" width="20%">Admin</th>
                                        <th className="has-text-left" width="20%">Team</th>
                                        <th className="has-text-centered" width="40%">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.pages.length > 0 ?
                                        this.state.pages
                                            .map((page, index) => {
                                                return (<tr key={page.id}>
                                                    <td className='has-text-centered'>{index + 1}</td>
                                                    <td>{page.id}</td>
                                                    <td>{page.admin}</td>
                                                    <td>{page.team}</td>
                                                    <td className="has-text-centered">
                                                        <button className="button"
                                                            value={page.uid}
                                                            onClick={this.onEditClick}>
                                                            แก้ไข</button>
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
    teams: state.manage.teams,
    admins:state.manage.admins,
    pages:state.pages
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetTeams: () => dispatch(startGetTeams()),
    startGetAdmins:()=>dispatch(startGetAdmins()),
    startUpdateTeam: (team) => dispatch(startUpdateTeam(team))
});
export default connect(mapStateToProps, mapDispatchToProps)(TeamsPage);