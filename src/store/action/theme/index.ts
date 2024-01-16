/*
 * @Date: 2023-12-08 17:59:06
 * @Description: description
 */
import Types from '../types';

/**
 * 主题变更
 * @param theme
 * @returns {{type: string, theme: *}}
 */
export function onThemeChange(theme: string) {
  return { type: Types.THEME_CHANGE, theme: theme };
}