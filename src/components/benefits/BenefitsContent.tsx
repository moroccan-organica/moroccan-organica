import React from 'react';

interface BenefitsContentProps {
    content: string;
}

export function BenefitsContent({ content }: BenefitsContentProps) {
    return (
        <div
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
