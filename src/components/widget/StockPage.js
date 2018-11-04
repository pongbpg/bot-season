import React from 'react';
import { connect } from 'react-redux';
import { startGetStock, startChangeStock } from '../../actions/widget/stock';
import Money from '../../selectors/money';
export class StockPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stock: props.stock,
            auth: props.auth,
            id: '',
            amount: 0,
            action: false,
            isLoading: ''
        }
        this.props.startGetStock();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.stock != this.state.stock) {
            this.setState({ stock: nextProps.stock });
        }
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
    }
    onStockChange = (e) => {
        const amount = e.target.value.replace(/\D/g, '');
        if (!isNaN(amount)) {
            this.setState({
                amount: Number(amount)
            })
        } else {
            console.log(amount)
        }
    }
    onActionClick = (action, id) => {
        if (!action) {
            this.setState({ amount: 0 })
        }
        this.setState({
            id,
            action
        })
    }
    handleSelectAll = (e) => {
        e.target.select()
    }
    onStockClick = (action) => {
        // console.log(this.state.id, this.state.amount, action)
        this.setState({ isLoading: 'is-loading' })
        this.props.startChangeStock({
            id: this.state.id,
            amount: this.state.amount,
            action
        }).then(() => {
            this.props.startGetStock().then(() => {
                this.setState({ isLoading: '' })
            })
        })

    }
    render() {
        return (
            <section className="hero">
                <div className="hero-head">
                    <div className="container">
                        <h2 className="title">สินค้าคงคลัง</h2>
                    </div>
                </div>
                <div className="hero-body">
                    <table className="table is-fullwidth is-striped is-narrow">
                        <thead>
                            <tr>
                                <th className="has-text-centered">ลำดับ</th>
                                <th className="has-text-left">รหัส</th>
                                <th className="has-text-left">ชื่อสินค้า</th>
                                <th className="has-text-right">คงเหลือ</th>
                                {this.state.auth.role == 'owner' && (< th className="has-text-right">จัดการ</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.stock.map((st, i) => {
                                return <tr key={st.id}>
                                    <td className="has-text-centered">{++i}</td>
                                    <td className="has-text-left">{st.id}</td>
                                    <td className="has-text-left">{st.name}</td>
                                    <td className="has-text-right">{Money(st.amount, 0)}</td>
                                    {((this.state.id !== st.id) && this.state.auth.role == 'owner') && (
                                        <td className="has-text-right">
                                            <button
                                                className="button is-small"
                                                onClick={() => { this.onActionClick(true, st.id) }}>
                                                ปรับสต็อก
                                        </button>
                                        </td>
                                    )}
                                    {((this.state.id === st.id) && this.state.auth.role == 'owner') && (
                                        <td className="has-text-right">
                                            <div className="field has-addons has-addons-right">
                                                <div className="control">
                                                    <a className="delete is-default is-larg"
                                                        onClick={() => { this.onActionClick(false, '') }}>
                                                        {/* <span className="tag">&nbsp;</span> */}
                                                        ปิด
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="field has-addons has-addons-right">
                                                <div className="control">
                                                    <button className={`button is-success ${this.state.isLoading}`}
                                                        onClick={() => { this.onStockClick('plus') }}>
                                                        +</button>
                                                </div>
                                                <div className="control">
                                                    <input type="text" name={this.state.id}
                                                        className="input is-rounded has-text-right"
                                                        onFocus={this.handleSelectAll}
                                                        value={Money(this.state.amount, 0)}
                                                        onChange={this.onStockChange}
                                                    />
                                                </div>
                                                <div className="control">
                                                    <button className={`button is-danger ${this.state.isLoading}`}
                                                        onClick={() => { this.onStockClick('minus') }}>
                                                        -</button>
                                                </div>

                                            </div>
                                            {/* <div className="field is-grouped is-grouped-right">
                                                <div className="control">
                                                    <button className={`button is-success ${this.state.isLoading}`}
                                                        onClick={() => { this.onStockClick('plus') }}>
                                                        เพิ่ม</button>
                                                </div>
                                                <div className="control">
                                                    <button className={`button is-danger ${this.state.isLoading}`}
                                                        onClick={() => { this.onStockClick('minus') }}>
                                                        ลด</button>
                                                </div> 
                                                <div className="control">
                                                    <button className={`button ${this.state.isLoading}`}
                                                        onClick={() => { this.onActionClick(false, '') }}>
                                                        ยกเลิก</button>
                                                </div>
                                            </div> */}
                                        </td>
                                    )}

                                </tr>;
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    stock: state.stock,
    auth: state.auth
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetStock: () => dispatch(startGetStock()),
    startChangeStock: (stock) => dispatch(startChangeStock(stock))
});
export default connect(mapStateToProps, mapDispatchToProps)(StockPage);