import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useAuth,
  useFormikFields,
  useMountEffect,
  useUpdateEffect,
} from '@hooks';
import ApsFileUpload from '@components/ApsFileUpload';
import { fieldValidations } from '@utils';
import {
  setFormModalAction,
  updateUserAction,
  userGetOneAction,
} from '../../../../store/modules/settings';

const usePersonalDetails = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const selectedUser = useSelector((state) => state.settings.selectedUser);
  const processing = useSelector((state) => state.settings.processing);
  const loading = useSelector((state) => state.settings.loading);
  const currentModal = useSelector((state) => state.settings.currentModal);
  const [selectedFile, setSelectedFile] = useState(null);

  const formik = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Name',
        name: 'name',
        gridItem: true,
        validations: fieldValidations.required,
      },
      {
        id: '2',
        label: 'Email',
        name: 'email',
        gridItem: true,
        InputProps: {
          autoComplete: 'off  ',
        },
        validations: fieldValidations.emailRequired,
      },
      {
        id: '3',
        label: 'Telephone',
        name: 'telephone',
        gridItem: true,
        inputProps: { maxLength: 20 },
        validations: fieldValidations.required,
      },

      {
        id: '4',
        gridItem: true,
        field: 'custom',
        children: (
          <ApsFileUpload
            required
            label="Upload your profile picture"
            accept="image/png,image/jpg,image/jpeg,image/gif"
            onChange={(file) => {
              formik.form.setFieldValue('photo', file);
              setSelectedFile(file);
            }}
            value={selectedFile}
            maxSizeMB={5}
          />
        ),
      },
    ],
  });

  useMountEffect({
    effect: () => {
      auth.user?.id_user &&
        dispatch(userGetOneAction({ id_user: auth.user.id_user }));
    },
    deps: [auth.user?.id_user],
  });

  /* Update and clear the formik form */
  useUpdateEffect(() => {
    if (selectedUser) {
      formik.form.setValues({ ...selectedUser }); //validate whether the password should be displayed
    } else {
      formik.form.resetForm();
      formik.form.validateForm({});
    }
    setSelectedFile(selectedUser?.file);
  }, [selectedUser]);

  const handleOnclick = () => {
    if (selectedUser && selectedUser.id_user) {
      dispatch(
        updateUserAction({
          ...formik.form.values,
        })
      );
    }
  };

  const setCurrentModal = (modalName) =>
    dispatch(setFormModalAction(modalName));

  const onClose = () => {
    setCurrentModal('');
  };

  return {
    handleOnclick,
    setCurrentModal,
    onClose,
    selectedUser,
    formik,
    currentModal,
    processing,
    loading,
  };
};

export default usePersonalDetails;
