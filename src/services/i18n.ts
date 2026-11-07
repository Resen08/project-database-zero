// Internationalization (i18n) Service for PROJECT DATABASE ZERO
// Supported languages: 'de' (Deutsch - default) and 'ko' (한국어)

export type SupportedLanguage = 'de' | 'ko';

export interface GuidebookEntry {
  stageOrder: number;
  themeId: 1 | 2;
  keyword: string;
  badge: string;
  title: string;
  summary: string;
  syntax: string;
  explanation: string[];
  exampleQuery: string;
  proTip: string;
}

export interface MissionI18n {
  title: string;
  sqlConcept: string;
  conceptBadge: string;
  briefing: string;
  objectiveSummary: string;
  starterQuery: string;
  hints: [string, string, string];
  successDialogue: {
    speakerName: string;
    speakerRole: string;
    text: string;
    sqlTip?: string;
  }[];
}

export interface ChapterI18n {
  title: string;
  subtitle: string;
  synopsis: string;
  locationSector: string;
  introDialogues: {
    speakerName: string;
    speakerRole: string;
    text: string;
    sqlTip?: string;
  }[];
  objects: {
    id: string;
    name: string;
    locationName: string;
    shortDesc: string;
    inspectionReport: string;
    unlocksClueText: string;
  }[];
}

export interface AchievementI18n {
  id: string;
  title: string;
  desc: string;
  rewardBadge: string;
}

// -------------------------------------------------------------
// GUIDEBOOK DATA (10 Stages: 5 Theme 1 + 5 Theme 2)
// -------------------------------------------------------------
export const GUIDEBOOK_DATA: Record<SupportedLanguage, GuidebookEntry[]> = {
  de: [
    {
      stageOrder: 1,
      themeId: 1,
      keyword: 'SELECT / FROM',
      badge: 'Grundlagen',
      title: 'Thema 1 - Stufe 1: Tabellendaten abrufen (SELECT / FROM)',
      summary: 'Das fundamentale Gerüst jeder SQL-Abfrage zum Lesen von Datensätzen.',
      syntax: 'SELECT spalte1, spalte2 FROM tabellenname;\n-- Oder alle Spalten abrufen:\nSELECT * FROM tabellenname;',
      explanation: [
        'SELECT bestimmt, WELCHE Spalten (Attribute) in der Ergebnistabelle erscheinen sollen.',
        'FROM bestimmt, AUS WELCHER Tabelle die Daten ausgelesen werden.',
        'Das Sternchen (*) ist ein Platzhalter für "alle vorhandenen Spalten".',
        'Jede SQL-Anweisung endet standardmäßig mit einem Semikolon (;).',
      ],
      exampleQuery: 'SELECT * FROM Citizens;',
      proTip: 'In der forensischen Ersterkundung verschafft SELECT * einen schnellen Überblick über die gesamte Datenstruktur.',
    },
    {
      stageOrder: 2,
      themeId: 1,
      keyword: 'WHERE',
      badge: 'Bedingungsfilter',
      title: 'Thema 1 - Stufe 2: Gezieltes Filtern von Daten (WHERE)',
      summary: 'Grenzt die Treffermenge anhand von logischen Bedingungen präzise ein.',
      syntax: "SELECT * FROM tabellenname\nWHERE spaltenname = 'Wert';\n\n-- Vergleichsoperatoren: =, !=, <>, >, <, >=, <=",
      explanation: [
        'Die WHERE-Klausel steht immer direkt nach der FROM-Klausel.',
        "Textwerte (Strings) müssen in einfache Anführungszeichen ('...') gesetzt werden (z. B. status = 'MISSING').",
        'Zahlenwerte werden ohne Anführungszeichen verglichen (z. B. clearance_level >= 4).',
      ],
      exampleQuery: "SELECT * FROM Citizens WHERE status = 'MISSING';",
      proTip: "Achte auf exakte Groß-/Kleinschreibung bei Textvergleichen: 'MISSING' unterscheidet sich von 'missing'.",
    },
    {
      stageOrder: 3,
      themeId: 1,
      keyword: 'ORDER BY / LIMIT',
      badge: 'Sortierung & Begrenzung',
      title: 'Thema 1 - Stufe 3: Sortieren und Begrenzen (ORDER BY / LIMIT)',
      summary: 'Bringt Ordnung in unstrukturierte Datensätze und isoliert die Top-N-Einträge.',
      syntax: 'SELECT * FROM tabellenname\nORDER BY spaltenname DESC\nLIMIT n;',
      explanation: [
        'ORDER BY sortiert die Zeilen nach der angegebenen Spalte.',
        'DESC sortiert absteigend (vom Größten zum Kleinsten, z. B. Bedrohung 99 -> 1).',
        'LIMIT n beschränkt die Ausgabe auf genau n Zeilen (z. B. LIMIT 3 für die Top 3).',
      ],
      exampleQuery: 'SELECT * FROM SecurityLogs ORDER BY threat_score DESC LIMIT 3;',
      proTip: 'LIMIT steht immer an der allerletzten Stelle einer SQL-Abfrage.',
    },
    {
      stageOrder: 4,
      themeId: 1,
      keyword: 'UPDATE',
      badge: 'Datenänderung',
      title: 'Thema 1 - Stufe 4: Datensätze gezielt aktualisieren (UPDATE)',
      summary: 'Ändert Werte in bestehenden Datensätzen.',
      syntax: "UPDATE tabellenname\nSET spaltenname = 'NeuerWert'\nWHERE id_spalte = 1004;",
      explanation: [
        'UPDATE bestimmt die zu modifizierende Tabelle.',
        'SET spaltenname = neuer_wert legt den neuen Attributwert fest.',
        'WARNUNG: Ohne WHERE-Klausel würden ALLE Zeilen der Tabelle überschrieben!',
      ],
      exampleQuery: "UPDATE Citizens SET status = 'SUSPECT' WHERE citizen_id = 1004;",
      proTip: 'Prüfe vor einem UPDATE immer mit einem SELECT und derselben WHERE-Bedingung die Zielzeilen.',
    },
    {
      stageOrder: 5,
      themeId: 1,
      keyword: 'GROUP BY / AGGREGATE',
      badge: 'Gruppierung & Summe',
      title: 'Thema 1 - Stufe 5: Kennzahlen aggregieren und gruppieren',
      summary: 'Fasst Datengruppen zusammen und berechnet Summen oder Anzahlen.',
      syntax: 'SELECT gruppen_spalte, COUNT(*), SUM(betrag)\nFROM tabellenname\nGROUP BY gruppen_spalte;',
      explanation: [
        'COUNT(*) zählt die Datensätze, SUM(spalte) addiert numerische Werte.',
        'GROUP BY bündelt Zeilen mit identischem Wert zu einer Ergebniszeile.',
        'Spalten im SELECT ohne Aggregatfunktion müssen im GROUP BY stehen.',
      ],
      exampleQuery: 'SELECT sender_id, COUNT(*) AS tx_count, SUM(amount) AS total_sent FROM Transactions GROUP BY sender_id;',
      proTip: 'Mit AS aliasname kannst du berechneten Aggregatspalten verständliche Bezeichnungen geben.',
    },
    {
      stageOrder: 6,
      themeId: 2,
      keyword: 'WHERE AND',
      badge: 'Kombinierte Filter',
      title: 'Thema 2 - Stufe 1: Hochsicherheits-Insider aufspüren (AND)',
      summary: 'Wende logische Operatoren an, um mehrere Sicherheitskriterien gleichzeitig zu prüfen.',
      syntax: "SELECT * FROM tabellenname\nWHERE bedingung1 AND bedingung2;",
      explanation: [
        'AND verlangt, dass BEIDE Bedingungen wahr sein müssen.',
        'Kombiniere Zahlenvergleiche (clearance_level >= 4) mit Textvergleichen (status = \'ACTIVE\').',
        'So isolierst du Insider mit höchsten Zugangsrechten präzise aus der Gesamtmenge.',
      ],
      exampleQuery: "SELECT * FROM Citizens WHERE clearance_level >= 4 AND status = 'ACTIVE';",
      proTip: 'Nutze Klammern, wenn du AND und OR in komplexeren Abfragen kombinierst.',
    },
    {
      stageOrder: 7,
      themeId: 2,
      keyword: 'WHERE + ORDER BY + LIMIT',
      badge: 'Gefilterte Top-N',
      title: 'Thema 2 - Stufe 2: Großvolumige Schatten-Transaktionen (Top-3)',
      summary: 'Kombiniere Vorfilterung mit absteigender Sortierung und Mengenbegrenzung.',
      syntax: "SELECT * FROM tabellenname\nWHERE betrag >= 50000\nORDER BY betrag DESC\nLIMIT 3;",
      explanation: [
        'Die WHERE-Klausel eliminiert Kleinstbeträge bereits vor der Sortierung.',
        'ORDER BY amount DESC ordnet die verbleibenden Rekorde vom höchsten zum niedrigsten Betrag.',
        'LIMIT 3 liefert exakt die drei größten Transaktionen.',
      ],
      exampleQuery: 'SELECT * FROM Transactions WHERE amount >= 50000 ORDER BY amount DESC LIMIT 3;',
      proTip: 'Reihenfolge der Klauseln: SELECT -> FROM -> WHERE -> ORDER BY -> LIMIT.',
    },
    {
      stageOrder: 8,
      themeId: 2,
      keyword: 'GROUP BY RECEIVER',
      badge: 'Empfänger-Analyse',
      title: 'Thema 2 - Stufe 3: Geldempfänger-Musteranalyse (Receiver)',
      summary: 'Analysiere die Zielkonten, um kriminelle Schattenkassen aufzudecken.',
      syntax: 'SELECT receiver_id, COUNT(*), SUM(amount)\nFROM Transactions\nGROUP BY receiver_id;',
      explanation: [
        'Während in Thema 1 nach Absendern gruppiert wurde, liegt der Fokus nun auf den Empfängern.',
        'Gruppierung nach receiver_id deckt auf, wohin das meiste Geld geflossen ist.',
        'SUM(amount) zeigt das akkumulierte Volumen pro Empfängerkonto.',
      ],
      exampleQuery: 'SELECT receiver_id, COUNT(*) AS tx_count, SUM(amount) AS total_received FROM Transactions GROUP BY receiver_id;',
      proTip: 'Ein Empfänger mit hohem Gesamtbetrag und wenigen Transaktionen deutet oft auf Schmiergeldzahlungen hin.',
    },
    {
      stageOrder: 9,
      themeId: 2,
      keyword: 'CONDITIONAL UPDATE',
      badge: 'Konto-Einfrieren',
      title: 'Thema 2 - Stufe 4: Notfall-Vermögenssperre (FROZEN)',
      summary: 'Führe eine gezielte Statusänderung zur Gefahrenabwehr durch.',
      syntax: "UPDATE Citizens\nSET status = 'FROZEN'\nWHERE citizen_id = 1008;",
      explanation: [
        'Setzt den Kontostatus des Hauptverdächtigen Zed (citizen_id 1008) auf FROZEN.',
        'Die WHERE-Klausel garantiert, dass ausschließlich die Zielperson gesperrt wird.',
        'Sofortige Blockierung unterbindet weitere unbefugte Transaktionen.',
      ],
      exampleQuery: "UPDATE Citizens SET status = 'FROZEN' WHERE citizen_id = 1008;",
      proTip: 'Bestätige das Ergebnis immer mit SELECT * FROM Citizens WHERE citizen_id = 1008;',
    },
    {
      stageOrder: 10,
      themeId: 2,
      keyword: 'INNER JOIN',
      badge: 'Tabellenverknüpfung',
      title: 'Thema 2 - Stufe 5: Bürger und Organisationen abgleichen (JOIN)',
      summary: 'Verknüpfe Bürgerdaten mit Organisationsstrukturen über Fremdschlüssel.',
      syntax: 'SELECT c.name, c.role, o.name AS org_name\nFROM Citizens c\nJOIN Organizations o ON c.org_id = o.org_id;',
      explanation: [
        'JOIN verbindet zwei Tabellen basierend auf der Bedingung c.org_id = o.org_id.',
        'Ermöglicht das Anzeigen des realen Organisationsnamens anstelle der bloßen ID-Nummer.',
        'Liefert das vollständige Lagebild aller Verdächtigen und ihrer Arbeitgeber.',
      ],
      exampleQuery: 'SELECT Citizens.name, Citizens.role, Organizations.name AS org_name FROM Citizens JOIN Organizations ON Citizens.org_id = Organizations.org_id;',
      proTip: 'Qualifiziere Spalten mit dem Tabellennamen (z. B. Citizens.name), wenn Spaltennamen kollidieren könnten.',
    },
  ],

  ko: [
    {
      stageOrder: 1,
      themeId: 1,
      keyword: 'SELECT / FROM',
      badge: '기초 조회',
      title: '테마 1 - 1단계: 테이블 데이터 조회 (SELECT / FROM)',
      summary: '데이터베이스에서 데이터를 읽어오는 가장 기본적이고 강력한 SQL 구조입니다.',
      syntax: 'SELECT 컬럼1, 컬럼2 FROM 테이블명;\n-- 또는 모든 컬럼 조회:\nSELECT * FROM 테이블명;',
      explanation: [
        'SELECT는 결과 화면에 어떤 컬럼(열)을 보여줄지 결정합니다.',
        'FROM은 데이터를 가져올 대상 테이블명을 지정합니다.',
        '별표(*)는 테이블에 존재하는 모든 컬럼을 한 번에 조회할 때 사용하는 기호입니다.',
        '모든 SQL 문장의 끝에는 마침표 역할을 하는 세미콜론(;)을 붙입니다.',
      ],
      exampleQuery: 'SELECT * FROM Citizens;',
      proTip: '실무에서는 불필요한 네트워크 트래픽을 줄이기 위해 필요한 컬럼만 명시하지만, 사건 초기 데이터 탐색 시에는 SELECT *가 가장 유용합니다.',
    },
    {
      stageOrder: 2,
      themeId: 1,
      keyword: 'WHERE',
      badge: '조건 필터링',
      title: '테마 1 - 2단계: 원하는 조건의 데이터만 추출 (WHERE)',
      summary: '조건식을 통해 수많은 데이터 중 특정 사건 관련 레코드만 걸러냅니다.',
      syntax: "SELECT * FROM 테이블명\nWHERE 컬럼명 = '값';\n\n-- 비교 연산자: =, !=, <>, >, <, >=, <=",
      explanation: [
        'WHERE 절은 반드시 FROM 절 바로 뒤에 위치합니다.',
        "문자열 데이터는 반드시 작은따옴표('...')로 감싸야 합니다 (예: status = 'MISSING').",
        '숫자 데이터는 따옴표 없이 그대로 작성합니다 (예: clearance_level >= 4).',
      ],
      exampleQuery: "SELECT * FROM Citizens WHERE status = 'MISSING';",
      proTip: "데이터베이스는 대소문자를 구분할 수 있으므로 'MISSING'과 'missing'을 주의해서 작성하세요.",
    },
    {
      stageOrder: 3,
      themeId: 1,
      keyword: 'ORDER BY / LIMIT',
      badge: '정렬 및 제한',
      title: '테마 1 - 3단계: 데이터 정렬 및 상위 건수 제한 (ORDER BY / LIMIT)',
      summary: '위험도 순으로 데이터를 정렬하고 최상위 핵심 데이터만 추출합니다.',
      syntax: 'SELECT * FROM 테이블명\nORDER BY 컬럼명 DESC\nLIMIT n;',
      explanation: [
        'ORDER BY는 특정 컬럼을 기준으로 데이터를 정렬합니다.',
        'DESC는 내림차순(큰 값에서 작은 값, 위험도 99 -> 1)으로 정렬합니다.',
        'LIMIT n은 정렬된 결과 중 최상위 n건의 행만 화면에 표시합니다.',
      ],
      exampleQuery: 'SELECT * FROM SecurityLogs ORDER BY threat_score DESC LIMIT 3;',
      proTip: 'LIMIT은 항상 SQL 쿼리의 가장 마지막에 위치해야 합니다.',
    },
    {
      stageOrder: 4,
      themeId: 1,
      keyword: 'UPDATE',
      badge: '데이터 수정',
      title: '테마 1 - 4단계: 레코드 상태 갱신 (UPDATE)',
      summary: '실제 데이터베이스에 저장된 레코드의 상태를 변경합니다.',
      syntax: "UPDATE 테이블명\nSET 컬럼 = '새값'\nWHERE 조건컬럼 = 1004;",
      explanation: [
        'UPDATE는 기존 데이터를 수정할 때 사용합니다.',
        'SET 컬럼명 = 변경할값 으로 수정할 필드를 지정합니다.',
        '주의: UPDATE 작성 시 WHERE 절을 생략하면 테이블 전체 행이 변경되므로 극도로 주의해야 합니다!',
      ],
      exampleQuery: "UPDATE Citizens SET status = 'SUSPECT' WHERE citizen_id = 1004;",
      proTip: '실제 업데이트 전 반드시 동일한 WHERE 조건으로 SELECT를 실행해 대상 레코드를 사전 확인하세요.',
    },
    {
      stageOrder: 5,
      themeId: 1,
      keyword: 'GROUP BY / AGGREGATE',
      badge: '집계 및 통계',
      title: '테마 1 - 5단계: 그룹별 통계 및 집계 함수 (GROUP BY)',
      summary: '데이터를 특정 기준별로 묶어 건수와 합계를 일목요연하게 계산합니다.',
      syntax: 'SELECT 그룹컬럼, COUNT(*), SUM(금액컬럼)\nFROM 테이블명\nGROUP BY 그룹컬럼;',
      explanation: [
        '집계 함수: COUNT(*) 행 개수, SUM() 합계, AVG() 평균.',
        'GROUP BY는 특정 컬럼의 값이 같은 행들을 하나의 그룹으로 묶어줍니다.',
        'SELECT 절에 집계 함수가 아닌 일반 컬럼이 있다면 반드시 GROUP BY에 포함되어야 합니다.',
      ],
      exampleQuery: 'SELECT sender_id, COUNT(*) AS tx_count, SUM(amount) AS total_sent FROM Transactions GROUP BY sender_id;',
      proTip: 'AS 별칭(alias)을 사용하면 SUM(amount) 같은 수식을 보기 좋은 컬럼명으로 바꿀 수 있습니다.',
    },
    {
      stageOrder: 6,
      themeId: 2,
      keyword: 'WHERE AND',
      badge: '복합 조건 응용',
      title: '테마 2 - 1단계: 고위험 내부 인가자 추적 (WHERE ... AND)',
      summary: '단일 조건 필터를 넘어 AND 연산자로 여러 보안 조건을 동시에 충족하는 인물을 색출합니다.',
      syntax: "SELECT * FROM 테이블명\nWHERE 조건1 AND 조건2;",
      explanation: [
        'AND는 연결된 모든 조건식이 참(TRUE)일 때만 결과를 반환합니다.',
        '숫자 비교(clearance_level >= 4)와 문자열 비교(status = \'ACTIVE\')를 결합합니다.',
        '보안 등급이 높으면서 현재 활동 중인 고위험 용의자들을 정밀하게 추려낼 수 있습니다.',
      ],
      exampleQuery: "SELECT * FROM Citizens WHERE clearance_level >= 4 AND status = 'ACTIVE';",
      proTip: '복잡한 조건식에서는 괄호 ( ... )를 활용하여 논리 연산자의 우선순위를 명확히 지정하세요.',
    },
    {
      stageOrder: 7,
      themeId: 2,
      keyword: 'WHERE + ORDER BY + LIMIT',
      badge: '필터·정렬·제한 결합',
      title: '테마 2 - 2단계: 거액 비자금 흐름 포착 (WHERE + ORDER BY + LIMIT)',
      summary: '특정 금액 이상의 거래만 먼저 필터링한 뒤 금액순으로 정렬하여 상위 건을 추출합니다.',
      syntax: "SELECT * FROM 테이블명\nWHERE 금액 >= 50000\nORDER BY 금액 DESC\nLIMIT 3;",
      explanation: [
        'WHERE 절이 먼저 50,000 이상의 거래들만 추려냅니다.',
        'ORDER BY amount DESC 절이 추려진 거래들을 큰 금액 순서대로 정렬합니다.',
        '마지막으로 LIMIT 3이 상위 3건의 핵심 거래만 화면에 출력합니다.',
      ],
      exampleQuery: 'SELECT * FROM Transactions WHERE amount >= 50000 ORDER BY amount DESC LIMIT 3;',
      proTip: '작성 순서 규칙: SELECT -> FROM -> WHERE -> ORDER BY -> LIMIT 순서를 지켜야 구문 에러가 나지 않습니다.',
    },
    {
      stageOrder: 8,
      themeId: 2,
      keyword: 'GROUP BY RECEIVER',
      badge: '수신 거점 집계',
      title: '테마 2 - 3단계: 자금 수신인 패턴 분석 (GROUP BY receiver_id)',
      summary: '송금자뿐 아니라 돈을 받아 챙긴 수신인별로 그룹을 묶어 범죄 자금 집결지를 규명합니다.',
      syntax: 'SELECT receiver_id, COUNT(*), SUM(amount)\nFROM Transactions\nGROUP BY receiver_id;',
      explanation: [
        '테마 1에서 배운 송금자(sender_id) 대신 수신자(receiver_id) 컬럼을 그룹 기준으로 응용합니다.',
        '각 수신자가 돈을 받은 횟수(COUNT)와 총 수신액(SUM)을 계산합니다.',
        '거액의 자금이 특정 해커나 브로커에게 집중되었는지 즉시 파악할 수 있습니다.',
      ],
      exampleQuery: 'SELECT receiver_id, COUNT(*) AS tx_count, SUM(amount) AS total_received FROM Transactions GROUP BY receiver_id;',
      proTip: '수신 총액이 크면서 거래 건수가 소수인 계좌는 뇌물 및 기밀 매매 대금의 전형적인 흔적입니다.',
    },
    {
      stageOrder: 9,
      themeId: 2,
      keyword: 'CONDITIONAL UPDATE',
      badge: '계좌 자산 동결',
      title: '테마 2 - 4단계: 핵심 용의자 계좌 긴급 동결 (UPDATE ... SET FROZEN)',
      summary: '수사 결과 밝혀진 주범의 상태를 FROZEN으로 변경하여 추가 범행을 원천 차단합니다.',
      syntax: "UPDATE Citizens\nSET status = 'FROZEN'\nWHERE citizen_id = 1008;",
      explanation: [
        '시민 테이블(Citizens)에서 citizen_id = 1008(제드)을 특정합니다.',
        "SET status = 'FROZEN'으로 계정과 자산을 즉시 동결 처리합니다.",
        'WHERE 조건을 누락하면 전 시민의 계정이 동결되므로 조건 확인이 필수입니다.',
      ],
      exampleQuery: "UPDATE Citizens SET status = 'FROZEN' WHERE citizen_id = 1008;",
      proTip: '변경 후 SELECT * FROM Citizens WHERE citizen_id = 1008; 로 올바르게 반영되었는지 확인하세요.',
    },
    {
      stageOrder: 10,
      themeId: 2,
      keyword: 'INNER JOIN',
      badge: '관계형 결합 대조',
      title: '테마 2 - 5단계: 시민과 소속 기관 교차 대조 (JOIN)',
      summary: '시민 테이블과 기관 테이블을 외래키(org_id)로 결합하여 배후 조직의 실체를 드러냅니다.',
      syntax: 'SELECT Citizens.name, Citizens.role, Organizations.name AS org_name\nFROM Citizens\nJOIN Organizations ON Citizens.org_id = Organizations.org_id;',
      explanation: [
        'JOIN 키워드로 두 테이블을 연결하고 ON 뒤에 공통 키(org_id) 조건을 기술합니다.',
        '숫자로만 적혀 있던 org_id 대신 실제 소속 기관의 공식 이름을 함께 조회할 수 있습니다.',
        '어느 연구소와 지하 신디케이트가 사건에 연루되었는지 전모를 밝힐 수 있습니다.',
      ],
      exampleQuery: 'SELECT Citizens.name, Citizens.role, Organizations.name AS org_name FROM Citizens JOIN Organizations ON Citizens.org_id = Organizations.org_id;',
      proTip: '서로 다른 테이블에 같은 이름의 컬럼(name)이 있을 때는 Citizens.name 처럼 테이블명을 앞에 붙여 식별합니다.',
    },
  ],
};

// -------------------------------------------------------------
// 1. MISSIONS I18N DATA (10 Stages: 5 Theme 1 + 5 Theme 2)
// -------------------------------------------------------------
export const MISSIONS_I18N: Record<SupportedLanguage, Record<number, MissionI18n>> = {
  de: {
    1: {
      title: 'Systemstart und Bürgerverzeichnis',
      sqlConcept: 'Stufe 1: SELECT / FROM',
      conceptBadge: 'SELECT · FROM',
      briefing:
        'Willkommen im Aegis-Datenermittlungsbüro, Nachwuchs-Ermittler Ezreal. Heute früh wurde im Helios-Quantenserverlabor ein massiver Datenabfluss gemeldet. Bitte prüfe zunächst, ob die zentrale Datenbank ordnungsgemäß funktioniert, indem du alle Datensätze der Bürgertabelle (Citizens) abrufst.',
      objectiveSummary:
        'Schreibe und führe eine SELECT-Abfrage aus, die alle Spalten und alle 10 Zeilen der Tabelle Citizens anzeigt.',
      starterQuery:
        '-- Thema 1 - Stufe 1\n',
      hints: [
        'Nutze das Sternchen (*), um alle Spalten abzurufen: SELECT *',
        'Gib mit FROM tabellenname die Zieltabelle an.',
        'Musterlösung: SELECT * FROM Citizens;',
      ],
      successDialogue: [
        {
          speakerName: 'Leitende Analystin Ahri',
          speakerRole: 'Leiterin Datenanalyse (Aegis Bureau)',
          text: 'Hervorragend! Alle 10 Bürgerdaten werden korrekt angezeigt. Aber sieh dir Bürgerin Nr. 1003 an – Dr. Heimerdinger. Ihr Status steht auf MISSING (Vermisst)!',
          sqlTip: 'SELECT * FROM tabellenname ist die wichtigste Basisabfrage zur ersten Erkundung einer unbekannten Tabelle.',
        },
      ],
    },
    2: {
      title: 'Vermisste Architektin und Hochrisikopersonen',
      sqlConcept: 'Stufe 2: WHERE Bedingung',
      conceptBadge: 'WHERE · Filter',
      briefing:
        'Dr. Heimerdinger ist die Chef-Architektin des Quantenserverraums. Zum Zeitpunkt ihres Verschwindens gab es Alarmsignale aus Bereichen, die nur mit Sicherheitsfreigabe (clearance_level) 4 oder höher betreten werden dürfen. Finde mit einer WHERE-Klausel gezielt den Eintrag von Dr. Heimerdinger (status = \'MISSING\').',
      objectiveSummary:
        "Filtere die Tabelle Citizens mit WHERE, sodass nur der Datensatz mit status = 'MISSING' ausgegeben wird.",
      starterQuery:
        '-- Thema 1 - Stufe 2\n',
      hints: [
        'Bedingungen werden hinter FROM mit WHERE bedingung formuliert.',
        "Textwerte müssen in einfache Anführungszeichen gesetzt werden: WHERE status = 'MISSING'",
        "Musterlösung: SELECT * FROM Citizens WHERE status = 'MISSING';",
      ],
      successDialogue: [
        {
          speakerName: 'Sicherheitsinspektor Jayce',
          speakerRole: 'Leiter Systemsicherheit',
          text: 'Eindeutig. ID 1003, Dr. Heimerdinger. Sicherheitsfreigabe Stufe 5. Sie verschwand unmittelbar nach dem nächtlichen Server-Backup. Jetzt müssen wir die Sicherheitsprotokolle jener Nacht prüfen.',
          sqlTip: 'Mit der WHERE-Klausel lassen sich Bedingungen mit =, !=, >, <, >=, <=, AND und OR präzise steuern.',
        },
      ],
    },
    3: {
      title: 'Mitternächtlicher Eindringling: Höchste Bedrohungsstufe',
      sqlConcept: 'Stufe 3: ORDER BY / LIMIT',
      conceptBadge: 'ORDER BY · LIMIT',
      briefing:
        'In der Tabelle SecurityLogs sammeln sich hunderte Zugriffsprotokolle. Das KI-Überwachungssystem weist jedem Vorfall einen Bedrohungswert (threat_score) zu. Sortiere die Logs absteigend nach threat_score (DESC) und isoliere die Top 3 Vorfälle mit LIMIT 3.',
      objectiveSummary:
        'Sortiere SecurityLogs nach threat_score absteigend (DESC) und beschränke die Ausgabe mit LIMIT 3 auf genau 3 Zeilen.',
      starterQuery:
        '-- Thema 1 - Stufe 3\n',
      hints: [
        'Absteigend sortieren: ORDER BY spaltenname DESC',
        'Zeilenzahl begrenzen: Am Ende der Abfrage LIMIT n hinzufügen.',
        'Musterlösung: SELECT * FROM SecurityLogs ORDER BY threat_score DESC LIMIT 3;',
      ],
      successDialogue: [
        {
          speakerName: 'Leitende Analystin Ahri',
          speakerRole: 'Leiterin Datenanalyse (Aegis Bureau)',
          text: 'Sieh dir die obersten 3 Logs an! Log 9009 ist ein gefälschtes Täuschungs-Log (SPOOFED_NOISE_LOG), aber Log 9004 (citizen_id 1008) und 9005 (citizen_id 1004, CORE_TABLE_EXPORT) sind reale Spuren der Tat!',
          sqlTip: 'ORDER BY spalte DESC LIMIT n wird täglich genutzt, um die neuesten oder kritischsten Sicherheitsvorfälle zu filtern.',
        },
      ],
    },
    4: {
      title: 'Sicherheitsstatus aktualisieren & Verdächtigen markieren',
      sqlConcept: 'Stufe 4: UPDATE',
      conceptBadge: 'UPDATE · Status',
      briefing:
        'Das Log 9005 (CORE_TABLE_EXPORT) wurde durch citizen_id = 1004 (Jhin, Core System Engineer) ausgelöst! Sein Status in der Tabelle Citizens steht jedoch noch auf ACTIVE. Führe ein UPDATE aus, um seinen Status auf \'SUSPECT\' zu setzen!',
      objectiveSummary:
        "Aktualisiere mit UPDATE in Citizens den status auf 'SUSPECT' für den Bürger mit citizen_id = 1004.",
      starterQuery:
        '-- Thema 1 - Stufe 4\n',
      hints: [
        'Syntax für Datenänderungen: UPDATE tabellenname SET spalte = wert WHERE bedingung;',
        'Vergiss niemals die WHERE-Klausel: WHERE citizen_id = 1004',
        "Musterlösung: UPDATE Citizens SET status = 'SUSPECT' WHERE citizen_id = 1004;",
      ],
      successDialogue: [
        {
          speakerName: 'Sicherheitsinspektor Jayce',
          speakerRole: 'Leiter Systemsicherheit',
          text: 'Jhin (1004) ist nun offiziell als SUSPECT erfasst! Der Alarm im Sicherheitsnetzwerk ist aktiv. Jetzt verfolgen wir seine Finanzströme in Transactions.',
          sqlTip: 'Führe vor einem UPDATE immer zuerst ein SELECT mit derselben WHERE-Bedingung aus, um versehentliche Massenänderungen zu verhindern.',
        },
      ],
    },
    5: {
      title: 'Schattenfinanzen: Aggregation nach Absender',
      sqlConcept: 'Stufe 5: GROUP BY / Aggregate',
      conceptBadge: 'GROUP BY · Summe',
      briefing:
        'In der Finanztabelle Transactions befinden sich verdächtige Überweisungen. Gruppiere die Transaktionen nach Absender (sender_id) mit GROUP BY und berechne die Transaktionsanzahl (COUNT(*)) sowie das Gesamtvolumen (SUM(amount)).',
      objectiveSummary:
        'Gruppiere Transactions nach sender_id und ermittle sender_id, Transaktionsanzahl (COUNT) und Gesamtsumme (SUM(amount)).',
      starterQuery:
        '-- Thema 1 - Stufe 5\n',
      hints: [
        'Gruppieren nach Spalte: GROUP BY sender_id',
        'Aggregatfunktionen im SELECT: COUNT(*) AS tx_count, SUM(amount) AS total_sent',
        'Musterlösung: SELECT sender_id, COUNT(*) AS tx_count, SUM(amount) AS total_sent FROM Transactions GROUP BY sender_id;',
      ],
      successDialogue: [
        {
          speakerName: 'Leitende Analystin Ahri',
          speakerRole: 'Leiterin Datenanalyse (Aegis Bureau)',
          text: 'Glückwunsch zum Abschluss von Thema 1! Absender 1004 (Jhin) hat 3 Überweisungen über insgesamt 162.000 Credits getätigt. In Thema 2 wenden wir dieses Wissen nun auf echte Ermittlungsfälle an!',
          sqlTip: 'GROUP BY fasst tausende Buchungszeilen zu übersichtlichen Kennzahlen zusammen.',
        },
      ],
    },
    6: {
      title: 'Hochsicherheits-Insider aufspüren',
      sqlConcept: 'Angewandt 1: WHERE Mehrfachbedingung (AND)',
      conceptBadge: 'WHERE · AND',
      briefing:
        'Start von Thema 2! Wir müssen alle aktiven Insider mit hoher Sicherheitsstufe ermitteln. Suche in Citizens nach allen Personen, deren Sicherheitsfreigabe mindestens 4 ist (clearance_level >= 4) UND die sich derzeit im Status ACTIVE befinden (status = \'ACTIVE\').',
      objectiveSummary:
        "Frage alle Bürger ab, bei denen clearance_level >= 4 UND status = 'ACTIVE' gleichzeitig zutreffen.",
      starterQuery:
        '-- Thema 2 - Stufe 1\n',
      hints: [
        'Kombiniere zwei Kriterien mit dem logischen Operator AND.',
        "Vergleiche Zahlen direkt und Text in einfachen Anführungszeichen: clearance_level >= 4 AND status = 'ACTIVE'",
        "Musterlösung: SELECT * FROM Citizens WHERE clearance_level >= 4 AND status = 'ACTIVE';",
      ],
      successDialogue: [
        {
          speakerName: 'Leitende Analystin Ahri',
          speakerRole: 'Leiterin Datenanalyse (Aegis Bureau)',
          text: 'Präzise gefiltert! Wir haben die autorisierten Schlüsselpersonen isoliert. Nun prüfen wir die großen Überweisungen aus diesem Kreis.',
          sqlTip: 'AND verlangt, dass beide Bedingungen wahr sein müssen, was den Suchkreis exakt einschränkt.',
        },
      ],
    },
    7: {
      title: 'Großvolumige Schatten-Transaktionen',
      sqlConcept: 'Angewandt 2: WHERE + ORDER BY + LIMIT',
      conceptBadge: 'Filter · Sortierung · Limit',
      briefing:
        'Schmiergeldtransaktionen zeichnen sich durch hohe Summen aus. Finde in Transactions alle Überweisungen ab 50.000 Credits (amount >= 50000), sortiere sie absteigend nach Betrag (DESC) und gib die obersten 3 Transaktionen aus (LIMIT 3).',
      objectiveSummary:
        'Filtere Transactions nach amount >= 50000, sortiere absteigend nach amount und begrenze auf 3 Zeilen.',
      starterQuery:
        '-- Thema 2 - Stufe 2\n',
      hints: [
        'Filtere zuerst mit WHERE amount >= 50000.',
        'Sortiere anschließend mit ORDER BY amount DESC und schließe mit LIMIT 3 ab.',
        'Musterlösung: SELECT * FROM Transactions WHERE amount >= 50000 ORDER BY amount DESC LIMIT 3;',
      ],
      successDialogue: [
        {
          speakerName: 'Sicherheitsinspektor Jayce',
          speakerRole: 'Leiter Systemsicherheit',
          text: 'Drei gewaltige Transaktionen über 80.000, 65.000 und 52.000 Credits! Jetzt müssen wir herausfinden, wer das Geld empfangen hat.',
          sqlTip: 'Die Reihenfolge der SQL-Klauseln lautet: SELECT -> FROM -> WHERE -> ORDER BY -> LIMIT.',
        },
      ],
    },
    8: {
      title: 'Musteranalyse der Geldempfänger',
      sqlConcept: 'Angewandt 3: GROUP BY Empfänger-Aggregation',
      conceptBadge: 'GROUP BY · Empfänger',
      briefing:
        'In Thema 1 hast du nach Absendern gruppiert. Nun kehren wir die Perspektive um: Gruppiere nach Empfängern (receiver_id) in Transactions und berechne die Anzahl der empfangenen Zahlungen (COUNT(*)) sowie die Gesamtsumme (SUM(amount)).',
      objectiveSummary:
        'Gruppiere Transactions nach receiver_id und ermittle receiver_id, Empfangszahl (COUNT) und Gesamtempfang (SUM(amount)).',
      starterQuery:
        '-- Thema 2 - Stufe 3\n',
      hints: [
        'Verwende receiver_id als Kriterium in der GROUP BY-Klausel.',
        'Wähle receiver_id, COUNT(*) AS tx_count, SUM(amount) AS total_received aus.',
        'Musterlösung: SELECT receiver_id, COUNT(*) AS tx_count, SUM(amount) AS total_received FROM Transactions GROUP BY receiver_id;',
      ],
      successDialogue: [
        {
          speakerName: 'Leitende Analystin Ahri',
          speakerRole: 'Leiterin Datenanalyse (Aegis Bureau)',
          text: 'Das Empfänger-Ranking ist eindeutig! Empfänger 1008 hat insgesamt 145.000 Credits erhalten. Dahinter steckt der berüchtigte Hacker Zed! Sein Konto muss sofort gesperrt werden.',
          sqlTip: 'Durch den Wechsel der Gruppierungsachse von Absender zu Empfänger lassen sich kriminelle Geldsenken sofort entlarven.',
        },
      ],
    },
    9: {
      title: 'Notfall-Vermögenssperre für Hauptverdächtigen',
      sqlConcept: 'Angewandt 4: Gezieltes UPDATE (FROZEN)',
      conceptBadge: 'UPDATE · Konto-Sperre',
      briefing:
        'Hacker Zed (citizen_id = 1008) ist die zentrale Zielperson des Geldflusses. Führe ein UPDATE auf der Tabelle Citizens aus, um seinen Status auf \'FROZEN\' (Eingefroren) zu setzen und weitere Systemmanipulationen zu verhindern!',
      objectiveSummary:
        "Setze in Citizens mit UPDATE den status auf 'FROZEN' für den Bürger mit citizen_id = 1008.",
      starterQuery:
        '-- Thema 2 - Stufe 4\n',
      hints: [
        'Syntax: UPDATE Citizens SET status = ... WHERE citizen_id = 1008;',
        "Setze den Textwert 'FROZEN' in einfache Anführungszeichen.",
        "Musterlösung: UPDATE Citizens SET status = 'FROZEN' WHERE citizen_id = 1008;",
      ],
      successDialogue: [
        {
          speakerName: 'Sicherheitsinspektor Jayce',
          speakerRole: 'Leiter Systemsicherheit',
          text: 'Konto und Zugriff von Zed (1008) wurden eingefroren! Seine Verbindung ist gekappt. Als letzten Schritt müssen wir Bürger und Organisationen abgleichen.',
          sqlTip: 'In der Cybersicherheit dient gezieltes UPDATE dazu, kompromittierte Konten in Sekundenschnelle zu isolieren.',
        },
      ],
    },
    10: {
      title: 'Bürger und Organisationen abgleichen',
      sqlConcept: 'Angewandt 5: INNER JOIN Relationale Analyse',
      conceptBadge: 'INNER JOIN · Organisationen',
      briefing:
        'Um das kriminelle Netzwerk vollständig aufzudecken, verbinde die Tabellen Citizens und Organizations über den Fremdschlüssel org_id. Zeige für alle Bürger den Namen (Citizens.name), die Rolle (Citizens.role) und den Organisationsnamen (Organizations.name AS org_name) an.',
      objectiveSummary:
        'Verknüpfe Citizens und Organizations über org_id mit JOIN und gib Citizens.name, Citizens.role und Organizations.name aus.',
      starterQuery:
        '-- Thema 2 - Stufe 5\n',
      hints: [
        'Verwende JOIN Organizations ON Citizens.org_id = Organizations.org_id.',
        'Wähle Citizens.name, Citizens.role und Organizations.name im SELECT aus.',
        'Musterlösung: SELECT Citizens.name, Citizens.role, Organizations.name AS org_name FROM Citizens JOIN Organizations ON Citizens.org_id = Organizations.org_id;',
      ],
      successDialogue: [
        {
          speakerName: 'Leitende Analystin Ahri',
          speakerRole: 'Leiterin Datenanalyse (Aegis Bureau)',
          text: 'Der Fall ist gelöst! Jhin aus dem Helios-Labor und Zed vom Null-Sequence-Syndikat haben zusammengearbeitet. Du hast alle 10 Stufen meisterhaft mit reinem SQL aufgeklärt!',
          sqlTip: 'Herzlichen Glückwunsch! Du hast das Grundlagen-Tutorial und die angewandten Praxisermittlungen erfolgreich gemeistert.',
        },
      ],
    },
  },
  ko: {
    1: {
      title: '시스템 부팅과 시민 명부 열람',
      sqlConcept: '1단계: SELECT / FROM',
      conceptBadge: 'SELECT · FROM',
      briefing:
        '신입 데이터 수사관 이즈리얼, 아이기스 수사국에 합류한 것을 환영합니다. 오늘 새벽 헬리오스 코어 연구소에서 대규모 데이터 유출 경보가 발생했습니다. 먼저 중앙 데이터베이스가 정상 작동하는지 확인하기 위해 시민 명부(`Citizens`) 테이블의 모든 데이터를 조회하세요.',
      objectiveSummary:
        'Citizens 테이블의 모든 컬럼과 모든 행(10명)을 조회하는 SELECT 쿼리를 작성하고 실행하세요.',
      starterQuery:
        '-- 테마 1 - 1단계\n',
      hints: [
        '모든 컬럼을 조회할 때는 별표(*) 기호를 사용합니다: SELECT *',
        '어느 테이블에서 가져올지 지정할 때는 FROM 테이블명 을 작성합니다.',
        '정답 예시: SELECT * FROM Citizens;',
      ],
      successDialogue: [
        {
          speakerName: '아리 팀장',
          speakerRole: '수석 데이터 분석팀장',
          text: '좋아요! Citizens 테이블의 10명 명단이 정상적으로 출력되었군요. 잠깐, 3번 시민인 Dr. 하이머딩거(Dr. Heimerdinger) 박사의 상태(status) 컬럼을 보세요... MISSING(실종)으로 바뀌어 있어요!',
          sqlTip: 'SELECT * FROM 테이블명 은 테이블의 전체 구조를 빠르게 파악할 때 가장 먼저 사용하는 기본 쿼리입니다.',
        },
      ],
    },
    2: {
      title: '실종된 아키텍트와 고위험 인물 추적',
      sqlConcept: '2단계: WHERE 조건절',
      conceptBadge: 'WHERE · 조건 필터링',
      briefing:
        'Dr. 하이머딩거는 헬리오스 양자서버실의 설계자입니다. 그녀가 실종된 시각, 보안 등급(clearance_level)이 4등급 이상인 내부자만 접근할 수 있는 구역에서 이상 신호가 잡혔습니다. 정확히 실종 상태(`status = \'MISSING\'`)인 시민 레코드를 `WHERE` 절로 찾아내세요.',
      objectiveSummary:
        "Citizens 테이블에서 WHERE 절을 사용하여 status 컬럼 값이 'MISSING'인 시민을 조회하세요.",
      starterQuery:
        '-- 테마 1 - 2단계\n',
      hints: [
        '특정 조건에 맞는 행만 골라낼 때는 FROM 절 뒤에 WHERE 조건식 을 작성합니다.',
        "문자열 값을 비교할 때는 작은따옴표(')를 사용합니다: WHERE status = 'MISSING'",
        "정답 예시: SELECT * FROM Citizens WHERE status = 'MISSING';",
      ],
      successDialogue: [
        {
          speakerName: '제이스 감독관',
          speakerRole: '시스템 보안 감독관',
          text: '확실하군. 고유번호 1003번, Dr. 하이머딩거(Dr. Heimerdinger). 보안 등급 5등급 아키텍트가 어젯밤 서버실 백업 직후 자취를 감췄어. 이제 그 시간대 보안 로그를 뒤져봐야겠어.',
          sqlTip: "WHERE 절에서는 =, !=, >, <, >=, <= 연산자와 AND, OR, IN, LIKE 등을 조합해 원하는 데이터만 정밀하게 추출할 수 있습니다.",
        },
      ],
    },
    3: {
      title: '심야의 침입자: 최상위 위협 로그 색출',
      sqlConcept: '3단계: ORDER BY / LIMIT',
      conceptBadge: 'ORDER BY · LIMIT',
      briefing:
        '보안 로그 테이블(`SecurityLogs`)에는 수많은 출입 기록이 쌓여 있습니다. 각 로그에는 인공지능 보안 감시망이 매긴 위협 점수(`threat_score`)가 기록되어 있습니다. 위협 점수(`threat_score`)가 가장 높은 순서(내림차순, `DESC`)로 정렬한 뒤, 상위 **3건**의 보안 로그만 추출하여 가장 위험했던 침입 시도를 찾아내세요!',
      objectiveSummary:
        'SecurityLogs 테이블을 threat_score 내림차순(DESC)으로 정렬하고 LIMIT 3을 사용해 상위 3건만 조회하세요.',
      starterQuery:
        '-- 테마 1 - 3단계\n',
      hints: [
        '데이터를 큰 값부터 작은 값 순서(내림차순)로 정렬할 때는 ORDER BY 컬럼명 DESC 를 사용합니다.',
        '출력할 행의 개수를 제한할 때는 쿼리 마지막에 LIMIT 개수 를 붙입니다.',
        '정답 예시: SELECT * FROM SecurityLogs ORDER BY threat_score DESC LIMIT 3;',
      ],
      successDialogue: [
        {
          speakerName: '아리 팀장',
          speakerRole: '수석 데이터 분석팀장',
          text: '상위 3건의 위협 로그를 보세요! log_id 9009번은 해커가 남긴 가짜 노이즈 로그이고, 9004번(citizen_id: 1008)과 9005번(citizen_id: 1004, CORE_TABLE_EXPORT)이 실제 범행 흔적이에요!',
          sqlTip: 'ORDER BY 컬럼 DESC LIMIT N 조합은 Top-N 랭킹이나 가장 위험한 이벤트를 즉시 찾아낼 때 실무에서도 매일 쓰입니다.',
        },
      ],
    },
    4: {
      title: '오염된 보안 기록 정정 및 용의자 상태 갱신',
      sqlConcept: '4단계: UPDATE',
      conceptBadge: 'UPDATE · 상태 갱신',
      briefing:
        '방금 발견한 `SecurityLogs`의 9005번 로그(`CORE_TABLE_EXPORT`)를 일으킨 인물은 `citizen_id = 1004` (진, 코어 시스템 엔지니어)입니다! `Citizens` 테이블에서 진(`citizen_id = 1004`)의 상태(`status`)를 `UPDATE` 문을 사용해 `\'SUSPECT\'`(용의자)로 변경하세요!',
      objectiveSummary:
        "UPDATE 문을 사용하여 Citizens 테이블에서 citizen_id = 1004 인 행의 status 값을 'SUSPECT'로 수정하세요.",
      starterQuery:
        '-- 테마 1 - 4단계\n',
      hints: [
        '기존 데이터를 수정할 때는 UPDATE 테이블명 SET 컬럼 = 값 WHERE 조건; 문법을 사용합니다.',
        'WHERE 절을 생략하면 모든 시민의 상태가 바뀌어버리니 반드시 WHERE citizen_id = 1004 를 지정하세요!',
        "정답 예시: UPDATE Citizens SET status = 'SUSPECT' WHERE citizen_id = 1004;",
      ],
      successDialogue: [
        {
          speakerName: '제이스 감독관',
          speakerRole: '시스템 보안 감독관',
          text: '진(citizen_id: 1004)을 공식 용의자(SUSPECT)로 전환 완료했군! 이제 진이 데이터를 빼돌린 대가로 뒷돈을 얼마나 챙겼는지 금융 거래(`Transactions`)를 추적하자.',
          sqlTip: 'UPDATE와 DELETE를 실행할 때는 항상 WHERE 조건절이 정확한지 먼저 확인하는 습관이 필수적입니다.',
        },
      ],
    },
    5: {
      title: '검은 자금의 흐름: 송금자별 거래 집계',
      sqlConcept: '5단계: GROUP BY / 집계 함수',
      conceptBadge: 'GROUP BY · 집계 함수',
      briefing:
        '금융 거래 테이블(`Transactions`)에는 수상한 자금 이체 내역들이 있습니다. 누가 얼마나 많은 돈을 보냈는지 파악하기 위해, 송금자 ID(`sender_id`)별로 그룹화(`GROUP BY`)하여 **거래 건수(`COUNT(*)`)**와 **총 송금액(`SUM(amount)`)**을 조회하세요.',
      objectiveSummary:
        'Transactions 테이블에서 sender_id 별로 GROUP BY 하여 sender_id, 거래 건수(COUNT), 총 송금액(SUM(amount))을 조회하세요.',
      starterQuery:
        '-- 테마 1 - 5단계\n',
      hints: [
        '특정 컬럼을 기준으로 묶어서 통계를 낼 때는 GROUP BY 컬럼명 을 사용합니다.',
        '건수는 COUNT(*), 합계는 SUM(amount) 집계 함수를 SELECT 절에 넣습니다.',
        '정답 예시: SELECT sender_id, COUNT(*) AS tx_count, SUM(amount) AS total_sent FROM Transactions GROUP BY sender_id;',
      ],
      successDialogue: [
        {
          speakerName: '아리 팀장',
          speakerRole: '수석 데이터 분석팀장',
          text: '기초 튜토리얼을 훌륭하게 완수하셨습니다! sender_id 1004번(진)이 총 3건, 162,000 크레딧을 외부로 빼돌렸군요. 이제 테마 2에서 배운 지식을 스스로 응용하여 본격적인 실전 수사에 나설 차례입니다!',
          sqlTip: 'GROUP BY와 집계 함수(COUNT, SUM, AVG)를 결합하면 방대한 거래 기록도 단 몇 줄의 요약 통계표로 압축할 수 있습니다.',
        },
      ],
    },
    6: {
      title: '고위험 내부 인가자 추적',
      sqlConcept: '응용 1단계: WHERE 다중 조건 (AND)',
      conceptBadge: 'WHERE · 복합 조건',
      briefing:
        '기초 튜토리얼을 마친 이즈리얼 수사관, 이제 실전 응용 수사입니다! 헬리오스 서버실 사건 당시 출입 인가권을 가진 인물 중, 높은 보안 등급(`clearance_level >= 4`)을 가졌으면서 현재 활동 중(`status = \'ACTIVE\'`)인 고위험 시민들을 모두 추려내세요. 단일 조건이 아닌 `AND` 연산자를 응용해 두 조건을 동시에 만족하는 대상자들을 추출하세요.',
      objectiveSummary:
        "Citizens 테이블에서 clearance_level이 4 이상이고 status가 'ACTIVE'인 시민들을 WHERE ... AND ... 조건으로 조회하세요.",
      starterQuery:
        '-- 테마 2 - 1단계\n',
      hints: [
        '여러 조건을 동시에 만족해야 할 때는 WHERE 조건1 AND 조건2 문법을 사용합니다.',
        "숫자 비교는 clearance_level >= 4, 문자열 비교는 status = 'ACTIVE' 로 작성합니다.",
        "정답 예시: SELECT * FROM Citizens WHERE clearance_level >= 4 AND status = 'ACTIVE';",
      ],
      successDialogue: [
        {
          speakerName: '아리 팀장',
          speakerRole: '수석 데이터 분석팀장',
          text: '완벽한 조건 조합입니다! 보안 등급 4 이상이면서 ACTIVE 상태인 인물들이 정밀하게 추출되었어요. 제이스 감독관과 세라핀 감사관, 그리고 진이 명단에 있군요. 이들의 금융 거래를 교차 확인해야 합니다.',
          sqlTip: '실무에서는 여러 보안 조건을 AND 또는 OR로 결합해 정밀한 표적 집단을 신속하게 추출합니다.',
        },
      ],
    },
    7: {
      title: '거액 비자금 흐름 포착',
      sqlConcept: '응용 2단계: WHERE + ORDER BY + LIMIT',
      conceptBadge: '조건 필터 · 정렬 · 제한',
      briefing:
        '신디케이트와의 자금 거래 중 50,000 크레딧 이상의 비정상 거액 거래(`amount >= 50000`)들이 포착되었습니다. 이 중에서 가장 큰 금액 순서(내림차순, `DESC`)로 상위 **3건**의 거래 내역을 추출하여 주범들의 자금 흐름 규모를 파악하세요.',
      objectiveSummary:
        'Transactions 테이블에서 amount >= 50000 인 거래를 amount 기준 내림차순(DESC)으로 정렬하고 상위 3건(LIMIT 3)만 조회하세요.',
      starterQuery:
        '-- 테마 2 - 2단계\n',
      hints: [
        'WHERE 절로 50,000 이상의 거래를 먼저 거릅니다: WHERE amount >= 50000',
        '그 후 ORDER BY amount DESC 로 큰 금액부터 정렬하고, 마지막에 LIMIT 3 을 붙입니다.',
        '정답 예시: SELECT * FROM Transactions WHERE amount >= 50000 ORDER BY amount DESC LIMIT 3;',
      ],
      successDialogue: [
        {
          speakerName: '제이스 감독관',
          speakerRole: '시스템 보안 감독관',
          text: '거래 내역 상위 3건을 봐! 80,000 크레딧, 65,000 크레딧, 52,000 크레딧... 엄청난 액수의 자금이 한곳으로 흘러들어가고 있어. 이 돈을 받아 챙긴 수신자가 누구인지 집계해야 한다.',
          sqlTip: 'WHERE 조건으로 노이즈 데이터를 먼저 제거한 뒤 ORDER BY와 LIMIT을 적용하면 질의 성능과 결과 정확도가 대폭 향상됩니다.',
        },
      ],
    },
    8: {
      title: '검은 자금의 수신 거점 분석',
      sqlConcept: '응용 3단계: GROUP BY 수신자 집계',
      conceptBadge: 'GROUP BY · 수신 집계',
      briefing:
        '튜토리얼에서는 돈을 보낸 사람(sender_id)을 집계했습니다. 이제 실제로 불법 자금이 누구에게 모여들었는지 밝혀야 합니다. 거래 테이블(`Transactions`)에서 **수신인 ID(`receiver_id`)**별로 묶어, 각 수신인이 받은 **거래 건수(`COUNT(*)`)**와 **총 수신 금액(`SUM(amount)`)**을 계산하세요.',
      objectiveSummary:
        'Transactions 테이블에서 receiver_id 별로 GROUP BY 하여 receiver_id, 거래 건수(COUNT), 총 수신액(SUM(amount))을 조회하세요.',
      starterQuery:
        '-- 테마 2 - 3단계\n',
      hints: [
        'sender_id 대신 receiver_id 컬럼을 기준으로 GROUP BY 절을 작성합니다.',
        'SELECT 절에는 receiver_id, COUNT(*), SUM(amount) 를 명시합니다.',
        '정답 예시: SELECT receiver_id, COUNT(*) AS tx_count, SUM(amount) AS total_received FROM Transactions GROUP BY receiver_id;',
      ],
      successDialogue: [
        {
          speakerName: '아리 팀장',
          speakerRole: '수석 데이터 분석팀장',
          text: '수신 집계표가 명백한 증거를 보여줍니다! receiver_id 1008번이 총 145,000 크레딧을 받아 챙겼어요. 이 인물은 널 시퀀스의 전문 해커 제드입니다! 당장 계좌를 동결해야 해요.',
          sqlTip: '거래 데이터에서 송신자와 수신자 양방향을 모두 GROUP BY로 분석하면 자금의 발원지와 종착지를 완벽히 추적할 수 있습니다.',
        },
      ],
    },
    9: {
      title: '핵심 용의자 계좌 및 자산 긴급 동결',
      sqlConcept: '응용 4단계: 조건부 UPDATE',
      conceptBadge: 'UPDATE · 자산 동결',
      briefing:
        '수신 자금 집계 결과, 고스트 프로토콜 해커 제드(`citizen_id = 1008`)에게 145,000 크레딧의 거액이 집중 수신된 것이 확인되었습니다. 추가적인 데이터 탈취와 자금 세탁을 막기 위해, `UPDATE` 문을 실행하여 `citizen_id = 1008`인 시민의 `status`를 `\'FROZEN\'`(자산 동결)으로 즉각 변경하세요!',
      objectiveSummary:
        "UPDATE 문을 사용하여 Citizens 테이블에서 citizen_id = 1008 인 행의 status 값을 'FROZEN'으로 수정하세요.",
      starterQuery:
        '-- 테마 2 - 4단계\n',
      hints: [
        'UPDATE Citizens SET status = ... WHERE citizen_id = 1008; 구조를 사용합니다.',
        "지정할 상태 값은 작은따옴표로 감싼 'FROZEN' 입니다.",
        "정답 예시: UPDATE Citizens SET status = 'FROZEN' WHERE citizen_id = 1008;",
      ],
      successDialogue: [
        {
          speakerName: '제이스 감독관',
          speakerRole: '시스템 보안 감독관',
          text: '제드(1008)의 모든 계좌와 네트워크 접근 권한이 성공적으로 FROZEN(동결)되었다! 이제 외부와의 통신이 모두 차단됐다. 마지막으로 사건에 연루된 시민들과 조직들의 관계를 교차 검증하자.',
          sqlTip: '사이버 보안 실무에서 조건부 UPDATE는 침해 계정을 즉시 격리하거나 비밀번호를 강제 만료시키는 긴급 방어 조치로 활용됩니다.',
        },
      ],
    },
    10: {
      title: '시민과 소속 기관 교차 검증',
      sqlConcept: '응용 5단계: INNER JOIN 교차 검증',
      conceptBadge: 'INNER JOIN · 기관 대조',
      briefing:
        '동결 조치 이후, 이즈리얼 수사관은 시민들의 소속 기관 배후를 전면 파악하고자 합니다. `Citizens` 테이블과 `Organizations` 테이블을 `org_id` 외래키로 결합(`JOIN`)하여, 각 시민의 **이름(`Citizens.name`)**, **역할(`Citizens.role`)**, **소속 기관명(`Organizations.name`)**을 한눈에 결합 조회하여 사건의 전모를 밝혀내세요!',
      objectiveSummary:
        'Citizens와 Organizations 테이블을 org_id 기준으로 JOIN하여 시민 이름(Citizens.name), 역할(Citizens.role), 소속 기관명(Organizations.name)을 조회하세요.',
      starterQuery:
        '-- 테마 2 - 5단계\n',
      hints: [
        '두 테이블의 공통 연결 키는 org_id 입니다: ON Citizens.org_id = Organizations.org_id',
        'SELECT 절에 Citizens.name, Citizens.role, Organizations.name 을 명시합니다.',
        '정답 예시: SELECT Citizens.name, Citizens.role, Organizations.name AS org_name FROM Citizens JOIN Organizations ON Citizens.org_id = Organizations.org_id;',
      ],
      successDialogue: [
        {
          speakerName: '아리 팀장',
          speakerRole: '수석 데이터 분석팀장',
          text: '사건 전모가 완전히 밝혀졌습니다! 헬리오스 연구소의 진과 널 시퀀스의 제드가 결탁한 전모를 이즈리얼 수사관님이 SQL만으로 완벽하게 규명하셨어요. 축하합니다! 테마 1 기초부터 테마 2 실전 응용까지 모든 수사를 성공적으로 완수하셨습니다!',
          sqlTip: '축하합니다! 1단계 기초 튜토리얼부터 2단계 실전 응용 수사까지, 관계형 데이터베이스의 핵심 SQL 기술을 완벽하게 마스터하셨습니다.',
        },
      ],
    },
  },
};

// -------------------------------------------------------------
// 2. CHAPTERS I18N DATA (Chapters 1 ~ 3)
// -------------------------------------------------------------
export const CHAPTERS_I18N: Record<SupportedLanguage, Record<number, ChapterI18n>> = {
  de: {
    1: {
      title: 'Das verstummte Quanten-Herz',
      subtitle: 'SELECT · WHERE · ORDER BY / LIMIT Grundlagen',
      synopsis:
        'Neo-Archive City, 2086. Im Helios-Quantenserverlabor heult der Alarm. Chef-Architektin Dr. Heimerdinger ist spurlos verschwunden. Ermittler Ezreal beginnt die Suche mit grundlegenden SQL-Abfragen.',
      locationSector: 'SEKTOR-01 Aegis-Zentralanalyse & SEKTOR-02 Quantenserver',
      introDialogues: [
        {
          speakerName: 'Ahri',
          speakerRole: 'Leiterin Datenanalyse (Aegis Bureau)',
          text: 'Ezreal, Notstand an deinem ersten Tag. Um Mitternacht wurden Kern-Tabellen aus Labor 2 kopiert, und Dr. Heimerdinger antwortet nicht mehr.',
          sqlTip: 'Klicke jederzeit auf die Tabellen im Schema-Browser, um deren Spalten und Datentypen zu inspizieren.',
        },
        {
          speakerName: 'Jayce',
          speakerRole: 'Leiter Systemsicherheit',
          text: 'Der SQLite-Dump des Terminal-Speichers ist auf deiner Konsole bereitgestellt. Finde die Vermisste und die gefährlichsten Zugriffsprotokolle!',
        },
      ],
      objects: [
        {
          id: 'obj-ch1-terminal',
          name: 'Sicherheitskonsole von Dr. Heimerdinger',
          locationName: 'SEC-02 Quantenserverraum',
          shortDesc: 'Terminal mit dem letzten Backup-Befehl vor dem Verschwinden',
          inspectionReport:
            'Auf dem Bildschirm ist eine Notiz geöffnet: "Jemand kopiert Kern-Tabellen mit Administrator-Rechten. Prüfe den Status in Citizens und die threat_scores in SecurityLogs!"',
          unlocksClueText: 'Beweis gesichert: Status von Dr. Heimerdinger ist MISSING. Starker Verdacht auf Innentäter.',
        },
        {
          id: 'obj-ch1-cctv',
          name: 'Zugangssensor des Serverraums',
          locationName: 'SEC-02 Hauptschleuse',
          shortDesc: 'KI-Sensor zur Echtzeit-Bewertung von Bedrohungswerten (threat_score)',
          inspectionReport:
            'Sensorauswertung: Normale Rundgänge erzeugen Werte von 5–15 Punkten. Privilegieneskalation und Firewall-Bypass liegen bei über 85 Punkten.',
          unlocksClueText: 'Beweis gesichert: Unter den Top-3-Logs verbergen sich echte Einbrüche und gezielte Täuschungs-Logs.',
        },
      ],
    },
    2: {
      title: 'Das manipulierte Hauptbuch',
      subtitle: 'UPDATE · GROUP BY · JOIN Vertiefung',
      synopsis:
        'Der Datendieb ist enttarnt: Jhin aus dem Helios-Labor. Erfasse ihn als Tatverdächtigen und rekonstruiere den Geldfluss sowie seine Komplizen mit relationalen Abfragen.',
      locationSector: 'SEKTOR-03 Nexus Sky Vault & SEKTOR-04 Neon-Markt',
      introDialogues: [
        {
          speakerName: 'Jayce',
          speakerRole: 'Leiter Systemsicherheit',
          text: 'Log 9005 gehört zu citizen_id 1004 – Jhin! Aktualisiere seinen Datensatz sofort mit UPDATE auf SUSPECT!',
        },
        {
          speakerName: 'Ahri',
          speakerRole: 'Leiterin Datenanalyse',
          text: 'Bündle anschließend die Transaktionen nach Absender mit GROUP BY und verbinde die Klarnamen mit JOIN.',
          sqlTip: 'Stufe 4 nutzt UPDATE, Stufe 5 GROUP BY und SUM(), und Stufe 6 verbindet Tabellen mit JOIN.',
        },
      ],
      objects: [
        {
          id: 'obj-ch2-vault',
          name: 'Anonymes Wechselterminal Neon-Markt',
          locationName: 'SEC-04 Low City Wechselstube',
          shortDesc: 'Relaisstation für verschlüsselte Darkpool-Zahlungen',
          inspectionReport:
            'Im Cache finden sich mehrere verschlüsselte Transaktionen von Absender 1004 an Zwischenhändler der Unterwelt.',
          unlocksClueText: 'Beweis gesichert: Jhin (1004) hat 162.000 Credits an Unterwelt-Broker überwiesen.',
        },
        {
          id: 'obj-ch2-server',
          name: 'Forensischer Identitätsabgleicher',
          locationName: 'SEC-01 Aegis-Zentralanalyse',
          shortDesc: 'Modul zur Verknüpfung von Log-IDs mit Personendaten über Fremdschlüssel',
          inspectionReport:
            'Ein JOIN zwischen SecurityLogs und Citizens ordnet jeder Bedrohungszeile den vollständigen Klarnamen zu.',
          unlocksClueText: 'Beweis gesichert: Arbeitsteilung zwischen Insider Jhin und Hacker Zed nachgewiesen.',
        },
      ],
    },
    3: {
      title: 'Das Herz von Protokoll Zero',
      subtitle: 'Mehrfachfilter · Konto-Sperren · Organisationen-JOIN',
      synopsis:
        'Hinter Jhin steht das Syndikat "Null Sequence". Durchbreche die Täuschungsmanöver, friere die Konten der Täter ein und verbinde alle Fäden für den finalen Schlag.',
      locationSector: 'SEKTOR-05 Stillgelegte Station 9 & Gerichtshof',
      introDialogues: [
        {
          speakerName: 'Zed (Abgehört)',
          speakerRole: 'Ghost-Protokoll Hacker (Null Sequence)',
          text: '"Ihr Aegis-Ermittler habt lange gebraucht. Aber glaubt ihr wirklich, ihr könnt unsere Organisationen und Konten entwirren?"',
        },
        {
          speakerName: 'Ahri',
          speakerRole: 'Leiterin Datenanalyse',
          text: 'Lass dich nicht provozieren, Ezreal! Wir frieren sein Konto ein und verknüpfen Citizens mit Organizations für die lückenlose Anklage!',
        },
      ],
      objects: [
        {
          id: 'obj-ch3-badge',
          name: 'Sichergestellter Null-Sequence Token',
          locationName: 'SEC-05 U-Bahn Station 9',
          shortDesc: 'Hardware-Schlüssel mit Organisationscode ORG-NullSec',
          inspectionReport:
            'Im Speicher liegen Verweise zwischen Organizations (org_id 5) und den Mitgliedern Victor Crow und Zed.',
          unlocksClueText: 'Beweis gesichert: Station 9 dient dem Syndikat Null Sequence als Operationsbasis.',
        },
        {
          id: 'obj-ch3-doc',
          name: 'Anklageakte des Aegis-Gerichtshofs',
          locationName: 'SEC-01 Justizarchiv',
          shortDesc: 'Standardvorgabe für die relationale Beweisführung vor Gericht',
          inspectionReport:
            'Gerichtlich verwertbare Beweise erfordern den lückenlosen JOIN aller Verdächtigen mit ihren Auftraggeber-Organisationen.',
          unlocksClueText: 'Beweis gesichert: Vollständige Beweiskette für alle 10 Ermittlungsstufen geschlossen.',
        },
      ],
    },
  },
  ko: {
    1: {
      title: '침묵하는 양자 코어 (The Silent Quantum Core)',
      subtitle: 'SELECT · WHERE · ORDER BY / LIMIT 기초 수사',
      synopsis:
        '2086년 네오-아카이브 시티. 도시의 모든 기억과 금융을 관리하는 헬리오스 제1양자서버실에서 심야 데이터 유출 경보가 울리고, 수석 DB 아키텍트 Dr. 하이머딩거가 실종된다. 신입 분석관 이즈리얼는 가장 기본적인 SQL 조회 명령으로 실종자의 흔적과 심야의 침입 로그를 추적한다.',
      locationSector: 'SEC-01 아이기스 중앙 분석실 & SEC-02 양자서버실',
      introDialogues: [
        {
          speakerName: '아리 팀장',
          speakerRole: '수석 데이터 분석팀장 (Aegis Bureau)',
          text: '이즈리얼 수사관, 첫 출근날부터 비상사태야. 오늘 새벽 00시경 헬리오스 제1양자서버실(SEC-02)에서 코어 테이블이 외부로 반출됐고, 수석 아키텍트 Dr. 하이머딩거와 연락이 두절됐어.',
          sqlTip: '우측 스키마 브라우저에서 7개 핵심 테이블을 언제든 클릭해 구조를 확인할 수 있습니다.',
        },
        {
          speakerName: '제이스 감독관',
          speakerRole: '시스템 보안 감독관',
          text: '현장 단말기에서 회수한 SQLite 스냅샷을 네 콘솔에 마운트해 두었다. 먼저 시민 명부(Citizens)를 열람해서 실종자를 확인하고, 보안 로그(SecurityLogs)에서 가장 위협 점수가 높은 침입 기록을 찾아내!',
        },
      ],
      objects: [
        {
          id: 'obj-ch1-terminal',
          name: '하이머딩거 박사의 개인 보안 단말기',
          locationName: 'SEC-02 헬리오스 제1양자서버실',
          shortDesc: '실종 직전 마지막 백업 명령이 실행된 콘솔',
          inspectionReport:
            '단말기 화면에 미처 닫히지 않은 메모가 남아 있다: "누군가 내부 관리자 권한으로 코어 테이블을 복사하고 있다. 내 신변에 문제가 생기면 Citizens 테이블의 status 컬럼과 SecurityLogs의 threat_score를 확인하라."',
          unlocksClueText: '단서 획득: Dr. 하이머딩거(citizen_id: 1003)의 상태는 MISSING이며, 내부자 소행일 가능성이 높음.',
        },
        {
          id: 'obj-ch1-cctv',
          name: '양자서버실 출입 게이트 로그 기록기',
          locationName: 'SEC-02 게이트웨이',
          shortDesc: '출입자의 위협 점수(threat_score)를 자동 산출하는 AI 센서',
          inspectionReport:
            '센서 로그 분석 결과: 정상적인 순찰이나 로그인은 위협 점수가 5~15점 수준이지만, 권한 상승이나 방화벽 우회 시도는 85점 이상의 고위험 점수로 기록된다.',
          unlocksClueText: '단서 획득: 위협 점수 상위 3건의 로그에 실제 침입자와 해커가 남긴 교란용 로그가 섞여 있음.',
        },
      ],
    },
    2: {
      title: '오염된 원장과 내부의 그림자 (Corrupted Ledger)',
      subtitle: 'UPDATE · GROUP BY · JOIN 심화 수사',
      synopsis:
        '양자서버실에서 코어 테이블을 반출한 내부자가 헬리오스 연구소의 엔지니어 진(citizen_id: 1004)임이 드러났다. 용의자의 신분을 데이터베이스에 즉시 갱신(UPDATE)하고, 그룹 집계(GROUP BY)와 테이블 결합(JOIN)을 통해 검은 자금의 규모와 공범의 실명을 밝혀내라.',
      locationSector: 'SEC-03 넥서스 스카이 볼트 & SEC-04 네온 마켓 환전소',
      introDialogues: [
        {
          speakerName: '제이스 감독관',
          speakerRole: '시스템 보안 감독관',
          text: '9005번 로그(CORE_TABLE_EXPORT)를 실행한 citizen_id 1004번이 누군지 확인했나? 바로 헬리오스 연구소의 코어 시스템 엔지니어 진(Jhin)이다! 즉시 Citizens 테이블에서 그의 상태를 SUSPECT(용의자)로 UPDATE 해!',
        },
        {
          speakerName: '아리 팀장',
          speakerRole: '수석 데이터 분석팀장',
          text: '용의자 등록을 마친 뒤에는 금융 거래 테이블(Transactions)을 송금자별로 GROUP BY 집계해서 진이 외부로 빼돌린 자금 총액을 계산하고, JOIN으로 공범들의 실명을 모두 연결해 주세요.',
          sqlTip: '4단계에서는 UPDATE 문을, 5단계에서는 GROUP BY와 SUM()을, 6단계에서는 JOIN ... ON 구문을 실전 데이터에 적용합니다.',
        },
      ],
      objects: [
        {
          id: 'obj-ch2-vault',
          name: '네온 마켓 익명 환전 키오스크',
          locationName: 'SEC-04 로우 시티 환전소',
          shortDesc: '다크풀 암호화폐 이체가 이루어진 중계 단말기',
          inspectionReport:
            '환전소 캐시 메모리에서 송금자 ID(sender_id) 1004번이 보낸 다수의 암호화 송금 패킷이 발견되었다.',
          unlocksClueText: '단서 획득: 진(1004)은 총 3차례에 걸쳐 162,000 크레딧을 지하 조직 브로커와 해커에게 송금함.',
        },
        {
          id: 'obj-ch2-server',
          name: '보안 로그-시민 신원 교차 분석기',
          locationName: 'SEC-01 아이기스 중앙 분석실',
          shortDesc: '외래키(citizen_id)를 기준으로 실명을 매핑하는 분석 모듈',
          inspectionReport:
            'SecurityLogs 테이블의 citizen_id와 Citizens 테이블의 citizen_id를 JOIN하면 각 보안 이벤트를 일으킨 인물의 실명과 직책을 한눈에 대조할 수 있다.',
          unlocksClueText: '단서 획득: 내부자 진과 외부 해커 제드(Zed)의 역할 분담 확인.',
        },
      ],
    },
    3: {
      title: '제로 프로토콜의 심장 (Heart of Protocol Zero)',
      subtitle: '복합 조건 · 계좌 동결 · 조직 교차 대조',
      synopsis:
        '내부자 진의 배후에는 지하 해커 조직 "널 시퀀스 신디케이트(Null Sequence)"가 있었다. 복합 필터와 계좌 동결, 그리고 조직 간의 JOIN 관계망으로 배후 조직을 완벽히 규명하고 사건을 종결하라.',
      locationSector: 'SEC-05 구 지하철 제9폐쇄역 & 아이기스 대법정',
      introDialogues: [
        {
          speakerName: '제드 (감청된 통신)',
          speakerRole: '고스트 프로토콜 해커 (Null Sequence)',
          text: '"흥, 아이기스 신입 분석관이 여기까지 꼬리를 밟았군. 하지만 우린 Organizations와 Transactions에 걸쳐 데이터를 분산해 두었지."',
        },
        {
          speakerName: '아리 팀장',
          speakerRole: '수석 데이터 분석팀장',
          text: '도발에 넘어가지 마세요, 이즈리얼! 불법 수신 계좌를 동결하고 Organizations 테이블과의 JOIN으로 조직망 전체를 기소합시다!',
        },
      ],
      objects: [
        {
          id: 'obj-ch3-badge',
          name: '압수된 널 시퀀스 암호화 토큰',
          locationName: 'SEC-05 구 지하철 제9폐쇄역 입구',
          shortDesc: '조직 코드 ORG-NullSec 이 각인된 하드웨어 키',
          inspectionReport:
            '토큰 내부에 Organizations(org_id: 5)와 소속 조직원 빅토르, 제드의 연결 정보가 들어 있다.',
          unlocksClueText: '단서 획득: 빅토르와 제드는 널 시퀀스 신디케이트(org_id: 5) 소속임.',
        },
        {
          id: 'obj-ch3-doc',
          name: '아이기스 대법정 최종 기소장',
          locationName: 'SEC-01 아이기스 법무 아카이브',
          shortDesc: '전체 사건 관련자 및 조직 교차 검증 서류',
          inspectionReport:
            '법정 증거 채택을 위해 Citizens와 Organizations 테이블을 JOIN하여 각 인물의 소속과 역할을 공식 확인해야 한다.',
          unlocksClueText: '단서 획득: 10단계 전 과정에 대한 법정 유죄 입증 자료 완성.',
        },
      ],
    },
  },
};

// -------------------------------------------------------------
// 3. TABLE DESCRIPTIONS I18N
// -------------------------------------------------------------
export const TABLE_DESCRIPTIONS_I18N: Record<SupportedLanguage, Record<string, string>> = {
  de: {
    Organizations: 'Institutionen, Konzerne und Forschungslabore in Neo Archive City (PK: org_id)',
    Locations: 'Städtische Bezirke und Hochsicherheitszonen (PK: location_id, FK: managed_by_org_id)',
    Citizens: 'Registrierte Bürger, Forscher und Sicherheitspersonal (PK: citizen_id, FK: org_id, home_location_id)',
    Transactions: 'Digitale Finanztransaktionen und Kreditüberweisungen (PK: tx_id, FK: sender_id, receiver_id)',
    SecurityLogs: 'Zutritts- und Terminal-Sicherheitsprotokolle (PK: log_id, FK: citizen_id, location_id)',
    Missions: 'Offizielles Register der SQL-Ermittlungsmissionen (PK: mission_id)',
    Evidence: 'Gesicherte Fallbeweise und geheime Archive (PK: evidence_id, FK: mission_id)',
  },
  ko: {
    Organizations: '네오-아카이브 시티의 주요 기관·기업·연구 조직 정보 (PK: org_id)',
    Locations: '도시 내 주요 시설 및 보안 구역 정보 (PK: location_id, FK: managed_by_org_id)',
    Citizens: '등록된 시민 및 연구원·보안 요원 인적사항 (PK: citizen_id, FK: org_id, home_location_id)',
    Transactions: '디지털 크레딧 송금 및 자금 거래 기록 (PK: tx_id, FK: sender_id, receiver_id, location_id)',
    SecurityLogs: '구역 출입 및 단말기 접근 보안 로그 (PK: log_id, FK: citizen_id, location_id)',
    Missions: '수사국 공식 SQL 조사 미션 레지스트리 (PK: mission_id)',
    Evidence: '수집된 사건 증거물 및 기밀 단서 아카이브 (PK: evidence_id, FK: mission_id, related_citizen_id)',
  },
};

// -------------------------------------------------------------
// 4. ACHIEVEMENTS I18N
// -------------------------------------------------------------
export const ACHIEVEMENTS_I18N: Record<SupportedLanguage, AchievementI18n[]> = {
  de: [
    {
      id: 'ach-first-query',
      title: 'Erster SQL-Befehl ausgeführt',
      desc: 'Erfolgreich die erste SELECT-Abfrage auf der Aegis-Konsole ausgeführt.',
      rewardBadge: 'BRONZE ANALYST',
    },
    {
      id: 'ach-ch1-clear',
      title: 'Quantenkern-Ermittler',
      desc: 'Kapitel 1 (SELECT, WHERE, ORDER BY / LIMIT) abgeschlossen.',
      rewardBadge: 'CORE TRACKER',
    },
    {
      id: 'ach-ch2-clear',
      title: 'Schattenbuch-Jäger',
      desc: 'Kapitel 2 (UPDATE, GROUP BY, AND) abgeschlossen.',
      rewardBadge: 'JOIN MASTER',
    },
    {
      id: 'ach-field-detective',
      title: 'Tatort-Spurensucher',
      desc: 'Mindestens 3 Sicherheitsgeräte und Terminals am Tatort gescannt.',
      rewardBadge: 'FIELD SCANNER',
    },
    {
      id: 'ach-master-architect',
      title: 'Legende von Projekt Database Zero',
      desc: 'Alle 10 Stufen der Ermittlung erfolgreich abgeschlossen.',
      rewardBadge: 'DATABASE ZERO LEGEND',
    },
  ],
  ko: [
    {
      id: 'ach-first-query',
      title: '첫 번째 쿼리 실행',
      desc: '아이기스 수사국 SQLite 콘솔에서 첫 SELECT 쿼리를 성공적으로 실행했습니다.',
      rewardBadge: 'BRONZE ANALYST',
    },
    {
      id: 'ach-ch1-clear',
      title: '침묵하는 양자 코어 해독자',
      desc: 'CHAPTER 01 (SELECT, WHERE, ORDER BY / LIMIT) 3개 스테이지를 모두 완수했습니다.',
      rewardBadge: 'CORE TRACKER',
    },
    {
      id: 'ach-ch2-clear',
      title: '검은 원장의 추적자',
      desc: 'CHAPTER 02 (UPDATE, GROUP BY, AND) 4개 스테이지를 모두 완수했습니다.',
      rewardBadge: 'JOIN MASTER',
    },
    {
      id: 'ach-field-detective',
      title: '현장 단서 수집가',
      desc: '2D 수사 현장의 단말기 및 보안 장비 오브젝트를 3개 이상 직접 스캔했습니다.',
      rewardBadge: 'FIELD SCANNER',
    },
    {
      id: 'ach-master-architect',
      title: '제로 프로토콜 마스터 아키텍트',
      desc: '10단계 SQL 커리큘럼 전 과정을 완수하고 배후 조직을 규명했습니다.',
      rewardBadge: 'DATABASE ZERO LEGEND',
    },
  ],
};

// -------------------------------------------------------------
// 5. COMPREHENSIVE UI TRANSLATIONS
// -------------------------------------------------------------
export const UI_TRANSLATIONS = {
  de: {
    appTitle: 'PROJECT DATABASE ZERO',
    appBureau: 'AEGIS DATA INVESTIGATION BUREAU',
    appHeadline: 'Neo Archive City: Enthülle die Wahrheit hinter den verschwundenen Daten',
    appSubheadline: 'SQL-Datenermittlungs-Abenteuer im Jahr 2086',
    ariaSpeech: 'Genau in diesem Moment... verschwinden geheime Daten!',
    startInvestigation: 'Ermittlung starten',
    startInvestigationSub: 'Neuen Fall untersuchen',
    continueInvestigation: 'Fortsetzen',
    continueInvestigationSub: 'Am letzten Checkpoint weiter',
    settingsBtn: 'Einstellungen',
    settingsSub: 'Umgebung anpassen',
    chapterProgress: 'Kapitelfortschritt',
    sqlMastery: 'SQL-Meisterschaft',
    sqlStagesHeading: 'SQL-Ermittlungsstufen',
    sqlStagesSub: 'Schließe jede Stufe ab, um tiefer in die Wahrheit einzudringen',
    statusCompleted: 'Abgeschlossen',
    statusActive: 'In Bearbeitung',
    statusLocked: 'Gesperrt',
    lockedAlert: 'Vorherige Stufe muss zuerst abgeschlossen werden!',

    // Themes
    theme1Tab: 'Thema 1: Grundlagen-Tutorial',
    theme2Tab: 'Thema 2: Angewandte Ermittlung',
    theme1Subtitle: 'Stufe 1~5: Erlernen der SQL-Grundbausteine',
    theme2Subtitle: 'Stufe 6~10: Eigenständige Anwendung im Praxisfall',
    themeLockedAlert: 'Schließe zuerst alle 5 Stufen von Thema 1 ab!',

    // Navbar
    navHome: 'Startseite',
    navConsole: 'Ermittlungskonsole',
    navCodex: 'Archiv & Handbuch',
    navStats: 'Statistik',
    navAchievements: 'Erfolge',
    soundToggle: 'Ton umschalten',
    langToggle: 'Sprache / Language',

    // Console
    missionTab: 'Mission',
    guidebookTab: 'Handbuch',
    storyTab: 'Story',
    cluesTab: 'Beweise',
    emergencyHintBtn: '💡 Notfall-Hinweis',
    resetDbBtn: 'DB Zurücksetzen',
    allMissionsBtn: 'Alle Missionen & Beweise',
    tablePreviewNotice: 'In rechter Tabelle anzeigen',
    quickSyntax: 'Schnell-Syntax:',
    runQuery: 'Ausführen (RUN)',
    dbQuickCheckTitle: 'DB-Schnellansicht & Tabellenstruktur',
    queryResultTitle: 'Abfrageergebnis-Tabelle (QUERY OUTPUT)',
    queryRows: 'Zeilen',
    queryCols: 'Spalten',
    queryDuration: 'Laufzeit:',
    querySuccess: 'Erfolgreich',
    queryError: 'SQL-Fehler',
    missionCompletedBadge: 'Missionsziel erreicht!',
    nextMissionBtn: 'Zur nächsten Stufe',
    emptyResultNotice: 'Noch kein SQL-Abfrageergebnis vorhanden.',
    emptyResultSub: 'Tippe deine Abfrage ein und drücke "Ausführen (RUN)" oder Ctrl + Enter.',
    resetStarterQuery: 'Standardabfrage',
    clearEditor: 'Leeren',
    monacoMode: 'Monaco-Modus',
    lightMode: 'Leicht-Modus',
    shortcutRunHint: 'Ctrl+Enter Ausführen',

    // Schema Browser
    schemaBrowserTitle: 'DB-Schnellansicht & Tabellenstruktur',
    previewInResultBtn: 'In rechter Tabelle anzeigen',
    targetTableBadge: 'Fokus',
    columnsTitle: 'Spalten (Attribute):',
    sampleQueryBtn: 'Abfrage laden',

    // Modals
    hintModalTitle: 'Notfall-Ermittlungshinweis',
    hintCautionText: 'Hinweise sind stufenweise aufgebaut. Versuche zuerst, das Problem mit Stufe 1 oder 2 eigenständig zu lösen!',
    hintLevelLabel: 'Stufe',
    unlockNextHint: 'Nächste Hinweistufe aufdecken',
    allHintsUnlocked: 'Alle Hinweise aufgedeckt',
    solutionQueryLabel: 'Vollständige Musterabfrage:',
    applyQueryToEditor: 'In Editor übernehmen',
    closeBtn: 'Schließen',

    missionModalTitle: 'Ermittlungsfortschritt & Beweisarchiv',
    missionsCatalogTab: '10 Stufen SQL-Missionskatalog',
    evidenceTab: 'Gesicherte Fallbeweise',
    rewardText: 'Belohnung:',
    jumpToMissionBtn: 'Zu dieser Mission springen',
    currentActiveBtn: 'Derzeit aktiv',

    settingsTitle: 'System-Einstellungen',
    langSettingTitle: 'Sprachverwaltung / Language',
    langDesc: 'Wähle deine bevorzugte Sprache für die Benutzeroberfläche und Erklärungen.',
    soundSettingsTitle: 'Audio-Effekte',
    dataManageTitle: 'Spielstand & Daten',
    exportSaveBtn: 'Spielstand exportieren (JSON)',
    importSaveBtn: 'Spielstand importieren (JSON)',
    resetProgressBtn: 'Gesamten Fortschritt zurücksetzen',
    resetProgressConfirm: 'Möchtest du wirklich den gesamten Fortschritt löschen und die Datenbank zurücksetzen?',
    saveSuccess: 'Gespeichert',

    // Subviews (Codex, Stats, Achievements)
    codexTitle: 'Ermittlungsarchiv — Datenbankschema & Fallbeweise',
    codexSub: 'Erkunde die 7 relationalen Tabellen von Neo Archive City und freigeschaltete Beweise.',
    evidenceArchiveTitle: 'Gesicherte Fallbeweise (Evidence Archive)',
    noEvidenceYet: 'Noch keine Beweise gesichert. Schließe Missionen ab!',
    schemaOverviewTitle: 'Datenbankschema-Struktur',
    statsTitle: 'Ermittlungsstatistik & Analysehistorie',
    statsSub: 'Übersicht deiner Abfrage-Erfolgsrate und gelösten Aufgaben.',
    statTotalQueries: 'Ausgeführte Abfragen',
    statSuccessQueries: 'Erfolgreiche Abfragen',
    statSuccessRate: 'Erfolgsquote',
    statTotalXp: 'Verdiente XP',
    queryHistoryTitle: 'Kürzliche Abfrage-Historie',
    achievementsTitle: 'Ermittler-Erfolge & Abzeichen',
    achievementsSub: 'Auszeichnungen für besondere Meilensteine bei der Aufklärung des Falls.',
    pkTag: 'Primärschlüssel (PK)',
    fkTag: 'Fremdschlüssel (FK)',
    normalColTag: 'Attribut',
    allCols: 'Alle Spalten',
    insertTableName: 'Tabellenname einfügen',
    queryErrorFeedback: 'Abfragefehler aufgetreten. Prüfe die Hinweise in der Diagnosekarte unten.',
    querySuccessFeedback: 'Abfrage erfolgreich ausgeführt!',
    missionTargetCriteria: 'Abfrage ausgeführt — Prüfe die Kriterien der Mission',
    inspectingObject: 'Wird untersucht...',
    objectFound: 'Objekt gescannt!',
    guidebookLockedHint: 'Schließe diese Stufe ab, um den entsprechenden Syntax-Leitfaden freizuschalten.',
    lockedStage: 'Gesperrt',
    audioOn: 'Ton: AN',
    audioOff: 'Ton: AUS',
    levelPrefix: 'Stufe',
    totalRowsLabel: 'Gesamt:',
    rowsUnit: 'Zeilen',

    // Schema Browser
    colName: 'Spaltenname',
    colType: 'Typ',
    colKeyRelation: 'Schlüssel / Relation',
    colInsertHint: 'Einfügen',
    insertTableTitle: 'Tabellenname in SQL-Terminal einfügen',
    insertColTitle: 'in Terminal einfügen',

    // Story Dialog & Guidebook Panel
    briefingHeader: 'EINSATZ-BRIEFING',
    objectiveHeader: 'Ermittlungsziel (SQL-Bedingung)',
    relevantTablesHeader: 'Relevante Tabellen:',
    openGuidebookStage: 'SQL-Handbuch für Stufe',
    openGuidebookSuffix: 'öffnen',
    guidebookMainTitle: 'SQL-Ermittlungshandbuch',
    guidebookUnlockedCountPrefix: 'Aktuell bis Stufe',
    guidebookUnlockedCountSuffix: 'freigeschaltet (von 10)',
    guidebookLockedEntry: 'Befehlshandbuch gesperrt',
    guidebookLockedDesc: 'Schließe vorherige Stufen ab, um diesen Leitfaden freizuschalten.',
    guidebookSyntaxTitle: 'Grundlegende SQL-Syntax',
    guidebookRulesTitle: 'Wichtige Syntax-Regeln',
    guidebookExampleTitle: 'Praktisches Beispiel',
    guidebookCopyToEditor: 'In Editor einfügen',
    dialogueArchiveTitle: 'Fallprotokoll & Dialoge',
    cluesIntro: 'Untersuche Beweisstücke am Tatort, um kriminelle Verbindungen aufzudecken:',
    reinspect: 'Nachuntersuchen',
    inspect: 'Untersuchen',
    clueFound: 'Gefundener Beweis:',
    loadRelatedQuery: 'Verknüpfte SQL-Abfrage in Terminal laden',
    lockedAlertNeedPrev: '🔒 Vorherige Stufen müssen zuerst abgeschlossen werden!',
    stageLockedShort: 'Gesperrt',

    // Modals & Hints
    hintTier1: 'Schritt 1: Relevante SQL-Schlüsselwörter & Zieltabelle',
    hintTier2: 'Schritt 2: Filter- & Sortierkriterien',
    hintTier3: 'Schritt 3: Abfragestruktur & Vollständige Musterlösung',
    hintStepPrefix: 'Stufe',
    hintLockedText: '🔒 Noch gesperrt',
    hintUnlockBtn: 'freischalten',
    hintSolutionTitle: 'Vollständige Musterlösung',
    hintSolutionSub: 'Nur im äußersten Notfall ansehen',
    hintApplyQuery: 'In SQL-Terminal übernehmen',
    hintShowSolution: 'Musterlösung anzeigen',

    // Settings
    soundAudioEffects: 'Audio-Effekte & Synthesizer',
    soundBgm: 'Hintergrund-Ambiente (BGM)',
    editorFontSizeLabel: 'SQL-Editor Schriftgröße',
    saveDataHelp: 'Der Spielstand wird automatisch im Browser (LocalStorage) gespeichert und kann als JSON exportiert werden.',

    // Mission Modal
    evidenceEncryptedTitle: '🔒 Verschlüsselt (Freischaltung durch Ermittlung)',
    evidenceEncryptedDesc: 'Schließe die entsprechende SQL-Ermittlungsstufe ab, um diesen Beweis zu entschlüsseln.',

    // Submenu Views
    queryTableInConsole: 'in Konsole abfragen',
    statCompletionRate: 'Fallabschlussquote',
    statStagesCompletedUnit: 'von 10 Stufen abgeschlossen',
    statMaxXpAvailable: 'Maximal 3.000 XP erreichbar',
    statObjectsScanned: 'Tatort-Objekte gescannt',
    statObjectsDesc: 'Untersuchte Terminals & Sensoren',
    statEvidenceUnlocked: 'Freigeschaltete Beweise',
    statEvidenceDesc: 'Im Evidence-Archiv registriert',
    queryHistoryEmpty: 'Noch keine erfolgreichen Abfragen verzeichnet. Löse deine erste Mission in der Ermittlungskonsole!',
    loadIntoConsole: 'In Konsole laden',

    // Query Result Panel & Feedback
    validationReviewPrompt: 'Abfrage ausgeführt — Prüfe die Kriterien der Mission',
    sqlDiagnosisLabel: 'SQL-Diagnose',
    solutionGuideLabel: 'Lösungshinweis:',
    showRawErrorLabel: 'Raw SQLite Engine Fehlermeldung anzeigen',
    emptyZeroRowsNotice: 'Abfrage erfolgreich ausgeführt, aber es wurden 0 Zeilen zurückgegeben.',
    emptyZeroRowsTip: 'Prüfe WHERE-Filterbedingungen, Schreibweisen oder verwende die DB-Schnellansicht zur Dateninspektion.',
    queryResultCaptionPrefix: 'SQL-Abfrageergebnis (',
    queryResultCaptionSuffix: ' Zeilen)',

    // SQL Editor Panel
    sqlEditorPlaceholder: 'Gib deine SQL-Abfrage hier ein... (z. B. SELECT * FROM Citizens;)',
    sqlEditorAria: 'SQL-Terminal Eingabebereich',

    // App & Top Bar
    dbResetSuccessFeedback: 'Datenbank wurde erfolgreich auf den Anfangszustand zurückgesetzt.',
    sqliteLoadError: 'SQLite WASM Engine Ladefehler',
    loadingEngineSub: 'Neo-Archive Zentraldatenbank wird gemountet...',
    missionsAndEvidence: 'Missionen & Beweise',
    emergencyHintTitle: 'Stufenweise SQL-Tipps öffnen',
    resetDbTitle: 'Datenbank auf Anfangszustand zurücksetzen',
  },

  ko: {
    appTitle: 'PROJECT DATABASE ZERO',
    appBureau: 'AEGIS DATA INVESTIGATION BUREAU',
    appHeadline: '네오 아카이브 시티, 사라진 데이터의 진실을 밝혀라',
    appSubheadline: 'SQL과 함께하는 2086년, 데이터 사건 수사 어드벤처',
    ariaSpeech: '지금도 어딘가에서... 데이터가 사라지고 있어요.',
    startInvestigation: '수사 시작',
    startInvestigationSub: '새로운 사건을 조사하세요',
    continueInvestigation: '이어하기',
    continueInvestigationSub: '지난 수사 지점으로',
    settingsBtn: '설정',
    settingsSub: '게임 환경 설정',
    chapterProgress: '챕터 진행도',
    sqlMastery: 'SQL 숙련도',
    sqlStagesHeading: 'SQL 조사 단계',
    sqlStagesSub: '각 단계를 완료하고, 더 깊은 진실에 다가가세요',
    statusCompleted: '완료',
    statusActive: '진행 중',
    statusLocked: '잠금',
    lockedAlert: '이전 수사 단계를 먼저 완료해야 잠금이 해제됩니다!',

    // Themes
    theme1Tab: '테마 1: 기초 튜토리얼',
    theme2Tab: '테마 2: 실전 응용 수사',
    theme1Subtitle: '1~5단계: 핵심 SQL 기본 문법 학습',
    theme2Subtitle: '6~10단계: 실전 범죄 수사 자율 응용',
    themeLockedAlert: '테마 1의 5단계를 모두 완료해야 테마 2가 해금됩니다!',

    // Navbar
    navHome: '홈',
    navConsole: '수사 콘솔',
    navCodex: '도감',
    navStats: '통계',
    navAchievements: '업적',
    soundToggle: '효과음 켜기/끄기',
    langToggle: '언어 변경 / Language',

    // Console
    missionTab: '미션',
    guidebookTab: '가이드북',
    storyTab: '스토리',
    cluesTab: '단서',
    emergencyHintBtn: '💡 긴급 수사 힌트',
    resetDbBtn: 'DB 초기화',
    allMissionsBtn: '전체 미션 & 증거',
    tablePreviewNotice: '우측 결과창에 조회',
    quickSyntax: '빠른 구문:',
    runQuery: '쿼리 실행 (RUN)',
    dbQuickCheckTitle: 'DB 빠른 조회 & 테이블 구조',
    queryResultTitle: '쿼리 실행 결과 테이블 (QUERY OUTPUT)',
    queryRows: '행',
    queryCols: '열',
    queryDuration: '소요 시간:',
    querySuccess: '실행 성공',
    queryError: 'SQL 오류',
    missionCompletedBadge: '수사 목표 달성! (미션 클리어)',
    nextMissionBtn: '다음 수사 단계로 이동',
    emptyResultNotice: '아직 실행된 SQL 쿼리 결과가 없습니다.',
    emptyResultSub: '위 에디터에서 쿼리를 작성하고 "쿼리 실행 (RUN)" 또는 Ctrl + Enter 를 누르세요.',
    resetStarterQuery: '기본 쿼리',
    clearEditor: '비우기',
    monacoMode: 'Monaco 모드',
    lightMode: '경량 모드',
    shortcutRunHint: 'Ctrl+Enter 실행',

    // Schema Browser
    schemaBrowserTitle: 'DB 빠른 조회 & 테이블 구조',
    previewInResultBtn: '우측 결과창에 조회',
    targetTableBadge: '핵심',
    columnsTitle: '컬럼(속성) 목록:',
    sampleQueryBtn: '샘플 쿼리 불러오기',

    // Modals
    hintModalTitle: '긴급 수사 힌트',
    hintCautionText: '스스로 생각해서 쿼리를 작성할 때 실력이 가장 빠르게 향상됩니다. 1~2단계 힌트부터 차례로 확인해 보세요.',
    hintLevelLabel: '단계',
    unlockNextHint: '다음 단계 힌트 확인하기',
    allHintsUnlocked: '모든 힌트가 해금되었습니다',
    solutionQueryLabel: '전체 정답 쿼리 확인:',
    applyQueryToEditor: '에디터에 쿼리 적용하기',
    closeBtn: '닫기',

    missionModalTitle: '수사 진행도 & 증거 보관함',
    missionsCatalogTab: '10단계 SQL 미션 카탈로그',
    evidenceTab: '수집된 사건 단서 (Evidence)',
    rewardText: '보상:',
    jumpToMissionBtn: '이 미션으로 이동',
    currentActiveBtn: '현재 진행 중',

    settingsTitle: '시스템 환경 설정',
    langSettingTitle: '언어 관리 / Language',
    langDesc: '인터페이스 및 수사 브리핑 표시 언어를 선택합니다.',
    soundSettingsTitle: '오디오 및 효과음',
    dataManageTitle: '진행도 및 데이터 관리',
    exportSaveBtn: '세이브 파일 내보내기 (JSON)',
    importSaveBtn: '세이브 파일 불러오기 (JSON)',
    resetProgressBtn: '전체 진행도 초기화',
    resetProgressConfirm: '모든 진행 상황과 데이터베이스를 초기화하시겠습니까? 복구할 수 없습니다.',
    saveSuccess: '저장 완료',

    // Subviews (Codex, Stats, Achievements)
    codexTitle: '수사 도감 — 데이터베이스 스키마 & 기밀 증거물',
    codexSub: '네오-아카이브 시티의 7대 관계형 테이블 구조와 해금된 사건 증거를 열람합니다.',
    evidenceArchiveTitle: '수집된 사건 증거물 (Evidence Archive)',
    noEvidenceYet: '아직 수집된 단서가 없습니다. 수사를 진행해 단서를 확보하세요!',
    schemaOverviewTitle: '데이터베이스 테이블 명세',
    statsTitle: '수사 통계 및 쿼리 기록 분석',
    statsSub: '지금까지 작성한 SQL 쿼리 성공률과 수사 성과 지표입니다.',
    statTotalQueries: '총 실행 쿼리',
    statSuccessQueries: '성공한 쿼리',
    statSuccessRate: '쿼리 성공률',
    statTotalXp: '누적 획득 XP',
    queryHistoryTitle: '최근 쿼리 실행 이력',
    achievementsTitle: '수사관 업적 및 훈장',
    achievementsSub: 'SQL 수사관으로서 달성한 특수 임무 및 마일스톤입니다.',
    pkTag: '기본 키 (PK)',
    fkTag: '외래 키 (FK)',
    normalColTag: '일반 컬럼',
    allCols: '전체 열',
    insertTableName: '테이블명 삽입',
    queryErrorFeedback: '쿼리 오류가 발생했습니다. 아래 오류 진단 카드의 힌트를 확인하세요.',
    querySuccessFeedback: '쿼리가 성공적으로 실행되었습니다!',
    missionTargetCriteria: '쿼리 실행 완료 — 미션 목표 조건을 확인해 보세요',
    inspectingObject: '단서 조사 중...',
    objectFound: '단서 분석 완료!',
    guidebookLockedHint: '해당 단계를 완료하면 상세 SQL 문법 가이드북이 해금됩니다.',
    lockedStage: '잠김',
    audioOn: '효과음: 켜짐',
    audioOff: '효과음: 꺼짐',
    levelPrefix: '단계',
    totalRowsLabel: '총',
    rowsUnit: '행',

    // Schema Browser
    colName: '컬럼명',
    colType: '타입',
    colKeyRelation: '키 / 참조 관계',
    colInsertHint: '삽입',
    insertTableTitle: '테이블 이름을 위 SQL 터미널에 삽입합니다',
    insertColTitle: '컬럼명을 터미널에 삽입',

    // Story Dialog & Guidebook Panel
    briefingHeader: '사건 브리핑',
    objectiveHeader: '수사 목표 (SQL 통과 조건)',
    relevantTablesHeader: '관련 테이블 즉시 확인:',
    openGuidebookStage: '',
    openGuidebookSuffix: '단계 SQL 가이드북 확인하기',
    guidebookMainTitle: 'SQL 수사관 명령어 가이드북',
    guidebookUnlockedCountPrefix: '현재',
    guidebookUnlockedCountSuffix: '단계까지 해금되었습니다. (총 10단계)',
    guidebookLockedEntry: '명령어 가이드북이 잠겨 있습니다',
    guidebookLockedDesc: '스토리를 진행하고 이전 단계를 완료하면 자동으로 해금됩니다.',
    guidebookSyntaxTitle: '기본 문법 구조',
    guidebookRulesTitle: '수사관 필수 암기 규칙',
    guidebookExampleTitle: '실전 적용 예시',
    guidebookCopyToEditor: '에디터에 복사',
    dialogueArchiveTitle: '사건 기록 대화',
    cluesIntro: '현장에 남겨진 물리적 단서를 조사하여 범행의 연결 고리를 파악하세요:',
    reinspect: '재조사',
    inspect: '조사하기',
    clueFound: '확보된 증거:',
    loadRelatedQuery: '관련 SQL 쿼리 터미널에 불러오기',
    lockedAlertNeedPrev: '🔒 이전 미션을 클리어하면 해금됩니다',
    stageLockedShort: '잠김',

    // Modals & Hints
    hintTier1: '1단계: 사용할 핵심 SQL 키워드와 대상 테이블',
    hintTier2: '2단계: 필터링 및 정렬 조건',
    hintTier3: '3단계: 쿼리 작성 구조 및 전체 정답 힌트',
    hintStepPrefix: '단계 힌트',
    hintLockedText: '🔒 힌트가 잠겨 있습니다',
    hintUnlockBtn: '단계 해금하기',
    hintSolutionTitle: '최종 정답 쿼리 예시',
    hintSolutionSub: '스스로 도저히 해결하기 어려울 때만 열람하세요',
    hintApplyQuery: '이 쿼리를 SQL 터미널에 입력하기',
    hintShowSolution: '정답 쿼리 확인하기',

    // Settings
    soundAudioEffects: '인터페이스 및 쿼리 효과음',
    soundBgm: '사이버펑크 분석실 배경 사운드 (BGM)',
    editorFontSizeLabel: 'SQL 에디터 글꼴 크기',
    saveDataHelp: '게임 진행도는 브라우저 LocalStorage에 자동 저장되며, JSON 파일로 내보내거나 불러올 수 있습니다.',

    // Mission Modal
    evidenceEncryptedTitle: '🔒 잠긴 기밀 증거물 (미션 해결 시 해금)',
    evidenceEncryptedDesc: '관련 SQL 미션을 클리어하거나 Evidence 테이블을 직접 조회하면 상세 내용이 공개됩니다.',

    // Submenu Views
    queryTableInConsole: '조회하기',
    statCompletionRate: '전체 사건 해결률',
    statStagesCompletedUnit: '/ 10 단계 완료',
    statMaxXpAvailable: '총 3,000 XP 획득 가능',
    statObjectsScanned: '현장 오브젝트 스캔',
    statObjectsDesc: '단말기 및 센서 조사 횟수',
    statEvidenceUnlocked: '해금된 핵심 증거',
    statEvidenceDesc: 'Evidence 아카이브 등재',
    queryHistoryEmpty: '아직 기록된 미션 성공 쿼리가 없습니다. 수사 콘솔에서 첫 미션을 해결해 보세요!',
    loadIntoConsole: '콘솔로 불러오기',

    // Query Result Panel & Feedback
    validationReviewPrompt: '쿼리 실행 완료 — 미션 목표 조건을 확인해 보세요',
    sqlDiagnosisLabel: 'SQL 오류 진단',
    solutionGuideLabel: '해결 가이드:',
    showRawErrorLabel: '원시 SQLite 엔진 오류 메시지 보기',
    emptyZeroRowsNotice: '쿼리가 정상 실행되었으나 조회된 데이터 행(Row)이 0건입니다.',
    emptyZeroRowsTip: 'WHERE 조건절의 값이나 대소문자, 숫자 조건을 다시 확인하거나 상단 테이블 미리보기로 원본 데이터를 확인해 보세요.',
    queryResultCaptionPrefix: 'SQL 쿼리 실행 결과 (',
    queryResultCaptionSuffix: '건)',

    // SQL Editor Panel
    sqlEditorPlaceholder: '여기에 SQL 쿼리를 입력하세요... (예: SELECT * FROM Citizens;)',
    sqlEditorAria: 'SQL 쿼리 입력 에디터',

    // App & Top Bar
    dbResetSuccessFeedback: '네오-아카이브 데이터베이스가 초기 시드 상태로 복원되었습니다.',
    sqliteLoadError: 'SQLite WASM 엔진 로드 오류',
    loadingEngineSub: '네오-아카이브 중앙 데이터베이스 마운트 중...',
    missionsAndEvidence: '전체 미션 & 증거',
    emergencyHintTitle: '단계별 수사 힌트 열기',
    resetDbTitle: '실수로 데이터를 삭제/변경했을 때 초기 데이터베이스 상태로 복구합니다',
  },
};

// -------------------------------------------------------------
// 6. RANKS TRANSLATIONS
// -------------------------------------------------------------
export const INVESTIGATOR_RANKS: Record<
  SupportedLanguage,
  { level: number; title: string; nextXp: number }[]
> = {
  de: [
    { level: 1, title: 'Nachwuchs-Ermittler', nextXp: 1000 },
    { level: 2, title: 'Feld-Datenanalyst', nextXp: 650 },
    { level: 3, title: 'Leitender Datenprüfer', nextXp: 1200 },
    { level: 4, title: 'Chef-Ermittler', nextXp: 2000 },
    { level: 5, title: 'Master-Architekt', nextXp: 3000 },
  ],
  ko: [
    { level: 1, title: '신입 조사관', nextXp: 1000 },
    { level: 2, title: '현장 데이터 조사관', nextXp: 650 },
    { level: 3, title: '선임 데이터 분석관', nextXp: 1200 },
    { level: 4, title: '수석 데이터 수사관', nextXp: 2000 },
    { level: 5, title: '마스터 아키텍트', nextXp: 3000 },
  ],
};

export function getRankByXpAndCount(
  xp: number,
  completedCount: number,
  lang: SupportedLanguage
): { level: number; title: string; nextXp: number } {
  const ranks = INVESTIGATOR_RANKS[lang];
  if (completedCount >= 10 || xp >= 2500) return ranks[4];
  if (completedCount >= 7 || xp >= 1600) return ranks[3];
  if (completedCount >= 5 || xp >= 900) return ranks[2];
  if (completedCount >= 2 || xp >= 300) return ranks[1];
  return ranks[0];
}

export function getMissionI18n(missionId: number, lang: SupportedLanguage): MissionI18n {
  const dict = MISSIONS_I18N[lang] || MISSIONS_I18N.de;
  return dict[missionId] || dict[1];
}

export function getChapterI18n(chapterId: number, lang: SupportedLanguage): ChapterI18n {
  const dict = CHAPTERS_I18N[lang] || CHAPTERS_I18N.de;
  return dict[chapterId] || dict[1];
}

export interface EvidenceI18n {
  title: string;
  summary: string;
}

export const EVIDENCE_I18N: Record<SupportedLanguage, Record<string, EvidenceI18n>> = {
  de: {
    'EV-001': {
      title: 'Letztes Backup-Protokoll von Dr. Heimerdinger',
      summary: 'Snapshots im Quantenserverraum kurz vor ihrem Verschwinden bestätigt.',
    },
    'EV-002': {
      title: 'Vermisstenalarmakte: Dr. Heimerdinger',
      summary: 'Chefarchitektin Dr. Heimerdinger (citizen_id: 1003, Freigabe 5) als VERMISST gemeldet.',
    },
    'EV-003': {
      title: 'TERM-H02 Core-Datenleck-Spuren',
      summary: 'Spuren eines Exports sensibler Kerntabellen mit Bedrohungsstufe >= 90 gesichert.',
    },
    'EV-004': {
      title: 'Jhins Darkpool-Finanzüberweisungen',
      summary: 'Jhin (1004) hat in 3 Transaktionen 162.000 Credits an illegale Adressen transferiert.',
    },
    'EV-005': {
      title: 'Komplott-Beweis: Helios-Insider & Null-Sequence',
      summary: 'JOIN-Analyse belegt das gemeinsame Vorgehen von Jhin und Hacker Zed.',
    },
  },
  ko: {
    'EV-001': {
      title: 'Dr. 하이머딩거의 마지막 백업 로그',
      summary: '실종 직전 제1양자서버실에서 스냅샷을 남긴 기록 확인',
    },
    'EV-002': {
      title: 'Dr. 하이머딩거 실종 경보 파일',
      summary: '보안 등급 5등급 수석 아키텍트 Dr. 하이머딩거(citizen_id: 1003)이 실종(MISSING) 상태임이 확인됨',
    },
    'EV-003': {
      title: 'TERM-H02 코어 테이블 유출 흔적',
      summary: '위협 점수 90점 이상의 심야 로그 중 코어 테이블 반출(CORE_TABLE_EXPORT) 정황 포착',
    },
    'EV-004': {
      title: '진의 다크풀 자금 송금 내역',
      summary: '진(1004)이 총 3건, 합계 162,000 크레딧의 비정상 자금을 외부로 이체함',
    },
    'EV-005': {
      title: '헬리오스 연구소 내부자-널 시퀀스 결탁 증거',
      summary: 'JOIN 분석 결과 헬리오스 소속 진과 널 시퀀스 소속 제드의 공동 작전 확인',
    },
  },
};

export function getEvidenceI18n(
  evidenceCode: string,
  lang: SupportedLanguage
): EvidenceI18n {
  const dict = EVIDENCE_I18N[lang] || EVIDENCE_I18N.de;
  return (
    dict[evidenceCode] || {
      title: evidenceCode,
      summary: '',
    }
  );
}

// -------------------------------------------------------------
// 8. DATABASE VALUE LOCALIZATION TEMPLATE
// Translates raw database values (role, name, district, status)
// dynamically based on user language.
// -------------------------------------------------------------
export function translateDatabaseCell(
  value: string | number | null | undefined,
  columnName: string,
  lang: SupportedLanguage
): string | number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  const str = String(value);
  const col = columnName.toLowerCase();

  // 1. Role Column Translation
  if (col === 'role') {
    const roleMap: Record<SupportedLanguage, Record<string, string>> = {
      de: {
        '수석 데이터 분석팀장': 'Leitende Datenanalystin',
        '시스템 보안 감독관': 'Systemsicherheits-Aufseher',
        '수석 DB 아키텍트': 'Chef-DB-Architektin',
        '코어 시스템 엔지니어': 'Kernsystem-Ingenieur',
        '암호화폐 브로커': 'Kryptowährungs-Broker',
        '금융 감사관': 'Finanzprüferin',
        '야간 서버 관리자': 'Nacht-Serveradministrator',
        '고스트 프로토콜 해커': 'Ghost-Protokoll-Hacker',
        '물류 보안 오퍼레이터': 'Logistiksicherheits-Operator',
        '신입 데이터 수사관 (Player)': 'Nachwuchs-Ermittler (Player)',
        'CHIEF_DATA_ANALYST': 'Leitende Datenanalystin',
        'SECURITY_SUPERVISOR': 'Systemsicherheits-Aufseher',
        'LEAD_DB_ARCHITECT': 'Chef-DB-Architektin',
        'CORE_ENGINEER': 'Kernsystem-Ingenieur',
        'CRYPTO_BROKER': 'Kryptowährungs-Broker',
        'FINANCIAL_AUDITOR': 'Finanzprüferin',
        'NIGHT_ADMIN': 'Nacht-Serveradministrator',
        'GHOST_HACKER': 'Ghost-Protokoll-Hacker',
        'LOGISTICS_OPERATOR': 'Logistiksicherheits-Operator',
        'ROOKIE_INVESTIGATOR': 'Nachwuchs-Ermittler (Player)',
      },
      ko: {
        'Leitende Datenanalystin': '수석 데이터 분석팀장',
        'Systemsicherheits-Aufseher': '시스템 보안 감독관',
        'Chef-DB-Architektin': '수석 DB 아키텍트',
        'Kernsystem-Ingenieur': '코어 시스템 엔지니어',
        'Kryptowährungs-Broker': '암호화폐 브로커',
        'Finanzprüferin': '금융 감사관',
        'Nacht-Serveradministrator': '야간 서버 관리자',
        'Ghost-Protokoll-Hacker': '고스트 프로토콜 해커',
        'Logistiksicherheits-Operator': '물류 보안 오퍼레이터',
        'Nachwuchs-Ermittler (Player)': '신입 데이터 수사관 (Player)',
        'CHIEF_DATA_ANALYST': '수석 데이터 분석팀장',
        'SECURITY_SUPERVISOR': '시스템 보안 감독관',
        'LEAD_DB_ARCHITECT': '수석 DB 아키텍트',
        'CORE_ENGINEER': '코어 시스템 엔지니어',
        'CRYPTO_BROKER': '암호화폐 브로커',
        'FINANCIAL_AUDITOR': '금융 감사관',
        'NIGHT_ADMIN': '야간 서버 관리자',
        'GHOST_HACKER': '고스트 프로토콜 해커',
        'LOGISTICS_OPERATOR': '물류 보안 오퍼레이터',
        'ROOKIE_INVESTIGATOR': '신입 데이터 수사관 (Player)',
      },
    };
    return roleMap[lang]?.[str] || str;
  }

  // 2. Name Column Translation (Citizens, Organizations, Locations)
  if (col === 'name' || col === 'org_name') {
    const nameMap: Record<SupportedLanguage, Record<string, string>> = {
      de: {
        '아리 (Ahri)': 'Ahri',
        '제이스 (Jayce)': 'Jayce',
        '하이머딩거 (Dr. Heimerdinger)': 'Dr. Heimerdinger',
        '진 (Jhin)': 'Jhin',
        '빅토르 (Viktor)': 'Viktor',
        '세라핀 (Seraphine)': 'Seraphine',
        '에코 (Ekko)': 'Ekko',
        '제드 (Zed)': 'Zed',
        '애쉬 (Ashe)': 'Ashe',
        '이즈리얼 (Ezreal)': 'Ezreal',
        '아이기스 데이터 수사국 (Aegis Bureau)': 'Aegis Data Investigation Bureau',
        '헬리오스 코어 연구소 (Helios Core Lab)': 'Helios Core Lab',
        '넥서스 크레딧 뱅크 (Nexus Credit Bank)': 'Nexus Credit Bank',
        '보텍스 물류 네트워크 (Vortex Logistics)': 'Vortex Logistics',
        '널 시퀀스 신디케이트 (Null Sequence)': 'Null Sequence Syndicate',
        '아이기스 중앙 분석실': 'Aegis-Zentralanalyse',
        '헬리오스 제1양자서버실': 'Helios Quantenserverraum 1',
        '넥서스 스카이 볼트': 'Nexus Sky Vault',
        '네온 마켓 환전소': 'Neon Market Wechselstube',
        '구 지하철 제9폐쇄역': 'Alter Bahnhof 9',
        '스카이원 거주 단지': 'SkyOne Wohnkomplex',
      },
      ko: {
        'Ahri': '아리 (Ahri)',
        'Jayce': '제이스 (Jayce)',
        'Dr. Heimerdinger': '하이머딩거 (Dr. Heimerdinger)',
        'Jhin': '진 (Jhin)',
        'Viktor': '빅토르 (Viktor)',
        'Seraphine': '세라핀 (Seraphine)',
        'Ekko': '에코 (Ekko)',
        'Zed': '제드 (Zed)',
        'Ashe': '애쉬 (Ashe)',
        'Ezreal': '이즈리얼 (Ezreal)',
        'Aegis Data Investigation Bureau': '아이기스 데이터 수사국 (Aegis Bureau)',
        'Helios Core Lab': '헬리오스 코어 연구소 (Helios Core Lab)',
        'Nexus Credit Bank': '넥서스 크레딧 뱅크 (Nexus Credit Bank)',
        'Vortex Logistics': '보텍스 물류 네트워크 (Vortex Logistics)',
        'Null Sequence Syndicate': '널 시퀀스 신디케이트 (Null Sequence)',
        'Aegis-Zentralanalyse': '아이기스 중앙 분석실',
        'Helios Quantenserverraum 1': '헬리오스 제1양자서버실',
        'Nexus Sky Vault': '넥서스 스카이 볼트',
        'Neon Market Wechselstube': '네온 마켓 환전소',
        'Alter Bahnhof 9': '구 지하철 제9폐쇄역',
        'SkyOne Wohnkomplex': '스카이원 거주 단지',
      },
    };
    return nameMap[lang]?.[str] || str;
  }

  // 3. District Column Translation
  if (col === 'district') {
    const districtMap: Record<SupportedLanguage, Record<string, string>> = {
      de: {
        '센트럴 타워': 'Central Tower',
        '코어 돔': 'Core Dome',
        '금융 지구': 'Finanzdistrikt',
        '로우 시티': 'Low City',
        '언더그라운드': 'Underground',
        '어퍼 시티': 'Upper City',
      },
      ko: {
        'Central Tower': '센트럴 타워',
        'Core Dome': '코어 돔',
        'Finanzdistrikt': '금융 지구',
        'Low City': '로우 시티',
        'Underground': '언더그라운드',
        'Upper City': '어퍼 시티',
      },
    };
    return districtMap[lang]?.[str] || str;
  }

  return str;
}

// -------------------------------------------------------------
// 9. STAGE SHORT SUBTITLES
// -------------------------------------------------------------
export const STAGE_SHORT_SUBTITLES: Record<SupportedLanguage, Record<number, string>> = {
  de: {
    1: 'Finde die letzten Verbindungsdaten der Bürger',
    2: 'Verfolge die Spur der verschwundenen Architektin',
    3: 'Enthülle den Urheber der verdächtigen Mitternacht-Logs',
    4: 'Manipulierte Sicherheitsdaten korrigieren & Verdächtigen markieren',
    5: 'Analysiere verdächtige Schwarzgeld-Transaktionen',
    6: 'Isoliere autorisierte Insider mit Sicherheitsfreigabe >= 4',
    7: 'Finde die Top-3 Transaktionen über 50.000 Credits',
    8: 'Analysiere Geldempfänger zur Identifizierung des Zielkontos',
    9: 'Sperre das Konto des Hauptverdächtigen Zed',
    10: 'Verknüpfe Bürger und Organisationen zur Fallaufklärung',
  },
  ko: {
    1: '시민들의 마지막 접속 기록을 찾아라',
    2: '사라진 아키텍트의 발자취를 추적하라',
    3: '심야 침입자의 최상위 위협 로그를 찾아라',
    4: '내부 협력자의 상태를 용의자로 갱신하라',
    5: '의심스러운 송금자의 자금 흐름을 집계하라',
    6: '보안 4등급 이상 활성 내부 인가자를 추려내라',
    7: '5만 크레딧 이상 거액 거래 상위 3건을 추출하라',
    8: '불법 자금이 모여든 핵심 수신 계좌를 집계하라',
    9: '해커 제드의 자산을 긴급 동결하라',
    10: '시민과 소속 기관을 교차 대조하여 전모를 밝혀라',
  },
};

// -------------------------------------------------------------
// 10. CHARACTER LABELS
// -------------------------------------------------------------
export const CHARACTER_LABELS: Record<SupportedLanguage, Record<string, string>> = {
  de: {
    aria: 'Leitende Analystin Ahri',
    kyle: 'Sicherheitsinspektor Jayce',
    zero: 'Zed',
    elena: 'Dr. Heimerdinger',
    system: 'Ermittler Ezreal',
  },
  ko: {
    aria: '아리 팀장',
    kyle: '제이스 감독관',
    zero: '제드',
    elena: 'Dr. 하이머딩거',
    system: '이즈리얼 수사관',
  },
};

// -------------------------------------------------------------
// 11. SQL ERROR ADVISOR TEMPLATES
// -------------------------------------------------------------
export interface SqlErrorTemplates {
  noSuchTable: (table: string, available: string) => { title: string; exp: string; sug: string };
  noSuchColumn: (col: string, hint: string) => { title: string; exp: string; sug: string };
  ambiguousColumn: (col: string) => { title: string; exp: string; sug: string };
  foreignKey: { title: string; exp: string; sug: string };
  uniqueConstraint: { title: string; exp: string; sug: string };
  misuseAggregate: { title: string; exp: string; sug: string };
  syntaxError: (near: string) => { title: string; exp: string; sug: string };
  unknown: (msg: string) => { title: string; exp: string; sug: string };
}

export const SQL_ERROR_TEMPLATES: Record<SupportedLanguage, SqlErrorTemplates> = {
  de: {
    noSuchTable: (table, available) => ({
      title: `Tabelle '${table}' wurde nicht gefunden`,
      exp: `In der Datenbank existiert keine Tabelle mit dem Namen '${table}'. Bitte überprüfe die Schreibweise.`,
      sug: `Überprüfe die verfügbaren Tabellen im DB-Schnellansicht-Panel: ${available}`,
    }),
    noSuchColumn: (col, hint) => ({
      title: `Spalte '${col}' existiert nicht`,
      exp: `Die angegebene Zieltabelle enthält keine Spalte namens '${col}'.${hint ? ' Hinweis: Textwerte müssen in einfache Anführungszeichen (\'...\') gesetzt werden.' : ''}`,
      sug: `Prüfe die Spaltennamen im Schema-Browser und achte darauf, Strings in einfachen Anführungszeichen ('Wert') zu übergeben.`,
    }),
    ambiguousColumn: (col) => ({
      title: `Mehrdeutiger Spaltenname: '${col}'`,
      exp: `In den per JOIN verknüpften Tabellen existieren mehrere Spalten mit dem Namen '${col}'. SQLite kann die Zuordnung nicht auflösen.`,
      sug: `Stelle den Tabellennamen oder Tabellen-Alias voran (z. B. Citizens.${col} oder c.${col}).`,
    }),
    foreignKey: {
      title: 'Fremdschlüssel-Integritätsverletzung (FOREIGN KEY)',
      exp: 'Der angegebene Fremdschlüsselwert existiert nicht in der übergeordneten Primärtabelle oder wird von anderen Datensätzen referenziert.',
      sug: 'Überprüfe zuerst mit SELECT, ob der ID-Wert in der Elterntabelle (Citizens, Locations, Organizations) existiert.',
    },
    uniqueConstraint: {
      title: 'Doppelter Primär-/Eindeutigkeitsschlüssel (UNIQUE)',
      exp: 'Ein Primärschlüssel (PRIMARY KEY) oder eindeutiger Attributwert existiert bereits und darf nicht dupliziert werden.',
      sug: 'Verwende einen neuen ID-Schlüssel oder prüfe bestehende Daten mit SELECT.',
    },
    misuseAggregate: {
      title: 'Unzulässige Verwendung einer Aggregatfunktion (COUNT, SUM, AVG) in WHERE',
      exp: 'Aggregatfunktionen können nicht in der WHERE-Klausel stehen, da WHERE vor der Gruppenbildung (GROUP BY) filtert.',
      sug: 'Nutze stattdessen die HAVING-Klausel nach GROUP BY oder eine geschachtelte Unterabfrage.',
    },
    syntaxError: (near) => ({
      title: `SQL-Syntaxfehler (nahe '${near}')`,
      exp: `In der Nähe von '${near}' liegt ein Syntaxfehler vor (z. B. fehlendes Komma, unvollständige Klausel oder offenes Anführungszeichen).`,
      sug: `Prüfe die Reihenfolge SELECT → FROM → WHERE → GROUP BY → ORDER BY → LIMIT und schließe alle Anführungszeichen ('...').`,
    }),
    unknown: (msg) => ({
      title: 'SQL-Ausführungsfehler aufgetreten',
      exp: `Die SQLite-Engine meldet folgenden Fehler: ${msg}`,
      sug: 'Prüfe deine Abfrage anhand des SQL-Handbuchs oder der Notfall-Tipps.',
    }),
  },
  ko: {
    noSuchTable: (table, available) => ({
      title: `테이블 '${table}'을(를) 찾을 수 없습니다`,
      exp: `데이터베이스에 '${table}'이라는 이름의 테이블이 존재하지 않습니다. 테이블 이름의 철자가 틀렸거나 아직 생성되지 않은 테이블일 수 있습니다.`,
      sug: `사용 가능한 기본 테이블 목록을 'DB 스키마 브라우저'에서 확인하세요: ${available}`,
    }),
    noSuchColumn: (col, hint) => ({
      title: `컬럼 '${col}'이(가) 존재하지 않습니다`,
      exp: `조회하려는 테이블에 '${col}' 컬럼이 없습니다.${hint ? ' 또한 SQL에서 문자열 값을 비교할 때는 큰따옴표(") 대신 작은따옴표(\')를 사용해야 합니다.' : ''}`,
      sug: `스키마 브라우저에서 해당 테이블의 정확한 컬럼 이름을 확인하거나, 문자열 비교 시 작은따옴표('값')로 감쌌는지 점검해 보세요.`,
    }),
    ambiguousColumn: (col) => ({
      title: `모호한 컬럼 이름: '${col}'`,
      exp: `JOIN으로 연결한 두 개 이상의 테이블에 '${col}'이라는 동일한 이름의 컬럼이 모두 존재하여 어느 테이블의 컬럼인지 SQLite가 판단할 수 없습니다.`,
      sug: `컬럼 이름 앞에 테이블 이름이나 별칭(Alias)을 붙여 명확히 지정하세요. 예: Citizens.${col} 또는 c.${col}`,
    }),
    foreignKey: {
      title: '외래키(FOREIGN KEY) 참조 무결성 제약조건 위반',
      exp: '부모 테이블에 존재하지 않는 기본키(PK) 값을 외래키(FK)로 입력하려 했거나, 다른 테이블에서 참조 중인 행을 삭제/변경하려고 시도했습니다.',
      sug: '참조 대상 테이블(예: Citizens, Locations, Organizations)에 해당 ID가 실제로 존재하는지 먼저 SELECT로 확인하세요.',
    },
    uniqueConstraint: {
      title: '중복된 고유값(PRIMARY KEY / UNIQUE) 오류',
      exp: '이미 테이블에 존재하는 기본키(PK) 또는 고유(UNIQUE) 코드 값을 중복해서 추가(INSERT)하거나 수정하려고 했습니다.',
      sug: '기존 데이터와 겹치지 않는 새로운 ID나 코드를 사용하거나, 이미 데이터를 추가했다면 SELECT로 확인해 보세요.',
    },
    misuseAggregate: {
      title: '집계 함수(COUNT, SUM, AVG 등) 사용 위치 오류',
      exp: 'WHERE 절에서는 집계 함수(COUNT, SUM, AVG 등)를 직접 사용할 수 없습니다. WHERE는 그룹화(GROUP BY) 전에 개별 행을 필터링하기 때문입니다.',
      sug: '그룹화한 결과에 조건을 걸려면 GROUP BY 뒤에 HAVING 절을 사용하거나 서브쿼리를 활용하세요.',
    },
    syntaxError: (near) => ({
      title: `SQL 문법 오류 ('${near}' 부근)`,
      exp: `'${near}' 키워드 주변에서 SQL 문법 규칙이 어긋났거나, 괄호·따옴표·쉼표가 빠졌을 가능성이 높습니다.`,
      sug: 'SELECT → FROM → WHERE → GROUP BY → ORDER BY → LIMIT 순서가 맞는지, 쉼표(,)나 따옴표(\')가 누락되지 않았는지 확인해 보세요.',
    }),
    unknown: (msg) => ({
      title: 'SQL 실행 중 오류가 발생했습니다',
      exp: `입력한 쿼리를 데이터베이스 엔진이 처리하는 과정에서 예외가 발생했습니다: ${msg}`,
      sug: '힌트 탭을 열어 단계별 힌트를 확인하거나, 테이블/컬럼 이름을 스키마 브라우저와 대조해 보세요.',
    }),
  },
};

// -------------------------------------------------------------
// 12. SQL ENGINE MESSAGES
// -------------------------------------------------------------
export const SQL_ENGINE_MESSAGES: Record<
  SupportedLanguage,
  {
    dbNotInitTitle: string;
    dbNotInitExp: string;
    dbNotInitSug: string;
    emptyQueryTitle: string;
    emptyQueryExp: string;
    emptyQuerySug: string;
    securityBlockedTitle: string;
    securityBlockedSug: string;
    dropProtectedTable: (tbl: string) => string;
    attachBlocked: string;
    dmlNotice: (action: string, count: number) => string;
    statusCol: string;
    rowsAffectedCol: string;
    dmlInsert: (count: number) => string;
    dmlUpdate: (count: number) => string;
    dmlDelete: (count: number) => string;
    dmlCreate: string;
  }
> = {
  de: {
    dbNotInitTitle: 'Datenbank-Engine wird vorbereitet',
    dbNotInitExp: 'Die SQLite-Engine ist noch nicht initialisiert.',
    dbNotInitSug: 'Bitte versuche es in wenigen Sekunden erneut.',
    emptyQueryTitle: 'Keine auszuführende SQL-Abfrage vorhanden',
    emptyQueryExp: 'Im Editor wurde kein SQL-Befehl eingegeben.',
    emptyQuerySug: 'Gib z. B. SELECT * FROM Citizens; ein und klicke auf Ausführen.',
    securityBlockedTitle: 'Durch Aegis-Sicherheitsrichtlinie blockiert',
    securityBlockedSug: 'Bitte nutze nur gestattete SQL-Befehle (SELECT, INSERT, UPDATE, DELETE).',
    dropProtectedTable: (tbl) =>
      `Sicherheitswarnung: Die Basistabelle '${tbl}' kann nicht gelöscht (DROP) werden. Nutze bei Bedarf 'DB Zurücksetzen'.`,
    attachBlocked: 'Sicherheitswarnung: Der Befehl ATTACH DATABASE ist in der Sandbox gesperrt.',
    dmlNotice: (action, count) => `${action} erfolgreich ausgeführt (${count} Zeile(n) geändert)`,
    statusCol: 'Ausführungsstatus (Status)',
    rowsAffectedCol: 'Betroffene Zeilen (Rows Affected)',
    dmlInsert: (count) => `Daten hinzugefügt (INSERT): ${count} Zeile(n) eingefügt.`,
    dmlUpdate: (count) => `Daten aktualisiert (UPDATE): ${count} Zeile(n) geändert.`,
    dmlDelete: (count) => `Daten gelöscht (DELETE): ${count} Zeile(n) entfernt.`,
    dmlCreate: 'Tabelle/Objekt erfolgreich erstellt (CREATE).',
  },
  ko: {
    dbNotInitTitle: '데이터베이스 엔진 준비 중',
    dbNotInitExp: 'SQLite 엔진이 아직 초기화되지 않았습니다.',
    dbNotInitSug: '잠시 후 다시 시도해 주세요.',
    emptyQueryTitle: '실행할 SQL 쿼리가 비어 있습니다',
    emptyQueryExp: '에디터에 실행할 SQL 문장이 입력되지 않았습니다.',
    emptyQuerySug: '예: SELECT * FROM Citizens; 를 입력한 뒤 실행 버튼을 눌러보세요.',
    securityBlockedTitle: '아이기스 보안 가드에 의해 차단된 쿼리',
    securityBlockedSug: '교육 및 수사 목적에 맞는 SELECT, INSERT, UPDATE, DELETE 문을 사용해 주세요.',
    dropProtectedTable: (tbl) =>
      `보안 정책 경고: 핵심 수사 테이블('${tbl}')은 DROP할 수 없습니다. 데이터 초기화가 필요하면 'DB 초기화' 버튼을 사용하세요.`,
    attachBlocked: '보안 정책 경고: 외부 데이터베이스 ATTACH 명령은 학습 샌드박스에서 차단되어 있습니다.',
    dmlNotice: (action, count) => `${action} 성공적으로 적용됨 (${count}개 행 변경)`,
    statusCol: '실행 상태 (Status)',
    rowsAffectedCol: '영향받은 행 수 (Rows Affected)',
    dmlInsert: (count) => `데이터 추가(INSERT) 완료: ${count}개의 행이 삽입되었습니다.`,
    dmlUpdate: (count) => `데이터 수정(UPDATE) 완료: ${count}개의 행이 변경되었습니다.`,
    dmlDelete: (count) => `데이터 삭제(DELETE) 완료: ${count}개의 행이 삭제되었습니다.`,
    dmlCreate: '테이블/객체 생성(CREATE) 완료: 스키마가 데이터베이스에 반영되었습니다.',
  },
};
