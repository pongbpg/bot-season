import React from 'react';
import { connect } from 'react-redux';
import { startGetPivotTb } from './../../actions/admins/pivotTb';
import moment from 'moment';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import { MdRefresh } from 'react-icons/md'
import 'react-pivottable/pivottable.css';
moment.locale('th')
// import TableRenderers from 'react-pivottable/TableRenderers';
// import Plot from 'react-plotly.js';
// import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

// create Plotly renderers via dependency injection
// const PlotlyRenderers = createPlotlyRenderers(Plot);

// see documentation for supported input formats

export class PivotTbPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            startDate: new Date(),
            endDate: new Date(),
            typePv: '',
            list: []
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.list.length != this.state.list.length) {
            this.setState({ list: nextProps.list });
        }
    }
    onDateChange = (values) => {
        // console.log('change', values)
        const startDate = values[0];
        const endDate = values[1];
        if ((this.state.auth.role == 'owner' || typeof this.state.auth.adminId !== 'undefined') && this.state.typePv != '')
            this.props.startGetPivotTb(moment(startDate).format('YYYYMMDD'),
                moment(endDate).format('YYYYMMDD'),
                this.state.auth.adminId,
                this.state.typePv)
        this.setState({ startDate, endDate })
    }

    onTypePvChange = (e) => {
        const typePv = e.target.value;
        if ((this.state.auth.role == 'owner' || typeof this.state.auth.adminId !== 'undefined') && typePv != '') {
            this.props.startGetPivotTb(moment(this.state.startDate).format('YYYYMMDD'),
                moment(this.state.endDate).format('YYYYMMDD'),
                this.state.auth.adminId,
                typePv)
        }

        this.setState({ typePv })
    }
    onRefresh=()=>{
        if ((this.state.auth.role == 'owner' || typeof this.state.auth.adminId !== 'undefined') && this.state.typePv != '') {
            this.props.startGetPivotTb(moment(this.state.startDate).format('YYYYMMDD'),
                moment(this.state.endDate).format('YYYYMMDD'),
                this.state.auth.adminId,
                this.state.typePv)
        }
    }

    render() {
        // const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const MyDateRange = () => {
            return <DateRangePicker
                format="dd-MM"
                onChange={this.onDateChange}
                value={[this.state.startDate, this.state.endDate]}
            />
        }
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">Pivot Table</h2>
                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column is-three-fifths">
                        <div className="level">
                            <div className="level-item has-text-centered">
                                <MyDateRange />
                                <button className='button is-text' onClick={this.onRefresh}>
                                    <span className="icon"><MdRefresh /></span>
                                </button>
                            </div>
                            <div className="level-item has-text-centered">
                                <div class="select">
                                    <select onChange={this.onTypePvChange} value={this.state.typePv}>
                                        <option value="">เลือกประเภท</option>
                                        <option value="price">ยอดขาย</option>
                                        <option value="product">สินค้า</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="columns is-centered">
                        <div className="column">
                            <PivotTableUI
                                data={this.state.list}
                                onChange={s => {
                                    delete s.data
                                    this.setState(s)
                                }}
                                {...this.state}
                            />
                            {/* <PivotTableUI
                                data={this.state.list}
                                onChange={s => this.setState(s)}
                                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                                {...this.state}
                            /> */}
                        </div>
                    </div>
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    list: state.admins.pivotTb
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetPivotTb: (startDate, endDate, userId, typePv) => dispatch(startGetPivotTb(startDate, endDate, userId, typePv))
});
export default connect(mapStateToProps, mapDispatchToProps)(PivotTbPage);