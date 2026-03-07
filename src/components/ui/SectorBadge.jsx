import React from 'react'
import { SECTOR_COLORS } from '../../utils/constants'

export function SectorBadge({ sector }) {
    const color = SECTOR_COLORS[sector] || '#4a4a6a'
    return (
        <span style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: 20,
            background: color + '22',
            color: color,
            border: `1px solid ${color}55`,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap',
        }}>
            {sector}
        </span>
    )
}
