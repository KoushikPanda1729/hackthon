
import { CategoryEnum } from "../enums/categoryEnum";
import { Answer } from "./Answer";

export interface QuizData {
  _id: string;
  question: string;
  answers: Answer[];
  category: CategoryEnum;
}
