import React from 'react';
import { connect } from 'react-redux';
import { startGetTeams, startPushTeam, startUpdateTeam, startDeleteTeam } from '../../../actions/manage/teams';
export class TeamsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            teams: props.teams,
            team: { id: '', name: '', country: '' },
            teamEdit: { id: '', name: '', country: '' },
            pages: props.pages
        }
        this.props.startGetTeams();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.teams != this.state.teams) {
            this.setState({ teams: nextProps.teams });
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
    onNewContryChange = (e) => {
        this.setState({ team: { ...this.state.team, country: e.target.value } })
    }
    onTeamNameEditChange = (e) => {
        const name = e.target.value.replace(/\s/g, '');
        this.setState({ teamEdit: { ...this.state.teamEdit, name } })
    }
    onContryChange = (e) => {
        this.setState({ teamEdit: { ...this.state.teamEdit, country: e.target.value } })
    }
    onTeamEditClick = (e) => {
        this.setState({ teamEdit: this.state.teams.find(f => f.id == e.target.value) })
    }
    onTeamCancelClick = (e) => {
        this.setState({ teamEdit: { id: '', name: '', country: '' } })
    }
    onTeamUpdateClick = (e) => {
        if (confirm('คุณต้องการบันทึกข้อมูลนี้?')) {
            this.props.startUpdateTeam(this.state.teamEdit)
            this.setState({ teamEdit: { id: '', name: '', country: '' } })
        }
    }
    onTeamDeleteClick = (e) => {
        if (this.state.pages.filter(f => f.team == e.target.value).length > 0) {
            alert('ทีมนี้มีลูกเพจอยู่ ไม่สามารถลบได้!!\n(ให้ทำการย้ายลูกเพจไปทีมอื่นให้เรียบร้อยก่อน)')
        } else {
            if (confirm('คุณแน่ใจที่ต้องการจะลบทีมนี้?')) {
                this.props.startDeleteTeam(this.state.teamEdit)
                this.setState({ teamEdit: { id: '', name: '', country: '' } })
            }
        }
    }
    onTeamClick = () => {
        const newId = this.state.team.id;
        if (newId != "" && this.state.team.name != "") {
            if (this.state.teams.find(f => f.id.toUpperCase() == newId.toUpperCase())) {
                alert('ไอดีทีมนี้มีการใช้แล้ว')
            } else {
                this.props.startPushTeam(this.state.team)
                this.setState({ team: { id: '', name: '', country: '' } })
            }
        } else {
            alert('ไอดีทีม หรือชื่อทีม ห้ามว่างจ้า')
        }
    }
    render() {
        return (
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
                                <div className="control select">
                                    <select selected={this.state.team.country} onChange={this.onNewContryChange}>
                                        <option value="">เลือกประเทศ</option>
                                        <option value="TH">ไทย</option>
                                        <option value="KH">กัมพูชา</option>
                                    </select>
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
                                <th className="has-text-left">Id</th>
                                <th className="has-text-left">ชื่อทีม</th>
                                <th className="has-text-left">ประเทศ</th>
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
                                            <td>{this.state.teamEdit.id != team.id ? team.name : (
                                                <input type="text" className="input" onChange={this.onTeamNameEditChange} value={this.state.teamEdit.name} />
                                            )}</td>
                                            <td>{this.state.teamEdit.id != team.id ? team.country : (
                                                <div className="control select">
                                                    <select value={this.state.teamEdit.country} onChange={this.onContryChange}>
                                                        <option value="">เลือกประเทศ</option>
                                                        <option value="TH">ไทย</option>
                                                        <option value="KH">กัมพูชา</option>
                                                    </select>
                                                </div>
                                            )}</td>
                                            {this.state.teamEdit.id != team.id ? (
                                                <td className="has-text-centered">
                                                    <button className="button"
                                                        value={team.id}
                                                        onClick={this.onTeamEditClick}>
                                                        แก้ไข</button>
                                                </td>
                                            ) : (<td className="has-text-centered">
                                                <button className="button is-primary"
                                                    value={team.id}
                                                    onClick={this.onTeamUpdateClick}>
                                                    บันทึก</button>&nbsp;
                                                        <button className="button is-danger"
                                                    value={team.id}
                                                    onClick={this.onTeamDeleteClick}>
                                                    ลบ</button>&nbsp;
                                                        <button className="button"
                                                    value={team.id}
                                                    onClick={this.onTeamCancelClick}>
                                                    ยกเลิก</button>
                                            </td>
                                                )}

                                        </tr>)
                                    }) : (
                                    <tr><td className="has-text-centered" colSpan={5}>กำลังโหลดข้อมูล...</td></tr>
                                )}
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
    pages: state.pages
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetTeams: () => dispatch(startGetTeams()),
    startPushTeam: (team) => dispatch(startPushTeam(team)),
    startUpdateTeam: (team) => dispatch(startUpdateTeam(team)),
    startDeleteTeam: (team) => dispatch(startDeleteTeam(team))
});
export default connect(mapStateToProps, mapDispatchToProps)(TeamsPage);