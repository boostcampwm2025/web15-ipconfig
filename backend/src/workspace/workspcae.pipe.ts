import { BadRequestException, PipeTransform } from '@nestjs/common';

export class WorkspaceIdPipe implements PipeTransform {
  transform(value: string) {
    const regex = /^[a-z0-9]{1,32}$/;
    const isValid = regex.test(value);
    if (!isValid) {
      throw new BadRequestException(
        `'${value}' 는 유효하지 않은 워크스페이스 ID입니다.`,
      );
    }
    return value;
  }
}
