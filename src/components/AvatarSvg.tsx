import React from 'react';
import { DialogueLine } from '../types/game';
import { CHARACTER_LABELS, SupportedLanguage } from '../services/i18n';
import { assetUrl } from '../utils/assets';

interface AvatarSvgProps {
  type: DialogueLine['avatarType'];
  animated?: boolean;
  language?: SupportedLanguage;
}

const CHARACTER_SPRITE_CONFIG: Record<
  DialogueLine['avatarType'],
  {
    sheetUrl: string;
    kind: 'rpg64' | 'facility16';
    borderColor: string;
  }
> = {
  aria: {
    sheetUrl: assetUrl('/assets/characters/char_aria_sheet.png'),
    kind: 'rpg64',
    borderColor: '#00f0ff',
  },
  kyle: {
    sheetUrl: assetUrl('/assets/characters/char_kyle_sheet.png'),
    kind: 'rpg64',
    borderColor: '#f59e0b',
  },
  zero: {
    sheetUrl: assetUrl('/assets/characters/char_zero_sheet.png'),
    kind: 'rpg64',
    borderColor: '#ff3b6b',
  },
  elena: {
    sheetUrl: assetUrl('/assets/characters/char_elena_sheet.png'),
    kind: 'facility16',
    borderColor: '#10b981',
  },
  system: {
    sheetUrl: assetUrl('/assets/characters/char_ian_inspector_sheet.png'),
    kind: 'facility16',
    borderColor: '#38bdf8',
  },
};

export const AvatarSvg: React.FC<AvatarSvgProps> = ({
  type,
  animated = true,
  language = 'de',
}) => {
  const cfg = CHARACTER_SPRITE_CONFIG[type] || CHARACTER_SPRITE_CONFIG.system;
  const label =
    CHARACTER_LABELS[language]?.[type] ||
    CHARACTER_LABELS.de[type] ||
    type;

  return (
    <div
      className={`pixel-avatar-frame ${cfg.kind} ${animated ? 'is-animated' : ''}`}
      style={{ borderColor: cfg.borderColor }}
      title={label}
      aria-label={label}
    >
      <div
        className={`pixel-sprite-slice ${cfg.kind}-slice`}
        style={{ backgroundImage: `url("${cfg.sheetUrl}")` }}
      />
    </div>
  );
};
