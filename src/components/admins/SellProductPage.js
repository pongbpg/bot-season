import React from 'react';
import { connect } from 'react-redux';
import { startGetSellProducts } from './../../actions/admins/sellProduct';
import moment from 'moment';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
moment.locale('th')
// import TableRenderers from 'react-pivottable/TableRenderers';
// import Plot from 'react-plotly.js';
// import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

// create Plotly renderers via dependency injection
// const PlotlyRenderers = createPlotlyRenderers(Plot);

// see documentation for supported input formats

export class SellProductPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            startDate: new Date(),
            endDate: new Date(),
            list: []
        }
        if (props.auth.role == 'owner' || props.auth.adminId)
            this.props.startGetSellProducts(moment().format('YYYYMMDD'), moment().format('YYYYMMDD'), props.auth.adminId)
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
        if (this.state.auth.role == 'owner' || this.state.auth.adminId)
            this.props.startGetSellProducts(moment(startDate).format('YYYYMMDD'), moment(endDate).format('YYYYMMDD'), this.state.auth.adminId)
        this.setState({ startDate, endDate })
    }

    render() {
        // const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const MyDateRange = () => {
            return (
                <div>
                    <DateRangePicker
                        format="dd-MM"
                        onChange={this.onDateChange}
                        value={[this.state.startDate, this.state.endDate]}
                    />
                </div>
            );
        }
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">ยอดขายสินค้า</h2>
                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column is-three-fifths">
                        <div className="level">
                            <div className="level-item has-text-centered">
                                วันที่:  <MyDateRange />
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
    list: state.admins.sellProducts
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetSellProducts: (startDate, endDate, userId) => dispatch(startGetSellProducts(startDate, endDate, userId))
});
export default connect(mapStateToProps, mapDispatchToProps)(SellProductPage);