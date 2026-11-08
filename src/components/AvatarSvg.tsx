import React from 'react';
import {
  Activity,
  Cpu,
  Crosshair,
  Lock,
  Radio,
  Shield,
  Terminal,
} from 'lucide-react';
import { DialogueLine } from '../types/game';
import { CHARACTER_LABELS, SupportedLanguage } from '../services/i18n';

interface AvatarSvgProps {
  type: DialogueLine['avatarType'] | 'jhin' | string;
  animated?: boolean;
  language?: SupportedLanguage;
}

interface SpeakerBadgeConfig {
  callsign: string;
  roleTag: string;
  themeColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const SPEAKER_BADGE_CONFIGS: Record<string, SpeakerBadgeConfig> = {
  aria: {
    callsign: 'AHRI',
    roleTag: 'ANALYST',
    themeColor: '#00f0ff',
    icon: Radio,
  },
  kyle: {
    callsign: 'JAYCE',
    roleTag: 'OPS',
    themeColor: '#f59e0b',
    icon: Shield,
  },
  zero: {
    callsign: 'ZED',
    roleTag: 'SHADOW',
    themeColor: '#ff3b6b',
    icon: Lock,
  },
  elena: {
    callsign: 'HEIMER',
    roleTag: 'ARCHITECT',
    themeColor: '#10b981',
    icon: Cpu,
  },
  jhin: {
    callsign: 'JHIN',
    roleTag: 'SYNDICATE',
    themeColor: '#c084fc',
    icon: Crosshair,
  },
  player: {
    callsign: 'EZREAL',
    roleTag: 'INVESTIGATOR',
    themeColor: '#38bdf8',
    icon: Terminal,
  },
  system: {
    callsign: 'AEGIS',
    roleTag: 'SYSTEM',
    themeColor: '#38bdf8',
    icon: Activity,
  },
};

export const AvatarSvg: React.FC<AvatarSvgProps> = ({
  type,
  language = 'de',
}) => {
  const cfg = SPEAKER_BADGE_CONFIGS[type] || SPEAKER_BADGE_CONFIGS.system;
  const Icon = cfg.icon;
  const label =
    CHARACTER_LABELS[language]?.[type] ||
    CHARACTER_LABELS.de[type] ||
    type;

  return (
    <div
      className="cyber-speaker-badge"
      style={{
        borderColor: cfg.themeColor,
        boxShadow: `0 0 10px ${cfg.themeColor}33`,
      }}
      title={label}
      aria-label={label}
    >
      <div className="speaker-icon-glyph" style={{ color: cfg.themeColor }}>
        <Icon size={19} />
      </div>
      <span className="speaker-callsign" style={{ color: cfg.themeColor }}>
        {cfg.callsign}
      </span>
    </div>
  );
};
