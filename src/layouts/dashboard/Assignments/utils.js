import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { MyContext } from '../../../utils/context';
import { db } from '../../../firebase/initFirebase';

export const getAssignments = (classSelected, setAssignments) => {
  const docRef = doc(db, 'classes', classSelected);
  getDoc(docRef).then((classDetails) => {
    console.log(classDetails?.data());
    setAssignments(classDetails?.data()?.assignments);
  });
};

export const getClasses = (setClasses, auth) => {
  const docRef = doc(db, 'users', auth?.currentUser?.email);
  getDoc(docRef).then((docSnap) => {
    console.log(docSnap.data());
    setClasses(docSnap?.data()?.classes);
  });
};
