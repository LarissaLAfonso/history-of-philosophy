export function processTextWithGlossary(text, glossaryData) {
        if (!text || !glossaryData) return text;
        
        let processedText = text;
        
        // Sort glossary terms by length (longest first) to avoid partial matches
        // This is crucial for compound terms like "modal logic" vs "logic"
        const sortedTerms = Object.keys(glossaryData).sort((a, b) => b.length - a.length);
        
        sortedTerms.forEach(term => {
            // Escape special regex characters
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // For compound words, we want to match the exact phrase
            // Use word boundaries for both single and multi-word terms
            const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
            
            // Only replace if not already wrapped in a glossary-term span, <b>, or <em> tags
            processedText = processedText.replace(regex, (match, offset, string) => {
                // Check if this match is already inside a glossary-term span
                const beforeMatch = string.substring(0, offset);
                const afterMatch = string.substring(offset + match.length);
                
                // Count opening and closing spans before this match
                const openSpans = (beforeMatch.match(/<span[^>]*class="[^"]*glossary-term[^"]*"/g) || []).length;
                const closeSpans = (beforeMatch.match(/<\/span>/g) || []).length;
                
                // If we're inside a span, don't replace
                if (openSpans > closeSpans) {
                    return match;
                }
                
                // Check if the term is inside <b> or <em> tags
                // Look for the closest opening tag before our match
                const tagsBefore = beforeMatch.match(/<\/?(?:b|em|strong|i)\b[^>]*>/gi) || [];
                const tagsAfter = afterMatch.match(/<\/?(?:b|em|strong|i)\b[^>]*>/gi) || [];
                
                // Track which tags are currently open
                let openTags = [];
                tagsBefore.forEach(tag => {
                    const isClosing = tag.startsWith('</');
                    const tagName = tag.match(/<\/?(\w+)/)[1].toLowerCase();
                    
                    if (isClosing) {
                        // Remove the tag from openTags if it's being closed
                        openTags = openTags.filter(t => t !== tagName);
                    } else {
                        // Add the tag to openTags if it's being opened
                        openTags.push(tagName);
                    }
                });
                
                // Check if we're currently inside b, em, strong, or i tags
                const isInsideFormattingTag = openTags.some(tag => 
                    ['b', 'em', 'strong', 'i'].includes(tag)
                );
                
                // If we're inside formatting tags, don't create a glossary tooltip
                if (isInsideFormattingTag) {
                    return match;
                }
                
                return `<span class="glossary-term" data-definition="${glossaryData[term].replace(/"/g, '&quot;')}">${match}</span>`;
            });
        });
        
        return processedText;
    }