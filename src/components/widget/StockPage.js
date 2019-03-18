import React from 'react';
import { connect } from 'react-redux';
import { startGetStock, startChangeStock } from '../../actions/widget/stock';
import { startUpdateProduct, startDeleteProduct } from '../../actions/widget/product';
import Money from '../../selectors/money';
import MdEdit from 'react-icons/lib/md/edit';
export class StockPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stock: props.stock,
            auth: props.auth,
            id: '',
            name: '',
            unit: '',
            amount: 0,
            amount2: 0,
            cost: 0,
            alert: 0,
            action: false,
            isLoading: '',
            filter: '',
            filterType: '',
            types: props.types,
            typeId: '',
            typeName: ''
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
        if (nextProps.types != this.state.types) {
            this.setState({ types: nextProps.types });
        }
    }
    onNameChange = (e) => {
        const name = e.target.value;
        this.setState({ name })
    }
    onUnitChange = (e) => {
        const unit = e.target.value;
        this.setState({ unit })
    }
    onFilterChange = (e) => {
        const filter = e.target.value.replace(/\D/g, '');
        this.setState({ filter })
    }
    onFilterTypeChange = (e) => {
        const filterType = e.target.value;
        this.setState({ filterType })
    }
    onAlertChange = (e) => {
        const alert = e.target.value.replace(/\D/g, '');
        if (!isNaN(alert)) {
            this.setState({
                alert: Number(alert)
            })
        } else {
            console.log(alert)
        }
    }
    onCostChange = (e) => {
        const cost = e.target.value.replace(/\D/g, '');
        if (!isNaN(cost)) {
            this.setState({
                cost: Number(cost)
            })
        } else {
            console.log(cost)
        }
    }
    // onAmountChange = (e) => {
    //     const amount = e.target.value.replace(/\D/g, '');
    //     if (!isNaN(amount)) {
    //         this.setState({
    //             amount: Number(amount)
    //         })
    //     } else {
    //         console.log(amount)
    //     }
    // }
    onAmount2Change = (e) => {
        const amount2 = e.target.value.replace(/\D/g, '');
        if (!isNaN(amount2)) {
            this.setState({
                amount2: Number(amount2)
            })
        } else {
            console.log(amount2)
        }
    }
    onActionClick = (action, id) => {
        const data = this.state.stock.find(f => f.id == id)
        // if (!action) {
        //     this.setState({ amount: 0, cost: 0, alert: 0 })
        // }
        this.setState({
            id,
            action,
            ...data
        })
    }
    handleSelectAll = (e) => {
        e.target.select()
    }
    onUpdateClick = () => {
        if (this.state.id != '') {
            this.setState({ isLoading: 'is-loading' })
            this.props.startUpdateProduct({
                id: this.state.id,
                name: this.state.name,
                unit: this.state.unit,
                // amount: this.state.amount,
                cost: this.state.cost,
                alert: this.state.alert,
                typeId: this.state.typeId,
                typeName: this.state.typeName
            }).then(() => {
                this.setState({ isLoading: '', action: false, id: '' })
            })
        } else {
            alert('กรุณาเลือกใหม่อีกรอบ')
        }
    }
    onDeleteClick = () => {
        if (this.state.id != '' && this.state.amount == 0) {
            if (confirm('ยืนยันต้องการลบสินค้านี้ใช่หรือไม่?')) {
                this.setState({ isLoading: 'is-loading' })
                this.props.startDeleteProduct({
                    id: this.state.id
                }).then(() => {
                    this.setState({ isLoading: '', action: false, id: '' })
                })
            }
        } else {
            alert('สินค้านี้ยังมีสต็อกคงเหลือไม่สามารถลบได้')
        }
    }
    onStockClick = (e) => {
        if (this.state.id != '' && this.state.amount2 > 0) {
            this.setState({ isLoading: 'is-loading' })
            this.props.startChangeStock({
                id: this.state.id,
                action: e,
                amount: this.state.amount2
            }).then(() => {
                this.setState({ isLoading: '', action: false, id: '', amount2: 0 })
            })
        } else {
            alert('จำนวนสินค้าที่ต้องการปรับต้องมากกว่า 0')
        }
    }
    handleTypeChange = (e) => {
        const typeId = e.target.value;
        const type = this.state.types.find(f => f.typeId == typeId)
        this.setState({ typeId, typeName: type ? type.typeName : '' })
    }
    render() {
        let sumAmount = 0;
        return (
            <section className="hero">
                <div className="hero-head">
                    <div className="container">
                        <h2 className="title">สินค้าคงคลัง</h2>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="level">
                        <div className="leve-left">
                            <div className="field">
                                <div className="control">
                                    <div className="select">
                                        <select className="input"
                                            name={this.state.id}
                                            onChange={this.onFilterTypeChange}
                                            value={this.state.filterType}>
                                            <option value="">ทั้งหมด</option>
                                            {this.state.types.length > 0 &&
                                                this.state.types.map(type => {
                                                    return <option key={type.typeId} value={type.typeId}>{type.typeId + ' : ' + type.typeName}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="leve-right">
                            <div className="field">
                                <div className="control">
                                    <input className="input has-text-centered" type="text" placeholder="จำนวน"
                                        value={this.state.filter}
                                        onChange={this.onFilterChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <table className="table is-fullwidth is-striped is-narrow">
                        <thead>
                            <tr>
                                <th className="has-text-left">ลำดับ</th>
                                {this.state.auth.role == 'owner' && (<th className="has-text-left">ประเภท</th>)}
                                <th className="has-text-left">รหัส</th>
                                <th className="has-text-left">ชื่อสินค้า</th>
                                <th className="has-text-left">หน่วยนับ</th>
                                {this.state.auth.role == 'owner' && (<th className="has-text-right">ต้นทุน</th>)}
                                {this.state.auth.role == 'owner' && (<th className="has-text-right">แจ้งเตือน</th>)}
                                <th className="has-text-right">คงเหลือ</th>
                                {this.state.auth.role == 'owner' && (< th className="has-text-right">จัดการ</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.stock.filter(f => (f.amount <= Number(this.state.filter) || this.state.filter == '') && (f.typeId == this.state.filterType || this.state.filterType == ''))
                                .map((st, i) => {
                                    sumAmount += st.amount
                                    // if (this.state.id !== st.id) {
                                    return <tr key={st.id}>
                                        <td className="has-text-left">{i + 1}</td>
                                        {this.state.auth.role == 'owner' && (
                                            < td className="has-text-left">
                                                {this.state.id !== st.id || this.state.action == 'stock' ? st.typeId
                                                    : (this.state.action == 'edit' &&
                                                        <div className="control">
                                                            {/* <input type="text" name={this.state.id}
                                                            className="input is-rounded has-text-right"
                                                            onFocus={this.handleSelectAll}
                                                            value={Money(this.state.typeId, 0)}
                                                            onChange={this.onCostChange}
                                                        /> */}
                                                            <div className="select">
                                                                <select className="input"
                                                                    name={this.state.id}
                                                                    onChange={this.handleTypeChange}
                                                                    value={this.state.typeId}>
                                                                    <option value="">ไม่มี</option>
                                                                    {this.state.types.length > 0 &&
                                                                        this.state.types.map(type => {
                                                                            return <option key={type.typeId} value={type.typeId}>{type.typeId + ' : ' + type.typeName}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}
                                            </td>
                                        )}
                                        <td className="has-text-left">{st.id}</td>
                                        <td className="has-text-left">
                                            {this.state.id !== st.id || this.state.action == 'stock' ? st.name
                                                : (this.state.action == 'edit' &&
                                                    <div className="control">
                                                        <input type="text" name={this.state.id}
                                                            className="input is-rounded has-text-left is-4"
                                                            value={this.state.name}
                                                            onChange={this.onNameChange}
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td className="has-text-left">
                                            {this.state.id !== st.id || this.state.action == 'stock' ? st.unit
                                                : (this.state.action == 'edit' &&
                                                    <div className="control">
                                                        <input type="text" name={this.state.id}
                                                            className="input is-rounded has-text-left is-4"
                                                            value={this.state.unit}
                                                            onChange={this.onUnitChange}
                                                        />
                                                    </div>
                                                )
                                            }
                                        </td>

                                        {this.state.auth.role == 'owner' && (
                                            < td className="has-text-right">
                                                {this.state.id !== st.id || this.state.action == 'stock' ? Money(st.cost, 0)
                                                    : (this.state.action == 'edit' &&
                                                        <div className="control">
                                                            <input type="text" name={this.state.id}
                                                                className="input is-rounded has-text-right"
                                                                onFocus={this.handleSelectAll}
                                                                value={Money(this.state.cost, 0)}
                                                                onChange={this.onCostChange}
                                                            />
                                                        </div>
                                                    )}
                                            </td>
                                        )}
                                        {this.state.auth.role == 'owner' && (
                                            <td className="has-text-right">
                                                {this.state.id !== st.id || this.state.action == 'stock' ? Money(st.alert, 0)
                                                    : (this.state.action == 'edit' &&
                                                        <div className="control">
                                                            <input type="text" name={this.state.id}
                                                                className="input is-rounded has-text-right"
                                                                onFocus={this.handleSelectAll}
                                                                value={Money(this.state.alert, 0)}
                                                                onChange={this.onAlertChange}
                                                            />
                                                        </div>
                                                    )}
                                            </td>
                                        )}
                                        <td className="has-text-right">{Money(st.amount, 0)}</td>
                                        {this.state.auth.role == 'owner' && (
                                            this.state.action === false || this.state.id !== st.id ? (
                                                <td className="has-text-right">
                                                    <a className="button is-outlined"
                                                        onClick={() => { this.onActionClick('edit', st.id) }}>
                                                        <span>แก้ไข</span>
                                                        <span className="icon is-small">
                                                            <MdEdit />
                                                        </span>
                                                    </a>
                                                    <button
                                                        className="button is-outlined"
                                                        onClick={() => { this.onActionClick('stock', st.id) }}>
                                                        ปรับสต็อก
                                        </button>
                                                </td>
                                            ) : (this.state.action === 'edit' && this.state.id == st.id ? (
                                                <td className="has-text-right">
                                                    <div className="field is-grouped">
                                                        <p className="control">
                                                            <a className={`button is-link ${this.state.isLoading}`}
                                                                onClick={this.onUpdateClick}>
                                                                บันทึก
                                                    </a>
                                                        </p>
                                                        <p className="control">
                                                            <a className={`button ${this.state.isLoading}`}
                                                                onClick={() => { this.onActionClick(false, '') }}>
                                                                ยกเลิก
                                                    </a>
                                                        </p>
                                                        <p className="control">
                                                            <a className={`button is-danger ${this.state.isLoading}`}
                                                                onClick={this.onDeleteClick}>
                                                                ลบ
                                                    </a>
                                                        </p>
                                                    </div>
                                                </td>
                                            ) :
                                                (this.state.action === 'stock' && this.state.id == st.id &&
                                                    <td className="has-text-right">
                                                        <div className="field has-addons has-addons-right">
                                                            <div className="control">
                                                                <a className="delete is-default is-larg"
                                                                    onClick={() => { this.onActionClick(false, '') }}>
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
                                                                    value={Money(this.state.amount2, 0)}
                                                                    onChange={this.onAmount2Change}
                                                                />
                                                            </div>
                                                            <div className="control">
                                                                <button className={`button is-danger ${this.state.isLoading}`}
                                                                    onClick={() => { this.onStockClick('minus') }}>
                                                                    -</button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                ))
                                        )}
                                    </tr>;
                                    // } else {
                                    //     return <tr key={st.id}>
                                    //         <td className="has-text-left">{i + 1}</td>
                                    //         <td className="has-text-left">{st.id}</td>
                                    //         <td className="has-text-left">
                                    //             <div className="control">
                                    //                 <input type="text" name={this.state.id}
                                    //                     className="input is-rounded has-text-left is-4"
                                    //                     value={this.state.name}
                                    //                     onChange={this.onNameChange}
                                    //                 />
                                    //             </div>
                                    //         </td>
                                    //         <td className="has-text-left">
                                    //             <div className="control">
                                    //                 <input type="text" name={this.state.id}
                                    //                     className="input is-rounded has-text-left"
                                    //                     value={this.state.unit}
                                    //                     onChange={this.onUnitChange}
                                    //                 />
                                    //             </div>
                                    //         </td>
                                    //         <td className="has-text-right">
                                    //             <div className="control">
                                    //                 <input type="text" name={this.state.id}
                                    //                     className="input is-rounded has-text-right"
                                    //                     onFocus={this.handleSelectAll}
                                    //                     value={Money(this.state.cost, 0)}
                                    //                     onChange={this.onCostChange}
                                    //                 />
                                    //             </div>
                                    //         </td>
                                    //         <td className="has-text-right">
                                    //             <div className="control">
                                    //                 <input type="text" name={this.state.id}
                                    //                     className="input is-rounded has-text-right"
                                    //                     onFocus={this.handleSelectAll}
                                    //                     value={Money(this.state.alert, 0)}
                                    //                     onChange={this.onAlertChange}
                                    //                 />
                                    //             </div>
                                    //         </td>
                                    //         <td className="has-text-right">
                                    //             <div className="control">
                                    //                 <input type="text" name={this.state.id}
                                    //                     className="input is-rounded has-text-right"
                                    //                     onFocus={this.handleSelectAll}
                                    //                     value={Money(this.state.amount, 0)}
                                    //                     onChange={this.onAmountChange}
                                    //                 />
                                    //             </div>
                                    //         </td>
                                    //         <td className="has-text-right">
                                    //             <div className="field is-grouped">
                                    //                 <p className="control">
                                    //                     <a className={`button is-link ${this.state.isLoading}`}
                                    //                         onClick={this.onUpdateClick}>
                                    //                         บันทึก
                                    //                     </a>
                                    //                 </p>
                                    //                 <p className="control">
                                    //                     <a className={`button ${this.state.isLoading}`}
                                    //                         onClick={() => { this.onActionClick(false, '') }}>
                                    //                         ยกเลิก
                                    //                     </a>
                                    //                 </p>
                                    //                 <p className="control">
                                    //                     <a className={`button is-danger ${this.state.isLoading}`}
                                    //                         onClick={this.onDeleteClick}>
                                    //                         ลบ
                                    //                     </a>
                                    //                 </p>
                                    //             </div>
                                    //         </td>
                                    //     </tr>;
                                    // }

                                    {/*((this.state.id !== st.id) && this.state.auth.role == 'owner') && (
                                        <td className="has-text-right">
                                            <button
                                                className="button is-small"
                                                onClick={() => { this.onActionClick(true, st.id) }}>
                                                ปรับสต็อก
                                        </button>
                                        </td>
                                    )}
                                    { {((this.state.id === st.id) && this.state.auth.role == 'owner') && (
                                        <td className="has-text-right">
                                            <div className="field has-addons has-addons-right">
                                                <div className="control">
                                                    <a className="delete is-default is-larg"
                                                        onClick={() => { this.onActionClick(false, '') }}>
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
                                        </td>
                                    )} */}

                                })
                            }
                            <tr>
                                <td colSpan={7}>รวม</td>
                                <td className="has-text-right">{Money(sumAmount,0)}</td>
                                <td></td>
                            </tr>
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
    startUpdateProduct: (product) => dispatch(startUpdateProduct(product)),
    startDeleteProduct: (product) => dispatch(startDeleteProduct(product)),
    startChangeStock: (stock) => dispatch(startChangeStock(stock))
});
export default connect(mapStateToProps, mapDispatchToProps)(StockPage);