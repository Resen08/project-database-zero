# 무료 게임 에셋 및 오픈소스 라이선스 관리 대장 (LICENSE_ASSETS.md)

본 프로젝트(**PROJECT DATABASE ZERO**)에 통합된 모든 그래픽(배경, 캐릭터 스프라이트, 애니메이션 프레임, 조사 오브젝트, UI, 아이콘), 사운드(효과음, 배경음악), 폰트 및 오픈소스 라이브러리는 실제 공식 출처에서 다운로드 및 라이선스 검증을 거쳤습니다.

자동 다운로드 및 무결성 검증 스크립트는 [`scripts/fetch-and-verify-assets.mjs`](file:///c:/Users/jiwon/Desktop/sql/scripts/fetch-and-verify-assets.mjs)에 작성되어 있습니다.

---

## 1. 다운로드한 원본 에셋 패키지 및 라이선스 요약

| 패키지 명칭 | 제작자 / 출처 사이트 | 원본 페이지 URL | 직접 다운로드 URL | 라이선스 | 상업적 이용 | 수정·재배포 | 출처 표기 의무 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Warped City** | Luis Zuno (@ansimuz) / OpenGameArt | https://opengameart.org/content/warped-city | https://opengameart.org/sites/default/files/warped_city_files.zip | **CC0 1.0** (Public Domain) | 가능 (O) | 가능 (O) | 의무 없음 (자율 표기: Luis Zuno @ansimuz) |
| **Cyberpunk Street Environment** | Luis Zuno (@ansimuz) / OpenGameArt | https://opengameart.org/content/cyberpunk-street-environment | https://opengameart.org/sites/default/files/cyberpunk-street-files.zip | **CC-BY 3.0** | 가능 (O) | 가능 (O) | **표기 필수**: `"Cyberpunk Street Environment" by Luis Zuno (@ansimuz)` |
| **Sci-Fi Facility Asset Pack** | HaywardMorihara / OpenGameArt | https://opengameart.org/content/sci-fi-facility-asset-pack | https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip | **CC0 1.0** (Public Domain) | 가능 (O) | 가능 (O) | 의무 없음 (자율 표기: HaywardMorihara) |
| **Sci-Fi Interior Tiles** | Buch / OpenGameArt | https://opengameart.org/content/sci-fi-interior-tiles | https://opengameart.org/sites/default/files/scifitiles-pre-2x.png | **CC0 1.0** (Public Domain) | 가능 (O) | 가능 (O) | 의무 없음 (자율 표기: Buch) |
| **Sci-Fi Platformer Tileset** | Buch / OpenGameArt | https://opengameart.org/content/sci-fi-platformer-tileset | https://opengameart.org/sites/default/files/preview-large.png | **CC0 1.0** (Public Domain) | 가능 (O) | 가능 (O) | 의무 없음 (자율 표기: Buch) |
| **Cyber City** | warlloyd / OpenGameArt | https://opengameart.org/content/cyber-city | https://opengameart.org/sites/default/files/CyberCity.zip | **CC0 1.0** (Public Domain) | 가능 (O) | 가능 (O) | 의무 없음 (자율 표기: warlloyd) |
| **Kenney UI Pack: Sci-Fi** | Kenney / Kenney.nl & OpenGameArt | https://opengameart.org/content/ui-pack-sci-fi | https://opengameart.org/sites/default/files/kenney_ui-pack-scifi.zip | **CC0 1.0** (Public Domain) | 가능 (O) | 가능 (O) | 의무 없음 (자율 표기: Kenney.nl) |
| **Kenney Sci-Fi Sounds** | Kenney / Kenney.nl & OpenGameArt | https://opengameart.org/content/sci-fi-sounds | https://opengameart.org/sites/default/files/sci-fi_sounds.zip | **CC0 1.0** (Public Domain) | 가능 (O) | 가능 (O) | 의무 없음 (자율 표기: Kenney.nl) |

---

## 2. 디렉토리별 통합 에셋 상세 목록 (`public/assets/` 총 52개 파일)

### 2.1 배경 이미지 (`public/assets/backgrounds/` — 7개 파일)
| 파일명 | 해상도 | 원본 패키지 | 게임 내 적용 위치 | 라이선스 |
| :--- | :--- | :--- | :--- | :--- |
| `bg_cyberpunk_street.png` | `608x192` | Cyberpunk Street Environment (Ansimuz) | Chapter 2 네온 마켓 환전소 & 거리 배경 | CC-BY 3.0 (by Luis Zuno @ansimuz) |
| `bg_warped_city_skyline.png` | `1009x224` | Warped City (Ansimuz) | 메인 메뉴 사이버펑크 스카이라인 파노라마 배경 | CC0 1.0 |
| `bg_warped_buildings.png` | `493x209` | Warped City (Ansimuz) | 도시 전경 패럴랙스 서브 레이어 | CC0 1.0 |
| `bg_aegis_lab.png` | `734x352` | Sci-Fi Interior Tiles (Buch) | SEC-01 아이기스 중앙 데이터 분석실 배경 | CC0 1.0 |
| `bg_quantum_server_room.png` | `512x352` | Sci-Fi Platformer Tileset (Buch) | Chapter 1 SEC-02 헬리오스 제1양자서버실 배경 | CC0 1.0 |
| `bg_underground_station.png` | `512x352` | Sci-Fi Platformer Tileset Alt (Buch) | Chapter 3 SEC-05 구 지하철 제9폐쇄역 은신처 배경 | CC0 1.0 |
| `bg_cyber_city_overview.png` | `512x320` | Cyber City (warlloyd) | 구역 브리핑 맵 배경 | CC0 1.0 |

### 2.2 플레이어 및 NPC 캐릭터 스프라이트 시트 (`public/assets/characters/` — 6개 파일)
| 파일명 | 해상도 / 프레임 규격 | 원본 패키지 | 게임 내 캐릭터 매핑 | 라이선스 |
| :--- | :--- | :--- | :--- | :--- |
| `char_aria_sheet.png` | `192x256` (`64x64` × 3열 4행, RGBA 투명) | Cyber City (warlloyd) | **아리아 첸 팀장** (수석 데이터 분석팀장) | CC0 1.0 |
| `char_kyle_sheet.png` | `192x256` (`64x64` × 3열 4행, RGBA 투명) | Cyber City (warlloyd) | **카일 반스 감독관** (시스템 보안 감독관) | CC0 1.0 |
| `char_zero_sheet.png` | `192x256` (`64x64` × 3열 4행, RGBA 투명) | Cyber City (warlloyd) | **단테 제로** (고스트 프로토콜 해커) | CC0 1.0 |
| `char_elena_sheet.png` | `64x112` (`16x16` × 4열 7행, RGBA 투명) | Sci-Fi Facility Asset Pack | **엘레나 송 박사** (수석 DB 아키텍트) | CC0 1.0 |
| `char_ian_inspector_sheet.png` | `64x128` (`16x16` × 4열 8행, RGBA 투명) | Sci-Fi Facility Asset Pack | **이안 조 수사관** (플레이어 조사원 스프라이트) | CC0 1.0 |
| `char_marcus_guard_sheet.png` | `64x112` (`16x16` × 4열 7행, RGBA 투명) | Sci-Fi Facility Asset Pack | **마커스 진** (내부 공모 엔지니어) | CC0 1.0 |

### 2.3 캐릭터 및 드론 애니메이션 프레임 (`public/assets/sprites/` — 13개 파일)
| 파일명 | 해상도 | 원본 패키지 | 게임 내 애니메이션 적용 | 라이선스 |
| :--- | :--- | :--- | :--- | :--- |
| `player_idle_1.png`, `player_idle_2.png`, `player_idle_3.png`, `player_idle_4.png` | `71x67` (4프레임, RGBA) | Warped City (Ansimuz) | 플레이어 캐릭터 대기(Idle) 호흡 애니메이션 | CC0 1.0 |
| `player_run_1.png`, `player_run_2.png`, `player_run_3.png`, `player_run_4.png` | `71x67` (4프레임, RGBA) | Warped City (Ansimuz) | 플레이어 현장 이동/단서 스캔 액션 애니메이션 | CC0 1.0 |
| `drone_1.png`, `drone_2.png`, `drone_3.png`, `drone_4.png` | `55x52` (4프레임, RGBA) | Warped City (Ansimuz) | 아이기스 보안 감시 드론 비행 애니메이션 | CC0 1.0 |
| `hacker_kid_spritesheet.png` | `160x16` (`16x16` × 10프레임, RGBA) | Sci-Fi Facility Asset Pack | 언더그라운드 해커 터미널 애니메이션 | CC0 1.0 |

### 2.4 조사 가능한 오브젝트 (`public/assets/objects/` — 11개 파일)
| 파일명 | 해상도 | 원본 패키지 | 게임 내 조사 오브젝트 매핑 | 라이선스 |
| :--- | :--- | :--- | :--- | :--- |
| `obj_computer_terminal.png` | `32x16` (`16x16` × 2프레임) | Sci-Fi Facility Asset Pack | 엘레나 박사의 개인 보안 단말기 (`terminal`) | CC0 1.0 |
| `obj_computer_popup_sheet.png` | `384x64` (`64x64` × 6프레임) | Sci-Fi Facility Asset Pack | 단말기 해킹/코드 부팅 애니메이션 모니터 | CC0 1.0 |
| `obj_lab_doodads_sheet.png` | `96x80` | Sci-Fi Facility Asset Pack | 연구소 책상, 의자, 분석 콘솔 소품 | CC0 1.0 |
| `obj_quantum_orb_sheet.png` | `160x16` (`16x16` × 10프레임) | Sci-Fi Facility Asset Pack | 양자 코어 오브 및 암호화 토큰 (`badge`) | CC0 1.0 |
| `obj_data_portal_sheet.png` | `96x16` (`16x16` × 6프레임) | Sci-Fi Facility Asset Pack | 데이터 포털 및 중계 노드 | CC0 1.0 |
| `obj_server_control_box1.png` | `32x30` | Warped City (Ansimuz) | 네온 마켓 익명 환전 키오스크 (`vault`) | CC0 1.0 |
| `obj_server_control_box3.png` | `62x30` | Warped City (Ansimuz) | 보안 로그-시민 신원 교차 서버 랙 (`server`) | CC0 1.0 |
| `obj_ai_monitor_1.png`, `obj_ai_monitor_2.png` | `21x18` (2프레임) | Warped City (Ansimuz) | 대법정 기소 스키마 단말 모니터 (`document`) | CC0 1.0 |
| `obj_turret_sensor.png` | `25x23` | Warped City (Ansimuz) | 양자서버실 출입 게이트 AI 센서 (`cctv`) | CC0 1.0 |
| `obj_police_spinner.png` | `163x60` | Warped City (Ansimuz) | 아이기스 수사국 순찰 스피너 차량 | CC0 1.0 |

### 2.5 게임 UI 및 아이콘 (`public/assets/ui/` 4개, `public/assets/icons/` 4개 파일)
| 파일명 | 해상도 | 원본 패키지 | 용도 | 라이선스 |
| :--- | :--- | :--- | :--- | :--- |
| `ui_panel_glass_notches.png` | `128x128` | Kenney UI Pack: Sci-Fi | 사이버펑크 HUD 프레임 장식 | CC0 1.0 |
| `ui_button_blade_blue.png` | `384x128` | Kenney UI Pack: Sci-Fi | 메인 액션 버튼 텍스처 | CC0 1.0 |
| `ui_button_blade_green.png` | `384x128` | Kenney UI Pack: Sci-Fi | 미션 클리어/실행 버튼 텍스처 | CC0 1.0 |
| `ui_bar_blue.png` | `192x48` | Kenney UI Pack: Sci-Fi | 수사 진행도 게이지 바 | CC0 1.0 |
| `icon_crosshair_blue.png` | `60x60` | Kenney UI Pack: Sci-Fi | 미조사 오브젝트 타겟 마커 | CC0 1.0 |
| `icon_crosshair_green.png` | `60x60` | Kenney UI Pack: Sci-Fi | 조사 완료 오브젝트 타겟 마커 | CC0 1.0 |
| `icon_cursor_scifi.png` | `46x46` | Kenney UI Pack: Sci-Fi | 수사 스캐너 포인터 아이콘 | CC0 1.0 |
| `icon_button_switch.png` | `32x16` | Sci-Fi Facility Asset Pack | 터미널 상태 스위치 아이콘 | CC0 1.0 |

### 2.6 사운드 효과음 및 배경음악 (`public/assets/audio/` 6개, `public/assets/music/` 1개 파일)
| 파일명 | 용량 | 원본 패키지 | 게임 내 사운드 이벤트 | 라이선스 |
| :--- | :--- | :--- | :--- | :--- |
| `sfx_click.ogg` | `12.5 KB` | Kenney Sci-Fi Sounds (`laserRetro_000.ogg`) | 버튼 클릭 및 탭 전환 효과음 | CC0 1.0 |
| `sfx_query_run.ogg` | `119.0 KB` | Kenney Sci-Fi Sounds (`computerNoise_000.ogg`) | SQL 쿼리 실행 효과음 | CC0 1.0 |
| `sfx_scan_object.ogg` | `5.7 KB` | Warped City (`beam.ogg`) | 현장 오브젝트 단서 조사 스캔음 | CC0 1.0 |
| `sfx_mission_success.ogg` | `25.6 KB` | Kenney Sci-Fi Sounds (`forceField_000.ogg`) | SQL 미션 검증 통과 / 단서 해금 효과음 | CC0 1.0 |
| `sfx_error.ogg` | `15.4 KB` | Kenney Sci-Fi Sounds (`impactMetal_000.ogg`) | SQL 문법 오류 / 보안 가드 경고음 | CC0 1.0 |
| `sfx_door_open.ogg` | `19.6 KB` | Kenney Sci-Fi Sounds (`doorOpen_000.ogg`) | 챕터 이동 및 모달 오픈 효과음 | CC0 1.0 |
| `bgm_cyberpunk_investigation.ogg` | `2.81 MB` | Warped City (`sci_fi_platformer02.ogg`) | 사이버펑크 데이터 수사 배경음악 (루프) | CC0 1.0 |

---

## 3. 폰트 및 핵심 오픈소스 소프트웨어

- **Google Fonts**: `Orbitron`, `Noto Sans KR`, `JetBrains Mono` (SIL Open Font License 1.1)
- **sql.js**: SQLite WebAssembly 엔진 (MIT License)
- **Monaco Editor (`@monaco-editor/react`)**: SQL 코드 에디터 (MIT License)
- **Lucide Icons (`lucide-react`)**: 보조 UI 아이콘 (ISC License)
