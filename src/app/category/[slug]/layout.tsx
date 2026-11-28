import React from 'react';

interface CategoryLayoutProps {
  children: React.ReactNode;
}

export default function CategoryLayout({
  children,
}: CategoryLayoutProps) {
  return <>{children}</>;
}

