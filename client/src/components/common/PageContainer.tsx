import React from 'react';
import { Container, ContainerProps } from '@mui/material';

interface PageContainerProps extends ContainerProps {
  children: React.ReactNode;
  readingMeasure?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  readingMeasure = false,
  sx,
  ...rest
}) => {
  return (
    <Container
      maxWidth={readingMeasure ? 'md' : 'xl'}
      sx={{
        py: { xs: 4, md: 6, lg: 8 },
        px: { xs: 2, sm: 4, md: 6 },
        maxWidth: readingMeasure ? '820px !important' : '1320px',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Container>
  );
};
