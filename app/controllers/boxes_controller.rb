class BoxesController < ApplicationController
  respond_to :html, :json
  require 'open-uri'

  def create
    @box = Box.new(params[:box])
    if @box.save
      @box.trips.build(month: Date.today.strftime('%Y-%m-01'), quantity: @box.frequency, retired: 0).save
      flash[:success] = "Box #{@box.uid} added!"
      redirect_to current_user
    else
      render 'boxes/new'
    end
  end

  def import
    count = Box.import(params[:file])
    if count > 0
      flash[:success] = "#{count} boxes updated!"
    else
      flash[:error] = "No boxes modified..."
    end
    redirect_to root_path
  end

  def index
    @title = "Eco Reboxes"
    @export = Box.order(:uid)
    @boxes = Box.page(params[:page]).per(100)
    respond_to do |format|
      format.html
      format.csv { send_data @export.to_csv }
      format.json { render json: BoxesDatatable.new(view_context) }
    end
  end

  def new
    @box = Box.new
    @companies = Company.all
    company_id = !params['/add'].nil? ? params['/add'][:company_id] : 1
    @selected_company = company_id.to_i  
  end

  def show
    @box = Box.find(params[:id])
    cb = OrderDetail.find_all_by_box_id(@box.id).map{ |d| d.cb_price }
    @cb = cb.inject(:+).to_f / cb.size
  end

  def track
    @page = "http://ecorebox.herokuapp.com/boxes/#{params[:uid].upcase}"
    uri = URI.parse("#{@page}")
    @result = Net::HTTP.start(uri.host, uri.port) { |http| http.get(uri.path) }.code
  end

  def update
    @box = Box.find(params[:id])
    @box.update_attributes(params[:box])
    respond_with @box
  end

end