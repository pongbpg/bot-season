import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import { FaFileImage, FaUpload } from 'react-icons/fa'
import { startUploadAvatar } from '../actions/profile'
export class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      loading: false,
      imageFile: null,
      imagePreviewUrl: props.auth.imgUrl || null
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth != this.state.auth) {
      this.setState({ auth: nextProps.auth });
    }
  }
  fileChangedHandler = event => {
    const file = event.target.files;
    this.setState({
      imageFile: file.length > 0 ? event.target.files[0] : null
    })

    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: file.length > 0 ? reader.result : null
      });
    }
    if (file.length > 0) {
      reader.readAsDataURL(event.target.files[0])
    }
  }

  onUploadImage = (e) => {
    // console.log(this.state.auth.email, this.state.imageFile)
    this.setState({ loading: true })
    this.props.startUploadAvatar({
      ...this.state.auth,
      imageFile: this.state.imageFile
    }).then(() => {
      this.setState({ loading: false })
      window.location.reload();
    })
  }

  render() {
    return (
      <div className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">ข้อมูลส่วนตัว</h1>
          </div>
          <div className="column is-12">
            <form onSubmit={this.onSubmit}>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Email</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control is-expanded">
                      <input className="input" type="text"
                        disabled
                        value={this.state.auth.email} />
                    </p>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Line</label>
                </div>
                <div className="field-body">
                  <div className="field is-expanded">
                    <p className="control is-expanded">
                      <input className="input" type="text"
                        disabled
                        value={this.state.auth.line} />
                    </p>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">รูปถ่าย</label>
                </div>
                <div className="field-body">
                  <div className="field  is-grouped">
                    <div className="control">
                      <figure className="image is-128x128">
                        <img src={this.state.imageFile ? this.state.imagePreviewUrl : this.state.auth.imgUrl} />
                      </figure>
                    </div>
                    <div className="control">
                      <div className="file has-name is-right">
                        <label className="file-label">
                          <input type="file" className="file-input" onChange={this.fileChangedHandler} />
                          <span className="file-cta">
                            <span className="file-icon">
                              {/* <FaFileImage /> */}
                            </span>
                            <span className="file-label">เลือกรูปภาพ</span>
                          </span>
                          {
                            this.state.imageFile &&
                            <span className="file-name">{this.state.imageFile.name}</span>
                          }
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label"></label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <button className={`button is-link ${this.state.loading && 'is-loading'}`} type="button"
                        disabled={!this.state.imageFile} onClick={this.onUploadImage} >
                        <span className="icon is-medium">
                          {/* <FaUpload /> */}
                        </span>
                        <span>อัพโหลด</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </form>

          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
  startUploadAvatar: (data) => dispatch(startUploadAvatar(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
