import { useMountEffect } from '@hooks';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  subjectListAction,
  setSubjectAction,
} from '../../../../../app/store/modules/subject';
import { permissionCreateOrUpdateAction } from '../../../../../app/store/modules/permission';
import { Actions, Subjects } from '@config/permissions';

const useRolPermissions = () => {
  /* Hooks */
  const dispatch = useDispatch();

  /* States */
  const [searchListPermissions, setSearchListPermissions] = useState([]);
  const [searchListSubjects, setSearchListSubjects] = useState(null);
  const [resetValuePermissions, setResetValuePermissions] = useState(false);

  /* Selectors */
  const selectedRole = useSelector((state) => state.role.selectedRole);
  const subjectList = useSelector((state) => state.subject.subjectList);
  const selectedSubject = useSelector((state) => state.subject.selectedSubject);
  const selectedPermission = useSelector(
    (state) => state.permission.selectedPermission
  );
  const permissionList = useSelector((state) => state.subject.actions);
  const permissionProcessing = useSelector(
    (state) => state.permission.processing
  );
  const loadingPermissions = useSelector(
    (state) => state.permission.processing
  );

  /* useEffects */
  useMountEffect({
    effect: () => dispatch(subjectListAction()),
  });

  /* Functions */
  const handleListPermission = (subject) => {
    // dispatch(
    //   permissionListAction({
    //     id_role: selectedRole.id_role,
    //     id_subject: subject.id_subject,
    //   })
    // );
    dispatch(setSubjectAction(subject));
    setSearchListPermissions(null);
    setResetValuePermissions(true);
  };

  const handleUpdatePermission = (permission) => {
    // //update or create permission
    dispatch(permissionCreateOrUpdateAction(permission));
    // setSearchListPermissions(null);
  };

  const handleSubjectIsReseted = () => {
    setResetValuePermissions(false);
  };

  /* Constants */
  const propsSubjectList = {
    list: searchListSubjects || subjectList,
    onClick: handleListPermission,
    handleSelected: (subject) =>
      subject?.id_subject === selectedSubject?.id_subject,
  };

  const propsPermissionList = {
    list: searchListPermissions || permissionList,
    checkSelectedItmes: (item) => {
      if (!selectedRole?.permissions) return false;
      const subject = selectedRole?.permissions.find(
        (permission) => permission.id_subject == selectedSubject.id_subject
      );
      if (!subject) return false;
      return subject.actions.includes(item);
    },
    onClick: handleUpdatePermission,
    handleDisabled: (permission) => {
      return (
        permissionProcessing &&
        +permission?.id_permission === +selectedPermission?.id_permission
      );
    },
    loading: loadingPermissions,
    screenName: selectedSubject?.name,
    can: {
      I: Actions.EDIT,
      a: Subjects.ROLE_PERMISSIONS,
    },
  };

  const propsSearchBarSubjects = {
    label: 'Busqueda de pantallas.',
    color: 'primary',
    type: 'text',
    searchList: subjectList,
    searchKey: 'name',
    searchResults: (results) => setSearchListSubjects(results),
  };

  const propsSearchBarPermissions = {
    label: 'Busqueda de permisos por nombre.',
    color: 'primary',
    type: 'text',
    searchList: permissionList,
    searchKey: 'name',
    resetText: resetValuePermissions,
    handleIsReseted: handleSubjectIsReseted,
    searchResults: (results) => setSearchListPermissions(results),
  };

  return {
    selectedSubject,
    propsSubjectList,
    propsPermissionList,
    propsSearchBarSubjects,
    propsSearchBarPermissions,
  };
};

export default useRolPermissions;
