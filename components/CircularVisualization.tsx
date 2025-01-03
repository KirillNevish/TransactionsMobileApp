import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

interface CircularVisualizationProps {
    currentProgress: number;
    goalAmount: number;
}

const CircularVisualization: React.FC<CircularVisualizationProps> = ({ currentProgress, goalAmount }) => {
    const radius = 40; // Radius of the circle
    const strokeWidth = 5;
    const circumference = 2 * Math.PI * radius;
    const centerX = radius + strokeWidth; // Center X
    const centerY = radius + strokeWidth; // Center Y

    const progressPercentage = Math.min(currentProgress / goalAmount, 1); // Ensure max 100%
    const strokeDashoffset = circumference - progressPercentage * circumference;


    const { theme } = useTheme();

    const isDarkMode = theme === 'dark';

    return (
        <Svg width={2 * (radius + strokeWidth)} height={2 * (radius + strokeWidth)}>
            {/* Circle Background */}
            <Circle
                cx={centerX}
                cy={centerY}
                r={radius}
                stroke="#E5E5E5"
                strokeWidth={strokeWidth}
                fill="none"
            />

            {/* Circle Progress */}
            <Circle
                cx={centerX}
                cy={centerY}
                r={radius}
                stroke={isDarkMode ? '#10CDFC' : '#1C26FF'}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset} // Update progress dynamically later
                strokeLinecap="round"
                transform={`rotate(-90 ${centerX} ${centerY})`}
            />

            {/* Center Text */}
            <SvgText
                x={centerX}
                y={centerY}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={12}
                fontWeight="bold"
                fill={isDarkMode ? '#fff' : '#000'}
            >
                {`zł ${goalAmount}`}
            </SvgText>
        </Svg>
    );
};
export default CircularVisualization;
