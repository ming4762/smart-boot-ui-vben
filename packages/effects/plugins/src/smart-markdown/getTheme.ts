/**
 * 获取主题类型 深色浅色模式 对应的值
 * @param darkModeVal 深色模式值
 * @param themeMode 主题类型——外观(默认), 内容, 代码块
 */
export const getTheme = (
  darkModeVal: 'dark' | 'light' | string,
  themeMode: 'code' | 'content' | 'default' = 'default',
) => {
  const isDark = darkModeVal === 'dark';
  switch (themeMode) {
    case 'code': {
      return isDark ? 'dracula' : 'github';
    }
    case 'content': {
      return isDark ? 'dark' : 'light';
    }
    case 'default': {
      return isDark ? 'dark' : 'classic';
    }
  }
};
