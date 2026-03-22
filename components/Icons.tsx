import React from 'react';
import { PieceType, PieceColor } from '../types';

interface PieceIconProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
}

export const ChessPieceIcon: React.FC<PieceIconProps> = ({ type, color, className = "w-full h-full" }) => {
  const isWhite = color === 'w';
  const fill = isWhite ? "#f8fafc" : "#1f2937"; 
  const stroke = isWhite ? "#1f2937" : "#f8fafc"; 
  
  // Added Drop Shadow Filter
  const style = { filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.4))" };

  switch (type) {
    case 'p':
      return (
        <svg viewBox="0 0 45 45" className={className} style={style}>
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'r':
      return (
        <svg viewBox="0 0 45 45" className={className} style={style}>
          <path
            d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5c0 1.25-.38 2.4-1.02 3.35C30.63 19.34 29 23.33 29 28v3H16v-3c0-4.67-1.63-8.66-4.98-10.65C10.38 16.4 10 15.25 10 14z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'n':
      return (
        <svg viewBox="0 0 45 45" className={className} style={style}>
          <path
            d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M24 18c.38 2.32-4.68 1.97-5 0 .32-2.31 4.62-1.98 5 0zM35.25 32.5c-.3 1.5-2.25 1.5-2.25 0 0-1.5 2.25-1.5 2.25 0z"
            fill={fill} 
            style={{ fill: stroke }} 
          />
        </svg>
      );
    case 'b':
      return (
        <svg viewBox="0 0 45 45" className={className} style={style}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 36c3.39-.47 5.5-2 5.5-5.43 0-3.86-1.3-3.86-1.3-6.57 0-4.57 5.25-8 9.25-8 4 0 9.3 3.43 9.3 8 0 2.71-1.3 2.71-1.3 6.57 0 3.43 2.11 4.96 5.5 5.43V39H9v-3z" />
            <path d="M16 32h13" />
            <path d="M22.5 10V6" />
            <path d="M20 8h5" />
          </g>
        </svg>
      );
    case 'q':
      return (
        <svg viewBox="0 0 45 45" className={className} style={style}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM10.5 19.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38.5 19.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" />
            <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 3 4.5 3 5v5h16v-5c0-.5 2-2.5 3-5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" />
          </g>
        </svg>
      );
    case 'k':
      return (
        <svg viewBox="0 0 45 45" className={className} style={style}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.5 11.63V6" />
            <path d="M20 8h5" />
            <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
            <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 5.5-8 12H13.5c-3-6.5-4-13-8-12-3 6 6 10.5 6 10.5v7z" />
          </g>
        </svg>
      );
  }
};