/**
 * 마크다운 표의 행(Row) 생성
 * @param col1 첫 번째 열
 * @param col2 두 번째 열
 * @param col3 세 번째 열 (선택)
 * @returns 마크다운 테이블 행 문자열
 */
export function createTableRow(
  col1: string,
  col2: string,
  col3?: string,
): string {
  return col3 ? `| ${col1} | ${col2} | ${col3} |` : `| ${col1} | ${col2} |`;
}

/**
 * 섹션 간 구분선 추가
 * @param lines 마크다운 라인 배열 (mutate됨)
 */
export function addSeparator(lines: string[]): void {
  lines.push('');
  lines.push('---');
  lines.push('');
}
