import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

const ShareButton = ({ title }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch {
                // fall through to copy
            }
        }

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard unavailable
        }
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            aria-label={copied ? 'Link copied' : 'Share publication'}
            className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 ${
                copied
                    ? 'border-[var(--text-orange-500)] bg-[var(--primary-100)] text-[var(--text-orange-500)] scale-105'
                    : 'border-[var(--primary-100)] text-[var(--color-11)] hover:text-[var(--text-orange-500)] hover:border-[var(--text-orange-500)] hover:bg-white hover:shadow-sm'
            }`}
        >
            {copied ? <Check size={14} strokeWidth={2.5} /> : <Share2 size={14} />}
        </button>
    );
};

export default ShareButton;
