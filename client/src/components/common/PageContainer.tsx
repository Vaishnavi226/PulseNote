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
      maxWidth={readingMeasure ? 'md' : false}
      sx={{
        py: { xs: 3, md: 4 },
        px: { xs: '16px', sm: '24px', md: '64px' },
        maxWidth: readingMeasure ? '820px !important' : '1400px !important',
        mx: 'auto',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Container>
  );
};

