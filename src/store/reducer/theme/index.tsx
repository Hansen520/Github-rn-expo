/*
 * @Date: 2023-12-08 11:18:24
 * @Description: description
 */
import Types from '../../action/types';

//定义state默认值，注意这里的数据结构取值的时候要保持一致
const defaultState = {
  theme: '#e7912e',
};

function onAction(state = defaultState, action: { type: string, theme: string }) {
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        theme: action.theme,
      };
    default:
      return state;
  }
}

export default onAction;
