import type {
  FrontendNamingConvention,
  BackendNamingConvention,
  DatabaseNamingConvention,
  CommonNamingConvention,
} from '../types/namingConvention';

interface FrontendFieldMapping {
  label: string;
  key: keyof FrontendNamingConvention;
}

interface BackendFieldMapping {
  label: string;
  key: keyof BackendNamingConvention;
}

interface DatabaseFieldMapping {
  label: string;
  key: keyof DatabaseNamingConvention;
}

interface CommonFieldMapping {
  label: string;
  key: keyof CommonNamingConvention;
}

export const FRONTEND_FIELDS: FrontendFieldMapping[] = [
  { label: '변수', key: 'variable' },
  { label: '함수', key: 'function' },
  { label: '컴포넌트', key: 'component' },
  { label: '상수', key: 'constant' },
] as const;

export const BACKEND_FIELDS: BackendFieldMapping[] = [
  { label: '변수', key: 'variable' },
  { label: '함수', key: 'function' },
  { label: '클래스', key: 'class' },
  { label: '상수', key: 'constant' },
] as const;

export const DATABASE_FIELDS: DatabaseFieldMapping[] = [
  { label: '테이블', key: 'table' },
  { label: '컬럼', key: 'column' },
  { label: '인덱스', key: 'index' },
  { label: '제약조건', key: 'constraint' },
] as const;

export const COMMON_FIELDS: CommonFieldMapping[] = [
  { label: '유틸리티', key: 'utility' },
  { label: '상수', key: 'constant' },
  { label: '타입', key: 'type' },
  { label: '열거형', key: 'enum' },
] as const;
