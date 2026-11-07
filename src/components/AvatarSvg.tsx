import React from 'react';
import { DialogueLine } from '../types/game';
import { CHARACTER_LABELS, SupportedLanguage } from '../services/i18n';
import { assetUrl } from '../utils/assets';

interface AvatarSvgProps {
  type: DialogueLine['avatarType'] | 'jhin' | string;
  animated?: boolean;
  language?: SupportedLanguage;
}

const CHARACTER_AVATAR_CONFIG: Record<
  string,
  {
    avatarUrl: string;
    borderColor: string;
  }
> = {
  aria: {
    avatarUrl: assetUrl('/assets/characters/avatar_ahri.png'),
    borderColor: '#00f0ff',
  },
  kyle: {
    avatarUrl: assetUrl('/assets/characters/avatar_jayce.png'),
    borderColor: '#f59e0b',
  },
  zero: {
    avatarUrl: assetUrl('/assets/characters/avatar_zed.png'),
    borderColor: '#ff3b6b',
  },
  elena: {
    avatarUrl: assetUrl('/assets/characters/avatar_heimerdinger.png'),
    borderColor: '#10b981',
  },
  jhin: {
    avatarUrl: assetUrl('/assets/characters/avatar_jhin.png'),
    borderColor: '#c084fc',
  },
  player: {
    avatarUrl: assetUrl('/assets/characters/avatar_ezreal.png'),
    borderColor: '#38bdf8',
  },
  system: {
    avatarUrl: assetUrl('/assets/characters/avatar_ezreal.png'),
    borderColor: '#38bdf8',
  },
};

export const AvatarSvg: React.FC<AvatarSvgProps> = ({
  type,
  language = 'de',
}) => {
  const cfg = CHARACTER_AVATAR_CONFIG[type] || CHARACTER_AVATAR_CONFIG.system;
  const label =
    CHARACTER_LABELS[language]?.[type] ||
    CHARACTER_LABELS.de[type] ||
    type;

  return (
    <div
      className="pixel-avatar-frame unified-pixel-art"
      style={{ borderColor: cfg.borderColor }}
      title={label}
      aria-label={label}
    >
      <img
        src={cfg.avatarUrl}
        alt={label}
        className="unified-avatar-img pixelated"
      />
    </div>
  );
};
