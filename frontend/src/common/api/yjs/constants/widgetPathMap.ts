// [위젯 타입] -> [필드 키] -> [실제 Yjs 경로]
/**
 * 위젯 타입별 필드와 실제 Yjs 데이터 구조 내 경로를 매핑한 객체입니다.
 *
 * 구조:
 * {
 *   [WIDGET_TYPE]: {
 *     [fieldKey]: ['path', 'to', 'property']
 *   }
 * }
 *
 * - fieldKey: 클라이언트(UI)에서 사용하는 추상화된 필드 이름
 * - value(배열): Yjs Y.Map 구조에서 해당 데이터를 찾아가기 위한 키들의 순서
 */
export const WIDGET_PATH_MAP: Record<string, Record<string, string[]>> = {
  GIT_CONVENTION: {
    // 1. Primitive Fields (값 수정용)
    mainBranch: ['branchRules', 'mainBranch'],
    developBranch: ['branchRules', 'developBranch'],
    useGitmoji: ['commitConvention', 'useGitmoji'],

    // 2. Selectors (옵션 선택용)
    strategy: ['strategy'],
    prefixes: ['branchRules', 'prefixes'],
    commitTypes: ['commitConvention', 'commitTypes'],
  },
  TECH_STACK: {
    subject: ['subject'],
    techItems: ['techItems'], // 배열이지만 여기선 경로만 정의
  },
  COMMUNICATION: {
    urgent: ['communication', 'urgent'],
    sync: ['communication', 'sync'],
    async: ['communication', 'async'],
    official: ['communication', 'official'],
    responseTime: ['sla', 'responseTime'],
    coreTimeStart: ['timeManagement', 'coreTimeStart'],
    coreTimeEnd: ['timeManagement', 'coreTimeEnd'],
    noMeetingDay: ['meeting', 'noMeetingDay'],
    feedbackStyle: ['meeting', 'feedbackStyle'],
  },
  GROUNDRULE_COLLABORATION: {
    approves: ['reviewPolicy', 'approves'],
    maxReviewHours: ['reviewPolicy', 'maxReviewHours'],
    blockMerge: ['reviewPolicy', 'blockMerge'],
    activeVersion: ['prRules', 'activeVersion'],
    labelRules: ['prRules', 'labelRules'],
    activeStrategy: ['prRules', 'activeStrategy'],
    platform: ['workflow', 'platform'],
    cycleValue: ['workflow', 'cycleValue'],
    cycleUnit: ['workflow', 'cycleUnit'],
  },
  COLLABORATION: {
    // 1. Primitive Fields
    approves: ['reviewPolicy', 'approves'],
    maxReviewHours: ['reviewPolicy', 'maxReviewHours'],
    blockMerge: ['reviewPolicy', 'blockMerge'],
    cycleValue: ['workflow', 'cycleValue'],
    cycleUnit: ['workflow', 'cycleUnit'],

    // 2. Selectors
    activeVersion: ['prRules', 'activeVersion'],
    activeStrategy: ['prRules', 'activeStrategy'],
    platform: ['workflow', 'platform'],

    // 3. MultiSelectors
    labelRules: ['prRules', 'labelRules'],
  },
  DOCKERFILE: {
    // 공통
    framework: ['framework'],
    version: ['version'],
    port: ['port'],

    // Node.js
    packageManager: ['packageManager'],
    command: ['command'],
  },
  CODE_FORMAT: {
    printWidth: ['printWidth'],
    useTabs: ['useTabs'],
    tabWidth: ['tabWidth'],
    semi: ['semi'],
    singleQuote: ['singleQuote'],
    jsxSingleQuote: ['jsxSingleQuote'],
    trailingComma: ['trailingComma'],
    bracketSpacing: ['bracketSpacing'],
    arrowParens: ['arrowParens'],
    singleAttributePerLine: ['singleAttributePerLine'],
  },
  NAMING_CONVENTION: {
    // Frontend
    'frontend.variable': ['frontend', 'variable'],
    'frontend.function': ['frontend', 'function'],
    'frontend.component': ['frontend', 'component'],
    'frontend.constant': ['frontend', 'constant'],

    // Backend
    'backend.variable': ['backend', 'variable'],
    'backend.function': ['backend', 'function'],
    'backend.class': ['backend', 'class'],
    'backend.constant': ['backend', 'constant'],

    // Database
    'database.table': ['database', 'table'],
    'database.column': ['database', 'column'],
    'database.index': ['database', 'index'],
    'database.constraint': ['database', 'constraint'],

    // Common
    'common.utility': ['common', 'utility'],
    'common.constant': ['common', 'constant'],
    'common.type': ['common', 'type'],
    'common.enum': ['common', 'enum'],
  },
};
