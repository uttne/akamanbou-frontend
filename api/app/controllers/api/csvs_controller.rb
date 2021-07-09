class Api::CsvsController < ApplicationController
  def index
    render json: { status: 'SUCCESS' }
  end

  def show
    render json: { status: 'SUCCESS' }
  end
end
