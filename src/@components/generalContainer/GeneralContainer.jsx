import { useLayoutEffect, useState } from 'react';
import {
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import MoreMenu from './MoreMenu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { generateBreadcrumb } from '@utils/utils';
import SkeletonHeaderContainer from './SkeletonHeaderContainer';
import SkeletonBodyContainer from './SkeletonBodyContainer';
import { useSelector } from 'react-redux';

const titlePropsLocal = {
  variant: 'h1',
  color: 'blackLight.main',
};

const subtitlePropsLocal = {
  variant: 'subtitle1',
  color: 'text.subtitle',
};

const flexProps = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'left',
};

/**
 * @title {string} Título de la página.
 * @titleProps {object} objeto de propiedades para modificar el título.
 * @subtitle {string} Subtítulo de la página.
 * @subtitleProps {string} Subtítulo de la página.
 * @actions {array} es un array de objetos que se mostraran como acciones.
 * @container {components} contenido de la página.
 * @disableBreadcrumb {boolean} deshabilita el breadcrumb.
 *
 * ---------------------EJEMPLO DE USO---------------------
 * <GeneralContainer
 *  title='Dashboard'
 *  subtitle='Subtitulo del dashboard'
 *  backFunction='history.push('/dashboard')'
 *  actions=[
  {
    id: 1,
    icon: <PrintIcon fontSize="small" />,
    title: 'Imprimir',
    onClick: () => console.log('Imprimir'),
  },
  {
    id: 2,
    icon: <CloudDownloadIcon fontSize="small" />,
    title: 'Descargar',
    onClick: () => console.log('Descargar'),
  },
]
 *  container={<div>Contenido de la página</div>}
 *  disableBreadcrumb={false}
 * />
 * --------------------------------------------------------
 */

const GeneralContainer = ({
  title = 'Title',
  titleProps,
  subtitle,
  subtitleProps,
  buttonProps,
  actions,
  container,
  backFunction = null,
  backTitle = 'Regresar',
  skeletonHeader = false,
  skeletonBody = false,
  metaContent = null,
  disableBreadcrumb = false,
  // ...props
}) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const lastLocation = location?.substring(0, location.lastIndexOf('/'));
  /* Get loading values from redux */
  const loadingHeader = useSelector(
    (state) => state.main.mainView.loadingHeader
  );
  const loadingBody = useSelector((state) => state.main.mainView.loadingBody);
  const [breadcrumb, setBreadcrumb] = useState([]);

  useLayoutEffect(() => {
    if (location && !disableBreadcrumb)
      setBreadcrumb(generateBreadcrumb(location));
  }, [location, disableBreadcrumb]);

  const handleBackFunction = () => {
    backFunction ? backFunction() : navigate(lastLocation);
  };

  return (
    <div style={{ /* height: '100vh' */ height: 'auto' }}>
      {skeletonHeader || loadingHeader ? (
        <SkeletonHeaderContainer />
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: 'auto',
            marginBottom: '24px',
          }}
        >
          <div>
            <div style={flexProps}>
              {!disableBreadcrumb && breadcrumb.length ? (
                <Breadcrumbs maxItems={2}>
                  {breadcrumb?.map((item) => (
                    <Link
                      component={NavLink}
                      key={item?.description}
                      underline="hover"
                      color="inherit"
                      to={item?.link || '#'}
                      variant="overline"
                    >
                      {item?.description}
                    </Link>
                  ))}
                  <Typography variant="overline" color="primary">
                    {title}
                  </Typography>
                </Breadcrumbs>
              ) : null}
              <Typography
                {...titlePropsLocal}
                {...titleProps}
                children={title}
              />
            </div>
            {subtitle && (
              <Typography
                {...subtitlePropsLocal}
                {...subtitleProps}
                children={subtitle}
              />
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'right',
            }}
          >
            {metaContent && metaContent}
            {backFunction && !isSm ? (
              <Button
                sx={{ maxHeight: '36px' }}
                onClick={() => handleBackFunction()}
                variant={'outlined'}
                startIcon={<ArrowBackIcon />}
              >
                {backTitle}
              </Button>
            ) : (
              backFunction &&
              isSm && (
                <IconButton
                  sx={{ maxHeight: '40px' }}
                  onClick={() => handleBackFunction()}
                >
                  <ArrowBackIcon color="primary" />
                </IconButton>
              )
            )}
            {actions?.length ? <MoreMenu actions={actions} /> : null}
          </div>
        </div>
      )}
      {skeletonBody || loadingBody ? (
        <SkeletonBodyContainer />
      ) : (
        <div style={{ width: '100%', height: '100%' }}>
          {container}
          <div style={{ height: '50px' }}></div>
          {buttonProps?.text && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <LoadingButton
                sx={{
                  borderRadius: '36px',
                  position: 'fixed',
                  bottom: '50px',
                  height: '56px',
                }}
                color="primary"
                //loading
                loadingPosition="start"
                startIcon={<SaveIcon sx={{ marginLeft: '4px' }} />}
                variant="contained"
                {...buttonProps}
              >
                {buttonProps.text || 'Guardar'}
              </LoadingButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeneralContainer;
