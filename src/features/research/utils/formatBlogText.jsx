/**
 * Lightweight inline markup for blog copy: **bold** and *italic*.
 */
export const formatBlogText = (text) => {
    if (!text) return null;

    const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const parts = text.split(pattern).filter((part) => part.length > 0);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={index} className="research-type-emphasis">
                    {part.slice(2, -2)}
                </strong>
            );
        }

        if (part.startsWith('*') && part.endsWith('*')) {
            return (
                <em key={index} className="research-type-italic">
                    {part.slice(1, -1)}
                </em>
            );
        }

        return part;
    });
};
