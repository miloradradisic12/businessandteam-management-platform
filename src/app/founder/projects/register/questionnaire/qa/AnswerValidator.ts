
export default class RegistrationAnswerValidator {
    isValid(question): boolean {
      if (question.answer) {
        if (question.question_type === 'text') {
          return !!question.answer.response_text;
        }
  
        if (question.question_type === 'doc_drawing') {
          return !!question.answer.diagram;
        }
  
        if (question.question_type === 'doc_spreadsheet') {
          return !!question.answer.spreadsheet;
        }

        if (question.question_type === 'ocr') {
          return !!question.answer.ocr;
        }

        if (question.question_type === 'companysearch') {
          return !!question.answer.response_text;
        }
  
        if (question.question_type === 'image') {
          return true;
        }

        if (question.question_type === 'ppt') {
          return true;
        }

        if(question.question_type === 'date'){
          return true;
        }

        if(question.question_type === 'radio'){
          return true;
        }

        if(question.question_type === 'boolean'){
          return true;
        }

        if(question.question_type === 'checkbox'){
          return true;
        }

        if(question.question_type === 'multiselect'){
          return true;
        }

        if(question.question_type === 'list'){
          return true;
        }
      }
  
      return false;
    }
  }
  