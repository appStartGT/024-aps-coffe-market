export const getCampusById = (data) => {
  return {
    ...data,
    email: data.email || '',
    google_analytics_tag: data.google_analytics_tag || '',
    api_secret: data.api_secret || '',
    phone_number: data.phone_number || '',
    active: data.active || false,
  };
};

export const updateCampus = (data) => {
  return {
    ...data,
    email: data.email || null,
    google_analytics_tag: data.google_analytics_tag || null,
    api_secret: data.api_secret || null,
    phone_number: data.phone_number || null,
    active: data.active || false,
  };
};

export const getCampusGrades = (data) => {
  return data;
};

export const activateCampusGrade = (data) => {
  return {
    id_campus_grade: data.id_campus_grade,
  };
};

export const activateCampusGradeAfter = (data, oldData) => {
  return oldData.map((d) => {
    if (d.id_campus_grade == data.id_campus_grade) {
      return data;
    } else {
      return d;
    }
  });
};
