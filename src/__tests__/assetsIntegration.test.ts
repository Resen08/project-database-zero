import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import assetManifest from '../data/assetManifest.json';

describe('PROJECT DATABASE ZERO — 무료 게임 에셋 무결성·스프라이트 프레임·라이선스 자동 검증', () => {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');

  it('1. 8개 표준 에셋 디렉토리와 52개 에셋 파일이 모두 존재하고 유효한 헤더를 가져야 한다', () => {
    const requiredDirs = [
      'backgrounds',
      'characters',
      'sprites',
      'objects',
      'ui',
      'icons',
      'audio',
      'music',
    ];

    for (const dir of requiredDirs) {
      const fullDir = path.join(publicDir, 'assets', dir);
      expect(fs.existsSync(fullDir), `Directory missing: ${fullDir}`).toBe(true);
      const files = fs.readdirSync(fullDir);
      expect(files.length, `Directory empty: ${dir}`).toBeGreaterThan(0);
    }

    expect(assetManifest.length).toBeGreaterThanOrEqual(50);

    for (const item of assetManifest) {
      const diskPath = path.join(publicDir, item.webPath.replace(/^\//, ''));
      expect(fs.existsSync(diskPath), `Missing file: ${item.webPath}`).toBe(true);
      const buf = fs.readFileSync(diskPath);
      expect(buf.length).toBe(item.bytes);

      if (item.type === 'image/png') {
        expect(buf.toString('ascii', 1, 4)).toBe('PNG');
      } else if (item.type === 'audio/ogg') {
        expect(buf.toString('ascii', 0, 4)).toBe('OggS');
      }
    }
  });

  it('2. 캐릭터 및 오브젝트 스프라이트 시트의 프레임 규격이 정확히 나누어떨어져야 한다', () => {
    const sheetSpecs = [
      { fileName: 'char_aria_sheet.png', frameW: 64, frameH: 64, cols: 3, rows: 4 },
      { fileName: 'char_kyle_sheet.png', frameW: 64, frameH: 64, cols: 3, rows: 4 },
      { fileName: 'char_zero_sheet.png', frameW: 64, frameH: 64, cols: 3, rows: 4 },
      { fileName: 'char_elena_sheet.png', frameW: 16, frameH: 16, cols: 4, rows: 7 },
      { fileName: 'char_ian_inspector_sheet.png', frameW: 16, frameH: 16, cols: 4, rows: 8 },
      { fileName: 'obj_computer_popup_sheet.png', frameW: 64, frameH: 64, cols: 6, rows: 1 },
      { fileName: 'obj_quantum_orb_sheet.png', frameW: 16, frameH: 16, cols: 10, rows: 1 },
    ];

    for (const spec of sheetSpecs) {
      const entry = assetManifest.find((a) => a.fileName === spec.fileName);
      expect(entry, `Manifest entry missing for ${spec.fileName}`).toBeDefined();
      expect(entry!.width).toBe(spec.frameW * spec.cols);
      expect(entry!.height).toBe(spec.frameH * spec.rows);
    }
  });

  it('3. 캐릭터, 스프라이트, 오브젝트, UI, 아이콘 에셋은 투명 배경(Alpha Channel)을 유지해야 한다', () => {
    const transparentCategories = ['characters', 'sprites', 'objects', 'ui', 'icons'];
    const items = assetManifest.filter((a) =>
      transparentCategories.includes(a.category)
    );
    expect(items.length).toBeGreaterThan(30);

    for (const item of items) {
      expect(
        item.hasTransparency,
        `Asset ${item.fileName} is missing transparent background`
      ).toBe(true);
    }
  });

  it('4. 배경 이미지의 화면 비율(가로형 와이드 비율)과 파일 용량이 최적화 기준을 충족해야 한다', () => {
    const backgrounds = assetManifest.filter((a) => a.category === 'backgrounds');
    expect(backgrounds.length).toBeGreaterThanOrEqual(6);

    for (const bg of backgrounds) {
      expect(bg.width).toBeGreaterThan(bg.height!);
      // 모든 픽셀 아트 배경 이미지는 100KB 미만이어야 함
      expect(bg.bytes).toBeLessThan(100 * 1024);
    }

    // 전체 에셋 중 불필요하게 큰 파일(3MB 초과)이 없어야 함
    for (const item of assetManifest) {
      expect(
        item.bytes,
        `File ${item.fileName} exceeds 3MB limit (${item.bytes} bytes)`
      ).toBeLessThan(3 * 1024 * 1024);
    }
  });

  it('5. 모든 에셋의 라이선스, 원본 출처, 다운로드 URL이 매니페스트 및 LICENSE_ASSETS.md에 기록되어야 한다', () => {
    const licenseDoc = fs.readFileSync(
      path.join(rootDir, 'LICENSE_ASSETS.md'),
      'utf-8'
    );

    for (const item of assetManifest) {
      expect(item.license).toMatch(/^(CC0 1\.0|CC-BY 3\.0)$/);
      expect(item.sourceUrl).toMatch(/^https:\/\/opengameart\.org\//);
      expect(item.downloadUrl).toMatch(/^https:\/\/opengameart\.org\/sites\/default\/files\//);
      expect(licenseDoc).toContain(item.fileName);
    }
  });
});
