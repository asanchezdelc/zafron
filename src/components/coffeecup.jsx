import React from 'react';

export default function CoffeeCup() {
  return (
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        {/* Coffee Cup */}
        <rect x="50" y="100" width="100" height="70" rx="10" ry="10" fill="saddlebrown"/>
        <rect x="40" y="160" width="120" height="10" fill="saddlebrown"/>
        
        {/* Smoke 1 */}
        <ellipse cx="100" cy="100" rx="20" ry="10" fill="gray">
            <animate attributeName="rx" from="20" to="40" dur="2s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="ry" from="10" to="20" dur="2s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="cy" from="100" to="70" dur="2s" begin="0s" repeatCount="indefinite" />
        </ellipse>
        
        {/* Smoke 2 */}
        <ellipse cx="100" cy="100" rx="15" ry="7.5" fill="gray" opacity="0.7">
            <animate attributeName="rx" from="15" to="30" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
            <animate attributeName="ry" from="7.5" to="15" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
            <animate attributeName="cy" from="100" to="80" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
        </ellipse>
    </svg>
  );
}