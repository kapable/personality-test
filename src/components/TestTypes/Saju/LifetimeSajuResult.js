import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';
import { Divider } from 'antd';
import { useCookies } from 'react-cookie';
import ReactGA from 'react-ga';
import AGAINBTN from '../../../api/DefaultImg/result-to-again-btn.png';
import COPYBTN from '../../../api/DefaultImg/result-copy-link-btn.png';
import TOHOMEBTN from '../../../api/DefaultImg/result-to-home-btn.png';
import ShareGroup from '../../BasicComponents/ShareGroup';
import CopyToClipboard from 'react-copy-to-clipboard';

const LifetimeSajuResult = (props) => {
    const saju_url = 'https://saju.ktestone.com';
    const [result, setResult] = useState({});
    const [isOpened, setIsOpened] = useState(false);
    const [coupangCookies, setCoupangCookie] = useCookies(['coupang']);
    const coupangLink = "https://link.coupang.com/a/KgpKa";

    const _eventSenderGA = (category, action, label) => {
        ReactGA.event({
            category: category,
            action: action,
            label: label
        });
    };

    const onCoupangButtonClick = useCallback(() => {
        const cookieAges = 60*60*12;
        setCoupangCookie('coupang', true, { path: '/', maxAge: cookieAges, secure: true }); // shorter one of 60 sec * 60 min * 12 hour | tommorow 00 - now time
        setIsOpened(true);
        _eventSenderGA("Opening", "Click go-to-Coupang Button", "result page");
    }, [setCoupangCookie]);

    useEffect(() => {
        const getToday = async(source) => {
            try {
                await axios.get(
                    saju_url + '/lifetime/total/' + source
                )
                .then((res) => {
                    setResult(res?.data)
                });
            } catch (error) {
                console.error(error);
                return alert('결과를 가져오는 중 에러가 발생했습니다 ㅠㅠ');
            }
        };
        getToday(props?.match?.params?.query);
    }, [props]);

    const onRestartButtonClick = useCallback(() => {
        _eventSenderGA("Paging", "Click Re-test Button", "result page");
        props.history.push(`/lifetimeSaju/`);
    }, [props]);

    const onBacktoHomeButtonClick = useCallback(() => {
        _eventSenderGA("Paging", "Click Back-to-main Button", "result page");
        props.history.push(`/`);
    }, [props]);

    const onShareButtonClick = useCallback(() => {
        alert("링크가 복사됐습니다!");
        _eventSenderGA("Sharing", "Click Copy-link Button", "result page");
    }, [])

    return (
        <div className='todayLuck-result-main-div'>
            <img className='todayLuck-top-banner-sample' src="https://images.ktestone.com/meta/saju/todayLuck-top-banner-sample.png" alt='todayLuck-top-banner-sample'/>
            {isOpened || coupangCookies?.coupang ? 
                <Fragment>
                    <h3>사주총평</h3>
                    <p>{result ? result?.total_saju : null}</p>
                    <Divider />
                    <h3>건강운</h3>
                    <p>{result ? result?.health_saju : null}</p>
                    <Divider />
                    <h3>타고난 성격운</h3>
                    <p>{result ? result?.chracter_saju : null}</p>
                    <Divider />
                    <h3>타고난 성품</h3>
                    <p>{result ? result?.born_character : null}</p>
                    <Divider />
                    <h3>직업운</h3>
                    <p>{result ? result?.job_saju : null}</p>
                    <Divider />
                    <h3>타고난 재물운</h3>
                    <p>{result ? result?.wealth_luck : null}</p>
                    <Divider />
                    <h3>재물 모으는 법</h3>
                    <p>{result ? result?.save_wealth : null}</p>
                    <Divider />
                    <h3>재물 손실 막는 법</h3>
                    <p>{result ? result?.protect_wealth : null}</p>
                    <Divider />
                </Fragment> : 
                <Fragment>
                    <h3>오늘의 총운</h3>
                    <p>{result ? result?.total_result?.slice(0, 100) : null}</p>
                    <div className='article-adCover-div-1'>
                        <div className='article-adCover-div-2'>
                            <a href={coupangLink} target="_blank" rel='noreferrer noopener'>
                                <button className='result-coupang-button' type="primary" shape='round' style={{ width: '15rem', height: '3.5rem'}} onClick={onCoupangButtonClick}>
                                    쿠팡 보고 결과 보기<br /><p style={{ fontSize: '0.5rem', color: 'lightgray' }}>원치 않을 경우 뒤로 가기를 눌러주세요</p>
                                </button>
                            </a>
                        </div>
                    </div>
                </Fragment>
            }
            <div className="share">
                <h5 className="share-title">{"친구에게 공유하기"}</h5>
                <ShareGroup
                    link={"https://ktestone.com/kapable.github.io/todayLuck/"}
                    testTitle={"오늘의 총운 - 케이테스트 | 사주 테스트"}/>
                <div className="share">
                    <CopyToClipboard text={"https://ktestone.com/kapable.github.io/todayLuck/" + props?.match?.params?.query +'/'}>
                        <img
                            src={COPYBTN}
                            onClick={onShareButtonClick}
                            className="share-btn-img"
                            alt="링크 복사"
                            />
                    </CopyToClipboard>
                </div>
                <div className="re-test-btn">
                    <img
                        src={AGAINBTN}
                        className="re-test-btn-img"
                        onClick={onRestartButtonClick}
                        alt="테스트 다시하기"/>
                </div>
            </div>
            <div className="back-to-main" style={{display:"block"}}>
                <img
                    src={TOHOMEBTN}
                    onClick={onBacktoHomeButtonClick}
                    className="back-to-main-btn-img"
                    alt="다른 테스트 하러가기"
                    />
            </div>
        </div>
    );
};

export default withRouter(LifetimeSajuResult);