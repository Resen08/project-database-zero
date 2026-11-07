import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const PUBLIC_ASSETS_DIR = path.join(ROOT_DIR, 'public', 'assets');
const DEFAULT_STAGING_DIR =
  'C:\\Users\\jiwon\\.gemini\\antigravity\\brain\\7163bc9a-dfda-43e3-b402-856959144fba\\scratch\\assets_staging';
const STAGING_DIR = fs.existsSync(DEFAULT_STAGING_DIR)
  ? DEFAULT_STAGING_DIR
  : path.join(os.tmpdir(), 'database-zero-assets-staging');

const SUBDIRS = [
  'backgrounds',
  'characters',
  'sprites',
  'objects',
  'ui',
  'icons',
  'audio',
  'music',
];

for (const sub of SUBDIRS) {
  fs.mkdirSync(path.join(PUBLIC_ASSETS_DIR, sub), { recursive: true });
}

const REMOTE_SOURCES = [
  {
    name: 'warped_city',
    url: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    type: 'zip',
  },
  {
    name: 'cyberpunk_street',
    url: 'https://opengameart.org/sites/default/files/cyberpunk-street-files.zip',
    type: 'zip',
  },
  {
    name: 'scifi_facility',
    url: 'https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip',
    type: 'zip',
  },
  {
    name: 'cyber_city',
    url: 'https://opengameart.org/sites/default/files/CyberCity.zip',
    type: 'zip',
  },
  {
    name: 'kenney_ui_scifi',
    url: 'https://opengameart.org/sites/default/files/kenney_ui-pack-scifi.zip',
    type: 'zip',
  },
  {
    name: 'kenney_scifi_sounds',
    url: 'https://opengameart.org/sites/default/files/sci-fi_sounds.zip',
    type: 'zip',
  },
  {
    name: 'buch_scifi_interior_preview.png',
    url: 'https://opengameart.org/sites/default/files/scifitiles-pre-2x.png',
    type: 'file',
  },
  {
    name: 'buch_scifi_lab_large.png',
    url: 'https://opengameart.org/sites/default/files/preview-large.png',
    type: 'file',
  },
  {
    name: 'buch_scifi_lab_alt.png',
    url: 'https://opengameart.org/sites/default/files/preview-large-alt.png',
    type: 'file',
  },
];

async function ensureStagingReady() {
  fs.mkdirSync(STAGING_DIR, { recursive: true });
  for (const item of REMOTE_SOURCES) {
    const targetCheck = path.join(STAGING_DIR, item.name);
    if (fs.existsSync(targetCheck)) continue;

    console.log(`[Download] Fetching ${item.name} from ${item.url}...`);
    const res = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
      throw new Error(`Failed to download ${item.url}: HTTP ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (item.type === 'zip') {
      const zipPath = path.join(STAGING_DIR, `${item.name}.zip`);
      fs.writeFileSync(zipPath, buf);
      fs.mkdirSync(targetCheck, { recursive: true });
      execFileSync('tar.exe', ['-xf', zipPath, '-C', targetCheck]);
    } else {
      fs.writeFileSync(targetCheck, buf);
    }
  }
}

function parsePngMeta(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 29 || buf.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error(`Invalid PNG header: ${filePath}`);
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf.readUInt8(24);
  const colorType = buf.readUInt8(25);
  const hasTrns = buf.includes(Buffer.from('tRNS'));
  const hasTransparency = colorType === 6 || colorType === 4 || hasTrns;
  return { width, height, bitDepth, colorType, hasTransparency, bytes: buf.length };
}

function parseOggMeta(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 4 || buf.toString('ascii', 0, 4) !== 'OggS') {
    throw new Error(`Invalid OGG header: ${filePath}`);
  }
  return { bytes: buf.length, format: 'OGG Vorbis' };
}

export const ASSET_MAPPINGS = [
  // 1. Backgrounds
  {
    category: 'backgrounds',
    dest: 'bg_cyberpunk_street.png',
    src: 'cyberpunk_street/cyberpunk-street-files/PNG/cyberpunk-street.png',
    sourcePack: 'Cyberpunk Street Environment (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/cyberpunk-street-environment',
    downloadUrl: 'https://opengameart.org/sites/default/files/cyberpunk-street-files.zip',
    license: 'CC-BY 3.0',
    attribution: 'Luis Zuno (@ansimuz)',
  },
  {
    category: 'backgrounds',
    dest: 'bg_warped_city_skyline.png',
    src: 'warped_city/warped city files/demo/assets/environment/bg-3.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, created by Luis Zuno @ansimuz)',
  },
  {
    category: 'backgrounds',
    dest: 'bg_warped_buildings.png',
    src: 'warped_city/warped city files/ENVIRONMENT/background/near-buildings-bg.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
  },
  {
    category: 'backgrounds',
    dest: 'bg_aegis_lab.png',
    src: 'buch_scifi_interior_preview.png',
    sourcePack: 'Sci-Fi Interior Tiles (Buch)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-interior-tiles',
    downloadUrl: 'https://opengameart.org/sites/default/files/scifitiles-pre-2x.png',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, created by Buch)',
  },
  {
    category: 'backgrounds',
    dest: 'bg_quantum_server_room.png',
    src: 'buch_scifi_lab_large.png',
    sourcePack: 'Sci-Fi Platformer Tileset (Buch)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-platformer-tileset',
    downloadUrl: 'https://opengameart.org/sites/default/files/preview-large.png',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, created by Buch)',
  },
  {
    category: 'backgrounds',
    dest: 'bg_underground_station.png',
    src: 'buch_scifi_lab_alt.png',
    sourcePack: 'Sci-Fi Platformer Tileset Alt (Buch)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-platformer-tileset',
    downloadUrl: 'https://opengameart.org/sites/default/files/preview-large-alt.png',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, created by Buch)',
  },
  {
    category: 'backgrounds',
    dest: 'bg_cyber_city_overview.png',
    src: 'cyber_city/CyberCity/city.png',
    sourcePack: 'Cyber City (warlloyd)',
    sourceUrl: 'https://opengameart.org/content/cyber-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/CyberCity.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, created by warlloyd)',
  },

  // 2. Characters (Player & NPC Sprite Sheets)
  {
    category: 'characters',
    dest: 'char_aria_sheet.png',
    src: 'cyber_city/CyberCity/lady.png',
    sourcePack: 'Cyber City (warlloyd)',
    sourceUrl: 'https://opengameart.org/content/cyber-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/CyberCity.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'characters',
    dest: 'char_kyle_sheet.png',
    src: 'cyber_city/CyberCity/$YakuzaBoss.png',
    sourcePack: 'Cyber City (warlloyd)',
    sourceUrl: 'https://opengameart.org/content/cyber-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/CyberCity.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'characters',
    dest: 'char_elena_sheet.png',
    src: 'scifi_facility/sci-fi-facility-asset-pack/guard_white_spritesheet.png',
    sourcePack: 'Sci-Fi Facility Asset Pack (HaywardMorihara)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-facility-asset-pack',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'characters',
    dest: 'char_zero_sheet.png',
    src: 'cyber_city/CyberCity/$Yakuza1.png',
    sourcePack: 'Cyber City (warlloyd)',
    sourceUrl: 'https://opengameart.org/content/cyber-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/CyberCity.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'characters',
    dest: 'char_ian_inspector_sheet.png',
    src: 'scifi_facility/sci-fi-facility-asset-pack/inspector_spritesheet.png',
    sourcePack: 'Sci-Fi Facility Asset Pack (HaywardMorihara)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-facility-asset-pack',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'characters',
    dest: 'char_marcus_guard_sheet.png',
    src: 'scifi_facility/sci-fi-facility-asset-pack/guard_yellow_spritesheet.png',
    sourcePack: 'Sci-Fi Facility Asset Pack (HaywardMorihara)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-facility-asset-pack',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },

  // 3. Animated Character & Drone Sprites
  {
    category: 'sprites',
    dest: 'player_idle_1.png',
    src: 'warped_city/warped city files/SPRITES/player/idle/idle-1.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'player_idle_2.png',
    src: 'warped_city/warped city files/SPRITES/player/idle/idle-2.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'player_idle_3.png',
    src: 'warped_city/warped city files/SPRITES/player/idle/idle-3.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'player_idle_4.png',
    src: 'warped_city/warped city files/SPRITES/player/idle/idle-4.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'player_run_1.png',
    src: 'warped_city/warped city files/SPRITES/player/run/run-1.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'player_run_2.png',
    src: 'warped_city/warped city files/SPRITES/player/run/run-2.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'player_run_3.png',
    src: 'warped_city/warped city files/SPRITES/player/run/run-3.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'player_run_4.png',
    src: 'warped_city/warped city files/SPRITES/player/run/run-4.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'drone_1.png',
    src: 'warped_city/warped city files/SPRITES/misc/drone/drone-1.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'drone_2.png',
    src: 'warped_city/warped city files/SPRITES/misc/drone/drone-2.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'drone_3.png',
    src: 'warped_city/warped city files/SPRITES/misc/drone/drone-3.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'drone_4.png',
    src: 'warped_city/warped city files/SPRITES/misc/drone/drone-4.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'sprites',
    dest: 'hacker_kid_spritesheet.png',
    src: 'scifi_facility/sci-fi-facility-asset-pack/the_kid_spritesheet.png',
    sourcePack: 'Sci-Fi Facility Asset Pack (HaywardMorihara)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-facility-asset-pack',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },

  // 4. Objects
  {
    category: 'objects',
    dest: 'obj_computer_terminal.png',
    src: 'scifi_facility/sci-fi-facility-asset-pack/computer_spritesheet.png',
    sourcePack: 'Sci-Fi Facility Asset Pack (HaywardMorihara)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-facility-asset-pack',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'objects',
    dest: 'obj_computer_popup_sheet.png',
    src: 'scifi_facility/sci-fi-facility-asset-pack/computer_popup_spritesheet.png',
    sourcePack: 'Sci-Fi Facility Asset Pack (HaywardMorihara)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-facility-asset-pack',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'objects',
    dest: 'obj_lab_doodads_sheet.png',
    src: 'scifi_facility/sci-fi-facility-asset-pack/doodads_spritesheet.png',
    sourcePack: 'Sci-Fi Facility Asset Pack (HaywardMorihara)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-facility-asset-pack',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'objects',
    dest: 'obj_quantum_orb_sheet.png',
    src: 'scifi_facility/sci-fi-facility-asset-pack/orb_spritesheet.png',
    sourcePack: 'Sci-Fi Facility Asset Pack (HaywardMorihara)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-facility-asset-pack',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'objects',
    dest: 'obj_data_portal_sheet.png',
    src: 'scifi_facility/sci-fi-facility-asset-pack/portal_spritesheet.png',
    sourcePack: 'Sci-Fi Facility Asset Pack (HaywardMorihara)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-facility-asset-pack',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'objects',
    dest: 'obj_server_control_box1.png',
    src: 'warped_city/warped city files/ENVIRONMENT/props/control-box-1.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'objects',
    dest: 'obj_server_control_box3.png',
    src: 'warped_city/warped city files/ENVIRONMENT/props/control-box-3.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'objects',
    dest: 'obj_ai_monitor_1.png',
    src: 'warped_city/warped city files/ENVIRONMENT/props/monitorface/monitor-face-1.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'objects',
    dest: 'obj_ai_monitor_2.png',
    src: 'warped_city/warped city files/ENVIRONMENT/props/monitorface/monitor-face-2.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'objects',
    dest: 'obj_police_spinner.png',
    src: 'warped_city/warped city files/SPRITES/vehicles/v-police.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },
  {
    category: 'objects',
    dest: 'obj_turret_sensor.png',
    src: 'warped_city/warped city files/SPRITES/misc/turret/turret-1.png',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },

  // 5. UI Elements
  {
    category: 'ui',
    dest: 'ui_panel_glass_notches.png',
    src: 'kenney_ui_scifi/PNG/Extra/Double/panel_glass_notches.png',
    sourcePack: 'Kenney UI Pack: Sci-Fi',
    sourceUrl: 'https://opengameart.org/content/ui-pack-sci-fi',
    downloadUrl: 'https://opengameart.org/sites/default/files/kenney_ui-pack-scifi.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
    requireAlpha: true,
  },
  {
    category: 'ui',
    dest: 'ui_button_blade_blue.png',
    src: 'kenney_ui_scifi/PNG/Blue/Double/button_square_header_blade_rectangle.png',
    sourcePack: 'Kenney UI Pack: Sci-Fi',
    sourceUrl: 'https://opengameart.org/content/ui-pack-sci-fi',
    downloadUrl: 'https://opengameart.org/sites/default/files/kenney_ui-pack-scifi.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
    requireAlpha: true,
  },
  {
    category: 'ui',
    dest: 'ui_button_blade_green.png',
    src: 'kenney_ui_scifi/PNG/Green/Double/button_square_header_blade_rectangle.png',
    sourcePack: 'Kenney UI Pack: Sci-Fi',
    sourceUrl: 'https://opengameart.org/content/ui-pack-sci-fi',
    downloadUrl: 'https://opengameart.org/sites/default/files/kenney_ui-pack-scifi.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
    requireAlpha: true,
  },
  {
    category: 'ui',
    dest: 'ui_bar_blue.png',
    src: 'kenney_ui_scifi/PNG/Blue/Double/bar_round_gloss_large.png',
    sourcePack: 'Kenney UI Pack: Sci-Fi',
    sourceUrl: 'https://opengameart.org/content/ui-pack-sci-fi',
    downloadUrl: 'https://opengameart.org/sites/default/files/kenney_ui-pack-scifi.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
    requireAlpha: true,
  },

  // 6. Icons
  {
    category: 'icons',
    dest: 'icon_crosshair_blue.png',
    src: 'kenney_ui_scifi/PNG/Blue/Double/crosshair_color_a.png',
    sourcePack: 'Kenney UI Pack: Sci-Fi',
    sourceUrl: 'https://opengameart.org/content/ui-pack-sci-fi',
    downloadUrl: 'https://opengameart.org/sites/default/files/kenney_ui-pack-scifi.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
    requireAlpha: true,
  },
  {
    category: 'icons',
    dest: 'icon_crosshair_green.png',
    src: 'kenney_ui_scifi/PNG/Green/Double/crosshair_color_a.png',
    sourcePack: 'Kenney UI Pack: Sci-Fi',
    sourceUrl: 'https://opengameart.org/content/ui-pack-sci-fi',
    downloadUrl: 'https://opengameart.org/sites/default/files/kenney_ui-pack-scifi.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
    requireAlpha: true,
  },
  {
    category: 'icons',
    dest: 'icon_cursor_scifi.png',
    src: 'kenney_ui_scifi/PNG/Extra/Double/cursor_f.png',
    sourcePack: 'Kenney UI Pack: Sci-Fi',
    sourceUrl: 'https://opengameart.org/content/ui-pack-sci-fi',
    downloadUrl: 'https://opengameart.org/sites/default/files/kenney_ui-pack-scifi.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
    requireAlpha: true,
  },
  {
    category: 'icons',
    dest: 'icon_button_switch.png',
    src: 'scifi_facility/sci-fi-facility-asset-pack/button_large_spritesheet.png',
    sourcePack: 'Sci-Fi Facility Asset Pack (HaywardMorihara)',
    sourceUrl: 'https://opengameart.org/content/sci-fi-facility-asset-pack',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi-facility-asset-pack.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
    requireAlpha: true,
  },

  // 7. Audio SFX
  {
    category: 'audio',
    dest: 'sfx_click.ogg',
    src: 'kenney_scifi_sounds/Audio/laserRetro_000.ogg',
    sourcePack: 'Kenney Sci-Fi Sounds',
    sourceUrl: 'https://opengameart.org/content/sci-fi-sounds',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi_sounds.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
  },
  {
    category: 'audio',
    dest: 'sfx_query_run.ogg',
    src: 'kenney_scifi_sounds/Audio/computerNoise_000.ogg',
    sourcePack: 'Kenney Sci-Fi Sounds',
    sourceUrl: 'https://opengameart.org/content/sci-fi-sounds',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi_sounds.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
  },
  {
    category: 'audio',
    dest: 'sfx_scan_object.ogg',
    src: 'warped_city/warped city files/demo/assets/sounds/beam.ogg',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
  },
  {
    category: 'audio',
    dest: 'sfx_mission_success.ogg',
    src: 'kenney_scifi_sounds/Audio/forceField_000.ogg',
    sourcePack: 'Kenney Sci-Fi Sounds',
    sourceUrl: 'https://opengameart.org/content/sci-fi-sounds',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi_sounds.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
  },
  {
    category: 'audio',
    dest: 'sfx_error.ogg',
    src: 'kenney_scifi_sounds/Audio/impactMetal_000.ogg',
    sourcePack: 'Kenney Sci-Fi Sounds',
    sourceUrl: 'https://opengameart.org/content/sci-fi-sounds',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi_sounds.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
  },
  {
    category: 'audio',
    dest: 'sfx_door_open.ogg',
    src: 'kenney_scifi_sounds/Audio/doorOpen_000.ogg',
    sourcePack: 'Kenney Sci-Fi Sounds',
    sourceUrl: 'https://opengameart.org/content/sci-fi-sounds',
    downloadUrl: 'https://opengameart.org/sites/default/files/sci-fi_sounds.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0, Kenney.nl)',
  },

  // 8. Background Music
  {
    category: 'music',
    dest: 'bgm_cyberpunk_investigation.ogg',
    src: 'warped_city/warped city files/demo/assets/sounds/sci_fi_platformer02.ogg',
    sourcePack: 'Warped City (Ansimuz)',
    sourceUrl: 'https://opengameart.org/content/warped-city',
    downloadUrl: 'https://opengameart.org/sites/default/files/warped_city_files.zip',
    license: 'CC0 1.0',
    attribution: 'Not required (CC0)',
  },
];

await ensureStagingReady();

const verifiedManifest = [];

for (const item of ASSET_MAPPINGS) {
  const srcPath = path.join(STAGING_DIR, item.src);
  const destPath = path.join(PUBLIC_ASSETS_DIR, item.category, item.dest);

  if (!fs.existsSync(srcPath)) {
    throw new Error(`Missing source asset in staging: ${srcPath}`);
  }

  fs.copyFileSync(srcPath, destPath);

  const webPath = `/assets/${item.category}/${item.dest}`;
  if (item.dest.endsWith('.png')) {
    const meta = parsePngMeta(destPath);
    if (item.requireAlpha && !meta.hasTransparency) {
      throw new Error(`Expected transparency on ${item.dest} (colorType=${meta.colorType})`);
    }
    verifiedManifest.push({
      category: item.category,
      fileName: item.dest,
      webPath,
      sourcePack: item.sourcePack,
      sourceUrl: item.sourceUrl,
      downloadUrl: item.downloadUrl,
      license: item.license,
      attribution: item.attribution,
      type: 'image/png',
      width: meta.width,
      height: meta.height,
      hasTransparency: meta.hasTransparency,
      bytes: meta.bytes,
    });
  } else if (item.dest.endsWith('.ogg')) {
    const meta = parseOggMeta(destPath);
    verifiedManifest.push({
      category: item.category,
      fileName: item.dest,
      webPath,
      sourcePack: item.sourcePack,
      sourceUrl: item.sourceUrl,
      downloadUrl: item.downloadUrl,
      license: item.license,
      attribution: item.attribution,
      type: 'audio/ogg',
      bytes: meta.bytes,
    });
  }
}

const manifestPath = path.join(ROOT_DIR, 'src', 'data', 'assetManifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(verifiedManifest, null, 2), 'utf-8');
console.log(`Successfully copied and verified ${verifiedManifest.length} game assets!`);
