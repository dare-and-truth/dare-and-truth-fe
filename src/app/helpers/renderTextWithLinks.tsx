// Function to detect URLs in text and make them clickable
export const renderTextWithLinks = (text: string) => {
  if (!text) return null;

  // More comprehensive URL regex that handles various URL formats
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  // Create an array to hold the parts of the message
  const parts = [];
  let lastIndex = 0;
  let match;

  // Find all matches and process them
  while ((match = urlRegex.exec(text)) !== null) {
    // Add the text before the URL
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index),
      });
    }

    // Add the URL
    const url = match[0];
    const href = url.startsWith('www.') ? `https://${url}` : url;

    parts.push({
      type: 'link',
      content: url,
      href: href,
    });

    lastIndex = match.index + url.length;
  }

  // Add any remaining text after the last URL
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }

  // Render the parts
  return parts.map((part, index) => {
    if (part.type === 'text') {
      return <span key={index}>{part.content}</span>;
    } else {
      return (
        <a
          key={index}
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-500 dark:text-blue-300"
          onClick={(e) => e.stopPropagation()}
        >
          {part.content}
        </a>
      );
    }
  });
};
