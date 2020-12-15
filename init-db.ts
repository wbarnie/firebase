
import {COURSES, findLessonsForCourse} from './db-data';

import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCenoeOAL4UI_chQUuyWEabmIjOARnOWH4',
     authDomain: 'fir-course-de625.firebaseapp.com',
     databaseURL: 'https://fir-course-de625.firebaseio.com',
     projectId: 'fir-course-de625',
     storageBucket: 'fir-course-de625.appspot.com',
     messagingSenderId: '433291498896',
     appId: '1:433291498896:web:a6b2e8adbb98cbb6f90f15',
     measurementId: 'G-QRT8TRVTK6'
};

console.log('Uploading data to the database with the following config:\n');

console.log(JSON.stringify(config));

console.log('\n\n\n\nMake sure that this is your own database, so that you have write access to it.\n\n\n');

const app = firebase.initializeApp(config);
const db = firebase.firestore();

main().then(r => console.log('Done.'));

async function uploadData() {
  const courses = await db.collection('courses');
  for (let course of Object.values(COURSES)) {
    const newCourse = removeId(course);
    const courseRef = await courses.add(newCourse);
    const lessons = await courseRef.collection('lessons');
    const courseLessons = findLessonsForCourse(course['id']);
    console.log(`Uploading course ${course['titles']['description']}`);
    for (const lesson of courseLessons) {
      const newLesson = removeId(lesson);
      await lessons.add(newLesson);
    }
  }
}

function removeId(data: any) {
  const newData: any = {...data};
  delete newData.id;
  return newData;
}

async function main(){
  try {
    console.log('Start main...\n\n');
    await uploadData();
    console.log('\n\nClosing Application...');
    await app.delete();
  }catch (e) {
    console.log('Data upload failed, reason:', e, '\n\n');
  }
}

