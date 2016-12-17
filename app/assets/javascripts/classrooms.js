const students = [
  {
    name: "Ada Lovelace",
    companies: {
      "Samsung": {
        interview_result: 4,
        student_ranking: 5
      },
      "City of Seattle Open Data": {
        interview_result: 5,
        student_ranking: 1
      },
      "Pivotal Labs": {
        interview_result: 3,
        student_ranking: 4
      }
    }
  }, {
    name: "Grace Hooper",
    companies: {
      "Samsung": {
        interview_result: 5,
        student_ranking: 1
      },
      "City of Seattle Open Data": {
        interview_result: 3,
        student_ranking: 4
      },
      "Pivotal Labs": {
        interview_result: 2,
        student_ranking: 5
      }
    }
  }, {
    name: "Katherine Johnson",
    companies: {
      "Samsung": {
        interview_result: 5,
        student_ranking: 5
      },
      "City of Seattle Open Data": {
        interview_result: 5,
        student_ranking: 4
      },
      "Pivotal Labs": {
        interview_result: 4,
        student_ranking: 1
      }
    }
  }
];

$(document).ready(function() {
  const unplacedStudents = new StudentCollection(students);
  const unplacedStudentsView = new UnplacedStudentsView({
    model: unplacedStudents
  });
  unplacedStudentsView.render();
});
