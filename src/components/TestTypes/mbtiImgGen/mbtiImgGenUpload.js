import React, { useCallback, useState } from 'react';
import { Link, withRouter, useHistory } from 'react-router-dom';
import ImageUploader from "react-images-upload";
import './MbtiImgGen.css';

const MbtiImgGenUpload = () => {
    let history = useHistory();
    const [mode, setMode] =useState('upload');
    const [pictures, setPictures] =useState([]);
    const [email, setEmail] = useState("");
    const minimunImgNumber = 10;

    const onClickUpload = useCallback(() => {
        if(pictures?.length < 1) {
            return alert(`${minimunImgNumber}장 이상 업로드 해!`)
        }
        setMode('email');
    }, [pictures.length, minimunImgNumber]);

    const onClickEmail = () => {

    };

    const onDrop = (pictureFiles) => {
        setPictures(pictureFiles);
    };

    const onEmailHandler = useCallback((e) => {
        setEmail(e.target.value);
    }, []);

    const onSubmitHandler = useCallback(() => {
        if(!email) {
            return alert('이메일을 입력해주세요!');
        }
        alert('사진이 정상적으로 업로드 되었습니다!');
        history.replace("/mbtiImgGen/complete");
    }, [email, history]);

    if(mode === 'upload') {
        return (
            <>
                <div className='mbtiImgGen-upload-div'>
                    <div className='mbtiImgGen-upload-upper-banner-div'>
                        <img className='mbtiImgGen-upload-upper-banner' src='https://images.ktestone.com/meta/mbtiImgGen/mbtiImgGen-upload-upper-banner.png' alt='mbtiImgGen-upload-upper-banner' />
                    </div>
                    <img className='mbtiImgGen-upload' src='https://images.ktestone.com/meta/mbtiImgGen/mbtiImgGen-upload.jpg' alt='mbtiImgGen-upload' />
                    <div className='mbtiImgGen-upload-btn-div' onClick={() => onClickUpload()}>
                        <img className='mbtiImgGen-upload-btn' src='https://images.ktestone.com/meta/mbtiImgGen/mbtiImgGen-upload-btn.png' alt='mbtiImgGen-upload-btn' />
                    </div>
                </div>
                <ImageUploader
                    className="mbtiImgGen-image-uploader"
                    withIcon={false}
                    withPreview={true}
                    onChange={onDrop}
                    imgExtension={[".jpg", ".gif", ".png", ".gif", ".jpeg"]}
                    maxFileSize={5242880}
                    buttonText="+"
                    withLabel={true}
                    label={null}
                    labelStyles={{"fontSize":"1.3rem", "margin":"1.5rem auto", "color":"grey"}}
                    fileSizeError="사진 용량이 너무 커요."
                    fileTypeError="지원하지 않는 파일입니다."
                    singleImage={false}
                    fileContainerStyle={{"position":"inline-block"}}
                    buttonStyles={{"marginTop":"5rem", "height":"4rem","width":"4rem","borderRadius":"5%","fontSize":"2rem","color":"#606060", "background": "#E8E8E8","border":"none", "boxShadow":"none", "overflow":"visible", "cursor":"pointer"}}
                />
            </>
        );
    } else if (mode === 'email') {
        return (
            <>
            <div className='mbtiImgGen-email-div'>
                <div className='mbtiImgGen-email-logo-div'>
                    <img className='mbtiImgGen-email-logo' src='https://images.ktestone.com/meta/mbtiImgGen/mbtiImgGen-email-logo.png' alt='mbtiImgGen-email-logo' />
                </div>
                <img className='mbtiImgGen-email' src='https://images.ktestone.com/meta/mbtiImgGen/mbtiImgGen-email-form.jpg' alt='mbtiImgGen-email' />
                <Link to='/mbtiImgGen/complete'>
                    <div className='mbtiImgGen-email-btn-div' onClick={() => onClickEmail()}>
                        <img className='mbtiImgGen-email-btn' src='https://images.ktestone.com/meta/mbtiImgGen/mbtiImgGen-email-btn.png' alt='mbtiImgGen-email-btn' />
                    </div>
                </Link>
            </div>
            <form onSubmit={onSubmitHandler}>
                <input
                    onChange={onEmailHandler}
                    type="email"
                    id="email"
                    placeholder="이메일을 입력해 주세요."
                    required />
                <button type="submit">
                    확인
                </button>
            </form>
        </>
        )
    }
};

export default withRouter(MbtiImgGenUpload);