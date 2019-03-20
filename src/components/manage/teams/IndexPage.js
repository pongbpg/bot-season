import React from 'react';
import { connect } from 'react-redux';
import { startGetTeams, startUpdateTeam } from '../../../actions/manage/teams';
export class TeamsPages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            teams: props.teams || []
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
    }
   
    
    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">รายชื่อผู้ใช้งาน</h2>
                    </div>
                    <div className="columns is-centered">
                        <div className="column is-four-fifths">
                            <div className="level">
                                <div className="level-left"></div>
                                <div className="level-right">
                                    <button className="button">เพิ่ม</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns is-centered">
                        <div className="column is-full">
                            <table className="table is-fullwidth is-striped is-narrow">
                                <thead>
                                    <tr>
                                        <th className="has-text-centered" width="10%">ลำดับ</th>
                                        <th className="has-text-left" width="20%">อีเมลล์</th>
                                        <th className="has-text-centered" width="10%">ประเภท</th>
                                        <th className="has-text-centered" width="20%">เพจ</th>
                                        <th className="has-text-centered" width="40%">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.teams.length > 0 ?
                                        this.state.teams
                                            .map((team, index) => {
                                                return (<tr key={team.uid}>
                                                    <td className={`has-text-centered ${team.disabled ? 'has-text-grey-light' : ''}`}>{index + 1}</td>
                                                    <td className={team.disabled ? 'has-text-grey-light' : ''}>{team.team}</td>
                                                    <td className={`has-text-centered ${team.disabled ? 'has-text-grey-light' : ''}`}>{team.role}</td>
                                                    <td className={`has-text-centered ${team.disabled ? 'has-text-grey-light' : ''}`}>{team.pages.join()}</td>
                                                    <td className="has-text-centered">
                                                        <button className="button"
                                                            value={team.uid}
                                                            onClick={this.onEditClick}>
                                                            แก้ไข</button>
                                                        &nbsp;
                                                        <button className="button"
                                                            value={team.team}
                                                            onClick={this.onResetClick}>
                                                            รีเซ็ต</button>
                                                        &nbsp;
                                                        <button className={`button is-outlined ${team.disabled ? 'is-info' : 'is-danger'}`}
                                                            name={team.uid}
                                                            value={team.disabled}
                                                            onClick={this.onDisabledClick}>
                                                            {team.disabled ? 'เปิด' : 'ปิด'}ใช้งาน</button>
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
    teams: state.manage.teams
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetTeams: () => dispatch(startGetTeams()),
    startUpdateTeam: (team) => dispatch(startUpdateTeam(team))
});
export default connect(mapStateToProps, mapDispatchToProps)(TeamsPage);