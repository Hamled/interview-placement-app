class StudentRankingSpreadsheet < Spreadsheet
  attr_reader :data
  def populate
    @data = self.get_data("Form Responses 1!A:H")
  end
end
