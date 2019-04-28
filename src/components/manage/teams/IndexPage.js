import React from 'react';
import { connect } from 'react-redux';
// import { startGetTeams, startPushTeam, startUpdateTeam, startDeleteTeam } from '../../../actions/manage/teams';
// import { startGetAdmins } from '../../../actions/manage/admins';
import TeamsPage from './TeamsPage';
import PagesPage from './PagesPage';
export class TeamsPagesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            // teams: props.teams,
            // team: { id: '', name: '' },
            // teamEdit: { id: '', name: '' },
            // teamSelect: '',
            // admins: props.admins,
            // pages: props.pages
        }
        // this.props.startGetTeams();
        // this.props.startGetAdmins();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        // if (nextProps.teams != this.state.teams) {
        //     this.setState({ teams: nextProps.teams });
        // }
        // if (nextProps.admins != this.state.admins) {
        //     this.setState({ admins: nextProps.admins });
        // }
        // if (nextProps.pages != this.state.pages) {
        //     this.setState({ pages: nextProps.pages });
        // }
    }

    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <TeamsPage />
                    <PagesPage />
               </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    // teams: state.manage.teams,
    // admins: state.manage.admins,
    // pages: state.pages
});
const mapDispatchToProps = (dispatch, props) => ({
    // startGetTeams: () => dispatch(startGetTeams()),
    // startGetAdmins: () => dispatch(startGetAdmins()),
    // startPushTeam: (team) => dispatch(startPushTeam(team)),
    // startUpdateTeam: (team) => dispatch(startUpdateTeam(team)),
    // startDeleteTeam: (team) => dispatch(startDeleteTeam(team))
});
export default connect(mapStateToProps, mapDispatchToProps)(TeamsPagesPage);