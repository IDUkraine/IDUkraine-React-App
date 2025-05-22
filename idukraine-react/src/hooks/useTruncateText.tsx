import { useCallback } from 'react';

export const useTruncateText = () => {
  // Original truncateText function for plain text (used for titles)
  const truncateText = useCallback(
    (text: string, maxWords: number = 20): string => {
      const words = text.split(' ');
      if (words.length <= maxWords) return text;
      return words.slice(0, maxWords).join(' ') + '...';
    },
    []
  );

  // New truncateHtml function for HTML content
  const truncateHtml = useCallback(
    (html: string, maxLength: number = 70): string => {
      // If the HTML string is empty or shorter than maxLength, return as is
      if (!html || html.length <= maxLength) return html;

      let result = '';
      let visibleCharCount = 0;
      let insideTag = false;
      let insideAttribute = false;
      let tagName = '';
      let tagContent = '';
      let tagStartIndex = -1;
      const openTags: string[] = [];

      // Parse the HTML character by character
      for (let i = 0; i < html.length; i++) {
        const char = html[i];
        const nextChar = html[i + 1];

        if (char === '<' && nextChar !== '/') {
          // Start of an opening tag
          insideTag = true;
          tagStartIndex = i;
          tagName = '';
          tagContent = '';
          continue;
        }

        if (insideTag) {
          if (char === '>') {
            // End of a tag
            insideTag = false;
            insideAttribute = false;
            // Check if it's a valid tag we want to keep (<a> or <strong>)
            if (
              tagName.toLowerCase() === 'a' ||
              tagName.toLowerCase() === 'strong'
            ) {
              result += html.slice(tagStartIndex, i + 1);
              openTags.push(tagName.toLowerCase());
            }
            continue;
          }

          if (char === '"' || char === "'") {
            insideAttribute = !insideAttribute;
          }

          if (!insideAttribute) {
            tagName += char;
          }
          tagContent += char;
          continue;
        }

        if (char === '<' && nextChar === '/') {
          // Start of a closing tag
          insideTag = true;
          tagStartIndex = i;
          tagName = '';
          tagContent = '';
          continue;
        }

        if (char === '>' && insideTag) {
          // End of a closing tag
          insideTag = false;
          const closingTag = tagContent.slice(1).toLowerCase();
          if (closingTag === 'a' || closingTag === 'strong') {
            result += html.slice(tagStartIndex, i + 1);
            // Remove the corresponding opening tag from the stack
            if (openTags[openTags.length - 1] === closingTag) {
              openTags.pop();
            }
          }
          continue;
        }

        // Count characters outside of tags and attributes
        if (!insideTag && !insideAttribute) {
          visibleCharCount++;
          if (visibleCharCount <= maxLength) {
            result += char;
          } else {
            // Stop adding characters once maxLength is reached
            break;
          }
        }
      }

      // Close any remaining open tags
      while (openTags.length > 0) {
        const tag = openTags.pop();
        result += `</${tag}>`;
      }

      // Add ellipsis if truncation occurred
      if (visibleCharCount > maxLength || html.length > result.length) {
        result += '...';
      }

      return result;
    },
    []
  );

  return { truncateText, truncateHtml };
};
