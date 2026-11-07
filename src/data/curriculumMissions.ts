import { SqlMission } from '../types/game';

export const CURRICULUM_MISSIONS: SqlMission[] = [
  // =========================================================================
  // THEME 1: 기초 튜토리얼 (Thema 1: Grundlagen-Tutorial)
  // Stage 1 ~ 5: SQL 기본 문법과 데이터베이스 조회의 핵심 개념 학습
  // =========================================================================

  // STAGE 01: SELECT / FROM
  {
    missionId: 1,
    chapterId: 1,
    stageOrder: 1,
    themeId: 1,
    themeStageOrder: 1,
    codeName: 'OP-01-SELECT',
    title: '시스템 부팅과 시민 명부 열람',
    sqlConcept: '1단계: SELECT / FROM',
    conceptBadge: 'SELECT · FROM',
    briefing:
      '신입 데이터 수사관 이즈리얼, 아이기스 수사국에 합류한 것을 환영합니다. 오늘 새벽 헬리오스 코어 연구소에서 대규모 데이터 유출 경보가 발생했습니다. 먼저 중앙 데이터베이스가 정상 작동하는지 확인하기 위해 시민 명부(`Citizens`) 테이블의 모든 데이터를 조회하세요.',
    objectiveSummary:
      'Citizens 테이블의 모든 컬럼과 모든 행(10명)을 조회하는 SELECT 쿼리를 작성하고 실행하세요.',
    targetTables: ['Citizens'],
    starterQuery: '-- Thema 1 - Stufe 1: Frage alle Daten aus der Tabelle Citizens ab.\nSELECT * FROM Citizens;',
    hints: [
      '모든 컬럼을 조회할 때는 별표(*) 기호를 사용합니다: SELECT *',
      '어느 테이블에서 가져올지 지정할 때는 FROM 테이블명 을 작성합니다.',
      '정답 예시: SELECT * FROM Citizens;',
    ],
    referenceQuery: 'SELECT * FROM Citizens;',
    rewardXp: 100,
    unlockedEvidenceCode: 'EV-001',
    successStoryDialogue: [
      {
        id: 'm1-win-1',
        speakerId: 'aria',
        speakerName: '아리 팀장',
        speakerRole: '수석 데이터 분석팀장',
        avatarType: 'aria',
        text: '좋아요! Citizens 테이블의 10명 명단이 정상적으로 출력되었군요. 잠깐, 3번 시민인 Dr. 하이머딩거(Dr. Heimerdinger)의 상태(status) 컬럼을 보세요... MISSING(실종)으로 바뀌어 있어요!',
        sqlTip: 'SELECT * FROM 테이블명 은 테이블의 전체 구조를 빠르게 파악할 때 가장 먼저 사용하는 기본 쿼리입니다.',
      },
    ],
    validate: (userResult) => {
      if (!userResult.success) {
        return { passed: false, feedback: '쿼리에 오류가 있습니다. 오류 진단 메시지를 확인해 수정해 보세요.' };
      }
      const q = userResult.query.toUpperCase();
      if (!q.includes('SELECT') || !q.includes('FROM') || !q.includes('CITIZENS')) {
        return {
          passed: false,
          feedback: 'SELECT 와 FROM 키워드를 사용하여 Citizens 테이블을 조회해야 합니다.',
        };
      }
      if (userResult.rows.length < 10 || userResult.columns.length < 3) {
        return {
          passed: false,
          feedback: 'Citizens 테이블의 전체 시민 명단(10명)과 주요 컬럼이 모두 표시되도록 조회해 보세요. (SELECT * FROM Citizens;)',
        };
      }
      return {
        passed: true,
        feedback: '완벽합니다! Citizens 테이블의 전체 시민 레코드 10건을 성공적으로 조회했습니다.',
      };
    },
  },

  // STAGE 02: WHERE
  {
    missionId: 2,
    chapterId: 1,
    stageOrder: 2,
    themeId: 1,
    themeStageOrder: 2,
    codeName: 'OP-02-WHERE',
    title: '실종된 아키텍트와 고위험 인물 추적',
    sqlConcept: '2단계: WHERE 조건절',
    conceptBadge: 'WHERE · 조건 필터링',
    briefing:
      'Dr. 하이머딩거는 헬리오스 양자서버실의 설계자입니다. 그가 실종된 시각, 보안 등급(clearance_level)이 4등급 이상인 내부자만 접근할 수 있는 구역에서 이상 신호가 잡혔습니다. 정확히 실종 상태(`status = \'MISSING\'`)인 시민 레코드를 `WHERE` 절로 찾아내세요.',
    objectiveSummary:
      "Citizens 테이블에서 WHERE 절을 사용하여 status 컬럼 값이 'MISSING'인 시민을 조회하세요.",
    targetTables: ['Citizens'],
    starterQuery:
      "-- Thema 1 - Stufe 2: Suche nach der vermissten Dr. Heimerdinger (status = 'MISSING').\nSELECT * FROM Citizens\nWHERE status = 'MISSING';",
    hints: [
      '특정 조건에 맞는 행만 골라낼 때는 FROM 절 뒤에 WHERE 조건식 을 작성합니다.',
      "문자열 값을 비교할 때는 작은따옴표(')를 사용합니다: WHERE status = 'MISSING'",
      "정답 예시: SELECT * FROM Citizens WHERE status = 'MISSING';",
    ],
    referenceQuery: "SELECT * FROM Citizens WHERE status = 'MISSING';",
    rewardXp: 150,
    unlockedEvidenceCode: 'EV-002',
    successStoryDialogue: [
      {
        id: 'm2-win-1',
        speakerId: 'kyle',
        speakerName: '제이스 감독관',
        speakerRole: '시스템 보안 감독관',
        avatarType: 'kyle',
        text: '확실하군. 고유번호 1003번, Dr. 하이머딩거(Dr. Heimerdinger). 보안 등급 5등급 아키텍트가 어젯밤 서버실 백업 직후 자취를 감췄어. 이제 그 시간대 보안 로그를 뒤져봐야겠어.',
        sqlTip: "WHERE 절에서는 =, !=, >, <, >=, <= 연산자와 AND, OR, IN, LIKE 등을 조합해 원하는 데이터만 정밀하게 추출할 수 있습니다.",
      },
    ],
    validate: (userResult) => {
      if (!userResult.success) {
        return { passed: false, feedback: '쿼리가 정상 실행되지 않았습니다.' };
      }
      const q = userResult.query.toUpperCase();
      if (!q.includes('WHERE')) {
        return { passed: false, feedback: '반드시 WHERE 절을 사용하여 조건을 지정해야 합니다.' };
      }
      const hasHeimerdinger = userResult.rows.some((r) =>
        r.some((cell) => String(cell).includes('하이머딩거') || String(cell).includes('Heimerdinger') || String(cell).includes('엘레나 송') || String(cell) === 'CTZ-003' || String(cell) === '1003')
      );
      if (userResult.rows.length !== 1 || !hasHeimerdinger) {
        return {
          passed: false,
          feedback: "조회 결과에 실종자(status = 'MISSING')인 Dr. 하이머딩거 1명만 정확히 출력되어야 합니다.",
        };
      }
      return {
        passed: true,
        feedback: "정확합니다! WHERE status = 'MISSING' 조건으로 실종된 수석 아키텍트 Dr. 하이머딩거의 레코드를 특정했습니다.",
      };
    },
  },

  // STAGE 03: ORDER BY / LIMIT
  {
    missionId: 3,
    chapterId: 1,
    stageOrder: 3,
    themeId: 1,
    themeStageOrder: 3,
    codeName: 'OP-03-ORDER',
    title: '심야의 침입자: 최상위 위협 로그 색출',
    sqlConcept: '3단계: ORDER BY / LIMIT',
    conceptBadge: 'ORDER BY · LIMIT',
    briefing:
      '보안 로그 테이블(`SecurityLogs`)에는 수많은 출입 기록이 쌓여 있습니다. 각 로그에는 인공지능 보안 감시망이 매긴 위협 점수(`threat_score`)가 기록되어 있습니다. 위협 점수(`threat_score`)가 가장 높은 순서(내림차순, `DESC`)로 정렬한 뒤, 상위 **3건**의 보안 로그만 추출하여 가장 위험했던 침입 시도를 찾아내세요!',
    objectiveSummary:
      'SecurityLogs 테이블을 threat_score 내림차순(DESC)으로 정렬하고 LIMIT 3을 사용해 상위 3건만 조회하세요.',
    targetTables: ['SecurityLogs'],
    starterQuery:
      '-- Thema 1 - Stufe 3: Zeige die Top-3 der gefährlichsten Sicherheits-Logs an.\nSELECT * FROM SecurityLogs\nORDER BY threat_score DESC\nLIMIT 3;',
    hints: [
      '데이터를 큰 값부터 작은 값 순서(내림차순)로 정렬할 때는 ORDER BY 컬럼명 DESC 를 사용합니다.',
      '출력할 행의 개수를 제한할 때는 쿼리 마지막에 LIMIT 개수 를 붙입니다.',
      '정답 예시: SELECT * FROM SecurityLogs ORDER BY threat_score DESC LIMIT 3;',
    ],
    referenceQuery: 'SELECT * FROM SecurityLogs ORDER BY threat_score DESC LIMIT 3;',
    rewardXp: 180,
    unlockedEvidenceCode: 'EV-003',
    successStoryDialogue: [
      {
        id: 'm3-win-1',
        speakerId: 'aria',
        speakerName: '아리 팀장',
        speakerRole: '수석 데이터 분석팀장',
        avatarType: 'aria',
        text: '상위 3건의 위협 로그를 보세요! log_id 9009번은 해커가 남긴 가짜 노이즈 로그이고, 9004번(citizen_id: 1008)과 9005번(citizen_id: 1004, CORE_TABLE_EXPORT)이 실제 범행 흔적이에요!',
        sqlTip: 'ORDER BY 컬럼 DESC LIMIT N 조합은 Top-N 랭킹이나 가장 위험한 이벤트를 즉시 찾아낼 때 실무에서도 매일 쓰입니다.',
      },
    ],
    validate: (userResult) => {
      if (!userResult.success) {
        return { passed: false, feedback: '쿼리 실행에 실패했습니다.' };
      }
      const q = userResult.query.toUpperCase();
      if (!q.includes('ORDER BY') || !q.includes('LIMIT')) {
        return {
          passed: false,
          feedback: 'ORDER BY 절과 LIMIT 절을 모두 사용하여 상위 3건을 추출해야 합니다.',
        };
      }
      if (userResult.rows.length !== 3) {
        return {
          passed: false,
          feedback: `현재 결과 행 수가 ${userResult.rows.length}건입니다. LIMIT 3을 사용하여 정확히 3건만 출력하세요.`,
        };
      }
      const firstRowStr = userResult.rows[0].map(String);
      if (!firstRowStr.includes('99') && !firstRowStr.includes('9009')) {
        return {
          passed: false,
          feedback: 'threat_score가 가장 높은 행(99점, log_id 9009)이 첫 번째로 오도록 내림차순(DESC) 정렬했는지 확인하세요.',
        };
      }
      return {
        passed: true,
        feedback: '훌륭합니다! 위협 점수 상위 3건(99점, 96점, 94점)의 핵심 보안 로그를 정확히 색출했습니다.',
      };
    },
  },

  // STAGE 04: UPDATE
  {
    missionId: 4,
    chapterId: 2,
    stageOrder: 4,
    themeId: 1,
    themeStageOrder: 4,
    codeName: 'OP-04-DML',
    title: '오염된 보안 기록 정정 및 용의자 상태 갱신',
    sqlConcept: '4단계: UPDATE',
    conceptBadge: 'UPDATE · 상태 갱신',
    briefing:
      '방금 발견한 `SecurityLogs`의 9005번 로그(`CORE_TABLE_EXPORT`)를 일으킨 인물은 `citizen_id = 1004` (진, 코어 시스템 엔지니어)입니다! `Citizens` 테이블에서 진(`citizen_id = 1004`)의 상태(`status`)를 `UPDATE` 문을 사용해 `\'SUSPECT\'`(용의자)로 변경하세요!',
    objectiveSummary:
      "UPDATE 문을 사용하여 Citizens 테이블에서 citizen_id = 1004 인 행의 status 값을 'SUSPECT'로 수정하세요.",
    targetTables: ['Citizens', 'SecurityLogs'],
    starterQuery:
      "-- Thema 1 - Stufe 4: Setze den Status von Jhin (ID 1004) auf SUSPECT.\nUPDATE Citizens\nSET status = 'SUSPECT'\nWHERE citizen_id = 1004;",
    hints: [
      '기존 데이터를 수정할 때는 UPDATE 테이블명 SET 컬럼 = 값 WHERE 조건; 문법을 사용합니다.',
      'WHERE 절을 생략하면 모든 시민의 상태가 바뀌어버리니 반드시 WHERE citizen_id = 1004 를 지정하세요!',
      "정답 예시: UPDATE Citizens SET status = 'SUSPECT' WHERE citizen_id = 1004;",
    ],
    referenceQuery: "UPDATE Citizens SET status = 'SUSPECT' WHERE citizen_id = 1004;",
    rewardXp: 220,
    successStoryDialogue: [
      {
        id: 'm4-win-1',
        speakerId: 'kyle',
        speakerName: '제이스 감독관',
        speakerRole: '시스템 보안 감독관',
        avatarType: 'kyle',
        text: '진(citizen_id: 1004)을 공식 용의자(SUSPECT)로 전환 완료했군! 이제 진이 데이터를 빼돌린 대가로 뒷돈을 얼마나 챙겼는지 금융 거래(`Transactions`)를 추적하자.',
        sqlTip: 'UPDATE와 DELETE를 실행할 때는 항상 WHERE 조건절이 정확한지 먼저 확인하는 습관이 필수적입니다.',
      },
    ],
    validate: (userResult, runCheckQuery) => {
      if (!userResult.success) {
        return { passed: false, feedback: '쿼리 실행 중 오류가 발생했습니다.' };
      }
      const check = runCheckQuery('SELECT status FROM Citizens WHERE citizen_id = 1004;');
      const currentStatus =
        check.success && check.rows.length > 0 ? String(check.rows[0][0]).toUpperCase() : '';
      if (currentStatus !== 'SUSPECT') {
        return {
          passed: false,
          feedback: `현재 citizen_id = 1004(진)의 status 값은 '${currentStatus}'입니다. UPDATE 문을 실행해 'SUSPECT'로 변경하세요.`,
        };
      }
      return {
        passed: true,
        feedback: "성공적으로 데이터베이스를 조작했습니다! 진(citizen_id: 1004)의 상태가 'SUSPECT'로 갱신되었습니다.",
      };
    },
  },

  // STAGE 05: GROUP BY / 집계 함수
  {
    missionId: 5,
    chapterId: 2,
    stageOrder: 5,
    themeId: 1,
    themeStageOrder: 5,
    codeName: 'OP-05-GROUP',
    title: '검은 자금의 흐름: 송금자별 거래 집계',
    sqlConcept: '5단계: GROUP BY / 집계 함수',
    conceptBadge: 'GROUP BY · 집계 함수',
    briefing:
      '금융 거래 테이블(`Transactions`)에는 수상한 자금 이체 내역들이 있습니다. 누가 얼마나 많은 돈을 보냈는지 파악하기 위해, 송금자 ID(`sender_id`)별로 그룹화(`GROUP BY`)하여 **거래 건수(`COUNT(*)`)**와 **총 송금액(`SUM(amount)`)**을 조회하세요.',
    objectiveSummary:
      'Transactions 테이블에서 sender_id 별로 GROUP BY 하여 sender_id, 거래 건수(COUNT), 총 송금액(SUM(amount))을 조회하세요.',
    targetTables: ['Transactions'],
    starterQuery:
      '-- Thema 1 - Stufe 5: Berechne Anzahl und Gesamtsumme der Überweisungen pro Absender.\nSELECT sender_id, COUNT(*) AS tx_count, SUM(amount) AS total_sent\nFROM Transactions\nGROUP BY sender_id;',
    hints: [
      '특정 컬럼을 기준으로 묶어서 통계를 낼 때는 GROUP BY 컬럼명 을 사용합니다.',
      '건수는 COUNT(*), 합계는 SUM(amount) 집계 함수를 SELECT 절에 넣습니다.',
      '정답 예시: SELECT sender_id, COUNT(*) AS tx_count, SUM(amount) AS total_sent FROM Transactions GROUP BY sender_id;',
    ],
    referenceQuery:
      'SELECT sender_id, COUNT(*) AS tx_count, SUM(amount) AS total_sent FROM Transactions GROUP BY sender_id;',
    rewardXp: 250,
    unlockedEvidenceCode: 'EV-004',
    successStoryDialogue: [
      {
        id: 'm5-win-1',
        speakerId: 'aria',
        speakerName: '아리 팀장',
        speakerRole: '수석 데이터 분석팀장',
        avatarType: 'aria',
        text: '기초 튜토리얼을 훌륭하게 완수하셨습니다! sender_id 1004번(진)이 총 3건, 162,000 크레딧을 외부로 빼돌렸군요. 이제 테마 2에서 배운 지식을 스스로 응용하여 본격적인 실전 수사에 나설 차례입니다!',
        sqlTip: 'GROUP BY와 집계 함수(COUNT, SUM, AVG)를 결합하면 방대한 거래 기록도 단 몇 줄의 요약 통계표로 압축할 수 있습니다.',
      },
    ],
    validate: (userResult) => {
      if (!userResult.success) {
        return { passed: false, feedback: '쿼리 실행에 실패했습니다.' };
      }
      const q = userResult.query.toUpperCase();
      if (!q.includes('GROUP BY') || !q.includes('SUM')) {
        return {
          passed: false,
          feedback: 'GROUP BY 절과 SUM(amount) 집계 함수를 반드시 포함하여 송금자별 총 송금액을 계산하세요.',
        };
      }
      const has162000 = userResult.rows.some((r) => r.some((cell) => Number(cell) === 162000));
      if (!has162000) {
        return {
          passed: false,
          feedback: 'sender_id별 SUM(amount) 결과에 1004번 송금자의 총액(162000)이 포함되어야 합니다.',
        };
      }
      return {
        passed: true,
        feedback: '정확한 집계입니다! 송금자 1004번(진)이 총 3건, 162,000 크레딧의 비정상 자금을 송금한 사실을 입증했습니다.',
      };
    },
  },

  // =========================================================================
  // THEME 2: 실전 응용 수사 (Thema 2: Angewandte Ermittlung)
  // Stage 1 ~ 5 (전체 6 ~ 10): 1단계에서 배운 기초를 스스로 조합 및 응용하는 단계
  // =========================================================================

  // STAGE 06 (THEME 2 - 1단계): WHERE (AND 복합 조건 응용)
  {
    missionId: 6,
    chapterId: 2,
    stageOrder: 6,
    themeId: 2,
    themeStageOrder: 1,
    codeName: 'OP-06-APP-WHERE',
    title: '고위험 내부 인가자 추적',
    sqlConcept: '응용 1단계: WHERE 다중 조건 (AND)',
    conceptBadge: 'WHERE · 복합 조건',
    briefing:
      '기초 튜토리얼을 마친 이즈리얼 수사관, 이제 실전 응용 수사입니다! 헬리오스 서버실 사건 당시 출입 인가권을 가진 인물 중, 높은 보안 등급(`clearance_level >= 4`)을 가졌으면서 현재 활동 중(`status = \'ACTIVE\'`)인 고위험 시민들을 모두 추려내세요. 단일 조건이 아닌 `AND` 연산자를 응용해 두 조건을 동시에 만족하는 대상자들을 추출하세요.',
    objectiveSummary:
      "Citizens 테이블에서 clearance_level이 4 이상이고 status가 'ACTIVE'인 시민들을 WHERE ... AND ... 조건으로 조회하세요.",
    targetTables: ['Citizens'],
    starterQuery:
      "-- Thema 2 - Stufe 1: Finde aktive Insider mit Sicherheitsfreigabe >= 4.\nSELECT * FROM Citizens\nWHERE clearance_level >= 4 AND status = 'ACTIVE';",
    hints: [
      '여러 조건을 동시에 만족해야 할 때는 WHERE 조건1 AND 조건2 문법을 사용합니다.',
      "숫자 비교는 clearance_level >= 4, 문자열 비교는 status = 'ACTIVE' 로 작성합니다.",
      "정답 예시: SELECT * FROM Citizens WHERE clearance_level >= 4 AND status = 'ACTIVE';",
    ],
    referenceQuery: "SELECT * FROM Citizens WHERE clearance_level >= 4 AND status = 'ACTIVE';",
    rewardXp: 280,
    unlockedEvidenceCode: 'EV-005',
    successStoryDialogue: [
      {
        id: 'm6-win-1',
        speakerId: 'aria',
        speakerName: '아리 팀장',
        speakerRole: '수석 데이터 분석팀장',
        avatarType: 'aria',
        text: '완벽한 조건 조합입니다! 보안 등급 4 이상이면서 ACTIVE 상태인 인물들이 정밀하게 추출되었어요. 제이스 감독관과 세라핀 감사관, 그리고 진이 명단에 있군요. 이들의 금융 거래를 교차 확인해야 합니다.',
        sqlTip: '실무에서는 여러 보안 조건을 AND 또는 OR로 결합해 정밀한 표적 집단을 신속하게 추출합니다.',
      },
    ],
    validate: (userResult) => {
      if (!userResult.success) {
        return { passed: false, feedback: '쿼리 실행에 실패했습니다.' };
      }
      const q = userResult.query.toUpperCase();
      if (!q.includes('WHERE') || !q.includes('AND')) {
        return {
          passed: false,
          feedback: 'WHERE 절과 AND 키워드를 함께 사용하여 두 조건을 모두 만족하도록 조회하세요.',
        };
      }
      if (userResult.rows.length < 3) {
        return {
          passed: false,
          feedback: "clearance_level >= 4 AND status = 'ACTIVE' 조건을 만족하는 시민들이 모두 출력되었는지 확인하세요.",
        };
      }
      return {
        passed: true,
        feedback: '성공! WHERE와 AND를 조합하여 고위험 내부 인가자들을 정확히 선별했습니다.',
      };
    },
  },

  // STAGE 07 (THEME 2 - 2단계): WHERE + ORDER BY + LIMIT 복합 응용
  {
    missionId: 7,
    chapterId: 2,
    stageOrder: 7,
    themeId: 2,
    themeStageOrder: 2,
    codeName: 'OP-07-APP-ORDER',
    title: '거액 비자금 흐름 포착',
    sqlConcept: '응용 2단계: WHERE + ORDER BY + LIMIT',
    conceptBadge: '조건 필터 · 정렬 · 제한',
    briefing:
      '신디케이트와의 자금 거래 중 50,000 크레딧 이상의 비정상 거액 거래(`amount >= 50000`)들이 포착되었습니다. 이 중에서 가장 큰 금액 순서(내림차순, `DESC`)로 상위 **3건**의 거래 내역을 추출하여 주범들의 자금 흐름 규모를 파악하세요.',
    objectiveSummary:
      'Transactions 테이블에서 amount >= 50000 인 거래를 amount 기준 내림차순(DESC)으로 정렬하고 상위 3건(LIMIT 3)만 조회하세요.',
    targetTables: ['Transactions'],
    starterQuery:
      '-- Thema 2 - Stufe 2: Finde die 3 höchsten Transaktionen über 50.000 Credits.\nSELECT * FROM Transactions\nWHERE amount >= 50000\nORDER BY amount DESC\nLIMIT 3;',
    hints: [
      'WHERE 절로 50,000 이상의 거래를 먼저 거릅니다: WHERE amount >= 50000',
      '그 후 ORDER BY amount DESC 로 큰 금액부터 정렬하고, 마지막에 LIMIT 3 을 붙입니다.',
      '정답 예시: SELECT * FROM Transactions WHERE amount >= 50000 ORDER BY amount DESC LIMIT 3;',
    ],
    referenceQuery:
      'SELECT * FROM Transactions WHERE amount >= 50000 ORDER BY amount DESC LIMIT 3;',
    rewardXp: 300,
    unlockedEvidenceCode: 'EV-006',
    successStoryDialogue: [
      {
        id: 'm7-win-1',
        speakerId: 'kyle',
        speakerName: '제이스 감독관',
        speakerRole: '시스템 보안 감독관',
        avatarType: 'kyle',
        text: '거래 내역 상위 3건을 봐! 80,000 크레딧, 65,000 크레딧, 52,000 크레딧... 엄청난 액수의 자금이 한곳으로 흘러들어가고 있어. 이 돈을 받아 챙긴 수신자가 누구인지 집계해야 한다.',
        sqlTip: 'WHERE 조건으로 노이즈 데이터를 먼저 제거한 뒤 ORDER BY와 LIMIT을 적용하면 질의 성능과 결과 정확도가 대폭 향상됩니다.',
      },
    ],
    validate: (userResult) => {
      if (!userResult.success) {
        return { passed: false, feedback: '쿼리 실행에 실패했습니다.' };
      }
      const q = userResult.query.toUpperCase();
      if (!q.includes('WHERE') || !q.includes('ORDER BY') || !q.includes('LIMIT')) {
        return {
          passed: false,
          feedback: 'WHERE(조건), ORDER BY(정렬), LIMIT(개수 제한) 구문을 모두 응용하여 작성해야 합니다.',
        };
      }
      if (userResult.rows.length !== 3) {
        return {
          passed: false,
          feedback: '상위 3건만 추출해야 합니다. LIMIT 3을 사용했는지 확인하세요.',
        };
      }
      const firstRowStr = userResult.rows[0].map(String);
      if (!firstRowStr.includes('80000')) {
        return {
          passed: false,
          feedback: '가장 큰 거래 금액인 80,000 크레딧이 맨 첫 번째 행에 오도록 내림차순(DESC) 정렬하세요.',
        };
      }
      return {
        passed: true,
        feedback: '훌륭합니다! 50,000 이상 거래 중 가장 큰 상위 3건의 핵심 자금 세탁 기록을 포착했습니다.',
      };
    },
  },

  // STAGE 08 (THEME 2 - 3단계): 수신자별 GROUP BY & 집계 함수 응용
  {
    missionId: 8,
    chapterId: 3,
    stageOrder: 8,
    themeId: 2,
    themeStageOrder: 3,
    codeName: 'OP-08-APP-GROUP',
    title: '검은 자금의 수신 거점 분석',
    sqlConcept: '응용 3단계: GROUP BY 수신자 집계',
    conceptBadge: 'GROUP BY · 수신 집계',
    briefing:
      '튜토리얼에서는 돈을 보낸 사람(sender_id)을 집계했습니다. 이제 실제로 불법 자금이 누구에게 모여들었는지 밝혀야 합니다. 거래 테이블(`Transactions`)에서 **수신인 ID(`receiver_id`)**별로 묶어, 각 수신인이 받은 **거래 건수(`COUNT(*)`)**와 **총 수신 금액(`SUM(amount)`)**을 계산하세요.',
    objectiveSummary:
      'Transactions 테이블에서 receiver_id 별로 GROUP BY 하여 receiver_id, 거래 건수(COUNT), 총 수신액(SUM(amount))을 조회하세요.',
    targetTables: ['Transactions'],
    starterQuery:
      '-- Thema 2 - Stufe 3: Zähle Transaktionen und Gesamtsumme pro Empfängerkonto.\nSELECT receiver_id, COUNT(*) AS tx_count, SUM(amount) AS total_received\nFROM Transactions\nGROUP BY receiver_id;',
    hints: [
      'sender_id 대신 receiver_id 컬럼을 기준으로 GROUP BY 절을 작성합니다.',
      'SELECT 절에는 receiver_id, COUNT(*), SUM(amount) 를 명시합니다.',
      '정답 예시: SELECT receiver_id, COUNT(*) AS tx_count, SUM(amount) AS total_received FROM Transactions GROUP BY receiver_id;',
    ],
    referenceQuery:
      'SELECT receiver_id, COUNT(*) AS tx_count, SUM(amount) AS total_received FROM Transactions GROUP BY receiver_id;',
    rewardXp: 330,
    unlockedEvidenceCode: 'EV-007',
    successStoryDialogue: [
      {
        id: 'm8-win-1',
        speakerId: 'aria',
        speakerName: '아리 팀장',
        speakerRole: '수석 데이터 분석팀장',
        avatarType: 'aria',
        text: '수신 집계표가 명백한 증거를 보여줍니다! receiver_id 1008번이 총 145,000 크레딧을 받아 챙겼어요. 이 인물은 널 시퀀스의 전문 해커 제드입니다! 당장 계좌를 동결해야 해요.',
        sqlTip: '거래 데이터에서 송신자와 수신자 양방향을 모두 GROUP BY로 분석하면 자금의 발원지와 종착지를 완벽히 추적할 수 있습니다.',
      },
    ],
    validate: (userResult) => {
      if (!userResult.success) {
        return { passed: false, feedback: '쿼리 실행에 실패했습니다.' };
      }
      const q = userResult.query.toUpperCase();
      if (!q.includes('GROUP BY') || !q.includes('RECEIVER_ID')) {
        return {
          passed: false,
          feedback: 'GROUP BY 절에 receiver_id 컬럼을 지정하여 수신인별로 그룹화하세요.',
        };
      }
      const has145000 = userResult.rows.some((r) => r.some((cell) => Number(cell) === 145000));
      if (!has145000) {
        return {
          passed: false,
          feedback: '수신자 1008번의 총 수신액(145,000)이 집계 결과에 포함되어야 합니다.',
        };
      }
      return {
        passed: true,
        feedback: '정확한 수신 통계 분석입니다! 1008번 제드가 145,000 크레딧을 챙긴 수신 거점임을 확인했습니다.',
      };
    },
  },

  // STAGE 09 (THEME 2 - 4단계): 조건부 UPDATE 응용 (자산 동결)
  {
    missionId: 9,
    chapterId: 3,
    stageOrder: 9,
    themeId: 2,
    themeStageOrder: 4,
    codeName: 'OP-09-APP-UPDATE',
    title: '핵심 용의자 계좌 및 자산 긴급 동결',
    sqlConcept: '응용 4단계: 조건부 UPDATE',
    conceptBadge: 'UPDATE · 자산 동결',
    briefing:
      '수신 자금 집계 결과, 고스트 프로토콜 해커 제드(`citizen_id = 1008`)에게 145,000 크레딧의 거액이 집중 수신된 것이 확인되었습니다. 추가적인 데이터 탈취와 자금 세탁을 막기 위해, `UPDATE` 문을 실행하여 `citizen_id = 1008`인 시민의 `status`를 `\'FROZEN\'`(자산 동결)으로 즉각 변경하세요!',
    objectiveSummary:
      "UPDATE 문을 사용하여 Citizens 테이블에서 citizen_id = 1008 인 행의 status 값을 'FROZEN'으로 수정하세요.",
    targetTables: ['Citizens'],
    starterQuery:
      "-- Thema 2 - Stufe 4: Friere das Konto des Hauptverdächtigen Zed ein.\nUPDATE Citizens\nSET status = 'FROZEN'\nWHERE citizen_id = 1008;",
    hints: [
      'UPDATE Citizens SET status = ... WHERE citizen_id = 1008; 구조를 사용합니다.',
      "지정할 상태 값은 작은따옴표로 감싼 'FROZEN' 입니다.",
      "정답 예시: UPDATE Citizens SET status = 'FROZEN' WHERE citizen_id = 1008;",
    ],
    referenceQuery: "UPDATE Citizens SET status = 'FROZEN' WHERE citizen_id = 1008;",
    rewardXp: 350,
    unlockedEvidenceCode: 'EV-008',
    successStoryDialogue: [
      {
        id: 'm9-win-1',
        speakerId: 'kyle',
        speakerName: '제이스 감독관',
        speakerRole: '시스템 보안 감독관',
        avatarType: 'kyle',
        text: '제드(1008)의 모든 계좌와 네트워크 접근 권한이 성공적으로 FROZEN(동결)되었다! 이제 외부와의 통신이 모두 차단됐다. 마지막으로 사건에 연루된 시민들과 조직들의 관계를 교차 검증하자.',
        sqlTip: '사이버 보안 실무에서 조건부 UPDATE는 침해 계정을 즉시 격리하거나 비밀번호를 강제 만료시키는 긴급 방어 조치로 활용됩니다.',
      },
    ],
    validate: (userResult, runCheckQuery) => {
      if (!userResult.success) {
        return { passed: false, feedback: '쿼리 실행 중 오류가 발생했습니다.' };
      }
      const check = runCheckQuery('SELECT status FROM Citizens WHERE citizen_id = 1008;');
      const currentStatus =
        check.success && check.rows.length > 0 ? String(check.rows[0][0]).toUpperCase() : '';
      if (currentStatus !== 'FROZEN') {
        return {
          passed: false,
          feedback: `현재 citizen_id = 1008(제드)의 status 값은 '${currentStatus}'입니다. UPDATE 문을 실행해 'FROZEN'으로 변경하세요.`,
        };
      }
      return {
        passed: true,
        feedback: "용의자 자산 동결 성공! 제드(citizen_id: 1008)의 상태가 'FROZEN'으로 안전하게 잠겼습니다.",
      };
    },
  },

  // STAGE 10 (THEME 2 - 5단계): INNER JOIN 교차 검증 응용
  {
    missionId: 10,
    chapterId: 3,
    stageOrder: 10,
    themeId: 2,
    themeStageOrder: 5,
    codeName: 'OP-10-APP-JOIN',
    title: '시민과 소속 기관 교차 검증',
    sqlConcept: '응용 5단계: INNER JOIN 교차 검증',
    conceptBadge: 'INNER JOIN · 기관 대조',
    briefing:
      '동결 조치 이후, 이즈리얼 수사관은 시민들의 소속 기관 배후를 전면 파악하고자 합니다. `Citizens` 테이블과 `Organizations` 테이블을 `org_id` 외래키로 결합(`JOIN`)하여, 각 시민의 **이름(`Citizens.name`)**, **역할(`Citizens.role`)**, **소속 기관명(`Organizations.name`)**을 한눈에 결합 조회하여 사건의 전모를 밝혀내세요!',
    objectiveSummary:
      'Citizens와 Organizations 테이블을 org_id 기준으로 JOIN하여 시민 이름(Citizens.name), 역할(Citizens.role), 소속 기관명(Organizations.name)을 조회하세요.',
    targetTables: ['Citizens', 'Organizations'],
    starterQuery:
      '-- Thema 2 - Stufe 5: Verknüpfe Bürgerdaten mit Organisationen über JOIN.\nSELECT Citizens.name, Citizens.role, Organizations.name AS org_name\nFROM Citizens\nJOIN Organizations ON Citizens.org_id = Organizations.org_id;',
    hints: [
      '두 테이블의 공통 연결 키는 org_id 입니다: ON Citizens.org_id = Organizations.org_id',
      'SELECT 절에 Citizens.name, Citizens.role, Organizations.name 을 명시합니다.',
      '정답 예시: SELECT Citizens.name, Citizens.role, Organizations.name AS org_name FROM Citizens JOIN Organizations ON Citizens.org_id = Organizations.org_id;',
    ],
    referenceQuery:
      'SELECT Citizens.name, Citizens.role, Organizations.name AS org_name FROM Citizens JOIN Organizations ON Citizens.org_id = Organizations.org_id;',
    rewardXp: 400,
    unlockedEvidenceCode: 'EV-009',
    successStoryDialogue: [
      {
        id: 'm10-win-1',
        speakerId: 'aria',
        speakerName: '아리 팀장',
        speakerRole: '수석 데이터 분석팀장',
        avatarType: 'aria',
        text: '사건 전모가 완전히 밝혀졌습니다! 헬리오스 연구소의 진과 널 시퀀스의 제드가 결탁한 전모를 이즈리얼 수사관님이 SQL만으로 완벽하게 규명하셨어요. 축하합니다! 테마 1 기초부터 테마 2 실전 응용까지 모든 수사를 성공적으로 완수하셨습니다!',
        sqlTip: '축하합니다! 1단계 기초 튜토리얼부터 2단계 실전 응용 수사까지, 관계형 데이터베이스의 핵심 SQL 기술을 완벽하게 마스터하셨습니다.',
      },
    ],
    validate: (userResult) => {
      if (!userResult.success) {
        return { passed: false, feedback: '쿼리 실행에 실패했습니다.' };
      }
      const q = userResult.query.toUpperCase();
      if (!q.includes('JOIN') || !q.includes('ORGANIZATIONS')) {
        return {
          passed: false,
          feedback: 'Citizens 테이블과 Organizations 테이블을 JOIN 키워드로 연결해야 합니다.',
        };
      }
      if (userResult.rows.length < 5 || userResult.columns.length < 3) {
        return {
          passed: false,
          feedback: '시민 이름(name), 역할(role), 소속 기관명(org_name)이 모두 결합되어 출력되도록 조회하세요.',
        };
      }
      return {
        passed: true,
        feedback: '축하합니다! Citizens와 Organizations를 JOIN하여 10개 단계의 전 수사 과정을 성공적으로 완수했습니다!',
      };
    },
  },
];
