import React from 'react';
import { connect } from 'react-redux';
import { startAddProductType, startGetProductTypes, startUpdateProductType, startDeleteProductType } from '../../actions/manage/ProductTypes';
import { MdEdit } from 'react-icons/md'
export class ProductTypesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            coms: props.coms,
            productTypes: props.productTypes || [],
            productType: {},
            newProductType: { id: '', name: '' },
            isLoading: ''
        }
        this.props.startGetProductTypes();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.productTypes != this.state.productTypes) {
            this.setState({ productTypes: nextProps.productTypes });
        }
    }
    onActionClick = (id) => {
        const data = this.state.productTypes.find(f => f.id == id) || {}
        console.log(data)
        this.setState({
            productType: data
        })
    }
    onUpdateClick = () => {
        if (this.state.productType.id != null) {
            this.setState({ isLoading: 'is-loading' })
            this.props.startUpdateProductType(this.state.productType)
                .then(() => {
                    this.setState({
                        isLoading: '',
                        productType: {},
                        productTypes: this.state.productTypes.map(m => m.id == this.state.productType.id ? this.state.productType : m)
                    })
                })
        } else {
            alert('กรุณาเลือกใหม่อีกรอบ')
        }
    }

    onNameChange = (e) => {
        // console.log(e.target.value)
        this.setState({
            productType: { ...this.state.productType, name: e.target.value }
        })
    }
    onNewIDChange = (e) => {
        this.setState({
            newProductType: { ...this.state.newProductType, id: e.target.value.toUpperCase() }
        })
    }
    onNewNameChange = (e) => {
        this.setState({
            newProductType: { ...this.state.newProductType, name: e.target.value }
        })
    }
    onAddClick = () => {
        if (this.state.newProductType.id == '' || this.state.newProductType.name == '') {
            alert('กรุณาใส่ข้อมูลให้ครบ!')
        } else {
            if (confirm('คุณต้องการเพิ่มประเภทสินค้า?')) {
                this.setState({ isLoading: 'is-loading' })
                this.props.startAddProductType(this.state.newProductType)
                    .then((msg) => {
                        this.setState({ isLoading: '' })
                        if (msg == 'no') {
                            alert('กรุณาตรวจสอบรหัสประเภทสินค้านี้มีแล้ว')
                        } else {
                            this.setState({
                                productTypes: [...this.state.productTypes, this.state.newProductType],
                                newProductType: { id: '', name: '' }
                            })
                        }
                    })
            }
        }
    }
    onDeleteClick = () => {
        if (this.state.productType.id != null) {
            if (confirm('ยืนยันต้องการลบประเภทสินค้านี้ใช่หรือไม่?')) {
                this.setState({ isLoading: 'is-loading' })
                this.props.startDeleteProductType({
                    id: this.state.productType.id
                }).then(() => {
                    this.setState({
                        isLoading: '', productType: {},
                        productTypes: this.state.productTypes.filter(f => f.id != this.state.productType.id)
                    })
                })
            }
        }
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">รายการประเภทสินค้า</h2>
                    </div>
                    <div className="columns is-centered">
                        <div className="column is-2">
                            <div className="field">
                                <div className="control">
                                    <input className="input" type="text" placeholder="รหัสประเภท"
                                        value={this.state.newProductType.id}
                                        onChange={this.onNewIDChange} />
                                </div>
                            </div>
                        </div>
                        <div className="column is-5">
                            <div className="field">
                                <div className="control">
                                    <input className="input" type="text" placeholder="ชื่อประเภท"
                                        value={this.state.newProductType.name}
                                        onChange={this.onNewNameChange} />
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
                    <div className="columns is-centered">
                        <div className="column is-four-fifths">
                            <table className="table is-fullwidth is-striped is-narrow">
                                <thead>
                                    <tr>
                                        <th className="has-text-centered" width="10%">ลำดับ</th>
                                        <th className="has-text-left">รหัส</th>
                                        <th className="has-text-left">ชื่อประเภท</th>
                                        <th className="has-text-centered" width="20%">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.productTypes.length > 0 ?
                                        this.state.productTypes.sort((a, b) => a.id > b.id ? 1 : -1)
                                            .map((pdt, index) => {
                                                return (<tr key={pdt.id}>
                                                    <td className="has-text-centered">{index + 1}.</td>
                                                    <td className="has-text-left"> {pdt.id} </td>
                                                    <td className="has-text-left">
                                                        {this.state.productType.id != pdt.id ? pdt.name
                                                            : <input type="text" className="input" onChange={this.onNameChange} value={this.state.productType.name} />
                                                        }
                                                    </td>
                                                    {this.state.productType.id != pdt.id ?
                                                        (<td>
                                                            <a className="button is-outlined"
                                                                onClick={() => { this.onActionClick(pdt.id) }}>
                                                                <span>แก้ไข</span>
                                                                <span className="icon is-small">
                                                                    <MdEdit />
                                                                </span>
                                                            </a>
                                                        </td>) :
                                                        (<td>
                                                            <div className="field is-grouped">
                                                                <p className="control">
                                                                    <a className={`button is-link ${this.state.isLoading}`}
                                                                        onClick={this.onUpdateClick}>
                                                                        บันทึก
                                                    </a>
                                                                </p>
                                                                <p className="control">
                                                                    <a className={`button ${this.state.isLoading}`}
                                                                        onClick={() => { this.onActionClick(null) }}>
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
                                                        </td>)
                                                    }

                                                </tr>)
                                            })
                                        : (<tr><td className="has-text-centered" colSpan={4}>ไม่มีข้อมูล</td></tr>)
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div >
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    productTypes: state.manage.productTypes
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetProductTypes: () => dispatch(startGetProductTypes()),
    startUpdateProductType: (productType) => dispatch(startUpdateProductType(productType)),
    startAddProductType: (newProductType) => dispatch(startAddProductType(newProductType)),
    startDeleteProductType: (productTypeId) => dispatch(startDeleteProductType(productTypeId))
});
export default connect(mapStateToProps, mapDispatchToProps)(ProductTypesPage);