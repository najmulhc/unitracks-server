const gradeSetter = (grade: number) => {
  switch (true) {
    case grade >= 80:
      return {
        grade: "A+",
        GPA: 4.0,
      };
    case grade >= 75 && grade <= 79:
      return {
        grade: "A",
        GPA: 3.75,
      };
    case grade >= 70 && grade <= 74:
      return {
        grade: "A-",
        GPA: 3.5,
      };
    case grade >= 65 && grade <= 69:
      return {
        grade: "B+",
        GPA: 3.25,
      };
    case grade >= 60 && grade <= 64:
      return {
        grade: "B",
        GPA: 3.0,
      };
    case grade >= 55 && grade <= 59:
      return {
        grade: "C+",
        GPA: 2.75,
      };
    case grade >= 50 && grade <= 54:
      return {
        grade: "C",
        GPA: 2.5,
      };
    case grade >= 45 && grade <= 49:
      return {
        grade: "C-",
        GPA: 2.25,
      };
    case grade >= 40 && grade <= 44:
      return {
        grade: "D",
        GPA: 2,
      };
    default:
      return {
        grade: "F",
        GPA: 0,
      };
  }
};

export default gradeSetter;
