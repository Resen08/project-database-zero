import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { SqlEngine } from '../database/sqlEngine';
import { CURRICULUM_MISSIONS } from '../data/curriculumMissions';

describe('PROJECT DATABASE ZERO — SQLite 엔진 & 9단계 미션 통합 검증', () => {
  let engine: SqlEngine;

  beforeEach(async () => {
    engine = new SqlEngine();
    const wasmPath = path.resolve(
      process.cwd(),
      'node_modules/sql.js/dist/sql-wasm.wasm'
    );
    await engine.init(wasmPath);
  });

  it('7개 핵심 관계형 테이블(PK/FK 포함)이 모두 정상 생성되어야 한다', () => {
    const schemas = engine.getAllTableSchemas();
    const tableNames = schemas.map((s) => s.tableName);

    expect(tableNames).toEqual(
      expect.arrayContaining([
        'Organizations',
        'Locations',
        'Citizens',
        'Transactions',
        'SecurityLogs',
        'Missions',
        'Evidence',
      ])
    );

    // Citizens FK 검증
    const citizensTable = schemas.find((s) => s.tableName === 'Citizens')!;
    expect(citizensTable.rowCount).toBe(10);
    expect(citizensTable.columns.some((c) => c.name === 'citizen_id' && c.pk > 0)).toBe(
      true
    );
    expect(citizensTable.foreignKeys.length).toBeGreaterThanOrEqual(2);
  });

  it('핵심 테이블 DROP 시도 시 보안 가드가 차단해야 한다', () => {
    const res = engine.executeQuery('DROP TABLE Citizens;');
    expect(res.success).toBe(false);
    expect(res.diagnosis?.errorCode).toBe('SECURITY_BLOCKED');
  });

  it('잘못된 SQL 쿼리 실행 시 한국어 오류 진단(ErrorAdvisor)을 반환해야 한다', () => {
    const noTableRes = engine.executeQuery('SELECT * FROM UnknownTable;');
    expect(noTableRes.success).toBe(false);
    expect(noTableRes.diagnosis?.errorCode).toBe('NO_SUCH_TABLE');

    const fkFailRes = engine.executeQuery(
      "INSERT INTO SecurityLogs VALUES (9999, 88888, 101, 'TEST', 'GRANTED', 10, '2086-11-02', 'TERM-X');"
    );
    expect(fkFailRes.success).toBe(false);
    expect(fkFailRes.diagnosis?.errorCode).toBe('FOREIGN_KEY');
  });

  it('1단계부터 10단계까지 모든 SQL 커리큘럼 미션(테마 1 기초 & 테마 2 응용)이 실제 SQLite 데이터베이스에서 검증 통과해야 한다', () => {
    expect(CURRICULUM_MISSIONS.length).toBe(10);

    for (const mission of CURRICULUM_MISSIONS) {
      const execResult = engine.executeQuery(mission.referenceQuery);
      expect(execResult.success).toBe(true);

      const validation = mission.validate(execResult, (checkSql) =>
        engine.executeQuery(checkSql)
      );
      expect(
        validation.passed,
        `Stage ${mission.stageOrder} (${mission.codeName}) 실패: ${validation.feedback}`
      ).toBe(true);
    }
  });
});
