import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import './colorPicker.css';
import { reloadPage } from '../../../tools/tools';

const ColorPicker = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if(location?.state === 'again') {
      reloadPage();
    }
  }, [location]);

  const onButtonClick = (difficulty) => {
      return history.push(`/colorPicker/${difficulty}`, difficulty);
  }
  return (
    // TODO: Design
    // TODO: add metatag
    // TODO: GA event sender
    <div>
        <img
          className='result-img'
          style={{cursor: 'pointer'}}
          src="https://images.ktestone.com/introImages/colorPicker-easy-intro.jpeg" alt="colorPicker-intro"
          onClick={() => onButtonClick("easy")}
        />
        {/* <h1>케이테스트 색감 테스트</h1>
        <p>중간에 틀리면 다시 처음으로 돌아가요</p>
        <p>아래 버튼을 누르면 3초 뒤에 시작</p> */}
        {/* <div>
            <button onClick={() => onButtonClick("easy")} className='difficulty-button' type='button'>Easy</button>
            <button onClick={() => onButtonClick("medium")} className='difficulty-button' type='button'>Medium</button>
            <button onClick={() => onButtonClick("hard")} className='difficulty-button' type='button'>Hard</button>
        </div> */}
    </div>
  )
}

export default ColorPicker;