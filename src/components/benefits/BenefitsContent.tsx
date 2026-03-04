'use client';

import React from 'react';
import { HtmlContent } from '@/components/common/HtmlContent';

interface BenefitsContentProps {
    content: string;
    dir?: 'ltr' | 'rtl';
}

export function BenefitsContent({ content, dir }: BenefitsContentProps) {
    return (
        <HtmlContent
            html={content}
            className="rich-text-content"
            dir={dir}
        />
    );
}
