import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as LogoLight } from '../../resources/icon-light.svg';
import { ReactComponent as LogoWithTextLight } from '../../resources/logo-light.svg';

const useStyle = makeStyles(theme => ({
  toolbar: {
    borderBottom: '1px solid #1e1e1e',
    paddingTop: theme.spacing(1.5),
    paddingLeft: (props: { isSidebarOpen: boolean; isSmall: boolean }) =>
      props.isSmall ? 0 : props.isSidebarOpen ? theme.spacing(2) : theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: '#000',
    borderRadius: (props: { isSmall: boolean }) => (props.isSmall ? 40 : 0),
    margin: (props: { isSidebarOpen: boolean; isSmall: boolean }) =>
      props.isSmall && !props.isSidebarOpen ? 5 : 0,
  },
  logo: {
    height: '32px',
    width: 'auto',
  },
  button: {
    padding: (props: { isSidebarOpen: boolean; isSmall: boolean }) =>
      props.isSmall && !props.isSidebarOpen ? 0 : '6px 8px',
    minWidth: (props: { isSidebarOpen: boolean; isSmall: boolean }) =>
      props.isSmall && !props.isSidebarOpen ? 55 : 64,
  },
}));

export interface HeadlampButtonProps {
  /** If the sidebar is fully expanded open or shrunk. */
  open: boolean;
  /** Only show if we are in mobile breakpoint and not open. */
  mobileOnly?: boolean;
  /** Called when sidebar toggles between open and closed. */
  onToggleOpen: () => void;
}

export default function HeadlampButton({ open, onToggleOpen, mobileOnly }: HeadlampButtonProps) {
  const isSmall = useMediaQuery('(max-width:600px)');
  const classes = useStyle({ isSidebarOpen: open, isSmall: isSmall });
  const { t } = useTranslation('sidebar');

  if (mobileOnly && (!isSmall || (isSmall && open))) {
    return null;
  }

  return (
    <div className={classes.toolbar}>
      <Button
        onClick={onToggleOpen}
        className={classes.button}
        aria-label={open ? t('Shrink sidebar') : t('Expand sidebar')}
      >
        <SvgIcon
          className={classes.logo}
          component={open ? LogoWithTextLight : LogoLight}
          viewBox="0 0 auto 32"
        />
      </Button>
    </div>
  );
}
