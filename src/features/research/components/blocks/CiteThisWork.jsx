import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * The BibTeX block that closes a publication.
 *
 * Copying is the only thing anyone does with a citation, so the button is the
 * primary affordance and the entry is selectable text underneath it rather than
 * an image of one.
 */
const CiteThisWork = ({ heading = 'Cite this work', bibtex }) => {
    const [copied, setCopied] = useState(false);

    if (!bibtex) return null;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(bibtex);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard access can be refused; the text is selectable either way.
            setCopied(false);
        }
    };

    return (
        <section className="bt-cite" aria-label={heading}>
            <div className="bt-cite-head">
                <h3 className="bt-cite-title">{heading}</h3>
                <button type="button" className="bt-cite-copy" onClick={copy}>
                    {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                    {copied ? 'Copied' : 'Copy BibTeX'}
                </button>
            </div>
            <pre className="bt-cite-body">
                <code>{bibtex}</code>
            </pre>
        </section>
    );
};

export default CiteThisWork;
