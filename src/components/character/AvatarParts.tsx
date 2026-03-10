"use client";

import React from 'react';

export const AvatarParts = {
    base: {
        body: (color = "#FDBA74") => (
            <g id="base-body">
                {/* Face/Head Shape */}
                <path d="M50 35C35 35 25 47 25 60C25 73 35 85 50 85C65 85 75 73 75 60C75 47 65 35 50 35Z" fill={color} />
                {/* Neck */}
                <path d="M45 85H55V90H45V85Z" fill={color} />
                {/* Torso Base */}
                <path d="M30 90C30 90 25 115 25 120C25 125 30 130 50 130C70 130 75 125 75 120C75 115 70 90 70 90H30Z" fill={color} />
                {/* Eyes */}
                <circle cx="42" cy="60" r="3" fill="#1F2937" />
                <circle cx="58" cy="60" r="3" fill="#1F2937" />
            </g>
        )
    },
    head: {
        wizard_hat: (color = "#1D4ED8") => (
            <g id="wizard-hat">
                <path d="M20 45C20 45 50 20 80 45C80 45 85 50 50 50C15 50 20 45 20 45Z" fill={color} />
                <path d="M50 20L35 43H65L50 20Z" fill={color} />
                <path d="M35 37L65 37L50 20L35 37Z" fill="#FDE047" opacity="0.3" />
            </g>
        ),
        visor: (color = "#06B6D4") => (
            <g id="visor">
                <path d="M30 55H70V65H30V55Z" fill={color} fillOpacity="0.6" stroke={color} strokeWidth="2" />
                <path d="M30 57H70V58H30V57Z" fill="white" fillOpacity="0.4" />
            </g>
        )
    },
    body: {
        tshirt: (color = "#FFFFFF") => (
            <g id="t-shirt">
                <path d="M30 90L20 100L25 110L35 105V130H65V105L75 110L80 100L70 90H30Z" fill={color} />
                <path d="M40 90C40 95 60 95 60 90H40Z" fill="#E5E7EB" />
            </g>
        )
    },
    outerwear: {
        dark_knight: (color = "#4B5563") => (
            <g id="dark-knight-armor">
                <path d="M30 90V130H70V90H30Z" fill={color} />
                <path d="M30 90L20 105H35V90H30Z" fill="#374151" />
                <path d="M70 90L80 105H65V90H70Z" fill="#374151" />
                <path d="M45 100H55V120H45V100Z" fill="#FDE047" opacity="0.8" />
            </g>
        ),
        leather_jacket: (color = "#78350F") => (
            <g id="leather-jacket">
                <path d="M30 90L20 100L25 130H42V90H30Z" fill={color} />
                <path d="M70 90L80 100L75 130H58V90H70Z" fill={color} />
                <path d="M42 90L50 100L58 90H42Z" fill="#FDE047" opacity="0.5" />
            </g>
        )
    },
    accessory: {
        royal_cape: (color = "#B91C1C") => (
            <g id="royal-cape">
                <path d="M25 90C15 100 15 140 15 150H85C85 140 85 100 75 90H25Z" fill={color} />
                <path d="M30 89H70V93H30V89Z" fill="#FDE047" />
            </g>
        )
    }
};
