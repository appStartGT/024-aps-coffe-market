import React from 'react';
import { useLocation, matchRoutes } from 'react-router-dom';
// import { singletonHook } from 'react-singleton-hook';
import _mainNavigation from '../app/main/routes';
import _subNavigation from '../app/main/modules/routes';
import Can from '@components/permissions/Can';
import { permissions } from '@utils';

const childrenNavigation = (children, firstLevel) => {
  return children.reduce((acchild, child) => {
    let path = child.path;
    if (path && path !== '*') {
      let subRoute = `${firstLevel}/${path}`;
      acchild.push(subRoute);
      if (child.children) {
        let secondLevel = `${firstLevel}/${path}`;
        let subNavigation = childrenNavigation(child.children, secondLevel);
        acchild.push(...subNavigation);
      }
    }
    return acchild;
  }, []);
};

const generateNavigation = (routes) => {
  return [...routes].reduce((acc, route) => {
    let path = route.path;
    let objectName = '';
    if (path !== '*') {
      if (/(^[/])([A-Za-z])/.test(path)) {
        path = path.split('/')[1];
      }
      objectName = path;
      path = `/${path}`;
      Object.assign(acc, { [objectName]: [path] });
      if (route.children) {
        const prefix = path;
        let subNavigation = childrenNavigation(route.children, prefix);
        Object.assign(acc, { [objectName]: [path, ...subNavigation] });
        generateNavigation(route.children);
      }
    }
    return acc;
  }, {});
};

const mapRoutes = (routes) => {
  return [...routes].map((route) => {
    let element = undefined;
    if (route.element) {
      if (route.to) {
        element = <route.element to={route.to} />;
      } else if (route.name) {
        element = (
          <Can
            I={route.name}
            a={permissions.Subjects.MAIN_NAVIGATION}
            passThrough
          >
            {(allowed) => (allowed ? <route.element /> : <div>No access</div>)}
          </Can>
        );
      } else {
        element = <route.element />;
      }
    }
    return {
      ...route,
      element,
      children: route.children ? mapRoutes(route.children) : [],
    };
  });
};

const currentPath = () => {
  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location);

  return route.path;
};
// const setRoutes =()=>{}

const state = {
  mainNavigation: mapRoutes(_mainNavigation),
  subNavigation: mapRoutes(_subNavigation),
  appRoutes: generateNavigation([..._mainNavigation, ..._subNavigation]),
  currentPath,
};

//TODO: usar variables de entorno para devolver el sigleton
// const useRouter = singletonHook(state, () => {
//   return state;
// });

const useRouter = () => state;
export default useRouter;
