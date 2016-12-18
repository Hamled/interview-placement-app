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

const companies = [
  {
    name: "Samsung",
    slots: 1,
    interview_results: {
      "Ada Lovelace": 4,
      "Grace Hooper": 2,
      "Katherine Johnson": 5
    }
  }, {
    name: "City of Seattle Open Data",
    slots: 1,
    interview_results: {
      "Ada Lovelace": 3,
      "Grace Hooper": 5,
      "Katherine Johnson": 4
    }
  }, {
    name: "Pivotal Labs",
    slots: 2,
    interview_results: {
      "Ada Lovelace": 5,
      "Grace Hooper": 1,
      "Katherine Johnson": 3
    }
  }
];

$(document).ready(function() {
  const unplacedStudents = new StudentCollection(students);
  const companyCollection = new CompanyCollection(companies);
  const application = new PlacementView({
    unplacedStudents: unplacedStudents,
    model: companyCollection,
    el: '#application'
  })
  application.render();
});
