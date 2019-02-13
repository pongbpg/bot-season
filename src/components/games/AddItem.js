import React from 'react';
import { connect } from 'react-redux';
import { startAddItemVote } from '../../actions/games/votes';
export class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: ''
        }
    }
    onIDChange = (e) => {
        this.setState({ id: e.target.value.replace(/\n/g, '').toUpperCase() })
    }

    onAddClick = (e) => {
        if (this.state.id == '') {
            alert('กรุณาใส่ชื่อผู้สมัคร')
        } else {
            this.setState({ isLoading: 'is-loading' })
            this.props.startAddItemVote({
                id: this.state.id
            }).then((msg) => {
                this.setState({ id: '', isLoading: '' })
            })
        }
    }
    onHandleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onAddClick();
        }
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-head">
                    <div className="container">
                        <h2 className="title">เพิ่มผู้สมัคร</h2>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="columns">
                        <div className="column is-9">
                            <div className="field">
                                <div className="control">
                                    <input className="input" type="text" placeholder="ชื่อผู้สมัคร"
                                        value={this.state.id}
                                        onKeyPress={this.onHandleKeyPress}
                                        onChange={this.onIDChange} />
                                </div>
                            </div>
                        </div>
                        <div className="column is-3">
                            <div className="field-body">
                                <div className="field">
                                    <p className="control">
                                        <button className={`button is-success is-fullwidth ${this.state.isLoading ? 'is-loading' : ''}`}
                                            onClick={this.onAddClick}>
                                            เพิ่ม</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    
});
const mapDispatchToProps = (dispatch, props) => ({
    startAddItemVote: (vote) => dispatch(startAddItemVote(vote)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddItem);