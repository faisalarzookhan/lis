'use client';

import React from 'react';

export default function RootHtml({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {children}
    </html>
  );
}
