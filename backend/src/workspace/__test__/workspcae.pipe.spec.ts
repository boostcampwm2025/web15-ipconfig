import { BadRequestException } from '@nestjs/common';
import { WorkspaceIdPipe } from '../workspcae.pipe';

describe('WorkspaceIdPipe', () => {
  let pipe: WorkspaceIdPipe;

  beforeEach(() => {
    pipe = new WorkspaceIdPipe();
  });

  it('유효한 workspaceId면 그대로 반환한다', () => {
    const value = 'abc123def4';

    const result = pipe.transform(value);

    expect(result).toBe(value);
  });

  it('1자리 이상 32자리 이하의 소문자/숫자가 아니면 BadRequestException을 던진다', () => {
    const cases = ['UPPERCASE', 'with-hyphen', '', 'a'.repeat(33)];

    for (const invalid of cases) {
      expect(() => pipe.transform(invalid)).toThrow(BadRequestException);
    }
  });

  it('특수문자에 대해서 BadRequestException을 던진다', () => {
    const value = '!@#$%^&*()';

    expect(() => pipe.transform(value)).toThrow(BadRequestException);
  });

  it('공백에 대해서 BadRequestException을 던진다', () => {
    const value = ' ';

    expect(() => pipe.transform(value)).toThrow(BadRequestException);
  });
});
