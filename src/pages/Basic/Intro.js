/* eslint-disable no-loop-func */
import React, { Component, Fragment } from 'react';
import Quiz from '../../components/Basic/Quiz';
import Loading from '../../components/Basic/Loading';
import BirthdayCalc from '../../components/TestTypes/BirthdayCalc';
import Constellation from '../../components/TestTypes/Constellation';
import DualMbti from '../../components/TestTypes/DualMbti';
import StoryTelling from '../../components/TestTypes/StoryTelling';
import Game from '../../components/TestTypes/Game';
import OtherLangIcons from '../../components/Sub/OtherLangIcons';
import { TESTS } from '../../api/TESTS';
import { createSearchParams } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Helmet } from 'react-helmet-async';
import COPYBTN from '../../api/DefaultImg/result-copy-link-btn.png';
import BACKBTN from '../../api/DefaultImg/result-to-home-btn.png';
import STARTBTN from '../../api/DefaultImg/intro-start-button.png';
import STARTBTNENG from '../../api/DefaultImg/intro-start-button-Eng.png';
import { _eventSenderGA, reloadPage } from '../../tools/tools';
import AdsenseAdvertiser from '../../components/Sub/AdsenseAdvertiser';
import './css/typeCountingMBTIName.css';
import { withRouter } from '../../tools/withRouter';
import UserProfileFloatingBtn from '../../components/Sub/UserProfileFloatingBtn';
import { supabase } from '../../tools/supabaseClient';
import { USER_INFO_TABLE } from '../../tools/auth';
import CoupangDynamicBanner from '../../components/Sub/CoupangDynamicBanner';

class Intro extends Component {
  constructor(props) {
    super(props);
    this.mainImgRef = React.createRef(null);
    let _current_test = [];
    let i = 0;
    while (i < TESTS.length) {
      if (TESTS[i].info.mainUrl === this.props.test) {
        _current_test = TESTS[i];
        break;
      }
      i = i + 1;
    }

    // create answer option object for counting each question's answer
    let _answer_type_obj = {};
    for (let k = 0; k < _current_test.questions.length; k++) {
      for (let l = 0; l < _current_test.questions[k].answers.length; l++) {
        _answer_type_obj[_current_test.questions[k].answers[l].type] = 0;
      }
    }

    // for applying meta tag url with slash -> prevent doulbe slash at the last chars in the sharable url
    let _sharable_url = window.location.href;
    if (window.location.href.slice(-1) === '/') {
      _sharable_url = window.location.href.slice(0, -1);
    } else {
      _sharable_url = window.location.href;
    }

    this.state = {
      mode: 'intro',
      current_test: _current_test,
      qAndA: _current_test.questions,
      scoreType: _current_test.info.scoreType,
      lang: _current_test.info.lang,
      answer_type_obj: _answer_type_obj, // < ------------- for calculating type += 1
      quizNumber: 0,
      counted_score: 0, // < ------------- for calculating scores
      result_url: '/result/',
      quiz_url: _sharable_url,
      num_shares_count: 0,
      custom_name: '',
      custom_option: '',
      name_input: '', // < ----------------------- for typeCountingMBTIName test type
      user: null,
      TextsByLanguages: {
        Kor: ['로그인시 나의 성격 리포트 발급'],
        Eng: ['Get my personality report upon login'],
        JP: ['ログイン時に私の性格レポートを発行'],
        CN: ['登录时获取我的性格报告'],
      },
    };
    this._metaTagRenderer = this._metaTagRenderer.bind(this);
    this._onStartButtonClick = this._onStartButtonClick.bind(this);
    this._onAiSimulatorButtonClick = this._onAiSimulatorButtonClick.bind(this);
    this._onMainButtonClick = this._onMainButtonClick.bind(this);
    this._onShareButtonClick = this._onShareButtonClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.nameInputMbtiRenderer = this.nameInputMbtiRenderer.bind(this);
  }

  componentDidMount() {
    this.mainImgRef.current.scrollIntoView({ behavior: 'smooth' });
    // go to quiz mode when TONYMOLY factPok contents start
    let dualQueries = [
      'haGender',
      'haGenderMale',
      'haGenderFemale',
      'coupleCharacterJP',
      'coupleCharacterMaleIT',
      'coupleCharacterFemaleIT',
      'coupleCharacterMaleJP',
      'coupleCharacterFemaleJP',
      'coupleCharacterCN',
      'coupleCharacterMaleCN',
      'coupleCharacterFemaleCN',
      'coupleCharacterEng',
      'coupleCharacterMaleEng',
      'coupleCharacterFemaleEng',
      'coupleCharacterMale',
      'coupleCharacterFemale',
      'factPok',
      'MyFactPok',
      'FriendFactPok',
      'loveCharacter',
      'loveCharacterFemale',
      'loveCharacterMale',
      'loveCharacterEng',
      'loveCharacterFemaleEng',
      'loveCharacterMaleEng',
      'loveCharacterCN',
      'loveCharacterFemaleCN',
      'loveCharacterMaleCN',
      'loveCharacterGer',
      'loveCharacterFemaleGer',
      'loveCharacterMaleGer',
      'loveCharacterES',
      'loveCharacterFemaleES',
      'loveCharacterMaleES',
      'maleFemaleCharMale',
      'maleFemaleCharFemale',
      'maleFemaleCharEngFemale',
      'maleFemaleCharEngMale',
    ];
    if (dualQueries.some((el) => this.state.quiz_url.includes(el))) {
      this.setState({
        mode: 'quiz',
      });
    }
    // return this.mainImgRef.current?.scrollIntoView({ behavior: 'smooth' });
    const checkUserLoggedIn = async () => {
      const { data } = await supabase.auth.getUser();
      if (data) {
        const { data: userInfo } = await supabase
          .from(USER_INFO_TABLE)
          .select('*')
          .eq('user_id', data?.user?.id);

        this.setState({ user: userInfo?.[0] });
      }
    };
    checkUserLoggedIn();
  }
  _onStartButtonClick() {
    let testQuery = '';
    if (this.state.current_test.info.mainUrl === 'hmall') {
      testQuery = 'hmall';
    } else if (this.state.current_test.info.mainUrl === 'gardenflower') {
      testQuery = 'gardenflower';
    }
    _eventSenderGA(
      'Paging',
      `Click ${testQuery}Start-test Button`,
      'intro page'
    );
    this.setState({
      mode: 'quiz',
    });
  }

  _onAiSimulatorButtonClick() {
    _eventSenderGA(
      'Paging',
      `Click ${this.state.current_test.info.mainUrl}Start-test Button`,
      'intro page'
    );
  }

  _onMainButtonClick() {
    this.setState({
      mode: 'main',
    });
    _eventSenderGA('Paging', 'Click Back-to-main Button', 'intro page');
  }

  _onShareButtonClick() {
    this.setState({
      num_shares_count: this.state.num_shares_count + 1,
    });
    _eventSenderGA('Sharing', 'Click Copy-link Button', 'intro page');
    alert('링크가 복사됐어요!');
  }

  _metaTagRenderer(lang) {
    if (lang === 'Kor' || lang === '') {
      return (
        <Helmet>
          {/* <!-- Primary Meta Tags --> */}
          <title>{this.state.current_test.info.mainTitle}-케이테스트</title>
          <meta
            name='title'
            content={
              this.state.current_test.info.mainTitle +
              '- 케이테스트 | MBTI 테스트 검사 | 사주, 궁합'
            }
          />
          <meta
            name='description'
            content={
              this.state.current_test.info.subTitle +
              '- 케이테스트 | MBTI 테스트 검사 | 사주, 궁합'
            }
            //   data-react-helmet='true'
          />
          <link rel='main-url' href={`${this.state.quiz_url}/`} />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}/`}
            hrefLang='ko'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}Eng/`}
            hrefLang='en'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}CN/`}
            hrefLang='zh-Hans'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}JP/`}
            hrefLang='ja'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}ES/`}
            hrefLang='es'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}Rus/`}
            hrefLang='ru'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}Ger/`}
            hrefLang='de'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}IT/`}
            hrefLang='it'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}Arb/`}
            hrefLang='ar'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}Fra/`}
            hrefLang='fr'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}Ind/`}
            hrefLang='hi'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}Malay/`}
            hrefLang='ms'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url}/`}
            hrefLang='x-default'
          />

          {/* <!-- Open Graph / Facebook --> */}
          <meta property='og:type' content='website' />
          <meta property='og:url' content={this.state.quiz_url} />
          <meta
            property='og:title'
            content={
              this.state.current_test.info.mainTitle +
              '- 케이테스트 | MBTI 테스트 검사 | 사주, 궁합'
            }
          />
          <meta
            property='og:description'
            content={
              this.state.current_test.info.subTitle +
              '- 케이테스트 | MBTI 테스트 검사 | 사주, 궁합'
            }
          />
          <meta
            property='og:image'
            content={this.state.current_test.info.mainImage}
          />
          <meta
            property='og:image:alt'
            content={this.state.current_test.info.mainTitle}
          />

          {/* <!-- Twitter --> */}
          <meta property='twitter:card' content='summary_large_image' />
          <meta property='twitter:url' content={this.state.quiz_url} />
          <meta
            property='twitter:title'
            content={
              this.state.current_test.info.mainTitle +
              '- 케이테스트 | MBTI 테스트 검사 | 사주, 궁합'
            }
          />
          <meta
            property='twitter:description'
            content={
              this.state.current_test.info.subTitle +
              '- 케이테스트 | MBTI 테스트 검사 | 사주, 궁합'
            }
          />
          <meta
            property='twitter:image'
            content={this.state.current_test.info.mainImage}
          />
          <meta
            property='twitter:image:alt'
            content={this.state.current_test.info.mainTitle}
          />
        </Helmet>
      );
    } else if (lang === 'Eng') {
      return (
        <Helmet>
          {/* <!-- Primary Meta Tags --> */}
          <title>{this.state.current_test.info.mainTitle}-KTEST</title>
          <meta
            name='title'
            content={
              this.state.current_test.info.mainTitle +
              '- KTEST | Personality Test'
            }
          />
          <meta
            name='description'
            content={
              this.state.current_test.info.subTitle +
              '- KTEST | Personality Test'
            }
            //   data-react-helmet='true'
          />
          <link rel='main-url' href={`${this.state.quiz_url}/`} />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}/`}
            hrefLang='ko'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}Eng/`}
            hrefLang='en'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}CN/`}
            hrefLang='zh-Hans'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}JP/`}
            hrefLang='ja'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}ES/`}
            hrefLang='es'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}Rus/`}
            hrefLang='ru'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}Ger/`}
            hrefLang='de'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}IT/`}
            hrefLang='it'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}Arb/`}
            hrefLang='ar'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}Fra/`}
            hrefLang='fr'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}Ind/`}
            hrefLang='hi'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}Malay/`}
            hrefLang='ms'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('Eng', '')}/`}
            hrefLang='x-default'
          />

          {/* <!-- Open Graph / Facebook --> */}
          <meta property='og:type' content='website' />
          <meta property='og:url' content={this.state.quiz_url} />
          <meta
            property='og:title'
            content={
              this.state.current_test.info.mainTitle +
              '- KTEST | Personality Test'
            }
          />
          <meta
            property='og:description'
            content={
              this.state.current_test.info.subTitle +
              '- KTEST | Personality Test'
            }
          />
          <meta
            property='og:image'
            content={this.state.current_test.info.mainImage}
          />
          <meta
            property='og:image:alt'
            content={this.state.current_test.info.mainTitle}
          />

          {/* <!-- Twitter --> */}
          <meta property='twitter:card' content='summary_large_image' />
          <meta property='twitter:url' content={this.state.quiz_url} />
          <meta
            property='twitter:title'
            content={
              this.state.current_test.info.mainTitle +
              '- KTEST | Personality Test'
            }
          />
          <meta
            property='twitter:description'
            content={
              this.state.current_test.info.subTitle +
              '- KTEST | Personality Test'
            }
          />
          <meta
            property='twitter:image'
            content={this.state.current_test.info.mainImage}
          />
          <meta
            property='twitter:image:alt'
            content={this.state.current_test.info.mainTitle}
          />
        </Helmet>
      );
    } else if (lang === 'JP') {
      return (
        <Helmet>
          {/* <!-- Primary Meta Tags --> */}
          <title>
            {this.state.current_test.info.mainTitle}-ケイテスト ケーテスト KTEST
          </title>
          <meta
            name='title'
            content={
              this.state.current_test.info.mainTitle +
              '- ケイテスト ケーテスト KTEST - 趣向分析MBTIテスト'
            }
          />
          <meta
            name='description'
            content={
              this.state.current_test.info.subTitle +
              '- ケイテスト ケーテスト KTEST - 趣向分析MBTIテスト'
            }
            //   data-react-helmet='true'
          />
          <link rel='main-url' href={`${this.state.quiz_url}/`} />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}/`}
            hrefLang='ko'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}Eng/`}
            hrefLang='en'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}CN/`}
            hrefLang='zh-Hans'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}JP/`}
            hrefLang='ja'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}ES/`}
            hrefLang='es'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}Rus/`}
            hrefLang='ru'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}Ger/`}
            hrefLang='de'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}IT/`}
            hrefLang='it'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}Arb/`}
            hrefLang='ar'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}Fra/`}
            hrefLang='fr'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}Ind/`}
            hrefLang='hi'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}Malay/`}
            hrefLang='ms'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace('JP', '')}/`}
            hrefLang='x-default'
          />

          {/* <!-- Open Graph / Facebook --> */}
          <meta property='og:type' content='website' />
          <meta property='og:url' content={this.state.quiz_url} />
          <meta
            property='og:title'
            content={
              this.state.current_test.info.mainTitle +
              '- ケイテスト ケーテスト KTEST - 趣向分析MBTIテスト'
            }
          />
          <meta
            property='og:description'
            content={
              this.state.current_test.info.subTitle +
              '- ケイテスト ケーテスト KTEST - 趣向分析MBTIテスト'
            }
          />
          <meta
            property='og:image'
            content={this.state.current_test.info.mainImage}
          />
          <meta
            property='og:image:alt'
            content={this.state.current_test.info.mainTitle}
          />

          {/* <!-- Twitter --> */}
          <meta property='twitter:card' content='summary_large_image' />
          <meta property='twitter:url' content={this.state.quiz_url} />
          <meta
            property='twitter:title'
            content={
              this.state.current_test.info.mainTitle +
              '- ケイテスト ケーテスト KTEST - 趣向分析MBTIテスト'
            }
          />
          <meta
            property='twitter:description'
            content={
              this.state.current_test.info.subTitle +
              '- ケイテスト ケーテスト KTEST - 趣向分析MBTIテスト'
            }
          />
          <meta
            property='twitter:image'
            content={this.state.current_test.info.mainImage}
          />
          <meta
            property='twitter:image:alt'
            content={this.state.current_test.info.mainTitle}
          />
        </Helmet>
      );
    } else {
      return (
        <Helmet>
          {/* <!-- Primary Meta Tags --> */}
          <title>{this.state.current_test.info.mainTitle}-KTEST</title>
          <meta
            name='title'
            content={
              this.state.current_test.info.mainTitle +
              '- KTEST | Personality Test'
            }
          />
          <meta
            name='description'
            content={
              this.state.current_test.info.subTitle +
              '- KTEST | Personality Test'
            }
            //   data-react-helmet='true'
          />
          <link rel='main-url' href={`${this.state.quiz_url}/`} />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}/`}
            hrefLang='ko'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}Eng/`}
            hrefLang='en'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}CN/`}
            hrefLang='zh-Hans'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}JP/`}
            hrefLang='ja'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}ES/`}
            hrefLang='es'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}Rus/`}
            hrefLang='ru'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}Ger/`}
            hrefLang='de'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}IT/`}
            hrefLang='it'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}Arb/`}
            hrefLang='ar'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}Fra/`}
            hrefLang='fr'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}Ind/`}
            hrefLang='hi'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}Malay/`}
            hrefLang='ms'
          />
          <link
            rel='alternate'
            href={`${this.state.quiz_url.replace(this.state.lang, '')}/`}
            hrefLang='x-default'
          />

          {/* <!-- Open Graph / Facebook --> */}
          <meta property='og:type' content='website' />
          <meta property='og:url' content={this.state.quiz_url} />
          <meta
            property='og:title'
            content={
              this.state.current_test.info.mainTitle +
              '- KTEST | Personality Test'
            }
          />
          <meta
            property='og:description'
            content={
              this.state.current_test.info.subTitle +
              '- KTEST | Personality Test'
            }
          />
          <meta
            property='og:image'
            content={this.state.current_test.info.mainImage}
          />
          <meta
            property='og:image:alt'
            content={this.state.current_test.info.mainTitle}
          />

          {/* <!-- Twitter --> */}
          <meta property='twitter:card' content='summary_large_image' />
          <meta property='twitter:url' content={this.state.quiz_url} />
          <meta
            property='twitter:title'
            content={
              this.state.current_test.info.mainTitle +
              '- KTEST | Personality Test'
            }
          />
          <meta
            property='twitter:description'
            content={
              this.state.current_test.info.subTitle +
              '- KTEST | Personality Test'
            }
          />
          <meta
            property='twitter:image'
            content={this.state.current_test.info.mainImage}
          />
          <meta
            property='twitter:image:alt'
            content={this.state.current_test.info.mainTitle}
          />
        </Helmet>
      );
    }
  }

  handleNameChange = (e) => {
    // if (e.target.value.length > 2) {
    //   return;
    // }
    this.setState({
      name_input: e.target.value,
    });
  };

  nameInputMbtiRenderer(_thumbImage, _mainTitle, _subTitle) {
    const screenWidth = window.screen.width;
    let fontColor = this.state.current_test.info.nameLocation.intro?.fontColor
      ? this.state.current_test.info.nameLocation.intro?.fontColor
      : 'black';
    let inputBgColor = this.state.current_test.info.nameLocation.intro
      ?.inputBgColor
      ? this.state.current_test.info.nameLocation.intro?.inputBgColor
      : 'white';
    let introBottom = this.state.current_test.info.nameLocation.intro.bottom;
    let pcIntroBottom =
      this.state.current_test.info.nameLocation.intro.pcBottom;
    let introFontSize =
      this.state.current_test.info.nameLocation.intro.fontSize;
    let pcIntroFontSize =
      this.state.current_test.info.nameLocation.intro.pcFontSize;

    if (screenWidth >= 768) {
      introBottom = pcIntroBottom;
      introFontSize = pcIntroFontSize;
    }

    return (
      <div className='introMainDiv'>
        <div>
          <img
            loading='lazy'
            className='intro-main-img'
            src={_thumbImage}
            alt={_mainTitle + '|' + _subTitle}
          />
        </div>
        <div
          className='introInputDiv'
          style={{
            bottom: `${introBottom}%`,
          }}
        >
          <input
            type='text'
            value={this.state.name_input}
            onChange={this.handleNameChange}
            placeholder={
              this.state.lang === 'Kor'
                ? '이름 입력하기'
                : this.state.lang === 'JP'
                  ? '名前を入力'
                  : 'Your Name'
            }
            maxLength={this.state.lang === 'Kor' ? 2 : 6}
            className='introInput'
            style={{
              fontFamily: this.state.current_test.info.nameLocation.intro.font,
              fontSize: `${introFontSize}rem`,
              fontWeight: 'bold',
              color: fontColor,
              backgroundColor: inputBgColor,
            }}
          />
        </div>
      </div>
    );
  }

  introPageRender() {
    reloadPage(); // because the adsense ads when the page convert from mainPage to intro
    let _mainTitle = this.state.current_test.info.mainTitle;
    let _subTitle = this.state.current_test.info.subTitle;
    let _thumbImage = this.state.current_test.info.mainImage;

    return (
      <Fragment>
        <div className='intro container'>
          {this._metaTagRenderer(this.state.lang)}
          <div
            ref={this.mainImgRef}
            style={{ lineHeight: '2rem', marginTop: '2.5rem' }}
          >
            <h2>{this.state.current_test.info.mainTitle}</h2>
            <h4 style={{ color: 'grey' }}>
              {this.state.current_test.info.subTitle}
            </h4>
          </div>
          {this.state.scoreType === 'typeCountingMBTIName' ? (
            this.nameInputMbtiRenderer(_thumbImage, _mainTitle, _subTitle)
          ) : (
            <div>
              <img
                loading='lazy'
                className='intro-main-img'
                src={_thumbImage}
                alt={_mainTitle + '|' + _subTitle}
              />
            </div>
          )}

          <AdsenseAdvertiser
            client={`ca-pub-2382342018701919`}
            slot={'1017740958'}
            format='auto'
            responsive='true'
            style={{ display: 'block' }}
          />

          <div>
            <p
              style={{
                whiteSpace: 'pre-line',
                lineHeight: '1.rem',
                fontWeight: 'bold',
                margin: '2.5rem auto',
                color: 'grey',
              }}
            >
              {this.state.current_test.info?.description
                ? this.state.current_test.info?.description
                : `${this.state.current_test.info?.subTitle}\n${this.state.lang === 'Kor' ? '지글 케이테스트를 통해 살펴보세요✨' : 'Find it NOW with the TEST✨'}`}
            </p>
          </div>

          <OtherLangIcons currentTest={this.state.current_test.info.mainUrl} />
          {this.state.scoreType === 'aiSimulation' ? (
            <a
              href={this.state.current_test.info.gptUrl}
              rel='noopener noreferrer'
              target='_blank'
            >
              <img
                style={{ width: '100%', maxWidth: '20rem', cursor: 'pointer' }}
                src={this.state.lang === 'Kor' ? STARTBTN : STARTBTNENG}
                alt={`${this.state.current_test.info.mainTitle}-start-button`}
                onClick={this._onAiSimulatorButtonClick}
              />
            </a>
          ) : (
            <img
              style={{ width: '100%', maxWidth: '20rem', cursor: 'pointer' }}
              src={this.state.lang === 'Kor' ? STARTBTN : STARTBTNENG}
              alt={`${this.state.current_test.info.mainTitle}-start-button`}
              onClick={this._onStartButtonClick}
            />
          )}

          <div className='test-intro-with-friend'>
            <CopyToClipboard text={this.state.quiz_url + '/'}>
              <img
                loading='lazy'
                src={COPYBTN}
                className='test-intro-with-friend-img'
                onClick={this._onShareButtonClick}
                alt='테스트 링크 복사'
              />
            </CopyToClipboard>
          </div>
          <div className='test-intro-to-main'>
            <img
              loading='lazy'
              className='test-intro-to-main-img'
              src={BACKBTN}
              onClick={this._onMainButtonClick}
              alt='다른 테스트 하러 뒤로가기'
            />
          </div>
          {this.state.lang === 'Kor' && (
            <CoupangDynamicBanner page={'loading'} />
          )}
        </div>
        <UserProfileFloatingBtn user={this.state.user} />
        {!this.state.user && (
          <div
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '80px',
              width: '190px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '0.5rem',
              borderBottomRightRadius: '0',
              cursor: 'pointer',
              zIndex: 1000,
              fontSize: '0.9rem',
            }}
          >
            {['Kor', 'Eng', 'JP', 'CN'].includes(this.state.lang)
              ? this.state.TextsByLanguages[this.state.lang][0]
              : this.state.TextsByLanguages['Eng'][0]}
          </div>
        )}
      </Fragment>
    );
  }

  resultCaculator() {
    if (
      this.state.scoreType === 'numberScoring' ||
      this.state.scoreType === 'birthdayCalc' ||
      this.state.scoreType === 'storyTelling' ||
      this.state.scoreType === 'numberScoringImg' ||
      this.state.scoreType === 'Constellation'
    ) {
      let final_score = this.state.counted_score;
      for (let k = 0; k < this.state.current_test.results.length; k++) {
        if (
          this.state.current_test.results[k].score_range.includes(final_score)
        ) {
          return this.state.current_test.results[k];
        }
      }
    } else if (this.state.scoreType === 'typeCounting') {
      let final_result = this.state.answer_type_obj;
      let keys = Object.keys(final_result);
      let max = final_result[keys[0]];
      let max_keys = [];
      for (let z = 0; z < keys.length; z++) {
        let value = final_result[keys[z]];
        if (value > max) max = value;
      }
      for (let key of keys) {
        if (final_result[key] === max) {
          max_keys.push(key);
        }
      }
      for (let z = 0; z < this.state.current_test.results.length; z++) {
        if (max_keys[0] === this.state.current_test.results[z].type) {
          return this.state.current_test.results[z];
        }
      }
    } else if (
      this.state.scoreType === 'typeCountingMBTI' ||
      this.state.scoreType === 'typeCountingMBTIName'
    ) {
      let final_result_obj = this.state.answer_type_obj;

      // for creating an array which contains VS between types ex.["EI", "SN", "TF", "JP"]
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      let _which_type_arr = [];
      for (let k = 0; k < this.state.current_test.questions.length; k++) {
        _which_type_arr.push(this.state.current_test.questions[k].which);
      }
      _which_type_arr = _which_type_arr.filter(onlyUnique);

      // get max value & type from Each VS
      let final_type = '';
      for (let i = 0; i < _which_type_arr.length; i++) {
        let first_type = _which_type_arr[i][0];
        let second_type = _which_type_arr[i][1];
        let type_arr = [first_type, second_type];
        let max_val = 0;
        // for split in case of odd | even questions in the same which(ex. EI/SN..)
        if (final_result_obj[first_type] !== final_result_obj[second_type]) {
          max_val = Math.max(
            final_result_obj[first_type],
            final_result_obj[second_type]
          );
          // eslint-disable-next-line
          type_arr
            .filter((item) => final_result_obj[item] === max_val)
            .forEach((item) => (final_type += item));
        } else {
          final_type += type_arr[0];
        }
      }

      // return 'THE' result TYPE from TESTS.js
      for (let z = 0; z < this.state.current_test.results.length; z++) {
        if (final_type === this.state.current_test.results[z].type) {
          return this.state.current_test.results[z];
        }
      }
    } else if (this.state.scoreType === 'percentageMBTI') {
      let final_result_obj = this.state.answer_type_obj;

      // for creating an array which contains VS between types ex.["EI", "SN", "TF", "JP"]
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      let _which_type_arr = [];
      for (let k = 0; k < this.state.current_test.questions.length; k++) {
        _which_type_arr.push(this.state.current_test.questions[k].which);
      }
      _which_type_arr = _which_type_arr.filter(onlyUnique);

      // get max value & type from Each VS
      let final_type = '';
      for (let i = 0; i < _which_type_arr.length; i++) {
        let first_type = _which_type_arr[i][0];
        let second_type = _which_type_arr[i][1];
        let type_arr = [first_type, second_type];
        let max_val = 0;
        // for split in case of odd | even questions in the same which(ex. EI/SN..)
        if (final_result_obj[first_type] !== final_result_obj[second_type]) {
          max_val = Math.max(
            final_result_obj[first_type],
            final_result_obj[second_type]
          );
          // eslint-disable-next-line
          type_arr
            .filter((item) => final_result_obj[item] === max_val)
            .forEach((item) => (final_type += item));
        } else {
          final_type += type_arr[0];
        }
      }

      // return 'THE' result TYPE from TESTS.js
      for (let z = 0; z < this.state.current_test.results.length; z++) {
        if (final_type === this.state.current_test.results[z].type) {
          return {
            result_type: this.state.current_test.results[z],
            type_count: this.state.answer_type_obj,
          };
        }
      }
    } else if (this.state.scoreType === 'dualMBTI') {
      let final_type = this.state.counted_score;
      for (let k = 0; k < this.state.current_test.results.length; k++) {
        if (this.state.current_test.results[k].type === final_type) {
          return this.state.current_test.results[k];
        }
      }
    } else if (this.state.scoreType === 'DogSounds') {
      return this.state.current_test.results[this.state.counted_score];
    } else if (this.state.scoreType === 'facialExpression') {
      let i = 0;
      while (i < this.state.current_test.results.length) {
        if (
          this.state.current_test.results[i].type ===
            this.state.custom_option &&
          this.state.current_test.results[i].score_range.includes(
            this.state.counted_score
          )
        ) {
          let _final = this.state.current_test.results[i];
          return _final;
        }
        i = i + 1;
      }
    }
  }
  quizPageRender() {
    if (this.state.mode === 'quiz') {
      // when the type is cummulative number scoring
      if (
        this.state.scoreType === 'numberScoring' ||
        this.state.scoreType === 'numberScoringImg'
      ) {
        let _page = (
          <Quiz
            qAndA={this.state.qAndA}
            quizNum={this.state.quizNumber}
            scoreType={this.state.scoreType}
            onChangeMode={function (_quizNum, _score, _mode) {
              let _scores = this.state.counted_score + Number(_score);
              this.setState({
                quizNumber: _quizNum,
                counted_score: _scores,
                mode: _mode,
              });
            }.bind(this)}
          ></Quiz>
        );
        return _page;
        // when the type is each type counting
      } else if (this.state.scoreType === 'typeCounting') {
        let _page = (
          <Quiz
            qAndA={this.state.qAndA}
            quizNum={this.state.quizNumber}
            scoreType={this.state.scoreType}
            onChangeMode={function (_quizNum, _answer, _mode) {
              var _answer_obj = Object.assign({}, this.state.answer_type_obj);
              _answer_obj[_answer] = _answer_obj[_answer] + 1;
              this.setState({
                quizNumber: _quizNum,
                answer_type_obj: _answer_obj,
                mode: _mode,
              });
            }.bind(this)}
          ></Quiz>
        );
        return _page;
      } else if (this.state.scoreType === 'birthdayCalc') {
        let _page = (
          <BirthdayCalc
            onChangeMode={function (_final_result, _mode) {
              this.setState({
                counted_score: _final_result,
                mode: _mode,
              });
            }.bind(this)}
          ></BirthdayCalc>
        );
        return _page;
      } else if (this.state.scoreType === 'dualMBTI') {
        let _page = (
          <DualMbti
            onChangeMode={function (_final_result, _mode) {
              this.setState({
                counted_score: _final_result,
                mode: _mode,
              });
            }.bind(this)}
          ></DualMbti>
        );
        return _page;
      } else if (this.state.scoreType === 'storyTelling') {
        let _page = (
          <StoryTelling
            qAndA={this.state.qAndA}
            quizNum={this.state.quizNumber}
            scoreType={this.state.scoreType}
            onChangeMode={function (_quizNum, _mode) {
              this.setState({
                quizNumber: _quizNum,
                mode: _mode,
              });
            }.bind(this)}
          ></StoryTelling>
        );
        return _page;
      } else if (
        this.state.scoreType === 'typeCountingMBTI' ||
        this.state.scoreType === 'percentageMBTI' ||
        this.state.scoreType === 'typeCountingMBTIName'
      ) {
        let _page = (
          <Quiz
            qAndA={this.state.qAndA}
            quizNum={this.state.quizNumber}
            scoreType={this.state.scoreType}
            onChangeMode={function (_quizNum, _answer, _mode) {
              var _answer_obj = Object.assign({}, this.state.answer_type_obj);
              _answer_obj[_answer] = _answer_obj[_answer] + 1;
              this.setState({
                quizNumber: _quizNum,
                answer_type_obj: _answer_obj,
                mode: _mode,
              });
            }.bind(this)}
          ></Quiz>
        );
        return _page;
      } else if (this.state.scoreType === 'Constellation') {
        let _page = (
          <Constellation
            onChangeMode={function (_final_result, _mode) {
              this.setState({
                counted_score: _final_result,
                mode: _mode,
              });
            }.bind(this)}
          ></Constellation>
        );
        return _page;
      } else if (this.state.scoreType === 'game') {
        let _page = (
          <Game
            gameUrl={this.state.current_test.info.gameUrl}
            gameTitle={this.state.current_test.info.mainTitle}
          ></Game>
        );
        return _page;
      }
    }

    return this._page;
  }

  lodingPageRender() {
    if (this.state.current_test.info.mainUrl === 'fatecharmtest') {
      let result_contents = this.resultCaculator();
      return (
        <div className='loading-upper'>
          <Loading
            test={this.state.current_test.info.mainUrl}
            lang={this.state.lang}
          />
          {setTimeout(function () {
            _eventSenderGA(
              'Out-paging',
              `Go-to-Tworld(fatecharm)`,
              'loading page'
            );
            window.open(
              `https://m.shop.tworld.co.kr/exhibition/view?exhibitionId=P00000348&mbti=${result_contents.type}&utm_source=ktest&utm_medium=result&utm_campaign=foldable5ktest`,
              '_parent'
            );
          }, 3700)}
        </div>
      );
    } else {
      return (
        <div className='loading-upper'>
          <Loading
            test={this.state.current_test.info.mainUrl}
            lang={this.state.lang}
          />
          {setTimeout(
            function () {
              this.setState({ mode: 'result' });
            }.bind(this),
            4700
          )}
        </div>
      );
    }
  }

  resultPageRender() {
    // go to result page
    let result_contents = this.resultCaculator();
    if (
      this.state.current_test.info.mainUrl === 'dogSounds' ||
      this.state.current_test.info.mainUrl === 'dogSoundsEng'
    ) {
      let final_score_query = result_contents.query; // <----------------query export
      return this.props.navigate(
        this.state.result_url + final_score_query + '/'
      );
    } else if (this.state.current_test.info.scoreType === 'percentageMBTI') {
      let final_score_query = result_contents.result_type.query;
      let type_order = ['E', 'I', 'S', 'N', 'T', 'F', 'P', 'J'];
      let searchQuery = '';
      type_order.forEach((t) => {
        searchQuery = searchQuery.concat(result_contents.type_count[t]);
      });
      return this.props.navigate({
        pathname:
          '/kapable.github.io/' +
          this.state.current_test.info.mainUrl +
          this.state.result_url +
          final_score_query +
          '/',
        search: createSearchParams({ pct: searchQuery }).toString(),
      });
    } else if (
      this.state.current_test.info.scoreType === 'typeCountingMBTIName'
    ) {
      let final_score_query = result_contents.query;
      return this.props.navigate({
        pathname:
          '/kapable.github.io/' +
          this.state.current_test.info.mainUrl +
          this.state.result_url +
          final_score_query +
          '/',
        search: createSearchParams({ name: this.state.name_input }).toString(),
      });
    } else {
      let final_score_query = result_contents.query; // <----------------query export
      return this.props.navigate(
        '/kapable.github.io/' +
          this.state.current_test.info.mainUrl +
          this.state.result_url +
          final_score_query +
          '/'
      );
    }
  }

  pageRenderer() {
    let _page = [];
    if (this.state.mode === 'intro') {
      _page = this.introPageRender();
    } else if (this.state.mode === 'quiz') {
      _page = this.quizPageRender();
    } else if (this.state.mode === 'main') {
      this.props.navigate('/');
    } else if (this.state.mode === 'loading') {
      _page = this.lodingPageRender();
    } else if (this.state.mode === 'result') {
      _page = this.resultPageRender();
    }
    return _page;
  }

  render() {
    return <Fragment>{this.pageRenderer()}</Fragment>;
  }
}

export default withRouter(Intro);
