import React, { useState } from 'react';
import { Button } from '@tremor/react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export default function CopyToClip({ text }) {
  const [copied, setCopied] = useState(false);

  const onCopy = (txt) => {
    copyToClipboard(txt);
    setCopied(txt);
    setTimeout(() => {
      setCopied(null);
    }, 3000);
  }

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div>
      <div className="url-wrapper">{text}</div>
        <Button variant="light" onClick={() => onCopy(text)} size="xs" icon={DocumentDuplicateIcon}></Button>
        {' '}{copied === text && <span>Copied</span>}
    </div>
  );
}