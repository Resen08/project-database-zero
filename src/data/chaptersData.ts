import { ChapterData } from '../types/game';

export const CHAPTERS_DATA: ChapterData[] = [
  {
    chapterId: 1,
    code: 'CHAPTER 01',
    title: '침묵하는 양자 코어 (The Silent Quantum Core)',
    subtitle: 'SELECT · WHERE · ORDER BY / LIMIT 기초 수사',
    synopsis:
      '2086년 네오-아카이브 시티. 도시의 모든 기억과 금융을 관리하는 헬리오스 제1양자서버실에서 심야 데이터 유출 경보가 울리고, 수석 DB 아키텍트 엘레나 송 박사가 실종된다. 신입 분석관 이안 조는 가장 기본적인 SQL 조회 명령으로 실종자의 흔적과 심야의 침입 로그를 추적한다.',
    locationSector: 'SEC-01 아이기스 중앙 분석실 & SEC-02 양자서버실',
    missionIds: [1, 2, 3],
    introDialogues: [
      {
        id: 'ch1-d1',
        speakerId: 'aria',
        speakerName: '아리아 첸 팀장',
        speakerRole: '수석 데이터 분석팀장 (Aegis Bureau)',
        avatarType: 'aria',
        text: '이안 수사관, 첫 출근날부터 비상사태야. 오늘 새벽 00시경 헬리오스 제1양자서버실(SEC-02)에서 코어 테이블이 외부로 반출됐고, 수석 아키텍트 엘레나 송 박사와 연락이 두절됐어.',
        sqlTip: '우측 스키마 브라우저에서 7개 핵심 테이블(Citizens, Locations, Organizations, Transactions, SecurityLogs, Missions, Evidence)을 언제든 클릭해 구조를 확인할 수 있습니다.',
      },
      {
        id: 'ch1-d2',
        speakerId: 'kyle',
        speakerName: '카일 반스 감독관',
        speakerRole: '시스템 보안 감독관',
        avatarType: 'kyle',
        text: '현장 단말기에서 회수한 SQLite 스냅샷을 네 콘솔에 마운트해 두었다. 먼저 시민 명부(Citizens)를 열람해서 실종자를 확인하고, 보안 로그(SecurityLogs)에서 가장 위협 점수가 높은 침입 기록을 찾아내!',
      },
    ],
    objects: [
      {
        id: 'obj-ch1-terminal',
        name: '엘레나 박사의 개인 보안 단말기',
        locationName: 'SEC-02 헬리오스 제1양자서버실',
        icon: 'terminal',
        shortDesc: '실종 직전 마지막 백업 명령이 실행된 콘솔',
        inspectionReport:
          '단말기 화면에 미처 닫히지 않은 메모가 남아 있다: "누군가 내부 관리자 권한으로 코어 테이블을 복사하고 있다. 내 신변에 문제가 생기면 Citizens 테이블의 status 컬럼과 SecurityLogs의 threat_score를 확인하라."',
        relatedTable: 'Citizens',
        suggestedQuery: "SELECT citizen_id, name, role, status FROM Citizens WHERE status = 'MISSING';",
        unlocksClueText: '단서 획득: 엘레나 송 박사(citizen_id: 1003)의 상태는 MISSING이며, 내부자 소행일 가능성이 높음.',
      },
      {
        id: 'obj-ch1-cctv',
        name: '양자서버실 출입 게이트 로그 기록기',
        locationName: 'SEC-02 게이트웨이',
        icon: 'cctv',
        shortDesc: '출입자의 위협 점수(threat_score)를 자동 산출하는 AI 센서',
        inspectionReport:
          '센서 로그 분석 결과: 정상적인 순찰이나 로그인은 위협 점수(threat_score)가 5~15점 수준이지만, 권한 상승이나 방화벽 우회 시도는 85점 이상의 고위험 점수로 기록된다.',
        relatedTable: 'SecurityLogs',
        suggestedQuery: 'SELECT * FROM SecurityLogs ORDER BY threat_score DESC LIMIT 3;',
        unlocksClueText: '단서 획득: 위협 점수 상위 3건의 로그에 실제 침입자와 해커가 남긴 교란용 로그가 섞여 있음.',
      },
    ],
  },
  {
    chapterId: 2,
    code: 'CHAPTER 02',
    title: '오염된 원장과 내부의 그림자 (Corrupted Ledger)',
    subtitle: 'INSERT / UPDATE / DELETE · GROUP BY · JOIN 심화 수사',
    synopsis:
      '양자서버실에서 코어 테이블을 반출한 내부자가 헬리오스 연구소의 엔지니어 마커스 진(citizen_id: 1004)임이 드러났다. 용의자의 신분을 데이터베이스에 즉시 갱신(UPDATE)하고, 그룹 집계(GROUP BY)와 테이블 결합(JOIN)을 통해 검은 자금의 규모와 공범의 실명을 밝혀내라.',
    locationSector: 'SEC-03 넥서스 스카이 볼트 & SEC-04 네온 마켓 환전소',
    missionIds: [4, 5, 6, 7],
    introDialogues: [
      {
        id: 'ch2-d1',
        speakerId: 'kyle',
        speakerName: '카일 반스 감독관',
        speakerRole: '시스템 보안 감독관',
        avatarType: 'kyle',
        text: '9005번 로그(CORE_TABLE_EXPORT)를 실행한 citizen_id 1004번이 누군지 확인했나? 바로 헬리오스 연구소의 코어 시스템 엔지니어 마커스 진(Marcus Jin)이다! 즉시 Citizens 테이블에서 그의 상태를 SUSPECT(용의자)로 UPDATE 해!',
      },
      {
        id: 'ch2-d2',
        speakerId: 'aria',
        speakerName: '아리아 첸 팀장',
        speakerRole: '수석 데이터 분석팀장',
        avatarType: 'aria',
        text: '용의자 등록을 마친 뒤에는 금융 거래 테이블(Transactions)을 송금자별로 GROUP BY 집계해서 마커스 진이 외부로 빼돌린 자금 총액을 계산하고, JOIN으로 공범들의 실명을 모두 연결해 주세요.',
        sqlTip: '4단계에서는 UPDATE 문을, 5단계에서는 GROUP BY와 SUM()을, 6단계에서는 JOIN ... ON 구문을 실전 데이터에 적용합니다.',
      },
    ],
    objects: [
      {
        id: 'obj-ch2-vault',
        name: '네온 마켓 익명 환전 키오스크',
        locationName: 'SEC-04 로우 시티 환전소',
        icon: 'vault',
        shortDesc: '다크풀 암호화폐 이체가 이루어진 중계 단말기',
        inspectionReport:
          '환전소 캐시 메모리에서 송금자 ID(sender_id) 1004번이 보낸 다수의 암호화 송금(ENCRYPTED_TRANSFER, KEY_PURCHASE, DATA_ESCROW) 패킷이 발견되었다.',
        relatedTable: 'Transactions',
        suggestedQuery:
          'SELECT sender_id, COUNT(*) AS tx_count, SUM(amount) AS total_amount FROM Transactions GROUP BY sender_id;',
        unlocksClueText: '단서 획득: 마커스 진(1004)은 총 3차례에 걸쳐 162,000 크레딧을 지하 조직 브로커와 해커에게 송금함.',
      },
      {
        id: 'obj-ch2-server',
        name: '보안 로그-시민 신원 교차 분석기',
        locationName: 'SEC-01 아이기스 중앙 분석실',
        icon: 'server',
        shortDesc: '외래키(citizen_id)를 기준으로 실명을 매핑하는 분석 모듈',
        inspectionReport:
          'SecurityLogs 테이블의 citizen_id와 Citizens 테이블의 citizen_id를 JOIN하면 각 보안 이벤트를 일으킨 인물의 실명과 직책을 한눈에 대조할 수 있다.',
        relatedTable: 'SecurityLogs',
        suggestedQuery:
          'SELECT c.name, c.role, s.action_type, s.threat_score FROM SecurityLogs s JOIN Citizens c ON s.citizen_id = c.citizen_id;',
        unlocksClueText: '단서 획득: 내부자 마커스 진과 외부 해커 단테 제로(Dante Zero)의 역할 분담 확인.',
      },
    ],
  },
  {
    chapterId: 3,
    code: 'CHAPTER 03',
    title: '제로 프로토콜의 심장 (Heart of Protocol Zero)',
    subtitle: 'PK / FK 무결성 · SUBQUERY · 데이터베이스 설계 마스터',
    synopsis:
      '내부자 마커스 진의 배후에는 지하 해커 조직 "널 시퀀스 신디케이트(Null Sequence)"가 있었다. 기본키/외래키(PK/FK) 관계망과 중첩 서브쿼리(Subquery)로 범죄 자금의 은신처를 역추적해 엘레나 송 박사를 구출하고, 조작 불가능한 감사 추적 테이블(AuditTrail)을 직접 설계하여 사건을 종결하라.',
    locationSector: 'SEC-05 구 지하철 제9폐쇄역 & 아이기스 대법정',
    missionIds: [8, 9, 10],
    introDialogues: [
      {
        id: 'ch3-d1',
        speakerId: 'zero',
        speakerName: '단테 제로 (감청된 통신)',
        speakerRole: '고스트 프로토콜 해커 (Null Sequence)',
        avatarType: 'zero',
        text: '"흥, 아이기스 신입 분석관이 여기까지 꼬리를 밟았군. 하지만 우린 Organizations, Locations, Transactions에 걸쳐 데이터를 분산해 두었지. 과연 서브쿼리와 참조 무결성까지 뚫고 제9폐쇄역의 은신처를 찾을 수 있을까?"',
      },
      {
        id: 'ch3-d2',
        speakerId: 'aria',
        speakerName: '아리아 첸 팀장',
        speakerRole: '수석 데이터 분석팀장',
        avatarType: 'aria',
        text: '도발에 넘어가지 마세요, 이안! PK/FK 관계로 조직원 명단을 확정하고, 평균 거래액을 초과하는 거액 거래를 서브쿼리로 필터링하면 은신처가 특정됩니다. 마지막에는 AuditTrail 테이블을 직접 설계해 완벽히 기소합시다!',
      },
    ],
    objects: [
      {
        id: 'obj-ch3-badge',
        name: '압수된 널 시퀀스 암호화 토큰',
        locationName: 'SEC-05 구 지하철 제9폐쇄역 입구',
        icon: 'badge',
        shortDesc: '조직 코드 ORG-NullSec 이 각인된 하드웨어 키',
        inspectionReport:
          '토큰 내부에 Organizations(PK: org_id)와 Citizens(FK: org_id), Locations(FK: managed_by_org_id) 간의 외래키 매핑 구조가 기록되어 있다.',
        relatedTable: 'Organizations',
        suggestedQuery:
          'SELECT c.name, c.role, o.name AS org_name FROM Citizens c JOIN Organizations o ON c.org_id = o.org_id;',
        unlocksClueText: '단서 획득: 빅터 크로우와 단테 제로는 널 시퀀스 신디케이트(org_id: 5) 소속이며 거점은 SEC-05 제9폐쇄역임.',
      },
      {
        id: 'obj-ch3-doc',
        name: '아이기스 대법정 기소용 스키마 명세서',
        locationName: 'SEC-01 아이기스 법무 아카이브',
        icon: 'document',
        shortDesc: 'AuditTrail 테이블 생성(DDL) 표준 규격서',
        inspectionReport:
          '법정 증거 채택을 위해서는 PRIMARY KEY와 Citizens(citizen_id)를 참조하는 FOREIGN KEY가 선언된 AuditTrail 테이블을 생성하고 기소 내역을 INSERT 해야 한다.',
        relatedTable: 'Citizens',
        suggestedQuery:
          'SELECT * FROM Transactions WHERE amount > (SELECT AVG(amount) FROM Transactions);',
        unlocksClueText: '단서 획득: 평균 거래액(32,562.5)을 초과하는 4건의 핵심 범죄 거래 내역 확보 완료.',
      },
    ],
  },
];
