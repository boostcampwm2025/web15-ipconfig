import { BadRequestException, PipeTransform } from '@nestjs/common';

export class WorkspaceIdPipe implements PipeTransform {
  transform(value: string) {
    const regex = /^[a-z0-9]{1,32}$/;
    const isValid = regex.test(value);
    if (!isValid) {
      throw new BadRequestException(
        '워크스페이스 ID는 영소문자와 숫자만 1~32자 사용 가능합니다.',
      );
    }
    return value;
  }
}
