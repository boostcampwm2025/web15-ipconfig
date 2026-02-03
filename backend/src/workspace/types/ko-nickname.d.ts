declare module 'ko-nickname' {
  interface GenerateNicknameOptions {
    mode?: 'default' | 'onlyAdjective' | 'onlyName';
  }

  function generateNickname(options?: GenerateNicknameOptions): string;

  export default generateNickname;
}

declare module 'ko-nickname/src/index.js' {
  import generateNickname from 'ko-nickname';
  export default generateNickname;
}
