import React from 'react';
import { SqlStageId } from '../types/game';

interface StageVisualIconProps {
  stage: SqlStageId;
  status: 'completed' | 'active' | 'locked';
}

export const StageVisualIcon: React.FC<StageVisualIconProps> = ({ stage, status }) => {
  const isLocked = status === 'locked';

  return (
    <div className={`stage-icon-box status-${status}`} aria-hidden="true">
      {stage === 1 && (
        <svg viewBox="0 0 64 64" className="stage-svg-icon">
          {/* Stage 1: ID Card / Citizen Profile */}
          <rect x="8" y="10" width="48" height="36" rx="4" fill="#0f294a" stroke="#00e5ff" strokeWidth="2.5" />
          <rect x="13" y="15" width="16" height="20" rx="2" fill="#00e5ff" fillOpacity="0.25" />
          <circle cx="21" cy="22" r="4" fill="#00e5ff" />
          <path d="M15 32c1-4 4-6 6-6s5 2 6 6" fill="#00e5ff" />
          <rect x="33" y="17" width="17" height="3" rx="1.5" fill="#38bdf8" />
          <rect x="33" y="24" width="14" height="3" rx="1.5" fill="#64748b" />
          <rect x="33" y="31" width="11" height="3" rx="1.5" fill="#64748b" />
          <path d="M24 46h16l3 6H21l3-6z" fill="#1e3a5f" stroke="#00e5ff" strokeWidth="2" />
        </svg>
      )}

      {stage === 2 && (
        <svg viewBox="0 0 64 64" className="stage-svg-icon">
          {/* Stage 2: Document with Magnifying Glass */}
          <rect x="12" y="8" width="34" height="44" rx="3" fill="#0f294a" stroke="#38bdf8" strokeWidth="2.5" />
          <rect x="18" y="16" width="18" height="3" rx="1.5" fill="#00e5ff" />
          <rect x="18" y="23" width="22" height="3" rx="1.5" fill="#64748b" />
          <rect x="18" y="30" width="14" height="3" rx="1.5" fill="#64748b" />
          <circle cx="40" cy="38" r="11" fill="#09152b" stroke="#00e5ff" strokeWidth="3" />
          <path d="M48 46l8 8" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}

      {stage === 3 && (
        <svg viewBox="0 0 64 64" className="stage-svg-icon">
          {/* Stage 3: Hooded Hacker / Intruder */}
          <path d="M14 54c2-14 10-22 18-22s16 8 18 22" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
          <path d="M32 10c-10 0-16 8-16 18 0 6 4 11 16 11s16-5 16-11c0-10-6-18-16-18z" fill="#111827" stroke="#00e5ff" strokeWidth="2.5" />
          <rect x="23" y="24" width="6" height="3" rx="1.5" fill="#00e5ff" />
          <rect x="35" y="24" width="6" height="3" rx="1.5" fill="#00e5ff" />
        </svg>
      )}

      {stage === 4 && (
        <svg viewBox="0 0 64 64" className="stage-svg-icon">
          {/* Stage 4: Database with Security Lock */}
          <ellipse cx="32" cy="14" rx="18" ry="6" fill="#1e293b" stroke={isLocked ? '#64748b' : '#38bdf8'} strokeWidth="2.2" />
          <path d="M14 14v12c0 3.3 8.1 6 18 6s18-2.7 18-6V14" fill="#0f172a" stroke={isLocked ? '#64748b' : '#38bdf8'} strokeWidth="2.2" />
          <path d="M14 26v12c0 3.3 8.1 6 18 6s18-2.7 18-6V26" fill="#0f172a" stroke={isLocked ? '#64748b' : '#38bdf8'} strokeWidth="2.2" />
          {/* Padlock */}
          <rect x="25" y="38" width="14" height="12" rx="2" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
          <path d="M28 38v-4a4 4 0 0 1 8 0v4" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="44" r="1.5" fill="#78350f" />
        </svg>
      )}

      {stage === 5 && (
        <svg viewBox="0 0 64 64" className="stage-svg-icon">
          {/* Stage 5: Database Transactions / Flow */}
          <ellipse cx="26" cy="16" rx="14" ry="5" fill="#1e293b" stroke={isLocked ? '#64748b' : '#00e5ff'} strokeWidth="2" />
          <path d="M12 16v10c0 2.8 6.3 5 14 5s14-2.2 14-5V16" fill="#0f172a" stroke={isLocked ? '#64748b' : '#00e5ff'} strokeWidth="2" />
          <path d="M12 26v10c0 2.8 6.3 5 14 5s14-2.2 14-5V26" fill="#0f172a" stroke={isLocked ? '#64748b' : '#00e5ff'} strokeWidth="2" />
          {/* Flow Arrows / Coin */}
          <circle cx="44" cy="42" r="10" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2" />
          <path d="M40 42h8m-3-3l3 3-3 3" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {stage === 6 && (
        <svg viewBox="0 0 64 64" className="stage-svg-icon">
          {/* Stage 6: Connected Join Nodes */}
          <line x1="20" y1="20" x2="44" y2="32" stroke="#818cf8" strokeWidth="2.5" />
          <line x1="20" y1="44" x2="44" y2="32" stroke="#00e5ff" strokeWidth="2.5" />
          <line x1="20" y1="20" x2="20" y2="44" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />
          <rect x="11" y="11" width="18" height="14" rx="3" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
          <rect x="11" y="37" width="18" height="14" rx="3" fill="#0f294a" stroke="#00e5ff" strokeWidth="2.5" />
          <rect x="36" y="25" width="18" height="14" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
        </svg>
      )}

      {stage === 7 && (
        <svg viewBox="0 0 64 64" className="stage-svg-icon">
          {/* Stage 7: Primary Key & Foreign Key */}
          <ellipse cx="26" cy="18" rx="14" ry="5.5" fill="#1e293b" stroke={isLocked ? '#64748b' : '#38bdf8'} strokeWidth="2" />
          <path d="M12 18v16c0 3 6.3 5.5 14 5.5s14-2.5 14-5.5V18" fill="#0f172a" stroke={isLocked ? '#64748b' : '#38bdf8'} strokeWidth="2" />
          {/* Golden Key */}
          <circle cx="44" cy="34" r="6" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          <path d="M44 40v14m0-4h4m-4-4h3" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}

      {stage === 8 && (
        <svg viewBox="0 0 64 64" className="stage-svg-icon">
          {/* Stage 8: Subquery / Trends & Deep Analytics */}
          <path d="M12 12v40h40" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="18" y="34" width="6" height="14" rx="1" fill="#3b82f6" />
          <rect x="28" y="28" width="6" height="20" rx="1" fill="#6366f1" />
          <rect x="38" y="20" width="6" height="28" rx="1" fill="#00e5ff" />
          <path d="M16 30l12-8 8 4 14-12" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="50" cy="14" r="3.5" fill="#f59e0b" />
        </svg>
      )}

      {stage === 9 && (
        <svg viewBox="0 0 64 64" className="stage-svg-icon">
          {/* Stage 9: Blueprint ERD Table Schema */}
          <rect x="10" y="10" width="44" height="44" rx="5" fill="#172554" stroke="#60a5fa" strokeWidth="2.5" />
          <rect x="16" y="16" width="32" height="8" rx="2" fill="#1e3a8a" stroke="#00e5ff" strokeWidth="1.8" />
          <line x1="16" y1="32" x2="48" y2="32" stroke="#38bdf8" strokeWidth="2" />
          <line x1="16" y1="40" x2="40" y2="40" stroke="#64748b" strokeWidth="2" />
          <line x1="16" y1="47" x2="34" y2="47" stroke="#64748b" strokeWidth="2" />
        </svg>
      )}
    </div>
  );
};
