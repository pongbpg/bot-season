import React from 'react';
import { connect } from 'react-redux';
import { startGetCutOff, startCutOff } from '../actions/cutoff';
import MdAlarmOn from 'react-icons/lib/md/alarm-on';
import moment from 'moment';
moment.locale('th');
export class CutOffPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cutoff: props.cutoff
        }
        this.props.startGetCutOff()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.cutoff != this.state.cutoff) {
            this.setState({ cutoff: nextProps.cutoff });
        }
    }
    onCutOffClick = () => {
        var r = confirm("คุณต้องการปิดรอบใช่หรือไม่?");
        if (r == true) {
            alert("ปิดรอบเรียบร้อย!");
            this.props.startCutOff()
            this.props.history.push('/orders')
        } else {
            alert("ยังไม่ได้ปิดรอบนะ รอแอดมินแปป!!");
        }
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">ปิดรอบ</h1>
                        <h2 className="subtitle">วันที่ {moment(this.state.cutoff.cutoffDate).format('ll')}</h2>
                    </div>
                </div>
                <nav className="level">
                    <p className="level-item has-text-centered">
                        <button className="button is-info is-centered is-large"
                            onClick={this.onCutOffClick} disabled={this.state.cutoff.cutoff}>
                            ปิด{this.state.cutoff.cutoff ? 'แล้ว' : 'รอบ'}จ้า
                        </button>
                    </p>
                </nav>
            </section>
        )
    }
}
const mapStateToProps = (state, props) => ({
    cutoff: state.cutoff
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetCutOff: () => dispatch(startGetCutOff()),
    startCutOff: () => dispatch(startCutOff())
});
export default connect(mapStateToProps, mapDispatchToProps)(CutOffPage);