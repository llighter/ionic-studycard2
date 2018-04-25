import { Category } from "./category";
import { AngularFirestoreCollection } from "angularfire2/firestore";

export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    categories?: AngularFirestoreCollection<Category>;
  }