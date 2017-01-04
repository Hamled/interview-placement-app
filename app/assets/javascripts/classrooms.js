const Util = {
  classForScore: function(score) {
    if (score > 20) {
      return 'excellent-match';
    } else if (score > 15) {
      return 'good-match';
    } else if (score > 9) {
      return 'mediocre-match';
    } else if (score) {
      return 'bad-match';
    } else {
      return undefined;
    }
  },
  removeScoreClasses: function(element) {
    element = $(element);
    element.removeClass('excellent-match');
    element.removeClass('good-match');
    element.removeClass('mediocre-match');
    element.removeClass('bad-match');
  }
}

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
      },
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
  }, {
    name: "Anita Borg",
    companies: {
      "Samsung": {
        interview_result: 4,
        student_ranking: 4
      },
      "Pivotal Labs": {
        interview_result: 5,
        student_ranking: 5
      }
    }
  }
];

// TODO: remove interview_results, since it's just redundant
const companies = [
  {
    name: "Samsung",
    slots: 1,
    interview_results: {
      "Ada Lovelace": 4,
      "Grace Hooper": 2,
      "Katherine Johnson": 5,
      "Anita Borg": 4
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
      "Katherine Johnson": 3,
      "Anita Borg": 5
    }
  }
];

$(document).ready(function() {
  const placement = new Placement({
    id: 545248419,
  });
  placement.fetch();
  const application = new PlacementView({
    model: placement,
    el: '#application'
  })
  application.render();
});
