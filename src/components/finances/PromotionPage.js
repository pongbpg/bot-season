import React from 'react';
import { connect } from 'react-redux';
import Money from '../../selectors/money';
import { startGetStock } from '../../actions/widget/stock';
import { } from '../../actions/finances/promotion';
import NumberFormat from 'react-number-format';
import Select from 'react-select'
import _ from 'underscore';
import { useTable } from 'react-table'
export class PromotionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stock: props.stock,
            auth: props.auth,
            products: [],
            quantity: 0,
            totalCost: 0,
            totalSale: 0,
            price: 0
        }
        this.props.startGetStock();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.stock != this.state.stock) {
            this.setState({ stock: nextProps.stock });
        }
    }
    onSelectProductChange = products => {
        this.setState({ products }, this.autoCalculator);
    };
    autoCalculator = () => {
        const quantity = _.reduce(_.pluck(this.state.products, 'quantity'), (x, y) => x + y, 0);
        const totalCost = _.reduce(_.pluck(this.state.products, 'totalCost'), (x, y) => x + y, 0);
        const totalSale = _.reduce(_.pluck(this.state.products, 'totalSale'), (x, y) => x + y, 0);
        this.setState({ quantity, totalCost, totalSale })
    }

    render() {

        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">คำนวณต้นทุนโปรโมชั่น</h2>
                        <Select isMulti
                            value={this.state.products}
                            onChange={this.onSelectProductChange}
                            options={this.state.stock.map(p => {
                                return {
                                    ...p,
                                    quantity: 0
                                }
                            })}
                            getOptionValue={(option => option.id)}
                            getOptionLabel={(option => option.name + ' (' + option.id + ')')}
                        />
                    </div>
                    <div className="table-container" style={{ marginTop: '20px' }}>
                        <table className="table is-bordered">
                            <thead>
                                <tr>
                                    <th>ชื่อสินค้า</th>
                                    <th>ต้นทุน</th>
                                    <th>ขาย</th>
                                    <th>จำนวน</th>
                                    <th>รวมต้นทุน</th>
                                    <th>รวมราคาขาย</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.products.length == 0 ?
                                    <tr>
                                        <td className="has-text-centered" colSpan={6}>ยังไม่มีรายการสินค้า</td>
                                    </tr>
                                    : this.state.products.map((p, i) => {
                                        return (<tr key={p.id}>
                                            <td>{p.name}</td>
                                            <td className=" has-text-right">{Money(p.cost)}</td>
                                            <td className=" has-text-right">{Money(p.sale)}</td>
                                            <td>
                                                <NumberFormat className="input has-text-right"
                                                    thousandSeparator={true}
                                                    value={p.quantity}
                                                    onValueChange={(values) => {
                                                        const { formattedValue, value, floatValue } = values;
                                                        this.setState({
                                                            products: this.state.products.map(m => {
                                                                const quantity = floatValue;
                                                                if (m.id == p.id) {
                                                                    return {
                                                                        ...p,
                                                                        quantity,
                                                                        totalSale: (quantity * p.sale) || 0,
                                                                        totalCost: (quantity * p.cost) || 0
                                                                    }
                                                                } else {
                                                                    return m
                                                                }
                                                            })
                                                        }, this.autoCalculator)
                                                    }} /></td>
                                            <td className=" has-text-right">{Money(p.totalCost)}</td>
                                            <td className=" has-text-right">{Money(p.totalSale)}</td>
                                        </tr>)
                                    })}
                                <tr>
                                    <td>ราคาโปรโมชั่น</td>
                                    <td colSpan={2}>
                                        <NumberFormat className="input has-text-right"
                                            thousandSeparator={true}
                                            value={this.state.ptice}
                                            onValueChange={(values) => {
                                                const { formattedValue, value, floatValue } = values;
                                                this.setState({ price: floatValue }, this.autoCalculator)
                                            }} />
                                    </td>
                                    <td className=" has-text-right">{Money(this.state.quantity)}</td>
                                    <td className=" has-text-right">{Money(this.state.totalCost)} ({Money((this.state.totalCost / this.state.price) * 100, 2)}%)</td>
                                    <td className=" has-text-right">{Money(this.state.totalSale)} ({Money((this.state.totalSale / this.state.price) * 100, 2)}%)</td>
                                </tr>
                                <tr>
                                    <td>กำไร</td>
                                    <td className=" has-text-right" colSpan={2}>{Money(this.state.price - this.state.totalCost)} ({Money(((this.state.price - this.state.totalCost) / this.state.price) * 100)}%)</td>
                                    <td>ส่วนลด</td>
                                    <td className=" has-text-right" colSpan={2}>{Money(this.state.totalSale - this.state.price)} ({Money(((this.state.totalSale - this.state.price) / this.state.totalSale) * 100)}%)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    stock: state.stock
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetStock: () => dispatch(startGetStock())
});
export default connect(mapStateToProps, mapDispatchToProps)(PromotionPage);