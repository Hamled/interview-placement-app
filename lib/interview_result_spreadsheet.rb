class InterviewResultSpreadsheet < Spreadsheet
  attr_reader :data
  def populate
    @data = self.get_data("Form Responses 1!A:F")
  end
end
