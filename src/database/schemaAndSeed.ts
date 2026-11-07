export const TABLE_DESCRIPTIONS: Record<string, string> = {
  Organizations: '네오-아카이브 시티의 주요 기관·기업·연구 조직 정보 (PK: org_id)',
  Locations: '도시 내 주요 시설 및 보안 구역 정보 (PK: location_id, FK: managed_by_org_id)',
  Citizens: '등록된 시민 및 연구원·보안 요원 인적사항 (PK: citizen_id, FK: org_id, home_location_id)',
  Transactions: '디지털 크레딧 송금 및 자금 거래 기록 (PK: tx_id, FK: sender_id, receiver_id, location_id)',
  SecurityLogs: '구역 출입 및 단말기 접근 보안 로그 (PK: log_id, FK: citizen_id, location_id)',
  Missions: '수사국 공식 SQL 조사 미션 레지스트리 (PK: mission_id)',
  Evidence: '수집된 사건 증거물 및 기밀 단서 아카이브 (PK: evidence_id, FK: mission_id, related_citizen_id)',
};

export const INITIAL_SCHEMA_AND_SEED_SQL = `
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS AuditTrail;
DROP TABLE IF EXISTS Evidence;
DROP TABLE IF EXISTS Missions;
DROP TABLE IF EXISTS SecurityLogs;
DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS Citizens;
DROP TABLE IF EXISTS Locations;
DROP TABLE IF EXISTS Organizations;

-- 1. Organizations (기관 및 단체 테이블)
CREATE TABLE Organizations (
  org_id INTEGER PRIMARY KEY,
  org_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  org_type TEXT NOT NULL,
  security_tier INTEGER NOT NULL,
  founded_date TEXT NOT NULL
);

-- 2. Locations (도시 구역 및 시설 테이블)
CREATE TABLE Locations (
  location_id INTEGER PRIMARY KEY,
  sector_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  security_level INTEGER NOT NULL,
  managed_by_org_id INTEGER,
  FOREIGN KEY (managed_by_org_id) REFERENCES Organizations(org_id)
);

-- 3. Citizens (시민 및 주요 인물 테이블)
CREATE TABLE Citizens (
  citizen_id INTEGER PRIMARY KEY,
  citizen_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  clearance_level INTEGER NOT NULL,
  org_id INTEGER,
  home_location_id INTEGER,
  status TEXT NOT NULL,
  credit_balance INTEGER NOT NULL,
  FOREIGN KEY (org_id) REFERENCES Organizations(org_id),
  FOREIGN KEY (home_location_id) REFERENCES Locations(location_id)
);

-- 4. Transactions (크레딧 금융 거래 테이블)
CREATE TABLE Transactions (
  tx_id INTEGER PRIMARY KEY,
  tx_hash TEXT NOT NULL UNIQUE,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  location_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  tx_type TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  is_flagged INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (sender_id) REFERENCES Citizens(citizen_id),
  FOREIGN KEY (receiver_id) REFERENCES Citizens(citizen_id),
  FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);

-- 5. SecurityLogs (출입 및 단말기 보안 로그 테이블)
CREATE TABLE SecurityLogs (
  log_id INTEGER PRIMARY KEY,
  citizen_id INTEGER NOT NULL,
  location_id INTEGER NOT NULL,
  action_type TEXT NOT NULL,
  access_status TEXT NOT NULL,
  threat_score INTEGER NOT NULL,
  timestamp TEXT NOT NULL,
  terminal_id TEXT NOT NULL,
  FOREIGN KEY (citizen_id) REFERENCES Citizens(citizen_id),
  FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);

-- 6. Missions (수사 미션 레지스트리 테이블)
CREATE TABLE Missions (
  mission_id INTEGER PRIMARY KEY,
  chapter_id INTEGER NOT NULL,
  stage_order INTEGER NOT NULL,
  code_name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  sql_concept TEXT NOT NULL,
  status TEXT NOT NULL,
  reward_xp INTEGER NOT NULL
);

-- 7. Evidence (사건 단서 및 증거물 테이블)
CREATE TABLE Evidence (
  evidence_id INTEGER PRIMARY KEY,
  evidence_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  mission_id INTEGER,
  related_citizen_id INTEGER,
  summary TEXT NOT NULL,
  is_unlocked INTEGER NOT NULL DEFAULT 0,
  discovered_at TEXT NOT NULL,
  FOREIGN KEY (mission_id) REFERENCES Missions(mission_id),
  FOREIGN KEY (related_citizen_id) REFERENCES Citizens(citizen_id)
);

-- ==========================================
-- 초기 시드 데이터 (PROJECT DATABASE ZERO 스토리 데이터)
-- ==========================================

INSERT INTO Organizations (org_id, org_code, name, org_type, security_tier, founded_date) VALUES
  (1, 'ORG-Aegis', '아이기스 데이터 수사국 (Aegis Bureau)', 'GOVERNMENT', 5, '2071-03-15'),
  (2, 'ORG-Helios', '헬리오스 코어 연구소 (Helios Core Lab)', 'RESEARCH', 5, '2074-09-01'),
  (3, 'ORG-Nexus', '넥서스 크레딧 뱅크 (Nexus Credit Bank)', 'FINANCE', 4, '2069-11-20'),
  (4, 'ORG-Vortex', '보텍스 물류 네트워크 (Vortex Logistics)', 'COMMERCIAL', 2, '2078-05-12'),
  (5, 'ORG-NullSec', '널 시퀀스 신디케이트 (Null Sequence)', 'UNDERGROUND', 1, '2083-01-01');

INSERT INTO Locations (location_id, sector_code, name, district, security_level, managed_by_org_id) VALUES
  (101, 'SEC-01', '아이기스 중앙 분석실', '센트럴 타워', 5, 1),
  (102, 'SEC-02', '헬리오스 제1양자서버실', '코어 돔', 5, 2),
  (103, 'SEC-03', '넥서스 스카이 볼트', '금융 지구', 4, 3),
  (104, 'SEC-04', '네온 마켓 환전소', '로우 시티', 2, 4),
  (105, 'SEC-05', '구 지하철 제9폐쇄역', '언더그라운드', 1, 5),
  (106, 'SEC-06', '스카이원 거주 단지', '어퍼 시티', 3, 4);

INSERT INTO Citizens (citizen_id, citizen_code, name, role, clearance_level, org_id, home_location_id, status, credit_balance) VALUES
  (1001, 'CTZ-001', '아리아 첸 (Aria Chen)', '수석 데이터 분석팀장', 5, 1, 106, 'ACTIVE', 42000),
  (1002, 'CTZ-002', '카일 반스 (Kyle Vance)', '시스템 보안 감독관', 4, 1, 106, 'ACTIVE', 31500),
  (1003, 'CTZ-003', '엘레나 송 (Dr. Elena Song)', '수석 DB 아키텍트', 5, 2, 106, 'MISSING', 18000),
  (1004, 'CTZ-004', '마커스 진 (Marcus Jin)', '코어 시스템 엔지니어', 4, 2, 106, 'ACTIVE', 95000),
  (1005, 'CTZ-005', '빅터 크로우 (Viktor Crow)', '암호화폐 브로커', 2, 5, 105, 'WATCHLIST', 128000),
  (1006, 'CTZ-006', '세라 김 (Sera Kim)', '금융 감사관', 4, 3, 106, 'ACTIVE', 54000),
  (1007, 'CTZ-007', '노아 박 (Noah Park)', '야간 서버 관리자', 3, 2, 104, 'ACTIVE', 14200),
  (1008, 'CTZ-008', '단테 제로 (Dante Zero)', '고스트 프로토콜 해커', 1, 5, 105, 'SUSPECT', 210000),
  (1009, 'CTZ-009', '한나 리 (Hanna Lee)', '물류 보안 오퍼레이터', 2, 4, 104, 'ACTIVE', 23000),
  (1010, 'CTZ-010', '이안 조 (Ian Cho)', '신입 데이터 수사관 (Player)', 3, 1, 106, 'ACTIVE', 12000);

INSERT INTO Transactions (tx_id, tx_hash, sender_id, receiver_id, location_id, amount, tx_type, timestamp, is_flagged) VALUES
  (501, 'TX-88A1', 1006, 1001, 103, 3500, 'AUDIT_FEE', '2086-11-01 09:15:00', 0),
  (502, 'TX-88A2', 1004, 1005, 104, 45000, 'ENCRYPTED_TRANSFER', '2086-11-01 22:40:00', 1),
  (503, 'TX-88A3', 1005, 1008, 105, 80000, 'DARKPOOL_PAYOUT', '2086-11-01 23:10:00', 1),
  (504, 'TX-88A4', 1003, 1007, 102, 2000, 'MAINTENANCE_BONUS', '2086-11-01 18:00:00', 0),
  (505, 'TX-88A5', 1004, 1008, 105, 65000, 'KEY_PURCHASE', '2086-11-02 01:05:00', 1),
  (506, 'TX-88A6', 1009, 1004, 104, 8000, 'LOGISTICS_FEE', '2086-11-02 01:30:00', 0),
  (507, 'TX-88A7', 1002, 1006, 103, 5000, 'SECURITY_DEPOSIT', '2086-11-02 02:00:00', 0),
  (508, 'TX-88A8', 1004, 1005, 104, 52000, 'DATA_ESCROW', '2086-11-02 02:20:00', 1);

INSERT INTO SecurityLogs (log_id, citizen_id, location_id, action_type, access_status, threat_score, timestamp, terminal_id) VALUES
  (9001, 1001, 101, 'LOGIN', 'GRANTED', 5, '2086-11-01 20:00:00', 'TERM-A01'),
  (9002, 1003, 102, 'BACKUP_SNAPSHOT', 'GRANTED', 15, '2086-11-01 21:30:00', 'TERM-H01'),
  (9003, 1004, 102, 'PRIVILEGE_ESCALATION', 'GRANTED', 88, '2086-11-01 23:45:00', 'TERM-H02'),
  (9004, 1008, 102, 'FIREWALL_BYPASS', 'DENIED', 96, '2086-11-01 23:58:00', 'TERM-EXT9'),
  (9005, 1004, 102, 'CORE_TABLE_EXPORT', 'GRANTED', 94, '2086-11-02 00:12:00', 'TERM-H02'),
  (9006, 1007, 102, 'PATROL_CHECK', 'GRANTED', 10, '2086-11-02 00:30:00', 'TERM-H03'),
  (9007, 1005, 105, 'RELAY_SYNC', 'GRANTED', 75, '2086-11-02 01:15:00', 'TERM-U04'),
  (9008, 1008, 105, 'DECRYPT_ARCHIVE', 'GRANTED', 92, '2086-11-02 01:40:00', 'TERM-U09'),
  (9009, 1008, 101, 'SPOOFED_NOISE_LOG', 'DENIED', 99, '2086-11-02 02:10:00', 'TERM-FAKE');

INSERT INTO Missions (mission_id, chapter_id, stage_order, code_name, title, sql_concept, status, reward_xp) VALUES
  (1, 1, 1, 'OP-01-SELECT', '시스템 부팅과 시민 명부 열람', 'SELECT / FROM', 'IN_PROGRESS', 100),
  (2, 1, 2, 'OP-02-WHERE', '실종된 아키텍트와 고위험 인물 추적', 'WHERE 조건절', 'LOCKED', 150),
  (3, 1, 3, 'OP-03-ORDER', '심야의 침입자: 최상위 위협 로그 색출', 'ORDER BY / LIMIT', 'LOCKED', 180),
  (4, 2, 4, 'OP-04-DML', '오염된 보안 기록 정정 및 용의자 상태 갱신', 'UPDATE', 'LOCKED', 220),
  (5, 2, 5, 'OP-05-GROUP', '검은 자금의 흐름: 송금자별 거래 집계', 'GROUP BY / 집계 함수', 'LOCKED', 250),
  (6, 2, 6, 'OP-06-APP-WHERE', '고위험 내부 인가자 추적', 'WHERE (AND 복합 조건)', 'LOCKED', 280),
  (7, 2, 7, 'OP-07-APP-ORDER', '거액 비자금 흐름 포착', 'WHERE + ORDER BY + LIMIT', 'LOCKED', 300),
  (8, 3, 8, 'OP-08-APP-GROUP', '검은 자금의 수신 거점 분석', 'GROUP BY 수신자 집계', 'LOCKED', 330),
  (9, 3, 9, 'OP-09-APP-UPDATE', '핵심 용의자 계좌 및 자산 긴급 동결', '조건부 UPDATE', 'LOCKED', 350),
  (10, 3, 10, 'OP-10-APP-JOIN', '시민과 소속 기관 교차 검증', 'INNER JOIN 교차 대조', 'LOCKED', 400);

INSERT INTO Evidence (evidence_id, evidence_code, title, category, mission_id, related_citizen_id, summary, is_unlocked, discovered_at) VALUES
  (1, 'EV-001', '엘레나 송 박사의 마지막 백업 로그', 'SYSTEM_LOG', 1, 1003, '실종 직전 제1양자서버실에서 스냅샷을 남긴 기록 확인', 1, '2086-11-02 02:30:00'),
  (2, 'EV-002', '엘레나 송 실종 경보 파일', 'PERSONNEL', 2, 1003, '보안 등급 5등급 수석 아키텍트 엘레나 송(citizen_id: 1003)이 실종(MISSING) 상태임이 확인됨', 0, '2086-11-02 02:45:00'),
  (3, 'EV-003', 'TERM-H02 코어 테이블 유출 흔적', 'SECURITY', 3, 1004, '위협 점수 90점 이상의 심야 로그 중 코어 테이블 반출(CORE_TABLE_EXPORT) 정황 포착', 0, '2086-11-02 03:00:00'),
  (4, 'EV-004', '마커스 진의 다크풀 자금 송금 내역', 'FINANCIAL', 5, 1004, '마커스 진(1004)이 총 3건, 합계 162,000 크레딧의 비정상 자금을 외부로 이체함', 0, '2086-11-02 03:30:00'),
  (5, 'EV-005', '헬리오스 연구소 내부자-널 시퀀스 결탁 증거', 'CONSPIRACY', 6, 1004, 'JOIN 분석 결과 헬리오스 소속 마커스 진과 널 시퀀스 소속 단테 제로의 공동 작전 확인', 0, '2086-11-02 04:00:00');
`;
