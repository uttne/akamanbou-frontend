require 'csv'
class Api::CsvsController < ApplicationController
  def show
    puts 'api call'
    csv_string = CSV.generate do |csv|
      csv << %w[col_1 col_2]
      csv << %w[1 2]
    end
    render plain: csv_string
  end
end
