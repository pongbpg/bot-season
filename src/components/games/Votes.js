import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import AddItemVote from './AddItem';
import { startGetVotes, startGetRandom, startToggleActive, startUpdateScores, startSetRandom } from '../../actions/games/votes';
moment.locale('th');
export class VotesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            votes: props.votes || [],
            auth: props.auth,
            score: 0,
            random: props.random
        }
        this.props.startGetVotes();
        this.props.startGetRandom();
    }
    componentWillReceiveProps(nextProps) {

        if ((nextProps.random != this.state.random) || (nextProps.votes != this.state.votes)) {
            this.setState({
                votes: nextProps.random ? this.shuffle(nextProps.votes) : nextProps.votes.map(vote => {
                    return {
                        ...vote,
                        sort: vote.scores.length > 0 ? vote.scores.map(m => m.score || 0).reduce((a, b) => a + b) : 0
                    }
                }).sort((a, b) => {
                    return a.sort > b.sort ? -1 : 1;
                }),
                random: nextProps.random
            });
        }

    }
    onActiveClick = (e) => {
        this.props.startToggleActive(this.state.votes.find(f => f.id === e.target.id))
    }
    onScoreClick = (sc, id) => {
        let scores = this.state.votes.find(f => f.id == id).scores;
        let score = scores.find(f => f.email == this.state.auth.email)
        if (score) {
            score = { ...score, score: sc }
            scores = scores.map(el => (el.email === this.state.auth.email ? { ...score } : el))
        } else {
            score = { score: sc, email: this.state.auth.email }
            scores.push(score)
        }
        this.setState({ score: sc })
        this.props.startUpdateScores(id, scores)
    }
    onRandomClick = () => {
        const random = !this.state.random;
        this.setState({ random })
        this.props.startSetRandom(random)
    }
    shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">ระบบโหวต TOPSLIM</h1>
                    </div>
                </div>
                {this.state.auth.role == 'owner' && (<div className="column"><AddItemVote /></div>)}
                {this.state.auth.role == 'owner' && (
                    <div className="column is-4 is-offset-10">
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">เรียง:</label>
                            </div>
                            <div className="field-body">
                                <button className="button"
                                    onClick={this.onRandomClick}>
                                    {this.state.random ? 'สุ่ม' : 'คะแนน'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="columns is-mobile is-centered">
                    <div className="column">
                        <table className="table is-bordered is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <th className="has-text-centered">อันดับ</th>
                                    <th className="has-text-centered">ชื่อ</th>
                                    {this.state.auth.role == 'owner' && <th className="has-text-centered">คะแนนที่ได้</th>}
                                    <th className="has-text-centered">ลงคะแนน</th>
                                    <th className="has-text-centered">จำนวนผู้ลงคะแนน</th>
                                    {(this.state.auth.role == 'owner' && this.state.votes.length > 0) && <th className="has-text-centered">สถานะ</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.votes.length == 0 ? (
                                        <tr>
                                            <td colSpan="5" className="has-text-centered">ยังไม่มีผู้สมัคร</td>
                                        </tr>
                                    ) : (
                                            this.state.votes.map((vote, i) => {
                                                let score = vote.scores.find(f => f.email == this.state.auth.email);
                                                score = score ? score.score : 0;
                                                return (
                                                    <tr key={vote.id}>
                                                        <td className="has-text-centered">{i + 1}</td>
                                                        <td className="has-text-centered">{vote.id}</td>
                                                        {this.state.auth.role == 'owner' && <td className="has-text-centered">{vote.scores.length > 0 ?
                                                            vote.scores.map(m => m.score || 0).reduce((a, b) => a + b) : 0}
                                                        </td>}
                                                        <td className="">
                                                            <span className="buttons is-centered">
                                                                <button className="button" disabled={!vote.active || score == 0} onClick={() => this.onScoreClick(0, vote.id)}>0</button>
                                                                <button className="button is-danger" disabled={!vote.active || score == 1} onClick={() => this.onScoreClick(1, vote.id)}>1</button>
                                                                <button className="button is-warning" disabled={!vote.active || score == 2} onClick={() => this.onScoreClick(2, vote.id)}>2</button>
                                                                <button className="button is-success" disabled={!vote.active || score == 3} onClick={() => this.onScoreClick(3, vote.id)}>3</button>
                                                                <button className="button is-primary" disabled={!vote.active || score == 4} onClick={() => this.onScoreClick(4, vote.id)}>4</button>
                                                                <button className="button is-link" disabled={!vote.active || score == 5} onClick={() => this.onScoreClick(5, vote.id)}>5</button>
                                                            </span>
                                                        </td>
                                                        <td className="has-text-centered">{vote.scores.length}</td>
                                                        {this.state.auth.role == 'owner' &&
                                                            <td className="has-text-centered">
                                                                <button className={`button ${vote.active && 'is-info'}`}
                                                                    id={vote.id}
                                                                    onClick={this.onActiveClick}>
                                                                    {vote.active ? 'Active' : 'Inactive'}
                                                                </button>
                                                            </td>
                                                        }
                                                    </tr>
                                                )
                                            })
                                        )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        )
    }
}
const mapStateToProps = (state, props) => ({
    votes: state.games.votes,
    random: state.games.random,
    auth: state.auth
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetVotes: () => dispatch(startGetVotes()),
    startGetRandom: () => dispatch(startGetRandom()),
    startToggleActive: (vote) => dispatch(startToggleActive(vote)),
    startUpdateScores: (id, scores) => dispatch(startUpdateScores(id, scores)),
    startSetRandom: (random) => dispatch(startSetRandom(random))
});
export default connect(mapStateToProps, mapDispatchToProps)(VotesPage);